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
import { useQuasar, useMeta } from 'quasar'

import { useGlobalStore } from 'stores/global-store'
import { useItemStore } from 'stores/item-store'

import { useAdBlock } from 'src/composables/adblock'
import { sound } from 'src/sockets/messenger'

const route = useRoute()
const router = useRouter()
const { t, te, locale } = useI18n({ useScope: 'global' })

const $q = useQuasar()
const gs = useGlobalStore()
const is = useItemStore()
const { check } = useAdBlock()

const brLang = gs.localeOptions
  .map((lo) => lo.value)
  .includes($q.lang.getLocale()?.substring(0, 2) as string)
  ? ($q.lang.getLocale()?.substring(0, 2) as string)
  : 'ko'
locale.value =
  (route.params.lang as string) ||
  (['pnf', 'ftc'].includes(route.name as string) ? brLang : 'ko')

const showView = ref<boolean>(false)
const requestNotify = computed(() => is.notify.request)
const reloadAdKey = computed(() => gs.adsense.reloadAdKey)

gs.meta.title = computed(() =>
  te(`page.${route.name as string}`)
    ? t('meta.title', { p: `${t(`page.${route.name as string}`)} - ` })
    : t('meta.title')
)
gs.meta.description = t('meta.description')
gs.meta.keywords = t('meta.keywords')

useMeta(() => {
  return {
    title: gs.meta.title,
    meta: {
      description: { name: 'description', content: gs.meta.description },
      keywords: { name: 'keywords', content: gs.meta.keywords },
      equiv: {
        'http-equiv': 'Content-Type',
        content: 'text/html; charset=UTF-8'
      },
      ogTitle: { property: 'og:title', content: gs.meta.title },
      ogDescription: {
        property: 'og:description',
        content: gs.meta.description
      },
      ogUrl: { property: 'og:url', content: 'https://d2r.tradurs.com' },
      ogType: { property: 'og:type', content: 'website' },
      ogImage: {
        property: 'og:image',
        content: 'https://d2r.tradurs.com/images/og.png'
      },
      twitterCard: { name: 'twitter:card', content: 'summary' },
      twitterTitle: { name: 'twitter:title', content: gs.meta.title },
      twitterDescription: {
        name: 'twitter:description',
        content: gs.meta.description
      },
      twitterUrl: { name: 'twitter:url', content: 'https://d2r.tradurs.com' },
      twitterImage: {
        name: 'twitter:image',
        content: 'https://d2r.tradurs.com/images/og.png'
      }
    }
  }
})

watch(requestNotify, (val, old) => {
  if (!!val && val !== old && route.name !== 'item') {
    let cnt = 0
    while (is.notify.queues.length) {
      cnt++
      const queue = is.notify.queues.pop()

      if (cnt > 10) break
      if (is.detailItem?.id === queue?.itemId) continue

      sound()

      $q.notify({
        message: !!queue?.completed
          ? t('messages.auctionCompleted')
          : !!queue?.temperature
          ? t('messages.riseTemperature', { t: queue?.temperature })
          : t('messages.newBid'),
        multiLine: true,
        progress: true,
        timeout: 5000,
        actions: [
          {
            dense: true,
            class: 'no-hover text-underline',
            label: t('btn.confirm'),
            handler: () => {
              router.push({
                name: 'item',
                params: { id: queue?.itemId }
              })
            }
          }
        ]
      })
    }
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
