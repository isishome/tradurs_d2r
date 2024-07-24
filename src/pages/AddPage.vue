<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { QStepper, QSelect } from 'quasar'
import { useRouter } from 'vue-router'

import type { Item, Price, Modifier } from 'src/types/item'
import { separator, ModifierType, defaultItem } from 'src/types/item'
import { useItemAddStore } from 'src/stores/item-add-store'
import { useItemStore } from 'src/stores/item-store'

import AnalysisComponent from 'components/item/AnalysisComponent.vue'
import BaseComponent from 'components/item/BaseComponent.vue'
import ModifierComponent from 'components/item/ModifierComponent.vue'
import AuctionComponent from 'components/item/AuctionComponent.vue'
import ItemComponent from 'components/item/ItemComponent.vue'

const props = defineProps<{
  id?: string
}>()

const router = useRouter()
const ias = useItemAddStore()
const is = useItemStore()

const stepper = ref<QStepper>()
const step = ref<number>(1)
const baseRef = ref<typeof BaseComponent>()
const auctionRef = ref<typeof AuctionComponent>()
const _item = ref<Item>(defaultItem())
const itemId = ref<number | undefined>(
  !!props.id && !isNaN(Number(props.id)) ? Number(props.id) : undefined
)
const modifier = ref<number>()
itemId
const endAnalysis = (i: Item) => {
  _item.value.socket = i.socket
  _item.value.ethereal = i.ethereal
  _item.value.quality = i.quality
  _item.value.category = i.category
  _item.value.itemType = i.itemType
  _item.value.classType = i.classType
  _item.value.detailType = i.detailType
  _item.value.item = i.item
  _item.value.imageType = i.imageType
  _item.value.names = i.names
  _item.value.name = i.name
  _item.value.modifiers = i.modifiers
}

const updateItem = (item: Item) => {
  Object.assign(_item.value, item)
}

const updatePrice = (price: Price, progressTime: number) => {
  Object.assign(_item.value.price as Price, price)
  _item.value.progressTime = progressTime
}

const addModifier = (val: number) => {
  const text =
    [...ias.modifiers, ...ias.skills].find((m) => m.value === val)?.label ?? ''

  const addingModifier = {
    order: _item.value.modifiers.length,
    type: ModifierType.String,
    id: val,
    children: ias.findChildren(text.replace(separator, '0'), text, val)
  }
  _item.value.modifiers.push(addingModifier)
  modifier.value = undefined
}

const removeModifier = (order: number) => {
  const findModifierIndex = _item.value.modifiers.findIndex(
    (m) => m.order === order
  )

  if (findModifierIndex !== -1)
    _item.value.modifiers.splice(findModifierIndex, 1)
}

const updateModifier = (val: Modifier) => {
  const findModifier = _item.value.modifiers.find((m) => m.id === val.id)

  if (findModifier) Object.assign(findModifier, val)
}

const updateImage = (val: number) => {
  _item.value.imageId = val
}

const checkValidate = async () => {
  switch (step.value) {
    case 1:
      if (await baseRef?.value?.validate()) stepper.value?.next()
      break
    case 3:
      if (await auctionRef?.value?.validate()) stepper.value?.next()
      break
    default:
      stepper.value?.next()
      break
  }
}

// about modifier
const modifierRef = ref<QSelect | null>(null)
const modifierNeedle = ref<string>()
const modifierOptions = computed(() =>
  [...ias.modifiers, ...ias.skills].filter(
    (mf) =>
      mf.label.indexOf(modifierNeedle.value as string) !==
      (!!modifierNeedle.value ? -1 : -2)
  )
)

const filterModifier = (e: KeyboardEvent) => {
  const val = (e.target as HTMLInputElement).value.toLowerCase()
  modifierRef.value?.showPopup()
  modifierRef.value?.updateInputValue(val)
  modifierNeedle.value = val
}

const selectModifier = (val: number): void => {
  if (val) {
    modifierRef.value?.hidePopup()
    addModifier(val)
    modifierNeedle.value = undefined
  }
}

const upsert = (item: Item, withStart = false) => {
  is.upsertItem(item, withStart).then((id) => {
    router.push({
      name: withStart ? 'main' : 'item',
      params: { id: withStart ? undefined : id }
    })
  })
}

onMounted(() => {
  if (!!props.id)
    is.getItems(1, Number(props.id)).then((result) => {
      _item.value = result[0]
    })
})
</script>

<template>
  <div class="row justify-center q-gutter-sm">
    <div class="col-12">
      <q-card flat bordered>
        <q-card-section>
          <div class="row q-gutter-y-sm q-gutter-md">
            <div>아이팀 아이디 : {{ itemId }}</div>
            <div>지역 : {{ _item.region }}</div>
            <div>래더 : {{ _item.ladder }}</div>
            <div>하드코어 : {{ _item.hardcore }}</div>
            <div>홈 있음 : {{ _item.socket }}</div>
            <div>무형 : {{ _item.ethereal }}</div>
            <div>품질 : {{ _item.quality }}</div>
            <div>카테고리 : {{ _item.category }}</div>
            <div>아이템 유형 : {{ _item.itemType }}</div>
            <div>직업 :{{ _item.classType }}</div>
            <div>상세 유형 : {{ _item.detailType }}</div>
            <div>아이템 : {{ _item.item }}</div>
            <div>이미지 유형 : {{ _item.imageType }}</div>
            <div>아이템 명 : {{ _item.names }}</div>
            <div>경매 시간 : {{ _item.progressTime }}</div>
            <div>가격 : {{ _item.price }}</div>
            <!-- <div>속성 : {{ _item.modifiers }}</div> -->
          </div>
        </q-card-section>
      </q-card>
    </div>
    <q-stepper
      bordered
      flat
      v-model="step"
      ref="stepper"
      class="col-12"
      animated
      :vertical="$q.screen.lt.sm"
      done-color="positive"
    >
      <q-step
        :name="1"
        title="기본 설정"
        icon="settings"
        :done="step > 1"
        class="no-padding"
      >
        <BaseComponent ref="baseRef" :data="_item" @update="updateItem" />
      </q-step>
      <q-step :name="2" title="속성 설정" icon="list" :done="step > 2">
        <q-list bordered separator>
          <ModifierComponent
            v-for="m in _item.modifiers"
            :key="m.order"
            :data="m"
            :options="[...ias.modifiers, ...ias.skills]"
            editable
            @remove="removeModifier"
            @update="updateModifier"
          />
          <q-item v-show="_item.modifiers.length === 0">
            <q-item-section>
              <q-item-label class="text-center q-py-xl">
                속성을 추가해주세요
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-step>
      <q-step :name="3" title="경매 설정" icon="attach_money" :done="step > 3">
        <AuctionComponent
          ref="auctionRef"
          :data="_item.price"
          :progress-time="(_item.progressTime as number)"
          @update="updatePrice"
        />
      </q-step>
      <q-step :name="4" title="확인" icon="play_arrow">
        <div class="row justify-center">
          <ItemComponent :data="_item" editable @update-image="updateImage" />
        </div>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation class="row justify-between q-gutter-sm">
          <div>
            <AnalysisComponent v-if="step === 1" @end="endAnalysis" />
            <q-select
              v-else-if="step === 2"
              ref="modifierRef"
              :options="modifierOptions"
              v-model="modifier"
              map-options
              emit-value
              standout
              input-class="text-white"
              dense
              label="속성 추가"
              bg-color="secondary"
              style="min-width: 200px"
              use-input
              hide-selected
              @blur="() => (modifierNeedle = undefined)"
              @input.stop="filterModifier"
              @update:model-value="selectModifier"
            >
              <template #no-option>
                <q-item>
                  <q-item-section> 속성을 찾을 수 없습니다. </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-12 col-sm-6 row justify-end">
            <q-btn
              v-if="step > 1"
              color="grey"
              text-color="dark"
              @click="stepper?.previous()"
              label="뒤로"
              class="q-ml-sm"
            />
            <q-btn
              v-if="step !== 4"
              @click="checkValidate"
              color="primary"
              text-color="dark"
              label="계속"
              class="q-ml-sm"
            />
            <template v-else>
              <q-btn-dropdown
                color="positive"
                text-color="dark"
                class="q-ml-sm text-weight-bold"
                label="완료"
              >
                <q-list>
                  <q-item clickable v-close-popup @click="upsert(_item)">
                    <q-item-section>
                      <q-item-label>{{ !!id ? '수정' : '등록' }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="upsert(_item, true)">
                    <q-item-section>
                      <q-item-label
                        >{{ !!id ? '수정' : '등록' }} 및 경매 시작</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </template>
          </div>
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>
