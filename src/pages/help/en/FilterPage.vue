<template>
  <q-list class="help" separator>
    <q-item>
      <q-item-section>
        <q-item-label>
          <img src="~assets/help/filter/01.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          1. Click the filter icon at the bottom left of the item list.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/filter/02.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space">
          2. The filter drawer on the left is swiped. In order,
        </q-item-label>
        <q-item-label class="line-space q-pl-sm">
          The Reset Filter button literally resets all filter sections.
        </q-item-label>
        <q-item-label class="line-space q-pl-sm">
          My Items, Bidding Items, and Favorite Items are only displayed when
          logged in.
        </q-item-label>
        <q-item-label class="line-space q-pl-sm">
          Filter items are displayed based on the data entered in the basic
          settings step when registering an item.
        </q-item-label>
        <q-item-label class="line-space q-pl-sm q-mb-xl">
          Filtering by item status is also possible.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/filter/03.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          3.1. Click <span class="text-primary">Add Affix Group</span>,
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/filter/04.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          3.2. You can add up to 3 affix group filters, and each group will be
          <span class="text-red">OR-searched</span>.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/filter/05.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          3.3. Add affix filter Search for and add affixes through search.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/filter/06.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          3.4. If you specify an affix value, you can filter items that match
          the specified affix's value or higher.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/filter/07.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          3.5. You can add up to 3 affix filters to each affix group, and the
          affix filters within the group are
          <span class="text-red">AND-searched</span>.
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
