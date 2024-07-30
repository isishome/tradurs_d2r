<template>
  <q-list class="help" separator>
    <q-item>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-bold text-primary"
          >1. Is cash trading possible?</q-item-label
        >
        <q-item-label caption class="q-pl-md q-py-md line-space"
          >Tradurs only allows trading using in-game currency, and does not
          allow cash trading.</q-item-label
        >
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-bold text-primary"
          >2. What information is stored in the data?</q-item-label
        >
        <q-item-label caption class="q-pl-md q-py-md line-space">
          Basically, unique information used for transactions, such as email and
          battle tag, and a double-encrypted password, are stored.
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-bold text-primary"
          >3. Is the site safe?</q-item-label
        >
        <q-item-label caption class="q-pl-md q-py-md line-space">
          The site was designed with a focus on security, not just transactions.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/basic/mozilla.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label>
          <a
            href="https://observatory.mozilla.org/analyze/d2r.tradurs.com"
            target="_blank"
            rel="noopener noreferrer"
            >Mozilla Observatory - D2R Tradurs</a
          >
        </q-item-label>
        <q-item-label caption class="q-pb-md line-space">
          Passed the security check provided by Mozilla with a 'B' grade.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/basic/w3.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label>
          <a
            href="https://validator.w3.org/nu/?doc=https%3A%2F%2Fd2r.tradurs.com%2F"
            target="_blank"
            rel="noopener noreferrer"
            >W3 C Markup Validation - D2R Tradurs</a
          >
        </q-item-label>
        <q-item-label caption class="q-pb-md line-space">
          Only one check item is displayed in the web standard check provided by
          W3C.
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
<style lang="scss" scoped>
.help {
  &:deep(img) {
    max-width: 100%;
  }
}

.line-space {
  line-height: 2 !important;
}
</style>
