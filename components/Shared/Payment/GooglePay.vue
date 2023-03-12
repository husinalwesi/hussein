<template>
  <div ref="mafpayGooglePayButtonContainer">
    <div v-if="googleToken">
      <MafpayGooglePayButton
        :key="googlePayKey"
        ref="mafpayGooglePayButton"
        :token="googleToken"
        :merchant-id="merchantId"
        button-color="black"
        button-type="plain"
        :enable-button-loading="true"
        :enable-processing-loading="true"
        @googlePayCompleted="googlePayCompleted"
        @googlePayError="googlePayError"
        @loadingEvent="loadingEventHandler"
      />
      <!-- merchantId : Your merchant Id from Google Pay business console
      Will only provide a value in the production, but in the other environment we will pass empty string
      -->
    </div>
    <InformativeModal
      :is-modal-active="isModalActive"
      :show-close-icon="false"
      :is-loading="false"
      :data="data"
      @onBtnClick="onModalBtnClick"
    />
  </div>
</template>
<script>
import {MafpayGooglePayButton} from "@mafpay/weblib-vue";
import {CommonEvent} from "@/services/app-events";
import InformativeModal from "@/components/BookingFlow/Modals/InformativeModal";

export default {
  name: "GooglePay",
  components: {
    MafpayGooglePayButton,
    InformativeModal
  },
  props: {
    prepareSavePayload: {
      type: Object,
      default: () => ({}),
    },
    googleToken: {
      type: String,
      default: "",
    }
  },
  emits: ["loaderFinished"],
  data() {
    return {
      merchantId: process.env.NODE_ENV === "development" ? "" : process.env.SKI_DUBAI.MAFPAY.GOOGLE_PAY_MERCHANT_ID, // TODO: Check this.
      googlePayKey: this.$getTimeStamp(),
      isModalActive: false,
      data: {
        btnText: "",
        title: "",
        description: "",
      },
    };
  },
  watch: {
    googleToken() {
      this.googlePayKey = this.$getTimeStamp();
    },
  },
  mounted() {
    // eslint-disable-next-line no-undef
    window.MafPay.env = process.env.SHARED_ENVS.PAYMENT_ENVIRONMENT;
    window.MafPay.setLanguage(this.$i18n.localeProperties.detectedLang);
  },
  methods: {
    onModalBtnClick(event) {
      this.isModalActive = false;
    },
    async googlePayCompleted(event) {
      CommonEvent.$emit("global-loader", true);
      let preCheckoutResult = await this.$preCheckout(
        {
          cardToken: "",
          securityCode: "",
          redeemAmount: this.prepareSavePayload.redeemAmount,
        },
        "google"
      );

      if (preCheckoutResult !== undefined) {
        if (preCheckoutResult.data.code) {
          let errorMessage = Number(preCheckoutResult.data.code) == 5035 ? this.$t('BOOKINGFLOW_PAGE.SELECTED_TIMESLOTS_IS_BOOKED_NOW') : preCheckoutResult.data.errorMessage;
          this.data = {
            btnText: this.$t('COMMON.OK'),
            title: errorMessage,
            description: errorMessage,
          };
          CommonEvent.$emit("global-loader", false);
          this.isModalActive = true;
        } else {
          if (preCheckoutResult.data.reservationCode) {
            if (["600", "602"].includes(preCheckoutResult.data.responseCode)) {
              // 600 : Transaction Declined
              // 602 : Transaction declined due to insufficient funds
              CommonEvent.$emit("global-loader", false);
              this.$router.push(this.localePath("/booking-failed"));              
            } else {
              const isUncertainPayment = ["113", "700"].includes(preCheckoutResult.data.responseCode);
              this.$completePurchase(preCheckoutResult.data.reservationCode, isUncertainPayment);
            }
          } else {
            CommonEvent.$emit("global-loader", false);
            this.$router.push(this.localePath("/booking-failed"));
          }
        }
      } else {
        CommonEvent.$emit("global-loader", false);
        this.$router.push(this.localePath("/booking-failed"));
      }
    },
    googlePayError: function (event) {
      if (event && event.errorCode) {
        this.$router.push(this.localePath("/booking-failed"));
      }
    },
    loadingEventHandler: function (e) {
      if (this.$refs.mafpayGooglePayButton) {
        let buttonHeight = 52;
        const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);

        let buttonWidth = !isSafari ? '100%' : '125px'
        // Waiting for the component to be loaded
        if (!e.isLoading) {

          const style = document.createElement("style");
          style.textContent = `
          #google-pay-button-container{
            text-align: ${this.$i18n.localeProperties.detectedLang === 'en' ? 'left' : 'right'};
          }
          #google-pay-button-container button {
            width: ${buttonWidth};
            border-radius:16px;
            height: 100%;
            ${isSafari ? 'min-width:unset' : ''}
          }`;
          // Selecting the googlePayButton Iframe
          const googlePayIframe = this.$refs.mafpayGooglePayButton.$el.getElementsByClassName("mafpay-google-pay-iframe")[0];
          // Adding the styles element inside the iframe
          googlePayIframe.contentWindow.document.head.appendChild(style);
          // in case you need to resize the googlePayButton, you need to resize the iframe as well
          googlePayIframe.style.width = `100%`;
          googlePayIframe.style.height = `${buttonHeight + 4}px`;
        }
      }
    },
  },
};
</script>
<style scoped lang="scss">

</style>
