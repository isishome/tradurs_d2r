<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Logo from '/images/logo.webp'

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <div class="absolute-center column items-center q-gutter-sm full-width">
    <div class="row justify-center items-center q-gutter-sm">
      <img
        class="logo"
        :src="Logo"
        width="48"
        height="48"
        alt="Tradurs Logo Image"
      />
      <div class="letter text-secondary">Tradurs</div>
    </div>
    <div class="text-h6">{{ t('page.pnf') }}</div>
    <div class="q-mt-lg">
      <q-btn
        aria-label="Tradurs Main Page Button"
        color="primary"
        class="bw"
        :label="t('notFound.gotoMain')"
        :to="{ name: 'main' }"
      />
    </div>
  </div>
</template>

<style scoped>
.logo {
  animation: opacity 1.4s ease-out forwards;
}

.letter {
  transition: fill 0.3s ease;
  animation: slidein 0.3s ease-out 0.3s forwards;
  opacity: 0;
  font-size: 40px;
  font-weight: bold;
}

@keyframes opacity {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slidein {
  0% {
    transform: translateX(2%);
    opacity: 0;
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (hover: hover) {
  .bw:deep(.btn) {
    filter: none !important;
  }
}
</style>
