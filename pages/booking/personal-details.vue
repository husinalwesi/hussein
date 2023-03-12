<template>
  <section>
    <component
      :is="component"
      :is-login-required="isLoginRequired"
      :is-full-page-loader-enabled="isFullPageLoaderEnabled"
      :static-labels="staticLabels"
      :is-membership-ticket="isMembershipTicket"
      :site-default-mobile-details="siteDefaultMobileDetails"
    />
    <template v-if="isMembershipTicket && $isUserAuthenticated()">
      <MembershipTicketsAssigner
        :packages="packages"
        :tickets="packageDetails.assignedUsers"
        :package-details="packageDetails"
        :site-default-mobile-details="siteDefaultMobileDetails"
        @assignUserEmiter="assignUserHandler"
        @updateAssignUserEmiter="updateAssignUserEmiter"
      />
    </template>
  </section>
</template>

<script>
import UserCredentials from "@/components/BookingFlow/PersonalDetails/UserCredentials";
import UserInformation from "@/components/BookingFlow/PersonalDetails/UserInformation";
import MembershipTicketsAssigner from "@/components/BookingFlow/PersonalDetails/Membership";

export default {
  name: "BookingPersonalDetails",
  components: {
    UserCredentials,
    UserInformation,
    MembershipTicketsAssigner,
  },
  props: {
    packageDetails: {
      type: Object,
      default: () => ({}),
    },
    isLoginRequired: {
      type: Boolean,
      default: false,
    },
    isFullPageLoaderEnabled: {
      type: Boolean,
      default: false,
    },
    staticLabels: {
      type: Object,
      default: () => ({}),
    },
    isMembershipTicket: {
      type: Boolean,
      default: false,
    },
    packages: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['assignUserEmiter', 'updateAssignUserEmiter'],
  data() {
    const {iso2, dialCode} = this.$getSiteConfig("countryDetails");

    return {
      token: null,
      component: "UserCredentials",
      siteDefaultMobileDetails: {
        regionCode: iso2,
        countryCode: dialCode,
        significantMobileNumber: ""
      }
    };
  },
  head() {
    return this.$seoGenerator({}, this.$t("PAGES_TITLE.BOOKING.PERSONAL_DETAILS"));
  },
  mounted() {
    if (this.$isUserAuthenticated()) {
      this.component = "UserInformation";
    } else this.component = "UserCredentials";
  },
  methods: {
    assignUserHandler(data) {
      this.$emit("assignUserEmiter", data);
    },
    updateAssignUserEmiter(data) {
      this.$emit("updateAssignUserEmiter", data);
    },
  },
};
</script>
