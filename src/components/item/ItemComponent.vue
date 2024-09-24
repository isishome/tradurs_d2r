<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { date } from 'quasar'
import type { Item } from 'src/types/item'
import { randImage } from 'src/types/item'
import { useGlobalStore } from 'stores/global-store'
import { useItemAddStore } from 'stores/item-add-store'
import { useItemStore } from 'stores/item-store'
import { useAccountStore } from 'stores/account-store'
import ModifierComponent from 'components/item/ModifierComponent.vue'
import CurrencyComponent from 'components/item/CurrencyComponent.vue'
import { clipboard } from 'src/composables/common'

type Props = {
  data: Item
  editable?: boolean
  loading?: boolean
  width?: number
  noMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
  loading: false,
  width: 360,
  noMore: false
})

const emit = defineEmits([
  'update-item',
  'delete-item',
  'update-favorite',
  'update-image'
])

const $q = useQuasar()
const router = useRouter()
const { t } = useI18n({ useScope: 'global' })

// store
const gs = useGlobalStore()
const ias = useItemAddStore()
const is = useItemStore()
const as = useAccountStore()

// variable
let timer: ReturnType<typeof setInterval>

// computed
const owner = computed(
  () => as.signed && props.data.user?.owner && props.data.statusCode === '002'
)
const quality = computed(() => props.data.quality)
const category = computed(() => props.data.category)
const itemType = computed(() => props.data.itemType)
const classType = computed(() => props.data.classType)
const detailType = computed(() => props.data.detailType)
const imageId = computed(
  () =>
    props.data.imageId ??
    (Object.keys(randImage).includes(category.value as string) ? 1 : undefined)
)
const imageType = computed(() => props.data.imageType)
const item = computed(() => props.data.item)
const imageCount = computed(() => randImage[category.value as string] ?? 0)
const findItem = computed(() =>
  category.value === 'gems'
    ? ias.gems.find((g) => g.value === item.value)
    : category.value === 'runes'
    ? ias.runes.find((r) => r.value === item.value)
    : quality.value === 'set'
    ? ias.setItems(category.value).find((s) => s.value === item.value)
    : quality.value === 'unique'
    ? ias.uniques(category.value).find((u) => u.value === item.value)
    : quality.value === 'runewords'
    ? ias.runewords().find((rw) => rw.value === item.value)
    : category.value === 'misc'
    ? ias.misc.find((m) => m.value === item.value)
    : category.value === 'weapons'
    ? ias
        .weapons(itemType.value, classType.value)
        .find((w) => w.value === detailType.value)
    : category.value === 'armor'
    ? ias
        .armor(itemType.value, classType.value)
        .find((a) => a.value === detailType.value)
    : undefined
)
const name = computed(
  () =>
    props.data.name ||
    [...ias.nameAffixes, ...ias.names]
      .filter((ns) => props.data.names?.includes(ns.id))
      .map((ns) => ns.label)
      .join(' ')
      .trim() ||
    findItem.value?.label
)
const detailName = computed(
  () =>
    ias.names.find((n) => n.value === detailType.value)?.label ??
    ias.names.find((n) => n.value === itemType.value)?.label ??
    ias.category().find((n) => n.value === category.value)?.label
)
const runewordsRecipe = computed(() =>
  quality.value === 'runewords'
    ? ias
        .runewordsRecipes(item.value as number)
        .map((rwr) => Number(rwr.mappingId2))
    : []
)
const imgSrc = computed(() => (num?: number) => {
  const paths: Array<string | number | undefined> = []
  paths.push('/images', 'items')
  if (
    quality.value === 'unique' &&
    category.value === 'charms' &&
    item.value !== 21576
  ) {
    paths.push(quality.value)
    paths.push(category.value)
    paths.push(item.value)
  } else {
    paths.push(category.value)
    paths.push(findItem.value?.itemType)
    paths.push(findItem.value?.classType)
    paths.push(num ?? imageId.value ?? imageType.value ?? item.value)
  }

  return `${paths.filter((p) => !!p).join('/')}.webp`
})
const imageSwappable = computed(
  () =>
    props.editable && Object.keys(randImage).includes(category.value as string)
)

const exceptSwappable = computed(
  () =>
    !(
      quality.value === 'unique' &&
      category.value === 'charms' &&
      item.value !== 21576
    )
)
const now = ref<Date>(new Date())
const expireDateTime = computed(() =>
  date.addToDate(new Date(props.data.startDate as string), {
    minutes: (props.data.progressTime ?? 0) + (props.data.addProgressTime ?? 0)
  })
)
const remainTime = computed(() =>
  date.getDateDiff(expireDateTime.value, now.value, 'seconds')
)

const hours = computed(() =>
  Math.floor(Math.max(remainTime.value / 3600, 0))
    .toString()
    .padStart(2, '0')
)
const minutes = computed(() =>
  Math.floor(Math.max((remainTime.value % 3600) / 60, 0))
    .toString()
    .padStart(2, '0')
)

const seconds = computed(() =>
  Math.floor(Math.max((remainTime.value % 3600) % 60, 0))
    .toString()
    .padStart(2, '0')
)

// func
const updateImage = (val: number) => {
  emit('update-image', val)
}

const start = () => {
  is.startAuction(props.data.id as number).then(() => {
    emit('update-item', props.data.id, t('item.auctionStarted'))
  })
}

const del = () => {
  $q.dialog({
    title: t('item.deleteItem'),
    message: t('item.confirmDeleteItem'),
    cancel: { label: t('btn.cancel'), color: 'grey', textColor: 'dark' },
    ok: { label: t('btn.delete'), color: 'red-10' },
    class: 'no-shadow',
    persistent: true
  })
    .onOk(() => {
      emit('delete-item', props.data.id)
    })
    .onCancel(() => {
      //
    })
}

const refresh = () => {
  emit('update-item', props.data.id)
}

const favorite = () => {
  is.favorite(props.data.id as number, !props.data.favorite).then(
    (status: boolean) => {
      emit('update-favorite', status)
    }
  )
}

const clone = () => {
  router.push({ name: 'clone', params: { id: props.data.id?.toString() } })
}

const shareItem = () => {
  const link = [document.location.origin, gs.lang, 'item', props.data.id].join(
    '/'
  )
  clipboard(link, t('item.itemLinkURL'))
}

const onTimer = () => {
  timer = setInterval(() => {
    if (props.editable || remainTime.value <= 0) clearInterval(timer)
    else now.value = new Date()
  }, 1000)
}

watch(
  () => [props.data.startDate, props.data.addProgressTime],
  ([val1, val2], [old1, old2]) => {
    if ((!!val1 && val1 !== old1) || (!!val2 && val2 !== old2)) onTimer()
  }
)

onMounted(() => {
  onTimer()
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div>
    <q-card v-if="!loading" bordered class="item" :style="`width:${width}px`">
      <q-card-section class="bg-brighten q-pa-sm">
        <div
          class="text-h6 text-center column"
          :style="`color:var(--quality-${data.quality})`"
        >
          <div
            class="text-overline row justify-center items-center q-gutter-x-xs"
          >
            <div class="text-white">
              {{ ias.platforms.find((p) => p.value === data.platform)?.label }}
            </div>
            <div>:</div>
            <div class="text-indigo-4">
              {{ ias.regions.find((r) => r.value === data.region)?.label }}
            </div>
            <template v-if="data.ladder">
              <div>:</div>
              <div class="text-positive">
                {{ t('base.ladder') }}
              </div>
            </template>
            <div>:</div>
            <div v-if="data.hardcore" class="text-red">
              {{ t('base.hardcore') }}
            </div>
            <div v-else class="text-blue">
              {{ t('base.softcore') }}
            </div>
          </div>
          <div v-if="data.quality !== 'normal'">
            {{ name }}
          </div>
          <div
            v-if="data.category !== 'misc'"
            :style="`color:var(--${
              ['normal', 'runewords'].includes(data.quality as string) &&
              (data.socket > 0 || data.ethereal)
                ? 'sockoreth'
                : ''
            })`"
          >
            {{ detailName }}
          </div>
        </div>
        <div
          v-if="!editable && !noMore"
          class="more no-hover absolute-right row items-center"
        >
          <q-btn
            aria-label="Tradurs More Button"
            dense
            flat
            icon="more_vert"
            :style="`color:var(--quality-${data.quality})`"
            :ripple="false"
            @click.stop="() => {}"
          >
            <q-menu
              auto-close
              class="no-shadow"
              cover
              anchor="top right"
              self="bottom start"
            >
              <q-item
                v-if="owner"
                clickable
                :to="{ name: 'add', params: { id: data.id } }"
              >
                <q-item-section side>
                  <q-icon name="edit" />
                </q-item-section>
                <q-item-section>{{ t('item.edit') }}</q-item-section>
              </q-item>
              <q-item v-if="owner" clickable @click="start">
                <q-item-section side>
                  <q-icon name="play_circle" />
                </q-item-section>
                <q-item-section>{{ t('item.auctionStart') }}</q-item-section>
              </q-item>
              <q-item v-if="!data.user?.owner" clickable @click="favorite">
                <q-item-section side>
                  <q-icon name="favorite" />
                </q-item-section>
                <q-item-section>{{
                  data.favorite ? t('item.unFavorite') : t('item.favorite')
                }}</q-item-section>
              </q-item>
              <q-item v-if="as.signed" clickable @click="clone">
                <q-item-section side>
                  <q-icon name="content_copy" />
                </q-item-section>
                <q-item-section>{{ t('item.clone') }}</q-item-section>
              </q-item>
              <q-item clickable @click="shareItem">
                <q-item-section side>
                  <q-icon name="share" />
                </q-item-section>
                <q-item-section>{{ t('item.share') }}</q-item-section>
              </q-item>
              <q-item v-if="owner" clickable @click="del">
                <q-item-section side>
                  <q-icon color="negative" name="delete" />
                </q-item-section>
                <q-item-section class="text-negative">{{
                  t('item.delete')
                }}</q-item-section>
              </q-item>
            </q-menu>
          </q-btn>
        </div>
      </q-card-section>
      <q-card-section>
        <template v-if="imageSwappable && exceptSwappable">
          <q-menu cover anchor="top end" fit>
            <div
              class="row justify-evenly items-center select-image-area q-py-md"
            >
              <q-btn
                v-for="(c, idx) in imageCount"
                :key="idx"
                aria-label="Tradurs Update Image Button"
                dense
                flat
                outline
                padding="0"
                v-close-popup
                @click="updateImage(c)"
              >
                <img
                  :src="imgSrc(c)"
                  class="item-image"
                  loading="lazy"
                  alt="Tradurs Item Image"
                />
              </q-btn>
            </div>
          </q-menu>
          <q-icon
            name="change_circle"
            class="absolute-top-right q-pt-md q-pr-md"
            size="md"
          />
        </template>
        <div class="row justify-center">
          <img
            :src="imgSrc()"
            class="item-image"
            loading="lazy"
            alt="Tradurs Item Image"
          />
        </div>
      </q-card-section>
      <q-card-section v-if="data.quality === 'runewords'" class="q-pt-none">
        <div class="row justify-center items-center">
          <div class="runewords-recipe row q-gutter-x-xs">
            <CurrencyComponent
              v-for="(rune, idx) in runewordsRecipe"
              :key="idx"
              category="runes"
              :item="rune"
              class="text-caption"
              style="max-width: 38px"
            />
          </div>
        </div>
      </q-card-section>
      <template v-if="data.modifiers.length > 0">
        <q-separator inset />
        <q-card-section v-if="data.modifiers.length > 0" class="modifiers">
          <ModifierComponent
            v-for="m in data.modifiers"
            :key="m.order"
            :data="m"
            :options="[...ias.modifiers, ...ias.skills]"
            :class="`m_${m.id}`"
          />
        </q-card-section>
      </template>
      <q-separator />
      <q-card-section>
        <div class="row justify-evenly items-center">
          <div
            v-if="!editable"
            class="row justify-start items-center q-gutter-x-sm d2r-chip bg-blue-grey-9"
          >
            <div class="q-ml-none row items-center">
              <template v-if="remainTime <= 0 && data.statusCode === '000'">
                <div>{{ t('item.processingAuctionEnd') }}</div>
                <q-btn
                  aria-label="Tradurs Refresh Button"
                  flat
                  dense
                  class="no-hover"
                  :ripple="false"
                  icon="refresh"
                  @click.stop="refresh"
                />
              </template>
              <div v-else>
                {{ ias.status(data.statusCode)?.[0]?.label }}
              </div>
            </div>
            <div v-if="remainTime > 0 && data.statusCode === '000'">
              {{ hours }}:{{ minutes }}:{{ seconds }}
            </div>
          </div>
          <CurrencyComponent
            :category="data.price.category"
            :item="data.price.item"
            :quantity="data.price?.winAmount ?? data.price?.startAmount"
            show-name
          />
        </div>
        <div class="absolute-right">
          <slot name="actions"></slot>
        </div>
      </q-card-section>
    </q-card>
    <q-card v-else bordered class="item" :style="`width:${width}px`">
      <q-card-section class="bg-brighten q-pa-md">
        <div class="column items-center q-gutter-y-sm">
          <q-skeleton type="rect" width="14%" height="12px" />
          <q-skeleton type="rect" width="50%" height="24px" />
          <q-skeleton type="rect" width="50%" height="24px" />
        </div>
      </q-card-section>
      <q-card-section class="row justify-center">
        <q-skeleton type="QAvatar" width="100px" height="100px" />
      </q-card-section>
      <q-separator inset />
      <q-card-section class="column items-center">
        <q-skeleton type="text" width="50%" />
        <q-skeleton type="text" width="50%" />
        <q-skeleton type="text" width="50%" />
      </q-card-section>
      <q-separator />
      <q-card-section class="column items-center">
        <q-skeleton type="text" width="40%" height="60px" />
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
.item {
  letter-spacing: 1px;
  max-width: 80vw;
  box-shadow: 1px 1px 1px 1px var(--q-dark-page);
  border-radius: 20px;
  &:deep(.more) {
    visibility: hidden;
  }
  &:deep(.more .q-btn) {
    padding: 10px;
  }
}

.item-image {
  max-height: 100px;
}

.select-image-area {
  width: 350px;
}

.runewords-recipe {
  opacity: 0.6;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 8px;
  border-radius: 10px;
  z-index: 1;
}

@media (hover: hover) {
  .runewords-recipe:hover {
    opacity: 1;
  }

  .item:hover:deep(.more) {
    visibility: visible;
  }
}

@media (max-width: 600px) {
  .item:deep(.more) {
    visibility: visible !important;
  }
}

.modifiers {
  &:deep(> div) {
    color: var(--quality-magic);
  }

  &:deep(:has(~ .m_3469)),
  :deep(.m_3469) {
    color: inherit;
  }
}
</style>
