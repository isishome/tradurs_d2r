<script setup lang="ts">
import { computed, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Label } from 'src/types/global'
import { useGlobalStore } from 'stores/global-store'

const props = defineProps<{
  category?: string
}>()

type Tab = Label & {
  name: string
}

const { t } = useI18n({ useScope: 'global' })
const gs = useGlobalStore()

const tabs: Array<Tab> = [
  {
    value: 'basic',
    label: t('help.basic'),
    name: 'Basic'
  },
  {
    value: 'join',
    label: t('help.join'),
    name: 'Join'
  },
  {
    value: 'add',
    label: t('help.add'),
    name: 'Add'
  },
  {
    value: 'auction',
    label: t('help.auction'),
    name: 'Auction'
  },
  {
    value: 'filter',
    label: t('help.filter'),
    name: 'Filter'
  },
  {
    value: 'yolk',
    label: t('help.yolk'),
    name: 'Yolk'
  },
  {
    value: 'allow',
    label: t('help.allow'),
    name: 'Allow'
  }
]

const tab = ref<string>(props.category || 'base')
const comp = computed(
  () => (name: string) =>
    defineAsyncComponent(() => import(`./help/${gs.lang}/${name}Page.vue`))
)
</script>
<template>
  <div>
    <q-card flat bordered>
      <q-tabs
        v-model="tab"
        class="text-grey-8 bg-dark-page"
        active-color="white"
        active-bg-color="dark"
        indicator-color="transparent"
        align="justify"
        narrow-indicator
      >
        <q-route-tab
          v-for="t in tabs"
          no-caps
          :key="t.value"
          :label="t.label"
          :name="t.value"
          :to="{ name: 'help', params: { category: t.value } }"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="tab"
        animated
        transition-prev="fade"
        transition-next="fade"
      >
        <q-tab-panel
          v-for="t in tabs"
          :key="t.value"
          :name="t.value"
          class="no-scroll"
        >
          <component :is="comp(t.name)" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>
