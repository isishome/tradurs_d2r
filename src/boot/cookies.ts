import { boot } from 'quasar/wrappers'
import { cookies } from 'src/composables/useCookies'
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default boot(({ ssrContext }) =>
  /* { app, router, ... } */
  {
    // something to do
    cookies.create(ssrContext)
  }
)
