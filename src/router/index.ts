import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'
import { LocalStorage } from 'quasar'
import { api } from 'boot/axios'
import routes from './routes'
import { Lang } from 'src/types/global'
import { useGlobalStore } from 'src/stores/global-store'
import { useAccountStore } from 'src/stores/account-store'
import { useItemAddStore } from 'src/stores/item-add-store'
import { initMessenger } from 'src/sockets/messenger'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export const clearLocalStorage = () => {
  LocalStorage.removeItem('base')
}

export default route(function ({ store }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: (to, from, savedPosition) => {
      return savedPosition || { left: 0, top: 0 }
    },
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach(async (to, from, next) => {
    const lang = to.params.lang || 'ko'
    api.defaults.headers.common['Accept-Language'] = lang

    const gs = useGlobalStore(store)
    const as = useAccountStore(store)
    const ias = useItemAddStore(store)
    gs.lang = lang as Lang
    const requireAuth = !!to.matched.some((m) => m.meta.requireAuth)

    if (process.env.SERVER) return next()

    if (!['pnf', 'ftc'].includes(to.name as string)) {
      try {
        const appVersion = LocalStorage.getItem<string>('APP_VERSION')
        const locale = LocalStorage.getItem<string>('lang')

        if (
          appVersion !== import.meta.env.VITE_APP_VERSION ||
          locale !== lang
        ) {
          clearLocalStorage()
          LocalStorage.setItem('APP_VERSION', import.meta.env.VITE_APP_VERSION)
          LocalStorage.setItem('lang', lang)
        }

        await Promise.all([gs.checkHealth(), ias.getBase()])
      } catch {
        return next({ name: 'ftc' })
      }
    }

    if (requireAuth && !!!as.info.id)
      return next({ name: 'main', params: { lang } })

    if (
      !!as.info.id &&
      !!!as.messenger &&
      !['pnf', 'ftc'].includes(to.name as string)
    ) {
      try {
        await initMessenger()
      } catch {
        return next({ name: 'ftc' })
      }
    }

    return next()
  })

  Router.afterEach((to, from) => {
    if (
      from.name &&
      to.name &&
      (to.name !== from.name || to.query.page !== from.query.page)
    ) {
      const gs = useGlobalStore(store)
      gs.adsense.reloadAdKey++
    }
  })

  return Router
})
