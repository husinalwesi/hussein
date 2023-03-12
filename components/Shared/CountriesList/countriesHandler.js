import countries from '@/static/json/countries-list.json';

export default {
    methods: {
        /**
         * Show a particular country to be the first country to appear in the list.
         * @param {String} sortedCountryIsoCode
         * @returns List of countries
         */
        getCountries(sortedCountryIsoCode = "") {
            if (sortedCountryIsoCode && sortedCountryIsoCode !== "ae" && countries.data[0].iso2 !== sortedCountryIsoCode) {
                let countryIndex = null;
                const detectedCountry = countries.data.find((country, cidx) => {
                    countryIndex = cidx;
                    return country.iso2?.toLowerCase() === sortedCountryIsoCode;
                });

                countries.data.splice(countryIndex, 1);
                countries.data.splice(0, 0, detectedCountry);
            }

            return countries.data;
        }
    }
}
