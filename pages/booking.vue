<template>
  <main class="ski-dubai booking-flow-container">
    <SolidBlurBG :is-bg-image="true" />
    <section class="flex justify-center w-full">
      <div class="content-container">
        <HeaderBar
          :current-step="currentStep"
          :is-there-a-change="isThereAChange"
          :static-labels="staticLabels"
          :is-add-activity-enabled="isATimeBasedByIndex(selectedPackageIndex || 0)"
          :is-add-ons-enabled="isAddOnsEnabledByIndex(selectedPackageIndex || 0)"
          :is-membership="isMembership"
          :is-ski-lesson="isCurrentASkiLesson"
          @tabChangeEmitter="tabChangeEmitHandler"
        />
        <div class="cards-container">
          <div
            class="workspace-tickets-container"
            :class="{'order-2': isAddActivitySpecialView}"
          >
            <NuxtChild
              :package-details="
                packages.length > 0 || selectedPackageIndex != -1
                  ? packages[selectedPackageIndex]
                  : {}
              "
              :discount="discount"
              :google-token="googleTokenVar"
              :total-amount-with-discount="totalAmountWithDiscount"
              :change-evt="changeEvt"
              :share="share"
              :is-login-required="isPackagesLoginRequired"
              :static-labels="staticLabels"
              :amount="amount"
              :tokenize-and-pay-guest-mode-var="tokenizeAndPayGuestModeVar"
              :promo-discount="amount.promoDiscount"
              :is-membership-ticket="isMembership"
              :packages="packages"
              :prepare-save-payload="prepareSavePayload"
              :payment-config="paymentConfig"
              :is-data-ready="isDataReady"
              :is-data-ready-in-checkbasket="isDataReadyInCheckbasket"
              @selectionChangeEmiter="selectionChangeEmitHandler"
              @selectionChangeEmiterLast="selectionChangeEmiterLast"
              @selectionChangeCinemaEmiter="selectionChangeCinemaEmitHandler"
              @mainSelectionChangeEmit="mainSelectionChangeEmitHandler"
              @removeAgeTypeEmiter="removeAgeTypeEmitHandler"
              @guestChangeEmiter="guestChangeEmitHandler"
              @selectTimeSlotEmiter="selectTimeSlotEmitHandler"
              @selectTimeSlotTableEmiter="selectTimeSlotTableEmitHandler"
              @selectedCreditCardEmiter="selectedCreditCardEmitHandler"
              @promoCodeChangeEmiter="promoCodeChangeEmitHandler"
              @shareChangeEmiter="shareChangeEmitHandler"
              @addOnsCounterChange="addOnsCounterChangeHandler"
              @guestModePay="guestModePay"
              @blockPayment="blockPayment"
              @bonusTableLoaderEmiter="bonusTableLoaderEmiter"
              @assignUserEmiter="assignUserHandler"
              @updateAssignUserEmiter="updateAssignUserEmiter"
              @cancelUpgradeTicketEmiter="cancelUpgradeTicketHandler"
              @upgradeTicketsEmiter="upgradeTicketsHandler"
            />
          </div>
          <div
            class="summary-tickets-container"
            :class="{'vertical-view': isAddActivitySpecialView}"
          >
            <PackagesContainer
              :current-step="currentStep"
              :packages="packages"
              :selected-package-i-d="getSelectedPackageUniqeID"
              :get-selected-package-date="getSelectedPackageDate"
              :total-amount="totalAmount"
              :total-amount-with-discount="totalAmountWithDiscount"
              :discount="discount"
              :share="share"
              :static-labels="staticLabels"
              :amount="amount"
              :is-full-page-loader-enabled="isFullPageLoaderEnabled"
              :payment-config="paymentConfig"
              :is-add-activity-special-view="isAddActivitySpecialView"
              @guestChangeEmiter="guestChangeEmitHandler"
              @dateChangeEmiter="dateChangeEmitHandler"
              @changePackageEmiter="changePackageEmitHandler"
              @removePackageEmiter="removePackageHandler"
              @editAddOnsEmiter="editAddOnsEmitHandler"
              @continueShoppingEmmiter="continueShoppingEmitHandler"
              @dateLoaderEmiter="dateLoaderEmiter"
              @datesChangeEmiter="datesChangeEmiter"
            />
          </div>
          <template v-if="isAddActivitySpecialView">
            <BookingRecieptSummary
              :total-amount="totalAmount"
              :total-amount-with-discount="totalAmountWithDiscount"
              :discount="discount"
              :share="share"
              :amount="amount"
              :payment-config="paymentConfig"
              @continueShoppingEmmiter="continueShoppingEmitHandler"
            />
          </template>
        </div>
      </div>
    </section>

    <BottomBar
      :is-block-payment="isBlockPayment"
      :is-data-ready="isDataReady"
      :run-check-basket="runCheckBasket"
      :current-step="currentStep"
      :total-amount-base="totalAmount.toString()"
      :total-amount="totalAmountWithDiscount"
      :is-current-package-valid="isCurrentPackageValid"
      :share-is-loading="share.isLoading"
      :is-membership="isMembership"
      :package-details="
        packages.length > 0 && selectedPackageIndex != -1
          ? packages[selectedPackageIndex]
          : {}
      "
      :prepare-save-payload="prepareSavePayload"
      :selected-card-token="selectedCardToken"
      :selected-card-obj="selectedCardObj"
      :share="share"
      :discount="discount"
      :guest-mode-pay-var="guestModePayVar"
      :is-add-ons-enabled="
        packages.length > 0 && selectedPackageIndex != -1
          ? packages[selectedPackageIndex].isAddOnsEnabled
          : false
      "
      :is-ski-lesson="isCurrentASkiLesson"
      :is-login-required="isPackagesLoginRequired"
      :redirect-to-add-ons="redirectToAddOns"
      :static-labels="staticLabels"
      :outside-checkbasket-response="outsideCheckbasketResponse"
      @removeShareEmiter="shareChangeEmitHandler"
      @enableFullLoaderEmiter="enableFullLoaderEmitHandler"
      @continueShoppingEmmiter="continueShoppingEmitHandler"
      @totalAmountEmiter="totalAmountEmitHandler"
      @tokenizeAndPayGuestMode="tokenizeAndPayGuestMode"
      @googleToken="googleToken"
      @isDataReadyFromAPI="isDataReadyFromAPI"
    />
    <YesNoModal
      :is-modal-active="isModalActive"
      :show-close-icon="false"
      :is-loading="false"
      :data="data"
      @onBtn1Click="onModalBtn1Click"
      @onBtn2Click="onModalBtn2Click"
    />
    <InformativeModal
      :is-modal-active="isInformativeModalActive"
      :show-close-icon="false"
      :is-loading="false"
      :data="informativeData"
      @onBtnClick="onModalBtnClick"
    />
  </main>
</template>

<script>
import YesNoModal from "@/components/BookingFlow/Modals/YesNoModal";
import HeaderBar from "@/components/BookingFlow/HeaderBar";
import BottomBar from "@/components/BookingFlow/BottomBar";
import PackagesContainer from "@/components/BookingFlow/PackagesContainer";
import InformativeModal from "@/components/BookingFlow/Modals/InformativeModal";
import BookingRecieptSummary from "@/components/BookingFlow/BookingRecieptSummary";

import {CommonEvent} from "@/services/app-events";
import {endPoints} from "@/const/api";

import {mapGetters} from "vuex";
import moment from "moment-timezone";

export default {
  name: "BookingFlow",
  components: {
    HeaderBar,
    BottomBar,
    PackagesContainer,
    YesNoModal,
    InformativeModal,
    BookingRecieptSummary
  },
  data() {
    return {
      dateLoader: false,
      bonusTableLoader: false,
      isBlockPayment: false,
      runCheckBasket: false,
      isModalActive: false,
      data: {
        btn1Text: "",
        btn2Text: "",
        title: "",
        description: "",
      },
      guestModePayVar: false,
      tokenizeAndPayGuestModeVar: false,
      isFullPageLoaderEnabled: true,
      packages: [],
      isDataReady: false,
      selectedPackageIndex: 0,
      selectedCardToken: "",
      selectedCardObj: {},
      discount: [],
      changeEvt: {
        date: false,
        guest: false,
      },
      share: {
        isLoading: false,
        earn: {
          amount: 0,
          point: 0,
        },
      },
      isTimeBased: false,
      redirectToAddOns: false,
      staticLabels: {},
      amount: {
        NET: 0,
        TAX: 0,
        GROSS: 0,
        totalBeforeDiscount: 0,
      },
      isThereAChange: false,
      isInformativeModalActive: false,
      informativeData: {
        btnText: "",
        title: "",
        description: "",
      },
      googleTokenVar: "",
      outsideCheckbasketResponse: {},
      currentEnv: '',
      siteConfig: {},
      paymentConfig: {},
      isDataReadyInCheckbasket: false,
      isXLview: true,
      isCampDateChange: false
    };
  },
  computed: {
    ...mapGetters("bookingFlow", ["guestFormIsValid"]),
    ...mapGetters("appConfig", ['vivaProducts']),
    isPromoCodeApplied() {
      return this.$isThereAPromoCode(this.discount);
    },
    getPomoCode() {
      return this.$getPromoCode(this.discount);
    },
    isMembership() {
      if (this.packages.length > 0) {
        const packageData = this.packages[this.selectedPackageIndex || 0];

        if (!packageData) return false;
        if (packageData.cardType == "lessons") return false;

        return packageData.card.is_membership;
      }

      return false;
    },
    isCurrentASkiLesson() {
      if (this.packages.length > 0) {
        let packageData = this.packages[this.selectedPackageIndex || 0];
        if (packageData === undefined) return false;
        return packageData.cardType == "lessons";
      } else {
        return false;
      }
    },
    isShareApplied() {
      return this.$isThereAShareApplied(this.discount);
    },
    getShareDiscountValue() {
      return this.$getShareAmount(this.discount);
    },
    isShare100PercentApplied() {
      return (
        this.getShareDiscountValue == this.amount.GROSS &&
        this.getShareDiscountValue != 0
      );
    },
    isPackagesLoginRequired() {
      for (let index = 0; index < this.packages.length; index++) {
        if (this.packages[index].tickets.length == 1) {
          if (this.packages[index].tickets[0].required_login) return true;
        } else {
          for (const ageType in this.packages[index].people) {
            for (
              let agetypeIndex = 0;
              agetypeIndex < this.packages[index].people[ageType].length;
              agetypeIndex++
            ) {
              if (
                this.packages[index].people[ageType][agetypeIndex].isSelected
              ) {
                if (
                  this.isTicketLoginRequired(
                    index,
                    this.packages[index].people[ageType][agetypeIndex].id
                  )
                )
                  return true;
              }
            }
          }
        }
      }
      return false;
    },
    prepareSavePayload() {
      let promoCode = this.isPromoCodeApplied ? this.getPomoCode : "";
      return {
        redeemAmount: this.getShareDiscountValue,
        promoCode: promoCode,
        cardToken: "",
        securityCode: "",
        lineItems: this.prepareLineItems,
      };
    },
    prepareLineItems() {
      let temp = [];
      for (let index = 0; index < this.packages.length; index++) {
        let tickets = this.prepareTickets(this.packages[index]);
        let addOns = this.prepareAddOns(this.packages[index]);
        let cardType = "";
        if (this.packages[index].cardType === "packages") {
          cardType = "Package";
        } else if (this.packages[index].cardType === "passes") {
          if (this.packages[index].card.is_membership) cardType = "Membership";
          else cardType = "Pass";
        } else {
          cardType = "ski_school";
        }

        let isMovie = (this.packages[index].card || {}).is_movie || false;
        let ticketsData = this.packages[index].tickets;
        let socialDistanceAK = isMovie ?  ticketsData && ticketsData.length > 0 ? ticketsData[0].social_distance_ak || '' : '' : '';
        let isSocialDistanceEnabled = !!(isMovie && socialDistanceAK);

        temp.push({
          type: cardType,
          cardID: this.packages[index].card.id,
          cardId: this.packages[index].card.id,
          eventDate: this.$repositories.getVivaDateFormat(new Date(
            this.$stringToDate(this.packages[index].date).setHours(0, 0, 0, 0)
          )),
          packageTitle: {
            ar: this.packages[index].card.localized_title ? this.packages[index].card.localized_title.ar : this.packages[index].card.title,
            en: this.packages[index].card.localized_title ? this.packages[index].card.localized_title.en : this.packages[index].card.title,
          },
          isSocialDistance: isSocialDistanceEnabled,
          socialDistanceAK: isSocialDistanceEnabled ? socialDistanceAK : '',
          tickets: [...tickets, ...addOns],
        });
      }
      return temp;
    },
    isCurrentPackageValid() {
      if (this.selectedPackageIndex == -1) return true;
      if (this.packages.length == 0) return false;
      let packageData = this.packages[this.selectedPackageIndex];
      if (packageData === undefined) return false;
      if (!packageData.isDateAvailable) return false;

      if (packageData.card.required_quantity) {
        const peopleObject = packageData.people;
        const totalSelectedGuests = this.$getNumber(peopleObject.adult) + this.$getNumber(peopleObject.junior) + this.$getNumber(peopleObject.child);

        if (packageData.card.required_quantity !== totalSelectedGuests) {
          return false;
        }
      }

      if (packageData.cardType == "packages" && !packageData.card.is_movie) {
        for (const ageType in packageData.people) {
          for (
            let index = 0;
            index < packageData.people[ageType].length;
            index++
          ) {
            if (!packageData.people[ageType][index].isSelected) return false;
          }
        }
      }

      const isPassTicket = packageData.cardType === "passes";

      if (isPassTicket) {
        const isUpgradeTicket = !this.$isEmptyObject(packageData.upgrade_ticket);

        if (
          !isUpgradeTicket &&
          !packageData.card.is_movie &&
          !packageData.card.is_table &&
          !packageData.card.is_membership
        ) {
          if (packageData.isPassTimebased && !(packageData.isPassTimebasedSelection || {}).isSelected) {
            return false;
          }
        }

        if (isUpgradeTicket) {
          const upgradeSelectionObj = packageData.upgradeSelection || {};

          if (upgradeSelectionObj.isUpgradeEnabled && !upgradeSelectionObj.isSelected) {
            return false;
          }
        }
      }

      if (packageData.BonusTicketViewModel) {
        if (!packageData.bonusSelection.isSelected) return false;
      }
      if (packageData.bonus_ticket) {
        if (!packageData.bonus_ticketSelection.isSelected) return false;
      }
      if (packageData.card.is_movie) {
        if (!packageData.guestSelection.isSelected) return false;
      }
      if (packageData.card.is_table) {
        let tableSelection = packageData.tableSelection;
        for (let index = 0; index < tableSelection.length; index++) {
          if (!tableSelection[index].isSelected) return false;
        }
      }

      if (packageData.cardType == "lessons") {
        if (!packageData.isPassTimebasedSelection.isSelected) return false;
      }
      if (packageData.card.is_membership) {
        let assignedUsers = packageData.assignedUsers;
        for (let index = 0; index < assignedUsers.length; index++) {
          if (!assignedUsers[index].assignedUser) {
            return false;
          } else {
            if (!assignedUsers[index].assignedUser.profile_image) return false;
          }
        }
      }

      return true;
    },
    totalAmount() {
      let totalAmount = 0;
      for (let index = 0; index < this.packages.length; index++) {
        totalAmount +=
          this.$calculatePackageTotalPrice(this.packages[index]) +
          this.$calculatePackageAddOnsTotalPrice(this.packages[index]);
      }
      return totalAmount;
    },
    totalAmountWithDiscount() {
      let totalAmountWithOutDiscount = this.totalAmount;
      //
      if (this.discount.length > 0) {
        for (let index = 0; index < this.discount.length; index++) {
          if (this.discount[index].discountType == "share") {
            totalAmountWithOutDiscount -= this.discount.aedAmount;
          }
        }
      }
      return totalAmountWithOutDiscount;
    },
    currentStep() {
      let path = this.$route.path;
      if (path.indexOf("add-activity") !== -1) return "add-activity";
      else if (path.indexOf("personal-details") !== -1)
        return "personal-details";
      else if (path.indexOf("add-ons") !== -1) return "add-ons";
      else if (path.indexOf("buy-tickets") !== -1) return "buy-tickets";
      return "";
    },
    getSelectedPackageUniqeID() {
      if (this.selectedPackageIndex == -1) return "-1";
      if (this.packages.length == 0) return "-1";
      return this.packages[this.selectedPackageIndex].uniqueID;
    },
    getSelectedPackageDate() {
      if (this.selectedPackageIndex == -1) return new Date().toISOString();
      if (this.packages.length == 0) return new Date().toISOString();
      let date = this.packages[this.selectedPackageIndex].date;
      return typeof date === "object" ? date.toISOString() : date;
    },
    isAddActivitySpecialView() {
      const isAddActivityPage = this.currentStep == 'add-activity' && this.$route.fullPath.includes("add-activity");

      return isAddActivityPage && !this.isXLview;
    }
  },
  watch: {
    "$store.state.bookingFlow.tempCard": function (newData, oldData) {
      if (!this.$isEmptyObject(newData || {})) this.getPackagesData();
    },
    amount(amount) {
      this.calculateShare(amount.GROSS);
    },
    $route(newData, oldData) {
      this.isBlockPayment = false;
      this.isThereAChange = false;
      setTimeout(() => {
        this.routeIfNotInCorrectPage();
      }, 1000);
    },
    selectedPackageIndex() {
      this.isThereAChange = false;
    }
  },
  created() {
    const locale = this.$i18n.locale;
    const routeWithoutLocale = this.$route.fullPath.replace(`/${locale}`, "");

    // TODO: Add the conditions of redirecting the user to the coorect page.
    if (routeWithoutLocale === "/booking" || routeWithoutLocale === "/booking/") this.$router.push(`/${locale}/booking/personal-details`);
    this.currentEnv = this.$getSiteCurrentEnvironment();
    this.siteConfig = this.$getSiteConfig();
  },
  mounted() {
    this.initializeMafPay();
    CommonEvent.$emit("global-loader", true);
    this.checkExtraLargeDevice();
    this.validateVivaProducts();
    this.getPackagesData();
    this.getSavedDiscount();
    window.addEventListener("resize", this.checkExtraLargeDevice);
  },
  beforeDistroy() {
    CommonEvent.$emit("global-loader", false);
    window.removeEventListener("resize", this.checkExtraLargeDevice);
  },
  methods: {
    initializeMafPay(){
      // if (process.client) {
        const { defineCustomElements } = require("@mafpay/weblib");
        defineCustomElements();
      // }
    },        
    checkExtraLargeDevice() {
      this.isXLview = (window || {}).innerWidth >= 1280;
    },
    googleToken(data) {
      this.googleTokenVar = data;
    },
    getSelectedTicketVivaDetails(tickets, id, productAK) {
      for (let index = 0; index < tickets.length; index++) {
        if (tickets[index].id == id) {
          //
          if (productAK == tickets[index].ak) return tickets[index].ak_details;
          else if (productAK == tickets[index].adult_ak)
            return tickets[index].adult_ak_details;
          else if (productAK == tickets[index].junior_ak)
            return tickets[index].junior_ak_details;
          else if (productAK == tickets[index].child_ak)
            return tickets[index].child_ak_details;
        }
      }
      return {};
    },
    getVivaDetails(packageData) {
      packageData.tickets = packageData.tickets || []
      for (let index = 0; index < packageData.tickets.length; index++) {
        let ak_details = this.$readProductByAKLocal(
          packageData.tickets[index].ak
        );
        let adult_ak_details = this.$readProductByAKLocal(
          packageData.tickets[index].adult_ak
        );
        packageData.tickets[index].ak_details = ak_details;
        packageData.tickets[index].adult_ak_details = adult_ak_details;

        packageData.tickets[index].junior_ak_details =
          this.$readProductByAKLocal(packageData.tickets[index].junior_ak);
        packageData.tickets[index].child_ak_details = this.$readProductByAKLocal(
          packageData.tickets[index].child_ak
        );
        //
        let productDetails = this.$isEmptyObject(ak_details)
          ? adult_ak_details
          : ak_details;

        packageData.tickets[index].required_login_viva =
          this.$repositories.isLoginRequiredVivaNoPromise(productDetails);

        if (index == 0) {
          packageData.card.price = this.$getProductPrice(productDetails);

          let additional_ak = packageData.tickets[0].additional_ak;
          if (additional_ak) {
            let additional_ak_details = this.$readProductByAKLocal(
              packageData.tickets[0].additional_ak
            );

            packageData.card.additional_price = this.$getProductPrice(
              additional_ak_details
            );
          }
        }
      }
      //
      if (!this.$isEmptyObject(packageData.upgrade_ticket || {})) {
        let productDetails = this.$readProductByAKLocal(packageData.upgrade_ticket.ak);
        packageData.upgrade_ticket["product"] = productDetails;
        packageData.upgrade_ticket["price"] = this.$getProductPrice(productDetails);
        packageData.upgrade_ticket["performanceDetails"] = this.$repositories.isTimeBasedEventLocal(productDetails);
      }
      //
      if (!this.$isEmptyObject(packageData.add_ons)) {
        if (!this.$isEmptyObject(packageData.add_ons.supervision_add_on)) {
          if (
            !this.$isEmptyObject(
              packageData.add_ons.supervision_add_on.add_on_item
            )
          ) {
            let product = this.$readProductByAKLocal(
              packageData.add_ons.supervision_add_on.add_on_item.ak
            );
            packageData.add_ons.supervision_add_on.add_on_item.product = product;
            packageData.add_ons.supervision_add_on.add_on_item.price =
              this.$getProductPrice(product);
          }
          //
        }
        if (!this.$isEmptyObject(packageData.add_ons.main_add_ons)) {
          packageData.add_ons.main_add_ons.add_ons_items = packageData.add_ons.main_add_ons.add_ons_items || []

          for (
            let index = 0;
            index < packageData.add_ons.main_add_ons.add_ons_items.length;
            index++
          ) {
            let product = this.$readProductByAKLocal(
              packageData.add_ons.main_add_ons.add_ons_items[index].ak
            );
            packageData.add_ons.main_add_ons.add_ons_items[index].product = product;
            packageData.add_ons.main_add_ons.add_ons_items[index].price =
              this.$getProductPrice(product);
          }
        }
        if (!this.$isEmptyObject(packageData.add_ons.other_add_ons)) {
          packageData.add_ons.other_add_ons.add_ons_items = packageData.add_ons.other_add_ons.add_ons_items || []
          for (
            let index = 0;
            index < packageData.add_ons.other_add_ons.add_ons_items.length;
            index++
          ) {
            let product = this.$readProductByAKLocal(
              packageData.add_ons.other_add_ons.add_ons_items[index].ak
            );
            packageData.add_ons.other_add_ons.add_ons_items[index].product = product;
            packageData.add_ons.other_add_ons.add_ons_items[index].price =
              this.$getProductPrice(product);
          }
        }
      }
      //
      return packageData;
    },
    updateAssignUserEmiter(data) {
      let userID = data.userDetails.id;
      let userIndex = this.getUserIndex(userID);
      if (userIndex == -1) userIndex = data.selectedTicketIndex;
      this.assignUserHandler({
        index: userIndex,
        user: data.userDetails,
      });
    },
    getUserIndex(userID) {
      let assignedUsers =
        this.packages[this.selectedPackageIndex].assignedUsers;
      for (let index = 0; index < assignedUsers.length; index++) {
        if (assignedUsers[index].id == userID) return index;
      }
      return -1;
    },
    assignUserHandler(data) {
      this.packages[this.selectedPackageIndex].assignedUsers[data.index].id =
        data.user.id;
      //
      this.packages[this.selectedPackageIndex].assignedUsers[
        data.index
        ].assignedUser = data.user;
    },
    datesChangeEmiter(dates) {
      this.packages[this.selectedPackageIndex].dates = dates;
    },
    dateLoaderEmiter(data) {
      this.dateLoader = data;
    },
    bonusTableLoaderEmiter(data) {
      this.bonusTableLoader = data;
    },
    blockPayment(flag) {
      this.isBlockPayment = flag;
    },
    getTicketTitle(packageDetails, ticketID) {
      for (let index = 0; index < packageDetails.tickets.length; index++) {
        if (packageDetails.tickets[index].id == ticketID)
          return packageDetails.tickets[index].localized_title || packageDetails.tickets[index].title;
      }
      return "";
    },
    getPackageDetails(packageDetails, ticketID) {
      for (let index = 0; index < packageDetails.tickets.length; index++) {
        if (packageDetails.tickets[index].id == ticketID)
          return packageDetails.tickets[index];
      }
      return {};
    },
    getActiveFromToDate(vivaProductDetails, packageDetails) {
      let isDatesRequired = this.$repositories.isDatesRequiredNoPromise(vivaProductDetails);
      let eventEndDate = packageDetails.dates && packageDetails.dates.length > 0 ? packageDetails.dates[packageDetails.dates.length - 1] : this.$getNextDates(this.$stringToDate(packageDetails.date));
      return {
        from: isDatesRequired.from ? this.$repositories.getVivaDateFormat(packageDetails.date) : '',
        to: isDatesRequired.to ? moment(eventEndDate).isAfter(packageDetails.date) ? this.$repositories.getVivaDateFormat(eventEndDate) : "" : ""
      };
    },
    prepareLessonTicket(packageDetails) {
      let temp = [];
      let counter = 1;
      let additional_ak = packageDetails.tickets[0].additional_ak;
      let pro_ak = packageDetails.tickets[0].ak;
      for (const ageType in packageDetails.people) {
        for (let index = 0; index < packageDetails.people[ageType]; index++) {
          let currentProductDetails = packageDetails.tickets[0].ak_details;
          let productAK = pro_ak;
          //
          let performanceList = [
            packageDetails.isPassTimebasedSelection.selectedAK,
          ];
          if (additional_ak) {
            if (counter == 1) currentProductDetails = packageDetails.tickets[0].additional_ak_details;
            productAK = counter == 1 ? pro_ak : additional_ak;
            performanceList =
              counter == 1
                ? [packageDetails.isPassTimebasedSelection.selectedAK]
                : [];
            if (counter > 1) performanceList = ["additional_ak"];
          }

          let camp_group_id = "";

          if (
            packageDetails.isPassTimebasedSelection.campPerformances &&
            packageDetails.isPassTimebasedSelection.campPerformances.length > 0
          ) {
            performanceList =
              packageDetails.isPassTimebasedSelection.campPerformances;
            const {v4: uuidv4} = require("uuid");
            camp_group_id = uuidv4();
          }

          let localeTitleAr = packageDetails.tickets[0].localized_title ? packageDetails.tickets[0].localized_title.ar : (packageDetails.tickets[0].title || packageDetails.card.title)
          let localeTitleEn = packageDetails.tickets[0].localized_title ? packageDetails.tickets[0].localized_title.en : (packageDetails.tickets[0].title || packageDetails.card.title)
          let activeFromToDate = this.getActiveFromToDate(currentProductDetails, packageDetails);

          for (let index3 = 0; index3 < performanceList.length; index3++) {
            temp.push({
              activeFrom: activeFromToDate.from,
              activeTo: activeFromToDate.to,
              ticketTitle: {
                ar: localeTitleAr,
                en: localeTitleEn,
              },
              ak: productAK,
              quantity: 1,
              performanceList:
                performanceList[index3] == "additional_ak"
                  ? []
                  : [{performance: performanceList[index3], is_bonus: false}],
              additional_data: JSON.stringify({
                ageGroup: [this.detectAgeGroup(ageType, packageDetails)],
              }),
              guestType: [ageType],
              needGear: packageDetails.tickets[0].need_equipment,
              needWaiver: packageDetails.tickets[0].need_waiver,
              withAccount: packageDetails.tickets[0].required_login_viva,
              isAddon: false,
              ticket_type: packageDetails.card.category_card_type,
              camp_group_id: camp_group_id,
              isTimeBased: performanceList[index3] != "additional_ak"
            });
          }
          //
          counter++;
        }
      }
      return temp;
    },
    detectAgeGroup(ageType, packageDetails) {
      let ages_enums = packageDetails.tickets[0].ages_type_id || [];
      if (ages_enums.length > 0) {
        if (ageType == "adult") {
          return {
            min: 14,
            max: 99,
          };
        } else if (ageType == "junior") {
          if (ages_enums.includes(2)) {
            return {
              min: 7,
              max: 13,
            };
          } else {
            //3
            return {
              min: 8,
              max: 13,
            };
          }
        } else {
          //child
          return {
            min: Number(packageDetails.tickets.length ? packageDetails.tickets[0].minimum_age : 3) == 2 ? 2 : 3,
            max: 6,
          };
        }
      } else {
        if (ageType == "adult") {
          return {
            min: 14,
            max: 99,
          };
        } else if (ageType == "junior") {
          return {
            min: 7,
            max: 13,
          };
        } else {
          //child
          return {
            min: Number(packageDetails.tickets.length ? packageDetails.tickets[0].minimum_age : 3) == 2 ? 2 : 3,
            max: 6,
          };
        }
      }
    },
    preparePackageTicket(packageDetails) {
      let temp = [];
      let bounsPerformanceAk = packageDetails.BonusTicketViewModel
        ? packageDetails.bonusSelection.selectedAK
        : "";
      for (const ageType in packageDetails.people) {
        for (
          let index = 0;
          index < packageDetails.people[ageType].length;
          index++
        ) {
          let selectionItem = packageDetails.people[ageType][index];
          if (selectionItem.isSelected) {
            let productAK = selectionItem.selectedSlot
              ? selectionItem.productAK
              : selectionItem.selectedAK;
            //
            let performanceAK = selectionItem.selectedSlot
              ? selectionItem.selectedAK
              : "";
            //

            let selectionVivaDetails = this.getSelectedTicketVivaDetails(
              packageDetails.tickets,
              selectionItem.id,
              selectionItem.productAK || selectionItem.selectedAK
            );

            let required_login =
              this.$repositories.isLoginRequiredVivaNoPromise(selectionVivaDetails);
            //
            let ticketTitle = this.getTicketTitle(
              packageDetails,
              selectionItem.id
            );

            let packageItem = this.getPackageDetails(
              packageDetails,
              selectionItem.id
            );

            //
            //
            let packageSpeciallyToSelectedTicket =
              this.$deepCloneArray(packageDetails);
            packageSpeciallyToSelectedTicket.tickets = [packageItem];

            let performanceList = performanceAK
              ? [
                {
                  performance: performanceAK,
                  is_bonus: false,
                },
              ]
              : [];

            let activeFromToDate = this.getActiveFromToDate(selectionVivaDetails, packageDetails);

            if (bounsPerformanceAk)
              performanceList.push({
                performance: bounsPerformanceAk,
                is_bonus: true,
              });

            temp.push({
              activeFrom: activeFromToDate.from,
              activeTo: activeFromToDate.to,
              ticketTitle: {
                ar: ticketTitle.ar || ticketTitle || packageDetails.card.title,
                en: ticketTitle.en || ticketTitle || packageDetails.card.title,
              },
              ak: productAK,
              quantity: "1",
              performanceList: performanceList,
              guestType: [ageType],
              additional_data: JSON.stringify({
                ageGroup: [
                  this.detectAgeGroup(
                    ageType,
                    packageSpeciallyToSelectedTicket
                  ),
                ],
                bonusTicketTitle: packageDetails && packageDetails.BonusTicketViewModel && packageDetails.BonusTicketViewModel.localized_title ? packageDetails.BonusTicketViewModel.localized_title : {
                  en: packageDetails.BonusTicketViewModel && packageDetails.BonusTicketViewModel.title ? packageDetails.BonusTicketViewModel.title : '',
                  ar: packageDetails.BonusTicketViewModel && packageDetails.BonusTicketViewModel.title ? packageDetails.BonusTicketViewModel.title : '',
                }
              }),
              needGear: packageItem.need_equipment,
              needWaiver: packageItem.need_waiver,
              withAccount: required_login,
              isAddon: false,
              guestID: "",
              isMembership: false,
              isTimeBased: !!performanceAK || !!bounsPerformanceAk
            });
          }
        }
      }
      return temp;
    },
    prepareGuestTypeArray(adult, junior, child) {
      let temp = [];
      for (let index = 0; index < adult; index++) {
        temp.push("adult");
      }
      //
      for (let index = 0; index < junior; index++) {
        temp.push("junior");
      }
      //
      for (let index = 0; index < child; index++) {
        temp.push("child");
      }
      return temp;
    },
    cloneThePerformanceByNum(performanceAK, count) {
      let temp = [];
      for (let index = 0; index < count; index++) {
        temp.push({
          performance: performanceAK,
          is_bonus: false,
        });
      }
      return temp;
    },
    prepareMembershipTicket(packageDetails) {
      let temp = [];
      //
      let eventEndDate = "";
      let isDatesRequired = this.$repositories.isDatesRequiredNoPromise(
        packageDetails.tickets[0].ak_details
      );
      let fromDate = packageDetails.date;

      eventEndDate = moment(fromDate).add(Number(packageDetails.card.number_of_month_for_membership || 1), 'months').toDate();

      let withAccount = this.$repositories.isAccountRequiredNoPromise(
        packageDetails.tickets[0].ak_details
      );
      //
      for (
        let index = 0;
        index < packageDetails.assignedUsers.length;
        index++
      ) {
        if (!packageDetails.assignedUsers[index].assignedUser) continue;
        let localeTitleAr = packageDetails.tickets[0].localized_title ? packageDetails.tickets[0].localized_title.ar : (packageDetails.tickets[0].title || packageDetails.card.title)
        let localeTitleEn = packageDetails.tickets[0].localized_title ? packageDetails.tickets[0].localized_title.en : (packageDetails.tickets[0].title || packageDetails.card.title)

        temp.push({
          activeFrom: isDatesRequired.from ? this.$repositories.getVivaDateFormat(packageDetails.date) : '',
          activeTo: isDatesRequired.to ? this.$repositories.getVivaDateFormat(eventEndDate) : "",
          endDate: this.$repositories.getVivaDateFormat(eventEndDate),
          ticketTitle: {
            ar: localeTitleAr,
            en: localeTitleEn,
          },
          ak: packageDetails.tickets[0].ak,
          quantity: 1,
          performanceList: [],
          guestType: [packageDetails.assignedUsers[index].ageType],

          additional_data: JSON.stringify({
            ageGroup: [
              this.detectAgeGroup(
                packageDetails.assignedUsers[index].ageType,
                packageDetails
              ),
            ],
          }),

          needGear: packageDetails.tickets[0].need_equipment,
          needWaiver: packageDetails.tickets[0].need_waiver,
          withAccount: withAccount,
          isAddon: false,
          guestID: packageDetails.assignedUsers[index].assignedUser.id,
          isMembership: true,
          experience_type: packageDetails.card.experience_type,
          isTimeBased: false
        });
      }
      return temp;
    },
    preparePassTicket(packageDetails) {
      let adult = this.$getNumber(packageDetails.people.adult);
      let junior = this.$getNumber(packageDetails.people.junior);
      let child = this.$getNumber(packageDetails.people.child);
      let isUpgradeEnabled = this.$isUpgradedTicket(packageDetails);
      //
      if (
        !packageDetails.card.is_movie &&
        !packageDetails.card.is_table &&
        this.$isEmptyObject(packageDetails.bonus_ticket) &&
        this.$isEmptyObject(packageDetails.BonusTicketViewModel) &&
        !isUpgradeEnabled
      ) {
        if (packageDetails.isPassTimebased) {
          let performanceAK =
            packageDetails.isPassTimebasedSelection === undefined
              ? ""
              : packageDetails.isPassTimebasedSelection.selectedAK;
          // here if you need to send the time
          let temp = [];
          //
          let localeTitleAr = packageDetails.tickets[0].localized_title ? packageDetails.tickets[0].localized_title.ar : (packageDetails.tickets[0].title || packageDetails.card.title)
          let localeTitleEn = packageDetails.tickets[0].localized_title ? packageDetails.tickets[0].localized_title.en : (packageDetails.tickets[0].title || packageDetails.card.title)
          let activeFromToDate = this.getActiveFromToDate(packageDetails.tickets[0].ak_details, packageDetails);

          for (let index = 0; index < adult; index++) {
            temp.push({
              activeFrom: activeFromToDate.from,
              activeTo: activeFromToDate.to,
              ticketTitle: {
                ar: localeTitleAr,
                en: localeTitleEn,
              },
              ak: packageDetails.tickets[0].ak,
              quantity: 1,
              performanceList: [
                {
                  performance: performanceAK,
                  is_bonus: false,
                },
              ],
              guestType: ["adult"],

              additional_data: JSON.stringify({
                ageGroup: [this.detectAgeGroup("adult", packageDetails)],
              }),

              needGear: packageDetails.tickets[0].need_equipment,
              needWaiver: packageDetails.tickets[0].need_waiver,
              withAccount: packageDetails.tickets[0].required_login_viva,
              isAddon: false,
              guestID: "",
              isMembership: false,
              isTimeBased: true
            });
          }
          for (let index = 0; index < junior; index++) {
            temp.push({
              activeFrom: activeFromToDate.from,
              activeTo: activeFromToDate.to,
              ticketTitle: {
                ar: localeTitleAr,
                en: localeTitleEn,
              },
              ak: packageDetails.tickets[0].ak,
              quantity: 1,
              performanceList: [
                {
                  performance: performanceAK,
                  is_bonus: false,
                },
              ],
              guestType: ["junior"],

              additional_data: JSON.stringify({
                ageGroup: [this.detectAgeGroup("junior", packageDetails)],
              }),

              needGear: packageDetails.tickets[0].need_equipment,
              needWaiver: packageDetails.tickets[0].need_waiver,
              withAccount: packageDetails.tickets[0].required_login_viva,
              isAddon: false,
              guestID: "",
              isMembership: false,
              isTimeBased: true
            });
          }
          for (let index = 0; index < child; index++) {
            temp.push({
              activeFrom: activeFromToDate.from,
              activeTo: activeFromToDate.to,
              ticketTitle: {
                ar: localeTitleAr,
                en: localeTitleEn,
              },
              ak: packageDetails.tickets[0].ak,
              quantity: 1,
              performanceList: [
                {
                  performance: performanceAK,
                  is_bonus: false,
                },
              ],
              guestType: ["child"],

              additional_data: JSON.stringify({
                ageGroup: [this.detectAgeGroup("child", packageDetails)],
              }),

              needGear: packageDetails.tickets[0].need_equipment,
              needWaiver: packageDetails.tickets[0].need_waiver,
              withAccount: packageDetails.tickets[0].required_login_viva,
              isAddon: false,
              guestID: "",
              isMembership: false,
              isTimeBased: true
            });
          }
          //
          return temp;
        } else {
          let isMultipleDays = Number(packageDetails.card.days_of_booking) > 1;
          let multipleDates = [];
          if (isMultipleDays) {
            for (let index = 0; index < packageDetails.dates.length; index++) {
              multipleDates.push(new Date(packageDetails.dates[index]));
            }
          }
          //
          let temp = [];
          //
          let localeTitleAr = packageDetails.tickets[0].localized_title ? packageDetails.tickets[0].localized_title.ar : (packageDetails.tickets[0].title || packageDetails.card.title)
          let localeTitleEn = packageDetails.tickets[0].localized_title ? packageDetails.tickets[0].localized_title.en : (packageDetails.tickets[0].title || packageDetails.card.title)
          let activeFromToDate = this.getActiveFromToDate(packageDetails.tickets[0].ak_details, packageDetails);
          for (let index = 0; index < adult; index++) {
            temp.push({
              activeFrom: activeFromToDate.from,
              activeTo: activeFromToDate.to,
              ticketTitle: {
                ar: localeTitleAr,
                en: localeTitleEn,
              },
              ak: packageDetails.tickets[0].ak,
              quantity: 1,
              performanceList: [],
              guestType: ["adult"],

              additional_data: JSON.stringify({
                ageGroup: [this.detectAgeGroup("adult", packageDetails)],
                isMultipleDays: isMultipleDays,
                multipleDates: multipleDates
              }),

              needGear: packageDetails.tickets[0].need_equipment,
              needWaiver: packageDetails.tickets[0].need_waiver,
              withAccount: packageDetails.tickets[0].required_login_viva,
              isAddon: false,
              guestID: "",
              isMembership: false,
              isTimeBased: false
            });
          }

          for (let index = 0; index < junior; index++) {
            temp.push({
              activeFrom: activeFromToDate.from,
              activeTo: activeFromToDate.to,
              ticketTitle: {
                ar: localeTitleAr,
                en: localeTitleEn,
              },
              ak: packageDetails.tickets[0].ak,
              quantity: 1,
              performanceList: [],
              guestType: ["junior"],

              additional_data: JSON.stringify({
                ageGroup: [this.detectAgeGroup("junior", packageDetails)],
                isMultipleDays: isMultipleDays,
                multipleDates: multipleDates
              }),

              needGear: packageDetails.tickets[0].need_equipment,
              needWaiver: packageDetails.tickets[0].need_waiver,
              withAccount: packageDetails.tickets[0].required_login_viva,
              isAddon: false,
              guestID: "",
              isMembership: false,
              isTimeBased: false
            });
          }

          for (let index = 0; index < child; index++) {
            temp.push({
              activeFrom: activeFromToDate.from,
              activeTo: activeFromToDate.to,
              ticketTitle: {
                ar: localeTitleAr,
                en: localeTitleEn,
              },
              ak: packageDetails.tickets[0].ak,
              quantity: 1,
              performanceList: [],
              guestType: ["child"],

              additional_data: JSON.stringify({
                ageGroup: [this.detectAgeGroup("child", packageDetails)],
                isMultipleDays: isMultipleDays,
                multipleDates: multipleDates
              }),

              needGear: packageDetails.tickets[0].need_equipment,
              needWaiver: packageDetails.tickets[0].need_waiver,
              withAccount: packageDetails.tickets[0].required_login_viva,
              isAddon: false,
              guestID: "",
              isMembership: false,
              isTimeBased: false
            });
          }
          //
          return temp;
        }
      }
      if (packageDetails.card.is_movie) {
        if (packageDetails.tickets.length == 0) return [];
        let isBonusTicketEnabled = !this.$isEmptyObject(packageDetails.bonus_ticket) || !this.$isEmptyObject(packageDetails.BonusTicketViewModel);

        let ticket = packageDetails.tickets[0];        
        let title = ticket.title || packageDetails.card.title;
        let activeFromToDate = this.getActiveFromToDate(ticket.ak_details, packageDetails);
        let bonusData = isBonusTicketEnabled ? !this.$isEmptyObject(packageDetails.bonus_ticket) ? packageDetails.bonus_ticket : packageDetails.BonusTicketViewModel : {};
        let performanceList = [];
        if (isBonusTicketEnabled) {
          performanceList.push({
            performance: (packageDetails.bonus_ticketSelection || {}).selectedAK || (packageDetails.bonusSelection || {}).selectedAK,
            is_bonus: true,
          });
        }

        performanceList.push({
          performance: packageDetails.guestSelection.ak,
          is_bonus: false,
        });

        return this.prepareGuestTypeArray(adult, junior, child).map(guestType => {
          let movieLocalizedTitle = ((packageDetails.guestSelection || {}).localizedTitle || {});
          let localeTitleAr = !isBonusTicketEnabled ? movieLocalizedTitle.ar || "" : ticket.localized_title ? ticket.localized_title.ar : title
          let localeTitleEn = !isBonusTicketEnabled ? movieLocalizedTitle.en || "" : ticket.localized_title ? ticket.localized_title.en : title

          let additionalData = {
            ageGroup: [this.detectAgeGroup(guestType, packageDetails)]
          };

          if (isBonusTicketEnabled) {
            additionalData["movieTitle"] = packageDetails.guestSelection.title;
            additionalData["movieLocalizedTitle"] = movieLocalizedTitle;
            additionalData["bonusTicketTitle"] = bonusData && bonusData.localized_title ? bonusData.localized_title : {
              en: bonusData && bonusData.title ? bonusData.title : '',
              ar: bonusData && bonusData.title ? bonusData.title : '',
            };
          }

          return {
            activeFrom: activeFromToDate.from,
            activeTo: activeFromToDate.to,
            ticketTitle: {
              ar: localeTitleAr,
              en: localeTitleEn,
            },
            ak: ticket.ak || ticket.adult_ak || ticket.junior_ak || ticket.child_ak,
            quantity: 1,
            performanceList: performanceList,
            guestType: [guestType],
            additional_data: JSON.stringify(additionalData),
            needGear: ticket.need_equipment,
            needWaiver: ticket.need_waiver,
            withAccount: ticket.required_login_viva,
            isAddon: false,
            guestID: "",
            isMembership: false,
            isTimeBased: true
          };
        }) || [];
      }

      if (!this.$isEmptyObject(packageDetails.upgrade_ticket)) {
        if (packageDetails.tickets.length == 0) return [];
        let title = packageDetails.tickets[0].title || packageDetails.card.title;
        let activeFromToDate = this.getActiveFromToDate(packageDetails.upgrade_ticket.product, packageDetails);
        return this.prepareGuestTypeArray(adult, junior, child).map(guestType => {
          let localeTitleEn = packageDetails.card.localized_upgrade_title ? packageDetails.card.localized_upgrade_title.en : title;
          let localeTitleAr = packageDetails.card.localized_upgrade_title ? packageDetails.card.localized_upgrade_title.ar : title;

          return {
            activeFrom: activeFromToDate.from,
            activeTo: activeFromToDate.to,
            ticketTitle: {
              ar: localeTitleAr,
              en: localeTitleEn,
            },
            ak: packageDetails.upgrade_ticket.ak,
            quantity: 1,
            performanceList: [
              {
                performance: packageDetails.upgradeSelection.selectedAK,
                is_bonus: false,
              }
            ],
            guestType: [guestType],
            additional_data: JSON.stringify({
              ageGroup: [this.detectAgeGroup(guestType, packageDetails)],
            }),
            needGear: packageDetails.tickets[0].need_equipment,
            needWaiver: packageDetails.tickets[0].need_waiver,
            withAccount: this.$repositories.isLoginRequiredVivaNoPromise(packageDetails.upgrade_ticket.product),
            isAddon: false,
            guestID: "",
            isMembership: false,
            isTimeBased: true
          };
        }) || [];
      }

      if (packageDetails.card.is_table) {
        let temp = [];
        let guestType = this.prepareGuestTypeArray(adult, junior, child);
        for (
          let innerIndex = 0;
          innerIndex < packageDetails.tableSelection.length;
          innerIndex++
        ) {
          let currentTableGuest = this.getCurrentTableGuests(
            guestType,
            packageDetails.card.max_number_per_table,
            innerIndex
          );
          let localeTitleAr = packageDetails.tickets[0].localized_title ? packageDetails.tickets[0].localized_title.ar : (packageDetails.tickets[0].title || packageDetails.card.title)
          let localeTitleEn = packageDetails.tickets[0].localized_title ? packageDetails.tickets[0].localized_title.en : (packageDetails.tickets[0].title || packageDetails.card.title)
          let activeFromToDate = this.getActiveFromToDate(packageDetails.tickets[0].ak_details, packageDetails);

          for (
            let guestTypeIndex = 0;
            guestTypeIndex < currentTableGuest.length;
            guestTypeIndex++
          ) {
            temp.push({
              activeFrom: activeFromToDate.from,
              activeTo: activeFromToDate.to,
              ticketTitle: {
                ar: localeTitleAr,
                en: localeTitleEn,
              },
              ak: packageDetails.tickets[0].ak,
              quantity: 1,
              performanceList: [
                {
                  performance:
                  packageDetails.tableSelection[innerIndex].selectedAK,
                  is_bonus: false,
                },
              ],
              guestType: [currentTableGuest[guestTypeIndex]],

              additional_data: JSON.stringify({
                ageGroup: [
                  this.detectAgeGroup(
                    currentTableGuest[guestTypeIndex],
                    packageDetails
                  ),
                ],
              }),

              needGear: packageDetails.tickets[0].need_equipment,
              needWaiver: packageDetails.tickets[0].need_waiver,
              withAccount: packageDetails.tickets[0].required_login_viva,
              isAddon: false,
              guestID: "",
              isMembership: false,
              isTimeBased: true
            });
          }
        }

        return temp;
      }
      return [];
    },
    getCurrentTableGuests(guests, max_number_per_table, tableIndex) {
      let start_index = tableIndex * max_number_per_table;
      let end_index = start_index + max_number_per_table;
      if (end_index > guests.length) end_index = guests.length;
      //
      let temp = [];
      for (let index = start_index; index < end_index; index++) {
        temp.push(guests[index]);
      }
      return temp;
    },
    getAddOnDetailsByAk(packageDetails, productAK) {
      if (!packageDetails || !packageDetails.add_ons) return false;
      let supervisionAddOns = packageDetails.add_ons.supervision_add_on && packageDetails.add_ons.supervision_add_on.add_on_item && packageDetails.add_ons.supervision_add_on.add_on_item ? [packageDetails.add_ons.supervision_add_on.add_on_item] : [];
      let mainAddOns = packageDetails.add_ons.main_add_ons && packageDetails.add_ons.main_add_ons.add_ons_items && packageDetails.add_ons.main_add_ons.add_ons_items.length > 0 ? packageDetails.add_ons.main_add_ons.add_ons_items : [];
      let otherAddOns = packageDetails.add_ons.other_add_ons && packageDetails.add_ons.other_add_ons.add_ons_items && packageDetails.add_ons.other_add_ons.add_ons_items.length > 0 ? packageDetails.add_ons.other_add_ons.add_ons_items : [];
      let allAddOns = [...supervisionAddOns, ...mainAddOns, ...otherAddOns];
      return allAddOns.find(product => product.ak == productAK) || {};
    },
    prepareAddOns(packageDetails) {
      let addOns = packageDetails.addOnsSelection;
      let temp = [];
      for (let index = 0; index < addOns.length; index++) {
        let counter = addOns[index].counter;
        let localeTitleAr = addOns[index].localized_title ? addOns[index].localized_title.ar : (addOns[index].title || packageDetails.card.title)
        let localeTitleEn = addOns[index].localized_title ? addOns[index].localized_title.en : (addOns[index].title || packageDetails.card.title)
        let addOnDetails = this.getAddOnDetailsByAk(packageDetails, addOns[index].ak);
        if (this.$isEmptyObject(addOnDetails) || this.$isEmptyObject(addOnDetails.product)) return [];
        let activeFromToDate = this.getActiveFromToDate(addOnDetails.product, packageDetails);
        let isVivaRequiredLogin = this.$repositories.isLoginRequiredVivaNoPromise(addOnDetails.product);
        for (let counterIndex = 0; counterIndex < counter; counterIndex++) {
          temp.push({
            activeFrom: activeFromToDate.from,
            activeTo: activeFromToDate.to,
            ticketTitle: {
              ar: localeTitleAr,
              en: localeTitleEn,
            },
            ak: addOns[index].ak,
            quantity: 1,
            performanceList: [],
            guestType: ["ticket"],

            additional_data: "",

            needGear: false,
            needWaiver: false,
            withAccount: isVivaRequiredLogin,
            isAddon: true,
            is_supervision: addOns[index].addOnsType == "supervision",
            isTimeBased: false
          });
        }
      }
      return temp;
    },
    prepareTickets(packageDetails) {
      if (packageDetails.cardType === "lessons") {
        return this.prepareLessonTicket(packageDetails);
      } else if (packageDetails.cardType === "packages" && !packageDetails.card.is_movie) {
        return this.preparePackageTicket(packageDetails);
      } else if (
        (packageDetails.cardType === "passes") || 
        (packageDetails.cardType === "packages" && packageDetails.card.is_movie)
      ) {
        if (packageDetails.card.is_membership)
          return this.prepareMembershipTicket(packageDetails);
        else return this.preparePassTicket(packageDetails);
      }
    },
    onModalBtn1Click(data) {
      this.isModalActive = false;
      if (data.type === "editAddOnsEmitHandler") {
        this.$saveCurrentPackage(this.packages[this.selectedPackageIndex]);
        this.selectedPackageIndex = data.index;
        this.redirectToAddOns = !this.redirectToAddOns;
        this.runCheckBasket = !this.runCheckBasket;
      } else if (data.type === "changePackageEmitHandler") {
        this.changePackageHandler(data.packageIndex);
      } else if (data.type === "continueShoppingEmitHandler") {
        this.removePackageEmiterHandler(this.selectedPackageIndex, false);
        this.routeToContinueShopping();
      } else if (data.type === "removePackage"){
        this.removePackageEmiterHandler(data.packageIndex, data.enableAlert);        
      }
    },
    confirmChangePackageEmitHandler(packageIndex) {
      this.$saveCurrentPackage(this.packages[this.selectedPackageIndex]);
      this.selectedPackageIndex = packageIndex;
      this.$store.commit("bookingFlow/SET_SELECTED_PACKAGE_INDEX", packageIndex);
      this.runCheckBasket = !this.runCheckBasket;
      this.routeToPackage(this.packages[packageIndex]);
    },
    onModalBtn2Click(data) {
      this.isModalActive = false;
      if (data.type == "editAddOnsEmitHandler") {
        let packageIndexInStore = this.$getPackageIndexInStoreByUniqeID(
          this.packages[this.selectedPackageIndex].uniqueID
        );
        let bookingData = this.$deepCloneArray(
          this.$store.state.bookingFlow.bookingData
        );
        let oldData = bookingData[packageIndexInStore];
        let packageData = this.setSelection(
          this.packages[this.selectedPackageIndex],
          oldData
        );
        packageData["isAddOnsEnabled"] = this.isThereAddOns(
          packageData.add_ons
        );
        this.packages[this.selectedPackageIndex] = packageData;
        this.selectedPackageIndex = data.index;
        this.redirectToAddOns = !this.redirectToAddOns;
      } else if (data.type == "changePackageEmitHandler") {
        let packageIndexInStore = this.$getPackageIndexInStoreByUniqeID(
          this.packages[this.selectedPackageIndex].uniqueID
        );
        let bookingData = this.$deepCloneArray(
          this.$store.state.bookingFlow.bookingData
        );
        let oldData = bookingData[packageIndexInStore];
        let packageData = this.setSelection(
          this.packages[this.selectedPackageIndex],
          oldData
        );
        packageData["isAddOnsEnabled"] = this.isThereAddOns(
          packageData.add_ons
        );
        this.packages[this.selectedPackageIndex] = packageData;
        this.selectedPackageIndex = data.packageIndex;
        this.$store.commit(
          "bookingFlow/SET_SELECTED_PACKAGE_INDEX",
          data.packageIndex
        );
        this.routeToPackage(this.packages[data.packageIndex]);
      }
    },
    guestModePay(event) {
      this.guestModePayVar = !this.guestModePayVar;
    },
    tokenizeAndPayGuestMode($event) {
      this.tokenizeAndPayGuestModeVar = !this.tokenizeAndPayGuestModeVar;
    },
    isAddOnsEnabledByIndex(index) {
      if (this.packages.length == 0) return false;
      let packageDetails = this.packages[index != -1 ? index : 0];
      if (packageDetails === undefined) return false;
      return packageDetails.isAddOnsEnabled;
    },
    enableFullLoaderEmitHandler($event) {
      CommonEvent.$emit("global-loader", $event);
      this.isFullPageLoaderEnabled = $event;
    },
    totalAmountEmitHandler(amount) {
      this.amount = amount;
    },
    getMovieAK(movieID, tickets) {
      for (let index = 0; index < tickets.length; index++) {
        if (tickets[index].id == movieID) return tickets[index].ak;
      }
      return "";
    },
    isTicketLoginRequired(iteration, cardID) {
      for (
        let index = 0;
        index < this.packages[iteration].tickets.length;
        index++
      ) {
        if (this.packages[iteration].tickets[index].id == cardID) {
          if (this.packages[iteration].tickets[index].required_login)
            return true;
        }
      }
      return false;
    },
    isPackagesATimeBased() {
      this.isTimeBased = false;
      for (let index = 0; index < this.packages.length; index++) {
        if (this.packages[index].cardType == "packages") {
          this.isTimeBased = true;
          return false;
        } else if (this.packages[index].cardType == "passes") {
          if (this.isTimebasedPasses(this.packages[index])) this.isTimeBased = true;
        } else if (this.packages[index].cardType === "lessons") {
          this.isTimeBased = true;
          return false;
        }
      }
    },
    isTimebasedPasses(data) {
      if (
        data.card.is_table ||
        data.card.is_movie ||
        !this.$isEmptyObject(data.upgrade_ticket || {}) ||
        data.tickets[0].eventsType.main.isTimeBased
      )
        return true;
      return false;
    },
    async calculateShare(amount) {
      if (!this.paymentConfig || (this.paymentConfig && this.paymentConfig.hide_share)) return false;
      if (this.isShareApplied && this.isShare100PercentApplied) {
        this.share = {
          earn: {
            amount: "0.00",
            point: "0.00",
          },
        };
      } else {
        let tempAmount = this.$deepCloneArray(amount);
        let tempShareDiscountValue = this.$deepCloneArray(
          this.getShareDiscountValue
        );
        let shareAmount = this.$decimalPlaces(tempAmount - tempShareDiscountValue, true);

        this.share.isLoading = true;
        shareAmount = parseFloat(shareAmount.replace(/,/g, ''))

        let data = {
          pay_in_amount: shareAmount, // minus share amount redeemed.
          trx_amount: shareAmount,
        };
        let response = await this.$repositories.pointSimulate(data);
        if (response.status == "SUCCESS") {
          this.share = {
            earn: {
              amount: response.points_rewarded_amount || "0.00",
              point: response.points_rewarded || "0.00",
            },
          };
        }
        this.share.isLoading = false;
      }
    },
    addOnsCounterChangeHandler(data) {
      let addOnsSelection = this.$deepCloneArray(
        this.packages[this.selectedPackageIndex]["addOnsSelection"] || []
      );

      let packages = this.$deepCloneArray(this.packages);

      let parentPackage = packages[this.selectedPackageIndex];
      let gtmRequest = {
        item_id: data.ak, //Type: String
        item_name: data.title, //Type: String
        affiliation: process.env.SHARED_ENVS.WEB_BASE_URL, //Type: String
        coupon: "", //Type: String
        currency: this.siteConfig.currency('en'), //Type: String
        discount: 0, //Type: Float
        index: data.index, //Type: Integer, Desciption: Position in the list
        item_brand: "Ski Dubai", //Type: String
        item_category: parentPackage.card.title, //Type: String, Description: Main category of the product
        item_category2: parentPackage.card.title, //Type: String, Description: Type of the product
        item_category3: parentPackage.cardType, //Type: String, Description: Category of the product
        item_category4: "", //Type: String, Description: Level of expertise
        item_category5: "", //Type: Integer, Description:  Age groups
        item_list_id: parentPackage.card.id, //Type: String
        item_list_name: parentPackage.card.title, //Type: String
        item_variant: data.addOnsType || "", //Type: String, Description: Type of activities
        age_category: parentPackage.card.label_text || "", //Type: String
        exp_category: parentPackage.cardType || '', //Type: String
        number_of_lessons: 0, //Type: Integer
        lesson_type: "", //Type: String
        location_id: "", //Type: String
        price: parseFloat(this.$decimalPlaces(data.amount)), //Type: Float
        quantity: data.counter, //Type: Integer
      };

      if (this.isAddOnSelected(data.id)) {
        let index = this.getAddOnIndex(data.id);
        if (data.counter == 0) {
          this.gtmAddRemoveItem(gtmRequest, "remove_from_cart");
          // remove it
          let pacakge = this.$deepCloneArray(
            this.$repositories.removeIndexFromArray(addOnsSelection, index)
          );
          packages[this.selectedPackageIndex]["addOnsSelection"] = pacakge;
          this.packages = packages;
        } else {
          this.gtmAddRemoveItem(gtmRequest);
          //replace it it
          addOnsSelection[index] = data;
          let pacakge = this.$deepCloneArray(addOnsSelection);
          packages[this.selectedPackageIndex]["addOnsSelection"] = pacakge;
          this.packages = packages;
        }
      } else {
        this.gtmAddRemoveItem(gtmRequest);

        let pacakge = this.$deepCloneArray([...addOnsSelection, ...[data]]);
        packages[this.selectedPackageIndex]["addOnsSelection"] = pacakge;
        this.packages = packages;
      }
      this.isThereAChange = true;
    },
    isAddOnSelected(id) {
      let addOnsSelection =
        this.packages[this.selectedPackageIndex]["addOnsSelection"] || [];
      if (addOnsSelection.length == 0) return false;
      return (
        addOnsSelection.filter((addOn) => {
          return addOn.id == id;
        }).length > 0
      );
    },
    getAddOnIndex(id) {
      let addOnsSelection =
        this.packages[this.selectedPackageIndex]["addOnsSelection"];
      for (let index = 0; index < addOnsSelection.length; index++) {
        if (addOnsSelection[index].id == id) return index;
      }
      return 0;
    },
    isThereAddOns(addOns) {
      let supervision_add_on = false;
      let main_add_ons = false;
      let other_add_ons = false;
      if (!this.$isEmptyObject(addOns)) {
        if (!this.$isEmptyObject(addOns["supervision_add_on"])) {
          if (!this.$isEmptyObject(addOns["supervision_add_on"].add_on_item))
            supervision_add_on = true;
        }
        if (!this.$isEmptyObject(addOns["main_add_ons"])) {
          if (addOns["main_add_ons"].add_ons_items.length > 0)
            main_add_ons = true;
        }
        if (!this.$isEmptyObject(addOns["other_add_ons"])) {
          if (addOns["other_add_ons"].add_ons_items.length > 0)
            other_add_ons = true;
        }
      }
      return supervision_add_on || main_add_ons || other_add_ons;
    },
    editAddOnsEmitHandler(index) {
      if (
        this.$isPackageAlreadyInStoreByUniqeID(
          this.packages[this.selectedPackageIndex].uniqueID
        )
      ) {
        if (this.isThereAChange) {
          if (this.isCurrentPackageValid) {
            this.isModalActive = true;
            let confirm = this.staticLabels.confirm_edit_booking_message;
            let isDataExist = !this.$isEmptyObject(confirm || {});

            let is_left_cta = "";
            let is_right_cta = "";
            if (isDataExist) {
              is_left_cta = (confirm && confirm.left_cta) || false;
              is_right_cta = (confirm && confirm.right_cta) || false;
            }

            this.data = {
              btn1Text: isDataExist
                ? is_left_cta
                  ? confirm.left_cta.title
                  : this.$t('BOOKINGFLOW_PAGE.CONFIRM')
                : this.$t('BOOKINGFLOW_PAGE.CONFIRM'),
              btn2Text: isDataExist
                ? is_right_cta
                  ? confirm.right_cta.title
                  : this.$t('BOOKINGFLOW_PAGE.IGNORE')
                : this.$t('BOOKINGFLOW_PAGE.IGNORE'),
              title: isDataExist
                ? confirm.title
                : this.$t('BOOKINGFLOW_PAGE.DO_YOU_WANT_TO_SAVE_YOUR_CHANGES'),
              description: isDataExist ? confirm.description : "",
              extraData: {
                type: "editAddOnsEmitHandler",
                index: index,
              },
            };
          } else {
            this.$showToast({
              type: "red",
              text: this.$t('BOOKINGFLOW_PAGE.YOU_SHOULD_HAVE_A_VALID_FORM_BEFORE_PROCEED_REDIRECTING'),
            });
          }
        } else {
          this.selectedPackageIndex = index;
          this.redirectToAddOns = !this.redirectToAddOns;
        }
      } else {
        if (this.packages[this.selectedPackageIndex].cardType == "passes") {
          //
          if (this.isCurrentPackageValid) {
            this.$saveCurrentPackage(this.packages[this.selectedPackageIndex]);
            this.selectedPackageIndex = index;
            this.redirectToAddOns = !this.redirectToAddOns;
            this.runCheckBasket = !this.runCheckBasket;
          } else {
            this.$showToast({
              type: "red",
              text: this.$t('BOOKINGFLOW_PAGE.YOU_SHOULD_HAVE_A_VALID_FORM_BEFORE_PROCEED_REDIRECTING'),
            });
          }
          //
        } else {
          this.$showToast({
            type: "red",
            text: this.$t('BOOKINGFLOW_PAGE.CANNOT_PROCEED_WITHOUT_SAVE'),
          });
        }
      }
    },
    shareChangeEmitHandler(data) {
      this.outsideCheckbasketResponse = data.checkBasket;
      this.saveDiscountInStore(data.share, "share");
    },
    promoCodeChangeEmitHandler(data) {
      this.outsideCheckbasketResponse = data.checkBasket;
      this.saveDiscountInStore(data.promoCode, "PromoCode");
    },
    getIndexOfDiscount(type) {
      for (let index = 0; index < this.discount.length; index++) {
        if (this.discount[index].discountType == type) return index;
      }
      return -1;
    },
    checkDiscountTypeExistance(type) {
      for (let index = 0; index < this.discount.length; index++) {
        if (this.discount[index].discountType == type) return true;
      }
      return false;
    },
    saveDiscountInStore(data, discountType) {
      let tempArr = this.$deepCloneArray(this.discount);
      // prepare data..
      let temp = {};
      if (!this.$isEmptyObject(data)) {
        temp = data;
        temp["discountType"] = discountType;
      }
      // prepare data..
      if (this.checkDiscountTypeExistance(discountType)) {
        let discountIndex = this.getIndexOfDiscount(discountType);
        if (!this.$isEmptyObject(data)) {
          // need to push it to the array
          tempArr[discountIndex] = temp;
        } else {
          // need to remove it by index;
          tempArr = this.$repositories.removeIndexFromArray(tempArr, discountIndex);
        }
      } else {
        // need to push it.
        tempArr.push(temp);
      }
      tempArr = this.cleanDiscount(tempArr);
      this.discount = tempArr;
      this.$store.commit("bookingFlow/SET_DISCOUNT", tempArr);
    },
    cleanDiscount(arr) {
      let temp = [];
      for (let index = 0; index < arr.length; index++) {
        if (!this.$isEmptyObject(arr[index].discountType || {})) {
          if (
            arr[index].discountType == "PromoCode" ||
            arr[index].discountType == "share"
          ) {
            temp.push(arr[index]);
          }
        }
      }
      //
      return temp;
    },
    selectedCreditCardEmitHandler(selectedCard) {
      this.selectedCardToken = selectedCard.cardToken;
      this.selectedCardObj = selectedCard;
    },
    routeToContinueShopping() {
      let guest = {
        adult: this.$getNumber(
          this.packages[this.selectedPackageIndex].people.adult
        ),
        junior: this.$getNumber(
          this.packages[this.selectedPackageIndex].people.junior
        ),
        child: this.$getNumber(
          this.packages[this.selectedPackageIndex].people.child
        ),
      };

      let date = this.packages[this.selectedPackageIndex].date;
      let experience =
        this.packages[this.selectedPackageIndex].booking_bar_experience;

      let experienceObj =
        this.packages[this.selectedPackageIndex].booking_bar.experience || {};

      let path = ``;
      if (experience) {
        path = experience;
      } else {
        path = `/passes-packages/explore`;
      }

      if (path.indexOf("/booking/") !== -1) {
        //when choose a header ticket..
        path = `/passes-packages/explore`;
      }

      date = this.$stringToDate(date);
      const selectedDateArr = date.toDateString().split(" ");
      let dateObj = {
        fullDate:
          selectedDateArr[2] +
          " " +
          selectedDateArr[1] +
          " " +
          selectedDateArr[3],
        shortDate: selectedDateArr[2] + " " + selectedDateArr[1],
        selectedDate: date,
      };

      this.$store.commit("bookingBar/setFilterData", {
        experience: experienceObj,
        date: dateObj,
        people: guest,
        //
      });
      this.$router.push(this.localePath(path));
    },
    vivaErrorHandling(response) {
      if (response.ERROR.CODE == 401) return false;
      let error = response.ERROR.TEXT;
      this.informativeData = {
        btnText: this.$t('COMMON.OK'),
        title: error,
        description: error,
      };
      CommonEvent.$emit("global-loader", false);

      this.isInformativeModalActive = true;
    },
    onModalBtnClick(event) {
      this.isInformativeModalActive = false;
    },
    async continueShoppingEmitHandler() {
      if (this.isCurrentPackageValid) {
        //
        CommonEvent.$emit("global-loader", true);
        let result = await this.validateCheckbasket();
        if (result.ERROR.CODE == 200) {
          this.$saveCurrentPackage(this.packages[this.selectedPackageIndex]);
          this.runCheckBasket = !this.runCheckBasket;
          CommonEvent.$emit("global-loader", false);
          this.routeToContinueShopping();
        } else {
          this.vivaErrorHandling(result);
        }
        //
      } else {
        this.isModalActive = true;

        let confirm = this.staticLabels.confirm_booking_message;
        let isDataExist = !this.$isEmptyObject(confirm || {});

        let is_left_cta = (confirm && confirm.left_cta) || false;
        let is_right_cta = (confirm && confirm.right_cta) || false;

        this.data = {
          btn1Text: isDataExist
            ? is_left_cta
              ? confirm.left_cta.title
              : this.$t('BOOKINGFLOW_PAGE.CONFIRM')
            : this.$t('BOOKINGFLOW_PAGE.CONFIRM'),
          btn2Text: isDataExist
            ? is_right_cta
              ? confirm.right_cta.title
              : this.$t('BOOKINGFLOW_PAGE.STAY_IN_THE_PAGE')
            : this.$t('BOOKINGFLOW_PAGE.STAY_IN_THE_PAGE'),
          title: isDataExist
            ? confirm.title
            : this.$t('BOOKINGFLOW_PAGE.DO_YOU_NEEDS_TO_SKIP_WHAT_ADDED_SELECTED'),
          description: isDataExist ? confirm.description : "",
          extraData: {
            type: "continueShoppingEmitHandler",
          },
        };
      }
    },
    isATimeBasedByIndex(index) {
      if (this.packages.length == 0) return false;
      let currentPackage = this.packages[index];
      if (this.$isEmptyObject(currentPackage)) return false;
      if (currentPackage.cardType == "packages") {
        return true;
      } else if (
        currentPackage.cardType == "passes" ||
        currentPackage.cardType == "lessons"
      ) {
        if (this.isTimebasedPasses(currentPackage)) return true;
      }
      return false;
    },
    isCurrentATimeBased() {
      if (this.selectedPackageIndex == -1 || this.packages.length == 0)
        return false;
      let currentPackage = this.packages[this.selectedPackageIndex];
      if (currentPackage.cardType == "packages") {
        return true;
      } else if (currentPackage.cardType == "passes") {
        if (this.isTimebasedPasses(currentPackage)) return true;
      } else if (currentPackage.cardType === "lessons") {
        return true;
      }
      return false;
    },
    tabChangeEmitHandler(data) {
      if (this.isCurrentPackageValid) {
        if (data.save) {
          if (!this.$isUserAuthenticated()) {
            this.$root.$emit("validatePersonalDetailsGuestForm");
            setTimeout(async () => {
              if (this.currentStep == "personal-details") {
                if (this.guestFormIsValid) {
                  let res = await this.$repositories.generateGuestJWT();
                  if (!res) this.$router.push(this.localePath("/booking-failed"));
                  this.confirmTabChange(data.link);
                } else {
                  this.$showToast({
                    type: "red",
                    text: this.staticLabels.invalid_guest_form_message,
                  });
                  return false;
                }
              } else {
                this.confirmTabChange(data.link);
              }
            });
          } else {
            this.confirmTabChange(data.link);
          }
        } else {
          //
          let packageIndexInStore = this.$getPackageIndexInStoreByUniqeID(
            this.packages[this.selectedPackageIndex].uniqueID
          );
          let bookingData = this.$deepCloneArray(
            this.$store.state.bookingFlow.bookingData
          );
          let oldData = bookingData[packageIndexInStore];
          let packageData = this.setSelection(
            this.packages[this.selectedPackageIndex],
            oldData
          );

          packageData["isAddOnsEnabled"] = this.isThereAddOns(
            packageData.add_ons
          );
          // get the data.
          this.packages[this.selectedPackageIndex] = packageData;
          this.$router.push(this.localePath(data.link));
        }
      } else {
        this.$showToast({
          type: "red",
          text: this.$t('BOOKINGFLOW_PAGE.YOU_SHOULD_HAVE_A_VALID_FORM_BEFORE_PROCEED_REDIRECTING'),
        });
      }
    },
    confirmTabChange(link) {
      this.$saveCurrentPackage(this.packages[this.selectedPackageIndex]);
      this.runCheckBasket = !this.runCheckBasket;
      this.$router.push(this.localePath(link));
    },
    async changePackageEmitHandler(packageIndex) {
      if (
        this.$isPackageAlreadyInStoreByUniqeID(
          this.packages[this.selectedPackageIndex].uniqueID
        )
      ) {
        if (this.isThereAChange) {
          if (this.isCurrentPackageValid) {
            this.isModalActive = true;

            let confirm = this.staticLabels.confirm_edit_booking_message;
            let isDataExist = !this.$isEmptyObject(confirm || {});

            let is_left_cta = (confirm && confirm.left_cta) || false;
            let is_right_cta = (confirm && confirm.right_cta) || false;

            this.data = {
              btn1Text: isDataExist
                ? is_left_cta
                  ? confirm.left_cta.title
                  : this.$t('BOOKINGFLOW_PAGE.CONFIRM')
                : this.$t('BOOKINGFLOW_PAGE.CONFIRM'),
              btn2Text: isDataExist
                ? is_right_cta
                  ? confirm.right_cta.title
                  : this.$t('BOOKINGFLOW_PAGE.IGNORE')
                : this.$t('BOOKINGFLOW_PAGE.IGNORE'),
              title: isDataExist
                ? confirm.title
                : this.$t('BOOKINGFLOW_PAGE.DO_YOU_WANT_TO_SAVE_YOUR_CHANGES'),
              description: isDataExist ? confirm.description : "",
              extraData: {
                type: "changePackageEmitHandler",
                packageIndex: packageIndex,
              },
            };
          } else {
            this.$showToast({
              type: "red",
              text: this.$t('BOOKINGFLOW_PAGE.YOU_SHOULD_HAVE_A_VALID_FORM_BEFORE_PROCEED_REDIRECTING'),
            });
          }
        } else {
          this.changePackageHandler(packageIndex);
        }
      } else {
        if (this.packages[this.selectedPackageIndex].cardType == "passes") {
          if (this.isCurrentPackageValid) {
            this.changePackageHandler(packageIndex);
          } else {
            this.$showToast({
              type: "red",
              text: this.$t('BOOKINGFLOW_PAGE.YOU_SHOULD_HAVE_A_VALID_FORM_BEFORE_PROCEED_REDIRECTING'),
            });
          }
          //
        } else {
          this.$showToast({
            type: "red",
            text: this.$t('BOOKINGFLOW_PAGE.CANNOT_PROCEED_WITHOUT_SAVE'),
          });
        }
      }
    },
    changePackageHandler(packageIndex) {
      if (!this.$isUserAuthenticated()) {
        this.$root.$emit("validatePersonalDetailsGuestForm");
        setTimeout(async () => {
          if (this.currentStep == "personal-details") {
            if (this.guestFormIsValid) {
              let res = await this.$repositories.generateGuestJWT();
              if (!res) this.$router.push(this.localePath("/booking-failed"));
              this.confirmChangePackageEmitHandler(packageIndex);
            } else {
              this.$showToast({
                type: "red",
                text: this.staticLabels.invalid_guest_form_message,
              });
              return false;
            }
          } else {
            this.confirmChangePackageEmitHandler(packageIndex);
          }
        });
      } else {
        this.confirmChangePackageEmitHandler(packageIndex);
      }
    },
    routeToPackage(packageDetails) {
      let route = "/booking/add-activity"; //packages
      if (packageDetails.cardType == "passes") {
        let isTimebasedPasses = this.isTimebasedPasses(packageDetails);
        if (!isTimebasedPasses) route = "/booking/personal-details";
      }
      this.$router.push(this.localePath(route));
    },
    redirectWhenNoSelection() {
      this.$clearBookingSession();
      setTimeout(() => {
        let path = "/passes-packages/explore";
        this.$router.push(this.localePath(path));
      });
    },
    removePackageHandler(packageIndex, enableAlert = true) {
      let data = this.staticLabels.booking_remove_button_message || {};
      const leftCtaTitle = (data.left_cta || {}).title || this.$t("BOOKINGFLOW_PAGE.CONFIRM");
      const rightCtaTitle = (data.right_cta || {}).title || this.$t("BOOKINGFLOW_PAGE.IGNORE");
      this.data = {
          btn1Text: leftCtaTitle,
          btn2Text: rightCtaTitle,
          title: data.title || this.$t('BOOKINGFLOW_PAGE.DO_YOU_WANT_TO_DELETE_THE_SELECTED_PACKAGE'),
          description: data.description || "",
          extraData: {
              type: "removePackage",
              packageIndex: packageIndex,
              enableAlert: enableAlert
          }
      };
      this.isModalActive = true;
    },
    removePackageEmiterHandler(packageIndex, enableAlert = true) {
      let bookingData = this.$deepCloneArray(
        this.$store.state.bookingFlow.bookingData
      );
      let tempCard = this.$deepCloneArray(
        this.$store.state.bookingFlow.tempCard
      );

      if (this.packages[packageIndex]) {
        let card = this.packages[packageIndex].card;
        this.$repositories.removeFromCartEvent(card, this.packages[packageIndex])
      }

      if (
        (bookingData.length == 1 && this.$isEmptyObject(tempCard)) ||
        (bookingData.length == 0 && !this.$isEmptyObject(tempCard))
      ) {
        // there is no packages more..
        if (enableAlert) {
          this.redirectWhenNoSelection();
        }
      } else {
        if (this.selectedPackageIndex == packageIndex) {
          // the selected package will be remove.
          this.selectedPackageIndex = 0;
          if (
            this.$isPackageAlreadyInStoreByUniqeID(
              this.packages[packageIndex].uniqueID
            )
          ) {
            // remove from the store
            bookingData = this.$repositories.removeIndexFromArray(bookingData, packageIndex);

            this.$store.commit("bookingFlow/SET_BOOKING_DATA", bookingData);
            // remove from the local
            this.packages = this.$repositories.removeIndexFromArray(
              this.packages,
              packageIndex
            );
          } else {
            this.$store.commit("bookingFlow/SET_TEMP_CARD", {});
            this.packages = this.$repositories.removeIndexFromArray(
              this.packages,
              packageIndex
            );
          }
          //
          this.isPackagesATimeBased();
          this.$store.commit("bookingFlow/SET_SELECTED_PACKAGE_INDEX", 0);
          this.routeIfNotInCorrectPage();
        } else {
          bookingData = this.$repositories.removeIndexFromArray(bookingData, packageIndex);
          this.$store.commit("bookingFlow/SET_BOOKING_DATA", bookingData);
          // remove from the local
          this.packages = this.$repositories.removeIndexFromArray(
            this.packages,
            packageIndex
          );
          // search on packages with cardID cardID
          if (this.packages[this.selectedPackageIndex]) {
            this.selectedPackageIndex = this.getPackageIndexByCardID(this.packages[this.selectedPackageIndex].cardID);
            this.$store.commit(
              "bookingFlow/SET_SELECTED_PACKAGE_INDEX",
              this.selectedPackageIndex
            );
          }
          // and set it locally and in store.
          //
          // not the selected package will be removed.
          // simple delete from the local and from the store.
          this.isPackagesATimeBased();
          this.routeIfNotInCorrectPage();

        }
        this.runCheckBasket = !this.runCheckBasket;
      }
    },
    getPackageIndexByCardID(cardID) {
      for (let index = 0; index < this.packages.length; index++) {
        if (this.packages[index].cardID == cardID) return index;
      }
      return 0;
    },
    dateChangeEmitHandler(data) {
      let packages = this.$deepCloneArray(this.packages);
      packages[this.selectedPackageIndex].date = data.selectedDate;
      packages[this.selectedPackageIndex].isDateAvailable = data.isDateAvailable;
      this.packages = packages;
      this.changeEvt.date = !this.changeEvt.date;
      if (!data.isDateAvailable && data.showMessage) {
        const selectedPackage = packages && packages.length > 0 ? packages[this.selectedPackageIndex] || {} : {};
        const selectedPackageCard = selectedPackage.card || {};
        const everyRangeOfBooking = selectedPackageCard.every_range_of_booking || 0;
        const isCampPackage = everyRangeOfBooking === 1 || everyRangeOfBooking === 2;

        if (!isCampPackage || (isCampPackage && this.isCampDateChange)) {
          const packageTitle = selectedPackageCard.title;
          this.$showToast({
            type: "red",
            text: `${packageTitle} ${this.$t('BOOKINGFLOW_PAGE.IS_UNAVAILABLE_ON_THE_SELECTED_DATE')}`,
          });
        }
        if (isCampPackage) this.isCampDateChange = true;
      }
    },
    selectTimeSlotEmitHandler(data) {
      let packages = this.$deepCloneArray(this.packages);
      if (packages[this.selectedPackageIndex].cardType == "passes") {
        if (!this.$isEmptyObject(packages[this.selectedPackageIndex].upgrade_ticket || {})) {
          packages[this.selectedPackageIndex]["upgradeSelection"] = data;
        } else if (packages[this.selectedPackageIndex].isPassTimebased) {
          packages[this.selectedPackageIndex]["isPassTimebasedSelection"] =
            data;
        } else {
          let isBouns = !!packages[this.selectedPackageIndex].bonus_ticket;
          packages[this.selectedPackageIndex][
            isBouns ? "bonus_ticketSelection" : "bonusSelection"
            ] = data;
        }
      } else if (packages[this.selectedPackageIndex].cardType === "lessons") {
        packages[this.selectedPackageIndex]["isPassTimebasedSelection"] = data;
      } else {
        let isBouns = !!packages[this.selectedPackageIndex].bonus_ticket;
        packages[this.selectedPackageIndex][
          isBouns ? "bonus_ticketSelection" : "bonusSelection"
          ] = data;
      }
      this.packages = packages;
      this.isThereAChange = true;
    },
    selectTimeSlotTableEmitHandler(data) {
      let packages = this.$deepCloneArray(this.packages);
      packages[this.selectedPackageIndex].tableSelection[data.index] =
        data.data;
      this.packages = packages;
      this.isThereAChange = true;
    },
    guestChangeEmitHandler(data) {
      let packages = this.$deepCloneArray(this.packages);
      if (packages[this.selectedPackageIndex].cardType == "packages") {
        for (const ageType in packages[this.selectedPackageIndex].people) {
          if (
            data.data[ageType] >
            packages[this.selectedPackageIndex].people[ageType].length
          ) {
            this.addAgeType(ageType);
          } else if (
            data.data[ageType] <
            packages[this.selectedPackageIndex].people[ageType].length
          ) {
            this.removeAgeTypeEmitHandler(
              ageType,
              packages[this.selectedPackageIndex].people[ageType].length - 1
            );
          }
        }
      } else {
        let oldCounter = {
          adult: packages[this.selectedPackageIndex].people.adult,
          child: packages[this.selectedPackageIndex].people.child,
          junior: packages[this.selectedPackageIndex].people.junior,
        };
        //
        packages[this.selectedPackageIndex].people.adult = data.data.adult;
        packages[this.selectedPackageIndex].people.child = data.data.child;
        packages[this.selectedPackageIndex].people.junior = data.data.junior;
        //
        if (packages[this.selectedPackageIndex].card.is_table) {
          let guestCount = data.data.adult + data.data.child + data.data.junior;
          let max_number_per_table =
            packages[this.selectedPackageIndex].card.max_number_per_table;
          let newTableCount = this.$getTablesCountDependsOnNumberOfGuest(
            guestCount,
            max_number_per_table
          );
          let currentTableCount =
            packages[this.selectedPackageIndex].tableSelection.length;
          if (newTableCount > currentTableCount) {
            packages[this.selectedPackageIndex].tableSelection.push({
              isSelected: false,
              selectedSlot: "",
              selectedAK: "",
            });
          } else if (newTableCount < currentTableCount) {
            packages[this.selectedPackageIndex].tableSelection.pop();
          }
        } else if (packages[this.selectedPackageIndex].card.is_membership) {
          let newCounter = data.data;
          let changedAgeType = this.detectAgeTypeChange(oldCounter, newCounter);
          if (changedAgeType) {
            let assignedUsers = this.$deepCloneArray(
              packages[this.selectedPackageIndex].assignedUsers
            );
            if (newCounter[changedAgeType] > oldCounter[changedAgeType]) {
              assignedUsers = this.addMembershipByAgeType(
                assignedUsers,
                changedAgeType,
                packages[this.selectedPackageIndex].tickets[0].minimum_age,
                newCounter[changedAgeType]
              );
            } else {
              assignedUsers = this.removeLastMembershipByAgeType(
                assignedUsers,
                changedAgeType
              );
            }
            packages[this.selectedPackageIndex].assignedUsers = assignedUsers;
          }
        }
        //
        this.packages = packages;
      }
      this.changeEvt.guest = !this.changeEvt.guest;
      this.isThereAChange = true;
    },
    addMembershipByAgeType(
      assignedUsers,
      changedAgeType,
      minimum_age,
      counter
    ) {
      let temp = this.$deepCloneArray(assignedUsers);
      temp.push({
        // id: ``,
        id: `membership-${changedAgeType}-${counter}`,
        assignedUser: null, //no sub account is selected yet.
        minimumUserAge: minimum_age,
        ageType: changedAgeType,
      });
      return temp;
    },
    removeLastMembershipByAgeType(assignedUsers, changedAgeType) {
      let temp = this.$deepCloneArray(assignedUsers);
      let index = this.getLastIndexOfMembershipByAgeType(
        assignedUsers,
        changedAgeType
      );
      temp = this.$repositories.removeIndexFromArray(temp, index);
      return temp;
    },
    getLastIndexOfMembershipByAgeType(assignedUsers, changedAgeType) {
      return assignedUsers.map((el) => el.ageType).lastIndexOf(changedAgeType);
    },
    detectAgeTypeChange(oldData, newData) {
      for (const ageType in newData) {
        if (newData[ageType] != oldData[ageType]) return ageType;
      }
      return false;
    },
    addAgeType(ageType) {
      let packages = this.$deepCloneArray(this.packages);
      packages[this.selectedPackageIndex].people[ageType].push({
        id: "",
        isSelected: false,
        selectedAK: "",
        selectedSlot: "",
      });
      this.packages = packages;
    },
    async validateCheckbasket() {
      let result = await this.$repositories.checkBasket(this.prepareSavePayload);
      return result.lineItems;
    },
    removeAgeTypeEmitHandler(ageType, index) {
      let packages = this.$deepCloneArray(this.packages);
      let packageAgeType = packages[this.selectedPackageIndex].people[ageType];
      packageAgeType = this.$repositories.removeIndexFromArray(packageAgeType, index);
      packages[this.selectedPackageIndex].people[ageType] = packageAgeType;
      this.packages = packages;
      this.isThereAChange = true;
    },
    selectionChangeCinemaEmitHandler(data) {
      let packages = this.$deepCloneArray(this.packages);
      packages[this.selectedPackageIndex].guestSelection = data;
      this.packages = packages;
      this.isThereAChange = true;
    },
    selectionChangeEmiterLast(data) {
      let packages = this.$deepCloneArray(this.packages);
      if (
        packages[this.selectedPackageIndex].people[data.ageType][data.lastIndex]
          .id
      ) {
        this.$showToast({
          type: "orange",
          text: `${data.title} for ${data.ageType} ${
            data.lastIndex + 1
          } ${this.$t('BOOKINGFLOW_PAGE.IS_UNAVAILABLE_ON_THE_NEW_DATE')}`,
        });
      }
      packages[this.selectedPackageIndex].people[data.ageType][data.lastIndex] =
        {
          id: "",
          ak: "",
          isSelected: false,
          selectedSlot: "",
        };
      this.packages = packages;
      this.isThereAChange = true;
    },
    selectionChangeEmitHandler(data) {
      let packages = this.$deepCloneArray(this.packages);
      packages[this.selectedPackageIndex].people[data.guest.ageType][
        data.guest.ageTypeIndex
        ] = data.data;
      this.packages = packages;
      this.isThereAChange = true;
    },
    mainSelectionChangeEmitHandler(ageType) {
      let packages = this.$deepCloneArray(this.packages);
      for (
        let index = 1;
        index < packages[this.selectedPackageIndex].people[ageType].length;
        index++
      ) {
        packages[this.selectedPackageIndex].people[ageType][index] =
          packages[this.selectedPackageIndex].people[ageType][
            this.selectedPackageIndex
            ];
      }
      this.packages = packages;
      this.isThereAChange = true;
    },
    formatDate(date) {
      // 04/13/2022
      let tempDate = this.$stringToDate(date);
      let day = tempDate.getDate();
      let dayLeadingZero = day >= 1 && day <= 9 ? `0${day}` : day;
      let month = tempDate.getMonth() + 1;
      let monthLeadingZero = month >= 1 && month <= 9 ? `0${month}` : month;
      let year = tempDate.getFullYear();
      let dateText = `${monthLeadingZero}/${dayLeadingZero}/${year}`;
      return dateText;
    },
    async getBookingData(data, isLastCard) {
      // add social distance ak and enable/disable the flag..
      try {
        let date =
          data.selection.date ||
          this.getSelectedDate() ||
          this.$getNextDayDate();

        if (this.$isPastDate(date)) date = this.$getNextDayDate();

        // TODO: get lang based on user selection & timezone based on user timezone.
        const result = await this.$axios.post(`/api/Booking/GetBookingData`, {
          CardId: data.cardID,
          Date: this.formatDate(date),
          Lang: this.$i18n.localeProperties.detectedLang || "en",
          TimeZone: this.siteConfig.timezone,
          IsSkiSchool: this.isSkiType(data),
        });
        if (result.data.Result) {
          let packageData = {};
          if (this.isSkiType(data)) {
            packageData = result.data.Result.ski_School;
            packageData["cardType"] = "lessons";
          } else {
            packageData = result.data.Result.passes
              ? result.data.Result.passes
              : result.data.Result.packges;
            packageData["cardType"] =
              result.data.Result.passes || result.data.Result.events
                ? "passes"
                : "packages";
          }

          packageData = this.getVivaDetails(packageData);
          packageData["isAddOnsEnabled"] = this.isThereAddOns(
            packageData.add_ons
          );


          packageData = this.ticketsRequiredAndTimebasedCheck(packageData);
          packageData = this.setSelection(packageData, data.selection);
          packageData.localizedTitle = packageData.card.localized_title
          this.packages.push(packageData);
          this.isPackagesATimeBased();
        } else {
          // To do
          // remove card id from store when error happens,
          // very rare case, will handle it next on.
        }
        if (isLastCard) {
          if (this.packages.length > 0) {
            this.routeIfNotInCorrectPage();
            this.setSelectedPackageFromStore();
            this.staticLabels = this.$store.state.appConfig.bookingMessages;
            this.isDataReady = true;
          } else {
            this.redirectWhenNoSelection();
          }
        }
      } catch (err) {
        console.log({err});
      }
    },
    ticketsRequiredAndTimebasedCheck(packageData) {
      for (let index = 0; index < packageData.tickets.length; index++) {
        let eventAK = !this.$isEmptyObject(packageData.BonusTicketViewModel) ? packageData.BonusTicketViewModel.event_ak : !this.$isEmptyObject(packageData.bonus_ticket) ? packageData.bonus_ticket.event_ak : "";
        let akEventType = this.$repositories.isTimeBasedEventLocal(packageData.tickets[index].ak_details, eventAK);
        let adultEventType = this.$repositories.isTimeBasedEventLocal(packageData.tickets[index].adult_ak_details, eventAK);
        let juniorEventType = this.$repositories.isTimeBasedEventLocal(packageData.tickets[index].junior_ak_details, eventAK);
        let childEventType = this.$repositories.isTimeBasedEventLocal(packageData.tickets[index].child_ak_details, eventAK);

        packageData.tickets[index]["eventsType"] = {
          adult: adultEventType,
          junior: juniorEventType,
          child: childEventType,
          main: akEventType,
        };
      }
      return packageData;
    },
    getSelectedDate() {
      let bookingBarData = this.$store.state.bookingBar.data;
      let date = this.$getNextDates(new Date());
      if (!this.$isEmptyObject(bookingBarData)) {
        if (bookingBarData.date !== undefined)
          date = bookingBarData.date.selectedDate;
      }
      return date;
    },
    setSelection(packageData, selection = {}) {
      let bookingBarData = this.$store.state.bookingBar.data;
      let guest = {
        adult: 1,
        junior: 0,
        child: 0,
      };
      if (!this.$isEmptyObject(bookingBarData)) {
        guest = {
          adult: ((bookingBarData.people || {}).adult || 1),
          junior: ((bookingBarData.people || {}).junior || 0),
          child: ((bookingBarData.people || {}).child || 0),
        };
      }
      //
      packageData["booking_bar"] = !this.$isEmptyObject(
        selection.booking_bar || {}
      )
        ? selection.booking_bar
        : bookingBarData;

      packageData["booking_bar_experience"] =
        selection.booking_bar_experience ||
        this.$store.state.bookingFlow.tempCard.path ||
        this.$store.state.bookingBar.tempExpercienceData;

      packageData["uniqueID"] =
        selection.uniqueID || `${packageData.card.id}-${this.$getTimeStamp()}`;
      //
      packageData["addOnsSelection"] = selection.addOnsSelection || [];

      packageData["date"] =
        selection.date !== undefined
          ? this.formatDate(selection.date)
          : this.getSelectedDate();

      packageData["dates"] = selection.dates || [];

      if (packageData["date"] === undefined || packageData["date"] === null) {
        packageData["date"] = this.$getNextDayDate();
      }

      if (this.$isPastDate(packageData["date"]))
        packageData["date"] = this.$getNextDayDate();

      if(
        (packageData && packageData.card && packageData.card.every_range_of_booking) &&
        (packageData.card.every_range_of_booking === 1 || packageData.card.every_range_of_booking === 2) &&
        (!packageData["dates"] || packageData["dates"].length == 0)
      ){
        let date = new Date(moment().subtract(1, 'day'));
        packageData["date"] = date;
        packageData["isDateAvailable"] = false;        
        // set booking bar date
        let bookingBarData = this.$deepCloneArray(this.$store.state.bookingBar.data);
        bookingBarData["date"] = {
          "fullDate": "",
          "shortDate": "",
          "selectedDate": date          
        };
        this.$store.commit("bookingBar/setFilterData", bookingBarData);
      } else {
        packageData["isDateAvailable"] = true;
      }

      if (packageData.cardType == "packages") {
        if (!this.$isEmptyObject(selection)) {
          packageData["people"] = selection.people;
        } else {
          packageData["people"] = this.buildPackageGuestObj(guest);
        }
      }
      //
      if (
        packageData.cardType == "passes" ||
        packageData.cardType === "lessons"
      ) {
        packageData["isPassTimebased"] = packageData.card.is_movie
          ? false
          : packageData.tickets[0].eventsType.main.isTimeBased;
        if (!packageData.card.is_movie) {
          if (!this.$isEmptyObject(selection)) {
            packageData["isPassTimebasedSelection"] =
              selection.isPassTimebasedSelection;
          } else {
            packageData["isPassTimebasedSelection"] = {
              isSelected: false,
              selectedAK: "",
              selectedSlot: "",
            };
          }
        }

        if (!this.$isEmptyObject(selection)) {
          packageData["people"] = selection.people;
        } else {
          packageData["people"] = {
            adult: guest.adult,
            junior: guest.junior,
            child: guest.child,
          };
        }
        packageData["cardType"] = packageData.cardType;
      }
      if (packageData.BonusTicketViewModel) {
        if (!this.$isEmptyObject(selection)) {
          packageData["bonusSelection"] = selection.BonusTicketViewModel;
        } else {
          packageData["bonusSelection"] = {
            isSelected: false,
            selectedAK: "",
            selectedSlot: "",
            selectedSlotEnd: ""
          };
        }
      }
      if (packageData.bonus_ticket) {
        if (!this.$isEmptyObject(selection)) {
          packageData["bonus_ticketSelection"] =
            selection.bonus_ticketSelection;
        } else {
          packageData["bonus_ticketSelection"] = {
            isSelected: false,
            selectedAK: "",
            selectedSlot: "",
          };
        }
      }


      if (!this.$isEmptyObject(packageData.upgrade_ticket || {})) {
        if (!this.$isEmptyObject(selection)) {
          packageData["upgradeSelection"] = selection.upgradeSelection;
        } else {
          packageData["upgradeSelection"] = {
            isUpgradeEnabled: false,
            isSelected: false,
            selectedAK: "",
            selectedSlot: "",
          };
        }
      }

      if (packageData.card.is_movie) {
        if (!this.$isEmptyObject(selection)) {
          packageData["guestSelection"] = selection.guestSelection;
        } else {
          packageData["guestSelection"] = {
            title: "",
            ak: "",
            isSelected: false,
            selectedSlot: "",
          };
        }
      }

      if (packageData.card.is_table) {
        if (!this.$isEmptyObject(selection)) {
          packageData["tableSelection"] = selection.tableSelection;
        } else {
          packageData["tableSelection"] = this.buildTable(
            guest,
            packageData.card.max_number_per_table
          );
        }
      }
      //
      if (packageData.card.is_membership) {
        if (!this.$isEmptyObject(selection)) {
          packageData["assignedUsers"] = selection.assignedUsers;
        } else {
          packageData["assignedUsers"] = this.buildAssignGuest(
            guest,
            packageData.tickets[0].minimum_age
          );
        }
      }
      //
      //
      return packageData;
    },
    buildAssignGuest(guest, minimum_age) {
      let temp = [];
      for (const ageType in guest) {
        for (let index = 0; index < guest[ageType]; index++) {
          temp.push({
            id: `membership-${ageType}-${index + 1}`,
            assignedUser: null, //no sub account is selected yet.
            minimumUserAge: minimum_age,
            ageType: ageType,
          });
        }
      }
      return temp;
    },
    buildTable(guest, max_number_per_table) {
      let temp = [];
      let adult = guest.adult;
      let junior = guest.junior;
      let child = guest.child;
      let guestCount = adult + junior + child;
      let tableCount = this.$getTablesCountDependsOnNumberOfGuest(
        guestCount,
        max_number_per_table
      );
      for (let index = 0; index < tableCount; index++) {
        temp.push({
          isSelected: false,
          selectedAK: "",
          selectedSlot: "",
        });
      }
      return temp;
    },
    buildPackageGuestObj(guest) {
      let temp = {
        adult: [],
        junior: [],
        child: [],
      };
      //
      for (const ageType in guest) {
        for (let index = 0; index < guest[ageType]; index++) {
          temp[ageType].push({
            id: "",
            ak: "",
            isSelected: false,
            selectedSlot: "",
          });
        }
      }
      //
      return temp;
    },
    preparePackageFromTemp() {
      let tempCard = this.$store.state.bookingFlow.tempCard;
      // this responsible to add the package only one time.
      if (!this.$isEmptyObject(tempCard)) {
        return {
          cardID: tempCard.id,
          card: tempCard,
          selection: {},
        };
      }
      return {};
    },
    preparePackageFromSavedPackages() {
      let temp = [];
      let bookingData = this.$store.state.bookingFlow.bookingData;
      if (bookingData.length > 0) {
        for (let index = 0; index < bookingData.length; index++) {
          temp.push({
            cardID: bookingData[index].cardID,
            selection: bookingData[index],
          });
        }
      }
      return temp;
    },
    setSelectedPackageFromStore() {
      let tempCard = this.$store.state.bookingFlow.tempCard;
      if (this.$isEmptyObject(tempCard)) {
        this.selectedPackageIndex =
          this.$store.state.bookingFlow.selectedPackageIndex;
      } else {
        let bookingBarData = this.$store.state.bookingBar.data;
        if (!this.$isEmptyObject(bookingBarData)) {
          let bookingBarDate = "";
          //
          if (bookingBarData.date !== undefined)
            bookingBarDate = bookingBarData.date.selectedDate;
          else bookingBarDate = this.getSelectedDate();
          //
          if (this.isPackageDuplicatedWithDifferentDates(tempCard.id)) {
            let suggestedSelectedPackage =
              this.getIndexOfDuplicatedPackageAsProvidedDate(
                tempCard.id,
                bookingBarDate
              );
            this.selectedPackageIndex = suggestedSelectedPackage;
            //  should renew guest data.
          }
        }
      }
    },
    getIndexOfDuplicatedPackageAsProvidedDate(cardID, date) {
      for (let index = 0; index < this.packages.length; index++) {
        if (this.packages[index].card.id == cardID) {
          let packageDate = this.$stringToDate(
            this.packages[index].date
          ).setHours(0, 0, 0, 0);
          let BookingBarDate = this.$stringToDate(date).setHours(0, 0, 0, 0);
          if (packageDate === BookingBarDate) return index;
        }
      }
      return 0;
    },
    isPackageDuplicatedWithDifferentDates(cardID) {
      let counter = 0;
      for (let index = 0; index < this.packages.length; index++) {
        if (this.packages[index].card.id == cardID) counter++;
      }
      return counter > 1;
    },
    IsThereAPackages() {
      let tempCard = this.$store.state.bookingFlow.tempCard;
      let bookingData = this.$store.state.bookingFlow.bookingData;
      return !this.$isEmptyObject(tempCard) || bookingData.length > 0;
    },
    async getPackagesData() {
      if (this.IsThereAPackages()) {
        await this.getPaymentConfig();
        let allCards = [];
        let tempCard = this.preparePackageFromTemp();
        let savedCards = this.preparePackageFromSavedPackages();
        if (this.$isEmptyObject(tempCard)) {
          allCards = savedCards;
        } else {
          allCards = [...[tempCard], ...savedCards];
        }
        this.packages = [];
        for (let index = 0; index < allCards.length; index++) {
          await this.getBookingData(
            allCards[index],
            index + 1 == allCards.length
          );
        }
        this.$repositories.beginCheckoutEvent(this.packages)
      } else {
        this.redirectWhenNoSelection();
      }
    },
    getSavedDiscount() {
      this.discount = this.$store.state.bookingFlow.discount;
    },
    getFirstTimeBasedIndex() {
      for (let index = 0; index < this.packages.length; index++) {
        if (this.packages[index].cardType == "packages") {
          return index;
        } else if (this.packages[index].cardType == "passes") {
          if (this.isTimebasedPasses(this.packages[index])) return index;
        } else if (this.packages[index].cardType === "lessons") {
          return index;
        }
      }
      return 0;
    },
    routeIfNotInCorrectPage() {
      this.isThereAChange = false;
      let currentPath = window.location.pathname;
      if (currentPath.indexOf("buy-tickets") !== -1) {
        setTimeout(() => {
          if (!this.isCurrentPackageValid) {
            let isTimeBased = this.isCurrentATimeBased();
            if (isTimeBased) {
              this.$router.push(this.localePath("/booking/add-activity"));
            } else {
              this.$router.push(this.localePath("/booking/personal-details"));
            }
          } else {
            let isTimeBased = this.isCurrentATimeBased();
            if (!isTimeBased) {
              // need to check if added to store
              let isAddedToStore = this.$isPackageAlreadyInStoreByUniqeID(
                this.packages[this.selectedPackageIndex].uniqueID
              );
              if (!isAddedToStore) {
                this.$router.push(this.localePath("/booking/personal-details"));
              }
            }
          }

          if (!this.$isUserAuthenticated()) {
            if (this.isPackagesLoginRequired) {
              this.$router.push(this.localePath("/booking/personal-details"));
            } else if (!this.guestFormIsValid && this.$route.fullPath !== this.localePath("/booking/personal-details")) {
              this.$router.push(this.localePath("/booking/personal-details"));
            }
          }
        });
      } else if (currentPath.indexOf("add-activity") !== -1) {
        if (this.isTimeBased) {
          setTimeout(() => {
            if (this.selectedPackageIndex == -1) {
              let firstTimeBasedIndex = this.getFirstTimeBasedIndex();
              this.selectedPackageIndex = firstTimeBasedIndex;
              // set pacakge selected as first timebased.
            } else {
              if (!this.isCurrentATimeBased()) {
                let firstTimeBasedIndex = this.getFirstTimeBasedIndex();
                this.selectedPackageIndex = firstTimeBasedIndex;
              }
            }
          });
        } else {
          this.$router.push(this.localePath("/booking/personal-details"));
        }
      } else if (currentPath.indexOf("personal-details") !== -1) {
        setTimeout(() => {
          if (!this.isCurrentPackageValid) {
            let isTimeBased = this.isCurrentATimeBased();
            if (isTimeBased) {
              this.$router.push(this.localePath("/booking/add-activity"));
            }
          }
        });
      } else if (currentPath.indexOf("add-ons") !== -1) {
        setTimeout(() => {
          if (this.selectedPackageIndex == -1) {
            this.selectedPackageIndex = 0;
          }
          if (this.selectedPackageIndex === undefined) return false;
          if (this.packages[this.selectedPackageIndex] === undefined)
            return false;
          if (!this.packages[this.selectedPackageIndex].isAddOnsEnabled) {
            this.$router.push(this.localePath("/booking/personal-details"));
          }
          //
          if (!this.isCurrentPackageValid) {
            let isTimeBased = this.isCurrentATimeBased();
            if (isTimeBased) {
              this.$router.push(this.localePath("/booking/add-activity"));
            } else {
              if(!this.packages[this.selectedPackageIndex].isAddOnsEnabled) this.$router.push(this.localePath("/booking/personal-details"));
            }
          }
        });
      }
    },
    isSkiType(data) {
      if (data.card) {
        if (data.card.cardType === "lessons") {
          return data.card.cardType === "lessons";
        }
      } else if (data.cardType && data.cardType === "lessons") {
        return data.cardType === "lessons";
      } else if (data.selection) {
        return data.selection.cardType === "lessons";
      }

      return false;
    },
    isMemberShipType(data) {
      if (data.card) {
        if (data.card.cardType === "membership") {
          return data.card.cardType === "membership";
        }
      } else if (data.cardType && data.cardType === "membership") {
        return data.cardType === "membership";
      } else if (data.selection) {
        return data.selection.cardType === "membership";
      }

      return false;
    },
    validateVivaProducts() {
      if (this.vivaProducts) {
        if (!this.vivaProducts.length) {
          CommonEvent.$emit("global-loader", false);
          this.$router.push(this.localePath("/passes-packages/explore"));
        }
      }
    },
    async getPaymentConfig() {
      try {
        const result = await this.$axios.get(endPoints.GET_PAYMENT_DETAILS);
        if (result && result.data && result.data.Success && result.data.Result) this.paymentConfig = result.data.Result;
      } catch (err) {
        console.log({err});
      }
    },
    isDataReadyFromAPI() {
      this.isDataReadyInCheckbasket = true;
    },
    cancelUpgradeTicketHandler(e) {
      let packages = this.$deepCloneArray(this.packages);
      packages[this.selectedPackageIndex].upgradeSelection = {
        isUpgradeEnabled: false,
        isSelected: false,
        selectedAK: "",
        selectedSlot: "",
      };
      this.packages = packages;
    },
    upgradeTicketsHandler(e) {
      let packages = this.$deepCloneArray(this.packages);

      if ((packages[this.selectedPackageIndex] || {}).upgradeSelection)
        packages[this.selectedPackageIndex].upgradeSelection.isUpgradeEnabled = true;
      this.packages = packages;
    },
    gtmAddRemoveItem(item, type = 'add_to_cart') {
      this.$sendGtmEvent({ecommerce: null});
      const gtmRequest = {
        event: "ecom_event",
        event_category: "ecommerce",
        event_action: type,
        event_label: null,
        event_non_interaction: false,
        ecommerce: {
          items: [item],
        },
      };
      this.$sendGtmEvent(gtmRequest);
    },
  }
};
</script>

<style lang="scss" scoped>
@import "./booking/booking.scss";
</style>
