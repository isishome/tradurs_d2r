<template>
  <q-list class="help" separator>
    <q-item>
      <q-item-section>
        <q-item-label>
          <img src="~assets/help/yolk/01.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space">
          When you hover over a user battle tag, the number of yolks you
          currently own will be displayed.
        </q-item-label>
        <q-item-label class="line-space">
          As of 2024-07-29, <span class="text-primary">30 yolks</span> are given
          upon registration, and up to
          <span class="text-primary">30 yolks</span> are recharged
          <span class="text-red">per day</span> upon logging in.
        </q-item-label>
        <q-item-label class="line-space">
          If you own more than 30 yolks when recharging,<u>
            no more will be added.</u
          >
        </q-item-label>
        <q-item-label class="line-space text-body1">
          When registering or bidding on an auction item,

          <span class="text-primary">1</span> yolk is consumed.
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
