<script setup lang="ts">
import { QSelect } from 'quasar'
import { ref, computed, onMounted } from 'vue'
import {} from 'src/types/global'
import type { Label } from 'src/types/global'
import type { Modifier } from 'src/types/item'
import { separator, ModifierType } from 'src/types/item'

enum ModifierSplitType {
  Text = 'text',
  Modifier = 'modifier',
  Value = 'value'
}

type ModifierSplit = {
  type: ModifierSplitType
  value: number | string | undefined
}

interface IProps {
  data: Modifier
  options: Array<Label>
  editable?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  editable: false
})

const emit = defineEmits(['remove', 'update'])

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

const update = () => {
  const values = _modifierSplit.value.filter(
    (ms) => ms.type === ModifierSplitType.Value
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
      cf.label.indexOf(connectNeedle.value as string) !==
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
      .map((p) => ({ type: ModifierSplitType.Text, value: p })) ?? [])
  )

  fm?.match(separator)?.forEach((s, i) => {
    _modifierSplit.value.splice(i * 2 + 1, 0, {
      type: s === '%s' ? ModifierSplitType.Modifier : ModifierSplitType.Value,
      value: s === '%s' ? children?.[i]?.id : children?.[i]?.value
    })
  })

  _modifierSplit.value = _modifierSplit.value.filter(
    (ms) => typeof ms.value !== 'undefined'
  )
})
</script>
<template>
  <q-item class="modifier" :dense="!editable" :class="{ plain: !editable }">
    <template v-if="editable">
      <q-item-section no-wrap>
        <q-item-label class="row justify-between q-gutter-sm items-center">
          <div class="row q-gutter-sm items-center">
            <template v-for="(ms, idx) in _modifierSplit" :key="idx">
              <div v-if="ms.type === ModifierSplitType.Text">
                {{ ms.value }}
              </div>
              <q-input
                v-else-if="ms.type === ModifierSplitType.Value"
                v-model.number="ms.value"
                dense
                map-options
                emit-value
                standout
                input-class="text-center"
                maxlength="4"
                type="tel"
                mask="#"
                fill-mask="0"
                reverse-fill-mask
                @update:model-value="update"
              />
              <q-select
                v-else-if="ms.type === ModifierSplitType.Modifier"
                :options="connectOptions"
                v-model="ms.value"
                dense
                clearable
                map-options
                emit-value
                standout
                @update:model-value="update"
              />
            </template>
          </div>
          <q-select
            v-if="_modifierConnect"
            :options="connectOptions"
            ref="connectRef"
            label="연결 속성 선택"
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
                <q-item-section> 연결 속성을 찾을 수 없습니다. </q-item-section>
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
      <q-item-label class="row items-center justify-center">
        <div class="row q-gutter-xs items-center">
          <div
            v-for="(ms, idx) in _modifierSplit"
            :key="idx"
            :class="{
              'text-blue text-weight-bold': ms.type === ModifierSplitType.Value
            }"
          >
            {{
              ms.type === ModifierSplitType.Modifier
                ? findModifier(ms.value as number)
                : ms.value
            }}
          </div>

          <div v-if="!!_modifierConnect">
            {{ findModifier(_modifierConnect.id as number) }}
          </div>
        </div>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<style lang="scss" scoped>
.modifier {
  &:deep(.q-input) {
    max-width: 60px;
  }

  &:deep(.q-select) {
    width: 200px;
    max-width: 80vh;
  }

  &.plain {
    padding: 0;
    min-height: 24px;
  }
}
</style>
