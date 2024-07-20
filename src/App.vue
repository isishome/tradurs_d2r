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

    const promises = [is.getBase(options)]

    return Promise.all(promises)
      .then(() => {
        //
      })
      .catch(() => {
        //
      })
  }
}
</script>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const showView = ref<boolean>(false)

onMounted(() => {
  showView.value = true
})
defineOptions({
  name: 'App'
})
</script>

<template>
  <router-view v-if="showView" />
</template>
