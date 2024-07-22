<script lang="ts">
import { useItemAddStore } from 'stores/item-add-store'
import { useAccountStore } from 'stores/account-store'

export default {
  async preFetch({ store, ssrContext, currentRoute }) {
    const ias = useItemAddStore(store)
    const as = useAccountStore(store)
    const lang = (currentRoute.params.lang as string) || 'ko'

    const options = process.env.SERVER
      ? {
          headers: {
            Cookie: ssrContext?.req.headers['cookie'],
            'Accept-Language': lang
          }
        }
      : undefined
    const promises = [ias.getBase(options), as.checkSign(options)]

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
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { locale } = useI18n({ useScope: 'global' })
locale.value = (route.params.lang as string) || 'ko'

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
