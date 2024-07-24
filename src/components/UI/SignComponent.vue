<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useGlobalStore } from 'src/stores/global-store'
import { useAccountStore } from 'src/stores/account-store'

const route = useRoute()
const router = useRouter()
const gs = useGlobalStore()
const as = useAccountStore()

const sign = () => {
  if (as.signed) {
    gs.loading = true
    as.signOut()
      .then((result: boolean) => {
        if (!result) {
          if (route.matched.some((m) => m.meta.requireAuth))
            router.push({
              name: 'main',
              replace: true
            })
          else router.go(0)
        }
      })
      .catch(() => {
        //
      })
      .then(() => {
        gs.loading = false
      })
  } else {
    const path: Array<string> = []
    path.push(import.meta.env.VITE_APP_TRADURS)
    path.push(gs.lang)
    path.push(`sign?redirect=${encodeURIComponent(document.location.href)}`)
    document.location.href = path.join('/')
  }
}
</script>

<template>
  <q-btn
    round
    dense
    flat
    aria-label="Tradurs SignIn Button"
    :icon="as.signed ? 'logout' : 'login'"
    @click="sign"
  />
</template>
