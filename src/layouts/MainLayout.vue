<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useGlobalStore } from 'src/stores/global-store'

const $q = useQuasar()
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
            Tradurs Diablo II:레저렉션
          </div>
          <div v-show="!ltmd" class="row justify-end q-gutter-x-xs">
            <q-btn flat round dense icon="person" />
            <q-btn flat round dense icon="person" />
            <q-btn flat round dense icon="person" />
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
  z-index: 9999;
  width: 100%;
  height: 100%;
}
</style>
