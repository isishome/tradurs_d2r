import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import type { AxiosRequestConfig } from 'axios'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { Lang } from 'src/types/global'
import type { Page, Notify } from 'src/types/global'
import type { Bid, Item, ItemInfo, Filter } from 'src/types/item'
import { defaultFilter } from 'src/types/item'
import { useGlobalStore } from './global-store'
import { sleep } from 'src/composables/common'

type ItemPage = Page & {
  newItems: number
}

export const useItemStore = defineStore('item', () => {
  const $q = useQuasar()
  const gs = useGlobalStore()
  const lang: Lang = gs.lang
  const ltmd = computed(() => $q.screen.width < 1280)
  const locale = gs.locale
  const refresh = ref<number>(0)
  const itemWidth = ref<number>(360)
  const itemPage = reactive<ItemPage>({
    rows: 20,
    over: false,
    more: false,
    newItems: 0
  })
  const detailItem = ref<Item>()
  const userItems = ref<Array<Item>>([])
  const notify = ref<Notify>({
    request: 0,
    queues: []
  })

  const filter = ref<Filter>(defaultFilter())

  const resetFilter = () => {
    filter.value = defaultFilter()
  }

  const getItems = (
    page: number,
    id?: number,
    options?: AxiosRequestConfig
  ) => {
    return new Promise<ItemInfo>(async (resolve, reject) => {
      gs.showLoading()

      await sleep(400)

      api
        .post(
          '/d2/item',
          {
            page,
            rows: itemPage.rows,
            id,
            filter: !!id ? undefined : filter.value
          },
          options
        )
        .then((response) => {
          if (!!!id) {
            itemPage.over = page > 1
            itemPage.more = response.data.length > itemPage.rows
            response.data.items.splice(itemPage.rows, 1)
          }
          resolve(response.data)
        })
        .catch((e) => {
          reject(e)
        })
        .finally(() => {
          gs.hideLoading()
        })
    })
  }

  const upsertItem = (item: Item, withStart = false) => {
    return new Promise<string>((resolve, reject) => {
      gs.showLoading()
      api
        .post('/d2/item/upsert', { item, withStart })
        .then((response) => {
          resolve(response.data.id)
        })
        .catch((e) => {
          reject(e)
        })
        .finally(() => {
          gs.hideLoading()
        })
    })
  }

  const deleteItem = (itemId: number) => {
    return new Promise<void>((resolve, reject) => {
      gs.showLoading()
      api
        .post('/d2/item/delete', { itemId })
        .then(() => {
          resolve()
        })
        .catch((e) => {
          reject(e)
        })
        .finally(() => {
          gs.hideLoading()
        })
    })
  }

  const startAuction = (itemId: number) => {
    return new Promise<void>((resolve, reject) => {
      gs.showLoading()
      api
        .post('/d2/item/start', { itemId })
        .then(() => {
          resolve()
        })
        .catch((e) => {
          reject(e)
        })
        .finally(() => {
          gs.hideLoading()
        })
    })
  }

  const favorite = (itemId: number, status: boolean) => {
    return new Promise<boolean>((resolve, reject) => {
      gs.showLoading()
      api
        .post('/d2/item/favorite', { itemId, status })
        .then((response) => {
          resolve(response.data)
        })
        .catch((e) => {
          reject(e)
        })
        .finally(() => {
          gs.hideLoading()
        })
    })
  }

  const getBids = (itemId: number, overBidId?: number) => {
    return new Promise<Array<Bid>>((resolve, reject) => {
      gs.showLoading()
      api
        .get('/d2/item/bids', { params: { itemId, overBidId } })
        .then((response) => {
          resolve(response.data)
        })
        .catch((e) => {
          reject(e)
        })
        .finally(() => {
          gs.hideLoading()
        })
    })
  }

  const addBid = (bid: Bid) => {
    return new Promise<void>((resolve, reject) => {
      gs.showLoading()
      api
        .post('/d2/item/bid/add', { bid })
        .then(() => {
          resolve()
        })
        .catch((e) => {
          reject(e)
        })
        .finally(() => {
          gs.hideLoading()
        })
    })
  }

  const updateAuctioneerRate = (itemId: number, rate: number) => {
    return new Promise<void>((resolve, reject) => {
      gs.showLoading()
      api
        .post('/d2/item/rate/update', { itemId, rate })
        .then(() => {
          resolve()
        })
        .catch((e) => {
          reject(e)
        })
        .finally(() => {
          gs.hideLoading()
        })
    })
  }

  const updateBidderRate = (bidId: number, rate: number) => {
    return new Promise<void>((resolve, reject) => {
      gs.showLoading()
      api
        .post('/d2/item/bid/rate/update', { bidId, rate })
        .then(() => {
          resolve()
        })
        .catch((e) => {
          reject(e)
        })
        .finally(() => {
          gs.hideLoading()
        })
    })
  }

  return {
    ltmd,
    lang,
    locale,
    refresh,
    itemWidth,
    itemPage,
    detailItem,
    userItems,
    notify,
    filter,
    resetFilter,
    getItems,
    upsertItem,
    deleteItem,
    startAuction,
    favorite,
    getBids,
    addBid,
    updateAuctioneerRate,
    updateBidderRate
  }
})
