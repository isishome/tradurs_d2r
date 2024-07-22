<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGlobalStore } from 'src/stores/global-store'

const route = useRoute()
const gs = useGlobalStore()

const lang = computed(() => route.params.lang || 'ko')

const setLang = async (val: string) => {
  const url = route.fullPath
    .replace(
      new RegExp(
        `^\/(${gs.localeOptions.map((lo) => lo.value).join('|')})`,
        'i'
      ),
      ''
    )
    .replace(/\/$/, '')
  gs.loading = true
  document.location.replace(`/${val}${url}`)
}
</script>

<template>
  <q-btn round dense flat aria-label="Tradurs Language Button" icon="language">
    <q-menu auto-close anchor="bottom end" self="top end">
      <q-list bordered>
        <q-item
          v-for="l in gs.localeOptions"
          :key="l.value"
          :clickable="lang !== l.value"
          :active="lang === l.value"
          @click="setLang(l.value as string)"
        >
          <q-item-label>
            {{ l.label }}
          </q-item-label>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
