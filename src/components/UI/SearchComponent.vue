<script setup lang="ts">
import { ref, computed } from 'vue'
import { QSelect } from 'quasar'
import type { Label } from 'src/types/global'

const props = defineProps<{
  modelValue?: string | number
  options: Array<Label>
  noData?: string
}>()

const emit = defineEmits(['update:model-value'])

const searchRef = ref<QSelect | null>()
const search = ref<string | number | undefined>(props.modelValue)
const searchNeedle = ref<string>()
const searchOptions = computed(() =>
  props.options.filter(
    (o) =>
      o.label.indexOf(searchNeedle.value as string) !==
      (!!searchNeedle.value ? -1 : -2)
  )
)

const filter = (e: KeyboardEvent) => {
  const val = (e.target as HTMLInputElement).value.toLowerCase()
  searchRef.value?.showPopup()
  searchRef.value?.updateInputValue(val)
  searchNeedle.value = val
}

const select = (val: string | number): void => {
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
    v-model="search"
    map-options
    emit-value
    use-input
    :options="searchOptions"
    @blur="() => (searchNeedle = undefined)"
    @input.stop="filter"
    @update:model-value="select"
  >
    <template #no-option>
      <q-item>
        <q-item-section> {{ noData }} </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
