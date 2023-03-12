<template>
  <div />
</template>

<script>
export default {
  name: "Callback",
  nuxtI18n: false,
  mounted() {
    try {
      if (this.$route.query.code) window.location.href = "/callback";
      else if (this.$auth.user) {
        if (!this.$store.getters["currentUser/userInformation"]) {
          const user = this.$auth.user;
          this.$store.dispatch("currentUser/saveUserInformation", {
            info: this.$flattendUserInformation(user, this.$i18n.localeProperties.detectedLang)
          });
          this.clearGuestSession();
          this.$repositories.loginEvent();
        }

        this.setUserAK();
      } else this.lastRouteRedirectHandler();
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    lastRouteRedirectHandler() {
      const lastRoute = localStorage.getItem("last-route") ? localStorage.getItem("last-route") : "/";
      this.$router.push(this.localePath(lastRoute));
    },
    async setUserAK() {
      try {
        const userAK = await this.$repositories.getUserAK();
        this.$store.dispatch("currentUser/updateSpecificEntityInfo", {
          entityName: "userAK",
          entityValue: userAK || null,
        });

        this.lastRouteRedirectHandler();
      } catch (err) {
        console.log({err});
      }
    },
    clearGuestSession() {
      const isGuestInfoFilled = !!this.$store.getters["bookingFlow/guestInformation"];
      if (isGuestInfoFilled) this.$store.commit("bookingFlow/CLEAR_GUEST_INFORMATION");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
