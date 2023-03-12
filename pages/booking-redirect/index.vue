<template>
  <main class="booking-redirect-main">
    <section class="relative">
      <SolidBlurBG custom-class="-z-1" :is-bg-image="true" />
      <snowflake-loader loader-classes="w-20 h-20" />
    </section>
  </main>
</template>

<script>
export default {
  name: "BookingRedirect",
  created() {
    this.checkReservation();
  },
  methods: {
    async checkReservation() {
      const transactionReference = this.$route.query && this.$route.query.transactionReference ? this.$route.query.transactionReference : "";

      if (transactionReference) {
        const responseCode = this.$route.query.responseCode;

        if (responseCode === "000" || responseCode === "700") {
          const orderDetails = await this.$repositories.getOrderByTransactionReference(transactionReference);

          if (orderDetails.success) {
            this.$completePurchase(orderDetails.reservationCode, responseCode === "700");
          } else {
            this.$router.push(this.localePath("/booking-failed"));
          }
        } else {
          this.$router.push(this.localePath("/booking-failed"));
        }
      } else {
        this.$router.push(this.localePath("/booking-failed"));
      }
    }
  }
};
</script>
