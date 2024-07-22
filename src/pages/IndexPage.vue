<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Item } from 'src/types/item'
import { defaultItem } from 'src/types/item'
import { useItemStore } from 'stores/item-store'
import { useAccountStore } from 'stores/account-store'

import ItemComponent from 'components/item/ItemComponent.vue'

const route = useRoute()
const router = useRouter()
const is = useItemStore()
const as = useAccountStore()

// variable
const itemWidth = 360
const wrap = ref<HTMLDivElement>()
const colGroup = reactive<Array<Array<Item>>>([])
const items = reactive<Array<Item>>(
  Array.from({ length: 3 }, () => defaultItem()).map((i) => ({
    ...i,
    loading: true
  }))
)
const page = ref<number>(
  route.query.page ? parseInt(route.query.page as string) : 1
)
const over = computed(() => is.itemPage.over)
const more = computed(() => is.itemPage.more)
const barWidth = computed(() => colGroup.length * (itemWidth + 24) - 40)

const getItems = async () => {
  items.splice(0, items.length)
  const result = await is.getItems(page.value)
  items.push(...result)
  alignItems()
}

const alignItems = () => {
  if (items.length === 0) return
  const cloneItems = JSON.parse(JSON.stringify(items))
  colGroup.splice(0, colGroup.length)
  const limit =
    Math.floor((wrap.value?.clientWidth ?? 0) / (itemWidth + 24)) > 0
      ? Math.floor((wrap.value?.clientWidth ?? 0) / (itemWidth + 24))
      : 1
  let i = 0
  while (i < limit) {
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

watch(
  () => route.query.page,
  (val, old) => {
    if (val !== old && route.name === 'main') {
      page.value = val ? parseInt(val as string) : 1
      getItems()
    }
  }
)

onMounted(async () => {
  await getItems()
})
</script>

<template>
  <div ref="wrap">
    <q-resize-observer :debounce="400" @resize="alignItems" />
    <div class="row justify-center q-col-gutter-lg item-list">
      <div
        v-for="(cg, idx) in colGroup"
        :key="idx"
        class="column q-gutter-y-lg"
      >
        <div v-for="item in cg" :key="item.id">
          <ItemComponent
            class="cursor-pointer"
            @click="goItem(item.id as number)"
            :data="item"
            :width="itemWidth"
            :loading="item.loading"
          />
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
          unelevated
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
          unelevated
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

.bottom-bar {
  position: sticky;
  bottom: 20px;
  z-index: 2;
  margin: 0 auto;
}

.area-shadow {
  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.4),
    0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.32);
}
</style>
