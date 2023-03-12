<template>
  <div>
    <ValidationObserver ref="user-form-observer" v-slot="{ invalid }">
      <CredentialsForm
        :form-data="formData"
        :email-is-disabled="true"
        @submitForm="updateUserInfo"
        @selectCountry="selectCountry"
        @updateMobileDetails="updateMobileDetails"
        @setCompleteMobileNumber="setCompleteMobileNumber"
      >
        <div slot="extraFields" class="btns-action">
          <button
            type="button"
            :disabled="isLoading"
            class="btn-cancel"
            @click.prevent="$emit('toggleCurrentComponent')"
          >
            {{ $t("COMMON.CANCEL") }}
          </button>
          <BaseButton
            :text="$t('COMMON.SAVE')"
            btn-type="submit"
            :is-loading="isLoading"
            :b-t-ndisabled="invalid"
          />
        </div>
      </CredentialsForm>
    </ValidationObserver>
  </div>
</template>

<script>
import CredentialsForm from "@/components/Shared/CredentialsForm";

import {customLayerEndPoints} from "@/const/api";
import {CommonEvent} from "@/services/app-events";

import countries from "static/json/countries-list.json";
import {mapGetters} from "vuex";
import {globalHelpers} from "~/plugins/helpers";

/* eslint-disable no-undef */

export default {
  components: { CredentialsForm },
  props: {
    userDetails: { type: Object, default: null },
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
  emits: ["toggleCurrentComponent"],
  data() {
    return {
      formData: {
        firstName: "",
        lastName: "",
        mobileDetails: {
          regionCode: "ae",
          countryCode: "+971",
          significantMobileNumber: "",
        },
        mobile: "",
        email: "",
        country_of_residence: "",
        countryName: "",
      },
      countryNameLang: "",
      isLoading: false,
    };
  },
  computed: { ...mapGetters("currentUser", ["userInformation"]) },
  created() {
    const localeLanguage = this.$i18n.localeProperties.detectedLang;
    this.countryNameLang = localeLanguage === "en" ? "name_en" : "name_ar";
  },
  mounted() {
    if (this.userInformation) {
      this.formData = {
        ...this.userInformation,
        mobileDetails: {...this.userInformation.mobileDetails},
        countryName: this.getCountryName(this.userInformation.country_of_residence)
      };
    } else this.formData.mobileDetails = {...this.siteDefaultMobileDetails};
  },
  methods: {
    async updateUserInfo() {
      try {
        this.isLoading = true;

        const bearerAccessToken = await this.$getToken();

        const res = await this.$axios.patch(
          `${process.env.SHARED_ENVS.MPASS.APIGEE_DOMAIN}/v1/shareapp/updateuser`,
          {
            firstName: this.formData.firstName,
            lastName: this.formData.lastName,
            mobile: this.formData.mobile,
            country_of_residence: this.formData.country_of_residence
          },
          {
            headers: {
              Authorization: bearerAccessToken,
              "Content-Type": "application/json",
              "x-api-key": (this.$store.state.apigeeKeys || {}).mpass,
            },
          }
        );

        if (res.status === 200 && res.data && res.data.result === "0") {
          this.$store.dispatch("currentUser/updateUserInformation", {
            ...this.formData,
            fullName: `${this.formData.firstName} ${this.formData.lastName}`,
            mobileDetails: { ...this.formData.mobileDetails },
          });

          if (this.isMembershipTicket) {
            await this.$auth.refreshTokens();
            CommonEvent.$emit("fetch-users");
          }

          // without await because this API is not important to wait for it.
          this.$axios.post(
            process.env.SHARED_ENVS.APIGEE_BASE_URL +
              customLayerEndPoints.TRIGGER_UPDATE_MAIN_ACCOUNT_INFO,
            {isIgnoreCachedToken: !this.isMembershipTicket}
          );

          this.$emit("toggleCurrentComponent");
        } else
          this.$showToast({
            type: "red",
            text: this.$t("COMMON.ERROR_MESSAGES.ERROR_OCCURRED"),
          });

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$showToast({
          type: "red",
          text: this.$t("COMMON.ERROR_MESSAGES.ERROR_OCCURRED"),
        });
        console.log({ err });
      }
    },
    selectCountry(country) {
      this.formData.country_of_residence = country.iso3;
      this.formData.countryName = country.name;
    },
    setCompleteMobileNumber() {
      this.formData.mobile =
        `${this.formData.mobileDetails.countryCode}${this.formData.mobileDetails.significantMobileNumber}`.replace(
          /\s/g,
          ""
        );
    },
    updateMobileDetails(e) {
      this.formData.mobileDetails.regionCode = e.regionCode;
      this.formData.mobileDetails.countryCode = e.countryCode;
      this.setCompleteMobileNumber();
    },
    getCountryName(countryISO3) {
      const country = globalHelpers.getObjFromArrByAttrVal(countries.data, "iso3", countryISO3);
      return (country || {})[this.countryNameLang];
    }
  }
};
</script>
