<template>
  <CountriesModal :show-modal="showModal" @close="close">
    <div slot="header">
      <div class="relative">
        <input
          ref="countrisSearchInput"
          class="bg-gray-100 text-dark-gray rounded-lg ltr:pl-10 ltr:pr-4 rtl:pr-10 rtl:pl-4  py-2 w-full placeholder-gray-600 focus:outline-none ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler"
          type="text"
          :placeholder="$t('COMMON.SEARCH')"
          @input="onInputSearch"
          @keydown.enter.prevent="onEnterKeyClick"
        >
        <div class="absolute ltr:left-0 rtl:right-0 ltr:pl-5 rtl:pr-5 top-3">
          <search-icon />
        </div>
      </div>
    </div>
    <ul slot="content" class="lg:h-64 ltr:text-left rtl:text-right  text-dark-gray mx-4">
      <li v-if="filteredCountries.length === 0" class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler">
        {{ $t('COMMON.NO_RESULT') }}
      </li>
      <li
        v-for="item in filteredCountries"
        :key="item.iso2"
        class="flex items-center mb-4 cursor-pointer ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler"
        @click="onClick(item)"
      >
        <img
          :src="getURL(item.iso2)" :alt="item.iso2" width="40"
          height="40"
        >
        <span v-if="showCountryPhoneCode" class="text-dark-blue ltr:ml-4 rtl:mr-4 unicode-plain-text"><span>+</span>{{ item.dialCode }}</span>
        <span class="text-dark-blue ltr:ml-4 rtl:mr-4">{{ item[countryName] }}</span>
      </li>
    </ul>
  </CountriesModal>
</template>

<script>
import SearchIcon from "@/components/SVGElements/search-icon.vue";
import CountriesModal from "./CountriesModal";
import countriesHandler from './countriesHandler';

export default {
  components: { SearchIcon, CountriesModal },
  mixins: [countriesHandler],
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    showCountryPhoneCode: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['selected', 'close'],
  data() {
    return {
      countriesList: [],
      filteredCountries: [],
      countryName: this.$i18n.localeProperties.detectedLang === 'ar' ? 'name_ar' : "name_en"
    };
  },
  created() {
    const {iso2} = this.$getSiteConfig("countryDetails");
    const countries = this.getCountries(iso2);

    this.countriesList = countries;
    this.filteredCountries = countries;
  },
  updated() {
    this.$refs.countrisSearchInput?.focus(); // setting an autofocus for the search input.
    if (!this.showModal && this.filteredCountries !== this.countriesList)
      this.filteredCountries = this.countriesList;
  },
  methods: {
    onClick(item) {
      this.filteredCountries = this.countriesList;
      this.$emit("selected", item);
      this.close();
    },
    close() {
      this.$emit("close");
    },
    onInputSearch({target}) {
      const enteredValue = target.value.trim().toLowerCase();

      this.filteredCountries = this.countriesList.filter((country) => {
        return (
          country[this.countryName]
            .toLowerCase()
            .includes(enteredValue) ||
          country.dialCode.includes(enteredValue)
        );
      });
    },
    getURL(img) { return `https://d1qg2tinnmsnxd.cloudfront.net/shared/img/${img}.svg`; },
    onEnterKeyClick() {
      if (this.filteredCountries.length)
        this.onClick(this.filteredCountries[0]);
    },
  },
};
</script>
