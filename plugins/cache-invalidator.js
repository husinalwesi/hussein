/**
 * @description - next build version
 */
const projectVersion = 15;

/**
 * @description - set true to remove everything
 */
const forceClear = true;

export const InvalidateCache = {
  mounted() {
    this.$nextTick(() => {
      const userVersion = localStorage.getItem('version');

      if (userVersion && projectVersion > +userVersion) {
        this.resetData();
      } else localStorage.setItem('version', projectVersion.toString());
    })
  },
  methods: {
    veuxItemsCleaner() {
      this.$store.commit('bookingBar/CLEAR_BOOKING_BAR_DATA')
      this.$store.commit('bookingFlow/CLEAR_CART_BOOKING_FLOW_INFO')
      this.$store.commit('bookingFlow/CLEAR_BOOKING_SESSION_TIMER')
      this.$store.commit("packageSelection/setSelection", '');
      this.$store.dispatch("bookingFlow/clearCartAndBookingFlowInfo");
      this.$store.dispatch("bookingFlow/clearBookingSessionTimer");
      this.$store.commit("paymentCards/SET_CARDS", []);
    },
    /**
     if projectVersion  > userVersion && !forceClear  will remove everything with keep user login
     if projectVersion  > userVersion && forceClear  will remove everything with logout user
     */
    resetData() {
      if (forceClear) {
        this.deleteAllCookies();
        this.$store.dispatch("currentUser/clearUserInformation");
        this.veuxItemsCleaner();
        window.localStorage.clear();
      } else {
        this.veuxItemsCleaner();
      }
      localStorage.setItem('version', projectVersion.toString());
      window.location.reload(true);
    },
    /**
     remove all cookies by change expiry date
     */
    deleteAllCookies() {
      let cookies = document.cookie.split(";");

      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let eqPos = cookie.indexOf("=");
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
  }
}
