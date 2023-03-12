<template>
  <div class="user-profile-container">
    <div class="flex flex-col">
      <div class="flex justify-between gap-2 flex-wrap items-center">
        <h1 class="title">
          {{ $t("ACCOUNT_PAGE.PROFILE.TITLE") }}
        </h1>
        <button class="btn-change" @click="$emit('toggleCurrentComponent')">
          {{ $t("COMMON.CHANGE") }}
        </button>
      </div>
      <p class="description">
        {{ description }}
      </p>
    </div>

    <div class="user-details-list">
      <div
        v-for="[key, value] of Object.entries(userDetailsTableKeys)"
        :key="key"
        class="row"
        :class="{'row-hidden': key === 'password' && userDetails.parent_user_id}"
      >
        <div class="name">
          {{ value }}
        </div>
        <div
          class="value"
          :class="{ 'opacity-50': key === 'email' || !userDetails[key],'number-input': key==='mobile'}"
        >
          {{
            key === "password"
              ? $passwordStarsReplacer(userDetails[key])
              : key === "dateOfBirth"
                ? $dateFormatter(userDetails[key])
                : (key === "nationalityCountryName" || key === "countryName") &&
                  !userDetails.parent_user_id
                  ? getCountryName(
                    key === "nationalityCountryName"
                      ? "nationality"
                      : "country_of_residence"
                  )
                  : userDetails[key]
                    ? userDetails[key]
                    : `${$t('COMMON.ERROR_MESSAGES.DATA_ERROR')} ${value}`
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {globalHelpers} from "@/plugins/helpers";
import countries from "static/json/countries-list.json";

export default {
  props: {
    userDetails: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["toggleCurrentComponent"],
  data() {
    return {
      currentUserId: "1",
      userDetailsTableKeys: {
        firstName: this.$t("CREDENTIALS_FORM.FIELDS.FIRST_NAME"),
        lastName: this.$t("CREDENTIALS_FORM.FIELDS.LAST_NAME"),
        dateOfBirth: this.$t("CREDENTIALS_FORM.FIELDS.DATE_OF_BIRTH"),
        email: this.$t("CREDENTIALS_FORM.FIELDS.EMAIL"),
        mobile: this.$t("CREDENTIALS_FORM.FIELDS.MOBILE_NUMBER"),
        nationalityCountryName: this.$t("CREDENTIALS_FORM.FIELDS.NATIONALITY"),
        countryName: this.$t("CREDENTIALS_FORM.FIELDS.COUNTRY_OF_RESIDENCE"),
        password: this.$t("CREDENTIALS_FORM.FIELDS.PASSWORD")
      },
      description: {},
      countryNameLang: ''
    };
  },
  created() {
    const currentEnv = this.$getSiteCurrentEnvironment(false, true);
    const currentEnvText = this.$t(`LOCATIONS.${currentEnv}`);
    this.description = `${this.$t("ACCOUNT_PAGE.PROFILE.DESCRIPTION", {location: currentEnvText})}.`;
    this.countryNameLang = this.$i18n.localeProperties.detectedLang === 'en' ? 'name_en' : 'name_ar';
  },
  methods: {
    removeUserAccount() {
      console.log("removeUserAccount");
    },
    getCountryName(type) {
      let countryISO3 = null;
      if (type === "country_of_residence")
        countryISO3 = this.userDetails["country_of_residence"] || this.userDetails["countryName"];
      else
        countryISO3 = this.userDetails["nationality"] || this.userDetails["nationalityCountryName"];

      if (!countryISO3) countryISO3 = "ARE"; // default value United Arab Emirates ISO3 code.
      else if ((countryISO3 || "").toUpperCase() === "UAE") countryISO3 = "ARE";

      return countryISO3
        ? (globalHelpers.getObjFromArrByAttrVal(countries.data, "iso3", countryISO3) || {})[this.countryNameLang]
        : `${this.$t('COMMON.ERROR_MESSAGES.DATA_ERROR')} ${this.userDetailsTableKeys[type === "country_of_residence" ? "countryName" : "nationalityCountryName"]}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./UserProfile.scss";
</style>
