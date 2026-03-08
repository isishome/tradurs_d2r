<script setup lang="ts">
const links = [
  {
    href: 'https://d4.tradurs.com',
    label: 'Diablo® IV Tradurs',
    color: 'red-6'
  },
  {
    href: 'https://maxroll.gg/d2',
    label: 'Maxroll.gg'
  },
  {
    href: 'https://www.d2emu.com/tz',
    label: 'Terror Zone Tracker'
  },
  {
    href: 'https://www.waypoint.page/appraise',
    label: 'WayPoint'
  }
]
</script>
<template>
  <div class="column items-start useful">
    <q-btn
      v-for="(link, idx) in links"
      :key="idx"
      flat
      no-caps
      padding="0"
      :ripple="false"
      class="text-overline no-hover text-weight-bold"
      :color="link.color"
      type="a"
      :href="link.href"
      :label="link.label"
      target="_blank"
      rel="noopener noreferrer"
    />
  </div>
</template>

<style lang="scss" scoped>
.useful {
  color: currentColor;

  &:deep(.no-hover-item .q-focus-helper) {
    display: none;
  }

  & a {
    text-decoration: underline;
    text-underline-offset: 3px;
    border-radius: 0;
    line-height: 1rem;
    margin-bottom: 10px;
    opacity: 0.5;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
