<template>
  <!--TODO: enhance the loader functionality and the ordering of the components.-->
  <div id="layout" ref="layout">
    <template v-if="!isMaintenance">
      <MAFLoader :is-loading="isScreenLoaderActive || $route.fullPath.includes('/callback')" />

      <template v-if="isRenderComponents">
        <!--TODO: Remove this 'if' condition when we handle the maintenance page-->
        <Header v-if="!$route.fullPath.includes('/maintenance')" keep-alive :class="{blur:showLoader}" />

        <div :class="{blur:showLoader}" class="content-wrapper min-h-screen">
          <template v-if="isSSRPage">
            <Nuxt />
          </template>

          <template v-else>
            <client-only>
              <Nuxt />
            </client-only>
          </template>
        </div>

        <client-only>
          <BookingSessionTimer />
          <BottomBar
            v-if="isShowBottomBar" id="BottomBar" ref="BottomBar"
            :ctas="BottomBarData"
            :class="{blur:showLoader}"
          />
          <FindTicketsBar v-if="isBookingBarVisible && !isHideBookingBar" :class="{blur:showLoader}" />
          <WarningModal
            :modal-data="warningModalData"
            :is-modal-active="isWarningModalActive"
            @closeModal="isWarningModalActive = false"
          />
          <Toast />
          <CircleLoader v-if="showLoader" :show-overlay="true" />
        </client-only>

        <Footer :is-visible="isFooterVisible" keep-alive :class="{blur:showLoader}" />
      </template>
      <template v-else>
        <client-only>
          <Nuxt />
        </client-only>
      </template>
    </template>
    <Maintenance v-else />
    <script type="application/ld+json" v-html="jsonld" />
  </div>
</template>

<script>
import MAFLoader from "@/components/Shared/Loaders/MAFLoader";
import Header from "@/components/Shared/Header";
import BookingSessionTimer from "@/components/Shared/BookingSessionTimer";
import BottomBar from "@/components/Shared/BottomBar";
import FindTicketsBar from "@/components/BookingBar/FindTicketsBar";
import WarningModal from "@/components/Shared/WarningModal";
import Footer from "@/components/Shared/Footer";
import Maintenance from "@/components/MaintenancePage";

import Toast from "@/components/Shared/Toast";
import {CommonEvent} from "@/services/app-events";

import {mapGetters} from "vuex";
import {InvalidateCache} from "@/plugins/cache-invalidator";
import {appConfig} from "@/plugins/app-config";

export default {
  components: {
    MAFLoader,
    Header,
    BookingSessionTimer,
    BottomBar,
    FindTicketsBar,
    WarningModal,
    Footer,
    Toast,
    Maintenance
  },
  mixins: [InvalidateCache, appConfig],
  data() {
    return {
      isShowBottomBar: false,
      isShowBookingBar: true,
      isWarningModalActive: false,
      isScreenLoaderActive: false,
      BottomBarData: null,
      warningModalDefaultData: {
        actionType: "logout",
        title: this.$t('COMMON.WARNING_MODAL.LOGOUT_MODAL.TITLE'),
        description: this.$t('COMMON.WARNING_MODAL.LOGOUT_MODAL.DESCRIPTION'),
        continueText: this.$t('COMMON.WARNING_MODAL.LOGOUT_MODAL.CONTINUE_TEXT'),
        btnConfirmationText: this.$t('COMMON.WARNING_MODAL.LOGOUT_MODAL.BTN_CONFIRMATION')
      },
      warningModalData: {},
      showLoader: false,
      // TODO: Modify this -- Important.
      pagesWithoutFooter: ["booking-confirmed", "/extra/add-guest", "/extra/waiver", "/extra/gear", "/extra/confirm", "/booking", "/booking-failed", "/maintenance"],
      pagesWithoutBookingBar: ["/accounts", "/ski-academy", "/ski-lessons", "/snowboard-lessons", "/plan-your-visit/come-prepared", "/booking-confirmed", "/extra/add-guest", "/extra/waiver", "/extra/gear", "/extra/confirm", "/booking", "/page-not-found", "/contact-us", "/find-your-booking", "/unauthorized", "/sitemap", "/booking-failed", "/maintenance"],
      pagesWithoutSRR: ["/accounts", "/booking", "/extra/", "/callback"],
      qsiTimeOut: null,
      isMaintenance: false,
      isHideBookingBar: false,
      jsonld: {}
    };
  },
  async fetch() {
    if (this.isRenderComponents) {
      const cmsSiteConfig = await this.$repositories.getCmsSiteConfig();

      if (cmsSiteConfig) {
        this.isMaintenance = cmsSiteConfig.enable_maintenance_page;
        this.isHideBookingBar = cmsSiteConfig.hide_booking_bar;
      }

      const siteConfig = this.$getSiteConfig();

      this.jsonld = JSON.stringify({
        "@context": "http://schema.org",
        "@type": "Organization",
        name: siteConfig.title,
        // eslint-disable-next-line no-undef
        url: process.env.SHARED_ENVS.WEB_BASE_URL + '/' + this.$i18n.locale,
        sameAs: siteConfig.socialMediaLinks,
        // eslint-disable-next-line no-undef
        logo: process.env.SHARED_ENVS.WEB_BASE_URL + siteConfig.siteLogo,
      });
    }
  },
  head() {
    let localHead = this.$nuxtI18nHead({addDirAttribute: true, addSeoAttributes: true})
    const dubaiPages = ['snowboard-lessons', 'ski-lessons', 'ski-academy', 'passes-packages/christmas']
    const omanPages = ['ice-rink']
    const ignoreLang = ['en', 'ar', 'x-default']
    const isDetailsPage = this.$route.name && this.$route.name.replace(`___${this.$i18n.locale}`, "") === "name"
    //TODO to be handled with router auth
    const isDubaiPage = new RegExp(dubaiPages.join("|")).test(this.$route.fullPath)
    const isOmanPage = new RegExp(omanPages.join("|")).test(this.$route.fullPath)
    if ((isDetailsPage && this.$route.fullPath.includes('ski-dubai')) || isDubaiPage) {
      localHead.link = localHead.link.filter(item => item.href.includes('dubai') && !ignoreLang.includes(item.hreflang))
      localHead.meta = localHead.meta.filter(item => item.content.includes('dubai'))
    } else if ((isDetailsPage && this.$route.fullPath.includes('snow-oman')) || isOmanPage) {
      localHead.link = localHead.link.filter(item => item.href.includes('om') && !ignoreLang.includes(item.hreflang))
      localHead.meta = localHead.meta.filter(item => item.content.includes('om'))
    } else {
      localHead.link = localHead.link.filter(item => !ignoreLang.includes(item.hreflang))
    }

    return localHead
  },
  computed: {
    ...mapGetters("currentUser", ["userInformation"]),
    isFooterVisible() {
      return !this.pagesWithoutFooter.find((pageRoute) => this.$route.fullPath.includes(pageRoute));
    },
    isBookingBarVisible() {
      if (this.isHideBookingBar) return false;

      const isVisible = this.pagesWithoutBookingBar.find((pageRoute) =>
        this.$route.fullPath.includes(pageRoute)
      )
        ? false
        : !this.isShowBottomBar && this.isShowBookingBar;

      return isVisible;
    },
    isSSRPage() {
      const isSSR =
        this.$route.name &&
        this.$route.name.replace(`___${this.$i18n.locale}`, "") === "name"
          ? true
          : !this.pagesWithoutSRR.find((pageRoute) => this.$route.fullPath.includes(pageRoute));

      return isSSR;
    },
    isRenderComponents() {
      return !this.$route.fullPath.includes("/callback?code");
    }
  },
  watch: {
    $route: function () {
      this.isShowBottomBar = false;
      this.isShowBookingBar = true;
      this.qsiTimeOut = setTimeout(() => {
        if ((window || {}).QSI && this.$callQSI) this.$callQSI();
      }, 2000);
    }
  },
  beforeMount() {
    if (this.isRenderComponents) {
      CommonEvent.$on("show-bottom-bar", (event) => {
        this.isShowBottomBar = event;
      });

      CommonEvent.$on("show-booking-bar", (event) => {
        this.isShowBookingBar = event;
      });

      CommonEvent.$on("show-warning-modal", (event) => {
        if (event.actionType) {
          this.warningModalData = event;
          this.isWarningModalActive = true;
        } else {
          this.warningModalData = {...this.warningModalDefaultData};
          this.isWarningModalActive = event;
        }
      });

      CommonEvent.$on("global-loader", (event) => {
        this.showLoader = event;
      });

      CommonEvent.$on("show-screen-loader", (event) => {
        this.isScreenLoaderActive = event;
      });
    }
  },
  mounted() {
    if (this.isRenderComponents) {
      this.$globalData.isMobileDevice = this.$detectMobile();
      this.$globalData.isDesktopDevice = this.$detectDesktop();

      CommonEvent.$on("resize-event", () => {
        this.$globalData.isMobileDevice = this.$detectMobile();
        this.$globalData.isDesktopDevice = this.$detectDesktop();
      });

      //call every 5 min to check if the Maintenance mode on/off
      setInterval(async () => {
        const cmsSiteConfig = await this.$repositories.getCmsSiteConfig();

        if (cmsSiteConfig) {
          this.isMaintenance = cmsSiteConfig.enable_maintenance_page;
        }
      }, 300000);

      this.$repositories.sendPvEvent();

      this.$router.afterEach(() => {
        window.reloadOTBanner();
        this.$repositories.sendPvEvent();
      });

      this.userSessionHandler();
      window.addEventListener("storage", this.storageChange, false);
      window.addEventListener("resize", this.$onResize);
    }
  },
  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle
  beforeDestroy() {
    if (this.$isUserAuthenticated()) window.removeEventListener("storage", this.storageChange, false);
    if (this.qsiTimeOut) clearTimeout(this.qsiTimeOut);
    window.removeEventListener("resize", this.$onResize);
  },
  methods: {
    storageChange({key}) {
      if (key === "logged_out") window.location.href = this.localePath("/");
      else if (key === "logged_in" || key === "hard_refresh_pages") {
        const isHardReload = key === "hard_refresh_pages";
        window.location.reload(isHardReload);
      }
    },
    userSessionHandler() {
      if (this.$isUserAuthenticated()) {
        this.$repositories.checkUserSession();
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") this.$repositories.checkUserSession();
        });
      }
    }
  }
};
</script>
<style>
.blur {
  filter: blur(0.5px);
}
</style>
