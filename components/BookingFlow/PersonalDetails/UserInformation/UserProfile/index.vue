<template>
  <CardContainer>
    <template #card-content>
      <div class="user-profile-container">
        <div v-if="isFullPageLoaderEnabled" class="loader-container">
          <CircleLoader />
        </div>
        <div class="user-general-details-container">
          <div
            class="user-img-container"
            :style="{
              backgroundImage: `url(${require(`@/assets/images/Shared/user-gender/${userDetails.gender}.webp`)})`,
            }"
          />
          <div
            class="
              flex flex-1 flex-col
              min-700:border-b-1
              min-700:border-dark-gray
              min-700:border-dashed
              min-700:border-opacity-20
              min-700:pb-4
            "
          >
            <h3 class="user-name">
              {{ userDetails.fullName }}
            </h3>
            <span class="user-age">{{ $pluralTextHandler(userDetails.age, "years") }}</span>
          </div>
        </div>

        <div class="user-contact-details-container">
          <div class="flex flex-col">
            <p class="number-input">
              {{ userDetails.mobile }}
            </p>
            <p>{{ userDetails.email }}</p>
            <p>
              {{
                `${$t("CREDENTIALS_FORM.RESIDENT", {
                  countryName: getCountryName(userDetails.country_of_residence)
                })}`
              }}
            </p>
          </div>
          <div class="edit-profile-btn-wrapper">
            <BaseButton
              :text="$t('CREDENTIALS_FORM.EDIT_PROFILE')"
              btn-type="button"
              @onBtnClick="$emit('toggleCurrentComponent')"
            />
          </div>
        </div>
      </div>
    </template>
  </CardContainer>
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
    isFullPageLoaderEnabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["toggleCurrentComponent"],
  data() {
    return {
      currentLang: "en",
      countryNameLang: ""
    };
  },
  created() {
    const localeLanguage = this.$i18n.localeProperties.detectedLang;
    this.currentLang = localeLanguage;
    this.countryNameLang = localeLanguage === "en" ? "name_en" : "name_ar";
  },
  methods: {
    getCountryName(countryISO3) {
      if (this.currentLang === "en") {
        return countryISO3.toLowerCase() === "are" ? "UAE" : countryISO3;
      }

      return (globalHelpers.getObjFromArrByAttrVal(countries.data, "iso3", countryISO3) || {})[this.countryNameLang];
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./UserProfile.scss";
</style>
