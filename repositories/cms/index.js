import {customLayerEndPoints, customLayerMAFShareEndPoints, endPoints} from "~/const/api";

export default ({$axios, app}) => ({
  async getSkiSchool() {
    try {
      const {data: res} = await $axios.get(endPoints.GET_SHINE_AT_SKI_SCHOOL);

      if ((res || {}).Result)
        return res.Result;

      return {};
    } catch (err) {
      console.log({err});
      return {};
    }
  },
  async getLessons(filter) {
    try {
      const {data: res} = await $axios.post(endPoints.GET_SKI_LESSONS, filter);

      if ((res || {}).Result)
        return res.Result;

      return {};
    } catch (err) {
      console.log({err});
      return {};
    }
  },
  async getSkiLevels() {
    try {
      const {data: res} = await $axios.get(endPoints.GET_SKI_LEVEL);

      if ((res || {}).Result)
        return res.Result;

      return [];
    } catch (err) {
      console.log({err});
      return [];
    }
  },
  async getLessonsByLevel(filter) {
    try {
      const {data: res} = await $axios.post(endPoints.GET_LESSONS_BY_LEVEL, filter);

      if ((res || {}).Result)
        return res.Result;

      return [];
    } catch (err) {
      console.log({err});
      return [];
    }
  },
  async getPaymentCards() {
    if (!app.$isUserAuthenticated()) return false;
    try {
      // eslint-disable-next-line no-undef
      const qs = require('qs');
      let data = qs.stringify({
        'command': 'getAccountHolderTokens'
      });
      const merchantId = app.$getMafPayMerchantId();
      let config = {
        method: 'post',
        url: `${process.env.SHARED_ENVS.MAFPAY.BASE_URL}/api`,
        headers: {
          // eslint-disable-next-line no-undef
          'Merchant-Id': merchantId,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
      };

      return await $axios(config);
    } catch (e) {
      console.log(e)
      return [];
    }
  },
  async removePaymentCard(cardToken) {
    if (!app.$isUserAuthenticated()) return false;
    try {
      // eslint-disable-next-line no-undef
      const qs = require('qs');
      let data = qs.stringify({
        "command": 'deleteToken',
        "cardToken": cardToken
      });
      const merchantId = app.$getMafPayMerchantId();

      let config = {
        method: 'post',
        // eslint-disable-next-line no-undef
        url: `${process.env.SHARED_ENVS.MAFPAY.BASE_URL}/api`,
        headers: {
          // eslint-disable-next-line no-undef
          'Merchant-Id': merchantId,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
      };

      return await $axios(config);
    } catch (e) {
      console.log(e);
      // return []
    }
  },
  async getEventsPage() {
    try {
      let response = await $axios.get(endPoints.GET_EVENTS);

      return response.data['Result'];

    } catch (e) {
      console.log(e);
      return {};
    }
  },
  async getOffersPage() {
    try {
      let response = await $axios.get(endPoints.GET_OFFERS);

      return response.data['Result'];
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  async getBookingDetails(bookingReference) {
    try {
      const isGuest = !app.$isUserAuthenticated();
      // eslint-disable-next-line no-undef
      const {data: result} = await $axios.get(process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.GET_BOOKING_DETAILS + `/${bookingReference}?isGuest=${isGuest}`);

      return {
        success: true,
        data: result.data
      }
    } catch (err) {
      console.log({err})
      return {success: false, isError: true}
    }
  },
  async createGuest(userDetails) {
    try {
      // eslint-disable-next-line no-undef
      const data = await $axios.post(process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.CREATE_NEW_GUEST, userDetails,
        {
          headers: {
            "Content-Type": "application/json"
          },
        }
      );

      return data;
    } catch (e) {
      return e;
    }
  },
  async getUsers() {
    try {
      const response = await $axios.get(
        // eslint-disable-next-line no-undef
        process.env.SHARED_ENVS.APIGEE_BASE_URL +
        customLayerEndPoints.GET_PRIMARY_SUB_ACCOUNTS
      );
      return response['data']['users'];
    } catch (e) {
      return null;
    }
  },
  async assignGuestToTicket(data) {
    try {
      const request = {
        tickets: data
      }
      // eslint-disable-next-line no-undef
      const response = await $axios.post(process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.ASSIGN_GUEST,
        request
      );
      return response['data'];
    } catch (e) {
      return null;
    }
  },
  async saveWaiver(data) {
    try {
      // eslint-disable-next-line no-undef
      const response = await $axios.post(process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.SAVE_WAIVER, data);
      return response['data'];
    } catch (e) {
      return null;
    }
  },
  async saveGearApi(data) {
    try {

      let headers = {}

      if (!app.$isUserAuthenticated()) {
        headers['x-access-token'] = sessionStorage.getItem('token')
      }
      // eslint-disable-next-line no-undef
      const response = await $axios.post(process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.GET_GEAR, data, {
        headers
      });
      return response['data'];
    } catch (e) {
      console.log(e);
      return null;
    }
  },
  async getSiteMap() {
    try {
      // eslint-disable-next-line no-undef
      const response = await $axios.get(endPoints.GET_SITEMAP);
      return {
        success: true,
        data: response.data['Result']
      };
    } catch (e) {
      console.log(e)
      return {
        isError: true,
        success: false,
      }
    }
  },
  async downloadTicket(referenceId = null) {
    try {
      const bookingReference = referenceId;

      let headers = {
        'booking-reference': bookingReference,
        'name': 'LEC'
      }

      if (!app.$isUserAuthenticated()) {
        headers['x-access-token'] = sessionStorage.getItem('token')
      }
      // eslint-disable-next-line no-undef
      const {data: response} = await $axios.get(process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.GENERATE_TICKET_PDF, {
          headers
        }
      );

      if ((response || {}).data)
        return response.data;

      return {
        isError: true
      }
    } catch (err) {
      return {
        isError: true
      }
    }
  },
  async getOrderByCode(id, query) {
    try {
      let headers = {};
      if (query && query.token) {
        headers['x-access-token'] = query.token;
        sessionStorage.setItem('token', query.token)
        const urlQuery = Object.assign({}, query);
        delete urlQuery.token;
        app.router.replace({query: urlQuery});
      } else if (sessionStorage.getItem('token') && !app.$isUserAuthenticated()) {
        headers['x-access-token'] = sessionStorage.getItem('token')
      }

      // eslint-disable-next-line no-undef
      const response = await $axios.get(process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.GET_ORDER_BY_CODE + '/' + id, {
        headers
      });
      return response['data'];
    } catch (err) {
      return {
        success: false,
        isError: true,
      };
    }
  },
  async getOrderByTransactionReference(id) {
    try {
      let headers = {};
      if (!app.$isUserAuthenticated()) {
        headers['x-access-token'] = app.$repositories.getGuestJWT();
      }
      // eslint-disable-next-line no-undef
      const response = await $axios.get(process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.GET_ORDER_BY_TRANSACTION_REFRENCE + '/' + id, {headers});
      if (response && response.data && response.data.reservation_code) {
        return {
          success: true,
          reservationCode: response.data.reservation_code
        };
      }

      return {
        success: false
      };
    } catch (err) {
      return {
        success: false
      };
    }
  },
  async getUserAK() {
    // TODO: See why the BE team change this API.
    try {
      // eslint-disable-next-line no-undef
      const {data: res} = await $axios.get(process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.GET_USER_AK);

      if (res && res.users && res.users.length) return res.users[0].user_ak
      return null;
    } catch (err) {
      console.log({err});
      return null;
    }

  },
  async getWaiver(reservationCode) {
    try {
      // eslint-disable-next-line no-undef
      let response = await $axios.get(`${process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.GET_WAIVER}/${reservationCode}`);

      return response.data;
    } catch (err) {
      console.log({err});
      return {
        success: false,
        isError: true
      }
    }
  },
  async getUsersWaiver() {
    try {
      // eslint-disable-next-line no-undef
      let response = await $axios.get(`${process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.GET_USERS_WAIVER}`);

      return response ? response.data : {};
    } catch (e) {
      console.log(e);
      return {};
    }
  },
  async getUserInfo(email) {
    try {
      // eslint-disable-next-line no-undef
      let response = await $axios.post(`${process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.USER_INFO}`, {
        email
      });

      return response.data;
    } catch (e) {
      console.log(e);
    }
  },
  async applyInfo(data) {
    try {
      // eslint-disable-next-line no-undef
      const response = await $axios.post(process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.APPLY_INFO, data);
      return response['data'];
    } catch (e) {
      return null;
    }
  },
  async getGear(reservationCode) {
    try {
      let headers = {};

      if (!app.$isUserAuthenticated()) {
        headers['x-access-token'] = sessionStorage.getItem('token')
      }
      // eslint-disable-next-line no-undef
      let response = await $axios.get(`${process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.GET_GEAR}/${reservationCode}`, {
        headers
      });

      return response.data;
    } catch (err) {
      console.log({err});
      return {
        success: false,
        isError: true
      }
    }
  },
  async getUsersGears(id) {
    try {
      // eslint-disable-next-line no-undef
      let response = await $axios.get(`${process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.GET_USERS_GEAR}/${id}`);

      return response.data;
    } catch (err) {
      console.log({err})
      return ({
        success: false,
        isError: true
      })
    }
  },
  async getGearMetaData() {
    try {
      //CMS URL FOR DOCS
      let currentEnv = app.$isOman() ? 'snowomanlibraries' : app.$isDubai() ? 'default-source' : 'snowabudhabilibraries';
      let endPoint = endPoints.GET_GEAR_META.replace('{location}', currentEnv);
      let fileName = `gear-${app.i18n.localeProperties.detectedLang}`;
      let response = await $axios.get(endPoint + `${fileName}.json?version=${Date.now()}`);
      let defaultMetaData = {
        equipments: [],
        gear: [],
        levels: [],
        height_meta: [],
        weight_meta: []
      };

      return response.data || defaultMetaData;
    } catch (e) {
      console.log(e);
      return {
        equipments: [],
        gear: [],
        levels: [],
        height_meta: [],
        weight_meta: []
      }
    }
  },
  async mafPayAPI(command, actionMethod = "post", params = {}) {
    try {
      // eslint-disable-next-line no-undef
      const qs = require("qs");

      const data = qs.stringify({
        command: command,
        ...params
      });

      const merchantId = app.$getMafPayMerchantId();
      const config = {
        method: actionMethod,
        url: `${process.env.SHARED_ENVS.MAFPAY.BASE_URL}/api`,
        headers: {
          // eslint-disable-next-line no-undef
          "Merchant-Id": merchantId,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: data,
      };

      const {data: res} = await $axios(config);
      if (res && res.responseCode === "000")
        return {
          success: true,
          data: res
        };

      return {
        success: false,
        data: null
      }
    } catch (err) {
      console.log({err})
      return {
        success: false,
        isError: true
      }
    }
  },
  getSiteGeneralContent() {
    return app.store.state.appConfig.bookingMessages;
  },
  async checkUserSession() {
    try {

      // eslint-disable-next-line no-undef
      await $axios.post(`${process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.CHECK_USER_SESSION}`, {});

      return null;
    } catch (err) {
      console.log({err})
      return null;
    }
  },
  async getSkiSchoolTabs() {
    try {
      const response = await $axios.get(endPoints.GET_SKI_SCHOOL_TABS)
      return response.data['Result'];
    } catch (err) {
      return null;
    }
  },
  async getCmsSiteConfig() {
    try {
      const response = await $axios.get(endPoints.GET_SITE_CONFIG);

      return response.data['Result'];
    } catch (err) {
      console.log(err);
    }
  },
  async getWaiverMeta() {
    try {
      // eslint-disable-next-line no-undef
      let endPoint = !app.$isOman() ? app.$isDubai() ? process.env.SKI_DUBAI.CMS_ASSETS : process.env.SNOW_ABD.CMS_ASSETS : process.env.SNOW_OMAN.CMS_ASSETS;
      let fileName = `waiver-meta-${app.i18n.localeProperties.detectedLang}`;
      let response = await $axios.get(endPoint + `${fileName}.json?version=${Date.now()}`);
      let defaultMetaData = {
        skillList: [],
        requirementList: []
      };

      return response.data || defaultMetaData;
    } catch (e) {
      console.log(e);
      return {
        skillList: [],
        requirementList: []
      };
    }
  },
  //SHARE
  async getTransactionHistory(cursor_next) {
    try {
      if (!app.$isUserAuthenticated()) return false;
      if (!app.$isShareMember()) return false;
      let cursor = cursor_next ? `&cursor=${cursor_next}` : ``;
      const env = app.$getSiteCurrentEnvironment();
      // eslint-disable-next-line no-undef
      const sponsorId = env.includes("dhabi") ? process.env.SNOW_ABD.SHARE.SPONSOR_ID : process.env.SKI_DUBAI.SHARE.SPONSOR_ID;

      let config = {
        method: 'get',
        url: `${process.env.SHARED_ENVS.APIGEE_BASE_URL}${customLayerMAFShareEndPoints.SHARE_TRANSACTIONS}?page_size=10&show_sku=true&sponsor_id=${sponsorId}${cursor}`,
      };

      return await $axios(config).then((response) => {
        return response.data;
      }).catch((error) => {
        return error;
      });

    } catch (err) {
      return err;
    }
  },
  async OptIn() {
    // to join unjoined users..
    try {
      if (!app.$isUserAuthenticated()) return false;

      const env = app.$getSiteCurrentEnvironment();
      const sponsorId = env.includes("dhabi") ? process.env.SNOW_ABD.SHARE.SPONSOR_ID : process.env.SKI_DUBAI.SHARE.SPONSOR_ID;

      let userInformation = app.store.getters["currentUser/userInformation"];
      let config = {
        method: 'post',
        url: `${process.env.SHARED_ENVS.APIGEE_BASE_URL}${customLayerMAFShareEndPoints.SHARE_OPTIN}?email=${userInformation.email}&sponsor_id=${sponsorId}`
      };
      return await $axios(config).then((response) => {
        return response.data;
      }).catch((error) => {
        return error;
      });

    } catch (err) {
      return err;
    }
  },
  async pointSimulate(data) {
    // for points calculation
    try {
      if (!app.$isUserAuthenticated()) return false;
      if (!app.$isShareMember()) {
        return app.$calculatePointsLocally(data.pay_in_amount);
      }

      const config = {
        method: 'post',
        url: process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerMAFShareEndPoints.SHARE_SIMULATE,
        data: JSON.stringify({
          pay_in_amount: data.pay_in_amount,
          trx_amount: data.trx_amount
        })
      };

      return await $axios(config).then((response) => {
        return response.data;
      }).catch((error) => {
        console.log({error})
        return error;
      });

    } catch (err) {
      console.log({err})
      return err;
    }
  },
  async shareBalance() {
    try {
      if (!app.$isUserAuthenticated()) return false;
      if (!app.$isShareMember()) return false;
      let config = {
        method: 'get',
        url: process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerMAFShareEndPoints.SHARE_BALANCE,
        headers: {
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*", // Allow from anywhere
          "Access-Control-Allow-Methods": "*" // Allow only GET request
        }
      };

      const response = await $axios(config);
      if (response) return response.data;

      return "";
    } catch (err) {
      console.log('invalid', err);
      return "";
    }
  }
})
