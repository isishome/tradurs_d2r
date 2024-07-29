<template>
  <q-list class="help" separator>
    <q-item>
      <q-item-section>
        <q-item-label>
          <img src="~assets/help/join/01.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          1. Click the login icon in the upper right corner to go to the Tradurs
          site login page.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/02.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          2. If you are proceeding with the Google, Battle.net, Naver, KakaoTalk
          social login icon or general registration, click
          <u>New to Tradurs?</u>.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/03.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          3. Set the email address (<span class="text-red"
            >where you can receive actual emails for authentication after
            signing up</span
          >) and password and proceed with signing up.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/04.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          4. In the case of social login,
          <u>a random password is automatically entered</u>, and the user can
          enter the password directly if necessary.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/05.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          5. When you sign up, an email will be sent for account verification.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/06.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          6. Check the verification email for the email address you used when
          signing up and Click
          <span class="text-red text-weight-bold">VERIFY</span>.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/07.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          7. Once authentication is completed successfully, log in with the
          account you used when signing up.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/08.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          8. Click the gear icon in the upper right corner to go to the user
          information page.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/09.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space">
          9. In the Change Battle Tag section,
          <span class="text-primary">Change</span> to the battle tag used, and
          then click the <span class="text-positive">VERIFY</span> button on the
          right to proceed with Battle.net social login.
        </q-item-label>
        <q-item-label class="line-space q-mb-xl q-pl-sm">
          (For Battle.net social login subscribers, Battle Tag authentication is
          automatically performed.)
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/10.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space q-mb-xl">
          10. You can change your avatar if necessary.
        </q-item-label>
        <q-item-label>
          <img src="~assets/help/join/11.webp" alt="Tradurs Help Image" />
        </q-item-label>
        <q-item-label class="line-space">
          11. To withdraw your account, enter the email address you used when
          signing up and proceed.
        </q-item-label>
        <q-item-label class="line-space q-mb-xl q-pl-sm text-red">
          When you withdraw your account, the email address you used for the
          account cannot be used again.
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
