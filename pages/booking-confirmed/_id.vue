<template>
  <BookingConfirmed class="pb-20" />
</template>
<script>
import BookingConfirmed from "@/components/BookingFlow/BookingConfirmed";

export default {
  // TODO: Come back here and find out why this page would be broken if we changed its name.
  // eslint-disable-next-line vue/component-definition-name-casing
  name: "booking-confirmed",
  components: {
    BookingConfirmed,
  },
  head() {
    return this.$seoGenerator({}, this.$t("BOOKING_CONFIRMATION.TITLE"));
  }
};
</script>
<style lang="scss" scoped>
</style>
