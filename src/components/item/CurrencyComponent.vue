<script setup lang="ts">
import { computed } from 'vue'
import { useItemStore } from 'stores/item-store'

const props = defineProps<{
  category?: string
  item?: number
  quantity?: number
  showName?: boolean
}>()

const is = useItemStore()

const name = computed(() =>
  props.category === 'runes'
    ? is.runes.find((r) => r.value === props.item)?.label
    : props.category === 'gems'
    ? is.gems.find((g) => g.value === props.item)?.label
    : props.category === 'misc'
    ? is.misc.find((m) => m.value === props.item)?.label
    : ''
)
</script>

<template>
  <div>
    <div class="row justify-center items-center q-gutter-sm">
      <img
        :src="`/images/items/${category}/${item}.webp`"
        class="price-image"
        loading="lazy"
        :title="name"
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
