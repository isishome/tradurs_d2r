<template>
  <q-list class="help" separator>
    <q-item>
      <q-item-section>
        <q-item-label>
          <img src="~assets/help/add/01.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          1. Click the
          <span class="text-red"
            ><q-avatar
              icon="add"
              color="secondary"
              class="text-white"
              size="sm"
          /></span>
          icon on the bottom left.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/add/02.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space">
          2. Item registration is carried out in the following order: Basic
          Settings > Affix Settings > Auction Settings > Final Confirmation.
        </q-item-label>
        <q-item-label class="line-space q-pl-sm">
          In the basic settings step, you set the basic options of the item,
          such as region, quality, category, and quantity.
        </q-item-label>
        <q-item-label class="line-space q-pl-sm">
          Once you have completed entering the basic information, click
          <span class="text-primary">Continue</span> at the bottom right to
          proceed to the next step.
        </q-item-label>
        <q-item-label class="line-space q-pl-sm q-mb-xl">
          You can automatically enter item information using the
          <span class="text-indigo-4 text-weight-bold">Image Analysis</span>
          function.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/add/03.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space">
          3. Select a well-cut item image or paste the image copied to the
          clipboard to start the analysis.
        </q-item-label>
        <q-item-label class="line-space q-pl-sm q-mb-xl">
          If you use a plugin to
          <span class="text-red"
            >darken the item background or use a highly readable font</span
          >, you can experience a better recognition rate.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/add/04.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space">
          4. In the affix settings step, you can add, delete, and change the
          order of the item's affixes and change the affix values.
        </q-item-label>
        <q-item-label class="line-space q-pl-sm">
          When the settings are complete, Click
          <span class="text-primary">Continue</span> to proceed.
        </q-item-label>
        <q-item-label class="line-space q-pl-sm q-mb-xl">
          If you need to add consecutive affixes to the affixes, Change the
          <u>Select connection affix</u> section on the right. (Optional)
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/add/05.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space">
          5. In the auction settings step, enter the transaction items required
          for the auction, minimum unit, starting quantity, instant purchase
          quantity, auction progress time, etc.
        </q-item-label>
        <q-item-label class="line-space q-pl-sm q-mb-xl">
          Once the setup is complete, Click
          <span class="text-primary">Continue</span> to proceed.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/add/06.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          6.1. In the final step, you can check the item information to be
          registered and set the item image.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/add/0601.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          6.2. If you want to change the item image, click the icon in the upper
          right corner of the image.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/add/0602.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          6.3. Select the image you want to change.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/add/07.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          6.4. Click the <span class="text-positive">Complete</span> button to
          select the items to register, Register and Start Auction.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/add/08.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          7.1 If you only register, the item status will be displayed as
          <span class="text-blue-grey-4">Auction Waiting</span>, and if it is in
          the waiting state, you can edit or delete the item.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/add/09.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          7.2. When you hover over an item card, a
          <span><q-icon name="more_vert" /></span> icon will appear to the right
          of the item name, allowing you to use additional features.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/add/10.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          7.3. When you click <span class="text-primary">Start auction</span>,
          the status will change from

          <span class="text-blue-grey-4">Waiting</span> to

          <span class="text-blue-grey-4">In Progress</span>.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/add/11.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space">
          8. Auction item registration has been completed successfully.
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
