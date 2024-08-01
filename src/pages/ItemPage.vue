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
        is.detailItem = result[0]
      })
      .catch(() => {
        is.detailItem = undefined
      })
  }
}
</script>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { Bid } from 'src/types/item'
import { defaultBid } from 'src/types/item'
import { useAccountStore } from 'stores/account-store'
import { sound } from 'src/sockets/messenger'
import { notify } from 'src/composables/common'

import ItemComponent from 'components/item/ItemComponent.vue'
import BidComponent from 'components/item/BidComponent.vue'
import ParticipantComponent from 'components/item/ParticipantComponent.vue'

const props = defineProps<{
  id: string
}>()

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()

const is = useItemStore()
const as = useAccountStore()

const bids = ref<Array<Bid>>([])
const _bid = reactive<Bid>(defaultBid())

const itemId = computed(() =>
  !!props.id && !isNaN(Number(props.id)) ? Number(props.id) : undefined
)
const requestUpdate = computed(() => is.notify.request)
const wonBid = computed(() => bids.value.find((b) => b.won))

const getBids = (overBidId?: number) => {
  is.getBids(itemId.value as number, overBidId).then((data) => {
    bids.value = !!overBidId ? [...bids.value, ...data] : data
  })
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
        is.detailItem = result[0]
      })
      getBids()
    })
}

const updateItem = (val: number, message?: string) => {
  is.getItems(1, val).then((result) => {
    is.detailItem = result[0]
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
        is.detailItem = result[0]
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
        is.detailItem = result[0]
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
  if (!!val && val !== old) getBids()
})

onMounted(() => {
  getBids()
})

onUnmounted(() => {
  is.detailItem = undefined
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
  </div>
</template>

<style lang="scss" scoped>
.bid {
  width: 360px;
  max-width: 80vw;
  min-height: 50vh;
  max-height: 80vh;
}

.no-data {
  height: 50vh;
}
</style>
