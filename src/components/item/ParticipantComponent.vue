<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Item, Bid } from 'src/types/item'
import { clipboard } from 'src/composables/common'

interface IProps {
  item: Item
  wonBid?: Bid
  disable?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  disable: false
})

const emit = defineEmits(['update-auctioneer-rate', 'update-bidder-rate'])

const { t } = useI18n({ useScope: 'global' })

const _auctioneerRate = ref<number>(props.item.rate ?? 0)
const _bidderRate = ref<number>(props.wonBid?.rate ?? 0)

const copyBattleTag = (battleTag: string) => {
  if (!!battleTag) clipboard(battleTag, t('user.battleTag'))
}

const failedAuctioneerRate = (val: number) => {
  _auctioneerRate.value = val
}

const failedBidderRate = (val: number) => {
  _bidderRate.value = val
}

watch(
  () => props.item.rate,
  (val, old) => {
    if (!!val && val !== old) _auctioneerRate.value = val
  }
)

watch(
  () => props.wonBid?.rate,
  (val, old) => {
    if (!!val && val !== old) _bidderRate.value = val
  }
)
</script>

<template>
  <q-card bordered flat class="win text-center">
    <q-card-section class="bg-brighten">
      <div class="row justify-evenly">
        <div class="col">
          {{ t('auction.auctioneer') }}
        </div>
        <q-separator vertical />
        <div class="col">
          {{ t('auction.winningBidder') }}
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row text-weight-bold">
        <div class="col column items-center q-gutter-y-sm">
          <div v-if="item.user?.owner">
            {{ t('auction.me') }}
          </div>
          <div
            v-else
            :class="{
              'text-underline cursor-pointer no-hover': !!item.user?.battleTag
            }"
            @click="copyBattleTag(item.user?.battleTag as string)"
          >
            {{ item.user?.battleTag ?? '********' }}
          </div>
          <div class="row items-center q-gutter-x-md">
            <q-icon name="device_thermostat" color="red" size="sm" />
            <div>{{ item.user?.temperature }}&#8451;</div>
          </div>
          <q-rating
            v-if="
              item.statusCode === '001' &&
              (item.user?.owner || wonBid?.user?.owner)
            "
            :disable="
              (item?.rate ?? 0) > 0 ||
              _auctioneerRate > 0 ||
              !wonBid?.user?.owner
            "
            v-model="_auctioneerRate"
            color="grey"
            size="sm"
            no-reset
            color-selected="yellow"
            @update:model-value="
              emit(
                'update-auctioneer-rate',
                _auctioneerRate,
                failedAuctioneerRate
              )
            "
          />
        </div>
        <q-separator vertical />
        <div class="col column items-center q-gutter-y-sm">
          <template v-if="wonBid">
            <div v-if="wonBid.user?.owner">
              {{ t('auction.me') }}
            </div>
            <div
              v-else
              :class="{
                'text-underline cursor-pointer no-hover':
                  !!wonBid?.user?.battleTag
              }"
              @click="copyBattleTag(wonBid?.user?.battleTag as string)"
            >
              {{ wonBid?.user?.battleTag ?? '********' }}
            </div>
            <div class="row items-center q-gutter-x-md">
              <q-icon name="device_thermostat" color="red" size="sm" />
              <div>{{ wonBid?.user?.temperature }}&#8451;</div>
            </div>
            <q-rating
              v-if="
                item.statusCode === '001' &&
                (item.user?.owner || wonBid?.user?.owner)
              "
              :disable="
                (wonBid?.rate ?? 0) > 0 || _bidderRate > 0 || !item.user?.owner
              "
              v-model="_bidderRate"
              color="grey"
              size="sm"
              color-selected="yellow"
              @update:model-value="
                emit('update-bidder-rate', _bidderRate, failedBidderRate)
              "
            />
          </template>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<style lang="scss" scoped>
.win {
  border-radius: 20px;
  min-height: 100px;
}
</style>
