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
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

import { useGlobalStore } from 'stores/global-store'
import { useItemStore } from 'stores/item-store'

import { useAdBlock } from 'src/composables/adblock'
import { sound } from 'src/sockets/messenger'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n({ useScope: 'global' })
locale.value = (route.params.lang as string) || 'ko'
const $q = useQuasar()
const gs = useGlobalStore()
const is = useItemStore()
const { check } = useAdBlock()

const showView = ref<boolean>(false)
const requestNotify = computed(() => is.notify.request)
const reloadAdKey = computed(() => gs.adsense.reloadAdKey)

watch(requestNotify, (val, old) => {
  if (!!val && val !== old && is.notify.itemId !== is.detailItem?.id) {
    sound()
    $q.notify({
      type: 'primary',
      message: '내 아이템 또는 경매 참여 중인 아이템에 새 입찰이 있습니다.',
      multiLine: true,
      progress: true,
      timeout: 5000,
      actions: [
        {
          dense: true,
          class: 'no-hover text-underline',
          label: t('btn.confirm'),
          handler: () => {
            router.push({ name: 'item', params: { id: is.notify.itemId } })
          }
        }
      ]
    })
  }
})

const checkAd = () => {
  if (!(route.name === 'support' && route.params.section === 'allow')) {
    check({
      actions: [
        {
          noCaps: true,
          dense: true,
          class: 'no-hover text-underline',
          label: t('btn.allow'),
          color: 'dark',
          handler: () => {
            router.push({
              name: 'help',
              params: { category: 'allow' }
            })
          }
        }
      ]
    })
  }
}

watch(reloadAdKey, (val, old) => {
  if (val !== old) checkAd()
})

onMounted(() => {
  showView.value = true
  checkAd()
})

defineOptions({
  name: 'App'
})
</script>

<template>
  <router-view v-if="showView" />
</template>
