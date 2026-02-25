<script setup lang="ts">
import { Item } from 'src/types/item'

import ItemComponent from 'components/item/ItemComponent.vue'

type Props = {
  data?: Item | string | undefined
}

defineProps<Props>()
</script>
<template>
  <div class="preview row justify-center items-center">
    <img v-if="typeof data === 'string'" :src="data" />
    <ItemComponent v-else-if="typeof data === 'object'" :data="data" no-more />
  </div>
</template>

<style lang="scss" scoped>
.preview {
  transition: margin 0.3s ease;
  & img {
    max-width: 90%;
    max-height: 90%;
    width: auto;
    height: auto;
    object-fit: contain;
    box-shadow: 1px 1px 1px 1px var(--q-dark-page);
    border-radius: 20px;
  }
}
</style>
