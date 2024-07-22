<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Item } from 'src/types/item'
import { randImage } from 'src/types/item'
import { useItemAddStore } from 'stores/item-add-store'

import ModifierComponent from 'components/item/ModifierComponent.vue'
import CurrencyComponent from 'components/item/CurrencyComponent.vue'

const props = defineProps<{
  data: Item
  editable?: boolean
}>()

const emit = defineEmits(['update-image'])

// store
const ias = useItemAddStore()

// variable
const expanded = ref<boolean>(false)

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
  paths.push('', 'images', 'items')
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
    <q-card bordered class="item" style="letter-spacing: 1px">
      <q-card-section class="bg-brighten">
        <div
          class="text-h6 text-center column"
          :style="`color:var(--quality-${data.quality})`"
        >
          <div
            :style="`color:var(--${
              (data.quality === 'normal' && data.socket > 0) || data.ethereal
                ? 'sockoreth'
                : ''
            })`"
          >
            {{ name }}
          </div>
          <div
            v-show="data.quality !== 'normal'"
            :style="`color:var(--${
              data.quality === 'normal' && (data.socket > 0 || data.ethereal)
                ? 'sockoreth'
                : ''
            })`"
          >
            {{ detailName }}
          </div>
        </div>
      </q-card-section>
      <q-card-section :class="{ 'cursor-pointer': editable }">
        <div
          v-if="data.quality === 'runewords'"
          class="row justify-center items-center q-gutter-xs"
        >
          <CurrencyComponent
            v-for="(rune, idx) in runewordsRecipe"
            :key="idx"
            category="runes"
            :item="rune"
            class="text-caption"
          />
        </div>
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
        <div
          v-if="!editable && data.modifiers.length > 0"
          class="absolute-bottom-right q-pr-md"
        >
          <q-btn
            color="grey"
            round
            flat
            dense
            :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            @click="expanded = !expanded"
          />
        </div>
      </q-card-section>
      <q-separator inset />
      <q-slide-transition class="modifiers">
        <div v-show="expanded || editable">
          <q-card-section>
            <ModifierComponent
              v-for="m in data.modifiers"
              :key="m.order"
              :data="m"
              :options="[...ias.modifiers, ...ias.skills]"
              :class="`m_${m.id}`"
            />
          </q-card-section>
          <q-separator inset />
        </div>
      </q-slide-transition>
      <!-- <q-card-section v-if="data.modifiers.length > 0" class="modifiers">
        <ModifierComponent
          v-for="m in data.modifiers"
          :key="m.order"
          :data="m"
          :options="[...ias.modifiers, ...ias.skills]"
          :class="`m_${m.id}`"
        />
      </q-card-section> -->

      <q-card-section>
        <div class="row justify-center">
          <CurrencyComponent
            :category="data.price.category"
            :item="data.price.item"
            :quantity="data.price?.startAmount"
            show-name
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
.item {
  width: 360px;
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
