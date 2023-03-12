<template>
  <div
    class="head-content"
    :class="{
      active: isEnabled,
      isPaymentDisabled: isPaymentDisabled,
      onlyCC: !paymentConfig || (paymentConfig.hide_google_pay && (paymentConfig.hide_apple_pay || !paymentConfig.hide_apple_pay && !isSafari))
    }"
  >
    <div v-if="isThreeDS1LoaderEnabled" class="relative h-20 w-full">
      <CircleLoader />
    </div>
    <template v-else>
      <div class="title-head-content">
        <div
          v-if="!creditCards.length || isEnabled"
          class="title-radio-conatiner"
        >
          <div class="radio-btn-container">
            <span class="radio-btn" />
          </div>
          <div class="title-container">
            <p>{{ $t('BOOKINGFLOW_PAGE.CREDIT_OR_DEBIT_CARD') }}</p>
          </div>
        </div>
        <div class="dashed-line-container">
          <div class="dashed-line" />
        </div>
      </div>

      <div
        v-if="paymentConfig && ((!paymentConfig.hide_apple_pay && isSafari) || !paymentConfig.hide_google_pay)"
        class="social-login-content"
        :class="{isSafari: isSafari, isPaymentDisabled: isPaymentDisabled}"
      >
        <div v-if="paymentConfig && !paymentConfig.hide_apple_pay && isSafari" id="applePayBtn">
          <ApplePay
            :total-amount-with-discount="totalAmountWithDiscount"
            :is-payment-disabled="isPaymentDisabled"
          />
        </div>
        <div v-if="paymentConfig && !paymentConfig.hide_google_pay" id="googlePayBtn">
          <GooglePay
            :total-amount-with-discount="totalAmountWithDiscount"
            :prepare-save-payload="prepareSavePayload"
            :is-payment-disabled="isPaymentDisabled"
            :google-token="googleToken"
            @loaderFinished="googlePayLoaderFinish = true"
          />
        </div>
      </div>
      <div class="paymentContent">
        <snowflake-loader v-if="isGetSavedCardsLoading" loader-classes="w-12 h-12" />
        <template v-else-if="addCard">
          <form
            method="POST"
            :action="`${baseUrl}/tokenize`"
            enctype="application/x-www-form-urlencoded"
          >
            <input type="hidden" name="merchantId" :value="merchantId">
            <input
              type="hidden" name="returnUrl"
              :value="returnUrl"
            >

            <input
              v-if="!saveDetailsForFuturePurchases"
              type="hidden"
              name="apiKey"
              :value="apiKey"
            >
            <input type="hidden" name="command" value="tokenize">
            <input
              v-if="!saveDetailsForFuturePurchases"
              type="hidden"
              name="rememberCard"
              value="no"
            >
            <input
              v-if="saveDetailsForFuturePurchases"
              type="hidden"
              name="auth0Token"
              :value="MPASSToken"
            >
            <input
              type="hidden" name="tokenizev2"
              value="true"
            >

            <div class="card-info">
              <div v-if="isOmanSite" class="input-group card-holder-name-input-container">
                <MafpayCardHolderName
                  ref="mafpayCardHolderNameRef"
                  class="card-holder-name"
                  :mandatory="true"
                  :placeholder="$t('BOOKINGFLOW_PAGE.CARD_HOLDER_NAME')"
                  @cardHolderNameStatus="handleErrors($event, 'cardHolderName')"
                />
              </div>

              <div class="card-content-details-container">
                <div class="input-group card-number-input-container">
                  <MafpayCardNumber
                    ref="mafpayCardNumberRef"
                    class="card-number-input"
                    :placeholder="$t('BOOKINGFLOW_PAGE.CARD_NUMBER')"
                    @cardNumberStatus="handleErrors($event, 'cardNumber')"
                  />
                </div>
                <div class="card-info-cvv-date">
                  <div class="input-group card-validity-input-container">
                    <MafpayCardExpiry
                      ref="mafpayCardExpiryRef"
                      class="card-validity-input"
                      :placeholder="$t('BOOKINGFLOW_PAGE.MM_YY')"
                      @cardExpiryStatus="handleErrors($event, 'cardExpiry')"
                    />
                  </div>
                  <div class="input-group card-cvv-input-container">
                    <div class="relative">
                      <MafpayCardCvc
                        ref="mafpayCardCvcRef"
                        class="card-cvv-input"
                        :placeholder="$t('BOOKINGFLOW_PAGE.CVC_CVV')"
                        masked="false"
                        @cardCvcStatus="handleErrors($event, 'cardCVC')"
                      />
                      <span
                        v-click-outside="enableHelpButtonEmiter"
                        class="absolute w-6 h-6 ltr:right-3 rtl:left-3 top-[13px] cursor-pointer"
                        @click="toggleCVVHelpBox"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="save-details-row"
              :class="{'row-hidden': !$isUserAuthenticated()}"
            >
              <div>
                <BaseCheckbox
                  v-if="$isUserAuthenticated()"
                  id="save-details-for-future-purchases"
                  v-model="saveDetailsForFuturePurchases"
                  :classes="[
                    saveDetailsForFuturePurchases
                      ? 'text-[#1A1A1A]'
                      : 'text-[#606060]',
                  ]"
                  :label="$t('BOOKINGFLOW_PAGE.SAVE_DETAILS_FOR_FUTURE_PURCHASES')"
                />
              </div>
              <div class="btn-container">
                <button
                  v-if="$isUserAuthenticated() && creditCards.length > 0"
                  type="button"
                  class="cancel-btn"
                  @click="cancelPayment()"
                >
                  {{ $t('BOOKINGFLOW_PAGE.CANCEL') }}
                </button>
                <MafpayCardSubmit
                  ref="mafpayCardSubmitRef"
                  label="add"
                  class="hidden"
                  @click="submitLoader = true"
                  @tokenizationComplete="tokenizationComplete"
                />
              </div>
            </div>
          </form>
          <div class="validation-container">
            <ul>
              <li v-for="(error, index) in errors" :key="index">
                {{ $t(`MAFPAY.${error.errorCode}`) }}
              </li>
            </ul>
          </div>
        </template>
        <template v-else-if="creditCards.length > 0 && !addCard">
          <div
            v-click-outside="closeCreditCardDDL"
            class="drop-down-list-container"
          >
            <div class="flex gap-2 lg:gap-[22px] flex-col lg:flex-row">
              <div
                class="ddl-input"
                @click="isCreditCardDDLEnabled = !isCreditCardDDLEnabled"
              >
                <div class="card-item">
                  <div>
                    <VisaPayment
                      v-if="
                        creditCards[selectedCreditCardIndex].cardType === 'VISA'
                      "
                      width="24"
                      height="15"
                    />
                    <MasterCardPayment
                      v-else-if="
                        creditCards[selectedCreditCardIndex].cardType ===
                          'MASTERCARD'
                      "
                      width="24"
                      height="15"
                    />
                    <Amex v-else width="24" height="15" />
                  </div>
                  <div>
                    <p class="card-text text-sm">
                      **** **** ****
                      {{
                        creditCards[selectedCreditCardIndex].cardNumber
                          | formatCardNumber
                      }}
                    </p>
                  </div>
                </div>
                <div class="arrow-container">
                  <ArrowStylish
                    :class="{ '-rotate-180': isCreditCardDDLEnabled }"
                  />
                </div>
              </div>
              <div
                class="drop-down-list payment-drop-down-list"
                :class="{ ddlEnabled: isCreditCardDDLEnabled }"
              >
                <ul class="flex flex-col">
                  <li
                    v-for="(card, index) in creditCards"
                    :key="index"
                    :class="{
                      'order-1 rounded-tr-2xl rounded-tl-2xl':
                        selectedCreditCardIndex == index,
                      'order-2': selectedCreditCardIndex != index,
                    }"
                    @click="
                      $event.stopPropagation();
                      setSelectedCreditCard(index);
                    "
                  >
                    <div class="card-info-content">
                      <div class="card-item">
                        <div>
                          <VisaPayment
                            v-if="card.cardType === 'VISA'"
                            width="24"
                            height="15"
                          />
                          <MasterCardPayment
                            v-else-if="card.cardType === 'MASTERCARD'"
                            width="24"
                            height="15"
                          />
                          <Amex v-else width="24" height="15" />
                        </div>
                        <div>
                          <p class="card-text text-xs">
                            {{ $t('BOOKINGFLOW_PAGE.ENDING_IN') }} ****
                            {{ card.cardNumber | formatCardNumber }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li
                    class="add-card-list-item order-3 add-card-list-item-new"
                    @click="setSelectedTab('MAFPay')"
                  >
                    <div class="add-card-list-item-container">
                      <div class="plus-btn">
                        <Plus fill="#142B73" />
                      </div>
                      <div>
                        <p class="add-card-list-item-title">
                          {{ $t('BOOKINGFLOW_PAGE.ADD_A_CREDIT_OR_DEBIT_CARD') }}
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <input
                  v-model="cvv"
                  v-accept-only-number
                  type="text"
                  maxlength="3"
                  minlength="3"
                  class="cvv"
                  :placeholder="$t('BOOKINGFLOW_PAGE.CVC_CVV')"
                  :class="{ isNotValidCVV: !isValidCVV }"
                >
              </div>
            </div>
            <div v-if="!isValidCVV" class="validation-container">
              <ul>
                <li>{{ $t('BOOKINGFLOW_PAGE.THE_SECURITY_CODE_FIELD_IS_INCOMPLETE') }}</li>
              </ul>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
<script>
import GooglePay from "@/components/Shared/Payment/GooglePay.vue";
import MasterCardPayment from "@/components/SVGElements/MasterCardPayment.vue";
import Amex from "@/components/SVGElements/Amex.vue";
import VisaPayment from "@/components/SVGElements/VisaPayment.vue";
import ArrowStylish from "@/components/SVGElements/ArrowStylish.vue";
import ApplePay from "@/components/Shared/Payment/ApplePay.vue";
import {CommonEvent} from "@/services/app-events";
import Plus from "@/components/SVGElements/Plus.vue";
import {
  MafpayCardHolderName,
  MafpayCardNumber,
  MafpayCardExpiry,
  MafpayCardCvc,
  MafpayCardSubmit,
} from "@mafpay/weblib-vue";
import {mapGetters} from "vuex";

export default {
  name: "MAFPay",
  components: {
    VisaPayment,
    MasterCardPayment,
    Amex,
    ApplePay,
    GooglePay,
    Plus,
    ArrowStylish,
    MafpayCardHolderName,
    MafpayCardNumber,
    MafpayCardExpiry,
    MafpayCardCvc,
    MafpayCardSubmit,
  },
  props: {
    prepareSavePayload: {
      type: Object,
      default: () => ({}),
    },
    isPaymentDisabled: {
      type: Boolean,
      default: false,
    },
    isShareOrPromoCodeIsSelected: {
      type: Boolean,
      default: false,
    },
    fireReset: {
      type: Boolean,
      default: false,
    },
    totalAmountWithDiscount: {
      type: Number,
      default: () => 0,
    },
    tokenizeAndPayGuestModeVar: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Object,
      default: () => ({}),
    },
    discount: {
      type: Array,
      default: () => [],
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
    isDataReady: {
      type: Boolean,
      default: false,
    },
    isDataReadyInCheckbasket: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["loaderFinished", 'selectedCreditCardEmiter', 'blockPayment', 'guestModePay'],
  data() {
    return {
      cvv: "",
      defaultSelection: {
        paymentMethod: "",
        cardToken: "",
      },
      isSafari: false,
      submitLoader: false,
      MPASSToken: "",
      isEnabled: true,
      selectedCreditCardIndex: 0,
      isCreditCardDDLEnabled: false,
      creditCards: [],
      saveDetailsForFuturePurchases: false,
      merchantId: '',
      apiKey: '',
      returnUrl: location.href,
      errors: [],
      isGetSavedCardsLoading: true,
      googlePayLoaderFinish: false,
      isHelpIconEnabled: false,
      addCard: true,
      cvvIsChange: false,
      isThreeDS1LoaderEnabled: false,
      isOmanSite: false,
      baseUrl: process.env.SHARED_ENVS.MAFPAY.BASE_URL
    };
  },
  computed: {
    ...mapGetters("currentUser", ["userInformation"]),
    isValidCVV() {
      if (this.cvvIsChange) {
        return this.cvv.toString().length == 3;
      }
      return true;
    },
  },
  watch: {
    cvv(newVal, oldVal) {
      if (this.addCard) this.cvvIsChange = false;
      else {
        this.cvvIsChange = true;
        this.emitSelectedCard();
      }
    },
    selectedCreditCardIndex() {
      this.resetCVV();
    },
    addCard(addCard) {
      if (addCard) {
        this.resetCVV();
        this.$emit("selectedCreditCardEmiter", {
          cardToken: "",
          cardType: "",
          cvv: "",
        });
      }
    },
    isEnabled(isEnabled) {
      if (isEnabled) this.enableHelpButtonEmiter();
      this.$emit("blockPayment", isEnabled);
    },
    isCreditCardDDLEnabled() {
      this.$restContainerPadding();
      this.$nextTick(() => {
        this.$handleDDLScroll();
      });
    },
    tokenizeAndPayGuestModeVar() {
      let mafpayCardSubmitRef = this.$refs.mafpayCardSubmitRef;
      if (!mafpayCardSubmitRef) return false;
      let buttonContainer = mafpayCardSubmitRef.$el;
      if (!buttonContainer) return false;
      let button = buttonContainer.querySelector("button");
      if (!button) return false;
      if (button.getAttribute("disabled") === null) {
        if (this.isOmanSite) {
          const isValidCardHolderName = !!((this.$refs.mafpayCardHolderNameRef || {}).$el || {}).name?.value;

          if (isValidCardHolderName) {
            button.click();
            CommonEvent.$emit("global-loader", true);
          } else
            this.$showToast({
              type: "red",
              text: this.$t("BOOKINGFLOW_PAGE.CARD_HOLDER_NAME_ERROR_MESSAGE")
            });
        } else {
          button.click();
          CommonEvent.$emit("global-loader", true);
        }
      } else {
        this.$showToast({
          type: "red",
          text: this.$t('BOOKINGFLOW_PAGE.PLEASE_ENTER_A_VALID_CREDIT_CARD'),
        });
      }
    },
    isHelpIconEnabled() {
      this.$restContainerPadding();
      this.$nextTick(() => {
        this.handleDDLScrollMafpay();
      });
    },
    isDataReady() {
      if (this.is3DS1PayInProgress()) CommonEvent.$emit("global-loader", true);
    },
    isDataReadyInCheckbasket() {
      this.pay3DS1();
    }
  },
  created() {
    this.isOmanSite = this.$getSiteConfig("code").includes("oman");
    this.merchantId = this.$getMafPayMerchantId();
  },
  mounted() {
    this.enable3DS1Loader();
    this.apiKey = (this.$store.state.apigeeKeys || {}).mafpay;
    this.$emit("blockPayment", true);
    this.getMPASSToken();
    this.getCards();
    this.$emit("blockPayment", true);
    this.sortPrimaryCard();
    this.initializePayment();
    this.isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);

    if (!this.$isUserAuthenticated()) {
      this.isGetSavedCardsLoading = false;
    }
    this.$emit("blockPayment", false);
  },
  methods: {
    resetCVV() {
      this.cvv = "";
      this.cvvIsChange = false;
    },
    toggleCVVHelpBox() {
      this.enableHelpButtonEmiter();
      let cvvRef = this.$refs.mafpayCardCvcRef;
      if (!cvvRef) return false;
      let cvvEle = cvvRef.$el;
      if (!cvvEle) return false;
      let helpIconEle = cvvEle.querySelector(".cvc-tooltip .tooltip-label");
      if (!helpIconEle) return false;
      helpIconEle.click();
    },
    isCardTokenAlreadyExist(cardNumber) {
      for (let index = 0; index < this.creditCards.length; index++) {
        if (this.creditCards[index].cardNumber == cardNumber) return true;
      }
      return false;
    },
    async tokenizationComplete(e) {

      this.$repositories.addPaymentInfoEvent(this.packages, e.cardBrand, this.amount)

      CommonEvent.$emit("global-loader", false);
      if (e.responseCode === "000") {
        if (e.cardBrand == "VISA" || e.cardBrand == "MASTERCARD") {
          this.creditCards = [
            {
              ...(this.isOmanSite ? {cardHolderName: e.cardHolderName} : {}),
              cardNumber: e.cardMaskedNumber,
              cardToken: e.cardToken,
              cardType: e.cardBrand,
              isDirectPay: true,
              saveForFuture: this.saveDetailsForFuturePurchases,
            },
          ];
          this.resetPaymentForm();
          this.emitSelectedCard();
          this.$nextTick(() => {
            this.$emit("guestModePay");
          });
        } else {
          this.$router.push(this.localePath("/booking-failed"));
        }
      } else if (e.responseCode === "109") {
        this.$showToast({
          type: "red",
          text: this.$t('BOOKINGFLOW_PAGE.PLEASE_ENTER_A_VALID_CREDIT_CARD'),
        });
        //missing parameter..
      } else if (e.responseCode === "151") {
        this.$showToast({
          type: "orange",
          text: this.$t('BOOKINGFLOW_PAGE.CARD_ALREADY_EXISTS'),
        });
      } else {
        this.$router.push(this.localePath("/booking-failed"));
      }
      // only with the guest mode, we need to emit to the root and to complete the payment process..
    },
    async getMPASSToken() {
      if (!this.$isUserAuthenticated()) return false;
      this.MPASSToken = await this.$getToken(false);
    },
    cancelPayment() {
      this.addCard = false;
      this.errors = [];
      this.emitSelectedCard();
    },
    removeStatusByKey(key) {
      this.errors = this.errors.filter((object) => {
        return object.key !== key;
      });
    },
    isErrorExistInList(errorCode) {
      return (
        this.errors.filter((object) => {
          return object.errorCode === errorCode;
        }).length > 0
      );
    },
    handleErrors(event, key) {
      this.removeStatusByKey(key);
      if (event.status == "INVALID") {
        this.errors.push({
          errorCode: event.error.errorCode,
          key: key,
        });
      }
    },
    initializePayment() {
      // eslint-disable-next-line no-undef
      window.MafPay.env = process.env.SHARED_ENVS.PAYMENT_ENVIRONMENT;
      window.MafPay.setLanguage(this.$i18n.localeProperties.detectedLang);
    },
    enableHelpButtonEmiter() {
      let cvvRef = this.$refs.mafpayCardCvcRef;
      if (!cvvRef) return false;
      let cvvEle = cvvRef.$el;
      if (!cvvEle) return false;
      let helpIconEle = cvvEle.querySelector(".cvc-tooltip .tooltip-label");
      if (!helpIconEle) return false;
      let closeButtonEle = cvvEle.querySelector(
        ".cvc-tooltip .tooltiptext .close-button"
      );
      if (!closeButtonEle) return false;
      helpIconEle.addEventListener("click", this.toggleCVV);
      closeButtonEle.addEventListener("click", this.toggleCVV);
    },
    toggleCVV() {
      setTimeout(() => {
        let cvvEle = this.$refs.mafpayCardCvcRef.$el;
        let helpIconContentEle = cvvEle.querySelector(
          ".cvc-tooltip .tooltiptext"
        );
        this.isHelpIconEnabled =
          helpIconContentEle.classList.contains("visible");
      }, 50);
    },
    setSelectedCreditCard(index) {
      this.selectedCreditCardIndex = index;
      this.closeCreditCardDDL();
      this.emitSelectedCard();
    },
    emitSelectedCard() {
      let selectedCardToken = "";
      let selectedCardType = "";
      let isDirectPay = false;
      let saveForFuture = true;
      if (this.creditCards.length > 0) {
        selectedCardToken =
          this.creditCards[this.selectedCreditCardIndex].cardToken;
        selectedCardType =
          this.creditCards[this.selectedCreditCardIndex].cardType;
        isDirectPay =
          this.creditCards[this.selectedCreditCardIndex].isDirectPay || false;
        saveForFuture =
          this.creditCards[this.selectedCreditCardIndex].saveForFuture;
      }
      this.$emit("selectedCreditCardEmiter", {
        cardToken: selectedCardToken,
        cardType: selectedCardType,
        cvv: isDirectPay || this.addCard ? "direct_pay" : this.cvv,
        saveForFuture: saveForFuture,
      });
    },
    resetPaymentForm() {
      if (this.$refs.mafpayCardHolderNameRef && this.isOmanSite) this.$refs.mafpayCardHolderNameRef.resetField();
      if (this.$refs.mafpayCardNumberRef) this.$refs.mafpayCardNumberRef.resetField();
      if (this.$refs.mafpayCardExpiryRef) this.$refs.mafpayCardExpiryRef.resetField();
      if (this.$refs.mafpayCardCvcRef) this.$refs.mafpayCardCvcRef.resetField();
      this.saveDetailsForFuturePurchases = false;
      this.errors = [];
    },
    closeCreditCardDDL() {
      this.isCreditCardDDLEnabled = false;
    },
    setSelectedTab(tab) {
      this.addCard = true;
      this.closeCreditCardDDL();
    },
    getNewCards() {
      return this.$deepCloneArray(this.$store.state.paymentCards.cards);
    },
    async getCards() {
      if (!this.$isUserAuthenticated()) {
        this.addCard = true;
        return false;
      }
      try {
        this.$emit("blockPayment", true);
        this.isGetSavedCardsLoading = true;
        this.$emit("loaderFinished", true);
        const data = await this.$repositories.getPaymentCards();

        if (((data.data || {}).permanentCards || []).length) {
          this.creditCards = data.data.permanentCards.map((item) => {
            if (
              item.card.defaultCard &&
              item.card.defaultCard.toLowerCase() === "yes"
            )
              this.defaultSelection = {
                paymentMethod: "savedCards",
                cardToken: item.cardToken,
              };

            const result = {
              cardNumber: item.card.cardMaskedNumber,
              cardToken: item.cardToken,
              cardType: item.card.cardBrand,
            };
            return result;
          });
        }

        this.addCard = this.creditCards.length == 0;

        this.emitSelectedCard();
        this.isGetSavedCardsLoading = false;
        this.$emit("blockPayment", false);
      } catch (err) {
        this.isGetSavedCardsLoading = false;
        this.addCard = true;
        console.log({err});
      }
    },
    sortPrimaryCard() {
      if (this.defaultSelection.paymentMethod !== "savedCards") return false;
      if (this.creditCards.length < 2) return false;
      let defaultCard = this.defaultSelection.cardToken;
      let defaultCardIndex = this.getDefaultCardIndex(defaultCard);
      this.sortCards(defaultCardIndex);
    },
    sortCards(defaultCardIndex) {
      let temp = [];
      temp.push(this.creditCards[defaultCardIndex]);
      for (let index = 0; index < this.creditCards.length; index++) {
        if (defaultCardIndex == index) continue;
        temp.push(this.creditCards[index]);
      }
      this.creditCards = temp;
    },
    getDefaultCardIndex(defaultCardToken) {
      for (let index = 0; index < this.creditCards.length; index++) {
        if (this.creditCards[index].cardToken == defaultCardToken) return index;
      }
      return 0;
    },
    is3DS1PayInProgress() {
      return this.$route.query && this.$route.query.cardToken;
    },
    pay3DS1() {
      this.$nextTick(() => {
        if (this.is3DS1PayInProgress()) this.tokenizationComplete(this.$route.query);
      });
    },
    enable3DS1Loader() {
      if (this.is3DS1PayInProgress()) this.isThreeDS1LoaderEnabled = true;
    },
    handleDDLScrollMafpay() {
      let cardsContainer = document.querySelector(".cards-container");
      if (!cardsContainer) return false;
      let activeDDL = document.querySelector(".tooltiptext.visible");
      if (activeDDL) {
        let bottomBar = document.querySelector(".bottom-bar-wrapper");
        if (!bottomBar) return false;
        let bottomBarHeight = bottomBar.offsetHeight;
        let currentPage = document.querySelector(".booking-flow-container");
        if (!currentPage) return false;
        let pageHeight = currentPage.offsetHeight;
        let pageHWithoutFooter = pageHeight - bottomBarHeight;
        let offsetT = activeDDL.offsetParent.offsetParent.offsetParent.offsetTop + activeDDL.offsetParent.offsetParent.offsetParent.offsetParent.offsetTop + activeDDL.offsetParent.offsetParent.offsetParent.offsetParent.offsetParent.offsetTop + activeDDL.offsetParent.offsetParent.offsetParent.offsetParent.offsetParent.offsetParent.offsetTop;
        if ((offsetT + activeDDL.offsetHeight) > pageHWithoutFooter) {
          cardsContainer.offsetParent.offsetParent.style.paddingBottom = `${((offsetT + activeDDL.offsetHeight) - pageHWithoutFooter) + 48}px`;
        }
      }
    }
  }
};
</script>
<style scoped lang="scss">
@import "./MAFPay.scss";
</style>
