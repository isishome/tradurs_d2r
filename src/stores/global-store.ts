import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { Lang } from 'src/types/global'

export const useGlobalStore = defineStore('global', () => {
  const $q = useQuasar()
  const route = useRoute()
  const lang: Lang = (route.params.lang as Lang) || 'ko'
  const ltmd = computed(() => $q.screen.width < 1280)
  const locale: 'enUS' | 'koKR' = lang === 'en' ? 'enUS' : 'koKR'
  const loading = ref<boolean>(false)

  return {
    ltmd,
    lang,
    locale,
    loading
  }
})
