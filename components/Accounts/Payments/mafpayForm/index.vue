<template>
  <form
    v-if="MPASSToken"
    method="POST"
    :action="`${baseUrl}/tokenize`"
    class="mafpay-form"
    enctype="application/x-www-form-urlencoded"
  >
    <input type="hidden" name="merchantId" :value="mafPay.merchantId">
    <input type="hidden" name="command" value="tokenize">
    <input type="hidden" name="verifyCard" value="threeDs">
    <input type="hidden" name="auth0Token" :value="MPASSToken">
    <input
      type="hidden" name="tokenizev2"
      value="true"
    >
    <input
      type="hidden" name="returnUrl"
      :value="returnUrl"
    >
    <div class="card-inputs-container">
      <div v-if="isOmanSite" class="card-input-field card-holder-name-input-container">
        <MafpayCardHolderName
          ref="mafpayCardHolderNameRef"
          :mandatory="true"
          :placeholder="$t('ACCOUNT_PAGE.PAYMENTS.ADD_CARD.FORM_FIELDS.CARD_HOLDER_NAME')"
          @cardHolderNameStatus="handleCardInputsStatus($event, 'cardHolderName')"
        />
      </div>
      <div class="card-content-fields-container">
        <div class="card-input-field card-number-input-wrapper">
          <MafpayCardNumber
            ref="mafpayCardNumberRef"
            :placeholder="$t('ACCOUNT_PAGE.PAYMENTS.ADD_CARD.FORM_FIELDS.CARD_NUMBER')"
            class="card-number"
            @cardNumberStatus="handleCardInputsStatus($event, 'cardNumber')"
          />
        </div>
        <div class="card-validity-inputs-container">
          <div class="card-input-field card-expiry-input-wrapper">
            <MafpayCardExpiry
              ref="mafpayCardExpiryRef"
              :placeholder="$t('ACCOUNT_PAGE.PAYMENTS.ADD_CARD.FORM_FIELDS.CARD_EXPIRY')"
              class="card-expiry"
              @cardExpiryStatus="handleCardInputsStatus($event, 'cardExpiry')"
            />
          </div>
          <div class="card-input-field card-cvv-input-wrapper">
            <MafpayCardCvc
              ref="mafpayCardCvcRef"
              :placeholder="$t('ACCOUNT_PAGE.PAYMENTS.ADD_CARD.FORM_FIELDS.CVV_TEXT')"
              masked="false"
              class="card-cvv"
              @cardCvcStatus="handleCardInputsStatus($event, 'cardCVC')"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex mt-4 flex-wrap gap-4 w-full items-center justify-end">
      <button
        v-if="showRemoveBtn"
        type="button"
        class="text-dark-gray text-sm leading-4 ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold"
        @click.prevent="onCardRemove"
      >
        Remove card
      </button>
      <MafpayCardSubmit
        ref="mafpayCardSubmitRef"
        :label="$t('COMMON.SAVE')"
        @tokenizationComplete="tokenizationComplete"
        @click.prevent="$emit('isSavingCardLoading')"
      />
    </div>

    <div class="mt-2 ltr:pl-4 rtl:pr-4">
      <ul class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler list-disc text-[#DD0028] text-xs">
        <li v-for="(error, index) in errors" :key="index">
          {{ $t(`MAFPAY.${error.errorCode}`) }}
        </li>
      </ul>
    </div>
  </form>
</template>

<script>
import {
  MafpayCardHolderName,
  MafpayCardNumber,
  MafpayCardExpiry,
  MafpayCardCvc,
  MafpayCardSubmit
} from "@mafpay/weblib-vue";

export default {
  components: {
    MafpayCardHolderName,
    MafpayCardNumber,
    MafpayCardExpiry,
    MafpayCardCvc,
    MafpayCardSubmit
  },
  props: {
    showRemoveBtn: {type: Boolean, default: true},
  },
  emits: ['isSavingCardLoading', 'updatePaymentCardsList', 'stopLoading'],
  data() {
    /* eslint-disable no-undef  */
    return {
      mafPay: {
        merchantId: ''
      },
      errors: [],
      MPASSToken: "",
      returnUrl: location.href,
      isOmanSite: false,
      baseUrl: process.env.SHARED_ENVS.MAFPAY.BASE_URL
    };
  },
  created() {
    this.isOmanSite = this.$getSiteConfig("code").includes("oman");
    this.mafPay.merchantId = this.$getMafPayMerchantId();
  },
  mounted() {
    this.initializeMafPay();
    this.getMPASSToken();
    this.initializePayment();
  },
  methods: {
    initializeMafPay(){
      // if (process.client) {
        const { defineCustomElements } = require("@mafpay/weblib");
        defineCustomElements();
      // }
    },        
    initializePayment() {
      // eslint-disable-next-line no-undef
      window.MafPay.env = process.env.SHARED_ENVS.PAYMENT_ENVIRONMENT
      window.MafPay.setLanguage(this.$i18n.localeProperties.detectedLang);
    },
    resetPaymentForm() {
      if (this.$refs.mafpayCardHolderNameRef && this.isOmanSite) this.$refs.mafpayCardHolderNameRef.resetField();
      this.$refs.mafpayCardNumberRef.resetField();
      this.$refs.mafpayCardExpiryRef.resetField();
      this.$refs.mafpayCardCvcRef.resetField();
    },
    tokenizationComplete(e) {
      if (e && e.threeDsUrl) {
        window.location.replace(e.threeDsUrl);
      } else {
        if (e.responseCode === "000") {
          this.$showToast({
            type: "green",
            text: e.responseMessage,
          });
          this.resetPaymentForm();
          this.$emit("updatePaymentCardsList", e);
        } else {
          this.$showToast({
            type: "red",
            text: e.responseMessage,
          });
        }
      }
      this.$emit("stopLoading");
    },
    async getMPASSToken() {
      this.MPASSToken = await this.$getToken(false);
    },
    removeStatusByKey(key) {
      this.errors = this.errors.filter((object) => {
        return object.key !== key;
      });
    },
    handleCardInputsStatus(event, key) {
      this.removeStatusByKey(key);
      if (event.status.toLowerCase() === "invalid") {
        this.errors.push({
          errorCode: event.error.errorCode,
          key: key,
        });
      }
    },
    onCardRemove() {
    }
  }
};
</script>

<style lang="scss">
@import "./mafpayForm.scss";
</style>
