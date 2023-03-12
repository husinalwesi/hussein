<template>
  <CardContainer>
    <template #card-content>
      <div id="payment-page">
        <div
          v-if="
            isFullPageLoaderEnabled &&
              ($isUserAuthenticated()
                ? $isUserAuthenticated() && !isShareFinishLoad
                : true) &&
              !paymentMethodLoader
          "
          class="loader-container"
        >
          <CircleLoader />
        </div>
        <h2 class="title">
          {{ paymentConfig && paymentConfig.title ? paymentConfig.title : $t('BOOKINGFLOW_PAGE.PAYMENT_DETAILS') }}
        </h2>
        <p class="sub-title">
          {{ paymentConfig && paymentConfig.subtitle ? paymentConfig.subtitle : $t('BOOKINGFLOW_PAGE.SELECT_PAYMENT_METHOD') }}
        </p>
        <Share
          v-if="$isUserAuthenticated() && isShareEnabled"
          :is-disabled="isShareDisabled"
          :discount="discount"
          :is-enabled="selectedOption == 'share'"
          :order-price="amount.GROSS.toString()"
          :share="share"
          :fire-reset="reset.share"
          :prepare-save-payload="prepareSavePayload"
          @changeEmmiter="setShareActive()"
          @shareChangeEmiter="shareChangeEmitHandler"
          @loaderFinished="shareChangeEmitHandler"
        />
        <ul class="list">
          <li v-for="(component, index) in filteredComponentsList" :key="index">
            <div v-if="component === 'MAFPay' && !isOnlyCreditCardPaymentMethodEnabled" class="dashed-line" />
            <component
              :is="component"
              :is-enabled="selectedOption == component"
              :ispromo-disabled="ispromoDisabled"
              :is-payment-disabled="isPaymentDisabled"
              :discount="discount"
              :is-share-or-promo-code-is-selected="isShareOrPromoCodeIsSelected"
              :fire-reset="reset[component]"
              :total-amount-with-discount="getTotal"
              :static-labels="staticLabels"
              :tokenize-and-pay-guest-mode-var="tokenizeAndPayGuestModeVar"
              :promo-discount="promoDiscount"
              :packages="packages"
              :amount="amount"
              :prepare-save-payload="prepareSavePayload"
              :google-token="googleToken"
              :payment-config="paymentConfig"
              :is-data-ready="isDataReady"
              :is-data-ready-in-checkbasket="isDataReadyInCheckbasket"
              @tabEmmiter="setPromoCodeActive(component)"
              @selectedCreditCardEmiter="selectedCreditCardEmitHandler"
              @promoCodeChangeEmiter="promoCodeChangeEmitHandler"
              @changeEmmiter="setPromoCodeActive(component)"
              @guestModePay="guestModePay"
              @blockPayment="blockPayment"
              @loaderFinished="paymentMethodLoader = true"
            />
          </li>
        </ul>
      </div>
    </template>
  </CardContainer>
</template>
<script>
import PromoCode from "@/components/Shared/Payment/PromoCode";
import MAFPay from "@/components/Shared/Payment/MAFPay";
import Share from "@/components/Shared/Payment/Share";

export default {
  name: "BuyTickets",
  components: {
    PromoCode,
    Share,
    MAFPay,
  },
  props: {
    prepareSavePayload: {
      type: Object,
      default: () => ({}),
    },
    promoDiscount: {
      type: Number,
      default: () => 0,
    },
    staticLabels: {
      type: Object,
      default: () => ({}),
    },
    discount: {
      type: Array,
      default: () => [],
    },
    totalAmountWithDiscount: {
      type: Number,
      default: () => 0,
    },
    share: {
      type: Object,
      default: () => ({}),
    },
    amount: {
      type: Object,
      default: () => ({}),
    },
    isFullPageLoaderEnabled: {
      type: Boolean,
      default: false,
    },
    tokenizeAndPayGuestModeVar: {
      type: Boolean,
      default: false,
    },
    packages: {
      type: Array,
      default: () => [],
    },
    googleToken: {
      type: String,
      default: "",
    },
    paymentConfig: {
      type: Object,
      default: () => ({}),
    },
    isDataReadyInCheckbasket: {
      type: Boolean,
      default: false,
    },
    isDataReady: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['blockPayment', 'guestModePay', 'shareChangeEmiter', 'promoCodeChangeEmiter', 'selectedCreditCardEmiter'],
  data() {
    return {
      selectedOption: "share",
      componentsList: ["PromoCode", "MAFPay"],
      reset: {
        share: false,
        PromoCode: false,
      },
      isShareOrPromoCodeIsSelected: false,
      isShareFinishLoad: false,
      paymentMethodLoader: false
    };
  },
  head() {
    return this.$seoGenerator({}, this.$t("PAGES_TITLE.BOOKING.BUY_TICKETS"));
  },
  computed: {
    isShareEnabled(){
      return this.paymentConfig && !this.paymentConfig.hide_share;
    },
    isOnlyCreditCardPaymentMethodEnabled(){
      return !this.isShareEnabled && !this.isPromoCodeEnabled;
    },
    filteredComponentsList(){
      return this.isPromoCodeEnabled ? this.componentsList : [this.componentsList[1]];
    },
    isPromoCodeEnabled(){
      return this.paymentConfig && this.paymentConfig.promo_code && this.paymentConfig.promo_code.id;
    },
    isShareDisabled() {
      if (!this.isShareApplied) {
        if (this.amount.GROSS == 0) return true;
      }
      return false;
    },
    ispromoDisabled() {
      if (this.isShare100PercentApplied) return true;
      return false;
    },
    isPaymentDisabled() {
      if (
        this.isShare100PercentApplied ||
        this.isShareDisabled ||
        this.getTotal == 0
      )
        return true;
      return false;
    },
    getTotal() {
      let shareDiscount = this.getShareDiscountValue;
      return this.amount.GROSS - shareDiscount;
    },
    getShareDiscountValue() {
      return this.$getShareAmount(this.discount);
    },
    isShareApplied() {
      return this.$isThereAShareApplied(this.discount);
    },
    isPromoCodeApplied() {
      return this.$isThereAPromoCode(this.discount);
    },
    isShare100PercentApplied() {
      if (this.isPromoCodeApplied) return false;
      // and not promo code
      return (
        this.getShareDiscountValue == this.amount.GROSS &&
        this.getShareDiscountValue != 0
      );
    },
  },
  methods: {
    blockPayment(flag) {
      this.$emit("blockPayment", flag);
    },
    guestModePay(event) {
      this.$emit("guestModePay");
    },
    setPromoCodeActive(component) {
      if (component == "PromoCode") {
        this.reset.share = !this.reset.share;
        setTimeout(() => {
          this.selectedOption = "PromoCode";
          this.isShareOrPromoCodeIsSelected =
            !this.isShareOrPromoCodeIsSelected;
        });
      }
    },
    setShareActive() {
      this.reset.PromoCode = !this.reset.PromoCode;
      this.selectedOption = "share";
      this.isShareOrPromoCodeIsSelected = !this.isShareOrPromoCodeIsSelected;
    },
    shareChangeEmitHandler(data) {
      this.$emit("shareChangeEmiter", data);
    },
    promoCodeChangeEmitHandler(data) {
      this.$emit("promoCodeChangeEmiter", data);
    },
    selectedCreditCardEmitHandler(selectedCardToken) {
      this.$emit("selectedCreditCardEmiter", selectedCardToken);
    }
  }
};
</script>
<style scoped lang="scss">
@import "./buy-tickets.scss";
</style>
