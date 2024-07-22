<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from 'src/stores/global-store'

import LanguageComponent from 'components/UI/LanguageComponent.vue'
import SignComponent from 'components/UI/SignComponent.vue'

const $q = useQuasar()

const { t } = useI18n({ useScope: 'global' })
const gs = useGlobalStore()
const ltmd = computed(() => gs.ltmd)
const ltmdDrawer = computed(() => $q.screen.width < 1880)
const padding = computed(() => (ltmdDrawer.value ? 'q-px-md' : 'q-px-lg'))

const leftDrawer = ref<boolean>(false)
const rightDrawer = ref<boolean>(false)
</script>

<template>
  <q-layout view="lHh Lpr lff">
    <q-inner-loading class="global-loading" :showing="gs.loading">
      <q-spinner size="50px" color="primary" />
    </q-inner-loading>
    <q-header class="bg-dark">
      <q-toolbar class="justify-center">
        <div class="col"></div>
        <div class="container-width row justify-between items-center">
          <div v-show="ltmd">
            <q-btn
              flat
              round
              dense
              icon="filter_alt"
              @click="leftDrawer = !leftDrawer"
            />
          </div>
          <div class="q-px-md text-primary text-h6 text-weight-bold">
            {{ t('title') }}
          </div>
          <div v-show="!ltmd" class="row justify-end q-gutter-x-xs">
            <LanguageComponent />
            <SignComponent />
          </div>
          <div v-show="ltmd">
            <q-btn
              flat
              round
              dense
              icon="menu"
              @click="rightDrawer = !rightDrawer"
            />
          </div>
        </div>
        <div class="col"></div>
      </q-toolbar>
    </q-header>
    <q-page-container class="row justify-center">
      <aside v-show="!ltmdDrawer" class="bg-transparent col row justify-end">
        <div class="aside"></div>
      </aside>
      <q-page class="container-width">
        <div class="q-py-lg row justify-center">
          <div class="top"></div>
        </div>
        <router-view :class="padding" />

        <div class="q-py-xl"></div>
        <q-separator />
        <div class="q-pt-lg q-pb-xl">
          <div
            class="row justify-center items-center q-gutter-xs text-caption bottom"
          >
            <div>Copyright</div>
            <div>@</div>
            <div>2024</div>
            <q-btn
              class="no-hover"
              no-caps
              flat
              dense
              aria-label="Serasome Home Button"
              padding="0"
              :ripple="false"
              href="https://serasome.com"
              target="_blank"
              rel="noopener noreferrer"
              >SeraSome</q-btn
            >
          </div>
        </div>
      </q-page>
      <aside v-show="!ltmdDrawer" class="bg-transparent col">
        <div class="aside"></div>
      </aside>
    </q-page-container>
    <q-dialog full-height v-model="leftDrawer" position="left">
      <q-card style="width: 80vw" flat>
        <q-card-section> 왼쪽 </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog full-height v-model="rightDrawer" position="right">
      <q-card style="width: 80vw" flat>
        <q-card-section> 오른쪽 </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<style lang="scss" scoped>
.container-width {
  width: 100%;
  max-width: 1280px;
}

.top {
  width: 970px;
  height: 90px;
  border: solid 1px #444444;
}

.aside {
  position: sticky;
  top: 190px;
  width: 160px;
  height: 600px;
  border: solid 1px #444444;
}

.global-loading {
  position: fixed;
  z-index: 9999;
  width: 100%;
  height: 100%;
}
</style>
