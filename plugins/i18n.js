export default function ({app}) {

  // onLanguageSwitched called right after a new locale has been set
  app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
    if (oldLocale && newLocale) {
      const oldLocation = oldLocale.split('/')[1];
      const newLocation = newLocale.split('/')[1];

      if (oldLocation !== newLocation) {
        // eslint-disable-next-line no-undef
        const clientId = newLocale.includes("oman") ? process.env.SNOW_OMAN.MPASS_CLIENT_ID : newLocale.includes("dhabi") ? process.env.SNOW_ABD.MPASS_CLIENT_ID : process.env.SKI_DUBAI.MPASS_CLIENT_ID;
        const auth0ClientId = app.$auth.ctx.$auth.strategies.auth0.options.clientId;

        if ((app.$auth || {}).loggedIn && auth0ClientId !== clientId) {
          app.$auth.ctx.$auth.strategies.auth0.options.clientId = clientId;
          app.$auth.loginWith("auth0");
        }
      }
    }
  }
}
