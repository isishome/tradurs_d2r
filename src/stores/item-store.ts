import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import type { AxiosRequestConfig } from 'axios'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'
import { Lang } from 'src/types/global'
import type { Page } from 'src/types/global'
import { Item } from 'src/types/item'
import { useGlobalStore } from './global-store'

type ItemPage = Page & {
  newItems: number
}

export const useItemStore = defineStore('item', () => {
  const $q = useQuasar()
  const route = useRoute()
  const gs = useGlobalStore()
  const lang: Lang = (route.params.lang as Lang) || 'ko'
  const ltmd = computed(() => $q.screen.width < 1280)
  const locale: 'enUS' | 'koKR' = lang === 'en' ? 'enUS' : 'koKR'
  const itemPage = reactive<ItemPage>({
    rows: 10,
    over: false,
    more: false,
    newItems: 0
  })
  const detailItem = ref<Item>()

  const getItems = (
    page: number,
    id?: number,
    options?: AxiosRequestConfig
  ) => {
    return new Promise<Array<Item>>((resolve, reject) => {
      gs.loading = true
      api
        .post('/d2/item', { page, rows: itemPage.rows, id }, options)
        .then((response) => {
          if (!!!id) {
            itemPage.over = page > 1
            itemPage.more = response.data.length > itemPage.rows
            response.data.splice(itemPage.rows, 1)
          }
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
    itemPage,
    detailItem,
    getItems,
    upsertItem
  }
})
