import {AppConfig} from "@/const/variable";

/* eslint-disable no-undef */
const axiosInstance = ({$axios, app, redirect, route}) => {
  $axios.onRequest(async (config) => {

    const currentEnv = app.i18n.locale?.toLowerCase() || 'ski dubai';
    const lang = app.i18n.localeProperties.detectedLang || 'en';

    if (config.url.includes('oauth/token')) {
      const clientId = currentEnv.includes("oman") ? process.env.SNOW_OMAN.MPASS_CLIENT_ID : currentEnv.includes("dhabi") ? process.env.SNOW_ABD.MPASS_CLIENT_ID : process.env.SKI_DUBAI.MPASS_CLIENT_ID;

      let data = config.data.split('&');

      const clientIdEntityIndex = data.findIndex(item => item.includes('client_id'));
      if (clientIdEntityIndex !== -1) {
        data[clientIdEntityIndex] = `client_id=${clientId}`;
      }
      config.data = data.join('&');
    }

    const isUrlIncludes = (name) => config.url?.includes(name);

    const isSitefinity = !isUrlIncludes('https://');
    const isCustomLayerAPI = isUrlIncludes(process.env.SHARED_ENVS.APIGEE_BASE_URL);
    const isMiddlewareAPI = isUrlIncludes(process.env.MIDDLEWARE_BASE_URL);


    if (isSitefinity) {
      if (currentEnv.includes('dhabi')) {
        config.baseURL = process.env.SNOW_ABD.SITEFINITY_DOMAIN;
      } else if (currentEnv.includes('oman')) {
        config.baseURL = process.env.SNOW_OMAN.SITEFINITY_DOMAIN;
      }
    }

    const apigeeKeys = app.store.state.apigeeKeys || {}

    if (!isMiddlewareAPI) {
      if (isSitefinity) {
        config.headers['x-apikey'] = apigeeKeys.sitefinity;
      } else if (isCustomLayerAPI) {
        const selectedSiteConfig = currentEnv.includes('dhabi') ? 'SNOW_ABU_DHABI' : currentEnv.includes('oman') ? 'SNOW_OMAN' : 'SKI_DUBAI';
        config.headers['x-apikey'] = apigeeKeys.customLayer;
        config.headers['site-id'] = AppConfig[selectedSiteConfig].site_id;
        config.headers['lang'] = lang || 'en';
      }
    } else if (config.headers && config.headers['x-apikey']) delete config.headers['x-apikey'];

    if (!isMiddlewareAPI && (isCustomLayerAPI || isUrlIncludes(process.env.SHARED_ENVS.MAFPAY.BASE_URL)) && app.$auth.loggedIn) {
      let accessToken = '';
      let credentials = {};

      const isIgnoreCachedToken = config.data && config.data.isIgnoreCachedToken ? true : config.isIgnoreCachedToken ? true : false;
      if (isIgnoreCachedToken) {
        credentials = await app.$auth.refreshTokens();
        config.data && config.data.isIgnoreCachedToken ? delete config.data.isIgnoreCachedToken : delete config.isIgnoreCachedToken;
      } else {
        const isTokenExpired = app.$auth.strategy.token.status().expired();
        if (isTokenExpired) credentials = await app.$auth.refreshTokens();
      }

      accessToken = credentials && credentials.data && credentials.data.access_token ? credentials.data.access_token : app.$auth?.strategy?.token?.get()?.replace('Bearer ', '');
      config.headers = Object.assign(
        {},
        config.headers,
        {
          Authorization: 'Bearer ' + accessToken, ...(isUrlIncludes('amazonaws.com') ? {token: accessToken} : {})
        }
      );
    }

    if (config.method.toLowerCase() === 'get') {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      config.params = Object.assign({}, config.headers.params, {
        Lang: lang || 'en',
        TimeZone: timezone ? timezone : 'Asia/Dubai'
      });
    }

    return config;
  });

  $axios.onResponse(response => {
    if (response && response.data && response.data.Result === 404 && route.fullPath.indexOf('/page-not-found') === -1) redirect(app.localePath('/page-not-found'));
  });

  // eslint-disable-next-line no-unused-vars
  const clearUserRelatedData = async () => {
    if (app.store.getters["bookingFlow/bookingData"] && app.store.getters["bookingFlow/bookingData"].length) {
      app.store.dispatch("bookingFlow/clearCartAndBookingFlowInfo");
      app.store.dispatch("bookingFlow/clearBookingSessionTimer");
      app.store.dispatch("bookingBar/clearBookingBarData");
    }
    app.store.dispatch("currentUser/clearUserInformation");

    await app.$auth.logout();
    app.$auth.strategies.auth0.reset();
    window.localStorage.setItem('logged_out', 'logout' + new Date())
  };

  //TODO: Get back here.
  $axios.onError(async error => {
    try {
      const originalRequest = error.config;

      if (error?.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const credentials = await app.$auth.refreshTokens();

        if (credentials?.tokenType) {
          const barerAccessToken = `${credentials.tokenType} ${credentials.accessToken}`;
          originalRequest.headers.Authorization = barerAccessToken;
          originalRequest.headers.token = credentials.accessToken;
        }

        return $axios(originalRequest);
      } else if (app.$auth.loggedIn && (!app.$auth.loggedIn || app.$auth.strategy?.token?.status()?.unknown() || error?.response?.status === 403)) await clearUserRelatedData();
    } catch (e) {
      if (app.$auth.loggedIn) await clearUserRelatedData();

      return Promise.reject(e);
    }
    return Promise.reject(error);
  });
}

export default axiosInstance;
