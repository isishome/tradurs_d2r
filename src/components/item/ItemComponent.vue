<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { date } from 'quasar'
import type { Item } from 'src/types/item'
import { randImage } from 'src/types/item'
import { useItemAddStore } from 'stores/item-add-store'
import { useItemStore } from 'stores/item-store'
import ModifierComponent from 'components/item/ModifierComponent.vue'
import CurrencyComponent from 'components/item/CurrencyComponent.vue'

type Props = {
  data: Item
  editable?: boolean
  loading?: boolean
  width?: number
}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
  loading: false,
  width: 360
})

const emit = defineEmits(['started', 'update-image'])

// store
const ias = useItemAddStore()
const is = useItemStore()

// variable
let timer: ReturnType<typeof setInterval>

// computed
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
    : quality.value === 'normal'
    ? undefined
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
    paths.push(itemType.value)
    paths.push(classType.value)
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
    emit('started', props.data.id)
  })
}

const onTimer = () => {
  timer = setInterval(() => {
    if (props.editable || remainTime.value <= 0) clearInterval(timer)
    else now.value = new Date()
  }, 1000)
}

watch(
  () => props.data.startDate,
  (val, old) => {
    if (val !== old) onTimer()
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
      <q-card-section class="bg-brighten">
        <div
          class="text-h6 text-center column"
          :style="`color:var(--quality-${data.quality})`"
        >
          <div>
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
          v-if="!editable"
          class="more no-hover absolute-right row items-center"
        >
          <q-btn
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
              <template v-if="data.user?.owner && data.statusCode === '002'">
                <q-item
                  clickable
                  :to="{ name: 'add', params: { id: data.id } }"
                >
                  <q-item-section side>
                    <q-icon name="edit" />
                  </q-item-section>
                  <q-item-section>수정</q-item-section>
                </q-item>
                <q-item clickable @click="start">
                  <q-item-section side>
                    <q-icon name="play_circle" />
                  </q-item-section>
                  <q-item-section>경매 시작</q-item-section>
                </q-item>
              </template>
              <q-item clickable>
                <q-item-section side>
                  <q-icon name="favorite" />
                </q-item-section>
                <q-item-section>즐겨찾기</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section side>
                  <q-icon name="content_copy" />
                </q-item-section>
                <q-item-section>복사</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section side>
                  <q-icon name="share" />
                </q-item-section>
                <q-item-section>공유</q-item-section>
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
                dense
                flat
                outline
                padding="0"
                v-close-popup
                @click="updateImage(c)"
              >
                <img :src="imgSrc(c)" class="item-image" loading="lazy" />
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
          <img :src="imgSrc()" class="item-image" loading="lazy" />
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
            class="row justify-center items-center q-gutter-x-sm d2r-chip bg-blue-grey-9"
          >
            <div class="q-ml-none">
              {{
                remainTime <= 0 && data.statusCode === '000'
                  ? '경매 종료 처리 중'
                  : ias.status(data.statusCode)?.[0]?.label
              }}
            </div>
            <div v-if="remainTime > 0">
              {{ hours }}:{{ minutes }}:{{ seconds }}
            </div>
          </div>
          <CurrencyComponent
            :category="data.price.category"
            :item="data.price.item"
            :quantity="data.price?.startAmount"
            show-name
          />
        </div>
        <div class="absolute-right">
          <slot name="actions"></slot>
        </div>
      </q-card-section>
    </q-card>
    <q-card v-else bordered class="item" :style="`width:${width}px`">
      <q-card-section class="bg-brighten row justify-center">
        <q-skeleton type="text" width="50%" height="48px" />
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
    right: 4px;
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
