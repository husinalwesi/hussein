export const state = () => ({
  apigeeKeys: {}
})

export const mutations = {
  SET_APIGEE_KEYS(state, keys) {
    state.apigeeKeys = {
      sitefinity: keys.sitefinity,
      customLayer: keys.tamagotchi,
      mafpay: keys.mafpay,
      mpass: keys.mpass
    }
  }
}

export const actions = {
  async nuxtServerInit({commit}, {app, $auth, $axios}) {
    try {
      /* eslint-disable no-undef */
      const locale = (app.i18n.locale || "ski dubai").toLowerCase();
      const authClientId = locale.includes("oman") ? process.env.SNOW_OMAN.MPASS_CLIENT_ID : locale.includes("dhabi") ? process.env.SNOW_ABD.MPASS_CLIENT_ID : process.env.SKI_DUBAI.MPASS_CLIENT_ID;
      $auth.ctx.$auth.strategies.auth0.options.clientId = authClientId;

      await $axios.$get(process.env.MIDDLEWARE_BASE_URL).then(async apigeeKeys => {
        commit('SET_APIGEE_KEYS', apigeeKeys);
      });
    } catch (err) {
      console.error('Error on [nuxtServerInit] action.', err)
    }
  }
}
