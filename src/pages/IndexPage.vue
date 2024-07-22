<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { Item } from 'src/types/item'
import { useItemStore } from 'stores/item-store'

import ItemComponent from 'components/item/ItemComponent.vue'

const is = useItemStore()
const wrap = ref<HTMLDivElement>()
const colGroup = reactive<Array<Array<Item>>>([])
const items = reactive<Array<Item>>([])

const alignItems = () => {
  if (items.length === 0) return
  const cloneItems = JSON.parse(JSON.stringify(items))
  colGroup.splice(0, colGroup.length)
  const limit =
    Math.floor((wrap.value?.clientWidth ?? 0) / 384) > 0
      ? Math.floor((wrap.value?.clientWidth ?? 0) / 384)
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

onMounted(async () => {
  items.splice(0, items.length)
  const result = await is.getItems()
  items.push(...result)
  alignItems()
})
</script>

<template>
  <div ref="wrap">
    <q-resize-observer :debounce="400" @resize="alignItems" />
    <div class="row justify-center q-gutter-x-lg">
      <div
        v-for="(cg, idx) in colGroup"
        :key="idx"
        class="column q-gutter-y-lg"
      >
        <q-intersection
          v-for="item in cg"
          :key="item.id"
          transition="scale"
          once
          style="min-width: 300px; min-height: 250px"
        >
          <ItemComponent :data="item" />
        </q-intersection>
        <!-- <ItemComponent v-for="item in cg" :key="item.id" :data="item" /> -->
      </div>
      <!-- <ItemComponent v-for="item in items" :key="item.id" :data="item" /> -->
    </div>
    <q-btn
      class="fixed-bottom-right"
      color="primary"
      round
      label="+"
      :to="{ name: 'add' }"
    />
  </div>
</template>
