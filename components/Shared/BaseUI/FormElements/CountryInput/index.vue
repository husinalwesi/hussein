<template>
  <div v-click-outside="onOutsideClick" class="relative">
    <div class="w-full" @click="showCountriesModal = true">
      <BaseInput
        v-model="country"
        i-n-ptype="text"
        :i-n-pname="name"
        :i-n-pplaceholder="placeholder || $t('CREDENTIALS_FORM.FIELDS.COUNTRY_OF_RESIDENCE')"
        :classes="['cursor-pointer', 'bg-white']"
        :is-popup-field="true"
        :rules="{ required: true }"
        :inner-component="'arrow-svg'"
      />
    </div>

    <CountriesList
      :show-modal="showCountriesModal"
      :show-country-phone-code="false"
      @selected="onCountrySelect"
      @close="showCountriesModal = false"
    />
  </div>
</template>

<script>
import BaseInput from "@/components/Shared/BaseUI/FormElements/BaseInput";
import CountriesList from "@/components/Shared/CountriesList";

export default {
  components: {BaseInput, CountriesList},
  props: {
    country: {
      type: String,
      default: ""
    },
    name: { type: String, default: "country" },
    placeholder: {
      type: String,
      default: ""
    }
  },
  emits: ['select-country'],
  data() {
    return {
      showCountriesModal: false,
    };
  },
  methods: {
    onOutsideClick() {
      this.showCountriesModal = false;
    },
    onCountrySelect({ name_en, name_ar, iso3 }) {
      const countryName = this.$i18n.localeProperties.detectedLang === 'en' ? name_en : name_ar;
      this.$emit("select-country", { iso3, name: countryName });
    },
  },
};
</script>
