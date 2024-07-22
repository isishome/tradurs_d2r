<script lang="ts">
import { useItemStore } from 'stores/item-store'

export default {
  async preFetch({ store, ssrContext, currentRoute }) {
    const is = useItemStore(store)

    const options = process.env.SERVER
      ? {
          headers: {
            Cookie: ssrContext?.req.headers['cookie'],
            'Accept-Language': currentRoute.params.lang || 'ko'
          }
        }
      : undefined

    return is
      .getItems(1, parseInt(currentRoute.params.id as string), options)
      .then((result) => {
        is.detailItem = result[0]
      })
      .catch(() => {
        is.detailItem = undefined
      })
  }
}
</script>

<script setup lang="ts">
import { onUnmounted } from 'vue'
import ItemComponent from 'components/item/ItemComponent.vue'
import BidComponent from 'components/item/BidComponent.vue'

defineProps<{
  id: string
}>()

const is = useItemStore()

onUnmounted(() => {
  is.detailItem = undefined
})
</script>
<template>
  <div class="row justify-center q-gutter-md">
    <ItemComponent v-if="is.detailItem" :data="is.detailItem" />
    <BidComponent class="bid" />
  </div>
</template>

<style lang="scss" scoped>
.bid {
  min-width: 360px;
  width: 744px;
}
</style>
