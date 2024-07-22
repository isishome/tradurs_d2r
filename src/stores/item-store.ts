import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'
import { Lang } from 'src/types/global'
import { Item } from 'src/types/item'
import { useGlobalStore } from './global-store'

export const useItemStore = defineStore('item', () => {
  const $q = useQuasar()
  const route = useRoute()
  const gs = useGlobalStore()
  const lang: Lang = (route.params.lang as Lang) || 'ko'
  const ltmd = computed(() => $q.screen.width < 1280)
  const locale: 'enUS' | 'koKR' = lang === 'en' ? 'enUS' : 'koKR'

  const getItems = () => {
    return new Promise<Array<Item>>((resolve, reject) => {
      gs.loading = true
      api
        .post('/d2/item')
        .then((response) => {
          resolve(response.data)
        })
        .catch((e) => {
          reject(e)
        })
        .finally(() => {
          gs.loading = false
        })
    })
  }

  const upsertItem = (item: Item, withStart = false) => {
    return new Promise<void>((resolve, reject) => {
      gs.loading = true
      api
        .post('/d2/item/upsert', { item, withStart })
        .then(() => {
          resolve()
        })
        .catch((e) => {
          reject(e)
        })
        .finally(() => {
          gs.loading = false
        })
    })
  }

  return {
    ltmd,
    lang,
    locale,
    getItems,
    upsertItem
  }
})
