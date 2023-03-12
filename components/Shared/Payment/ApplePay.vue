<template>
  <div>
    <button id="applePayBtn" type="button" @click="onApplePayButtonClicked">
      <ApplePay class="mx-auto" />
    </button>
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
import ApplePay from "@/components/SVGElements/ApplePay.vue";
import {customLayerEndPoints} from "@/const/api";
import InformativeModal from "@/components/BookingFlow/Modals/InformativeModal";

export default {
  name: "Apple",
  components: {
    ApplePay,
    InformativeModal
  },
  props: {
    prepareSavePayload: {
      type: Object,
      default: () => ({}),
    },
    totalAmountWithDiscount: {
      type: Number,
      default: () => 0,
    },
  },
  data() {
    return {
      isModalActive: false,
      data: {
        btnText: "",
        title: "",
        description: "",
      },
      currentEnv: '',
      currency: "",
    };
  },
  head() {
    return {
      script: [
        {
          src: "https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js",
        },
      ],
    };
  },
  mounted() {
    this.currentEnv = this.$getSiteCurrentEnvironment();
    this.currency = this.$getSiteConfig('currency', 'en');
  },
  methods: {
    onModalBtnClick(event) {
      this.isModalActive = false;
    },
    onApplePayButtonClicked() {
      if (!ApplePaySession) {
        return;
      }

      const merchantID = this.currentEnv.includes('dhabi') ? process.env.SNOW_ABD.MAFPAY.APPLE_PAY_MERCHANT_ID : process.env.SKI_DUBAI.MAFPAY.APPLE_PAY_MERCHANT_ID;
      // Define ApplePayPaymentRequest
      const request = {
        countryCode: "AE",
        currencyCode: this.currency,
        merchantIdentifier: merchantID,
        merchantCapabilities: [
          "supports3DS",
          "supportsCredit",
          "supportsDebit",
        ], // supports3DS is required
        supportedNetworks: ["visa", "masterCard"],
        // , "amex", "discover"
        lineItems: [
          {
            label: this.currentEnv.includes('oman') ? "Snow Oman" : this.currentEnv.includes('dhabi') ? "Snow Abu Dhabi" : 'Ski Dubai',
            type: "final",
            amount: this.totalAmountWithDiscount.toString(),
          },
        ],
        total: {
          label: this.currentEnv.includes('oman') ? "Snow Oman" : this.currentEnv.includes('dhabi') ? "Snow Abu Dhabi" : 'Ski Dubai',
          type: "final",
          amount: this.totalAmountWithDiscount.toString(),
        },
        requiredBillingContactFields: ["postalAddress"], // for getting billing address through Apple Pay
      };

      // Create ApplePaySession
      const session = new ApplePaySession(3, request);

      session.onvalidatemerchant = async (event) => {
        // console.log(event);
        const merchantSession = await this.validateMerchantServer(
          event.validationURL
        );
        // Call your own server to request a new merchant session.
        // const merchantSession = await validateMerchant();
        session.completeMerchantValidation(merchantSession);
      };

      session.onpaymentmethodselected = (event) => {
        // console.log(event);
        // Define ApplePayPaymentMethodUpdate based on the selected payment method.
        // No updates or errors are needed, pass an empty object.
        const update = {
          newLineItems: [],
          newTotal: {
            label: this.currentEnv.includes('oman') ? "Snow Oman" : this.currentEnv.includes('dhabi') ? "Snow Abu Dhabi" : 'Ski Dubai',
            amount: this.totalAmountWithDiscount.toString(),
          },
        };
        session.completePaymentMethodSelection(update);
      };

      session.onshippingmethodselected = (event) => {
        // console.log(event);
        // Define ApplePayShippingMethodUpdate based on the selected shipping method.
        // No updates or errors are needed, pass an empty object.
        const update = {};
        session.completeShippingMethodSelection(update);
      };

      session.onshippingcontactselected = (event) => {
        // console.log(event);
        // Define ApplePayShippingContactUpdate based on the selected shipping contact.
        const update = {};
        session.completeShippingContactSelection(update);
      };

      session.onpaymentauthorized = (event) => {
        // console.log(event);

        this.$preCheckout(
          {
            cardToken: "",
            securityCode: "",
            appleAuthEvent: JSON.stringify(this.getAppleEvent(event)),
            redeemAmount: this.prepareSavePayload.redeemAmount,
          },
          "apple"
        )
          .then((response) => {
            if (response.data.code) {
              session.completePayment({
                status: ApplePaySession.STATUS_FAILURE,
              });
              let errorMessage = Number(response.data.code) == 5035 ? this.$t('BOOKINGFLOW_PAGE.SELECTED_TIMESLOTS_IS_BOOKED_NOW') : response.data.errorMessage;
              this.data = {
                btnText: this.$t('COMMON.OK'),
                title: errorMessage,
                description: errorMessage,
              };
              this.isModalActive = true;
            } else {
              if(response.data.responseCode === "700" || response.data.responseCode === "113"){
                session.completePayment({
                  status: ApplePaySession.STATUS_SUCCESS,
                });
                this.$completePurchase(response.data.reservationCode, true);
              }else if ((response.data.responseMessage || '').toLowerCase() === "success") {
                session.completePayment({
                  status: ApplePaySession.STATUS_SUCCESS,
                });
                this.$completePurchase(response.data.reservationCode);
              } else {
                session.completePayment({
                  status: ApplePaySession.STATUS_FAILURE,
                });
                this.$router.push(this.localePath("/booking-failed"));
              }
            }
          })
          .catch((error) => {
            this.$router.push(this.localePath("/booking-failed"));
            session.completePayment({
              status: ApplePaySession.STATUS_FAILURE,
            });
          });
      };

      session.oncancel = (event) => {
        // console.log(event);
        // Payment cancelled by WebKit
      };

      session.begin();
    },
    getAppleEvent(paymentAuthorizationEvent) {
      return {
        walletSignature:
        paymentAuthorizationEvent.payment.token.paymentData.signature,
        walletData: paymentAuthorizationEvent.payment.token.paymentData.data,
        walletVersion:
        paymentAuthorizationEvent.payment.token.paymentData.version,
        walletHeader: {
          ephemeralPublicKey:
          paymentAuthorizationEvent.payment.token.paymentData.header
            .ephemeralPublicKey,
          publicKeyHash:
          paymentAuthorizationEvent.payment.token.paymentData.header
            .publicKeyHash,
          transactionId:
          paymentAuthorizationEvent.payment.token.paymentData.header
            .transactionId,
        },
      };
    },
    async validateMerchantServer(validationURL) {
      let headers = {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*", // Allow from anywhere
        "Access-Control-Allow-Methods": "*", // Allow only GET request
      };
      let isGuest = false;
      if (this.$isUserAuthenticated()) {
        isGuest = false;
      } else {
        headers["X-Access-Token"] = this.$repositories.getGuestJWT();
        isGuest = true;
      }
      //

      let config = {
        method: "post",
        url: `${process.env.SHARED_ENVS.APIGEE_BASE_URL}${customLayerEndPoints.CREATE_APPLE_SESSION}`,
        headers: headers,
        data: {
          validationURL:
            validationURL ||
            "https://apple-pay-gateway-cert.apple.com/paymentservices/startSession",
          domainName: window.location.host, //"d39wsgtm30n80s.cloudfront.net"
          displayName: this.currentEnv.includes('oman') ? "Snow Oman" : this.currentEnv.includes('dhabi') ? "Snow Abu Dhabi" : "Ski Dubai",
          isGuest: isGuest,
          ...(isGuest ? {} : {isIgnoreCachedToken: true}),
        },
      };

      let res = await this.$axios(config);
      return res.data;
    },
  },
};
</script>
