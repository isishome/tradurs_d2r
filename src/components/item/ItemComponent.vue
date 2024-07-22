<script setup lang="ts">
import { computed } from 'vue'
import type { Item } from 'src/types/item'
import { randImage } from 'src/types/item'
import { useItemAddStore } from 'stores/item-add-store'
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

const emit = defineEmits(['update-image'])

// store
const ias = useItemAddStore()

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

// func
const updateImage = (val: number) => {
  emit('update-image', val)
}
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
      </q-card-section>
      <q-card-section :class="{ 'cursor-pointer': editable }">
        <template
          v-if="editable && Object.keys(randImage).includes(category as string)"
        >
          <q-menu cover anchor="top end" fit>
            <div
              class="row justify-around items-center select-image-area q-py-md"
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
                <img :src="imgSrc(c)" loading="lazy" />
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
        <div class="row justify-center items-center">
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
