<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalStore } from 'src/stores/global-store'
import { useAccountStore } from 'src/stores/account-store'

interface IProps {
  compact?: boolean
}
withDefaults(defineProps<IProps>(), {
  compact: false
})

const gs = useGlobalStore()
const as = useAccountStore()
const url = computed(() =>
  [import.meta.env.VITE_APP_TRADURS, gs.lang, 'info'].join('/')
)
</script>

<template>
  <div class="row justify-evenly" :class="{ 'full-width': !compact }">
    <q-btn
      aria-label="Tradurs Avatar Button"
      flat
      dense
      square
      :ripple="false"
      class="no-hover"
      type="a"
      :href="url"
      target="_self"
      rel="noopener noreferrer"
    >
      <div class="row items-center q-gutter-x-xs">
        <q-avatar size="sm">
          <q-img
            :src="`/images/avatar/${as.info.avatar}.webp`"
            alt="Tradurs Avatart Image"
          />
        </q-avatar>
        <div>{{ as.info.battleTag }}</div>
      </div>
      <q-tooltip
        v-if="compact"
        class="bg-primary text-dark text-subtitle2 column q-gutter-y-md q-pa-md"
      >
        <div class="row items-center q-gutter-x-md q-mt-none">
          <q-icon name="device_thermostat" color="red" size="sm" />
          <div>{{ as.info.temperature }}&#8451;</div>
        </div>
        <div class="row items-center q-gutter-x-md">
          <q-icon name="egg_alt" color="white" size="sm" />
          <div>{{ as.info.yolk }}</div>
        </div>
      </q-tooltip>
    </q-btn>
    <template v-if="!compact">
      <div class="row items-center q-gutter-x-xs">
        <q-icon color="red" name="device_thermostat" size="sm" />
        <div>{{ as.info.temperature }}&#8451;</div>
      </div>
      <div class="row items-center q-gutter-x-xs">
        <q-icon color="white" name="egg_alt" size="sm" />
        <div>{{ as.info.yolk }}</div>
      </div>
    </template>
  </div>
</template>
