<template>
  <CardContainer
    key="payment-summary-box" class="share-payment-summary-card"
    :class="{'without-share-section': !paymentConfig || (paymentConfig && paymentConfig.hide_share)}"
  >
    <template #card-content>
      <h3 class="title">
        {{ $t('BOOKINGFLOW_PAGE.PAYMENT_SUMMARY') }}
      </h3>
      <div
        v-if="isSubtotalEnabled"
        class="total-price-details-container sub-total"
      >
        <div class="total-price">
          <p class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold text-base">
            {{ $t('BOOKINGFLOW_PAGE.SUB_TOTAL') }}
          </p>
          <p class="ltr:font-inter-bold rtl:font-noto-sans-arabic-bold text-base leading-6 flex gap-1">
            <span class="ltr:order-1 rtl:order-2">{{ currency }}</span>
            <span class="ltr:order-2 rtl:order-1">{{
              $decimalPlaces(getTotal + getShareDiscountValue + getPromoCodeDiscountValue)
            }}</span>
          </p>
        </div>
        <div v-if="isShareApplied" class="vat-total">
          <p class="flex gap-[0.188rem]">
            <span class="ltr:order-1 rtl:order-2 text-[#B5064D] ltr:font-inter-bold rtl:font-noto-sans-arabic-bold">{{
              $t('SHARE_COMPONENT.SHARE')
            }}</span>
            <span class="ltr:order-2 rtl:order-1">{{ $t('SHARE_COMPONENT.POINTS') }}</span>
            <span class="ltr:order-3 rtl:order-3">{{ $t('SHARE_COMPONENT.REDEEMED') }}</span>
          </p>
          <p class="flex gap-1">
            {{
              $t("COMMON.SHOW_NUMBER", {
                operator: '-',
                key: currency,
                value: ($decimalPlaces(getShareDiscountValue))
              })
            }}
          </p>
        </div>
        <div v-if="isPromoCodeApplied" class="vat-total">
          <p>
            {{ $t('BOOKINGFLOW_PAGE.PROMO_CODE_DISCOUNT') }}
          </p>
          <p class="flex gap-1">
            {{
              $t("COMMON.SHOW_NUMBER", {
                operator: '-',
                key: currency,
                value: ($decimalPlaces(getPromoCodeDiscountValue))
              })
            }}
          </p>
        </div>
      </div>

      <div class="total-price-details-container">
        <div class="vat-total">
          <p>{{ $t('BOOKINGFLOW_PAGE.VAT') }} (5%)</p>
          <p class="flex gap-1">
            <span class="ltr:order-1 rtl:order-2">{{ currency }}</span>
            <span class="ltr:order-2 rtl:order-1">{{ $decimalPlaces(amount.TAX) }}</span>
          </p>
        </div>
        <div class="total-price">
          <p class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold  text-base">
            {{ $t('BOOKINGFLOW_PAGE.TOTAL') }} (<span class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler">{{
              $t('BOOKINGFLOW_PAGE.VAT_INCLUDED')
            }}</span>)
          </p>
          <p class="ltr:font-inter-bold rtl:font-noto-sans-arabic-bold text-xl leading-6 flex gap-1">
            <span class="ltr:order-1 rtl:order-2">{{ currency }}</span>
            <span class="ltr:order-2 rtl:order-1">{{ $decimalPlaces(getTotal, true) }}</span>
          </p>
        </div>
      </div>

      <div v-if="$isUserAuthenticated() && (paymentConfig && !paymentConfig.hide_share)" class="share-points">
        <p class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler flex gap-[0.188rem]">
          <span class="ltr:order-1 rtl:order-1">{{ $t('SHARE_COMPONENT.EARN') }}</span>
          <span class="ltr:order-2 rtl:order-3 ltr:font-inter-bold rtl:font-noto-sans-arabic-bold ltr:text-[#B5064D]">{{
            $t('SHARE_COMPONENT.SHARE')
          }}</span>
          <span class="ltr:order-3 rtl:order-2 ltr:font-inter-bold rtl:font-noto-sans-arabic-bold rtl:text-[#B5064D]">{{
            $t('SHARE_COMPONENT.POINTS')
          }}</span>
        </p>
        <p class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold flex gap-1">
          <span class="flex gap-1">
            <span class="ltr:order-1 rtl:order-2">{{ currency }}</span>
            <span class="ltr:order-2 rtl:order-1">{{ $decimalPlaces(share.earn.amount || 0) }}</span>
          </span>
          <span>
            =
            {{ $decimalPlaces(share.earn.point || 0) }}
            {{ $t('SHARE_COMPONENT.PTS') }}
          </span>
        </p>
      </div>
    </template>
  </CardContainer>
</template>
<script>
import NP from "number-precision";

export default {
  props: {
    totalAmount: {
      type: Number,
      default: 0,
    },
    totalAmountWithDiscount: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Array,
      default: () => [],
    },
    share: {
      type: Object,
      default: () => ({}),
    },
    amount: {
      type: Object,
      default: () => ({}),
    },
    paymentConfig: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      currency: ""
    }
  },
  computed: {
    getVatValue() {
      let total = this.getTotal + this.getShareDiscountValue;
      let vat = total - total / 1.05;
      if (vat < 0) vat = 0;
      return vat;
    },
    isSubtotalEnabled() {
      const discountList = this.removeEmptyArrayOfObjectCell(this.discount);
      const isThereAppliedDiscount = !this.$isEmptyObject(discountList);

      if (!isThereAppliedDiscount) return false;

      if (this.isShareApplied) return true;

      if (this.isPromoCodeApplied) {
        if (
          this.getPromoCodeDiscountValue != 0 &&
          this.getPromoCodeDiscountValue != -1
        )
          return true;
      }
      return false;
    },
    getPromoCodeDiscountValue() {
      return this.amount.promoDiscount ? this.amount.promoDiscount : 0;
    },
    getSubTotal() {
      return this.amount.NET == 0
        ? this.amount.promoDiscount === undefined
          ? 0
          : this.amount.promoDiscount
        : Number(this.amount.NET) +
        Number(this.amount.promoDiscount ? this.amount.promoDiscount : 0);
    },
    getTotal() {
      let shareDiscount = this.getShareDiscountValue;
      let total = this.subtractionFractionNumber(this.amount.GROSS, shareDiscount);
      return total < 0 ? 0 : total;
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
  },
  created() {
    this.currency = this.$getSiteConfig('currency');
  },
  methods: {
    subtractionFractionNumber(num1, num2) {
      return NP.minus(num1, num2);
    },
    removeEmptyArrayOfObjectCell(array) {
      return array.filter((value) => Object.keys(value).length !== 0);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./SharePaymentSummaryBox.scss";
</style>
