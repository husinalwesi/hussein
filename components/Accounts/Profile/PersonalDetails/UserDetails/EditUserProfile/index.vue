<template>
  <div class="user-details-form-container">
    <h1 class="title">
      {{ $t("ACCOUNT_PAGE.PROFILE.TITLE") }}
    </h1>
    <ValidationObserver
      v-if="formData"
      ref="user-form-observer"
      v-slot="{ invalid }"
    >
      <CredentialsForm
        :form-data="formData"
        :email-is-disabled="userDetails && !userDetails.parent_user_id"
        :show-nationality-list="true"
        :show-title-selector="true"
        :show-date-popup="true"
        :show-date-input-title="false"
        :show-password-field="addNewUser ? false : !userDetails.parent_user_id"
        :is-date-picker-old-days-disabled="false"
        :extra-date-rules="{
          dateOfBirthValidity: {
            date:
              addNewUser || (userDetails && userDetails.parent_user_id)
                ? 2
                : 10,
          },
        }"
        :is-reset-password-loading="isResetPasswordLoading"
        @onResetPasswordClick="resetUserPassword"
        @submitForm="saveUserInfo()"
        @selectDate="selectDate"
        @selectNationality="selectNationality"
        @updateMobileDetails="updateMobileDetails"
        @setCompleteMobileNumber="setCompleteMobileNumber"
        @selectCountry="selectCountry"
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
            :b-t-ndisabled="invalid || isLoading"
          />
        </div>
      </CredentialsForm>
    </ValidationObserver>
  </div>
</template>

<script>
import CredentialsForm from "@/components/Shared/CredentialsForm";

import {customLayerEndPoints} from "@/const/api";

/* eslint-disable no-undef */

export default {
  components: {CredentialsForm},
  props: {
    userDetails: { type: Object, default: null },
    addNewUser: { type: Boolean, default: false },
    usersList: { type: Array, default: () => [] },
    siteDefaultMobileDetails: {
      type: Object,
      default: () => ({
        regionCode: "ae",
        countryCode: "+971",
        significantMobileNumber: ""
      })
    }
  },
  emits: ['toggleCurrentComponent'],
  data() {
    return {
      isLoading: false,
      isResetPasswordLoading: false,
      formData: {
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        email: "",
        mobileDetails: {
          regionCode: "ae",
          countryCode: "+971",
          significantMobileNumber: "",
        },
        mobile: "",
        nationality: "",
        gender: "",
        country_of_residence: "",
        title: "",
        password: "",
        countryName: "",
        nationalityCountryName: "",
      },
    };
  },
  mounted() {
    if (this.userDetails) {
      this.formData = {
        ...this.userDetails,
        mobileDetails: { ...this.userDetails.mobileDetails }
      };
    } else this.formData.mobileDetails = {...this.siteDefaultMobileDetails};
  },
  methods: {
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
    selectDate({ selectedDate }) {
      this.formData.dateOfBirth = selectedDate + "";
    },
    selectNationality(country) {
      this.formData.nationality = country.iso3;
      this.formData.nationalityCountryName = country.name;
    },
    async saveUserInfo() {
      this.$refs["user-form-observer"].validate().then((res) => {
        if (res) {
          if (this.addNewUser) this.createNewSubAccount();
          else {
            if (!this.formData.parent_user_id) this.updatePrimaryAccount();
            else this.updateSubAccount();
          }
        }
      });
    },
    async updatePrimaryAccount() {
      //TODO: get back here.
      try {
        this.isLoading = true;

        const bearerAccessToken = await this.$getToken()

        const res = await this.$axios.patch(
          `${process.env.SHARED_ENVS.MPASS.APIGEE_DOMAIN}/v1/shareapp/updateuser`,
          {
            firstName: this.formData.firstName,
            lastName: this.formData.lastName,
            mobile: this.formData.mobile,
            country_of_residence: this.formData.country_of_residence,
            dateOfBirth: this.$dateFormatter(this.formData.dateOfBirth, 'dayMonthYear', false, "YYYY-MM-DD"),
            title: this.formData.title,
            nationality: this.formData.nationality
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
            data: {
              firstName: this.formData.firstName,
              lastName: this.formData.lastName,
              mobile: this.formData.mobile,
              country_of_residence: this.formData.country_of_residence,
              dateOfBirth: this.formData.dateOfBirth,
              title: this.formData.title,
              gender: this.formData.title.toLowerCase() === "mr" ? "male" : "female",
              fullName: `${this.formData.firstName} ${this.formData.lastName}`,
              mobileDetails: { ...this.formData.mobileDetails },
              countryName: this.formData.countryName,
              nationalityCountryName: this.formData.nationalityCountryName,
              nationality: this.formData.nationality,
              age: this.$ageHandler(this.formData.dateOfBirth)
            },
            update: true,
          });

          // without await because this API is not important to wait for it.
          this.$axios.post(
            process.env.SHARED_ENVS.APIGEE_BASE_URL +
              customLayerEndPoints.TRIGGER_UPDATE_MAIN_ACCOUNT_INFO,
            {isIgnoreCachedToken:true}
          );

          this.$emit("toggleCurrentComponent", {
            userData: this.formData,
            type: "updatePrimaryAccount",
          });
        } else
          this.$showToast({
            type: "red",
            text: this.$t("COMMON.ERROR_MESSAGES.ERROR_OCCURRED")
          });

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$showToast({
          type: "red",
          text: this.$t("COMMON.ERROR_MESSAGES.ERROR_OCCURRED")
        });
        console.log({err});
      }
    },
    async createNewSubAccount() {
      try {
        // TODO: enhance this.
        this.isLoading = true;

        const userDetails = {
          email: this.$store.getters["currentUser/userInformation"].email,
          sub_user_ak: null,
          sub_user_account_type: 1,
          firstName: this.formData.firstName,
          lastName: this.formData.lastName,
          new_sub_user: true,
          dateOfBirth: this.$dateFormatter(this.formData.dateOfBirth, 'dayMonthYear', false, "YYYY-MM-DD"),
          ski_level_type: "personal",
          ski_level: 0,
          waiver: "No",
          country_of_residence: this.formData.country_of_residence,
          nationality: this.formData.nationality,
          sub_email: this.formData.email,
          mobile: this.formData.mobile,
          title: this.formData.title,
          image: "",
        };

        const { data: res } = await this.$axios.post(
          process.env.SHARED_ENVS.APIGEE_BASE_URL +
            customLayerEndPoints.POST_CREATE_NEW_SUB_ACCOUNT,
          userDetails,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res && res.body && res.statusCode)
          this.$emit("toggleCurrentComponent", {
            userData: res.body,
            type: "createNewSubAccount",
          });
        else
          this.$showToast({
            type: "red",
            text: this.$t("COMMON.ERROR_MESSAGES.ERROR_OCCURRED")
          });

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$showToast({
          type: "red",
          text: this.$t("COMMON.ERROR_MESSAGES.ERROR_OCCURRED")
        });
        console.log({err});
      }
    },
    async updateSubAccount() {
      try {
        // TODO: enhance this.
        this.isLoading = true;

        const userDetails = {
          title: this.formData.title,
          gender: this.formData.title.toLowerCase() === "mr" ? "male" : "female",
          firstName: this.formData.firstName,
          lastName: this.formData.lastName,
          mobile: this.formData.mobile,
          country_of_residence: this.formData.country_of_residence,
          nationality: this.formData.nationality,
          dateOfBirth: this.$dateFormatter(this.formData.dateOfBirth, 'dayMonthYear', false, "YYYY-MM-DD"),
          email: this.formData.email,
        };

        const { data: res } = await this.$axios.patch(
          process.env.SHARED_ENVS.APIGEE_BASE_URL +
            customLayerEndPoints.UPDATE_SUB_ACCOUNT,
          userDetails,
          {
            headers: {
              "user-ak": this.formData.user_ak,
              "Content-Type": "application/json",
            },
          }
        );

        if (res)
          this.$emit("toggleCurrentComponent", {
            userData: this.formData,
            type: "updateSubAccount",
          });
        else
          this.$showToast({
            type: "red",
            text: this.$t("COMMON.ERROR_MESSAGES.ERROR_OCCURRED")
          });

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$showToast({
          type: "red",
          text: this.$t("COMMON.ERROR_MESSAGES.ERROR_OCCURRED")
        });
        console.log({err});
      }
    },
    async resetUserPassword() {
      try {
        this.isResetPasswordLoading = true;

        const bearerAccessToken = await this.$getToken();

        const clientId = this.$getMpassClientId();
        const {mpassClientName, countryDetails} = this.$getSiteConfig();

        // TODO: enhance this and use the values of the mpass vars from the env file.
        const config = {
          client_name: mpassClientName,
          client_id: clientId,
          country: countryDetails.iso3,
          lang: this.$i18n.localeProperties.detectedLang
        };

        const {data: res} = await this.$axios.post(
          `${process.env.SHARED_ENVS.MPASS.APIGEE_DOMAIN}/mafid/reset-password`,
          config,
          {
            headers: {
              "x-api-key": this.$store.state.apigeeKeys.mpass,
              Authorization: bearerAccessToken
            }
          }
        );

        if (res && res.code === 200) {
          this.$showToast({
            type: "green",
            text: this.$t("ACCOUNT_PAGE.PROFILE.PERSONAL_DETAILS.PASSWORD_RESET_CODE_SENT"),
          });
        } else
          this.$showToast({
            type: "red",
            text: res.message || this.$t("ACCOUNT_PAGE.PROFILE.PERSONAL_DETAILS.RESET_PASSWORD_ERROR_MESSAGES.ERROR_OCCURRED")
          });

        this.isResetPasswordLoading = false;
      } catch (err) {
        this.isResetPasswordLoading = false;
        console.log(err?.response?.data?.message)
        this.$showToast({
          type: "red",
          text:
            err?.response?.data?.message ||
            (err?.response?.data?.code === 429
              ? this.$t("ACCOUNT_PAGE.PROFILE.PERSONAL_DETAILS.RESET_PASSWORD_ERROR_MESSAGES.ATTEMPTS_ERROR")
              : this.$t("ACCOUNT_PAGE.PROFILE.PERSONAL_DETAILS.RESET_PASSWORD_ERROR_MESSAGES.CODE_ERROR"))
        });
        console.log({err});
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./EditUserProfile.scss";
</style>
