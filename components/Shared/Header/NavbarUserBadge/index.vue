<template>
  <div class="user-badge-container">
    <div
      v-if="userCredentials.isLoggedIn && userInformation"
      class="logged-in-user-menu"
      @mouseleave="$globalData.isDesktopDevice ? $emit('toggleUserMenu', true) : ''"
    >
      <div class="user-avatar-container" @click="$emit('toggleUserMenu')">
        <div
          v-if="userInformation.gender"
          class="user-avatar"
          :class="{ active: userMenuIsOpen }"
          :style="{
            backgroundImage: `url(${
              userInformation.gender === 'male' && !!(userIcons.maleIcon||{}).image_url
                ? userIcons.maleIcon.image_url
                : userInformation.gender === 'female' && !!(userIcons.femaleIcon || {}).image_url
                  ? userIcons.femaleIcon.image_url
                  : require(`@/assets/images/Shared/user-gender/${userInformation.gender}.webp`)
            })`,
          }"
        />
      </div>

      <div v-if="userMenuIsOpen" class="user-menu-box-wrapper">
        <div class="user-menu-box-container">
          <div class="user-menu">
            <h3 :class="$globalData.isDesktopDevice ? 'title' : 'username'">
              {{
                $globalData.isDesktopDevice
                  ? (userBadgeData || {}).title || defaultData.title
                  : `${$t('HEADER.WELCOME') + ' ' + userInformation.firstName}`
              }}
            </h3>

            <ul
              v-if="((userBadgeData || {}).menu_items || []).length"
              class="cta-list"
            >
              <li
                v-for="cta in userBadgeData.menu_items"
                :key="cta.id"
                class="cta-link-wrapper"
              >
                <NuxtLink
                  :to="cta.url ? localePath(cta.url) : $route.path" class="cta-link"
                  @click.native="$emit('closeSideBar')"
                >
                  <span class="image-wrapper">
                    <img
                      v-if="cta.icon"
                      :src="cta.icon.image_url"
                      :alt="cta.icon.alt_text"
                      :title="cta.icon.title"
                      width="29"
                      height="29"
                      class="w-[29px] h-[29px] max-w-[29px] max-h-[29px]"
                    >
                  </span>
                  {{ cta.title }}
                </NuxtLink>
              </li>
            </ul>
            <template v-if="userBadgeData.show_share">
              <NuxtLink
                :to="localePath(defaultData.shareData.url)"
                class="share-points-link"
                @click.native="$emit('closeSideBar')"
              >
                <share-logo-icon />
                <div v-if="userCredentials.isShareMember" class="share-points">
                  <snowflake-loader
                    v-if="isGetSharePointsLoading"
                    loader-classes="w-12 h-12"
                  />
                  <template v-else>
                    <!--//TODO: Modify the 'points' text in Arabic to be more specific(whether to show نقاط or نقطة based on the value of points) when we have time.-->
                    <p>
                      {{
                        `${$t("COMMON.BINARY_PARTS", {
                          key: userShareData.points,
                          value: $t('COMMON.POINTS')
                        })}`
                      }}
                    </p>
                    <p>
                      {{
                        `(${$t("COMMON.BINARY_PARTS", {
                          key: currency,
                          value: userShareData.value
                        })})`
                      }}
                    </p>
                  </template>
                </div>
              </NuxtLink>
            </template>
          </div>

          <div class="divider-dashed" />

          <button type="button" class="btn-logout" @click="onLogoutBtnClick">
            <span class="image-wrapper">
              <img
                :src="
                  userBadgeData &&
                    userBadgeData.log_out_item &&
                    userBadgeData.log_out_item.icon &&
                    userBadgeData.log_out_item.icon.image_url
                    ? userBadgeData.log_out_item.icon.image_url
                    : defaultData.logoutBtn.img.image_url
                "
                :alt="
                  userBadgeData &&
                    userBadgeData.log_out_item &&
                    userBadgeData.log_out_item.icon &&
                    userBadgeData.log_out_item.icon.alt_text
                    ? userBadgeData.log_out_item.icon.alt_text
                    : defaultData.logoutBtn.img.alt
                "
                :title="
                  userBadgeData &&
                    userBadgeData.log_out_item &&
                    userBadgeData.log_out_item.icon &&
                    userBadgeData.log_out_item.icon.title
                    ? userBadgeData.log_out_item.icon.title
                    : defaultData.logoutBtn.img.title
                "
                width="29"
                height="29"
                class="w-[29px] h-[29px] max-w-[29px] max-h-[29px]"
              >
            </span>
            {{ ((userBadgeData || {}).log_out_item || {}).title || defaultData.logoutBtn.title }}
          </button>
        </div>
      </div>
    </div>
    <button v-else class="btn-sign-in" @click="onSignInBtnClick">
      {{ $t('HEADER.SIGN_IN') }}
    </button>
  </div>
</template>

<script>
import ShareLogoIcon from "@/components/SVGElements/share-logo-icon.vue";

import {mapGetters} from "vuex";
import {CommonEvent} from "@/services/app-events";

export default {
  components: {ShareLogoIcon},
  props: {
    userCredentials: {
      type: Object,
      default: () => ({
        isLoggedIn: false,
        isShareMember: false
      })
    },
    isGetSharePointsLoading: {
      type: Boolean,
      default: false,
    },
    userMenuIsOpen: {
      type: Boolean,
      default: false,
    },
    userShareData: {type: Object, default: () => ({})},
    userBadgeData: {type: Object, default: () => ({})},
    userIcons: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['toggleUserMenu', 'closeSideBar'],
  data() {
    /* eslint-disable no-undef */
    return {
      isLoaderEnabled: false,
      openNavbarBadgeBox: false,
      defaultData: {
        title: this.$t('HEADER.MY_ACCOUNT'),
        shareData: {
          isShareMember: false,
          url: "/accounts/share",
          points: "0.00",
          value: "0.00"
        },
        logoutBtn: {
          img: {
            image_url: require("@/assets/images/Header/userMenu/logout.png"),
            alt: "logout",
            title: "logout",
          },
          title: "Log out"
        },
        warningModalData: {
          actionType: "logout",
          title: this.$t("COMMON.WARNING_MODAL.LOGOUT_MODAL.TITLE"),
          description: this.$t("COMMON.WARNING_MODAL.LOGOUT_MODAL.DESCRIPTION"),
          continueText: this.$t("COMMON.WARNING_MODAL.LOGOUT_MODAL.CONTINUE_TEXT"),
          btnConfirmationText: this.$t("COMMON.WARNING_MODAL.LOGOUT_MODAL.BTN_CONFIRMATION")
        }
      },
      currency: "",
      containsShare: "yes",
      siteIsoCode: "are"
    };
  },
  computed: {
    ...mapGetters("currentUser", ["userInformation"]),
    ...mapGetters("bookingFlow", ["bookingData"]),
  },
  mounted() {
    const siteConfig = this.$getSiteConfig();
    this.currency = siteConfig.currency(this.$i18n.localeProperties.detectedLang);
    this.containsShare = siteConfig.containsShare; // yes or no
    this.siteIsoCode = siteConfig.countryDetails.iso3; // iso3 code
    if (this.userCredentials.isLoggedIn) this.setLogoutModalContentMessages();
  },
  methods: {
    async onSignInBtnClick() {
      CommonEvent.$emit("show-screen-loader", true);
      this.$lastRouteHandler(this.$route.fullPath);
      this.$auth.ctx.$auth.strategies.auth0.options.clientId = this.$getMpassClientId();

      await this.$auth.loginWith("auth0", {
        params: {
          lang: this.$i18n.localeProperties.detectedLang,
          share_tc: this.containsShare,
          country: this.siteIsoCode
        }
      });
    },
    async onLogoutBtnClick() {
      if (this.$auth) {
        this.$emit("toggleUserMenu");

        if (this.bookingData && this.bookingData.length) {
          CommonEvent.$emit("show-warning-modal", {
            actionType: "logout",
            title: this.defaultData.warningModalData.title,
            description: this.defaultData.warningModalData.description,
            continueText: this.defaultData.warningModalData.continueText,
            btnConfirmationText: this.defaultData.warningModalData.btnConfirmationText
          });
        } else {
          CommonEvent.$emit("show-screen-loader", true);
          this.$store.dispatch("currentUser/clearUserInformation");
          await this.$auth.logout();
          this.$auth.strategies.auth0.reset();
          window.localStorage.setItem("logged_out", "logout" + new Date());
          this.$repositories.logoutEvent();
        }
      }
    },
    setLogoutModalContentMessages() {
      const res = this.$repositories.getSiteGeneralContent();

      if (res && res.logout_warning_message)
        this.defaultData.warningModalData = {
          actionType: "logout",
          title: res.logout_warning_message.title || this.defaultData.warningModalData.title,
          description: res.logout_warning_message.description || this.defaultData.warningModalData.description,
          continueText: (res.logout_warning_message.left_cta || {}).title || this.defaultData.warningModalData.continueText,
          btnConfirmationText: (res.logout_warning_message.right_cta || {}).title || this.defaultData.warningModalData.btnConfirmationText
        };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./NavbarUserBadge.scss";
</style>
