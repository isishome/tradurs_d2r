<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { QForm, QSelect } from 'quasar'
import type { Item } from 'src/types/item'
import { BaseType, defaultItem, allLabel } from 'src/types/item'
import { useItemAddStore } from 'src/stores/item-add-store'

type Props = {
  data?: Item
  type?: BaseType
}

const props = withDefaults(defineProps<Props>(), {
  type: BaseType.Default
})

const emit = defineEmits(['update'])

const { t } = useI18n({ useScope: 'global' })
const ias = useItemAddStore()

const formRef = ref<QForm>()
const _item = ref<Item>(defaultItem())

const chainingName = computed(
  () =>
    [...ias.nameAffixes, ...ias.names]
      .filter((ns) => _item.value.names.includes(ns.id))
      .map((ns) => ns.label)
      .join(' ')
      .trim() || undefined
)

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
  _item.value.imageId = undefined
  _item.value.name = undefined
  _item.value.names = []
  _item.value.quantity = 1

  update()
}

const updateCategory = () => {
  _item.value.itemType = undefined
  _item.value.classType = undefined
  _item.value.detailType = undefined
  _item.value.item = undefined
  _item.value.imageType = undefined
  _item.value.imageId = undefined
  _item.value.name = undefined
  _item.value.names = []
  _item.value.quantity = 1

  update()
}

const updateItemType = () => {
  _item.value.classType = undefined
  _item.value.detailType = undefined
  _item.value.item = undefined
  _item.value.imageType = undefined
  _item.value.imageId = undefined
  _item.value.name = undefined
  _item.value.names = []
  _item.value.quantity = 1

  update()
}

const updateClassType = () => {
  _item.value.detailType = undefined
  _item.value.item = undefined
  _item.value.imageType = undefined
  _item.value.imageId = undefined
  _item.value.name = undefined
  _item.value.names = []
  _item.value.quantity = 1

  update()
}

const updateDetailType = () => {
  let findItem
  if (['weapons', 'armor'].includes(_item.value.category as string)) {
    if (_item.value.category === 'weapons')
      findItem = ias.weapons().find((w) => w.value === _item.value.detailType)
    else if (_item.value.category === 'armor')
      findItem = ias.armor().find((a) => a.value === _item.value.detailType)
  }

  if (findItem) _item.value.imageType = findItem?.imageType

  update()
}

const updateItem = () => {
  let findItem
  if (['weapons', 'armor', 'charms'].includes(_item.value.category as string)) {
    if (_item.value.quality === 'unique')
      findItem = ias
        .uniques(_item.value.category)
        .find((u) => u.value === _item.value.item)
    else if (_item.value.quality === 'set')
      findItem = ias
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
    ? ias.weapons(_item.value.itemType, _item.value.classType)
    : _item.value.category === 'armor'
    ? ias.armor(_item.value.itemType, _item.value.classType)
    : []
  ).filter(
    (dt) =>
      dt.label
        .toLowerCase()
        .indexOf((detailTypeNeedle.value ?? '').toLowerCase()) !==
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
    ? ias.uniques(_item.value.category)
    : _item.value.quality === 'set'
    ? ias.setItems(_item.value.category)
    : _item.value.category === 'runes'
    ? ias.runes
    : _item.value.category === 'gems'
    ? ias.gems
    : _item.value.category === 'misc'
    ? ias.misc
    : []
  ).filter(
    (dt) =>
      dt.label.toLowerCase().indexOf((itemNeedle.value ?? '').toLowerCase()) !==
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
  <q-form ref="formRef" class="full-width column q-gutter-y-sm">
    <div>
      <q-select
        filled
        v-model="_item.region"
        :options="
          type === BaseType.Filter ? [allLabel(), ...ias.regions] : ias.regions
        "
        :label="t('base.region')"
        map-options
        emit-value
        no-error-icon
        hide-bottom-space
        @update:model-value="update"
        :rules="[(val) => !!val || t('base.selectRegion')]"
      />
    </div>
    <div class="q-pl-sm">
      <q-checkbox
        v-model="_item.ladder"
        :label="t('base.ladder')"
        left-label
        size="sm"
        @update:model-value="update"
      />
    </div>
    <div class="q-pl-sm">
      <q-checkbox
        v-model="_item.hardcore"
        :label="t('base.hardcore')"
        left-label
        size="sm"
        @update:model-value="update"
      />
    </div>
    <q-separator />
    <div class="q-pl-sm q-py-xs row items-center q-gutter-x-sm">
      <div>
        {{ (ias.socket.label ?? '').replace(/%i/i, `${_item.socket}`) }}
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
        :label="ias.ethereal.label"
        left-label
        size="sm"
        :toggle-indeterminate="type === BaseType.Filter"
        @update:model-value="update"
      />
    </div>
    <q-select
      filled
      v-model="_item.quality"
      :options="
        type === BaseType.Filter ? [allLabel(), ...ias.quality] : ias.quality
      "
      :label="t('base.quality')"
      map-options
      emit-value
      no-error-icon
      hide-bottom-space
      @update:model-value="updateQuality"
      :rules="[(val) => !!val || t('base.selectQuality')]"
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
      :disable="!!!_item.quality || _item.quality === 'all'"
      filled
      v-model="_item.category"
      :options="ias.category(_item.quality)"
      :label="t('base.category')"
      map-options
      emit-value
      no-error-icon
      hide-bottom-space
      @update:model-value="updateCategory"
      :rules="[(val) => !!val || t('base.selectCategory')]"
    />
    <template
      v-if="!['unique', 'set'].includes(_item.quality as string) && ['weapons', 'armor', 'charms'].includes(_item.category as string)"
    >
      <q-select
        filled
        v-model="_item.itemType"
        :options="
          _item.category === 'weapons'
            ? ias.weaponTypes
            : _item.category === 'armor'
            ? ias.armorTypes(_item.quality)
            : _item.category === 'charms'
            ? ias.charmTypes
            : []
        "
        :label="
          _item.category === 'weapons'
            ? t('base.weaponType')
            : _item.category === 'armor'
            ? t('base.armorType')
            : _item.category === 'charms'
            ? t('base.charmType')
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
        :options="ias.classes(_item.quality, _item.category)"
        :label="t('base.classType')"
        map-options
        emit-value
        no-error-icon
        hide-bottom-space
        @update:model-value="updateClassType"
        :rules="[(val) => !!val || t('base.selectClass')]"
      />
      <q-select
        v-if="_item.category !== 'charms' && !!_item.itemType"
        ref="detailTypeRef"
        v-model="_item.detailType"
        :options="detailTypeOptions"
        :label="t('base.detailType')"
        filled
        map-options
        emit-value
        no-error-icon
        hide-bottom-space
        use-input
        @input.stop="filterDetailType"
        @blur="() => (detailTypeNeedle = undefined)"
        @update:model-value="selectDetailType"
        :rules="[(val) => !!val || t('base.selectDetailType')]"
      >
        <template #no-option>
          <q-item>
            <q-item-section>{{ t('base.detailTypeNotFound') }}</q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-select
        v-if="_item.quality === 'runewords'"
        :disable="
          ias.runewords(
            _item.category === 'weapons' ? _item.itemType : undefined,
            _item.category === 'armor' ? _item.itemType : undefined,
            _item.classType
          ).length === 0
        "
        filled
        v-model="_item.item"
        :options="
          ias.runewords(
            _item.category === 'weapons' ? _item.itemType : undefined,
            _item.category === 'armor' ? _item.itemType : undefined,
            _item.classType
          )
        "
        :label="t('base.runeword')"
        map-options
        emit-value
        no-error-icon
        hide-bottom-space
        @update:model-value="update"
        :rules="[(val) => !!val || t('base.selectRuneword')]"
      />
    </template>
    <q-select
      v-else-if="['unique', 'set'].includes(_item.quality as string) || ['runes', 'gems', 'misc'].includes(_item.category as string)"
      ref="itemRef"
      v-model="_item.item"
      :options="itemOptions"
      :label="
        _item.category === 'runes'
          ? t('base.runes')
          : _item.category === 'gems'
          ? t('base.gems')
          : t('base.item')
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
      :rules="[(val) => !!val || t('base.selectItem')]"
    >
      <template #no-option>
        <q-item>
          <q-item-section>{{ t('base.itemNotFound') }}</q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-input
      v-if="['magic', 'rare','crafted'].includes(_item.quality as string) && type!==BaseType.Filter"
      filled
      no-error-icon
      hide-bottom-space
      v-model="_item.name"
      :placeholder="chainingName ?? t('base.itemName')"
      maxlength="256"
      @update:model-value="update"
      :rules="[(val) => !!chainingName || !!val || t('base.insertItemName')]"
    />
    <template v-if="type === 'default'">
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
        :label="t('base.quantity')"
        @update:model-value="update"
        :rules="[(val) => !!val || t('base.insertQuantity')]"
      />
    </template>
  </q-form>
</template>
