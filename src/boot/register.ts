import { boot } from 'quasar/wrappers'

import SearchComponent from 'components/UI/SearchComponent.vue'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app } /* { app, router, ... } */) => {
  // something to do
  app.component('D2Search', SearchComponent)
})
