<template>
  <div class="user-information-container">
    <component
      :is="component"
      v-if="userInformation"
      :user-details="userInformation"
      :is-full-page-loader-enabled="isFullPageLoaderEnabled"
      :static-labels="staticLabels"
      :is-membership-ticket="isMembershipTicket"
      :site-default-mobile-details="siteDefaultMobileDetails"
      @toggleCurrentComponent="toggleCurrentComponent"
    />
  </div>
</template>

<script>
import {mapGetters} from "vuex";

import UserProfile from "./UserProfile";
import EditUserProfile from "./EditUserProfile";

export default {
  components: { UserProfile, EditUserProfile },
  props: {
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
    siteDefaultMobileDetails: {
      type: Object,
      default: () => ({
        regionCode: "ae",
        countryCode: "+971",
        significantMobileNumber: ""
      })
    }
  },
  data() {
    return { component: "UserProfile" };
  },
  computed: { ...mapGetters("currentUser", ["userInformation"]) },
  methods: {
    toggleCurrentComponent() {
      if (this.component === "UserProfile") this.component = "EditUserProfile";
      else this.component = "UserProfile";
    }
  }
};
</script>
