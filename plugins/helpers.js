import PhoneNumber from "awesome-phonenumber";
import countries from '@/static/json/countries-list.json';
import moment from "moment";

export const globalHelpers = {
  calculate_age(dob) {
    let value = ''
    if (globalHelpers.isCorrectFormat(dob, 'DD MMM YYYY')) {
      value = moment(dob, 'DD MMM YYYY').format('YYYY/MM/DD');
    } else {
      value = moment(dob).format('YYYY/MM/DD');
    }
    return moment().locale('en').diff(value, 'years')
  },
  flattendUserInformation(userInfo, locale = 'en') {
    let userObj = {};
    for (const [key, value] of Object.entries(userInfo)) {
      if (key.includes('https://profile/')) {
        const newKey = key.replace('https://profile/', '');
        userObj[newKey] = value;
      }
    }

    const userCountryOfResidence = userObj.country_of_residence ? userObj.country_of_residence.toUpperCase() === 'UAE' ? 'ARE' : userObj.country_of_residence : 'ARE';
    const userNationality = userObj.nationality ? userObj.nationality.toUpperCase() === 'UAE' ? 'ARE' : userObj.nationality : 'ARE';

    const countryName = userCountryOfResidence ? globalHelpers.getObjFromArrByAttrVal(countries.data, 'iso3', userCountryOfResidence) : '';
    const nationalityCountryName = userNationality ? globalHelpers.getObjFromArrByAttrVal(countries.data, 'iso3', userNationality) : '';

    userObj.fullName = `${userObj.firstName} ${userObj.lastName}`;
    userObj.gender = userObj.title && userObj.title.toLowerCase() === "mr" ? "male" : "female";
    userObj.age = globalHelpers.calculate_age(userObj.dateOfBirth);
    userObj.mobileDetails = globalHelpers.mobileNumberFormatter(userObj.mobile);
    userObj.countryName = countryName ? locale === 'ar' && countryName.name_ar ? countryName.name_ar : countryName.name_en ? countryName.name_en : '' : '';
    userObj.nationalityCountryName = nationalityCountryName ? locale === 'ar' && nationalityCountryName.name_ar ? nationalityCountryName.name_ar : nationalityCountryName.name_en ? nationalityCountryName.name_en : '' : '';
    //
    let memberID = userInfo["https://maf.gravty.auth/dev/api/memberId"];
    userObj.share = {
      isShareMember: !!memberID,
      memberID: memberID,
    };
    //
    return userObj;
  },
  getObjFromArrByAttrVal(arr, objKey, objVal) {
    if (arr && arr.length)
      return arr.find(obj => {
        return obj[objKey]?.toLowerCase() === objVal.toLowerCase()
      });

    return {};
  },
  passwordStarsReplacer(password = "") {
    // TODO: In case the password is returned from the API, remove the static value with the length of the password.
    return password ? password.replace(password, Array(10).join("*")) : Array(10).join("*");
  },
  dateFormatter(date, formatType = "fullDate", isReturnMsg = true, dateFormat = 'DD-MM-YYYY', locale = this.$i18n.localeProperties.detectedLang, isCustomTypeDate = false) {
    if (date) {
      if (formatType === "time") {
        const dateTime = moment.utc(date);
        const localedDateTime = dateTime.locale(locale);
        return localedDateTime.format('h:mm ') + this.$t(`BOOKINGFLOW_PAGE.${dateTime.locale('en').format('a').toUpperCase()}`);
      } else if (formatType === "monthDate") {
        if (globalHelpers.isCorrectFormat(date, "MMMM YYYY"))
          return moment(date, "MMMM YYYY").locale(locale).format('MMM YYYY');

        return moment(date).locale(locale).format('MMM YYYY');
      } else if (formatType === "dayMonthYear") {
        // TODO: Remove the new Date() and use only moment.
        if (isCustomTypeDate) return moment.utc(date).locale(locale).format(dateFormat);

        const selectedDate = new Date(date);
        const userTimezoneOffset = selectedDate.getTimezoneOffset() * 60000;
        return moment.utc(new Date(selectedDate.getTime() - userTimezoneOffset)).locale(locale).format(dateFormat);
      } else if (formatType === "dateTime") {
        const localedDateTime = moment.utc(date).locale(locale);
        const timeOfDay = this.$t(`COMMON.TIMES_OF_DAY.${moment.utc(date).locale("en").format('a').toUpperCase()}`);

        const formattedDateTime = localedDateTime.format(`${dateFormat} hh:mm `) + timeOfDay;

        return formattedDateTime;
      } else if (formatType === "timeSlot") {
        let timeArr = date.split(":");
        let dateTime = moment().locale("en").set({h: Number(timeArr[0]), m: Number(timeArr[1]), s: '0'});
        return dateTime.format('h:mm ') + this.$t(`BOOKINGFLOW_PAGE.${dateTime.format('a').toUpperCase()}`);
      } else if (formatType === "slots") {
        let timeArr = date.split(":");
        let dateTime = moment().locale("en").set({h: Number(timeArr[0]), m: Number(timeArr[1]), s: '0'});
        return dateTime;
      } else {
        const selectedDate = moment(date).locale(locale).format(formatType ? 'DD MMM YYYY' : 'DD MMM');
        return selectedDate;
      }
    } else if (isReturnMsg)
      return this.$t('COMMON.ADD_BIRTHDAY');

    return '';
  },
  mobileNumberFormatter(mobileNumber, countryNumberDetails = {}) {
    const mobileDetails = mobileNumber ?
      {
        regionCode: PhoneNumber(mobileNumber).getRegionCode(),
        countryCode: '+' + PhoneNumber(mobileNumber).getCountryCode(),
        significantMobileNumber: PhoneNumber(mobileNumber).getNumber("significant")
      }
      : {
        regionCode: countryNumberDetails.iso2 || "ae",
        countryCode: countryNumberDetails.dialCode || "+971",
        significantMobileNumber: ""
      };
    return mobileDetails;
  },
  setSessionStorage(key, val) {
    sessionStorage.setItem(key, JSON.stringify(val));
  },
  getSessionStorage(key) {
    const item = sessionStorage.getItem(key);
    return item;
  },
  siteMessagesHandler(reference) {
    const messageStatus = globalHelpers.getSessionStorage(reference);
    if (messageStatus !== null && String(messageStatus) !== "true") globalHelpers.setSessionStorage(reference, true);
  },
  pluralTextHandler(number, type) {
    if (number === 1) return this.$t(`COMMON.${type.toUpperCase()}.SINGLE`);
    if (number === 2) return this.$t(`COMMON.${type.toUpperCase()}.DOUBLE`);
    if (this.$i18n.localeProperties.detectedLang === 'en' || number < 11) return `${this.$t(`COMMON.${type.toUpperCase()}.PLURAL`, {number})}`;
    return `${this.$t(`COMMON.${type.toUpperCase()}.MULTI`, {number})}`;
  },
  isCorrectFormat(dateString, format) {
    return moment(dateString, format, true).isValid()
  }
}


export default ({app}, inject) => {
  inject('flattendUserInformation', globalHelpers.flattendUserInformation);
  inject('getObjFromArrByAttrVal', globalHelpers.getObjFromArrByAttrVal);
  inject('passwordStarsReplacer', globalHelpers.passwordStarsReplacer);
  inject('dateFormatter', globalHelpers.dateFormatter);
  inject('setSessionStorage', globalHelpers.setSessionStorage);
  inject('getSessionStorage', globalHelpers.getSessionStorage);
  inject('siteMessagesHandler', globalHelpers.siteMessagesHandler);
  inject('ageHandler', globalHelpers.calculate_age);
  inject('pluralTextHandler', globalHelpers.pluralTextHandler);
  inject('mobileNumberFormatter', (mobileNumber) => {
    let iso2 = '';
    let dialCode = '';

    if (!mobileNumber) {
      const siteCountryDetails = this.$getSiteConfig("countryDetails");
      iso2 = siteCountryDetails.iso2;
      dialCode = siteCountryDetails.dialCode;
    }

    return globalHelpers.mobileNumberFormatter(mobileNumber, {iso2, dialCode});
  });
}
