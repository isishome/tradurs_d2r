<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Modifier, Filter } from 'src/types/item'
import { separator, ModifierType, BaseType, allLabel } from 'src/types/item'
import { useItemAddStore } from 'stores/item-add-store'
import { useAccountStore } from 'stores/account-store'

import BaseComponent from 'components/item/BaseComponent.vue'
import SearchComponent from 'components/item/SearchModifierComponent.vue'
import ModifierComponent from 'components/item/ModifierComponent.vue'

interface IProps {
  data: Filter
  disable?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  disable: false
})

const emit = defineEmits(['update', 'reset'])

const { t } = useI18n({ useScope: 'global' })
const ias = useItemAddStore()
const as = useAccountStore()

const _filter = ref<Filter>(JSON.parse(JSON.stringify(props.data)))
const _mine = reactive<{
  owned: string
  participating: string
  favorited: string
}>({
  owned: 'none',
  participating: 'none',
  favorited: 'none'
})

const updateFilter = (val?: Filter) => {
  Object.assign(_filter.value, val)
  emit('update', _filter.value)
}

const resetFilter = () => {
  emit('reset')
}

const updateMine = (val: string) => {
  _filter.value.mine = val

  Object.keys(_mine)
    .filter((k) => k !== val)
    .forEach((k) => {
      _mine[k as keyof typeof _mine] = 'none'
    })

  updateFilter()
}

// about modifier
const addModifierGroup = () => {
  _filter.value.modifierGroups?.push({ value: undefined, groups: [] })
}

const removeModifierGroup = (groupIdx: number) => {
  _filter.value.modifierGroups?.splice(groupIdx, 1)

  updateFilter()
}

const addModifier = (groupIdx: number, val: number) => {
  const text =
    [...ias.modifiers, ...ias.skills].find((m) => m.value === val)?.label ?? ''

  const addingModifier = {
    order: _filter.value.modifierGroups?.[groupIdx].groups.length,
    type: ModifierType.String,
    id: val,
    children: ias.findChildren(text.replace(separator, '0'), text, val)
  }
  _filter.value.modifierGroups?.[groupIdx].groups.push(
    addingModifier as Modifier
  )

  if (_filter.value.modifierGroups?.[groupIdx].value)
    _filter.value.modifierGroups[groupIdx].value = undefined

  updateFilter()
}

const removeModifier = (groupIdx: number, order: number) => {
  const findModifierIndex =
    _filter.value.modifierGroups?.[groupIdx].groups.findIndex(
      (m) => m.order === order
    ) ?? -1

  if (findModifierIndex !== -1)
    _filter.value.modifierGroups?.[groupIdx].groups?.splice(
      findModifierIndex,
      1
    )

  updateFilter()
}

const updateModifier = (groupIdx: number, val: Modifier) => {
  const findModifier = _filter.value.modifierGroups?.[groupIdx].groups.find(
    (m) => m.id === val.id
  )

  if (findModifier) Object.assign(findModifier, val)

  updateFilter()
}

watch(
  () => props.data,
  (val, old) => {
    if (!!val && val !== old) {
      _filter.value = val
      _mine[val.mine as keyof typeof _mine] = val.mine ?? 'none'
    }
  },
  { deep: true, immediate: true }
)
</script>
<template>
  <div class="filter-wrap column q-gutter-y-sm items-end" :class="{ disable }">
    <q-btn
      aria-label="Tradurs Reset Button"
      outline
      class="full-width"
      :label="t('filter.reset')"
      icon="refresh"
      @click="resetFilter"
    />
    <q-separator class="full-width q-my-md" />
    <template v-if="as.signed">
      <div class="full-width column q-gutter-y-sm bg-brighten rounded-borders">
        <div class="q-pl-sm">
          <q-checkbox
            v-model="_mine.owned"
            :label="t('filter.owned')"
            left-label
            size="sm"
            true-value="owned"
            false-value="none"
            @update:model-value="updateMine"
          />
        </div>
        <div class="q-pl-sm">
          <q-checkbox
            v-model="_mine.participating"
            :label="t('filter.participating')"
            left-label
            size="sm"
            true-value="participating"
            false-value="none"
            @update:model-value="updateMine"
          />
        </div>
        <div class="q-pl-sm">
          <q-checkbox
            v-model="_mine.favorited"
            :label="t('filter.favorited')"
            left-label
            size="sm"
            true-value="favorited"
            false-value="none"
            @update:model-value="updateMine"
          />
        </div>
      </div>
      <q-separator class="full-width q-my-md" />
    </template>
    <BaseComponent
      class="q-mt-none"
      :data="_filter"
      :type="BaseType.Filter"
      @update="updateFilter"
    />
    <q-separator class="full-width q-mt-md q-mb-sm" />
    <q-select
      filled
      class="full-width"
      v-model="_filter.statusCode"
      :options="[allLabel(), ...ias.status().filter((s) => s.value !== '009')]"
      :label="t('filter.status')"
      map-options
      emit-value
      no-error-icon
      hide-bottom-space
      @update:model-value="updateFilter()"
    />
    <q-separator class="full-width q-mt-md q-mb-sm" />
    <q-btn
      aria-label="Tradurs Add Affix Group Button"
      :disable="(_filter.modifierGroups?.length ?? 0) > 2"
      class="full-width"
      color="primary"
      text-color="dark"
      :label="t('filter.addAffixGroup')"
      @click="addModifierGroup"
    />
    <q-list
      v-for="(mg, idx) in _filter.modifierGroups"
      :key="idx"
      separator
      bordered
      class="full-width scroll"
    >
      <q-item class="bg-brighten">
        <q-item-section>
          <q-item-label>
            <SearchComponent
              :disable="mg.groups.length > 2"
              v-model="mg.value"
              @update:model-value="(val) => addModifier(idx, val)"
            />
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            aria-label="Tradurs Remove Button"
            icon="close"
            dense
            flat
            @click="removeModifierGroup(idx)"
          />
        </q-item-section>
        <q-list> </q-list>
      </q-item>
      <ModifierComponent
        v-for="m in mg.groups"
        :key="m.order"
        :type="BaseType.Filter"
        :data="m"
        :options="[...ias.modifiers, ...ias.skills]"
        editable
        @remove="(val) => removeModifier(idx, val)"
        @update="(val) => updateModifier(idx, val)"
      />
    </q-list>
  </div>
</template>

<style lang="scss" scoped>
.filter-wrap {
  width: 100%;

  &.disable {
    user-select: none;
    cursor: not-allowed !important;
    opacity: 0.6;

    &:deep(*) {
      pointer-events: none;
      cursor: not-allowed !important;
    }
  }
}
</style>
