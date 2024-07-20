<script setup lang="ts">
import { computed } from 'vue'
import type { Item } from 'src/types/item'
import { useItemStore } from 'stores/item-store'

import ModifierComponent from 'components/item/ModifierComponent.vue'
import CurrencyComponent from 'components/item/CurrencyComponent.vue'

const props = defineProps<{
  data: Item
}>()

const is = useItemStore()
const findItem = computed(() =>
  props.data.category === 'gems'
    ? is.gems.find((g) => g.value === props.data.item)
    : props.data.category === 'runes'
    ? is.runes.find((r) => r.value === props.data.item)
    : props.data.quality === 'set'
    ? is.setItems(props.data.category).find((s) => s.value === props.data.item)
    : props.data.quality === 'unique'
    ? is.uniques(props.data.category).find((u) => u.value === props.data.item)
    : props.data.quality === 'runewords'
    ? is.runewords().find((rw) => rw.value === props.data.item)
    : props.data.category === 'misc'
    ? is.misc.find((m) => m.value === props.data.item)
    : props.data.category === 'weapons'
    ? is
        .weapons(props.data.itemType, props.data.classType)
        .find((w) => w.value === props.data.detailType)
    : props.data.category === 'armor'
    ? is
        .armor(props.data.itemType, props.data.classType)
        .find((a) => a.value === props.data.detailType)
    : undefined
)
const name = computed(
  () =>
    props.data.name ||
    [...is.nameAffixes, ...is.names]
      .filter((ns) => props.data.names?.includes(ns.id))
      .map((ns) => ns.label)
      .join(' ')
      .trim() ||
    props.data.name ||
    findItem.value?.label
)
const detailName = computed(
  () =>
    is.names.find((n) => n.value === props.data.detailType)?.label ??
    is.names.find((n) => n.value === props.data.itemType)?.label ??
    is.category().find((n) => n.value === props.data.category)?.label
)
const runewordsRecipe = computed(() =>
  props.data.quality === 'runewords'
    ? is
        .runewordsRecipes(props.data.item as number)
        .map((rwr) => Number(rwr.mappingId2))
    : []
)
const startPath = computed(() => '/images/items/')
const midPath = computed(
  () => `${props.data.category ? `${props.data.category}/` : ''}`
)

const imgSrc = computed(() => {
  if (props.data.quality === 'unique' && props.data.category === 'charms')
    return `${startPath.value}unique/charms/${props.data.item}.webp`
  else if (props.data.category === 'rings')
    return `${startPath.value}${midPath.value}${Math.ceil(
      Math.random() * 5
    )}.webp`
  else if (props.data.category === 'amulets')
    return `${startPath.value}${midPath.value}${Math.ceil(
      Math.random() * 3
    )}.webp`
  else if (props.data.category === 'jewels')
    return `${startPath.value}${midPath.value}${Math.ceil(
      Math.random() * 6
    )}.webp`
  else if (props.data.category === 'charms')
    return `${startPath.value}${midPath.value}${
      props.data.itemType
    }/${Math.ceil(Math.random() * 3)}.webp`
  else
    return `${startPath.value}${midPath.value}${
      props.data.itemType ? `${props.data.itemType}/` : ''
    }${props.data.classType ? `${props.data.classType}/` : ''}${
      props.data.imageType ?? props.data.item
    }.webp`
})
</script>

<template>
  <div>
    <q-card bordered class="item" style="letter-spacing: 2px">
      <q-card-section class="bg-brighten">
        <div
          class="text-h6 text-center column"
          :style="`color:var(--quality-${data.quality})`"
        >
          <div>
            {{ name }}
          </div>
          <div v-show="data.quality !== 'normal'">{{ detailName }}</div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row justify-center">
          <img :src="imgSrc" class="item-image" loading="lazy" />
        </div>
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
      </q-card-section>
      <template v-if="data.modifiers.length > 0">
        <q-separator />
        <q-card-section>
          <ModifierComponent
            v-for="m in data.modifiers"
            :key="m.order"
            :data="m"
            :options="[...is.modifiers, ...is.skills]"
          />
        </q-card-section>
      </template>
      <q-separator />
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
  width: 380px;
  max-width: 80vw;
  box-shadow: 1px 1px 1px 1px var(--q-dark-page);
}

.item-image {
  max-height: 120px;
}
</style>
