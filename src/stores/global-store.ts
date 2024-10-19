import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { api } from 'src/boot/axios'
import type { Adsense } from 'src/types/global'
import { Lang } from 'src/types/global'
import type { Meta, Label, Size } from 'src/types/global'

export const useGlobalStore = defineStore('global', () => {
  const lang = ref<Lang>(Lang.KO)
  const locale = computed(() => (lang.value === 'en' ? 'enUS' : 'koKR'))
  const localeOptions = reactive<Array<Label>>([
    { value: 'ko', label: '한국어' },
    { value: 'en', label: 'English' }
  ])

  const meta = reactive<Meta>({} as Meta)

  const loadingCount = ref<number>(0)
  const leftDrawer = ref<boolean>(false)
  const rightDrawer = ref<boolean>(false)
  const adsense = ref<Adsense>({
    timeLimit: 60000,
    top: {
      timeStamp: Date.now(),
      adKey: 0
    },
    bottom: {
      timeStamp: Date.now(),
      adKey: 0
    },
    left: {
      timeStamp: Date.now(),
      adKey: 0
    },
    right: {
      timeStamp: Date.now(),
      adKey: 0
    },
    reloadAdKey: 0
  })
  const size = reactive<Size>({
    width: 0,
    height: 0
  })

  const showLoading = () => {
    loadingCount.value++
  }

  const hideLoading = () => {
    loadingCount.value = loadingCount.value - 1 < 0 ? 0 : loadingCount.value - 1
  }

  const checkHealth = () => {
    return new Promise<void>((resolve, reject) => {
      api
        .get('/d4/system/health')
        .then(() => {
          resolve()
        })
        .catch(() => {
          reject()
        })
    })
  }

  return {
    lang,
    locale,
    meta,
    localeOptions,
    loadingCount,
    leftDrawer,
    rightDrawer,
    adsense,
    size,
    showLoading,
    hideLoading,
    checkHealth
  }
})
