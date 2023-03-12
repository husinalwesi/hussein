<template>
  <div v-click-outside="onOutsideClick" class="relative" :class="classes">
    <div class="mobile-input-container">
      <div class="country-code-box" @click="showMobileNumberModal = true">
        <img
          v-if="mobile.regionCode"
          width="16"
          height="16"
          :src="`${imgPath}/${mobile.regionCode.toLowerCase()}.svg`"
          alt="flagImg"
        >
        <span class="selected-country-code unicode-plain-text">{{ mobile.countryCode }}</span>
        <arrow-svg />
      </div>

      <div class="flex-1 min-360:mt-0 mt-2">
        <BaseInput
          v-model="mobile.significantMobileNumber"
          i-n-ptype="number"
          i-n-pname="mobile number"
          :has-min-width="false"
          :i-n-pplaceholder="mobilePlaceHolder"
          :rules="{
            required: true,
            max: 15,
            phoneNumber: {countryCode: mobile.countryCode}
          }"
          @keyup="$emit('setCompleteMobileNumber')"
        />
      </div>
    </div>

    <CountriesList
      :show-modal="showMobileNumberModal"
      :show-country-phone-code="true"
      @selected="onMobileCodeSelect"
      @close="showMobileNumberModal = false"
    />
  </div>
</template>

<script>
import ArrowSvg from "@/components/SVGElements/arrow-svg.vue";
import BaseInput from "@/components/Shared/BaseUI/FormElements/BaseInput";
import CountriesList from "@/components/Shared/CountriesList";
import PhoneNumber from "awesome-phonenumber";

export default {
  components: {
    ArrowSvg,
    BaseInput,
    CountriesList
  },
  props: {
    mobile: {
      type: Object,
      default: () => ({}),
    },
    classes: {
      type: String,
      default: () => "",
    },
    isResetMobilePlaceholder: {
      type: Boolean,
      default: false
    }
  },
  emits: ['updateMobileDetails', 'setCompleteMobileNumber'],
  data() {
    return {
      imgPath: "",
      showMobileNumberModal: false,
      mobilePlaceHolder: this.$t('CREDENTIALS_FORM.FIELDS.MOBILE_NUMBER'),
      siteIso2Code: "ae"
    };
  },
  watch: {
    isResetMobilePlaceholder() {
      this.generateNumberExample(this.siteIso2Code);
    }
  },
  created() {
    this.imgPath = "https://d1qg2tinnmsnxd.cloudfront.net/shared/img"; //TODO: change this if we'll host the countries images on a different URL.
  },
  mounted() {
    this.siteIso2Code =  this.$getSiteConfig("countryDetails").iso2;

    let regionIsoCode = "";

    this.$nextTick(() => {
      if (this.mobile.significantMobileNumber) regionIsoCode = this.mobile.regionCode;
      else regionIsoCode = this.siteIso2Code;

      this.generateNumberExample(regionIsoCode);
    });
  },
  methods: {
    onOutsideClick() {
      this.showMobileNumberModal = false;
    },
    generateNumberExample(iso2) {
      const phoneNumber = PhoneNumber.getExample(
        iso2.toUpperCase(),
        "mobile"
      ).getNumber("national");
      if (phoneNumber) {
        this.mobilePlaceHolder = this.$t("COMMON.MOBILE_NUMBER_IE",{mobileNumber:phoneNumber.replace(0, "")})
      }
    },
    onMobileCodeSelect({dialCode, iso2}) {
      const countryCode = "+" + dialCode;
      const regionCode = iso2;

      this.$emit("updateMobileDetails", {countryCode, regionCode});
      this.generateNumberExample(iso2);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./MobileInput.scss";
</style>
