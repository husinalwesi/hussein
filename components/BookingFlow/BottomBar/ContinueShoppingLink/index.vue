<template>
  <button
    type="button"
    class="continue-shopping-link"
    @click="continueShoppingButton()"
  >
    <img
      :src="require('@/assets/images/BookingFlow/left-arrow.webp')"
      width="10"
      height="10"
      class="rtl:rotate-180"
      alt="left arrow"
    >
    {{ $t('BOOKINGFLOW_PAGE.CONTINUE_SHOPPING') }}
  </button>
</template>

<script>
export default {
  name: "ContinueShoppingLink",
  emits: ['continueShoppingEmmiter'],
  methods: {
    continueShoppingButton() {
      this.$emit("continueShoppingEmmiter");
    },
  },
};
</script>

<style lang='scss' scoped>
@import "./ContinueShoppingLink.scss";
</style>
