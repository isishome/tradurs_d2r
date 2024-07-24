import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import type { AxiosRequestConfig } from 'axios'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'
import { Lang } from 'src/types/global'
import type { Page } from 'src/types/global'
import { Bid, Item } from 'src/types/item'
import { useGlobalStore } from './global-store'

type ItemPage = Page & {
  newItems: number
}

type Notify = {
  request: number
  itemId?: number
  complete: boolean
}

export const useItemStore = defineStore('item', () => {
  const $q = useQuasar()
  const route = useRoute()
  const gs = useGlobalStore()
  const lang: Lang = (route.params.lang as Lang) || 'ko'
  const ltmd = computed(() => $q.screen.width < 1280)
  const locale: 'enUS' | 'koKR' = lang === 'en' ? 'enUS' : 'koKR'
  const refresh = ref<number>(0)
  const itemPage = reactive<ItemPage>({
    rows: 10,
    over: false,
    more: false,
    newItems: 0
  })
  const detailItem = ref<Item>()
  const notify = ref<Notify>({
    request: 0,
    itemId: undefined,
    complete: false
  })

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
    return new Promise<string>((resolve, reject) => {
      gs.loading = true
      api
        .post('/d2/item/upsert', { item, withStart })
        .then((response) => {
          resolve(response.data.id)
        })
        .catch((e) => {
          reject(e)
        })
        .finally(() => {
          gs.loading = false
        })
    })
  }

  const startAuction = (itemId: number) => {
    return new Promise<void>((resolve, reject) => {
      gs.loading = true
      api
        .post('/d2/item/start', { itemId })
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

  const getBids = (itemId: number, overBidId?: number) => {
    return new Promise<Array<Bid>>((resolve, reject) => {
      gs.loading = true
      api
        .get('/d2/item/bids', { params: { itemId, overBidId } })
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

  const addBid = (bid: Bid) => {
    return new Promise<boolean>((resolve, reject) => {
      gs.loading = true
      api
        .post('/d2/item/bid/add', { bid })
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

  return {
    ltmd,
    lang,
    locale,
    refresh,
    itemPage,
    detailItem,
    notify,
    getItems,
    upsertItem,
    startAuction,
    getBids,
    addBid
  }
})
