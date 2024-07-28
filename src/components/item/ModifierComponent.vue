<script setup lang="ts">
import { QSelect } from 'quasar'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Label } from 'src/types/global'
import type { Modifier } from 'src/types/item'
import { BaseType } from 'src/types/item'

import { separator, ModifierType } from 'src/types/item'

enum ModifierSplitType {
  Text = 'text',
  Modifier = 'modifier',
  Value = 'value'
}

type ModifierSplit = {
  type: ModifierSplitType
  sign?: string
  value: number | string | undefined
}

interface IProps {
  type?: BaseType
  data: Modifier
  options: Array<Label>
  editable?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  type: BaseType.Default,
  editable: false
})

const emit = defineEmits(['remove', 'update', 'place-modifier'])

const { t } = useI18n({ useScope: 'global' })

const filterOptions = computed(() => [
  ...props.options.filter(
    (m) => m.value !== props.data.id && !!!m.label.match(separator)
  )
])
const _modifier = ref<Modifier>(
  JSON.parse(JSON.stringify(props.data)) as Modifier
)
const _modifierSplit = ref<Array<ModifierSplit>>([])
const _modifierConnect = ref<Modifier | undefined>(
  _modifier.value.children?.find((c) => c.type === ModifierType.Connect)
)

const updateModifier = (ms: ModifierSplit, val?: number | string) => {
  ms.value = val
  update()
}

const update = () => {
  const values = _modifierSplit.value.filter((ms) =>
    [ModifierSplitType.Value, ModifierSplitType.Modifier].includes(ms.type)
  )
  _modifier.value.children?.forEach((c, idx) => {
    if (c.type === ModifierType.String) c.id = values[idx]?.value as number
    else if (c.type !== ModifierType.Connect)
      c.value = (values[idx]?.value as number) || 0
    else c.id = _modifierConnect.value?.id ?? undefined
  })

  emit('update', _modifier.value)
}

const findModifier = (id: number) => {
  return props.options
    .find((o) => o.value === id)
    ?.label.replace(/[%]{1,}/gi, '%')
}

// about connect
const connectRef = ref<QSelect | null>(null)
const connectNeedle = ref<string>()
const connectOptions = computed(() =>
  filterOptions.value.filter(
    (cf) =>
      cf.label
        .toLowerCase()
        .indexOf((connectNeedle.value ?? '').toLowerCase()) !==
      (!!connectNeedle.value ? -1 : -2)
  )
)

const filterConnect = (e: KeyboardEvent) => {
  const val = (e.target as HTMLInputElement).value.toLowerCase()
  connectRef.value?.showPopup()
  connectRef.value?.updateInputValue(val)
  connectNeedle.value = val
}

const selectConnect = (): void => {
  connectRef.value?.hidePopup()
  update()
  connectNeedle.value = undefined
}

onMounted(() => {
  const fm = findModifier(_modifier.value.id as number)
  const children = _modifier.value.children

  _modifierSplit.value.push(
    ...(fm
      ?.split(separator)
      .map((p) => ({ type: ModifierSplitType.Text, sign: '', value: p })) ?? [])
  )

  fm?.match(separator)?.forEach((s, i) => {
    _modifierSplit.value.splice(i * 2 + 1, 0, {
      type: s === '%s' ? ModifierSplitType.Modifier : ModifierSplitType.Value,
      sign: children?.[i]?.signed && (children?.[i]?.value ?? 0) > 0 ? '+' : '',
      value: s === '%s' ? children?.[i]?.id : children?.[i]?.value
    })
  })
})
</script>
<template>
  <q-item class="modifier" :dense="!editable" :class="{ plain: !editable }">
    <template v-if="editable">
      <slot v-if="!!$slots['front-side']" name="front-side"></slot>
      <q-item-section no-wrap>
        <q-item-label class="row justify-between q-gutter-sm items-center">
          <div class="row q-gutter-sm items-center">
            <template v-for="(ms, idx) in _modifierSplit" :key="idx">
              <div v-if="ms.type === ModifierSplitType.Text && !!ms.value">
                {{ ms.value }}
              </div>
              <q-input
                v-else-if="ms.type === ModifierSplitType.Value"
                v-model.number="ms.value"
                dense
                standout
                type="number"
                :debounce="500"
                @update:model-value="update"
              />
              <D2Search
                v-else-if="ms.type === ModifierSplitType.Modifier"
                :options="connectOptions"
                v-model="ms.value"
                dense
                standout
                @update:model-value="(val:number) => updateModifier(ms, val)"
                :noData="t('modifier.noAddData')"
              />
            </template>
          </div>
          <q-select
            v-if="_modifierConnect && type === BaseType.Default"
            :options="connectOptions"
            ref="connectRef"
            :label="t('modifier.selectConnect')"
            v-model="_modifierConnect.id"
            dense
            clearable
            map-options
            emit-value
            standout
            use-input
            @blur="() => (connectNeedle = undefined)"
            @input.stop="filterConnect"
            @update:model-value="selectConnect"
          >
            <template #no-option>
              <q-item>
                <q-item-section>
                  {{ t('modifier.noConnectData') }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn
          icon="close"
          dense
          flat
          @click="emit('remove', _modifier.order)"
        />
      </q-item-section>
    </template>
    <q-item-section v-else no-wrap>
      <q-item-label class="row justify-center">
        <div class="modifier-wrap">
          <span
            v-for="(ms, idx) in _modifierSplit"
            :key="idx"
            :class="{
              'text-red-4': ms.type === ModifierSplitType.Value
            }"
          >
            {{
              ms.type === ModifierSplitType.Modifier
                ? findModifier(ms.value as number)
                : `${ms.sign}${ms.value}`
            }}
          </span>
          <span v-if="!!_modifierConnect">
            {{ findModifier(_modifierConnect.id as number) }}
          </span>
        </div>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<style lang="scss" scoped>
.modifier {
  &:deep(.q-input) {
    max-width: 80px;
  }

  &:deep(.q-select) {
    width: 200px;
    max-width: 100%;
  }

  &.plain {
    padding: 0;
    min-height: 22px;
  }
}

.modifier-wrap {
  text-align: center;
  white-space: normal;
}
</style>
