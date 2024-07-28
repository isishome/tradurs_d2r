<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Size } from 'src/types/global'
import type { Item } from 'src/types/item'
import { defaultItem } from 'src/types/item'
import { useItemStore } from 'stores/item-store'
import { useAccountStore } from 'stores/account-store'
import { notify } from 'src/composables/common'

import ItemComponent from 'components/item/ItemComponent.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n({ useScope: 'global' })

const is = useItemStore()
const as = useAccountStore()

// variable
const refresh = computed(() => is.refresh)
const colGroup = reactive<Array<Array<Item>>>([])
const blankItems = Array.from({ length: 3 }, () => defaultItem()).map((i) => ({
  ...i,
  loading: true
}))
const items = ref<Array<Item>>(blankItems)
const page = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
)
const over = computed(() => is.itemPage.over)
const more = computed(() => is.itemPage.more)
const barWidth = computed(() => colGroup.length * (is.itemWidth + 28) - 40)
const size = reactive<Size>({} as Size)
const limit = computed(() =>
  Math.floor(size.width / (is.itemWidth + 28)) > 0
    ? Math.floor(size.width / (is.itemWidth + 28))
    : 1
)

const getItems = () => {
  items.value = blankItems
  alignItems()
  is.getItems(page.value).then((result) => {
    items.value = result
    alignItems()
  })
}

const alignItems = () => {
  const cloneItems = JSON.parse(JSON.stringify(items.value))
  colGroup.splice(0, colGroup.length)

  let i = 0
  while (i < limit.value) {
    colGroup.push([])
    i++
  }

  let start = 0
  while (cloneItems.length > 0) {
    colGroup[start % colGroup.length].push(cloneItems.shift())
    start++
  }
}

const goItem = async (id: number) => {
  await router.push({ name: 'item', params: { id } })
}

const move = (val: number) => {
  router.push({
    name: 'main',
    query: { page: page.value + val }
  })
}

const updateItem = (item: Item, message?: string) => {
  is.getItems(1, item.id).then((result) => {
    Object.assign(item, result[0])
    if (message) notify(message)
  })
}

const deleteItem = (itemId: number) => {
  is.deleteItem(itemId).then(() => {
    notify(t('messages.itemDeleted'))
    is.refresh++
  })
}

const updateFavorite = (item: Item, status: boolean) => {
  item.favorite = status

  if (status) notify(t('messages.favorite', { t: t('global.set') }))
  else notify(t('messages.favorite', { t: t('global.removed') }))
}

watch(
  () => route.query.page,
  (val, old) => {
    if (val !== old && route.name === 'main') {
      page.value = val ? parseInt(val as string) : 1
      getItems()
    }
  }
)

watch(limit, (val, old) => {
  if (val !== old) {
    alignItems()
  }
})

watch(refresh, (val, old) => {
  if (val !== old) {
    router.push({ name: 'main', params: { page: undefined }, replace: true })
    page.value = 1
    getItems()
  }
})

onMounted(async () => {
  getItems()
})
</script>

<template>
  <div>
    <q-resize-observer
      :debounce="400"
      @resize="(val:Size) => {Object.assign(size, val)}"
    />
    <div class="row justify-center q-gutter-x-lg item-list">
      <template v-if="items.length > 0">
        <div
          v-for="(cg, idx) in colGroup"
          :key="idx"
          class="column q-gutter-y-lg"
        >
          <div v-for="item in cg" :key="item.id">
            <ItemComponent
              :class="[item.loading ? 'no-pointer-events' : 'cursor-pointer']"
              @click="goItem(item.id as number)"
              :data="item"
              :width="is.itemWidth"
              :loading="item.loading"
              @update-item="(id:number, message?:string) => updateItem(item, message)"
              @delete-item="deleteItem"
              @update-favorite="(status) => updateFavorite(item, status)"
            />
          </div>
        </div>
      </template>
      <div v-else class="no-data row items-center">
        <div class="column items-center q-gutter-y-sm">
          <div>{{ t('messages.noItemcriteria') }}</div>
          <div class="text-caption">{{ t('messages.checkItemFilter') }}</div>
        </div>
      </div>
    </div>
    <div class="q-py-md"></div>
    <div
      class="row justify-between items-center bottom-bar"
      :style="`max-width:${barWidth}px`"
    >
      <div class="row items-center">
        <q-btn
          v-if="as.signed"
          color="secondary"
          size="md"
          padding="sm"
          icon="add"
          round
          class="area-shadow"
          :to="{ name: 'add' }"
        />
      </div>
      <div class="row justify-end items-center q-gutter-sm">
        <q-btn
          :disable="!over"
          color="dark-page"
          size="md"
          padding="sm"
          icon="chevron_left"
          round
          class="area-shadow"
          @click="move(-1)"
        />
        <q-btn
          :disable="!more"
          color="dark-page"
          size="md"
          padding="sm"
          icon="chevron_right"
          round
          class="area-shadow"
          @click="move(1)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media (hover: hover) {
  .item-list:deep(.item:hover) {
    filter: brightness(120%);
  }
}

.area-shadow {
  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.4),
    0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.32);
}

.no-data {
  height: 50vh;
}
</style>
