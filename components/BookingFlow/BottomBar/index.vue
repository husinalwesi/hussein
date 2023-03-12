<template>
  <div class="bottom-bar-wrapper">
    <div class="flex justify-center max-w-1xl mx-auto h-full">
      <div class="content-container">
        <div class="bottom-bar-content-wrapper">
          <div class="hidden min-550:block">
            <ContinueShoppingLink
              v-if="
                currentStep != 'booking-confirmed' &&
                  currentStep != 'payment-failed'
              "
              @continueShoppingEmmiter="continueShoppingEmitHandler"
            />
            <SkipForNow
              v-if="currentStep == 'booking-confirmed'"
              @continueShoppingEmmiter="continueShoppingEmitHandler"
            />
          </div>
          <div class="flex flex-wrap h-full gap-y-3 items-center justify-end">
            <div
              v-if="
                currentStep != 'booking-confirmed' &&
                  currentStep != 'payment-failed'
              "
              class="price-details-container"
            >
              <label
                class="total-price-label flex gap-1"
              >
                <span class="ltr:order-1 rtl:order-2">{{ currency }}</span>
                <span class="ltr:order-2 rtl:order-1">{{ $decimalPlaces(getTotal, true) }}</span>
              </label>
              <label class="tax-label">{{ $t('BOOKINGFLOW_PAGE.VAT_INCLUDED') }} (5%)</label>
            </div>

            <div v-if="currentStep == 'booking-confirmed'" class="relative">
              <BaseButton
                btn-type="button"
                :text="$t('BOOKING_CONFIRMATION.DOWNLOAD_TICKET')"
                :b-t-ndisabled="isDownloadLoading"
                :is-loading="isDownloadLoading"
                loader-wrapper-classes="absolute top-[-15px] ltr:left-[-15px] rtl:right-[-15px]"
                loader-classes="w-12 h-12"
                class-name="download-ticket-link"
                @onBtnClick="downloadTicketButton()"
              />
            </div>
            <BaseButton
              :b-t-ndisabled="
                currentStep === 'booking-confirmed'
                  ? false
                  : isBlockPayment
                    ? true
                    : isBTNDisabledVar || !isPayBTNEnabled
              "
              :text="$t(`BOOKINGFLOW_PAGE.${getButtonText}`)"
              btn-type="button"
              :class="{ 'mt-0': currentStep == 'payment-failed' }"
              @onBtnClick="validateCurrentProcess"
            />
          </div>
        </div>
        <MafpayThreedsComponent
          v-if="threedsauthid"
          :threedsauthid="threedsauthid"
          @processComplete="threedsprocessComplete"
        />
        <InformativeModal
          :is-modal-active="isModalActive"
          :show-close-icon="false"
          :is-loading="false"
          :data="data"
          @onBtnClick="onModalBtnClick"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ContinueShoppingLink from "./ContinueShoppingLink/index.vue";
import InformativeModal from "@/components/BookingFlow/Modals/InformativeModal";
import ActionModal from "@/components/BookingFlow/Modals/ActionModal";
import SkipForNow from "./SkipForNow/index.vue";
import { mapGetters } from "vuex";
import { MafpayThreedsComponent } from "@mafpay/weblib-vue";
import { CommonEvent } from "@/services/app-events";

export default {
  components: {
    ContinueShoppingLink,
    SkipForNow,
    MafpayThreedsComponent,
    InformativeModal,
    ActionModal,
  },
  props: {
    isMembership: {
      type: Boolean,
      default: false,
    },
    isBlockPayment: {
      type: Boolean,
      default: false,
    },
    prepareSavePayload: {
      type: Object,
      default: () => ({}),
    },
    guestModePayVar: {
      type: Boolean,
      default: false,
    },
    shareIsLoading: {
      type: Boolean,
      default: false,
    },
    isDataReady: {
      type: Boolean,
      default: false,
    },
    isSkiLesson: {
      type: Boolean,
      default: false,
    },
    currentStep: {
      type: String,
      default: "",
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    isCurrentPackageValid: {
      type: Boolean,
      default: false,
    },
    isAddOnsEnabled: {
      type: Boolean,
      default: false,
    },
    packageDetails: {
      type: Object,
      default: () => ({}),
    },
    selectedCardToken: {
      type: String,
      default: "",
    },
    selectedCardObj: {
      type: Object,
      default: () => ({}),
    },
    share: {
      type: Object,
      default: () => ({}),
    },
    discount: {
      type: Array,
      default: () => [],
    },
    isLoginRequired: {
      type: Boolean,
      default: false,
    },
    redirectToAddOns: {
      type: Boolean,
      default: false,
    },
    staticLabels: {
      type: Object,
      default: () => ({}),
    },
    runCheckBasket: {
      type: Boolean,
      default: false,
    },
    totalAmountBase: {
      type: String,
      default: "",
    },
    outsideCheckbasketResponse: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['googleToken', 'enableFullLoaderEmiter', 'continueShoppingEmmiter', 'tokenizeAndPayGuestMode', 'removeShareEmiter', 'totalAmountEmiter', 'isDataReadyFromAPI'],
  data() {
    return {
      isActionModalActive: false,
      threedsauthid: "",
      isBTNDisabled: false,
      amount: {
        NET: 0,
        TAX: 0,
        GROSS: 0,
        shareDiscount: 0,
        promoDiscount: 0,
        totalBeforeDiscount: 0,
      },
      isModalActive: false,
      data: {
        btnText: "",
        title: "",
        description: "",
      },
      isDownloadLoading: false,
      reservationCode: "",
      currency: ""
    };
  },
  computed: {
    ...mapGetters("currentUser", ["userInformation"]),
    ...mapGetters("bookingFlow", ["guestInformation"]),
    isPromoCodeApplied() {
      return this.$isThereAPromoCode(this.discount);
    },
    getPomoCode() {
      return this.$getPromoCode(this.discount);
    },
    getShareDiscountValue() {
      return this.$getShareAmount(this.discount);
    },
    isShareApplied() {
      return this.$isThereAShareApplied(this.discount);
    },
    isBTNDisabledVar() {
      return !this.isDataReady || this.isBTNDisabled || this.shareIsLoading;
    },
    isPayBTNEnabled() {
      if (this.currentStep != "buy-tickets") return true;
      if (this.$isUserAuthenticated()) {
        if (this.getTotal == 0) {
          return true;
        } else {
          if (this.selectedCardToken) {
            return true;
          }
        }
      }
      return true; //guest user..
    },
    getTotal() {
      let shareDiscount = this.getShareDiscountValue;
      let total = this.amount.GROSS - shareDiscount;
      return total < 0 ? 0 : total;
    },
    ...mapGetters("bookingFlow", ["guestFormIsValid"]),
    getButtonText() {
      if (this.currentStep == "add-activity") return this.isSkiLesson ? "CONTINUE" : "ADD_TICKETS";
      else if (this.currentStep == "personal-details") return this.isSkiLesson ? "CONTINUE" : "CONTINUE_TO_PAYMENT";
      else if (this.currentStep == "add-ons") return "CONTINUE";
      else if (this.currentStep == "buy-tickets") return "PAY";
      else if (this.currentStep == "booking-confirmed")
        return this.$isUserAuthenticated()
          ? this.isMembership
            ? "CONTINUE_TO_ADD_WAIVER"
            : "CONTINUE_TO_ADD_GUEST"
          : "CONTINUE_TO_ADD_GEAR";
      else if (this.currentStep == "payment-failed")
        return this.$isUserAuthenticated()
          ? "CONTINUE_TO_ADD_GUEST"
          : "CONTINUE_TO_ADD_GEAR";
      return "";
    },
  },
  watch: {
    outsideCheckbasketResponse: {
      handler() {
        if (
          this.outsideCheckbasketResponse.lineItems &&
          this.outsideCheckbasketResponse.lineItems.ERROR.CODE == 200
        ) {
          this.$emit("googleToken", this.outsideCheckbasketResponse.token);
          this.setTotalAmount(this.outsideCheckbasketResponse.lineItems);
        }
      },
      immediate: false,
      deep: true,
    },
    $route() {
      if (this.isActionModalActive) {
        window.location.reload();
      }
    },
    runCheckBasket() {
      this.calculateTotal();
    },
    totalAmountBase() {
      if (!this.getPomoCode) this.setTotalAmount({});
    },
    guestModePayVar() {
      this.validateCurrentProcess();
    },
    isDataReady() {
      this.calculateTotal();
      this.isDataReadyVar = true;
    },
    isBTNDisabledVar(isBTNDisabledVar) {
      this.$emit(
        "enableFullLoaderEmiter",
        isBTNDisabledVar && !this.isActionModalActive
      );
    },
    async redirectToAddOns() {
      if (this.isCurrentPackageValid) {
        let result = await this.$repositories.checkBasket(this.prepareSavePayload);
        if (result.lineItems.ERROR.CODE == 200) {
          this.setTotalAmount(result.lineItems);
          this.$saveCurrentPackage(this.packageDetails);

          this.$router.push(this.localePath("/booking/add-ons"));
        } else {
          this.vivaErrorHandling(result.lineItems);
        }
      } else {
        this.$showToast({
          type: "red",
          text: this.$t('BOOKINGFLOW_PAGE.YOU_SHOULD_HAVE_A_VALID_FORM_BEFORE_PROCEED_REDIRECTING'),
        });
      }
    },
  },
  created() {
    this.currency = this.$getSiteConfig('currency');
  },
  // mounted() {
  //   this.initializeMafPay();
  // },
  methods: {
    // initializeMafPay(){
    //   if (process.client) {
    //     const { defineCustomElements } = require("@mafpay/weblib");
    //     defineCustomElements();
    //   }
    // },
    onModalBtnClick(event) {
      this.isModalActive = false;
      this.isBTNDisabled = false;
    },
    vivaErrorHandling(response) {
      this.isBTNDisabled = false;
      if (Number(response.ERROR.CODE) == 401 || Number(response.ERROR.CODE) == 5003 || Number(response.ERROR.CODE) == 5036) return false;
      let error = response.ERROR.TEXT;
      this.data = {
        btnText: this.$t('COMMON.OK'),
        title: error,
        description: error,
      };
      CommonEvent.$emit("global-loader", false);

      this.isModalActive = true;
    },
    async threedsprocessComplete(paymentResponse) {
      if (paymentResponse.responseCode === "000") {
        CommonEvent.$emit("global-loader", true);
        this.$completePurchase(this.reservationCode);
      } else if (paymentResponse.responseCode === "700") {
        CommonEvent.$emit("global-loader", true);
        this.$completePurchase(this.reservationCode, true);
      } else {
        this.$emit("enableFullLoaderEmiter", false);
        this.$router.push(this.localePath("/booking-failed"));
      }
    },
    getShareValue(discountList) {
      return this.$getShareAmount(discountList);
    },
    async downloadTicketButton() {
      this.isDownloadLoading = true;

      const pdf = await this.$repositories.downloadTicket(this.$route.params.id);

      if (pdf.isError) {
        this.$showToast({
          type: "red",
          text: this.$t("COMMON.ERROR_MESSAGES.ERROR_OCCURRED"),
        });
      } else {
        const linkSource = `data:application/pdf;base64,${pdf}`;
        const downloadLink = document.createElement("a");
        const fileName = "LEC.pdf";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      }

      this.isDownloadLoading = false;
    },
    continueShoppingEmitHandler() {
      this.$emit("continueShoppingEmmiter");
    },
    async validateCurrentProcess() {
      if (this.currentStep === "booking-confirmed") {
        if (this.$isUserAuthenticated()) {
          if (this.isMembership) {
            this.$router.push(
              this.localePath(
                `/extra/waiver/${this.$route.params.id}?isMembership=true`
              )
            );
          } else {
            // TODO: Get back here and see why it's not working when we don't isolate it.
            const guestLocalePath = this.localePath("/extra/add-guest");
            this.$router.push(guestLocalePath + "/" + this.$route.params.id);
          }
        } else {
          this.$router.push(this.localePath(`/extra/gear/${this.$route.params.id}`));
        }
      } else if (this.isCurrentPackageValid) {
        if (this.currentStep == "add-activity") {
          this.isBTNDisabled = true;
          let result = await this.$repositories.checkBasket(this.prepareSavePayload);
          if (result.isSuccess) {
            if (result.lineItems.ERROR.CODE == 200) {
              this.setTotalAmount(result.lineItems);
              this.$saveCurrentPackage(this.packageDetails);

              if (this.isAddOnsEnabled)
                this.$router.push(this.localePath("/booking/add-ons"));
              else
                this.$router.push(this.localePath("/booking/personal-details"));
              this.isBTNDisabled = false;
            } else {
              this.vivaErrorHandling(result.lineItems);
            }
          } else {
            this.vivaErrorHandling(result.lineItems);
          }
        } else if (this.currentStep == "add-ons") {
          this.isBTNDisabled = true;
          let result = await this.$repositories.checkBasket(this.prepareSavePayload);
          if (result.isSuccess) {
            if (result.lineItems.ERROR.CODE == 200) {
              this.setTotalAmount(result.lineItems);
              this.$saveCurrentPackage(this.packageDetails);
              this.isBTNDisabled = false;
              this.$router.push(this.localePath("/booking/personal-details"));
            } else {
              this.vivaErrorHandling(result.lineItems);
            }
          } else {
            this.vivaErrorHandling(result.lineItems);
          }
        } else if (this.currentStep == "personal-details") {
          //get user info
          if (!this.$isUserAuthenticated()) {
            if (this.isLoginRequired) {
              this.$showToast({
                type: "red",
                text: this.$t('BOOKINGFLOW_PAGE.SORRY_YOU_NEED_TO_SIGN_IN_FIRST'),
              });
              return false;
            } else {
              this.$root.$emit("validatePersonalDetailsGuestForm");
              if (!this.guestFormIsValid) {
                // guest form is not valid..
                this.$showToast({
                  type: "red",
                  text: this.staticLabels.invalid_guest_form_message,
                });
                return false;
              }
            }
            //
          }
          //
          this.isBTNDisabled = true;
          setTimeout(async () => {
            if (!this.$isUserAuthenticated()) {
              let res = await this.$repositories.generateGuestJWT();
              if (!res) this.$router.push(this.localePath("/booking-failed"));
            }

            let result = await this.$repositories.checkBasket(this.prepareSavePayload, false);
            if (result.isSuccess) {
              if (result.lineItems.ERROR.CODE == 200) {
                this.$emit("googleToken", result.token);
                this.setTotalAmount(result.lineItems);
                this.$saveCurrentPackage(this.packageDetails);
                //
                this.isBTNDisabled = false;
                this.$router.push(this.localePath("/booking/buy-tickets"));
              } else {
                this.isBTNDisabled = false;
                this.vivaErrorHandling(result.lineItems);
              }
            } else {
              this.vivaErrorHandling(result.lineItems);
            }
            // wait until the data saved in the store..
          }, 500);
          //
        } else if (this.currentStep == "buy-tickets") {
          this.isBTNDisabled = true;
          if (this.getTotal == 0) {
            this.$emit("enableFullLoaderEmiter", true);
            try {
              let preCheckoutResult = await this.$preCheckout(
                {
                  cardToken: "",
                  securityCode: "",
                  redeemAmount: this.prepareSavePayload.redeemAmount,
                },
                "cc"
              );

              if(preCheckoutResult !== undefined){
                if (preCheckoutResult.data.code) {
                  this.isBTNDisabled = false;
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
                    this.$completePurchase(preCheckoutResult.data.reservationCode);
                  } else {
                    this.$emit("enableFullLoaderEmiter", false);
                    this.$router.push(this.localePath("/booking-failed"));
                  }
                }
              } else {
                this.$emit("enableFullLoaderEmiter", false);
                this.$router.push(this.localePath("/booking-failed"));
              }
            } catch (err) {
              this.$emit("enableFullLoaderEmiter", false);
              this.$router.push(this.localePath("/booking-failed"));
            }
          } else {
            if (this.selectedCardToken) {
              await this.completePaymentProcess();
            } else {
              this.isBTNDisabled = false;
              this.$emit("tokenizeAndPayGuestMode");
            }
          }
        } else if (this.currentStep === "payment-failed") {
          this.$router.push(this.localePath("/extra/add-guest"));
        }
      } else {
        this.errorsMessage();
      }
    },
    errorsMessage() {
      if (!this.packageDetails.isDateAvailable) {
        let packageTitle = this.packageDetails.card.title;
        this.$showToast({
          type: "red",
          text: `${packageTitle} ${this.$t('BOOKINGFLOW_PAGE.IS_UNAVAILABLE_ON_THE_SELECTED_DATE')}`,
        });
        return false;
      }

      if (this.packageDetails.card.required_quantity) {
        const peopleObject = this.packageDetails.people;
        const totalSelectedGuests = this.$getNumber(peopleObject.adult) + this.$getNumber(peopleObject.junior) + this.$getNumber(peopleObject.child);

        if (this.packageDetails.card.required_quantity !== totalSelectedGuests) {
          this.$showToast({
            type: "blue",
            text: this.$t("BOOKINGFLOW_PAGE.YOU_HAVE_TO_SELECT_GUESTS", {guestCount: this.$t(`BOOKINGFLOW_PAGE.${this.$options.filters.plural("guest", this.packageDetails.card.required_quantity)}`, {count: this.packageDetails.card.required_quantity})})
          });

          return false;
        }
      }

      if (this.packageDetails.cardType == "packages" && !this.packageDetails.card.is_movie) {
        for (const ageType in this.packageDetails.people) {
          for (
            let index = 0;
            index < this.packageDetails.people[ageType].length;
            index++
          ) {
            if (!this.packageDetails.people[ageType][index].isSelected) {
              this.$showToast({
                type: "blue",
                text: this.$t('BOOKINGFLOW_PAGE.NEED_TO_PICK_WARNING_MESSAGE')
              });
              return false;
            }
          }
        }
      }

      const isPassTicket = this.packageDetails.cardType === "passes";

      if (isPassTicket) {
        const isUpgradeTicket = !this.$isEmptyObject(this.packageDetails.upgrade_ticket);

        if (
          !isUpgradeTicket &&
          !this.packageDetails.card.is_table &&
          !this.packageDetails.card.is_movie &&
          !this.packageDetails.card.is_membership
        ) {
          if (this.packageDetails.isPassTimebased && !(this.packageDetails.isPassTimebasedSelection || {}).isSelected) {
            this.$showToast({
              type: "blue",
              text: this.$t('BOOKINGFLOW_PAGE.NEED_TO_PICK_WARNING_MESSAGE')
            });
          }
        }

        if (isUpgradeTicket) {
          const upgradeSelectionObj = this.packageDetails.upgradeSelection || {};

          if (upgradeSelectionObj.isUpgradeEnabled && !upgradeSelectionObj.isSelected) {
            this.$showToast({
              type: "blue",
              text: this.staticLabels.pick_a_time_message
            });

            return false;
          }
        }
      }

      if (this.packageDetails.BonusTicketViewModel) {
        if (!this.packageDetails.bonusSelection.isSelected) {
          this.$showToast({
            type: "blue",
            text: this.staticLabels.pick_a_time_message,
          });
          return false;
        }
      }
      if (this.packageDetails.bonus_ticket) {
        if (!this.packageDetails.bonus_ticketSelection.isSelected) {
          this.$showToast({
            type: "blue",
            text: this.staticLabels.pick_a_time_message,
          });
          return false;
        }
      }
      if (this.packageDetails.card.is_movie) {
        if (!this.packageDetails.guestSelection.isSelected) {
          this.$showToast({
            type: "blue",
            text: this.staticLabels.pick_a_time_message,
          });
          return false;
        }
      }
      if (this.packageDetails.card.is_table) {
        let tableSelection = this.packageDetails.tableSelection;
        for (let index = 0; index < tableSelection.length; index++) {
          if (!tableSelection[index].isSelected) {
            this.$showToast({
              type: "blue",
              text: this.staticLabels.pick_a_time_message,
            });
            return false;
          }
        }
      }
      if (this.packageDetails.cardType == "lessons") {
        if (!this.packageDetails.isPassTimebasedSelection.isSelected) {
          this.$showToast({
            type: "blue",
            text: this.staticLabels.pick_a_time_message,
          });
        }
      }

      if (this.packageDetails.card.is_membership) {
        if (!this.checkIfAssignedGuestIsValid()) {
          this.$showToast({
            type: "blue",
            text: this.$t('BOOKINGFLOW_PAGE.YOU_HAVE_TO_COMPLETE_ASSIGING_ACCOUNTS'),
          });
          return false;
        } else {
          if (!this.checkIfAssignedGuestHasImage()) {
            this.$showToast({
              type: "blue",
              text: this.$t('BOOKINGFLOW_PAGE.YOU_HAVE_TO_UPLOAD_IMAGES'),
            });
            return false;
          }
        }
      }
    },
    checkIfAssignedGuestHasImage() {
      let assignedUsers = this.packageDetails.assignedUsers;
      for (let index = 0; index < assignedUsers.length; index++) {
        if (!assignedUsers[index].assignedUser) {
          return false;
        } else {
          if (!assignedUsers[index].assignedUser.profile_image) return false;
        }
      }
      return true;
    },
    checkIfAssignedGuestIsValid() {
      let assignedUsers = this.packageDetails.assignedUsers;
      for (let index = 0; index < assignedUsers.length; index++) {
        if (!assignedUsers[index].assignedUser) return false;
      }
      return true;
    },
    async completePaymentProcess() {
      let securityCode = "";
      if (this.selectedCardObj.cvv !== "direct_pay") {
        securityCode = this.selectedCardObj.cvv;
        if (securityCode.toString().length != 3) {
          this.isBTNDisabled = false;
          this.$emit("enableFullLoaderEmiter", false);
          this.$showToast({
            type: "red",
            text: this.$t('BOOKINGFLOW_PAGE.PLEASE_ENTER_A_VALID_CVV_NUMBER'),
          });
          return false;
          //
        }
      }
      try {
        let data = {};
        data["cardToken"] = this.selectedCardToken;
        data["securityCode"] = securityCode || "";
        data["redeemAmount"] = this.prepareSavePayload.redeemAmount;
        let preCheckoutResult = await this.$preCheckout(data, "cc");

        if(preCheckoutResult !== undefined){
          if (preCheckoutResult && preCheckoutResult.data && preCheckoutResult.data.code) {
            let errorMessage = Number(preCheckoutResult.data.code) == 5035 ? this.$t('BOOKINGFLOW_PAGE.SELECTED_TIMESLOTS_IS_BOOKED_NOW') : preCheckoutResult.data.errorMessage;
            this.isBTNDisabled = false;
            this.data = {
              btnText: this.$t('COMMON.OK'),
              title: errorMessage,
              description: errorMessage,
            };
            CommonEvent.$emit("global-loader", false);
            this.isModalActive = true;
          } else {
            if (preCheckoutResult && preCheckoutResult.data && preCheckoutResult.data.reservationCode && preCheckoutResult.data.threeDsAuthId) {
              this.reservationCode = preCheckoutResult.data.reservationCode;
              this.threedsauthid = preCheckoutResult.data.threeDsAuthId;
              this.$store.commit(
                "bookingFlow/SET_RESERVATION_CODE",
                preCheckoutResult.data.reservationCode
              );
              return preCheckoutResult.data;
            }else if(preCheckoutResult && preCheckoutResult.data && preCheckoutResult.data.threeDsUrl){
              window.location.replace(preCheckoutResult.data.threeDsUrl);
            }else if(preCheckoutResult && preCheckoutResult.data && preCheckoutResult.data.reservationCode && preCheckoutResult.data.responseCode === "000"){
              CommonEvent.$emit("global-loader", true);
              this.$completePurchase(preCheckoutResult.data.reservationCode);
            } else {
              this.$emit("enableFullLoaderEmiter", false);
              this.$router.push(this.localePath("/booking-failed"));
            }
          }
        } else {
          this.$emit("enableFullLoaderEmiter", false);
          this.$router.push(this.localePath("/booking-failed"));
        }
      } catch (err) {
        this.$emit("enableFullLoaderEmiter", false);
        this.$router.push(this.localePath("/booking-failed"));
      }
    },
    totalBeforeDiscount(itemList) {
      let total = 0;
      for (let index = 0; index < itemList.length; index++) {
        total += Number(itemList[index].ORIGINAL);
      }
      return total;
    },
    setTotalAmount(result) {
      if (!this.getPomoCode) result = {};
      this.$store.commit("bookingFlow/SET_TOTAL_AMOUNT", {
        NET: 0,
        TAX: 0,
        GROSS: 0,
        shareDiscount: 0,
        promoDiscount: 0,
      });

      let promoDiscount = 0;
      promoDiscount = !this.$isEmptyObject(result)
        ? !this.$isEmptyObject(
            result.PROMOTIONAPPLIEDLIST.PROMOTIONAPPLIED || {}
          )
          ? Math.abs(result.PROMOTIONAPPLIEDLIST.PROMOTIONAPPLIED.DISCOUNT)
          : 0
        : 0;

      let fullTotal = !this.$isEmptyObject(result)
        ? result.BASKETTOTAL.GROSS
        : this.totalAmountBase;

      let promoDiscountFinal = !this.$isEmptyObject(result)
        ? this.isPromoCodeApplied && promoDiscount === 0
          ? 0
          : promoDiscount
        : 0;

      this.amount = {
        NET: !this.$isEmptyObject(result) ? result.BASKETTOTAL.NET : fullTotal,
        TAX: !this.$isEmptyObject(result)
          ? result.BASKETTOTAL.TAX
          : fullTotal - fullTotal / 1.05,
        GROSS: fullTotal,
        shareDiscount: !this.$isEmptyObject(result)
          ? this.getShareDiscountValue
          : 0,
        promoDiscount: promoDiscountFinal,
        totalBeforeDiscount: !this.$isEmptyObject(result)
          ? this.totalBeforeDiscount(result.ITEMLIST.ITEM)
          : fullTotal,
      };

      if (
        fullTotal <
        (!this.$isEmptyObject(result) ? this.getShareDiscountValue : 0)
      ) {
        this.$emit("removeShareEmiter", {});
        // need to remove the share from store as well as the local variable.
      }
      this.$store.commit("bookingFlow/SET_TOTAL_AMOUNT", this.amount);
      this.$emit("totalAmountEmiter", this.amount);
    },
    async calculateTotal() {
      let result = await this.$repositories.checkBasket(this.prepareSavePayload);
      if (result.isSuccess) {
        if (!this.$isEmptyObject(result.lineItems || {})) {
          if (result.checkbasketProceed) {
            if (result.lineItems.ERROR.CODE == 200) {
              if (result.token) this.$emit("googleToken", result.token);
              this.setTotalAmount(result.lineItems);
            } else if (result.lineItems.ERROR.CODE == 4000) {
              let result = await this.$repositories.checkBasket(this.prepareSavePayload);
              if (result.lineItems.ERROR.CODE == 200) {
                if (result.token) this.$emit("googleToken", result.token);
                this.setTotalAmount(result.lineItems);
              }
            }
          }
        }
      } else {
        this.vivaErrorHandling(result.lineItems);
      }
      this.$emit("isDataReadyFromAPI", true);
    }
  }
};
</script>

<style lang="scss">
@import "./BottomBar.scss";
</style>
