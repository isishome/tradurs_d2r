<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { QCardSection, QForm, QInput, date } from 'quasar'
import type { Bid, Item } from 'src/types/item'
import { useGlobalStore } from 'stores/global-store'
import { useAccountStore } from 'stores/account-store'

import CurrencyComponent from 'components/item/CurrencyComponent.vue'

type Props = {
  data?: Array<Bid>
  item?: Item
}

const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['add'])

const { t } = useI18n({ useScope: 'global' })
const gs = useGlobalStore()
const as = useAccountStore()
const loadingCount = computed(() => gs.loadingCount)
const _amount = ref<number>(0)
const bidRef = ref<QCardSection>()
const bidFormRef = ref<QForm>()
const amountRef = ref<QInput>()
const minAmount = computed(() => props.item?.price.startAmount ?? 1)
const maxAmount = computed(() =>
  props.data && props.data.length > 0
    ? Math.max(...props.data?.map((b) => b.amount))
    : 0
)

const biddingRules = (val: number) => {
  let message
  if (val < minAmount.value) message = t('bid.startAmountRule')
  else if (val % (props.item?.price.unitAmount ?? 1) !== 0)
    message = t('bid.bidAmountRule')
  else if (
    !!props.item?.price.instantAmount &&
    val > props.item?.price.instantAmount
  )
    message = t('bid.instantAmountRule')
  else if (val <= maxAmount.value) message = t('bid.lastBidAmountRule')

  return !!message ? false || message : true || ''
}

const add = () => {
  emit('add', _amount.value)
  setTimeout(() => {
    amountRef.value?.focus()
  }, 0)
}

watch(
  () => props.data,
  () => {
    nextTick(() => {
      window.requestAnimationFrame(() => {
        const el = bidRef.value?.$el
        if (el) el.scrollTop = el.scrollHeight as number
      })
    })
  },
  { deep: true }
)
</script>

<template>
  <q-card flat bordered class="bids column">
    <q-toolbar class="bg-brighten q-py-sm">
      <div class="col">
        <CurrencyComponent
          :category="item?.price.category"
          :item="item?.price.item"
          :quantity="item?.price.startAmount"
          :title="t('auction.startAmount')"
          style="max-height: 30px"
        />
      </div>
      <q-separator vertical />
      <div class="col">
        <CurrencyComponent
          :category="item?.price.category"
          :item="item?.price.item"
          :quantity="item?.price.unitAmount"
          :title="t('auction.unitAmount')"
          style="max-height: 30px"
        />
      </div>
      <template v-if="!!item?.price.instantAmount">
        <q-separator vertical />
        <div class="col">
          <CurrencyComponent
            :category="item.price.category"
            :item="item.price.item"
            :quantity="item.price.instantAmount"
            :title="t('auction.instantAmount')"
            style="max-height: 30px"
          />
        </div>
      </template>
    </q-toolbar>
    <q-card-section ref="bidRef" class="scroll col">
      <div
        v-if="!!data && data.length === 0"
        class="fit row justify-center items-center"
      >
        {{ !!item?.startDate ? t('bid.noBids') : t('bid.waitAuction') }}
      </div>
      <div v-else class="column q-gutter-y-md">
        <q-chat-message
          v-for="b in data"
          :key="b.id"
          :avatar="`/images/avatar/${b.user?.avatar}.webp`"
          :bg-color="b.won ? 'primary' : 'brighten'"
          :text-color="b.won ? 'dark' : 'white'"
          :sent="b.user?.owner"
        >
          <template #default>
            <div class="row justify-start">
              <CurrencyComponent
                :category="item?.price.category"
                :item="item?.price.item"
                :quantity="b.amount"
              />
            </div>
          </template>
          <template #stamp>
            <div>
              <div>
                {{ date.formatDate(b.regDate, 'YYYY.MM.DD') }}
              </div>
              <div>
                {{
                  new Date(
                    parseInt(date.formatDate(b.regDate, 'x'))
                  ).toLocaleTimeString()
                }}
              </div>
            </div>
          </template>
        </q-chat-message>
      </div>
    </q-card-section>
    <template
      v-if="
        !item?.user?.owner && as.signed && item?.statusCode === '000' && !!data
      "
    >
      <q-separator />
      <q-card-section>
        <q-form
          ref="bidFormRef"
          class="row justify-end items-center q-gutter-md"
          @submit="add"
        >
          <q-input
            ref="amountRef"
            class="col q-pt-md"
            :disable="loadingCount > 0"
            outlined
            no-error-icon
            v-model.number="_amount"
            maxlength="9"
            type="tel"
            mask="#"
            fill-mask="0"
            reverse-fill-mask
            :label="t('bid.bidAmount')"
            :rules="[biddingRules]"
          />
          <q-btn
            aria-label="Tradurs Bidding Button"
            :disable="loadingCount > 0"
            class="text-weight-bold"
            color="primary"
            text-color="dark"
            :label="t('bid.bidding')"
            type="submit"
          />
        </q-form>
      </q-card-section>
    </template>
  </q-card>
</template>

<style lang="scss" scoped>
.bids {
  border-radius: 20px;
}

.bids {
  &:deep(.q-message-text--sent) {
    border-radius: 16px 16px 0 16px;
  }

  &:deep(.q-message-text--received) {
    border-radius: 16px 16px 16px 0;
  }
}
</style>
