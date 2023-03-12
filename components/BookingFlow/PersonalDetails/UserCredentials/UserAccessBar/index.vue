<template>
  <div
    class="user-access-bar-container"
    :class="[roundTopBorders ? 'rounded-t-3xl' : 'rounded-b-3xl']"
  >
    <label class="booking-label">
      {{
        isGuest
          ? (staticLabels.continue_as_guest || {}).user_access_bar_text ||
            $t("BOOKINGFLOW_PAGE.BOOK_AND_MANAGE_TICKETS_EASIER")
          : (staticLabels.continue_as_user || {}).user_access_bar_text ||
            $t("BOOKINGFLOW_PAGE.BOOK_AND_MANAGE_TICKETS_EASIER")
      }}
    </label>

    <div class="access-btns-container">
      <button class="create-account-btn" @click="onSignInBtnClick(true)">
        {{ $t("BOOKINGFLOW_PAGE.CREATE_ACCOUNT") }}
      </button>
      <BaseButton
        :text="$t('BOOKINGFLOW_PAGE.SING_IN')"
        btn-type="button"
        @onBtnClick="onSignInBtnClick"
      />
    </div>
  </div>
</template>

<script>
import {CommonEvent} from "@/services/app-events";

export default {
  props: {
    roundTopBorders: {
      type: Boolean,
      default: true,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    staticLabels: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    async onSignInBtnClick(routingToRegisterPage = false) {
      CommonEvent.$emit("show-screen-loader", true);
      this.$lastRouteHandler(this.$route.fullPath);
      this.$auth.ctx.$auth.strategies.auth0.options.clientId = this.$getMpassClientId();
      const {containsShare, countryDetails} = this.$getSiteConfig();

      await this.$auth.loginWith("auth0", {
        params: {
          routeTo: routingToRegisterPage ? "sp" : "",
          lang: this.$i18n.localeProperties.detectedLang,
          share_tc: containsShare, // yes or no,
          country: countryDetails.iso3 // iso3 code
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./UserAccessBar.scss";
</style>
