import {customLayerEndPoints} from "@/const/api";
import {endPoints} from "@/const/api";
import moment from "moment";

export const appConfig = {
  created() {
    this.$auth.ctx.$auth.strategies.auth0.options.clientId = this.$getMpassClientId();
  },
  mounted() {
    // We do not need to access these APIs when the callback code re-call page is active.
    if (!this.$route.fullPath.includes("/callback?code")) {
      const detectedLang = this.$i18n.localeProperties.detectedLang;
      const siteCode = this.$getSiteConfig("code");

      if (detectedLang === 'ar') {
        moment.updateLocale('ar', {
          parentLocale: 'ar',
          preparse: function (string) {
            return string;
          },
          postformat: function (string) {
            return string;
          }
        });
      }
      this.$nextTick(() => {
        let htmlEl = document.querySelector("html");
        htmlEl.setAttribute('dir', detectedLang === 'ar' ? 'rtl' : 'ltr');
        htmlEl.setAttribute('lang', detectedLang);
        htmlEl.setAttribute('env', siteCode);
      });

      this.fetchVivaProducts();
      this.fetchBookingMessages();
      if (siteCode.includes("dubai")) {
        this.fetchSkiSchoolTabs();
      }
    }
  },
  methods: {
    async fetchVivaProducts() {
      try {
        // eslint-disable-next-line no-undef
        const result = await this.$axios.$get(process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.GET_VIVA_PRODUCTS);
        if ((result.products || []).length > 0)
          this.$store.commit('appConfig/SET_VIVA_PRODUCTS', result.products);
      } catch (err) {
        console.error(err);
      }
    },
    async fetchBookingMessages() {
      try {
        const bookingMessagesResult = await this.$axios.$get(endPoints.GET_BOOKING_MESSAGES);
        if (bookingMessagesResult && bookingMessagesResult.Success && bookingMessagesResult.Result) this.$store.commit('appConfig/SET_BOOKING_MESSAGES', bookingMessagesResult.Result);
      } catch (err) {
        console.error(err);
      }
    },
    async fetchSkiSchoolTabs() {
      this.$globalData.skiSchoolTabsLabel = await this.$repositories.getSkiSchoolTabs();
    }
  }
}
