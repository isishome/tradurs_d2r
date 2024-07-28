<script setup lang="ts">
import { ref, computed } from 'vue'
import { QSelect } from 'quasar'
import { useI18n } from 'vue-i18n'

import { useItemAddStore } from 'src/stores/item-add-store'

interface IProps {
  modelValue?: number
  disable?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: undefined,
  disable: false
})

const emit = defineEmits(['update:model-value'])

const { t } = useI18n({ useScope: 'global' })
const ias = useItemAddStore()

const searchRef = ref<QSelect | null>()
const search = ref<number | undefined>(props.modelValue)
const searchNeedle = ref<string>()
const searchOptions = computed(() =>
  [...ias.modifiers, ...ias.skills].filter(
    (mf) =>
      mf.label
        .toLowerCase()
        .indexOf((searchNeedle.value ?? '').toLocaleLowerCase()) !==
      (!!searchNeedle.value ? -1 : -2)
  )
)

const filter = (e: KeyboardEvent) => {
  const val = (e.target as HTMLInputElement).value.toLowerCase()
  searchRef.value?.showPopup()
  searchRef.value?.updateInputValue(val)
  searchNeedle.value = val
}

const select = (val: number | undefined): void => {
  if (val) {
    searchRef.value?.hidePopup()
    emit('update:model-value', val)
    searchNeedle.value = undefined
  }
}
</script>

<template>
  <q-select
    ref="searchRef"
    :disable="disable"
    :options="searchOptions"
    v-model="search"
    map-options
    emit-value
    standout
    input-class="text-white"
    dense
    :label="t('filter.addAffixFilter')"
    bg-color="blue-grey-8"
    style="min-width: 200px"
    use-input
    hide-selected
    @blur="() => (searchNeedle = undefined)"
    @input.stop="filter"
    @update:model-value="select"
  >
    <template #no-option>
      <q-item>
        <q-item-section> {{ t('filter.noAffixData') }}</q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
