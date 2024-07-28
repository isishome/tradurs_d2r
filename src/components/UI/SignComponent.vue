<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from 'src/stores/global-store'
import { useAccountStore } from 'src/stores/account-store'

const route = useRoute()
const router = useRouter()
const gs = useGlobalStore()
const as = useAccountStore()

interface IProps {
  compact?: boolean
}
withDefaults(defineProps<IProps>(), {
  compact: false
})

const { t } = useI18n({ useScope: 'global' })

const sign = () => {
  if (as.signed) {
    gs.showLoading()
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
        gs.hideLoading()
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
    v-if="compact"
    round
    dense
    flat
    aria-label="Tradurs SignIn Button"
    :icon="as.signed ? 'logout' : 'login'"
    @click="sign"
  />
  <q-item v-else clickable @click="sign">
    <q-item-section avatar>
      <q-icon :name="as.signed ? 'logout' : 'login'" />
    </q-item-section>
    <q-item-section>
      {{ as.signed ? t('sign.signOut') : t('sign.signIn') }}
    </q-item-section>
  </q-item>
</template>
