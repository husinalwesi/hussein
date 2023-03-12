<template>
  <nuxt-link
    :to="localePath('/')"
    class="skip-for-now-link"
  >
    {{ $t('BOOKINGFLOW_PAGE.SKIP_FOR_NOW') }}
  </nuxt-link>
</template>

<script>
export default {
  methods: {
    skipForNowButton() {
      alert("clicked..");
    },
  },
};
</script>

<style lang='scss' scoped>
@import "./SkipForNow.scss";
</style>
