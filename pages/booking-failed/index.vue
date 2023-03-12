<template>
  <main class="booking-faild-main">
    <SolidBlurBG :is-bg-image="true" />

    <section class="flex max-w-1xl mx-auto">
      <div class="content-container">
        <h1 class="title">
          {{ $t("BOOKING_FAILED.BUY_TICKETS") }}
        </h1>

        <div class="faild-details-container">
          <CardContainer
            wrapper-classes="px-[0.938rem] py-6 min-550:px-[1.938rem] min-550:py-8"
          >
            <template #card-content>
              <h2 class="card-title">
                {{ $t("BOOKING_FAILED.ERROR_MESSAGE") }}
              </h2>
              <div class="description-wrapper">
                <p class="description">
                  {{ $t("BOOKING_FAILED.WE_COULDNT_PROCESS_YOUR_PAYMENT") }}
                  <span v-if="isOrderWithoutReservationCode">
                    {{ $t("BOOKING_FAILED.PLEASE_CONTACT_OUR_SUPPORT_TEAM") }}
                  </span>
                </p>
              </div>
              <template v-if="!isOrderWithoutReservationCode">
                <BaseButton
                  btn-type="button"
                  :text="$t('BOOKING_FAILED.BACK_TO_PAYMENT')"
                  @onBtnClick="redirectToPayment"
                />
              </template>
            </template>
          </CardContainer>

          <div
            class="min-1176:pb-[5.25rem] min-1176:px-8 mt-10 pb-[3.5rem] px-4"
          >
            <ContactUs />
          </div>
        </div>
      </div>
    </section>

    <BottomBar current-step="payment-failed" />
  </main>
</template>
<script>
import BottomBar from "@/components/BookingFlow/BottomBar";
import ContactUs from "@/components/BookingFlow/BookingConfirmed/ContactUs.vue";

export default {
  name: "BookingFailed",
  components: {
    BottomBar,
    ContactUs,
  },
  data() {
    return {
      isOrderWithoutReservationCode: false
    };
  },
  head() {
    return this.$seoGenerator({}, this.$t("PAGES_TITLE.BOOKING.BUY_TICKETS"));
  },
  created() {
    this.isOrderWithoutReservationCode = this.$repositories.toBoolean(this.$route.query.noReservationCode);
  },
  methods: {
    redirectToPayment() {
      this.$router.push(this.localePath("/booking/buy-tickets"));
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./booking-failed.scss";
</style>
