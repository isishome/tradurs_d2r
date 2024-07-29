<template>
  <q-list class="help" separator>
    <q-item>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-bold text-primary">
          1. 유니콘
        </q-item-label>
        <q-item-label caption class="q-pl-md q-py-md line-space">
          유니콘 설정 > 화이트리스트 항목을 선택하여 tradurs.com 을 추가
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/allow/01.webp" alt="Tradurs Help Image" />
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-bold text-primary">
          2. 애드 블록
        </q-item-label>
        <q-item-label caption class="q-pl-md q-py-md line-space">
          애드 블록 확장 프로그램을 사용 중인 경우 트레이더스 사이트에 접속 중일
          때 애드 블록 확장 프로그램 아이콘을 클릭하여 Always로 항상 허용
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/allow/02.webp" alt="Tradurs Help Image" />
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-bold text-primary">
          3. 애드 가드
        </q-item-label>
        <q-item-label caption class="q-pl-md q-py-md line-space">
          애드 가드 설정 > 허용 목록을 선택하여 tradurs.com을 추가
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/allow/03.webp" alt="Tradurs Help Image" />
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-bold text-primary">
          4. 유 블록
        </q-item-label>
        <q-item-label caption class="q-pl-md q-py-md line-space">
          유 블록 설정 > 제외 목록을 선택하여 tradurs.com을 추가
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
