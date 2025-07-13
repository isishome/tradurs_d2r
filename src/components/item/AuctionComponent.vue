<script setup lang="ts">
import { ref, computed } from 'vue'
import { QForm } from 'quasar'
import { useI18n } from 'vue-i18n'
import type { Price } from 'src/types/item'
import { useItemAddStore } from 'stores/item-add-store'

const props = defineProps<{
  data: Price
  progressTime: number
}>()

const emit = defineEmits(['update'])

const { t } = useI18n({ useScope: 'global' })
const ias = useItemAddStore()
const categoryOptions = computed(() =>
  ias.category('normal').filter((c) => c.currency)
)
const formRef = ref<QForm>()
const _price = ref<Price>(props.data)
const _progressTime = ref<number>(props.progressTime)
const hours = computed(() =>
  _progressTime.value / 60 >= 1
    ? Math.round(_progressTime.value / 60)
    : undefined
)
const minutes = computed(() =>
  _progressTime.value % 60 > 0 ? _progressTime.value % 60 : undefined
)

const progressTimeRules = (val: number) => {
  let message

  if (!!!val) message = t('auction.requireProgressTime')
  else if (val < 5 || val > 1440) message = t('auction.allowProgressTime')

  return !!!message || message
}

const update = () => {
  _price.value.instantAmount = _price.value.instantAmount || undefined
  emit('update', _price.value, _progressTime.value)
}

const updateCategory = () => {
  _price.value.item = undefined
  _price.value.unitAmount = 1
  _price.value.startAmount = 1
  _price.value.instantAmount = undefined

  update()
}

const updateItem = () => {
  _price.value.unitAmount = _price.value.item === 2215 ? 100000 : 1
  _price.value.startAmount = _price.value.item === 2215 ? 100000 : 1
  _price.value.instantAmount = undefined

  update()
}

const validate = async () => {
  return await formRef?.value?.validate()
}

defineExpose({ validate })
</script>

<template>
  <q-form ref="formRef" class="column q-gutter-y-sm">
    <div>
      <q-select
        filled
        v-model="_price.category"
        :options="categoryOptions"
        :label="t('auction.category')"
        map-options
        emit-value
        no-error-icon
        hide-bottom-space
        @update:model-value="updateCategory"
        :rules="[(val) => !!val || t('auction.selectCategory')]"
      />
    </div>
    <div>
      <q-select
        filled
        v-model="_price.item"
        :options="
          _price.category === 'runes'
            ? ias.runes
            : _price.category === 'gems'
            ? ias.gems
            : _price.category === 'misc'
            ? ias.misc
            : []
        "
        :label="
          _price.category === 'runes'
            ? t('auction.runes')
            : _price.category === 'gems'
            ? t('auction.gems')
            : t('auction.itemName')
        "
        map-options
        emit-value
        no-error-icon
        hide-bottom-space
        @update:model-value="updateItem"
        :rules="[(val) => !!val || t('auction.selectItemName')]"
      />
    </div>
    <div>
      <q-input
        filled
        no-error-icon
        hide-bottom-space
        v-model.number="_price.unitAmount"
        maxlength="9"
        type="tel"
        mask="#"
        fill-mask="0"
        reverse-fill-mask
        :label="t('auction.unitAmount')"
        @update:model-value="update"
        :rules="[(val) => !!val || t('auction.insertUnitAmount')]"
      />
    </div>
    <div>
      <q-input
        filled
        no-error-icon
        hide-bottom-space
        v-model.number="_price.startAmount"
        maxlength="9"
        type="tel"
        mask="#"
        fill-mask="0"
        reverse-fill-mask
        :label="t('auction.startAmount')"
        @update:model-value="update"
        :rules="[(val) => !!val || t('auction.insertStartAmount')]"
      />
    </div>
    <div>
      <q-input
        filled
        no-error-icon
        hide-bottom-space
        v-model.number="_price.instantAmount"
        maxlength="9"
        type="tel"
        mask="#"
        reverse-fill-mask
        :label="t('auction.instantAmount')"
        @update:model-value="update"
      />
    </div>
    <div>
      <q-input
        filled
        no-error-icon
        hide-bottom-space
        v-model.number="_progressTime"
        maxlength="4"
        type="tel"
        mask="#"
        fill-mask="0"
        reverse-fill-mask
        :label="t('auction.progressTime')"
        @update:model-value="update"
        :rules="[progressTimeRules]"
      >
        <template #hint>
          <div class="row q-gutter-xs items-center">
            <div v-show="hours">{{ hours }}{{ t('auction.hour') }}</div>
            <div v-show="minutes">{{ minutes }}{{ t('auction.minutes') }}</div>
          </div>
        </template>
      </q-input>
    </div>
  </q-form>
</template>
