<template>
  <form
    class="mt-8 flex flex-col gap-y-4"
    :class="formWrapperClasses"
    @submit.prevent="$emit('submitForm')"
  >
    <div v-if="showTitleSelector" class="flex flex-1 flex-wrap gap-y-4 gap-x-8">
      <BaseRadio
        v-for="title in titles"
        :key="title.id"
        v-model="formData.title"
        :rules="{ required: true }"
        vid="titles"
        :attr-val="title.value"
        r-b-i-oname="titles"
        :r-b-i-olabel="title.label"
        :r-b-i-oid="title.label + title.id"
      />
    </div>
    <div class="flex flex-col min-700:flex-row gap-4">
      <BaseInput
        v-model="formData.firstName"
        i-n-ptype="text"
        i-n-pname="first name"
        :i-n-pplaceholder="$t('CREDENTIALS_FORM.FIELDS.FIRST_NAME')"
        :rules="{ required: true, min: 2, max: 50, alpha_spaces: true }"
      />
      <BaseInput
        v-model="formData.lastName"
        i-n-ptype="text"
        i-n-pname="last name"
        :i-n-pplaceholder="$t('CREDENTIALS_FORM.FIELDS.LAST_NAME')"
        :rules="{ required: true, min: 2, max: 50, alpha_spaces: true }"
      />
    </div>

    <BaseDate 
      v-if="showDatePopup"
      :show-input-title="showDateInputTitle"
      :date="formData.dateOfBirth || formData.date"
      :is-date-picker-old-days-disabled="isDatePickerOldDaysDisabled"
      :extra-rules="extraDateRules"
      :placeholder="baseDatePlaceholder || $t('CREDENTIALS_FORM.FIELDS.DATE_OF_BIRTH')"
      @selectDate="selectDate"
    />

    <div class="flex flex-col gap-4" :class="{'min-700:flex-row gap-4':!isFullWidthFields}">
      <div class="flex-1">
        <MobileInput
          :mobile="formData.mobileDetails"
          @setCompleteMobileNumber="$emit('setCompleteMobileNumber')"
          @updateMobileDetails="updateMobileDetails"
        />
      </div>

      <BaseInput
        v-model="formData.email"
        i-n-ptype="email"
        i-n-pname="email"
        :i-n-pplaceholder="$t('CREDENTIALS_FORM.FIELDS.EMAIL')"
        :disabled="emailIsDisabled"
        :rules="{
          required: true,
          max: 254,
          emailRegex: true,
        }"
      />
    </div>
    <div
      :class="
        showNationalityList
          ? 'flex flex-col min-700:flex-row gap-4'
          : isFullWidthFields
            ? 'w-full'
            : 'min-700:ltr:pr-2 min-700:rtl:pl-2 w-full min-700:w-1/2'
      "
    >
      <div class="flex-1">
        <CountryInput
          :country="formData.countryName"
          @select-country="selectCountry"
        />
      </div>
      <div v-if="showNationalityList" class="flex-1">
        <CountryInput
          name="nationality"
          :placeholder="$t('CREDENTIALS_FORM.FIELDS.NATIONALITY')"
          :country="formData.nationalityCountryName"
          @select-country="selectNationality"
        />
      </div>
    </div>

    <!--TODO: decide whether to keep this elems here or remove it based on the business requirements regarding the password thing.-->
    <div
      v-if="showPasswordField"
      class="flex flex-col min-700:flex-row gap-4 min-700:items-center"
    >
      <!--The type is pass rather than password in order to control the way of showing it as astertick rather than the default dots.-->
      <!--When the password field is readonly that's mean that the user will enter a new password.-->
      <BaseInput
        v-model="formData.password"
        :i-n-ptype="isPasswordFieldReadonly ? 'pass' : 'text'"
        i-n-pname="password"
        :i-n-pplaceholder="$t('CREDENTIALS_FORM.FIELDS.PASSWORD')"
        :readonly="isPasswordFieldReadonly"
        :rules="{
          required: true,
          passwordStrength: !isPasswordFieldReadonly
        }"
      />

      <div v-if="isPasswordFieldReadonly" class="flex-1">
        <button
          type="button"
          class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold  text-sm text-dark-gray relative"
          @click.prevent="$emit('onResetPasswordClick')"
        >
          {{ $t('CREDENTIALS_FORM.FIELDS.RESET_PASSWORD') }}

          <snowflake-loader
            v-if="isResetPasswordLoading"
            loader-wrapper-classes="absolute bg-[#ffffffcb] h-full rounded-lg z-10 inset-0"
            loader-classes="w-10 h-10"
          />
        </button>
      </div>
    </div>
    <slot name="extraFields" />
  </form>
</template>

<script>
import MobileInput from "@/components/Shared/BaseUI/FormElements/MobileInput";
import CountryInput from "@/components/Shared/BaseUI/FormElements/CountryInput";
import BaseDate from "@/components/Shared/BaseUI/FormElements/BaseDate";

export default {
  components: {
    MobileInput,
    CountryInput,
    BaseDate,
  },
  props: {
    invalid: { type: Boolean, default: false },
    emailIsDisabled: { type: Boolean, default: false },
    formData: { type: Object, default: null },
    showTitleSelector: {
      type: Boolean,
      default: false,
    },
    showDatePopup: {
      type: Boolean,
      default: false,
    },
    showDateInputTitle: { type: Boolean, default: true },
    showNationalityList: {
      type: Boolean,
      default: false,
    },
    formType: {
      type: String,
      default: "guestForm",
    },
    showPasswordField: {
      type: Boolean,
      default: false,
    },
    extraDateRules: {
      type: Object,
      default: () => ({}),
    },
    isPasswordFieldReadonly: {
      type: Boolean,
      default: true,
    },
    isDatePickerOldDaysDisabled: { type: Boolean, default: true },
    isResetPasswordLoading: { type: Boolean, default: true },
    formWrapperClasses: {
      type: [String, Array],
      default: () => "",
    },
    isFullWidthFields:{
      type: Boolean,
      default:false
    },
    baseDatePlaceholder: { type: String, default: () => "" }
  },
  emits: ['submitForm', 'onResetPasswordClick', 'selectCountry', 'updateMobileDetails', 'selectNationality', 'selectDate', 'setCompleteMobileNumber'],
  data() {
    return {
      titles: [
        { label: this.$t('CREDENTIALS_FORM.TITLES.MR'), id: 1, value: "Mr" },
        { label: this.$t('CREDENTIALS_FORM.TITLES.MRS'), id: 2, value: "Mrs" },
        { label: this.$t('CREDENTIALS_FORM.TITLES.MISS_MS'), id: 3, value: "Miss" }
      ],
    };
  },
  watch: {
    invalid() {
      //TODO: enhance this process, clean out the function, and move this to a general place.
      if (this.formType === "guestForm") {
        const isEmpty = () => {
          for (var key in this.formData) {
            if (this.formData[key] === null || this.formData[key] === "")
              return true;
          }

          return false;
        };

        if (!isEmpty())
          this.$store.dispatch(
            "bookingFlow/saveGuestFormValidtyStatus",
            !this.invalid
          );
        else  this.$store.dispatch("bookingFlow/saveGuestFormValidtyStatus", false);
      }
    },
  },
  methods: {
    selectCountry(country) {
      this.$emit("selectCountry", country);
    },
    updateMobileDetails(details) {
      this.$emit("updateMobileDetails", details);
    },
    selectNationality(nationalityCountry) {
      this.$emit("selectNationality", nationalityCountry);
    },
    selectDate(date) {
      this.$emit("selectDate", date);
    },
  },
};
</script>
