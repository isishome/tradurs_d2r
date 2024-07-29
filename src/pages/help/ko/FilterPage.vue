<template>
  <q-list class="help" separator>
    <q-item>
      <q-item-section>
        <q-item-label>
          <img src="~assets/help/filter/01.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          1. 아이템 목록 좌측 하단에 필터 아이콘을 클릭합니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/filter/02.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space">
          2. 좌측에 필터 창이 스와이프 됩니다. 순서대로,
        </q-item-label>
        <q-item-label class="line-space q-pl-sm">
          필터 초기화 버튼은 말 그대로 모든 필터 항목을 초기화합니다.
        </q-item-label>
        <q-item-label class="line-space q-pl-sm">
          내 아이템, 입찰 아이템, 즐겨 찾는 아이템 항목은 로그인 상태에만
          표시됩니다.
        </q-item-label>
        <q-item-label class="line-space q-pl-sm">
          아이템 등록 시 기본 설정 단계에 입력한 데이터를 바탕으로 한 필터
          항목들이 표시됩니다.
        </q-item-label>
        <q-item-label class="line-space q-pl-sm q-mb-xl">
          아이템 상태에 따른 필터 역시 가능합니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/filter/03.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          3.1. <span class="text-primary">속성 그룹 추가</span>를 클릭하면,
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/filter/04.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          3.2. 속성 그룹 필터를 3개까지 추가할 수 있으며 각 그룹들은
          <span class="text-red">OR 검색</span>됩니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/filter/05.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          3.3. 속성 필터 추가 검색을 통해 속성을 검색 추가합니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/filter/06.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          3.4. 속성 값을 지정하면 지정한 속성의 해당 속성 값 이상과 매칭되는
          아이템들을 필터 할 수 있습니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/filter/07.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          3.5. 각 속성 그룹에는 3개의 속성 필터를 추가할 수 있으며 그룹 안의
          속성 필터들은 <span class="text-red">AND 검색</span>됩니다.
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
