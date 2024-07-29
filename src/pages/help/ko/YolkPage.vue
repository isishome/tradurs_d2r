<template>
  <q-list class="help" separator>
    <q-item>
      <q-item-section>
        <q-item-label>
          <img src="~assets/help/yolk/01.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space">
          사용자 배틀 태그를 마우스 오버하면 현재 소유한 노른자 개수가
          표시됩니다.
        </q-item-label>
        <q-item-label class="line-space">
          2024-07-29 현재, 가입 시
          <span class="text-primary">30개의 노른자</span>가 지급되며, 로그인 시
          <span class="text-red">일일 최대 </span>
          <span class="text-primary">30개의 노른자</span>가 충전됩니다.
        </q-item-label>
        <q-item-label class="line-space">
          충전 시
          <u>노른자를 30개 이상 소유 중인 경우 더 이상 추가되지 않습니다.</u>
        </q-item-label>
        <q-item-label class="line-space text-body1">
          경매 아이템 등록 또는 입찰 시
          <span class="text-primary">1개의</span> 노른자가 소모됩니다.
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
