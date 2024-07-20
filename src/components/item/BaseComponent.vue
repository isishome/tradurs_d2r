<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { QForm, QSelect } from 'quasar'
import { useItemStore } from 'src/stores/item-store'
import type { Item } from 'src/types/item'
import { defaultItem } from 'src/types/item'

const props = defineProps<{
  data?: Item
}>()

const emit = defineEmits(['update'])

const is = useItemStore()

const formRef = ref<QForm>()
const _item = ref<Item>(defaultItem())
//const _item = ref<string | undefined>(props.data?.item)

const update = () => {
  emit('update', _item.value)
}

const updateQuality = () => {
  _item.value.category = undefined
  _item.value.itemType = undefined
  _item.value.classType = undefined
  _item.value.detailType = undefined
  _item.value.item = undefined
  _item.value.imageType = undefined

  update()
}

const updateCategory = () => {
  _item.value.itemType = undefined
  _item.value.classType = undefined
  _item.value.detailType = undefined
  _item.value.item = undefined
  _item.value.imageType = undefined

  update()
}

const updateItemType = () => {
  _item.value.classType = undefined
  _item.value.detailType = undefined
  _item.value.item = undefined
  _item.value.imageType = undefined

  update()
}

const updateClassType = () => {
  _item.value.detailType = undefined
  _item.value.item = undefined
  _item.value.imageType = undefined

  update()
}

const updateDetailType = () => {
  let findItem
  if (['weapons', 'armor'].includes(_item.value.category as string)) {
    if (_item.value.category === 'weapons')
      findItem = is.weapons().find((w) => w.value === _item.value.detailType)
    else if (_item.value.category === 'armor')
      findItem = is.armor().find((a) => a.value === _item.value.detailType)
  }

  if (findItem) _item.value.imageType = findItem?.imageType

  update()
}

const updateItem = () => {
  let findItem
  if (['weapons', 'armor', 'charms'].includes(_item.value.category as string)) {
    if (_item.value.quality === 'unique')
      findItem = is
        .uniques(_item.value.category)
        .find((u) => u.value === _item.value.item)
    else if (_item.value.quality === 'set')
      findItem = is
        .setItems(_item.value.category)
        .find((s) => s.value === _item.value.item)
  }

  if (findItem) {
    _item.value.itemType = findItem.itemType
    _item.value.classType = findItem?.classType
    _item.value.detailType = findItem?.detailType
    _item.value.imageType = findItem?.imageType
  }

  update()
}

const validate = async () => {
  return await formRef?.value?.validate()
}

// about detailType
const detailTypeRef = ref<QSelect | null>(null)
const detailTypeNeedle = ref<string>()
const detailTypeOptions = computed(() =>
  (_item.value.category === 'weapons'
    ? is.weapons(_item.value.itemType, _item.value.classType)
    : _item.value.category === 'armor'
    ? is.armor(_item.value.itemType, _item.value.classType)
    : []
  ).filter(
    (dt) =>
      dt.label.indexOf(detailTypeNeedle.value as string) !==
      (!!detailTypeNeedle.value ? -1 : -2)
  )
)

const filterDetailType = (e: KeyboardEvent) => {
  const val = (e.target as HTMLInputElement).value.toLowerCase()
  detailTypeRef.value?.showPopup()
  detailTypeRef.value?.updateInputValue(val)
  detailTypeNeedle.value = val
}

const selectDetailType = (val: number): void => {
  if (val) {
    detailTypeRef.value?.hidePopup()
    updateDetailType()
    detailTypeNeedle.value = undefined
  }
}

// about item
const itemRef = ref<QSelect | null>(null)
const itemNeedle = ref<string>()
const itemOptions = computed(() =>
  (_item.value.quality === 'unique'
    ? is.uniques(_item.value.category)
    : _item.value.quality === 'set'
    ? is.setItems(_item.value.category)
    : _item.value.category === 'runes'
    ? is.runes
    : _item.value.category === 'gems'
    ? is.gems
    : _item.value.category === 'misc'
    ? is.misc
    : []
  ).filter(
    (dt) =>
      dt.label.indexOf(itemNeedle.value as string) !==
      (!!itemNeedle.value ? -1 : -2)
  )
)

const filterItem = (e: KeyboardEvent) => {
  const val = (e.target as HTMLInputElement).value.toLowerCase()
  itemRef.value?.showPopup()
  itemRef.value?.updateInputValue(val)
  itemNeedle.value = val
}

const selectItem = (val: number): void => {
  if (val) {
    itemRef.value?.hidePopup()
    updateItem()
    itemNeedle.value = undefined
  }
}

watch(
  () => props.data,
  (val) => {
    Object.assign(_item.value, val)
  },
  { immediate: true, deep: true }
)

defineExpose({ validate })
</script>
<template>
  <q-form ref="formRef" class="column q-gutter-y-sm">
    <div>
      <q-select
        filled
        v-model="_item.region"
        :options="is.regions"
        label="지역"
        map-options
        emit-value
        no-error-icon
        hide-bottom-space
        @update:model-value="update"
        :rules="[(val) => !!val || '지역을 선택하세요']"
      />
    </div>
    <div class="q-pl-sm">
      <q-checkbox
        v-model="_item.ladder"
        label="래더"
        left-label
        size="sm"
        @update:model-value="update"
      />
    </div>
    <div class="q-pl-sm">
      <q-checkbox
        v-model="_item.hardcore"
        label="하드코어"
        left-label
        size="sm"
        @update:model-value="update"
      />
    </div>
    <q-separator />
    <div class="q-pl-sm q-py-xs row items-center q-gutter-x-sm">
      <div>
        {{ (is.socket.label ?? '').replace(/%i/i, `${_item.socket}`) }}
      </div>
      <q-rating
        v-model="_item.socket"
        size="sm"
        color="grey"
        icon="circle"
        icon-selected="radio_button_checked"
        max="6"
        color-selected="primary"
        @update:model-value="update"
      />
    </div>
    <div class="q-pl-sm">
      <q-checkbox
        v-model="_item.ethereal"
        :label="is.ethereal.label"
        left-label
        size="sm"
        @update:model-value="update"
      />
    </div>
    <q-select
      filled
      v-model="_item.quality"
      :options="is.quality"
      label="품질"
      map-options
      emit-value
      no-error-icon
      hide-bottom-space
      @update:model-value="updateQuality"
      :rules="[(val) => !!val || '품질을 선택하세요']"
    >
      <template #option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label :style="`color:var(--quality-${scope.opt.value})`">
              {{ scope.opt.label }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-select
      :disable="!!!_item.quality"
      filled
      v-model="_item.category"
      :options="is.category(_item.quality)"
      label="카테고리"
      map-options
      emit-value
      no-error-icon
      hide-bottom-space
      @update:model-value="updateCategory"
      :rules="[(val) => !!val || '카테고리를 선택하세요']"
    />
    <template
      v-if="!['unique', 'set'].includes(_item.quality as string) && ['weapons', 'armor', 'charms'].includes(_item.category as string)"
    >
      <q-select
        filled
        v-model="_item.itemType"
        :options="
          _item.category === 'weapons'
            ? is.weaponTypes
            : _item.category === 'armor'
            ? is.armorTypes(_item.quality)
            : _item.category === 'charms'
            ? is.charmTypes
            : []
        "
        :label="
          _item.category === 'weapons'
            ? '무기 유형'
            : _item.category === 'armor'
            ? '방어구 유형'
            : _item.category === 'charms'
            ? '부적 유형'
            : ''
        "
        map-options
        emit-value
        no-error-icon
        hide-bottom-space
        @update:model-value="updateItemType"
      />
      <q-select
        v-if="_item.itemType === 'clas'"
        filled
        v-model="_item.classType"
        :options="is.classes(_item.quality, _item.category)"
        label="직업"
        map-options
        emit-value
        no-error-icon
        hide-bottom-space
        @update:model-value="updateClassType"
        :rules="[(val) => !!val || '직업을 선택하세요']"
      />
      <q-select
        v-if="_item.category !== 'charms' && !!_item.itemType"
        ref="detailTypeRef"
        v-model="_item.detailType"
        :options="detailTypeOptions"
        label="상세 유형"
        filled
        map-options
        emit-value
        no-error-icon
        hide-bottom-space
        use-input
        @input.stop="filterDetailType"
        @blur="() => (detailTypeNeedle = undefined)"
        @update:model-value="selectDetailType"
        :rules="[(val) => !!val || '상세 유형을 선택하세요']"
      >
        <template #no-option>
          <q-item>
            <q-item-section>상세 유형을 찾을 수 없습니다.</q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-select
        v-if="_item.quality === 'runewords'"
        :disable="
          is.runewords(
            _item.category === 'weapons' ? _item.itemType : undefined,
            _item.category === 'armor' ? _item.itemType : undefined,
            _item.classType
          ).length === 0
        "
        filled
        v-model="_item.item"
        :options="
          is.runewords(
            _item.category === 'weapons' ? _item.itemType : undefined,
            _item.category === 'armor' ? _item.itemType : undefined,
            _item.classType
          )
        "
        label="룬어"
        map-options
        emit-value
        no-error-icon
        hide-bottom-space
        @update:model-value="update"
        :rules="[(val) => !!val || '룬어를 선택하세요']"
      />
    </template>
    <q-select
      v-else-if="['unique', 'set'].includes(_item.quality as string) || ['runes', 'gems', 'misc'].includes(_item.category as string)"
      ref="itemRef"
      v-model="_item.item"
      :options="itemOptions"
      :label="
        _item.category === 'runes'
          ? '룬'
          : _item.category === 'gems'
          ? '보석'
          : '아이템'
      "
      filled
      map-options
      emit-value
      no-error-icon
      hide-bottom-space
      use-input
      @input.stop="filterItem"
      @blur="() => (itemNeedle = undefined)"
      @update:model-value="selectItem"
      :rules="[(val) => !!val || '아이템을 선택하세요']"
    >
      <template #no-option>
        <q-item>
          <q-item-section>아이템을 찾을 수 없습니다.</q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-input
      v-if="['magic', 'rare','crafted'].includes(_item.quality as string)"
      filled
      no-error-icon
      hide-bottom-space
      v-model="_item.name"
      maxlength="256"
      label="아이템 명"
      @update:model-value="update"
      :rules="[(val) => !!val || '아이템명을 입력하세요']"
    />
    <q-separator />
    <q-input
      filled
      no-error-icon
      hide-bottom-space
      v-model.number="_item.quantity"
      type="tel"
      mask="#"
      fill-mask="0"
      reverse-fill-mask
      label="수량"
      @update:model-value="update"
      :rules="[(val) => !!val || '수량을 입력하세요']"
    />
  </q-form>
</template>
