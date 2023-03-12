<template>
  <div class="sub-account-form-modal">
    <BaseModal
      :show-modal="isModalActive"
      :is-close-button-disabled="isLoading"
      :content-wrapper-classes="'mt-4 relative'"
      @closeModal="onModalCloseBtnClick"
    >
      <template #header>
        <h3 class="modal-title">
          {{ isUpdateAction ? $t('BOOKINGFLOW_PAGE.COMPLETE_MEMBER_DETAILS') : $t('BOOKINGFLOW_PAGE.ADD_NEW_GUEST') }}
        </h3>
        <div class="description-wrapper">
          <p class="description">
            {{ $t('BOOKINGFLOW_PAGE.SEND_THE_WAIVER_FORM_TO_YOUR_NEW_GUEST_FORM') }}
          </p>
        </div>
      </template>

      <template #content>
        <ValidationObserver
          ref="user-sub-account-form-observer"
          v-slot="{ invalid, errors }"
        >
          <CredentialsForm
            :form-data="formData"
            form-wrapper-classes="mt-6"
            :email-is-disabled="isEmailFieldDisabled"
            :show-title-selector="true"
            :show-date-popup="true"
            :is-date-picker-old-days-disabled="false"
            :extra-date-rules="{
              dateOfBirthValidity: {
                date: minimumUserAge,
              },
            }"
            :is-full-width-fields="true"
            :base-date-placeholder="$t('CREDENTIALS_FORM.DD_MM_YYYY')"
            @submitForm="saveSubAccountInfo(invalid, errors)"
            @selectDate="selectDate"
            @updateMobileDetails="updateMobileDetails"
            @setCompleteMobileNumber="setCompleteMobileNumber"
            @selectCountry="selectCountry"
          >
            <div slot="extraFields">
              <BaseUpload
                :saved-image="savedImage"
                @setUploadedImage="setUserImage($event)"
                @deleteUploadedImage="onUserImageDelete"
              />

              <BaseCheckbox
                id="bookingInfoCheckbox"
                v-model="formData.isBookingInformaionChecked"
                :i-n-pname="$t('BOOKINGFLOW_PAGE.BOOKING_INFORMATION')"
                :label="$t('BOOKINGFLOW_PAGE.I_HAVE_READ_AND_AGREE')"
                :underlined-text="$t('BOOKINGFLOW_PAGE.IMPORTANT_BOOKING_INFORMATION')"
                checkbox-wrapper-classes="mt-6 min-700:mt-8"
                classes="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-dark-gray"
                underlined-text-classes="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold "
                :rules="{ checkboxReq: true }"
                @onUnderlineTextClick="isBookingInformationModalActive = true"
              />
              <BaseCheckbox
                id="termsConditsCheckbox"
                v-model="formData.isTermsAndConditionsChecked"
                :label="$t('BOOKINGFLOW_PAGE.I_HAVE_READ_AND_ACCEPT')"
                :i-n-pname="$t('BOOKINGFLOW_PAGE.TERMS_AND_CONDITIONS')"
                :underlined-text="$t('BOOKINGFLOW_PAGE.TERMS_AND_CONDITIONS_SIGN')"
                checkbox-wrapper-classes="mt-4 min-700:mt-6"
                classes="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-dark-gray"
                underlined-text-classes="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold "
                :rules="{ checkboxReq: true }"
                @onUnderlineTextClick="isTermsConditionsModalActive = true"
              />
              <div class="divider-dashed my-6" />
              <div class="flex justify-end items-start">
                <BaseButton
                  :text="$t('COMMON.SAVE')"
                  btn-type="submit"
                  class-name="btn-submit"
                  :b-t-ndisabled="isFormEmpty || isLoading || isImageNotValid"
                />
              </div>
            </div>
          </CredentialsForm>
        </ValidationObserver>

        <template v-if="isLoading">
          <snowflake-loader
            loader-wrapper-classes="absolute bg-[#ffffffcb] h-full rounded-3xl z-10 inset-0"
            loader-classes="w-10 h-10"
          />
        </template>
      </template>
    </BaseModal>

    <div class="modals-container">
      <BookingInformationModal
        :show-modal="isBookingInformationModalActive"
        @closeModal="isBookingInformationModalActive = false"
      />
      <TermsConditionsModal
        :show-modal="isTermsConditionsModalActive"
        @closeModal="isTermsConditionsModalActive = false"
      />
    </div>
  </div>
</template>

<script>
import CredentialsForm from "@/components/Shared/CredentialsForm";
import BaseUpload from "@/components/Shared/BaseUI/BaseUpload/index.vue";

import BookingInformationModal
  from "@/components/BookingFlow/PersonalDetails/UserCredentials/Guest/Modals/BookingInformationModal.vue";
import TermsConditionsModal
  from "@/components/BookingFlow/PersonalDetails/UserCredentials/Guest/Modals/TermsConditionsModal.vue";
import {customLayerEndPoints} from "@/const/api";

/* eslint-disable no-undef */

const formDefaultValues = {
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
  country_of_residence: "",
  title: "",
  countryName: "",
  isBookingInformaionChecked: false,
  isTermsAndConditionsChecked: false,
};

// TODO: Modify this component when we have time.

export default {
  components: {
    CredentialsForm,
    BaseUpload,
    BookingInformationModal,
    TermsConditionsModal,
  },
  props: {
    minimumUserAge: {
      type: Number,
      default: 1,
    },
    isModalActive: {
      type: Boolean,
      default: false,
    },
    selectedUserData: {
      type: Object,
      default: null,
    },
    isUpdateAction: {
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
  emits: ["closeModal", "updateUsersList"],
  data() {
    return {
      isLoading: false,
      formData: {
        ...formDefaultValues,
        mobileDetails: {...formDefaultValues.mobileDetails},
      },
      isEmailFieldDisabled: false,
      isUserImageAdded: false,
      isBookingInformationModalActive: false,
      isTermsConditionsModalActive: false,
    };
  },
  computed: {
    isImageNotValid() {
      return (
        (!this.isUpdateAction && !this.isUserImageAdded) ||
        (this.isUpdateAction && !this.savedImage && !this.isUserImageAdded)
      );
    },
    savedImage() {
      return !this.$isEmptyObject(this.selectedUserData || {}) &&
      this.isUpdateAction
        ? this.selectedUserData.profile_image
        : "";
    },
    isFormEmpty() {
      for (var key in formDefaultValues) {
        if (
          this.formData[key] === null ||
          this.formData[key] === "" ||
          !this.formData[key]
        )
          return true;
      }

      return false;
    },
  },
  mounted() {
    if (!!this.selectedUserData && this.isUpdateAction) {
      this.isEmailFieldDisabled = !this.selectedUserData.parent_user_id; // Primary accounts do not have a parent_user_id.
      this.formData = {
        ...this.selectedUserData,
        mobileDetails: {...this.selectedUserData.mobileDetails},
        isBookingInformaionChecked: true,
        isTermsAndConditionsChecked: true
      };
    } else this.formData.mobileDetails = {...this.siteDefaultMobileDetails}
  },
  methods: {
    onUserImageDelete() {
      this.formData.userImage = null;
      this.isUserImageAdded = false;
    },
    resetFormValues() {
      this.formData = {
        ...formDefaultValues,
        mobileDetails: {...this.siteDefaultMobileDetails},
      };
    },
    onModalCloseBtnClick() {
      this.resetFormValues();
      this.$emit("closeModal");
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
    selectDate({selectedDate}) {
      this.formData.dateOfBirth = selectedDate + "";
    },
    setUserImage(userImage) {
      this.isUserImageAdded = true;
      this.formData.userImage = userImage;
    },
    async createNewSubAccount() {
      try {
        this.isLoading = true;

        this.formData.fullName = `${this.formData.firstName} ${this.formData.lastName}`;

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
          nationality: this.formData.country_of_residence,
          sub_email: this.formData.email,
          mobile: this.formData.mobile,
          title: this.formData.title,
          image: this.formData.userImage,
        };

        const {data: res} = await this.$axios.post(
          // eslint-disable-next-line no-undef
          process.env.SHARED_ENVS.APIGEE_BASE_URL +
          customLayerEndPoints.POST_CREATE_NEW_SUB_ACCOUNT,
          userDetails,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res && res.body && res.statusCode) {
          this.resetFormValues();
          this.isLoading = false;
          let data = res.body;
          data["profile_image"] = userDetails.image;
          this.$emit("updateUsersList", {
            userData: data,
            type: "createNewSubAccount",
          });
        } else
          this.$showToast({
            type: "red",
            text: this.$t('SHARED.AN_ERROR_OCCURRED')
          });

        this.isLoading = false;
      } catch (err) {
        this.$showToast({
          type: "red",
          text: this.$t('SHARED.AN_ERROR_OCCURRED'),
        });
        this.isLoading = false;
        console.log({err});
      }
    },
    async updatePrimaryAccount() {
      try {
        const bearerAccessToken = await this.$getToken();

        const res = await this.$axios.patch(
          `${process.env.SHARED_ENVS.MPASS.APIGEE_DOMAIN}/v1/shareapp/updateuser`,
          {
            firstName: this.formData.firstName,
            lastName: this.formData.lastName,
            mobile: this.formData.mobile,
            country_of_residence: this.formData.country_of_residence,
            dateOfBirth: this.$dateFormatter(this.formData.dateOfBirth, "dayMonthYear", false, "YYYY-MM-DD"),
            title: this.formData.title,
            nationality: this.formData.nationality,
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
              gender:
                this.formData.title.toLowerCase() === "mr" ? "male" : "female",
              fullName: `${this.formData.firstName} ${this.formData.lastName}`,
              mobileDetails: {...this.formData.mobileDetails},
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
            {isIgnoreCachedToken: true}
          );

          return {isSuccess: true};
        }

        return {isSuccess: false};
      } catch (err) {
        this.$showToast({
          type: "red",
          text: this.$t('SHARED.AN_ERROR_OCCURRED'),
        });
        console.log({err});
        return {isSuccess: false};
      }
    },
    async updateSubAccount() {
      try {
        this.isLoading = true;

        this.formData.fullName = `${this.formData.firstName} ${this.formData.lastName}`;

        let userDetails = {
          title: this.formData.title,
          gender: this.formData.title.toLowerCase() === "mr" ? "male" : "female",
          firstName: this.formData.firstName,
          lastName: this.formData.lastName,
          mobile: this.formData.mobile,
          country_of_residence: this.formData.country_of_residence,
          nationality: this.formData.country_of_residence,
          dateOfBirth: this.$dateFormatter(this.formData.dateOfBirth, 'dayMonthYear', false, "YYYY-MM-DD"),
          email: this.formData.email,
        };

        if (this.formData.userImage) {
          userDetails["image"] = this.formData.userImage;
        }

        let isValid = true;

        if (!this.formData.parent_user_id) {
          // TODO: See the BE team to isolate the sub-account and primary-account update logic to reduce the number of APIs being called.
          const {isSuccess} = await this.updatePrimaryAccount();
          isValid = isSuccess;
        }

        if (isValid) {
          const {data: res} = await this.$axios.patch(
            // eslint-disable-next-line no-undef
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

          if (res) {
            let data = this.formData;
            data["profile_image"] = this.formData.userImage || this.savedImage;
            data["userImage"] = "";
            //
            this.resetFormValues();
            this.isLoading = false;
            this.$emit("updateUsersList", {
              userData: data,
              type: "updateSubAccount",
            });
          } else {
            this.isLoading = false;
            this.$showToast({
              type: "red",
              text: this.$t('SHARED.AN_ERROR_OCCURRED_WHILE_UPDATEDING_SUB_ACCOUNT'),
            });
          }
        } else {
          this.isLoading = false;
          this.$showToast({
            type: "red",
            text: this.$t('SHARED.AN_ERROR_OCCURRED'),
          });
        }
      } catch (err) {
        this.isError = true;
        this.isLoading = false;
        console.log({err});
        this.$showToast({
          type: "red",
          text: this.$t('SHARED.AN_ERROR_OCCURRED_WHILE_UPDATEDING_SUB_ACCOUNT'),
        });
      }
    },
    async saveSubAccountInfo() {
      this.$refs["user-sub-account-form-observer"].validate().then((res) => {
        if (res && !this.isImageNotValid) {
          if (this.isUpdateAction) this.updateSubAccount();
          else this.createNewSubAccount();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./SubAccountForm.scss";
</style>
