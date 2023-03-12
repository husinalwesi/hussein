<!--//TODO: Enhance and Modify this component once we have time-->
<template>
  <header
    role="navigation"
    class="header-container"
    :class="{
      'highest-order': !!activeMenuType && !$globalData.isDesktopDevice,
      opened: !!activeMenuType && !$globalData.isDesktopDevice,
    }"
  >
    <template v-if="!isLoading && data">
      <template v-if="data.global_message">
        <UpdateMessage :update-message="data.global_message" />
      </template>

      <div class="navbar-wrapper">
        <div
          v-if="activeMenuType === 'items' && !isGlobalHeaderBoxActive"
          class="white-layer"
        />
        <nav class="navbar" :class="{'lg:mt-10': globalHeaderIsVisible}">
          <div
            class="logo-container"
            :class="{'center-logo': headerLogoImageData.isChristmasLogo}"
          >
            <button
              :aria-label="activeMenuType ? 'Close' : 'Open'"
              class="sidebar-toggler-btn"
              @click="sidebarTogglerHandler('items')"
            >
              <close-svg
                v-if="activeMenuType"
                color="black"
                width="24"
                height="24"
              />

              <hamburger-menu-icon
                v-else
                :color="navbarIsInverted ? 'black' : 'white'"
              />
            </button>

            <NuxtLink
              v-if="headerLogoImageData && headerLogoImageData.image_url"
              :to="localePath('/')"
              :class="{'mobile:hidden': !!activeMenuType}"
              @click.native="sidebarTogglerHandler(null, true)"
            >
              <img
                :src="navbarIsInverted && headerLogoImageData.invertedImageUrl ? headerLogoImageData.invertedImageUrl : headerLogoImageData.image_url"
                :alt="headerLogoImageData.alt_text"
                :title="headerLogoImageData.title"
                :width="headerLogoImageData.width"
                :height="headerLogoImageData.height"
                :class="$globalData.isDesktopDevice ? headerLogoImageData.desktopClasses : headerLogoImageData.mobileClasses"
              >
            </NuxtLink>
          </div>

          <div class="navbar-actions-container">
            <div
              class="items-sidebar-wrapper"
              :class="{active: activeMenuType === 'items'}"
            >
              <div class="lg:h-full">
                <template
                  v-if="data.main_header && data.main_header.navbar_items"
                >
                  <NavbarItems
                    :nav-items="data.main_header.navbar_items"
                    :mobile-menu-is-open="activeMenuType === 'items'"
                    :navbar-is-inverted="navbarIsInverted"
                    @closeSideBar="sidebarTogglerHandler(null, true)"
                  />
                </template>
                <div
                  v-if="!$globalData.isDesktopDevice && !$auth.loggedIn"
                  class="access-btns-container"
                >
                  <BaseButton
                    :text="$t('HEADER.SIGN_IN')"
                    btn-type="button"
                    @onBtnClick="onAccessBtnClick"
                  />
                  <div class="sign-up-btn-wrapper">
                    <button class="btn-signup" @click="onAccessBtnClick(true)">
                      {{ $t("HEADER.SIGN_UP") }}
                    </button>
                  </div>
                </div>
              </div>

              <GlobalHeader
                v-if="globalHeaderIsVisible && data && data.global_header"
                :global-header-data="data.global_header"
                :menu-is-active="activeMenuType === 'items'"
                @setBoxType="globalHeaderBoxHandler($event)"
                @closeSideBar="sidebarTogglerHandler(null, true)"
              />
            </div>

            <client-only>
              <div class="lg:ltr:ml-10 lg:rtl:mr-10 flex gap-4 relative">
                <template
                  v-if="data.main_header && data.main_header.empty_cart_state"
                >
                  <NavbarCheckoutPanel
                    :cart-icon="data.main_header.cart_icon"
                    :checkout-panel-data="data.main_header.empty_cart_state"
                    :active-menu-type="activeMenuType"
                    :navbar-is-inverted="navbarIsInverted"
                    @toggleCheckoutMenu="sidebarTogglerHandler('checkout', $event)"
                  />
                </template>
                <template v-if="$globalData.isDesktopDevice || $auth.loggedIn">
                  <NavbarUserBadge
                    :user-badge-data="(data.main_header || {}).my_account ? data.main_header.my_account : {}"
                    :user-menu-is-open="activeMenuType === 'user'"
                    :user-share-data="userShareData"
                    :is-get-share-points-loading="isGetSharePointsLoading"
                    :user-icons="{
                      femaleIcon: (data.main_header || {}).avatar_female_icon,
                      maleIcon: (data.main_header || {}).avatar_male_icon
                    }"
                    :user-credentials="{
                      isLoggedIn: $auth.loggedIn,
                      isShareMember: isUserShareMember
                    }"
                    @toggleUserMenu="sidebarTogglerHandler('user', $event)"
                    @closeSideBar="sidebarTogglerHandler(null, true)"
                  />
                </template>
                <div
                  v-if="bookingSessionTimer.isStart"
                  class="timer-text-wrapper"
                  :class="{'mobile-visually-hidden': !!activeMenuType}"
                >
                  <label class="timer-text">
                    {{
                      $t("HEADER.TICKETS_RESERVED_UNTIL", {
                        time: bookingSessionTimer.endTimeStringFormat,
                        timeOfDay: $t(`COMMON.TIMES_OF_DAY.${bookingSessionTimer.timeOfDay}`)
                      })
                    }}
                  </label>
                  <img
                    :src="require('@/assets/images/Header/yellow-rectangle.png')"
                    alt="yellow rectangle"
                    title="yellow rectangle"
                    width="12"
                    height="12"
                    class="rectangle-indicator-img"
                    :class="$auth.loggedIn ? 'right-position' : 'left-position'"
                  >
                </div>
              </div>
            </client-only>
          </div>
        </nav>
      </div>
    </template>
  </header>
</template>

<script>
import UpdateMessage from "./UpdateMessage";
import NavbarItems from "./NavbarItems";
import BaseButton from "@/components/Shared/BaseUI/BaseButton";
import GlobalHeader from "./GlobalHeader";
import NavbarCheckoutPanel from "./NavbarCheckoutPanel";
import NavbarUserBadge from "./NavbarUserBadge";

import CloseSvg from "@/components/SVGElements/close-svg.vue";
import HamburgerMenuIcon from "@/components/SVGElements/hamburger-menu-icon.vue";

import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

import {mapGetters} from "vuex";
import {CommonEvent} from "@/services/app-events";
import {endPoints} from "@/const/api";

const pagesWithInvertedHeader = ["/accounts", "/sitemap"];

export default {
  components: {
    CloseSvg,
    HamburgerMenuIcon,
    UpdateMessage,
    GlobalHeader,
    NavbarItems,
    BaseButton,
    NavbarCheckoutPanel,
    NavbarUserBadge
  },
  data() {
    return {
      isLoading: false,
      isGetSharePointsLoading: false,
      data: null,
      userShareData: {
        points: "0.00",
        value: "0.00"
      },
      headerLogoImageData: {},
      activeMenuType: null,
      navbarIsInverted: false,
      globalHeaderIsVisible: true,
      isPageHeaderInverted: false,
      isGlobalHeaderBoxActive: false
    };
  },
  async fetch() {
    try {
      this.isLoading = true;

      const {data: res} = await this.$axios.get(endPoints.GET_HEADER);
      // TODO: show no data msg when there's no data found.
      if (res.Success && res.Result) {
        this.data = res.Result;

        const mainHeader = res.Result.main_header || {};
        const christmasLogoObject = mainHeader.event_logo_home_page || mainHeader.event_logo_other_pages;
        const headerImageObject = christmasLogoObject || mainHeader.logo;

        const isChristmasLogo = !!christmasLogoObject;

        this.headerLogoImageData = {
          image_url: headerImageObject.image_url,
          invertedImageUrl: isChristmasLogo
            ? (mainHeader.event_logo_other_pages || mainHeader.event_logo_home_page || {}).image_url
            : "",
          alt_text: headerImageObject.alt_text,
          title: headerImageObject.title,
          width: isChristmasLogo ? "183" : "115",
          height: isChristmasLogo ? "47" : "40",
          desktopClasses: isChristmasLogo ? "max-w-[183px] max-h-[47px]" : "max-w-[115px] max-h-[40px]",
          mobileClasses: isChristmasLogo ? "max-w-[183px] max-h-[47px]" : "max-w-[100px] max-h-[40px]",
          isChristmasLogo: isChristmasLogo
        };
      }

      this.isLoading = false;
    } catch (err) {
      this.isLoading = false;
      console.log({err});
    }
  },
  computed: {
    ...mapGetters("bookingFlow", ["bookingSessionTimer"]),
    isUserShareMember() {
      // eslint-disable-next-line no-undef
      if (this.$auth.loggedIn && process.client) return this.$isShareMember();

      return false;
    }
  },
  watch: {
    //TODO: make the inverting of the header be dynamic.
    $route() {
      // eslint-disable-next-line no-undef
      if (this.data && process.client) this.headerRouterHandler();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.headerMountedHandler();
    });
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.mainHeaderColorsInverterHandler);
    if (ScrollTrigger) ScrollTrigger.getById("headerContainerTrigger")?.kill(true);
  },
  methods: {
    async getUserShareData() {
      this.isGetSharePointsLoading = true;

      const res = await this.$repositories.shareBalance();
      if (res) {
        this.userShareData.points = this.$decimalPlaces(res.balance_points, true);
        this.userShareData.value = this.$decimalPlaces(res.balance_currency_amount, true);
      }

      this.isGetSharePointsLoading = false;
    },
    globalHeaderBoxHandler(boxType) {
      this.isGlobalHeaderBoxActive = !!boxType;
    },
    shareDataHandler() {
      if (
        this.data &&
        this.data.main_header &&
        this.data.main_header.my_account &&
        this.data.main_header.my_account.show_share
      )
        this.getUserShareData();
    },
    hideShowHeaderHandler() {
      const headerContainer = document.querySelector(".header-container");

      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        id: "headerContainerTrigger",
        start: "top top",
        end: 99999,
        onUpdate: (self) => {
          self.direction === -1
            ? headerContainer?.classList.remove("scrollUp")
            : headerContainer?.classList.add("scrollUp");
        },
      });
    },
    mainHeaderColorsInverterHandler() {
      // TODO: change this.
      // We add pageYOffset for compatibility with IE.
      if (window.scrollY >= 60 || window.pageYOffset >= 60) {
        if (!this.isPageHeaderInverted) {
          this.navbarIsInverted = true;
          document.querySelector(".navbar-wrapper")?.classList.add("inverted");
        }

        if (this.globalHeaderIsVisible && this.$globalData.isDesktopDevice)
          this.globalHeaderIsVisible = false;
      } else {
        if (!this.isPageHeaderInverted) {
          this.navbarIsInverted = false;
          document.querySelector(".navbar-wrapper")?.classList.remove("inverted");
        }

        if (!this.globalHeaderIsVisible) this.globalHeaderIsVisible = true;
      }
    },
    bodyOverflowHandler(setBodyOverflowVisible = false) {
      const body = document.querySelector("body");
      const bodyStyles = getComputedStyle(body);

      if (body)
        if (bodyStyles.overflow !== "hidden" && !setBodyOverflowVisible)
          body.style.overflow = "hidden";
        else body.style.overflow = "visible";
    },
    sidebarTogglerHandler(menuTybe, close = false) {
      if (!this.$globalData.isDesktopDevice)
        document
          .querySelector(".header-container")
          .classList.remove("scrollUp");

      if (close) {
        if (!this.$globalData.isDesktopDevice) CommonEvent.$emit("show-booking-bar", true);
        this.activeMenuType = null;
        if (!this.$globalData.isDesktopDevice) this.bodyOverflowHandler(true);
      } else if (
        this.activeMenuType === menuTybe ||
        (menuTybe === "items" && this.activeMenuType)
      ) {
        if (!this.$globalData.isDesktopDevice) CommonEvent.$emit("show-booking-bar", true);
        this.activeMenuType = null;
        if (!this.$globalData.isDesktopDevice) this.bodyOverflowHandler(true);
      } else {
        // TODO: Remove this when we agree on a process to update user SHARE points.
        if (menuTybe === "user" && this.isUserShareMember) this.shareDataHandler();
        if (!this.$globalData.isDesktopDevice) CommonEvent.$emit("show-booking-bar", false);
        this.activeMenuType = menuTybe;
        if (!this.$globalData.isDesktopDevice) this.bodyOverflowHandler();
      }
    },
    async onAccessBtnClick(routingToRegisterPage = false) {
      CommonEvent.$emit("show-screen-loader", true);
      this.$lastRouteHandler(this.$route.fullPath);
      this.$auth.ctx.$auth.strategies.auth0.options.clientId = this.$getMpassClientId();
      const {containsShare, countryDetails} = this.$getSiteConfig();
      await this.$auth.loginWith("auth0", {
        params: {
          routeTo: routingToRegisterPage ? "sp" : "",
          lang: this.$i18n.localeProperties.detectedLang,
          share_tc: containsShare, // yes or no,
          country: countryDetails.iso3 // iso3 code
        }
      });
    },
    pagesDefaultHeaderInverter() {
      this.isPageHeaderInverted = pagesWithInvertedHeader.some(p => this.$route.fullPath.includes(p));

      if (this.isPageHeaderInverted) {
        this.navbarIsInverted = true;
        this.$nextTick(() =>
          document.querySelector(".navbar-wrapper")?.classList.add("inverted")
        );
      } else {
        this.navbarIsInverted = false;
        document.querySelector(".navbar-wrapper")?.classList.remove("inverted");
      }
    },
    headerMountedHandler() {
      this.hideShowHeaderHandler();
      this.bodyOverflowHandler(true);
      this.pagesDefaultHeaderInverter();
      window.addEventListener("scroll", this.mainHeaderColorsInverterHandler);
    },
    headerRouterHandler() {
      if (this.activeMenuType) {
        this.bodyOverflowHandler(true);
        this.activeMenuType = null;
      }
      this.pagesDefaultHeaderInverter();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./Header.scss";
</style>
