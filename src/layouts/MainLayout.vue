<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useQuasar, debounce } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import type { Size } from 'src/types/global'
import type { Filter } from 'src/types/item'
import { useGlobalStore } from 'src/stores/global-store'
import { useAccountStore } from 'src/stores/account-store'
import { useItemStore } from 'src/stores/item-store'

import BattleTagComponent from 'components/UI/BattleTagComponent.vue'
import LanguageComponent from 'components/UI/LanguageComponent.vue'
import SignComponent from 'components/UI/SignComponent.vue'
import FilterComponent from 'components/item/FilterComponent.vue'
import Adsense from 'components/global/AdsenseComponent.vue'

const prod: boolean = import.meta.env.PROD

const $q = useQuasar()
const { t } = useI18n({ useScope: 'global' })
const route = useRoute()
const router = useRouter()

const gs = useGlobalStore()
const as = useAccountStore()
const is = useItemStore()
const ltmdDrawer = computed(() => $q.screen.width < 1540)
const padding = computed(() => (ltmdDrawer.value ? 'q-px-md' : 'q-px-lg'))

const _offset = ref<number>(0)

// about adsense
const topAdRef = ref<InstanceType<typeof Adsense>>()
const bottomAdRef = ref<InstanceType<typeof Adsense>>()
const rightAdRef = ref<InstanceType<typeof Adsense>>()

const size = computed(() =>
  $q.screen.width < 320
    ? 'width:300px;max-height:100px;'
    : $q.screen.width < 468
    ? 'width:320px;max-height:100px;'
    : $q.screen.width < 728
    ? 'width:468px;height:60px;'
    : 'width:728px;height:90px;'
)
const sizeBottom = computed(() =>
  $q.screen.width < 300
    ? 'display:inline-block;width:250px;height:250px;'
    : $q.screen.width < 336
    ? 'display:inline-block;width:300px;height:250px;'
    : $q.screen.width < 468
    ? 'display:inline-block;width:336px;height:280px;'
    : $q.screen.width < 728
    ? 'display:inline-block;width:468px;height:60px;'
    : 'display:inline-block;width:728px;height:90px;'
)

const goHome = () => {
  if (route.name !== 'main') router.push({ name: 'main' })
  else is.refresh++
}

const updateFilter = (val: Filter) => {
  is.filter = val
  is.refresh++
}

const resetFilter = () => {
  is.resetFilter()
  is.refresh++
}

const resize = debounce((size: Size) => {
  Object.assign(gs.size, size)
}, 400)

const tweak = (headerHeight: number) => {
  _offset.value = headerHeight
}

watch(
  [size, sizeBottom, ltmdDrawer],
  ([val1, val2, val3], [old1, old2, old3]) => {
    if (val1 !== old1 || val2 !== old2 || val3 !== old3) {
      gs.adsense.top.adKey++
      gs.adsense.bottom.adKey++
      gs.adsense.right.adKey++
      gs.adsense.top.timeStamp = Date.now()
      gs.adsense.bottom.timeStamp = Date.now()
      gs.adsense.right.timeStamp = Date.now()
    }
  }
)

watch(
  () => gs.adsense.reloadAdKey,
  () => {
    if (
      Date.now() - gs.adsense.top.timeStamp > gs.adsense.timeLimit ||
      topAdRef.value?.$el.getAttribute('data-ad-status') === 'unfilled'
    ) {
      gs.adsense.top.adKey++
      gs.adsense.top.timeStamp = Date.now()
    }

    if (
      Date.now() - gs.adsense.bottom.timeStamp > gs.adsense.timeLimit ||
      bottomAdRef.value?.$el.getAttribute('data-ad-status') === 'unfilled'
    ) {
      gs.adsense.bottom.adKey++
      gs.adsense.bottom.timeStamp = Date.now()
    }

    if (
      Date.now() - gs.adsense.right.timeStamp > gs.adsense.timeLimit ||
      rightAdRef.value?.$el.getAttribute('data-ad-status') === 'unfilled'
    ) {
      gs.adsense.right.adKey++
      gs.adsense.right.timeStamp = Date.now()
    }
  }
)
</script>

<template>
  <q-layout view="lHh Lpr lff" @resize="resize">
    <q-inner-loading class="global-loading" :showing="gs.loadingCount > 0">
      <q-spinner size="50px" color="primary" />
    </q-inner-loading>
    <q-header class="bg-dark">
      <q-toolbar class="justify-center">
        <div class="col"></div>
        <div
          class="container-width row justify-between items-center"
          :class="{ 'q-px-md': !ltmdDrawer }"
        >
          <div class="col row items-center q-pl-md">
            <div class="cursor-pointer" @click="goHome">
              <h1 class="h1 row items-center q-gutter-x-sm">
                <img
                  v-show="$q.dark.isActive"
                  src="/images/logo.webp"
                  width="36"
                  height="36"
                  alt="Tradurs D2R Logo Image"
                />
                <img
                  v-show="$q.dark.isActive"
                  src="/images/tradurs_text.svg"
                  height="24"
                  class="q-mt-xs"
                  alt="Tradurs D2R Text Image"
                />
                <span class="blind">{{ t('meta.title') }}</span>
              </h1>
            </div>
          </div>
          <div
            v-show="!ltmdDrawer"
            class="col row justify-end items-center q-gutter-x-xs"
          >
            <BattleTagComponent v-if="as.signed" compact />
            <SignComponent compact />
            <q-separator inset vertical />
            <q-btn
              aria-label="Tradurs Help Link Button"
              flat
              dense
              round
              icon="help"
              :to="{ name: 'help', params: { category: 'basic' } }"
            />
            <q-btn
              aria-label="Tradurs Discord Link Button"
              flat
              dense
              round
              icon="discord"
              type="a"
              href="https://discord.gg/dwRuWq4enx"
              target="_blank"
              rel="noopener noreferrer"
            />

            <LanguageComponent compact />
          </div>
          <div v-show="ltmdDrawer" class="col-2 row justify-end">
            <q-btn
              aria-label="Tradurs Menu Button"
              flat
              round
              dense
              icon="menu"
              @click="gs.rightDrawer = !gs.rightDrawer"
            />
          </div>
        </div>
        <div class="col"></div>
      </q-toolbar>
    </q-header>
    <q-page-container class="row justify-center">
      <q-page class="container-width" :style-fn="tweak">
        <div class="q-py-lg row justify-center">
          <Adsense
            ref="topAdRef"
            :style="size"
            data-ad-client="ca-pub-5110777286519562"
            data-ad-slot="9661979705"
            :data-adtest="!prod"
            :key="gs.adsense.top.adKey"
          />
        </div>
        <router-view :class="padding" />
        <div v-if="!ltmdDrawer" class="aside right">
          <div class="sticky" style="top: 190px">
            <Adsense
              ref="rightAdRef"
              style="display: inline-block; width: 160px; height: 600px"
              data-ad-client="ca-pub-5110777286519562"
              data-ad-slot="2839584311"
              :data-adtest="!prod"
              :key="gs.adsense.right.adKey"
            />
          </div>
        </div>
        <div class="q-py-xl"></div>
        <div v-show="ltmdDrawer" class="q-py-lg row justify-center">
          <Adsense
            ref="bottomAdRef"
            :style="sizeBottom"
            data-ad-client="ca-pub-5110777286519562"
            data-ad-slot="3038631536"
            :data-adtest="!prod"
            :key="gs.adsense.bottom.adKey"
          />
        </div>
        <q-separator inset />
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
    </q-page-container>
    <q-dialog full-height v-model="gs.leftDrawer" position="left">
      <q-card style="width: 80vw" flat>
        <q-card-section>
          <FilterComponent
            :data="is.filter"
            @update="updateFilter"
            @reset="resetFilter"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog full-height v-model="gs.rightDrawer" position="right">
      <q-card style="width: 80vw" flat>
        <q-card-section class="bg-primary text-dark">
          <div class="row justify-center">
            <BattleTagComponent v-if="as.signed" />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list separator padding>
            <SignComponent />
            <q-item :to="{ name: 'help', params: { category: 'basic' } }">
              <q-item-section avatar>
                <q-icon name="help" />
              </q-item-section>
              <q-item-section> {{ t('btn.help') }} </q-item-section>
            </q-item>
            <q-item
              tag="a"
              href="https://discord.gg/dwRuWq4enx"
              target="_blank"
              rel="noopener noreferrer"
            >
              <q-item-section avatar>
                <q-icon name="discord" />
              </q-item-section>
              <q-item-section> {{ t('btn.discord') }} </q-item-section>
            </q-item>

            <LanguageComponent />
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<style lang="scss" scoped>
.h1 {
  font-size: inherit;
  line-height: inherit;
  margin: 0;
  padding: 0;
}

.blind {
  position: absolute;
  clip: rect(0 0 0 0);
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
}

.container-width {
  width: 100%;
  max-width: var(--container-width);
}

.aside {
  position: absolute;
  top: 0;
  height: calc(100% - 120px);

  &.left {
    left: 0;
    transform: translate(40px, -44px);
    z-index: 3;
  }

  &.right {
    right: 0;
    transform: translate(100%);
  }

  &:deep(.sticky) {
    position: sticky;
  }
}

.top {
  width: 970px;
  height: 90px;
  border: solid 1px #444444;
}

.global-loading {
  position: fixed;
  z-index: 9999;
  width: 100%;
  height: 100%;
}
</style>
