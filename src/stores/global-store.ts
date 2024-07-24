import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { Lang } from 'src/types/global'
import type { Label, Size } from 'src/types/global'

export const useGlobalStore = defineStore('global', () => {
  const $q = useQuasar()
  const lang = ref<Lang>(Lang.KO)
  const locale = computed(() => (lang.value === 'en' ? 'enUS' : 'koKR'))
  const localeOptions = reactive<Array<Label>>([
    { value: 'ko', label: '한국어' },
    { value: 'en', label: 'English' }
  ])
  const ltmd = computed(() => $q.screen.width < 1280)

  const loading = ref<boolean>(false)
  const size = reactive<Size>({
    width: 0,
    height: 0
  })

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
    ltmd,
    lang,
    locale,
    localeOptions,
    loading,
    size,
    checkHealth
  }
})
