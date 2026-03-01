<script setup lang="ts">
import { ref, computed, onMounted, onBeforeMount, watch } from 'vue'
import { QStepper, QSelect, QList } from 'quasar'
import { modifiers, skills } from 'src/domain/static/data'
import Sortable from 'sortablejs'

import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useItemAddStore } from 'src/stores/item-add-store'
import { useItemStore } from 'src/stores/item-store'
import { useAccountStore } from 'src/stores/account-store'
import { useCookies } from 'src/composables/useCookies'

import type { Item, Price, Modifier } from 'src/types/item'
import {
  separator,
  ModifierType,
  defaultItem,
  defaultPrice
} from 'src/types/item'

import AnalysisComponent from 'components/item/AnalysisComponent.vue'
import BaseComponent from 'components/item/BaseComponent.vue'
import ModifierComponent from 'components/item/ModifierComponent.vue'
import AuctionComponent from 'components/item/AuctionComponent.vue'
import ItemComponent from 'components/item/ItemComponent.vue'
import PreviewComponent from 'components/item/PreviewComponent.vue'
import { TR_D2R_PLATFORM, TR_D2R_REGION } from 'src/domain/keys'

const props = defineProps<{
  id?: string
}>()

const { t } = useI18n({ useScope: 'global' })
const route = useRoute()
const router = useRouter()
const ias = useItemAddStore()
const is = useItemStore()
const as = useAccountStore()
const cookies = useCookies()

const stepper = ref<QStepper>()
const step = ref<number>(1)
const baseRef = ref<typeof BaseComponent>()
const auctionRef = ref<typeof AuctionComponent>()
const _item = ref<Item>(defaultItem())
const modifier = ref<number>()
const endAnalysis = ({ item, data }: { item: Item; data: string }) => {
  _item.value.socket = item.socket
  _item.value.ethereal = item.ethereal
  _item.value.quality = item.quality
  _item.value.category = item.category
  _item.value.itemType = item.itemType
  _item.value.classType = item.classType
  _item.value.detailType = item.detailType
  _item.value.item = item.item
  _item.value.imageType = item.imageType
  _item.value.names = item.names
  _item.value.name = item.name
  _item.value.modifiers = item.modifiers
  imageSrc.value = data
}
const imageSrc = ref()
const modifiersRef = ref<QList>()

const updateItem = (item: Item) => {
  Object.assign(_item.value, item)
  cookies.set(TR_D2R_PLATFORM, item.platform ?? 'all', { expires: 365 })
  cookies.set(TR_D2R_REGION, item.region ?? 'all', { expires: 365 })
}

const updatePrice = (price: Price, progressTime: number) => {
  Object.assign(_item.value.price as Price, price)
  _item.value.progressTime = progressTime
}

const addModifier = (val: number) => {
  const text = modifiers.find((m) => m.value === val)?.label ?? ''

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
  const findModifier = _item.value.modifiers.find((m) => m.order === val.order)

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
  modifiers.filter(
    (mf) =>
      mf.label
        .toLowerCase()
        .indexOf((modifierNeedle.value ?? '').toLowerCase()) !==
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
    if (withStart) is.resetFilter()
    as.checkSign()
    router.push({
      name: withStart ? 'main' : 'item',
      params: { id: withStart ? undefined : id }
    })
  })
}

watch(modifiersRef, (val) => {
  if (val) {
    new Sortable(val.$el, {
      handle: '.handle',
      animation: 150,
      direction: 'vertical',
      onEnd(evt) {
        if (
          evt.oldIndex === evt.newIndex ||
          typeof evt.oldIndex !== 'number' ||
          typeof evt.newIndex !== 'number'
        )
          return
        const oldModifier = modifiersRef.value?.$el.children[
          evt.oldIndex
        ] as HTMLDivElement
        const newModifier = modifiersRef.value?.$el.children[
          evt.newIndex
        ] as HTMLDivElement
        const oldOrder = Number(oldModifier.dataset.order)
        const newOrder = Number(newModifier.dataset.order)
        const oldItem = _item.value.modifiers.find((m) => m.order === oldOrder)
        const newItem = _item.value.modifiers.find((m) => m.order === newOrder)

        if (!oldItem || !newItem) return

        oldItem.order = newOrder
        newItem.order = oldOrder
      }
    })
  }
})

onBeforeMount(() => {
  const platform = cookies.has(TR_D2R_PLATFORM)
    ? (cookies.get(TR_D2R_PLATFORM) as string)
    : undefined
  _item.value.platform = platform

  const region = cookies.has(TR_D2R_REGION)
    ? (cookies.get(TR_D2R_REGION) as string)
    : undefined
  _item.value.region = region
})

onMounted(() => {
  if (!!props.id)
    is.getItems(1, Number(props.id)).then((result) => {
      if (route.name === 'clone') {
        result.items[0].id = undefined
        result.items[0].region = undefined
        result.items[0].ladder = true
        result.items[0].hardcore = false
        result.items[0].id = undefined
        result.items[0].price = defaultPrice()
        result.items[0].user = undefined
        result.items[0].regDate = undefined
        result.items[0].startDate = undefined
        result.items[0].addProgressTime = 0
        result.items[0].statusCode = undefined
        result.items[0].favorite = false
        result.items[0].rate = undefined
        result.items[0].loading = false
      }

      _item.value = result.items[0]
    })
})
</script>

<template>
  <div class="row justify-center q-gutter-sm">
    <div v-if="false" class="col-12">
      <q-card flat bordered>
        <q-card-section>
          <div class="row q-gutter-y-sm q-gutter-md">
            <div>아이팀 아이디 : {{ id }}</div>
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
            <div>속성 : {{ _item.modifiers }}</div>
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
      done-color="positive"
    >
      <q-step
        :name="1"
        :title="t('add.baseSetting')"
        icon="settings"
        :done="step > 1"
        class="no-padding"
      >
        <div class="row no-wrap justify-between q-col-gutter-x-md">
          <template v-if="!!imageSrc || !!_item.id">
            <PreviewComponent class="col-5 gt-md" :data="imageSrc ?? _item" />
            <q-separator vertical class="no-padding gt-md" />
          </template>
          <BaseComponent
            class="col"
            ref="baseRef"
            :data="_item"
            @update="updateItem"
          />
        </div>
      </q-step>
      <q-step
        :name="2"
        :title="t('add.affixSetting')"
        icon="list"
        :done="step > 2"
      >
        <div class="row no-wrap justify-between q-col-gutter-x-md">
          <template v-if="!!imageSrc || !!_item.id">
            <PreviewComponent class="col-5 gt-md" :data="imageSrc ?? _item" />
            <q-separator vertical class="no-padding gt-md" />
          </template>
          <div class="fit">
            <q-list ref="modifiersRef" class="col" bordered separator>
              <ModifierComponent
                v-for="m in _item.modifiers"
                :key="m.order"
                :data="m"
                :options="modifiers"
                :skills="skills"
                :data-order="m.order"
                editable
                @remove="removeModifier"
                @update="updateModifier"
              >
                <template #front-side>
                  <q-item-section side>
                    <q-item dense class="row items-center no-padding">
                      <q-icon name="drag_indicator" class="handle" />
                    </q-item>
                  </q-item-section>
                </template>
              </ModifierComponent>
              <q-item v-show="_item.modifiers.length === 0">
                <q-item-section>
                  <q-item-label class="text-center q-py-xl">
                    {{ t('add.requireAffix') }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-step>
      <q-step
        :name="3"
        :title="t('add.auctionSetting')"
        icon="attach_money"
        :done="step > 3"
      >
        <div class="row no-wrap justify-between q-col-gutter-x-md">
          <template v-if="!!imageSrc || !!_item.id">
            <PreviewComponent class="col-5 gt-md" :data="imageSrc ?? _item" />
            <q-separator vertical class="no-padding gt-md" />
          </template>
          <AuctionComponent
            ref="auctionRef"
            class="col"
            :data="_item.price"
            :progress-time="(_item.progressTime as number)"
            @update="updatePrice"
          />
        </div>
      </q-step>
      <q-step :name="4" :title="t('add.finalConfirm')" icon="play_arrow">
        <div class="row no-wrap justify-between q-col-gutter-x-md">
          <template v-if="imageSrc">
            <PreviewComponent class="col-5 gt-md" :data="imageSrc" />
            <q-separator vertical class="no-padding gt-md" />
          </template>
          <div class="col row no-wrap justify-center">
            <ItemComponent :data="_item" editable @update-image="updateImage" />
          </div>
        </div>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation
          class="row no-wrap justify-between q-col-gutter-x-md"
        >
          <div v-if="!!imageSrc || !!_item.id" class="col-5 gt-md"></div>
          <div class="col row no-wrap justify-between">
            <div>
              <AnalysisComponent v-if="step === 1" @complete="endAnalysis" />
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
                :label="t('add.addAffix')"
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
                    <q-item-section> {{ t('add.noAffixData') }}</q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="row justify-end">
              <q-btn
                v-if="step > 1"
                aria-label="Tradurs Previous Button"
                color="grey"
                text-color="dark"
                @click="stepper?.previous()"
                :label="t('btn.back')"
                class="q-ml-sm"
              />
              <q-btn
                v-if="step !== 4"
                @click="checkValidate"
                aria-label="Tradurs Continue Button"
                color="primary"
                text-color="dark"
                :label="t('btn.continue')"
                class="q-ml-sm"
              />
              <template v-else>
                <q-btn-dropdown
                  aria-label="Tradurs Complete Button"
                  color="positive"
                  text-color="dark"
                  class="q-ml-sm text-weight-bold"
                  :label="t('btn.complete')"
                >
                  <q-list>
                    <q-item clickable v-close-popup @click="upsert(_item)">
                      <q-item-section>
                        <q-item-label>{{
                          t('add.standby', {
                            t: !!_item.id ? t('btn.edit') : t('btn.register')
                          })
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="upsert(_item, true)"
                    >
                      <q-item-section>
                        <q-item-label
                          >{{
                            t('add.auction', {
                              t: !!_item.id ? t('btn.edit') : t('btn.register')
                            })
                          }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </template>
            </div>
          </div>
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<style lang="scss" scoped>
.handle {
  cursor: move;
}
</style>
