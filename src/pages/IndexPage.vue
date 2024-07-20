<script setup lang="ts"></script>

<template>
  <div>
    <div class="q-pt-xl">메인 페이지</div>
    <q-btn
      class="absolute-bottom-right"
      color="primary"
      round
      label="+"
      :to="{ name: 'add' }"
    />
  </div>
</template>
