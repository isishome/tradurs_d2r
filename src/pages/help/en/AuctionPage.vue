<template>
  <q-list class="help" separator>
    <q-item>
      <q-item-section>
        <q-item-label>
          <img src="~assets/help/auction/01.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          1. Click on the item card to check the auction progress of the item.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/auction/02.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          2. Enter the desired bid amount in the bid quantity (amount) field and
          click the <span class="text-primary">Bidding</span> button to
          participate in the auction.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/auction/03.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          3. The item auctioneer is displayed as above.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/auction/04.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          4. You can receive push notifications even if you are on a page other
          than the item page.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/auction/05.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          5. When the auction is complete, the final winning item will be marked
          in an active color and the auctioneer and winning bidder's battle tags
          will be added to the bottom left.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/auction/06.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space">
          6. When the transaction is completed normally, the auctioneer can
          evaluate the winning bidder,
        </q-item-label>
        <q-item-label class="line-space q-pl-sm q-mb-xl">
          The manner temperature changes according to the evaluation score.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/auction/07.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          7. The winning bidder can also evaluate the auctioneer.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/auction/08.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          8. Regardless of the evaluation, the auction is completed when the
          winning bid is made, and the final winning bid quantity(amount) is
          displayed on the item card.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/auction/09.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          9. If the actual transaction is not completed, you can easily
          re-register the item using the
          <span class="text-red">duplicate</span> feature.
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
