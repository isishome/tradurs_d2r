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
import type { Bid } from 'src/types/item'
import { defaultBid } from 'src/types/item'
import { useAccountStore } from 'stores/account-store'

import ItemComponent from 'components/item/ItemComponent.vue'
import BidComponent from 'components/item/BidComponent.vue'

const props = defineProps<{
  id: string
}>()

const is = useItemStore()
const as = useAccountStore()

const bids = ref<Array<Bid>>([])
const _bid = reactive<Bid>(defaultBid())
const itemId = computed(() =>
  !!props.id && !isNaN(Number(props.id)) ? Number(props.id) : undefined
)
const requestUpdate = computed(() => is.notify.request)
const wonUser = computed(() => bids.value.find((b) => b.won)?.user)
const showTradeInfo = computed(
  () =>
    is.detailItem?.statusCode === '001' &&
    (!!is.detailItem.user?.owner ||
      (as.info.battleTag ?? '1') === (wonUser.value?.battleTag ?? '2'))
)

const getBids = (overBidId?: number) => {
  is.getBids(itemId.value as number, overBidId).then((data) => {
    bids.value = !!overBidId ? [...bids.value, ...data] : data
  })
}

const addBid = (val: number) => {
  _bid.itemId = itemId.value
  _bid.amount = val
  is.addBid(_bid).then((isComplete: boolean) => {
    if (isComplete)
      is.getItems(1, parseInt(props.id as string)).then((result) => {
        is.detailItem = result[0]
      })
    getBids()
  })
}

const startedAuction = (val: number) => {
  is.getItems(1, val).then((result) => {
    is.detailItem = result[0]
  })
}

watch(requestUpdate, (val, old) => {
  if (val !== old) {
    if (is.notify.complete)
      is.getItems(1, parseInt(props.id as string)).then((result) => {
        is.detailItem = result[0]
      })
    getBids(
      bids.value.length > 0
        ? Math.max(...bids.value.map((b) => b.id as number))
        : undefined
    )
  }
})

onMounted(() => {
  getBids()
})

onUnmounted(() => {
  is.detailItem = undefined
})
</script>
<template>
  <div class="row justify-center q-gutter-lg">
    <div class="column q-gutter-y-md q-mt-sm">
      <ItemComponent
        v-if="is.detailItem"
        :data="is.detailItem"
        @started="startedAuction"
      />
      <q-card v-if="showTradeInfo" bordered flat class="win text-center column">
        <q-card-section class="bg-brighten">
          <div class="row justify-evenly">
            <div class="col">판매자</div>
            <q-separator vertical />
            <div class="col text-primary">낙찰자</div>
          </div>
        </q-card-section>
        <q-card-section class="col">
          <div class="row items-center full-height text-weight-bold">
            <div class="col">{{ is.detailItem?.user?.battleTag }}</div>
            <q-separator vertical />
            <div class="col">{{ wonUser?.battleTag }}</div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <BidComponent
      v-if="!!is.detailItem?.startDate"
      :data="bids"
      :item="is.detailItem"
      class="bid col-6 col-md-7"
      @add="addBid"
    />
  </div>
</template>

<style lang="scss" scoped>
.win {
  border-radius: 20px;
  min-height: 200px;
}
.bid {
  width: 744px;
  max-width: 80vw;
  min-height: 50vh;
  max-height: 80vh;
}
</style>
