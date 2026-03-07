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
        is.detailItem = result.items[0]
        is.userItems = result.userItems
      })
      .catch(() => {
        is.detailItem = undefined
      })
  }
}
</script>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { Size } from 'src/types/global'
import type { Bid, Item } from 'src/types/item'
import { defaultBid } from 'src/types/item'
import { useAccountStore } from 'stores/account-store'
import { useGlobalStore } from 'src/stores/global-store'
import { sound } from 'src/sockets/messenger'
import { notify } from 'src/assets/utils/common'

import ItemComponent from 'components/item/ItemComponent.vue'
import BidComponent from 'components/item/BidComponent.vue'
import ParticipantComponent from 'components/item/ParticipantComponent.vue'

const props = defineProps<{
  id: string
}>()

const $q = useQuasar()
const { t } = useI18n({ useScope: 'global' })
const router = useRouter()

const is = useItemStore()
const as = useAccountStore()
const gs = useGlobalStore()

const bids = ref<Array<Bid>>([])
const _bid = reactive<Bid>(defaultBid())
const colGroup = reactive<Array<Array<Item>>>([])
const size = reactive<Size>({} as Size)
const _slide = ref<number>(0)
const limit = computed(() =>
  Math.floor(size.width / (is.itemWidth + 128)) > 0
    ? Math.floor(size.width / (is.itemWidth + 128))
    : 1
)
const itemId = computed(() =>
  !!props.id && !isNaN(Number(props.id)) ? Number(props.id) : undefined
)
const requestUpdate = computed(() => is.notify.request)
const wonBid = computed(() => bids.value.find((b) => b.won))
const detailInfo = reactive<{ itemId?: number; isTransition: boolean }>({
  itemId: undefined,
  isTransition: false
})
const bidRef = ref()

const getBids = (overBidId?: number) => {
  is.getBids(itemId.value as number, overBidId).then((data) => {
    bids.value = !!overBidId ? [...bids.value, ...data] : data

    if ($q.platform.is.mobile && bidRef.value?.$el) {
      const bidElement = bidRef.value?.$el as HTMLDivElement
      const y =
        bidElement.getBoundingClientRect().top +
        window.scrollY -
        gs.headerHeight -
        24

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      })
    }
  })
}

const alignUserItems = () => {
  const cloneItems = JSON.parse(JSON.stringify(is.userItems))
  colGroup.splice(0, colGroup.length)
  _slide.value = 0

  while (cloneItems.length > 0) {
    let cnt = 0
    const cols = []
    while (cnt < limit.value && cloneItems.length > 0) {
      cols.push(cloneItems.shift())
      cnt++
    }
    colGroup.push(cols)
  }
}

const addBid = (val: number) => {
  _bid.itemId = itemId.value
  _bid.amount = val
  is.addBid(_bid)
    .then(() => {
      as.checkSign()
    })
    .catch(() => {
      //
    })
    .then(() => {
      is.getItems(1, parseInt(props.id as string)).then((result) => {
        is.detailItem = result.items[0]
      })
      getBids()
    })
}

const updateItem = (val: number, message?: string) => {
  is.getItems(1, val).then((result) => {
    is.detailItem = result.items[0]
    getBids()

    if (message) notify(message)
  })
}

const deleteItem = (val: number) => {
  is.deleteItem(val).then(() => {
    notify(t('messages.itemDeleted'))
    router.push({ name: 'main' })
  })
}

const updateFavorite = (status: boolean) => {
  if (is.detailItem) {
    is.detailItem.favorite = status
    if (status) notify(t('messages.favorite', { t: t('global.set') }))
    else notify(t('messages.favorite', { t: t('global.removed') }))
  }
}

const updateAuctioneerRate = (
  val: number,
  failed: (before: number) => void
) => {
  is.updateAuctioneerRate(itemId.value as number, val)
    .then(() => {
      is.getItems(1, parseInt(props.id as string)).then((result) => {
        is.detailItem = result.items[0]
      })
    })
    .catch(() => {
      failed(is.detailItem?.rate ?? 0)
    })
}

const updateBidderRate = (val: number, failed: (before: number) => void) => {
  is.updateBidderRate(wonBid.value?.id as number, val)
    .then(() => {
      getBids()
    })
    .catch(() => {
      failed(wonBid.value?.rate ?? 0)
    })
}

const onClickItem = (id: number) => {
  if (!!detailInfo.itemId || detailInfo.isTransition) return

  detailInfo.itemId = id
  detailInfo.isTransition = true
}

const goDetail = async () => {
  await router.push({ name: 'item', params: { id: detailInfo.itemId } })
}

watch(limit, (val, old) => {
  if (val && val !== old) {
    alignUserItems()
  }
})

watch(requestUpdate, (val, old) => {
  if (!!val && val !== old) {
    let cnt = 0
    while (is.notify.queues.length) {
      cnt++
      const queue = is.notify.queues.pop()

      if (cnt > 10) break
      if (itemId.value !== queue?.itemId) continue
      sound()

      is.getItems(1, parseInt(props.id as string)).then((result) => {
        is.detailItem = result.items[0]
      })
      getBids(
        !!!queue?.completed && !!!queue?.bidId && bids.value.length > 0
          ? Math.max(...bids.value.map((b) => b.id as number))
          : undefined
      )
    }
  }
})

watch(itemId, (val, old) => {
  if (!!val && val !== old) {
    detailInfo.itemId = undefined
    detailInfo.isTransition = false

    alignUserItems()
    getBids()
  }
})

onMounted(() => {
  alignUserItems()
  getBids()
})
</script>
<template>
  <div>
    <div v-if="is.detailItem" class="row justify-center q-gutter-lg">
      <div class="q-gutter-y-md q-mt-sm">
        <ItemComponent
          :data="is.detailItem"
          @update-item="updateItem"
          @delete-item="deleteItem"
          @update-favorite="updateFavorite"
        />
        <ParticipantComponent
          :item="is.detailItem"
          :won-bid="wonBid"
          @update-auctioneer-rate="updateAuctioneerRate"
          @update-bidder-rate="updateBidderRate"
        />
      </div>
      <BidComponent
        ref="bidRef"
        :data="bids"
        :item="is.detailItem"
        class="bid col-5 col-md"
        @add="addBid"
      />
    </div>
    <div v-else class="no-data row justify-center items-center">
      <div class="column items-center q-gutter-y-sm">
        <div>{{ t('messages.noItem') }}</div>
      </div>
    </div>

    <div class="q-py-md"></div>
    <div class="bottom-bar row justify-center items-center">
      <div class="full-width row justify-between items-center">
        <div class="row items-center">
          <q-btn
            aria-label="Tradurs Item List Button"
            color="grey-9"
            size="md"
            padding="sm"
            icon="dashboard"
            round
            unelevated
            class="area-shadow"
            :to="{ name: 'main' }"
          />
        </div>
        <div></div>
      </div>
    </div>
    <q-resize-observer
      :debounce="400"
      @resize="(val:Size) => {Object.assign(size, val)}"
    />
    <template v-if="colGroup.length > 0">
      <q-separator class="q-my-xl" />
      <div class="text-h6 text-center">
        {{ t('item.inProgressUserItems') }}
      </div>
      <q-carousel
        v-model="_slide"
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        arrows
        control-type="regular"
        control-color="primary"
        control-text-color="dark"
        height="101%"
        class="full-width bg-transparent"
      >
        <q-carousel-slide :name="idx" v-for="(col, idx) in colGroup" :key="idx">
          <div
            class="row justify-around q-gutter-x-lg no-wrap overflow-hidden q-py-xl"
          >
            <ItemComponent
              v-for="userItem in col"
              :key="userItem.id"
              :class="[
                'related-item',
                userItem.loading ? 'no-pointer-events' : 'cursor-pointer',
                {
                  clicked:
                    !!detailInfo.itemId && userItem.id === detailInfo.itemId
                }
              ]"
              @click="onClickItem(userItem.id as number)"
              @transitionend="goDetail"
              :data="userItem"
              no-more
            />
          </div>
        </q-carousel-slide>
      </q-carousel>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.bid {
  width: 340px;
  max-width: 80vw;
  min-height: 50vh;
  max-height: 80vh;
}

.no-data {
  height: 50vh;
}

.related-item {
  transition: transform 0.2s ease, filter 0.2s ease;
  transform: scale(1);
  filter: brightness();

  &.clicked {
    transform: scale(1.05);
    filter: brightness(1.4);
  }
}
</style>
