<template>
  <q-list class="help" separator>
    <q-item>
      <q-item-section>
        <q-item-label>
          <img src="~assets/help/auction/01.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          1. 아이템 카드를 클릭하면 해당 아이템의 경매 진행 상황을 확인할 수
          있습니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/auction/02.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          2. 입찰 수량(금액) 항목에 원하는 입찰 금액을 입력한 후
          <span class="text-primary">입찰</span> 버튼을 클릭하면 경매에 참여할
          수 있습니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/auction/03.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          3. 아이템 경매 진행자는 위와 같이 표시됩니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/auction/04.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          4. 해당 아이템 페이지가 아닌 다른 페이지에 있더라도 푸시 알림을 받을
          수 있습니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/auction/05.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          5. 경매가 완료되면 최종 낙찰된 항목이 활성 색상으로 표시되며 경매자와
          낙찰자의 배틀 태그가 좌측 하단에 추가됩니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/auction/06.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space">
          6. 거래가 정상적으로 완료되면 경매자는 낙찰자에 대한 평가를 할 수
          있으며,
        </q-item-label>
        <q-item-label class="line-space q-pl-sm q-mb-xl">
          평가 점수에 따라 매너 온도가 변경됩니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/auction/07.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          7. 낙찰자 역시 경매자에 대한 평가를 진행할 수 있습니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/auction/08.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          8. 평가와 상관없이 낙찰이 된 시점에 경매는 완료되며 아이템 카드에는
          최종 낙찰가가 표시됩니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/auction/09.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          9. 만약 실제 거래가 성사되지 않았을 경우
          <span class="text-red">복제</span> 기능을 이용하여 아이템을 편하게
          다시 등록할 수 있습니다.
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
