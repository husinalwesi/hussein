<template>
  <div class="w-full order-3">
    <SharePaymentSummaryBox
      :total-amount="totalAmount"
      :total-amount-with-discount="totalAmountWithDiscount"
      :discount="discount"
      :share="share"
      :amount="amount"
      :payment-config="paymentConfig"
    />

    <div class="mb-14 min-550:hidden px-4 flex justify-center w-full">
      <ContinueShoppingLink
        @continueShoppingEmmiter="continueShoppingEmitHandler"
      />
    </div>
  </div>
</template>

<script>
import SharePaymentSummaryBox from "@/components/BookingFlow/SharePaymentSummaryBox";
import ContinueShoppingLink from "@/components/BookingFlow/BottomBar/ContinueShoppingLink/index.vue";

export default {
  name: "BookingRecieptSummary",
  components: {
    SharePaymentSummaryBox,
    ContinueShoppingLink,
  },
  props: {
    totalAmount: {
      type: Number,
      default: 0
    },
    totalAmountWithDiscount: {
      type: Number,
      default: 0
    },
    discount: {
      type: Array,
      default: () => []
    },
    share: {
      type: Object,
      default: () => ({})
    },
    amount: {
      type: Object,
      default: () => ({})
    },
    paymentConfig: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['continueShoppingEmmiter'],
  methods: {
    continueShoppingEmitHandler() {
      this.$emit("continueShoppingEmmiter");
    }
  }
};
</script>