<template>
  <div class="contact-form-container">
    <div
      v-if="contactFormData.form_description_highlighted"
      class="form-description-wrapper"
      v-html="contactFormData.form_description_highlighted"
    />

    <ValidationObserver
      v-if="formData"
      ref="contact-form-observer"
      v-slot="{ invalid }"
    >
      <form @submit.prevent="validateForm">
        <BaseInput
          v-model="formData.name"
          i-n-ptype="text"
          i-n-pname="name"
          :custom-error="$t('CONTACT_US.ERRORS_MESSAGES.NAME_FIELD')"
          :i-n-pplaceholder="formType === 'birthdays' ? $t('CREDENTIALS_FORM.FIELDS.FIRST_NAME') : $t('CREDENTIALS_FORM.FIELDS.NAME')"
          :rules="{ required: true, min: 2, max: 50, alpha_spaces: true }"
        />
        <template v-if="!!formType">
          <BaseInput
            v-model="formData.agencyName"
            i-n-ptype="text"
            i-n-pname="agency name"
            :custom-error="$t('CONTACT_US.ERRORS_MESSAGES.AGENCY_FIELD',{agencyName:forms[formType].agencey})"
            :i-n-pplaceholder="forms[formType].agencey"
            wrapper-classes="mt-4"
            :rules="{ required: true, min: 2, max: 50, alpha_spaces: true }"
          />
        </template>
        <BaseInput
          v-model="formData.email"
          i-n-ptype="email"
          i-n-pname="email"
          :custom-error="$t('CONTACT_US.ERRORS_MESSAGES.EMAIL')"
          :i-n-pplaceholder="$t('CREDENTIALS_FORM.FIELDS.EMAIL')"
          wrapper-classes="mt-4"
          :rules="{
            required: true,
            max: 254,
            emailRegex: true,
          }"
        />
        <MobileInput
          :mobile="formData.mobileDetails"
          classes="mt-4"
          :is-reset-mobile-placeholder="isResetMobilePlaceholder"
          @setCompleteMobileNumber="setCompleteMobileNumber"
          @updateMobileDetails="updateMobileDetails"
        />
        <template v-if="(contactFormData.packages || []).length">
          <!--TODO: Modify the BaseDP component from scratch.-->
          <BaseDP
            id="package-dp"
            name="package-dp"
            :selected-place-holder="$t('COMMON.PACKAGE')"
            class-name="dp-container"
            :card-text-class="[
              'ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-dark-gray text-sm leading-4',
              (formData.selectedPackage || {}).name ? '' : 'opacity-50'
            ]"
            item-class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-dark-black text-sm leading-6"
            :dp-options="contactFormData.packages"
            wrapper-classes="mt-4"
            ddl-input-classes="p-4"
            :item-value="formData.selectedPackage"
            :is-reset-values="isResetDDLSelection"
            @item-selected="onItemSelect($event, 'package')"
          />
        </template>
        <template v-if="(contactFormData.subjects || []).length">
          <!--TODO: Modify the BaseDP component from scratch.-->
          <BaseDP
            id="subject-dp"
            name="subject-dp"
            :selected-place-holder="$t('CREDENTIALS_FORM.FIELDS.SUBJECT')"
            class-name="dp-container"
            :card-text-class="[
              'ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-dark-gray text-sm leading-4',
              (formData.selectedSubject || {}).name ? '' : 'opacity-50'
            ]"
            item-class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-dark-black text-sm leading-6"
            :dp-options="contactFormData.subjects"
            wrapper-classes="mt-4"
            ddl-input-classes="p-4"
            :item-value="formData.selectedSubject"
            :is-reset-values="isResetDDLSelection"
            @item-selected="onItemSelect($event, 'subject')"
          />
        </template>
        <BaseTextArea
          v-model="formData.enquiry"
          i-n-ptype="text"
          i-n-pname="enquiry"
          :custom-error="$t('CONTACT_US.ERRORS_MESSAGES.ENGUIRY_FIELD')"
          :i-n-pplaceholder="$t('CREDENTIALS_FORM.FIELDS.ENQUIRY')"
          classes="h-[160px]"
          wrapper-classes="mt-4"
          :rules="{required: true, min: 2, max: 254}"
        />

        <recaptcha
          ref="recaptcha" :key="recaptchaKey" class="mt-2"
          @success="onRecapchaSuccess"
        />

        <div class="submit-btn-wrapper" :class="{'loader-active':isLoading}">
          <BaseButton
            btn-type="submit"
            :text="(contactFormData.cta || {}).title ? contactFormData.cta.title : $t('COMMON.SEND')"
            :b-t-ndisabled="invalid || isFormInvalid || isLoading || !isRecapchaFormValid"
            :is-loading="isLoading"
            loader-classes="w-5 h-5"
          />
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import {ValidationObserver} from 'vee-validate';
import BaseInput from "@/components/Shared/BaseUI/FormElements/BaseInput";
import BaseDP from "@/components/Shared/BaseUI/BaseDP/index.vue";
import MobileInput from "@/components/Shared/BaseUI/FormElements/MobileInput/index.vue";
import BaseTextArea from "@/components/Shared/BaseUI/FormElements/BaseTextarea";
import BaseButton from "@/components/Shared/BaseUI/BaseButton";

import {customLayerEndPoints} from "@/const/api";
import {AppConfig} from "@/const/variable";

const formDefaultValues = {
  name: "",
  email: "",
  enquiry: "",
  agencyName: "",
  mobile: "",
  mobileDetails: {
    regionCode: "ae",
    countryCode: "+971",
    significantMobileNumber: ""
  },
  selectedPackage: {
    id: "",
    name: "",
    value: ""
  },
  selectedSubject: {
    id: "",
    name: "",
    value: ""
  }
};

export default {
  components: {
    ValidationObserver,
    BaseInput,
    BaseDP,
    MobileInput,
    BaseTextArea,
    BaseButton
  },
  props: {
    formType: {
      type: String,
      default: () => ""
    },
    contactFormData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const {iso2, dialCode} = this.$getSiteConfig("countryDetails");
    const siteMobileDetails = {
      regionCode: iso2,
      countryCode: dialCode,
      significantMobileNumber: "",
    };

    return {
      isLoading: false,
      forms: {
        birthdays: {
          agencey: this.$t('CREDENTIALS_FORM.FIELDS.PARENT_NAME'),
        },
        company: {
          agencey: this.$t('CREDENTIALS_FORM.FIELDS.COMPANY'),
        },
        schools: {
          agencey: this.$t('CREDENTIALS_FORM.FIELDS.SCHOOL'),
        },
      },
      defaultSiteMobileDetails: {...siteMobileDetails},
      formData: {
        ...formDefaultValues,
        mobileDetails: {...siteMobileDetails},
      },
      isFormInvalid: true,
      isRecapchaFormValid: false,
      recaptchaKey: "recaptcha-" + new Date(),
      succesMessage: "",
      isResetDDLSelection: false,
      isResetMobilePlaceholder: false
    };
  },
  watch: {
    // TODO: Remove this and replace it with a better solution.
    formData: {
      handler(newVal, oldVal) {
        for (var key in formDefaultValues) {
          if (key === "agencyName") {
            if (this.formType && !this.formData[key]) this.isFormInvalid = true;
          } else if (["mobile", "mobileDetails"].includes(key) && !this.formData.mobile) {
            this.isFormInvalid = true;
          } else if (["selectedPackage", "selectedSubject"].includes(key)) {
            if (this.isListSelectionNeeded(key)) this.isFormInvalid = true;
          } else if (this.formData[key] === null || this.formData[key] === "")
            this.isFormInvalid = true;
          else this.isFormInvalid = false;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.initRecapcha();
  },
  beforeDestroy() {
    this.$recaptcha.destroy();
  },
  methods: {
    async initRecapcha() {
      try {
        this.$recaptcha.language = this.$i18n.localeProperties.detectedLang;
        await this.$recaptcha.init();
      } catch (e) {
        console.error(e);
      }
    },
    onRecapchaSuccess() {
      this.isRecapchaFormValid = true;
    },
    setCompleteMobileNumber() {
      this.formData.mobile = `${this.formData.mobileDetails.countryCode}${this.formData.mobileDetails.significantMobileNumber}`.replace(/\s/g, "");
    },
    updateMobileDetails(e) {
      this.formData.mobileDetails.regionCode = e.regionCode;
      this.formData.mobileDetails.countryCode = e.countryCode;
      this.setCompleteMobileNumber();
    },
    isListSelectionNeeded(selectedListItemType) {
      if (selectedListItemType === "selectedPackage" && (this.contactFormData.packages || []).length) return !this.formData.selectedPackage.name;
      if (selectedListItemType === "selectedSubject" && (this.contactFormData.subjects || []).length) return !this.formData.selectedSubject.name;

      return false;
    },
    onItemSelect(selectedItem, itemType) {
      if (itemType === "package") this.formData.selectedPackage = selectedItem;
      if (itemType === "subject") this.formData.selectedSubject = selectedItem;
    },
    async submitForm() {
      try {
        this.isLoading = true;

        const currentEnv = this.$getSiteCurrentEnvironment(true, true);

        const formDetails = {
          name: this.formData.name,
          email: this.formData.email,
          subject: this.formData.selectedSubject.name,
          enquiry: this.formData.enquiry,
          parentName: this.formType === "birthdays" ? this.formData.agencyName : "",
          school: this.formType === "schools" ? this.formData.agencyName : "",
          company: this.formType === "company" ? this.formData.agencyName : "",
          package: this.formData.selectedPackage.name,
          mobile: this.formData.mobile,
          formType: this.formType || "",
          location: AppConfig[currentEnv].location
        };

        /* eslint-disable no-undef */
        const res = await this.$axios.post(
          process.env.SHARED_ENVS.APIGEE_BASE_URL +
          customLayerEndPoints.CONTACT_FORM,
          formDetails,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

        if (res && res.status === 200 && res.data) {
          this.$repositories.contactUsSubmitEvent()
          this.formData = {
            ...formDefaultValues,
            mobileDetails: {...this.defaultSiteMobileDetails},
            selectedPackage: {...formDefaultValues.selectedPackage},
            selectedSubject: {...formDefaultValues.selectedSubject}
          };
          this.isResetDDLSelection = !this.isResetDDLSelection;
          this.$refs["contact-form-observer"].reset();

          this.isResetMobilePlaceholder = !this.isResetMobilePlaceholder;
          this.isRecapchaFormValid = false;
          this.recaptchaKey = "recaptcha-" + new Date();

          const currentEnv = this.$getSiteCurrentEnvironment(false, true);
          const currentEnvText = this.$t(`LOCATIONS.${currentEnv}`);
          const succesMessage = `${this.$t("CONTACT_US.SUCCESS_MESSAGE", {location: currentEnvText})}`;

          this.$showToast({
            type: "green",
            text: succesMessage
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
    validateForm() {
      this.$refs["contact-form-observer"].validate().then((res) => {
        if (res && this.isRecapchaFormValid) this.submitForm();
        else
          this.$showToast({
            type: "red",
            text: this.$t('CONTACT_US.ERRORS_MESSAGES.FILL_FIELDS')
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./ContactForm.scss";
</style>
