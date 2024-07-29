<template>
  <q-list class="help" separator>
    <q-item>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-bold text-primary"
          >1. 현금 거래도 가능한가요?</q-item-label
        >
        <q-item-label caption class="q-pl-md q-py-md line-space"
          >트레이더스는 게임 내 재화를 이용한 거래만 허용되며, 현금 거래를
          허용하지 않습니다.</q-item-label
        >
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-bold text-primary"
          >2. 어떤 정보가 데이터에 저장되나요?</q-item-label
        >
        <q-item-label caption class="q-pl-md q-py-md line-space">
          기본적으로 거래에 사용될 고유 정보인 이메일과 배틀태그, 이중으로
          암호화 된 비밀번호가 저장됩니다.
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-bold text-primary"
          >3. 사이트는 안전한가요?</q-item-label
        >
        <q-item-label caption class="q-pl-md q-py-md line-space">
          사이트 설계 시 단순히 거래만이 아닌 보안에도 중점을 두고
          개발되었습니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/basic/mozilla.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label>
          <a
            href="https://observatory.mozilla.org/analyze/d4.tradurs.com"
            target="_blank"
            rel="noopener noreferrer"
            >Mozilla Observatory - D2R Tradurs</a
          >
        </q-item-label>
        <q-item-label caption class="q-pb-md line-space">
          모질라(Mozilla)에서 제공하는 보안 체크를 'B' 등급으로 통과하였습니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/basic/w3.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label>
          <a
            href="https://validator.w3.org/nu/?doc=https%3A%2F%2Fd4.tradurs.com%2F"
            target="_blank"
            rel="noopener noreferrer"
            >W3C Markup Validation - D2R Tradurs</a
          >
        </q-item-label>
        <q-item-label caption class="q-pb-md line-space">
          W3C에서 제공하는 웹 표준 체크에 1건의 체크 항목만 표시됩니다.
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
