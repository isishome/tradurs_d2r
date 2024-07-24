<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useItemAddStore } from 'stores/item-add-store'

const props = defineProps<{
  category?: string
  item?: number
  quantity?: number
  title?: string
  showName?: boolean
}>()

const ias = useItemAddStore()

const name = computed(() =>
  props.category === 'runes'
    ? ias.runes.find((r) => r.value === props.item)?.label
    : props.category === 'gems'
    ? ias.gems.find((g) => g.value === props.item)?.label
    : props.category === 'misc'
    ? ias.misc.find((m) => m.value === props.item)?.label
    : ''
)
</script>

<template>
  <div>
    <div v-if="!!title" class="row justify-center text-body2">
      {{ title }}
    </div>
    <div class="row justify-center items-center q-gutter-sm">
      <img
        :src="`/images/items/${category}/${item}.webp`"
        class="price-image"
        loading="lazy"
        :title="name"
        v-bind="$attrs"
      />
      <template v-if="!!quantity">
        <div class="text-body1">x</div>
        <div class="text-h6">
          {{ quantity }}
        </div>
      </template>
    </div>
    <div v-if="!!showName" class="q-mt-sm text-center">{{ name }}</div>
  </div>
</template>
<style lang="scss" scoped>
.price-image {
  max-width: 40px;
}
</style>
