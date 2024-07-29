<template>
  <q-list class="help" separator>
    <q-item>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-bold text-primary">
          1. Unicorn
        </q-item-label>
        <q-item-label caption class="q-pl-md q-py-md line-space">
          Add tradurs.com by selecting Unicorn Settings > Whitelist
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/allow/01.webp" alt="Tradurs Help Image" />
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-bold text-primary">
          2. AdBlock
        </q-item-label>
        <q-item-label caption class="q-pl-md q-py-md line-space">
          If you are using an ad block extension, click on the ad block
          extension icon when you are on the tradur's site and set it to Always
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/allow/02.webp" alt="Tradurs Help Image" />
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-bold text-primary">
          3. AdGuard
        </q-item-label>
        <q-item-label caption class="q-pl-md q-py-md line-space">
          Add tradurs.com by selecting AdGuard Settings > Whitelist
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/allow/03.webp" alt="Tradurs Help Image" />
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-bold text-primary">
          4. uBlock Origin
        </q-item-label>
        <q-item-label caption class="q-pl-md q-py-md line-space">
          Add tradurs.com by selecting User Block Settings > Trusted sites
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/allow/04.webp" alt="Tradurs Help Image" />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
<style lang="scss" scoped>
.help {
  &:deep(img) {
    max-width: 100%;
    border: solid 1px var(--border-color);
    border-radius: 4px;
  }
}

.line-space {
  line-height: 2 !important;
}
</style>
