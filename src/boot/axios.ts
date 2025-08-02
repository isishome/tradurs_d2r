import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { Notify, QNotifyUpdateOptions } from 'quasar'
import { i18n } from './i18n'
import { defaultUser } from 'src/types/user'
import { useGlobalStore } from 'stores/global-store'
import { useAccountStore } from 'stores/account-store'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND,
  withCredentials: true
})
let dismiss:
  | undefined
  | {
      (props?: QNotifyUpdateOptions): void
      (props?: QNotifyUpdateOptions): void
    }

export default boot(({ app, store }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  api.interceptors.response.use(
    function (response) {
      return response
    },
    function (error) {
      const gs = useGlobalStore(store)
      const as = useAccountStore(store)
      const status =
        error.response && error.response.status ? error.response.status : null
      let message = (error.response && error.response.data) || error.message
      const caption = (typeof message === 'object' && message.caption) || ''
      message = (typeof message === 'object' && message.body) || message

      if (process.env.SERVER || dismiss) return

      if ([401, 403].includes(status)) {
        as.signed = false
        Object.assign(as.info, defaultUser())

        const url = [
          import.meta.env.VITE_APP_TRADURS,
          gs.lang,
          status === 401
            ? `sign?redirect=${encodeURIComponent(document.location.href)}`
            : 'info'
        ]

        Notify.create({
          progress: true,
          icon: 'warning',
          color: 'warning',
          textColor: 'dark',
          multiLine: true,
          message,
          caption,
          actions: [
            {
              noCaps: true,
              dense: true,
              class: 'no-hover text-underline',
              label: i18n.global.t('btn.move'),
              color: 'dark',
              handler: () => {
                document.location.replace(url.join('/'))
              }
            }
          ],
          onDismiss: () => {
            dismiss = undefined
          }
        })
      } else {
        let message = (error.response && error.response.data) || error.message
        const caption = (typeof message === 'object' && message.caption) || ''
        message = (typeof message === 'object' && message.body) || message

        Notify.create({
          icon: 'error',
          color: 'red-8',
          message,
          caption,
          timeout: 3000,
          onDismiss: () => {
            dismiss = undefined
          }
        })
      }

      return Promise.reject()
    }
  )

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { axios, api }
