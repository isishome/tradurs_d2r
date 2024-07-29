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
import { clipboard } from 'src/composables/common'

import ItemComponent from 'components/item/ItemComponent.vue'
import BidComponent from 'components/item/BidComponent.vue'

const props = defineProps<{
  id: string
}>()

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()

const is = useItemStore()
const as = useAccountStore()

const bids = ref<Array<Bid>>([])
const _bid = reactive<Bid>(defaultBid())
const _sellerRate = ref<number>(is.detailItem?.rate ?? 0)
const _bidderRate = ref<number>(0)

const itemId = computed(() =>
  !!props.id && !isNaN(Number(props.id)) ? Number(props.id) : undefined
)
const requestUpdate = computed(() => is.notify.request)
const wonBid = computed(() => bids.value.find((b) => b.won))
const wonUser = computed(() => wonBid.value?.user)
const showTradeInfo = computed(
  () =>
    is.detailItem?.statusCode === '001' &&
    (!!is.detailItem.user?.owner ||
      (as.info.battleTag ?? '1') === (wonUser.value?.battleTag ?? '2'))
)
const getBids = (overBidId?: number) => {
  is.getBids(itemId.value as number, overBidId).then((data) => {
    bids.value = !!overBidId ? [...bids.value, ...data] : data
    _bidderRate.value = wonBid.value?.rate ?? 0
  })
}

const addBid = (val: number) => {
  _bid.itemId = itemId.value
  _bid.amount = val
  is.addBid(_bid).then(() => {
    as.checkSign()
    is.getItems(1, parseInt(props.id as string)).then((result) => {
      is.detailItem = result[0]
    })
    getBids()
  })
}

const updateItem = (val: number, message?: string) => {
  is.getItems(1, val).then((result) => {
    is.detailItem = result[0]
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

const updateSellerRate = (val: number) => {
  is.updateSellerRate(itemId.value as number, val)
    .then(() => {
      //
    })
    .catch(() => {
      _sellerRate.value = is.detailItem?.rate ?? 0
    })
}

const updateBidderRate = (val: number) => {
  is.updateBidderRate(wonBid.value?.id as number, val)
    .then(() => {
      //
    })
    .catch(() => {
      _bidderRate.value = wonBid.value?.rate ?? 0
    })
}

const copyBattleTag = (battleTag: string) => {
  clipboard(battleTag, t('user.battleTag'))
}

watch(requestUpdate, (val, old) => {
  if (!!val && val !== old && is.notify.itemId === itemId.value) {
    sound()
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

watch(itemId, (val, old) => {
  if (!!val && val !== old) getBids()
})

watch(
  () => is.detailItem?.rate,
  (val, old) => {
    if (!!val && val !== old) _sellerRate.value = val
  }
)

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
      <div class="column q-gutter-y-md q-mt-sm">
        <ItemComponent
          :data="is.detailItem"
          @update-item="updateItem"
          @delete-item="deleteItem"
          @update-favorite="updateFavorite"
        />
        <q-card
          v-if="showTradeInfo"
          bordered
          flat
          class="win text-center column"
        >
          <q-card-section class="bg-brighten">
            <div class="row justify-evenly">
              <div class="col">{{ t('auction.auctioneer') }}</div>
              <q-separator vertical />
              <div class="col text-primary">
                {{ t('auction.winningBidder') }}
              </div>
            </div>
          </q-card-section>
          <q-card-section class="col">
            <div class="row full-height text-weight-bold">
              <div class="col column items-center q-gutter-y-sm">
                <div
                  class="text-underline no-hover cursor-pointer"
                  @click="
                    copyBattleTag(is.detailItem?.user?.battleTag as string)
                  "
                >
                  {{ is.detailItem?.user?.battleTag }}
                </div>
                <q-rating
                  :disable="
                    (is.detailItem?.rate ?? 0) > 0 ||
                    _sellerRate > 0 ||
                    !wonUser?.owner
                  "
                  v-model="_sellerRate"
                  color="grey"
                  size="sm"
                  no-reset
                  color-selected="yellow"
                  @update:model-value="updateSellerRate"
                />
              </div>
              <q-separator vertical />
              <div class="col column items-center q-gutter-y-sm">
                <div
                  class="text-underline no-hover cursor-pointer"
                  @click="copyBattleTag(wonUser?.battleTag as string)"
                >
                  {{ wonUser?.battleTag }}
                </div>
                <q-rating
                  :disable="
                    (wonBid?.rate ?? 0) > 0 ||
                    _bidderRate > 0 ||
                    !is.detailItem?.user?.owner
                  "
                  v-model="_bidderRate"
                  color="grey"
                  size="sm"
                  color-selected="yellow"
                  @update:model-value="updateBidderRate"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
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
.win {
  border-radius: 20px;
  min-height: 100px;
}

.bid {
  min-width: 360px;
  min-height: 50vh;
  max-height: 80vh;
}

.no-data {
  height: 50vh;
}
</style>
