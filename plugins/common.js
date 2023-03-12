export default ({app}, inject) => {

  inject('getMobileOS', (userAgent = '') => {
    if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
      return "Android";
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "iOS";
    }

    if (/Version\/[\d.]+.*Safari/.test(userAgent) && !window.MSStream) {
      return "Safari";
    }

    return "unknown";
  });

  inject('bottomBarLoader', (data = {}) => {
    const root = window.$nuxt.$root || {}
    if (root.$children) {
      let layoutComponent = root.$children.find(item => item.$refs['BottomBar'])
      layoutComponent.$refs['BottomBar'].showLoader(data)
    }
  });

  inject('getToken', async (isWithBearerText = true) => {
    try {
      let token = '';
      const isTokenExpired = app.$auth.strategy.token.status().expired();

      if (isTokenExpired) await app.$auth.refreshTokens();
      token = app.$auth.strategy.token.get();

      return isWithBearerText ? token : token.replace('Bearer ', '');
    } catch (err) {
      console.log({err})
    }
  });

  inject('lastRouteHandler', routePath => {
    const activeLocale = app.i18n.locale;
    const path = routePath.replace(`/${activeLocale}`, '');
    const localePath = localStorage.getItem('last-route') ? localStorage.getItem('last-route').replace(`/${activeLocale}`, '') : '';

    if (path.indexOf('/unauthorized') === -1 && path.indexOf('/callback') === -1 && path.indexOf('/page-not-found') === -1 && localePath !== path) {
      // mpass redirect URI when users block their account will contain message param so we need to avoid saving it.
      const detectedPath = path.includes("?message") ? "/" : path;
      localStorage.setItem('last-route', detectedPath);
    }
  });

  inject('isOman', () => {
    const env = app.$getSiteCurrentEnvironment();
    return env.toLowerCase().includes('oman')
  });
  inject('isDubai', () => {
    const env = app.$getSiteCurrentEnvironment();
    return env.toLowerCase().includes('dubai')
  })
  inject('isArabic', () => {
    return app.i18n.localeProperties.detectedLang === 'ar'
  })

  inject('getItemTitle', (item, arKey = 'title_ar', enKey = 'title_en') => {
    return app.i18n.localeProperties.detectedLang === 'ar' ? item[arKey] : item[enKey];
  });

  inject('showToast', (data) => {
    // type: blue, green, orange, red, yellow
    if (app.$isEmptyObject(data.text)) return false;
    window.$nuxt.$notify({
      group: app.$isEmptyObject(data.group) ? "booking-toast" : data.group,
      type: app.$isEmptyObject(data.type) ? "blue" : data.type,
      text: app.$isEmptyObject(data.text) ? "" : data.text,
      duration: app.$isEmptyObject(data.duration) ? 5000 : data.duration,
      speed: app.$isEmptyObject(data.speed) ? 1000 : data.speed,
    });
  });

  inject('isShareMember', () => {
    if (!app.$isUserAuthenticated()) return false;
    if (app.store.state.currentUser.userInformation === null) return false;
    return app.store.state.currentUser.userInformation.share.isShareMember;
  });

  inject('getMemberID', () => {
    return app.store.state.currentUser.userInformation.share.memberID;
  });

  inject('calculatePointsLocally', (amount) => {
    let temp_points_rewarded = amount * 0.3;
    let data = {
      status: "SUCCESS",
      points_rewarded_amount: temp_points_rewarded / 10,
      points_rewarded: temp_points_rewarded,
    };
    return data;
  });

}
