import Vue from 'vue'
import {AppConfig} from "@/const/variable";
import {CommonEvent} from "@/services/app-events";

Vue.prototype.$globalData = Vue.observable({
  isMobileDevice: false,
  isDesktopDevice: true,
  skiSchoolTabsLabel: null
});
 
export default ({app, route, $gtm}, inject) => {

  inject('detectMobile', () => {
    return window.innerWidth < 768;
  });
  inject('detectDesktop', () => {
    return window.innerWidth >= 1024;
  });

  inject('onResize', () => {
    CommonEvent.$emit('resize-event')
  });

  inject('sendGtmEvent', (data) => {
    if (data.ecommerce) {
      $gtm.push({ecommerce: null})
    }

    $gtm.push(data);
  });

  /**
   * split text to lines based on new line
   *
   * @returns {string} input
   */
  inject('splitTextToLines', (input) => {
    return input ? input.replace(/\n\r?/g, "<br />") : ''
  });

  inject('isEmptyObject', (objectToCheck) => {
    return Object.entries(objectToCheck || {}).length === 0;
  });

  inject('capitalizeFirstLetter', (text) => {
    if (text) {
      const lowerCasedText = text.toLowerCase();
      return text.charAt(0).toUpperCase() + lowerCasedText.slice(1);
    }

    return "";
  });

  inject('isExternalLink', (link) => {
    if (!link) return false;

    const regex = /^(https?:\/\/|tel:)/;
    return regex.test(link);
  });

  inject('getSiteCurrentEnvironment', (lowerCased = true, isReturnSiteConfig = false, kebabCase = false) => {
    let env = app.i18n.locale || 'ski-dubai';

    const lowerCasedEnv = env.toLowerCase();

    if (isReturnSiteConfig) {
      const selectedSiteConfig = lowerCasedEnv.includes('dhabi') ? 'SNOW_ABU_DHABI' : lowerCasedEnv.includes('oman') ? 'SNOW_OMAN' : 'SKI_DUBAI';
      return selectedSiteConfig;
    }

    if (kebabCase) {
      return env.replace(/\s+/g, '-').toLowerCase();
    }

    return lowerCased ? lowerCasedEnv : env;
  });

  inject('getSiteConfig', (entityType = null, lang = app.i18n.localeProperties.detectedLang) => {
    const selectedSiteConfig = app.$getSiteCurrentEnvironment(false, true);
    const config = AppConfig[selectedSiteConfig];

    if (!entityType) {
      return config;
    }

    if (entityType === 'currency') {
      return config.currency(lang);
    }

    return config[entityType];
  });

  inject('decimalPlaces', (num, isWithLocaleString = false, length = 2) => {
    const siteTruncatedDigitsVal = app.$getSiteConfig('decimalNumber');
    if (!num) return siteTruncatedDigitsVal === 3 ? "0.000" : "0.00";

    let fractionNumber = "";

    const str = num.toString();
    const array = str.split(".");

    if (array.length === 2) {
      fractionNumber += array[0] + ".";
      for (let i = 0; i < length; i++) {
        if (i >= array[1].length) fractionNumber += '0';
        else fractionNumber += array[1][i];
      }
    } else if (array.length === 1) {
      fractionNumber += array[0] + ".";
      for (let i = 0; i < length; i++) {
        fractionNumber += '0'
      }
    }
    // TODO: Change en-US to be dynamically selected based on the current language if the business decides to display the Arabic number.
    return isWithLocaleString ? Number(fractionNumber).toLocaleString("en-US", {
      minimumFractionDigits: siteTruncatedDigitsVal,
      maximumFractionDigits: siteTruncatedDigitsVal
    }) : fractionNumber;
  });

  inject('getMpassClientId', (environment = null) => {
    const site = environment ? environment : app.$getSiteCurrentEnvironment(true, true);
    const lowerCaseSiteName = site.toLowerCase();
    // eslint-disable-next-line no-undef
    const clientId = lowerCaseSiteName.includes("oman") ? process.env.SNOW_OMAN.MPASS_CLIENT_ID : lowerCaseSiteName.includes("dhabi") ? process.env.SNOW_ABD.MPASS_CLIENT_ID : process.env.SKI_DUBAI.MPASS_CLIENT_ID;

    return clientId;
  });

  inject('getMafPayMerchantId', () => {
    const site = app.$getSiteCurrentEnvironment(true, true);
    const lowerCaseSiteName = site.toLowerCase();
    // TODO: Change the merchant ID of Snow Abu dhabi when adding it.
    // eslint-disable-next-line no-undef
    let clientId = lowerCaseSiteName.includes("oman") ? process.env.SNOW_OMAN.MAFPAY.MERCHANT_ID : lowerCaseSiteName.includes("dhabi") ? process.env.SNOW_ABD.MAFPAY.MERCHANT_ID : process.env.SKI_DUBAI.MAFPAY.MERCHANT_ID;

    return clientId;
  })

  inject('readProductByAKLocal', (productAK) => {
    const vivaProducts = app.store.state.appConfig.vivaProducts || [];
    if (!productAK || !vivaProducts.length) return {};

    const product = vivaProducts.find(item => item.AK === productAK);
    return product;
  });

  inject('getProductPrice', (product) => {
    if (!app.$isEmptyObject(product || {})) {
      return product.PRICE ? Number(product.PRICE.GROSS) : 0;
    }

    return 0;
  });

  inject('getPackagePrice', (data) => {
    const cmsPrice = data.price;
    const tickets = (data.tickets || []).length ? data.tickets : !app.$isEmptyObject(data.ticket) ? [data.ticket] : [];

    if ((tickets || []).length) {
      const ak = tickets[0].ak || tickets[0].adult_ak || tickets[0].child_ak || tickets[0].junior_ak;

      if (!ak) return cmsPrice;
      const product = app.$readProductByAKLocal(ak);
      if (app.$isEmptyObject(product)) return cmsPrice;
      const noOfDays = data.days_of_booking ? +data.days_of_booking : 1;
      const isFamilyTicket = (data.required_quantity ? +data.required_quantity : 0) > 1;
      const vivaPrice = app.$getProductPrice(product);
      return isFamilyTicket ? vivaPrice * +data.required_quantity : vivaPrice * noOfDays;
    }

    return cmsPrice;
  });

  inject('getTimeStamp', () => {
    return Date.now();
  });

  inject('mapPassesContainerData', (section) => {
    let result = {
      data: [],
      moments: {isActive: false, data: {}}
    };

    if (section.cards) {
      result.data = section.cards.map(item => {
        let data = {
          ak: item.id,
          title: item.title,
          price: item.price,
          // eslint-disable-next-line no-undef
          img: item.image ? item.image.image_url : require(`@/assets/images/Passes/7.webp`),
          includes: item.includes,
          extra: item.external_link,
          data: item,
          bookingBarDetails: {}
        }
        return Object.assign({}, data, item);
      })
    }

    if (section.great_moment) {
      result.moments = {
        isActive: true,
        data: {
          id: section.great_moment.id,
          title: section.great_moment.title,
          description: section.great_moment.description,
          image: section.great_moment.image
            ? {...section.great_moment.image}
            : {},
          cta: section.great_moment.cta
            ? {...section.great_moment.cta}
            : {}
        }
      };
    }

    return result;
  });

  inject('splitTextWBW', (text) => {
    if (!text) return "";
    let textSplittedArray = text.split(" ");
    return textSplittedArray.map((word) => {
      return `<span class='inline-block'>${word}</span> `;
    }).join("");
  });

  inject('splitHighlightedText', (text, highlightedText, splitByWord) => {
    if (!text) return "";
    if (text.indexOf(highlightedText) !== -1) {
      let textArr = text.split(highlightedText);
      if (textArr.includes('')) {
        let temp = ``;
        for (let index = 0; index < textArr.length; index++) {
          temp += textArr[index] ? `<span class='not-highlighted'>${splitByWord ? app.$splitTextWBW(textArr[index]) : textArr[index]}</span>` : `<span class='highlighted'>${splitByWord ? app.$splitTextWBW(highlightedText) : highlightedText}</span>`;
        }
        return temp;
      } else {
        return textArr.map((item) => {
          return `<span class='not-highlighted'>${splitByWord ? app.$splitTextWBW(item) : item}</span>`;
        }).join(`<span class='highlighted'>${splitByWord ? app.$splitTextWBW(highlightedText) : highlightedText}</span>`);
      }
    } else {
      return `<span class='highlighted hidden'></span><span class='not-highlighted'>${splitByWord ? app.$splitTextWBW(text) : text}</span>`;
    }
  });

  inject('seoGenerator', (data, title) => {
    let seo = {};

    if (data) {
      seo = {
        title: data.seo ? data.seo.meta_title : title,
        meta: [
          {
            hid: "title",
            property: "title",
            content: data.seo
              ? data.seo.meta_title
              : title
          },
          {
            hid: "description",
            property: "description",
            name: "description",
            content: data.seo
              ? data.seo.meta_description
              : title
          },
          {
            hid: "og:title",
            property: "og:title",
            content: data.seo ? data.seo.meta_title : title
          },
          {
            hid: "og:description",
            property: "og:description",
            content: data.seo ? data.seo.meta_description : title
          },
          {
            hid: 'twitter:title',
            property: 'twitter:title',
            content: data.seo ? data.seo.meta_title : title
          },
          {
            hid: 'twitter:description',
            property: 'twitter:description',
            content: data.seo ? data.seo.meta_description : title
          }
        ]
      };
    }


    /* eslint-disable no-undef */
    return Object.assign({}, seo, {
      link: [
        {
          hid: "canonical",
          rel: "canonical",
          href: process.env.SHARED_ENVS.WEB_BASE_URL + route.fullPath
        },
        {
          hid: "alternate",
          rel: "alternate",
          href: process.env.SHARED_ENVS.WEB_BASE_URL + route.fullPath
        }
      ]
    })
  });

  inject('isUserAuthenticated', () => {
    return (app.$auth || {}).loggedIn;
  });

}
