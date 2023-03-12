<template>
  <div class="side-summary">
    <div class="ticket-summary-container">
      <CardContainer
        v-for="(packageDetails, index) in packages"
        :key="`package-details-tickets-${index}`"
        class="mb-4"
      >
        <template #card-content>
          <Tickets
            :is-full-page-loader-enabled="isFullPageLoaderEnabled"
            :package-details="packageDetails"
            :selected-package-i-d="selectedPackageID"
            :get-selected-package-date="getSelectedPackageDate"
            :current-step="currentStep"
            :static-labels="staticLabels"
            @guestChangeEmiter="guestChangeEmitHandler"
            @dateChangeEmiter="dateChangeEmitHandler"
            @changePackageEmiter="changePackageEmitHandler($event, index)"
            @removePackageEmiter="removePackageEmiterHandler($event, index)"
            @editAddOnsEmiter="editAddOnsEmitHandler($event, index)"
            @dateLoaderEmiter="dateLoaderEmiter"
            @datesChangeEmiter="datesChangeEmiter"
          />
        </template>
      </CardContainer>
    </div>

    <BookingRecieptSummary 
      v-if="!isAddActivitySpecialView"
      :total-amount="totalAmount"
      :total-amount-with-discount="totalAmountWithDiscount"
      :discount="discount"
      :share="share"
      :amount="amount"
      :payment-config="paymentConfig"
      @continueShoppingEmmiter="continueShoppingEmitHandler"
    />
  </div>
</template>

<script>
import Tickets from "@/components/BookingFlow/Tickets";
import BookingRecieptSummary from "@/components/BookingFlow/BookingRecieptSummary";

export default {
  name: "PackagesContainer",
  components: {
    Tickets,
    BookingRecieptSummary
  },
  props: {
    packages: {
      type: Array,
      default: () => [],
    },
    selectedPackageID: {
      type: String,
      default: "",
    },
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
    currentStep: {
      type: String,
      default: "",
    },
    staticLabels: {
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
    getSelectedPackageDate: {
      type: String,
      default: "",
    },
    paymentConfig: {
      type: Object,
      default: () => ({}),
    },    
    isAddActivitySpecialView: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    datesChangeEmiter(data) {
      this.$emit("datesChangeEmiter", data);
    },
    dateLoaderEmiter(data) {
      this.$emit("dateLoaderEmiter", data);
    },
    continueShoppingEmitHandler(event) {
      this.$emit("continueShoppingEmmiter");
    },
    editAddOnsEmitHandler(event, index) {
      this.$emit("editAddOnsEmiter", index);
    },
    guestChangeEmitHandler(data) {
      this.$emit("guestChangeEmiter", data);
    },
    dateChangeEmitHandler(data) {
      this.$emit("dateChangeEmiter", data);
    },
    changePackageEmitHandler(data, index) {
      this.$emit("changePackageEmiter", index);
    },
    removePackageEmiterHandler(data, index) {
      this.$emit("removePackageEmiter", index);
    },
  },
};
</script>
<style lang="scss">
@import "./PackagesContainer.scss";
</style>
