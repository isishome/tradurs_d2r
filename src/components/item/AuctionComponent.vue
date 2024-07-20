<script setup lang="ts">
import { ref, computed } from 'vue'
import { QForm } from 'quasar'
import type { Price } from 'src/types/item'
import { useItemStore } from 'stores/item-store'

const props = defineProps<{
  data: Price
  progressTime: number
}>()

const emit = defineEmits(['update'])

const is = useItemStore()
const categoryOptions = computed(() =>
  is.category('normal').filter((c) => c.currency)
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
        label="카테고리"
        map-options
        emit-value
        no-error-icon
        hide-bottom-space
        @update:model-value="updateCategory"
        :rules="[(val) => !!val || '카테고리를 선택하세요']"
      />
    </div>
    <div>
      <q-select
        filled
        v-model="_price.item"
        :options="
          _price.category === 'runes'
            ? is.runes
            : _price.category === 'gems'
            ? is.gems
            : _price.category === 'misc'
            ? is.misc
            : []
        "
        :label="
          _price.category === 'runes'
            ? '룬'
            : _price.category === 'gems'
            ? '보석'
            : '아이템 명'
        "
        map-options
        emit-value
        no-error-icon
        hide-bottom-space
        @update:model-value="updateItem"
        :rules="[(val) => !!val || '아이템명을 선택하세요']"
      />
    </div>
    <div>
      <q-input
        filled
        no-error-icon
        hide-bottom-space
        v-model.number="_price.unitAmount"
        type="tel"
        mask="#"
        fill-mask="0"
        reverse-fill-mask
        label="최소 단위"
        @update:model-value="update"
        :rules="[(val) => !!val || '경매 최소 단위를 입력하세요']"
      />
    </div>
    <div>
      <q-input
        filled
        no-error-icon
        hide-bottom-space
        v-model.number="_price.startAmount"
        type="tel"
        mask="#"
        fill-mask="0"
        reverse-fill-mask
        label="시작 수량(금액)"
        @update:model-value="update"
        :rules="[(val) => !!val || '경매 시작 수량을 입력하세요']"
      />
    </div>
    <div>
      <q-input
        filled
        no-error-icon
        hide-bottom-space
        v-model.number="_price.instantAmount"
        type="tel"
        mask="#"
        reverse-fill-mask
        label="즉시 구입 수량(금액)"
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
        label="경매 진행 시간(분)"
        @update:model-value="update"
        :rules="[(val) => !!val || '경매 진행 시간을 입력하세요']"
      >
        <template #hint>
          <div class="row q-gutter-xs items-center">
            <div v-show="hours">{{ hours }}시간</div>
            <div v-show="minutes">{{ minutes }}분</div>
          </div>
        </template>
      </q-input>
    </div>
  </q-form>
</template>
