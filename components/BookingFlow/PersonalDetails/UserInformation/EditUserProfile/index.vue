<template>
  <CardContainer>
    <template #card-content>
      <div class="edit-user-profile-box">
        <!-- <div class="loader-container" v-if="isFullPageLoaderEnabled">
          <snowflake-loader loader-classes="w-24 h-24" />
        </div> -->
        <h2 class="header">
          {{ $t("ACCOUNT_PAGE.PROFILE.TITLE") }}
        </h2>
        <UserForm
          :is-membership-ticket="isMembershipTicket"
          :site-default-mobile-details="siteDefaultMobileDetails"
          @toggleCurrentComponent="$emit('toggleCurrentComponent')"
        />
      </div>
    </template>
  </CardContainer>
</template>

<script>
import UserForm from "./UserForm.vue";

export default {
  components: {
    UserForm,
  },
  props: {
    isFullPageLoaderEnabled: {
      type: Boolean,
      default: false,
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
  emits: ["toggleCurrentComponent"]
};
</script>

<style lang="scss">
@import "./EditUserProfile.scss";
</style>
