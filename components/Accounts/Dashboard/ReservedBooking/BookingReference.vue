<template>
  <div class="booking-reference-container">
    <div>
      <div class="flex flex-col">
        <p class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-xs text-[#606060] md:text-right">
          {{ $t("ACCOUNT_PAGE.DASHBOARD.RESERVED_BOOKING.BOOKING_REFERENCE.TITLE") }}
        </p>
        <p class="ltr:font-inter-bold rtl:font-noto-sans-arabic-bold text-base text-[#191919]">
          {{ bookingReference.referenceId }}
        </p>
      </div>
      <div class="flex flex-col mt-4 md:hidden">
        <p class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-xs text-[#606060]">
          {{ $t("ACCOUNT_PAGE.DASHBOARD.RESERVED_BOOKING.BOOKING_REFERENCE.NUM_OF_TICKETS") }}
        </p>
        <p class="ltr:font-inter-bold rtl:font-noto-sans-arabic-bold text-base text-[#191919]">
          {{
            `${$pluralTextHandler(bookingReference.totalNumOfTickets, 'tickets')}`
          }}
        </p>
      </div>
    </div>
    <img
      v-if="!!bookingReference.qrCodeImage"
      :src="bookingReference.qrCodeImage"
      alt="qr code"
      title="qr code"
      width="88"
      height="88"
      class="h-[88px] w-[88px] max-w-[88px] max-h-[88px] md:hidden"
    >
  </div>
</template>

<script>
export default {
  props: {
    bookingReference: {
      type: Object,
      default: () => ({
        referenceId: "",
        totalNumOfTickets: 0,
        totalPrice: 0,
        qrCodeImage: ""
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.booking-reference-container {
  @apply flex items-center justify-between flex-1 md:w-fit md:px-8 flex-wrap md:absolute md:top-0 md:ltr:right-0 md:rtl:left-0;
}
</style>
