<template>
  <q-list class="help" separator>
    <q-item>
      <q-item-section>
        <q-item-label>
          <img src="~assets/help/join/01.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          1. 우측 상단의 로그인 아이콘을 클릭하여 트레이더스 사이트 로그인
          페이지로 이동합니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/02.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          2. 구글, 배틀넷, 네이버, 카카오톡 간편 인증 아이콘 또는 일반 가입으로
          진행하는 경우 <u>트레이더스가 처음이신가요?</u> 를 클릭합니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/03.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          3. 이메일 주소(<span class="text-red"
            >가입 이후 인증을 위해 실제 이메일 수신이 가능한</span
          >)와 비밀번호를 설정하고 가입을 진행합니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/04.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          4. 간편 인증의 경우 <u>임의의 비밀번호가 자동 입력되며</u>, 필요한
          경우 사용자가 직접 비밀번호를 입력할 수 있습니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/05.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          5. 가입을 진행하면 계정 인증을 위한 이메일이 발송됩니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/06.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          6. 가입할 때 사용한 이메일 주소의 인증 메일을 확인하고
          <span class="text-red text-weight-bold">인증하기</span>를 클릭합니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/07.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          7. 인증이 정상적으로 완료되면 가입 시 사용한 계정으로 로그인합니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/08.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          8. 우측 상단의 톱니바퀴 아이콘을 클릭하여 사용자 정보 페이지로
          이동합니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/09.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space">
          9. 배틀 태그 변경 항목에서 사용하는 배틀 태그로
          <span class="text-primary">변경</span> 후 우측
          <span class="text-positive">인증</span> 버튼을 클릭하여 배틀넷 인증을
          진행합니다.
        </q-item-label>
        <q-item-label class="line-space q-mb-xl q-pl-sm">
          (배틀넷 간편 인증 가입자의 경우 배틀 태그 인증은 자동으로 진행됩니다.)
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/10.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          10. 필요한 경우 아바타를 변경할 수 있습니다.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/11.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space">
          11. 회원 탈퇴는 가입 시 사용한 이메일 주소를 입력하고 진행하면 됩니다.
        </q-item-label>
        <q-item-label class="line-space q-mb-xl q-pl-sm text-red">
          회원 탈퇴 시 사용하던 계정의 이메일 주소는 다시 사용할 수 없습니다.
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
