<script lang="ts">
import { useItemAddStore } from 'stores/item-add-store'

export default {
  async preFetch({ store, ssrContext, currentRoute }) {
    const ias = useItemAddStore(store)

    const options = process.env.SERVER
      ? {
          headers: {
            Cookie: ssrContext?.req.headers['cookie'],
            'Accept-Language': currentRoute.params.lang || 'ko'
            //'Cache-Control': 'max-age=3600'
          }
        }
      : undefined

    const promises = [ias.getBase(options)]

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
