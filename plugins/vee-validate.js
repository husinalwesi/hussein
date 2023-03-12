import Vue from 'vue';
import {Validator, ValidationObserver, ValidationProvider, Rules} from 'vee-validate';
import PhoneNumber from "awesome-phonenumber";
import {globalHelpers} from '@/plugins/helpers.js';

Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);


export default function ({app}) {
  const lang = app.i18n.localeProperties.detectedLang || 'en';

  // install rules and localization
  Object.keys(Rules).forEach(rule => {
    Validator.extend(rule, Rules[rule]);
  });

  const customErrorMessages = {
    required: {
      en: (field) => `Please enter the ${field}`,
      ar: () => `هذا الحقل مطلوب`
    },
    phoneNumber: {
      en: `Wrong mobile number format`,
      ar: 'يرجى التحقق من تنسيق رقم الهاتف'
    },
    regex: {
      en: (field) => `Please enter a valid ${field}`,
      ar: () => `الرجاء تصحيح هذا الحقل`
    },
    checkbox: {
      en: (field) => `Please agree to ${field}`,
      ar: () => `الرجاء الموافقة على هذا الحقل`
    },
    passwordStrength: {
      en: `The password is too weak`,
      ar: 'كلمة المرور ضعيفة'
    },
    minimumTwoYears: {
      en: `User age must be more than 2 years`,
      ar: 'يجب أن يكون عمر المستخدم أكثر من سنتين'
    },
    minimumTenYears: {
      en: `User age must be more than 10 years`,
      ar: 'يجب أن يكون عمر المستخدم أكثر من 10 سنين'
    },
    minimumYears: {
      en: `User age must be more than `,
      ar: 'يجب أن يكون عمر المستخدم أكثر من  '
    },
    maxYears: {
      en: `User age must be less than `,
      ar: 'يجب أن يكون عمر المستخدم اقل من  '
    },
    betweenYears: {
      en: `User age must be between `,
      ar: 'يجب أن يكون عمر المستخدم بين   '
    },
    min: {
      en: (field, val) => `The ${field} field must be at least ${val} characters`,
      ar: (field, val) => `يجب ألا يقل هذا الحقل عن ${val} ${typeof val === 'number' ? 'رقمًا' : 'حرفًا'}`
    },
    max: {
      en: (field, val) => `The ${field} field may not be greater than ${val} characters`,
      ar: (field, val) => `يجب ألا يزيد هذا الحقل عن ${val} ${typeof val === 'number' ? 'رقمًا' : 'حرفًا'}`
    },
    years: {
      en: `years`,
      ar: 'سنة'
    },
    alpha_spaces: {
      en: (field) => `The ${field} field may only contain alphabetic characters`,
      ar: () => 'هذا الحقل يمكن أن يحتوي على أحرف فقط'
    }
  };

  Validator.extend("required", {
    ...Rules.required,
    getMessage: (field) => customErrorMessages.required[lang](field),
  });

  Validator.extend("checkboxReq", {
    validate: (value) => {
      return value !== false;
    },
    getMessage: (field) => customErrorMessages.checkbox[lang](field),
  });

  Validator.extend("phoneNumber", {
    params: ["countryCode"],
    validate: (value, {countryCode}) => {
      if (!value && countryCode) return false;
      return PhoneNumber(countryCode + value).isValid();
    },
    getMessage: () => customErrorMessages.phoneNumber[lang]
  });

  const emailErrorMsgs = {
    en_email: `Please enter a valid email address, so we can reach you`,
    ar_email: `الرجاء إدخال عنوان إلكتروني صالح لكي نتمكن من التواصل معك`,
  };

  Validator.extend("emailRegex", {
    validate: (value) => {
      return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
    },
    getMessage: () => emailErrorMsgs[`${lang}_email`]
  });

  Validator.extend("passwordStrength", {
    validate: (value) => {
      let rules = [
        /(?=.*[A-Z])/,
        /(?=.*[a-z])/,
        /(?=.*[0-9])/
      ];
      let ans = 0;
      for (let i = 0; i < rules.length; i++) {
        const element = rules[i];
        let val = element.test(value);
        ans += val;
      }
      let long = new RegExp("(?=.{8,})");
      return (long.test(value) && ans >= 3);
    },
    getMessage: () => customErrorMessages.passwordStrength[lang]
  });

  Validator.extend("dateOfBirthValidity", {
    params: ["date"],
    validate: (value, {date}) => {
      return date <= globalHelpers.calculate_age(value);
    },
    getMessage: (field, {date}) => date === 10 ? customErrorMessages.minimumTenYears[lang] : date === 2 ? customErrorMessages.minimumTwoYears[lang] : customErrorMessages.minimumYears[lang] + date + ' ' + customErrorMessages.years[lang]

  });

  Validator.extend("alpha_spaces", {
    ...Rules.alpha_spaces,
    getMessage: (field) => customErrorMessages.alpha_spaces[lang](field),
  });

  Validator.extend("dateRange", {
    params: ["min", 'max'],
    validate: (value, {min, max}) => {
      const age = globalHelpers.calculate_age(value);
      const isValidAge = min && max ? min <= age && max >= age : min ? min <= age : max >= age;

      return isValidAge;
    },
    getMessage: (field, {min, max}) => {
      return min && max ? customErrorMessages.betweenYears[lang] + min + '-' + max + ' ' + customErrorMessages.years[lang] : min ? customErrorMessages.minimumYears[lang] + min + ' ' + customErrorMessages.years[lang] : customErrorMessages.maxYears[lang] + max + ' ' + customErrorMessages.years[lang]
    }
  });

  Validator.extend("min", {
    ...Rules.min,
    getMessage: (field, values) => customErrorMessages.min[lang](field, values),
  });


  Validator.extend("max", {
    ...Rules.max,
    getMessage: (field, values) => customErrorMessages.max[lang](field, values),
  });
}
