<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from 'src/stores/global-store'

interface IProps {
  compact?: boolean
}
withDefaults(defineProps<IProps>(), {
  compact: false
})

const route = useRoute()
const { t } = useI18n({ useScope: 'global' })
const gs = useGlobalStore()

const lang = gs.lang

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
  gs.showLoading()
  document.location.replace(`/${val}${url}`)
}
</script>

<template>
  <q-btn
    v-if="compact"
    round
    dense
    flat
    aria-label="Tradurs Language Button"
    icon="language"
  >
    <q-menu auto-close anchor="bottom end" self="top end">
      <q-list bordered>
        <q-item
          v-for="l in gs.localeOptions"
          :key="l.value"
          :clickable="lang !== l.value"
          :active="lang === l.value"
          @click="setLang(l.value as string)"
        >
          <q-item-section>
            <q-item-label>
              {{ l.label }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
  <q-expansion-item v-else icon="language" :label="t('global.language')">
    <q-list class="no-shadow bg-brighten" bordered separator>
      <q-item
        v-for="l in gs.localeOptions"
        :key="l.value"
        :clickable="lang !== l.value"
        :active="lang === l.value"
        @click="setLang(l.value as string)"
      >
        <q-item-section>
          {{ l.label }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-expansion-item>
</template>
