<template>
  <footer
    v-if="!isLoading && isVisible"
    class="footer"
    :class="{'pt-12': !(data.main_footer && data.main_footer.back_to_top_cta)}"
  >
    <div
      v-if="data.main_footer && data.main_footer.back_to_top_cta"
      class="back-to-top-btn-wrapper"
    >
      <button type="button" class="btn-back-to-top" @click.prevent="scrollToTop()">
        {{ data.main_footer.back_to_top_cta.title ? data.main_footer.back_to_top_cta.title : $t("FOOTER.BACK_TO_TOP") }}
      </button>
    </div>

    <div class="footer-content-container">
      <div
        v-if="data.main_footer"
        class="w-full flex justify-center lg:w-fit mb-4 lg:mb-[42px]"
      >
        <template v-if="data.main_footer.first_section && data.main_footer.first_section.image">
          <NuxtLink :to="localePath('/')" aria-label="logo">
            <img
              :src="data.main_footer.first_section.image.image_url"
              :alt="data.main_footer.first_section.image.alt_text"
              :title="data.main_footer.first_section.image.title"
              width="115"
              height="47.8"
              class="w-[115px] max-h-[47.8px] h-[47.8px]"
            >
          </NuxtLink>
        </template>
      </div>

      <div v-if="data.main_footer" class="site-links-container">
        <div
          v-if="data.main_footer.first_section"
          class="site-general-info-container"
        >
          <p v-if="data.main_footer.first_section.first_text">
            {{ data.main_footer.first_section.first_text }}
          </p>
          <p v-if="data.main_footer.first_section.second_text">
            {{ data.main_footer.first_section.second_text }}
          </p>
          <p v-if="data.main_footer.first_section.third_text" class="number-input">
            {{ data.main_footer.first_section.third_text }}
          </p>
        </div>

        <div class="list-container">
          <div class="list-header">
            <h6 class="title">
              {{
                data.main_footer.second_section && data.main_footer.second_section.title ? data.main_footer.second_section.title : currentLocation
              }}
            </h6>

            <arrow-svg
              :with-wrapper="true"
              :arrow-color="'black'"
              :direction="activeListType === 'secondSection' ? 'up' : 'down'"
              :wrapper-class="`w-8 h-8 lg:hidden ${activeListType === 'secondSection' ? 'bg-[#D9D9D9]' : 'bg-transparent'}`"
              width="13"
              height="13"
              @onArrowClick="toggleActiveList('secondSection')"
            />
          </div>
          <div
            v-if="$globalData.isDesktopDevice ? true : activeListType === 'secondSection'"
            class="list-wrapper"
          >
            <ul
              v-if="
                data.main_footer.second_section &&
                  data.main_footer.second_section.items &&
                  data.main_footer.second_section.items.length
              "
              class="flex flex-col gap-y-6 lg:gap-y-2"
            >
              <li
                v-for="item in data.main_footer.second_section.items"
                :key="item.id"
              >
                <BaseButton
                  :cta="item"
                  :btn-type="$isExternalLink(item.url) ? 'externalLink' : 'link'"
                  class-name="item-link"
                  :text="item.title"
                  :path="item.url"
                />
              </li>
              <template v-if="!data.main_footer.third_section">
                <li>
                  <BaseButton
                    btn-type="button"
                    class-name="item-link"
                    :text="$t('FOOTER.PRIVACY_CENTER')"
                    @onBtnClick="getPrivacyUrl()"
                  />
                </li>
                <li>
                  <BaseButton
                    btn-type="button"
                    class-name="item-link"
                    :text="$t('FOOTER.COOKIE_SETTINGS')"
                    @onBtnClick="openCookieSetting()"
                  />
                </li>
              </template>
            </ul>
          </div>
        </div>

        <div v-if="data.main_footer.third_section" class="list-container">
          <div class="list-header">
            <h6 class="title">
              {{
                data.main_footer.third_section.title ? data.main_footer.third_section.title : $t("FOOTER.HELP_AND_SUPPORT")
              }}
            </h6>

            <arrow-svg
              :with-wrapper="true"
              :arrow-color="'black'"
              :direction="activeListType === 'thirdSection' ? 'up' : 'down'"
              :wrapper-class="`w-8 h-8 lg:hidden ${activeListType === 'thirdSection' ? 'bg-[#D9D9D9]' : 'bg-transparent'}`"
              width="13"
              height="13"
              @onArrowClick="toggleActiveList('thirdSection')"
            />
          </div>

          <div
            v-if="$globalData.isDesktopDevice ? true : activeListType === 'thirdSection'"
            class="list-wrapper"
          >
            <ul
              class="flex flex-col gap-y-6 lg:gap-y-2"
            >
              <template
                v-if="
                  data.main_footer.third_section.items &&
                    data.main_footer.third_section.items.length
                "
              >
                <li
                  v-for="item in data.main_footer.third_section.items"
                  :key="item.id"
                >
                  <BaseButton
                    :cta="item"
                    :btn-type="$isExternalLink(item.url) ? 'externalLink' : 'link'"
                    class-name="item-link"
                    :text="item.title"
                    :path="item.url"
                  />
                </li>
              </template>
              <li>
                <BaseButton
                  btn-type="button"
                  class-name="item-link"
                  :text="$t('FOOTER.PRIVACY_CENTER')"
                  @onBtnClick="getPrivacyUrl()"
                />
              </li>
              <li>
                <BaseButton
                  btn-type="button"
                  class-name="item-link"
                  :text="$t('FOOTER.COOKIE_SETTINGS')"
                  @onBtnClick="openCookieSetting()"
                />
              </li>
            </ul>
          </div>
        </div>

        <div v-if="data.main_footer.fourth_section" class="fourth-part">
          <label
            v-if="data.main_footer.fourth_section.title"
            class="part-title"
          >{{ data.main_footer.fourth_section.title }}</label>
          <div
            v-if="data.main_footer.fourth_section.description"
            class="description"
            v-html="data.main_footer.fourth_section.description"
          />

          <ValidationObserver
            ref="join-community"
            v-slot="{ invalid }"
            class="flex flex-wrap gap-y-4 items-start"
          >
            <div class="flex-1 min-550:max-w-[204px] ltr:mr-2 rtl:ml-2">
              <BaseInput
                v-model="email"
                i-n-ptype="email"
                i-n-pname="email"
                :i-n-pplaceholder="$t('CREDENTIALS_FORM.FIELDS.EMAIL')"
                :rules="{
                  required: true,
                  max: 254,
                  emailRegex: true,
                }"
              />

              <div v-if="isUserJoinedOurCommunity" class="mt-2">
                <label class="joined-text">{{ $t("FOOTER.JOIN_COMMUNITY.SUCCESS_JOINING") }}</label>
              </div>
            </div>
            <BaseButton
              btn-type="button"
              :text="`${
                data.main_footer.fourth_section.cta &&
                data.main_footer.fourth_section.cta.title
                  ? data.main_footer.fourth_section.cta.title
                  : $t('COMMON.JOIN')
              }`"
              :is-loading="isJoinOurCommunityLoading"
              :b-t-ndisabled="invalid || (email === userSavedEmail && isUserJoinedOurCommunity) || isJoinOurCommunityLoading"
              loader-wrapper-classes="absolute top-0 ltr:left-0 rtl:right-0"
              loader-classes="w-12 h-12"
              loader-color="#fff"
              class-name="btn-join-community"
              @onBtnClick="validateJoinCommunityForm"
            />
          </ValidationObserver>
        </div>
      </div>

      <div v-if="data.sub_footer" class="h-px bg-[#ECECEC] w-full px-4 lg:px-0 lg:mt-12 my-6" />

      <div v-if="data.sub_footer" class="second-footer-container">
        <div class="left-part-container">
          <div
            v-if="data.sub_footer.first_section"
            class="social-media-links-container"
          >
            <label
              v-if="data.sub_footer.first_section.title"
              class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold  text-sm leading-4 text-dark-gray"
            >
              {{ data.sub_footer.first_section.title }}
            </label>
            <ul
              v-if="data.sub_footer.first_section.items && data.sub_footer.first_section.items.length"
              class="flex flex-wrap gap-2"
            >
              <template v-for="item in data.sub_footer.first_section.items">
                <li v-if="item.icon" :key="item.id">
                  <a
                    :href="item.url"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="social media button"
                    @click="addEvent(item)"
                  >
                    <img
                      :src="item.icon.image_url"
                      :alt="item.icon.alt_text"
                      :title="item.icon.title"
                      width="24"
                      height="24"
                      class="social-media-icon"
                    >
                  </a>
                </li>
              </template>
            </ul>
          </div>

          <div v-if="data.sub_footer.second_section" class="app-links-container">
            <label
              v-if="data.sub_footer.second_section.title"
              class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold  text-sm leading-4 text-dark-gray"
            >
              {{ data.sub_footer.second_section.title }}
            </label>

            <ul
              v-if="data.sub_footer.second_section.app_store_cta || data.sub_footer.second_section.google_play_cta"
              class="flex flex-wrap gap-4"
            >
              <li :class="{'hidden': $globalData.isDesktopDevice ? false : !isSafari}">
                <a
                  v-if="data.sub_footer.second_section.app_store_cta"
                  :href="data.sub_footer.second_section.app_store_cta.url"
                  target="_blank"
                  class="cursor-pointer"
                  @click="addInstallAppEvent('app store')"
                >
                  <img
                    v-if="data.sub_footer.second_section.app_store_cta.icon"
                    :src="data.sub_footer.second_section.app_store_cta.icon.image_url"
                    :title=" data.sub_footer.second_section.app_store_cta.icon.title"
                    :alt="data.sub_footer.second_section.app_store_cta.icon.alt_text"
                    width="120"
                    height="40"
                    class="w-[120px] h-10"
                  >
                </a>
              </li>
              <li :class="{'hidden':$globalData.isDesktopDevice?false:isSafari}">
                <a
                  v-if="data.sub_footer.second_section.google_play_cta"
                  :href="data.sub_footer.second_section.google_play_cta.url"
                  target="_blank"
                  class="cursor-pointer"
                  @click="addInstallAppEvent('play store')"
                >
                  <img
                    v-if="data.sub_footer.second_section.google_play_cta.icon"
                    :src="data.sub_footer.second_section.google_play_cta.icon.image_url"
                    :title="data.sub_footer.second_section.google_play_cta.icon.title"
                    :alt="data.sub_footer.second_section.google_play_cta.icon.alt_text"
                    width="135"
                    height="40"
                    class="w-[135px] h-10"
                  >
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div v-if=" data.sub_footer.third_section && data.sub_footer.third_section.length" class="right-part-wrapper">
          <ul class="flex flex-wrap justify-start gap-2 lg:justify-end">
            <li
              v-for="item in data.sub_footer.third_section"
              :key="item.id"
              class="w-10 h-6"
            >
              <img
                :src="item.image_url"
                :alt="item.alt_text"
                :title="item.title"
                width="40"
                height="24"
                class="w-10 h-6 max-h-[24px]"
              >
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-[#2F261E] px-4 py-[22px] lg:px-15">
      <div
        class="
          flex flex-col
          items-start
          justify-between
          lg:flex-row lg:items-center
        "
      >
        <div class="flex flex-col">
          <label class="text-white ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-xs mb-4">{{
            $t("FOOTER.BROUGHT_TO_YOU")
          }}</label>
          <a
            href="//www.majidalfuttaim.com"
            target="_blank"
            rel="noreferrer"
            aria-label="maf official website"
          >
            <MAF />
          </a>
        </div>
        <div class="mt-4 lg:mt-0 text-white ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-xs">
          {{ allRightsReservedText }}
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import gsap from "gsap";
import {ScrollToPlugin} from "gsap/all";

import BaseButton from "@/components/Shared/BaseUI/BaseButton";
import {ValidationObserver} from 'vee-validate';
import BaseInput from "@/components/Shared/BaseUI/FormElements/BaseInput";
import ArrowSvg from "@/components/SVGElements/arrow-svg.vue";
import MAF from "@/components/SVGElements/MAF.vue";

import {endPoints} from "@/const/api";
import {customLayerEndPoints} from "@/const/api";
import {newsletterTypes} from "@/const/enum";

/* eslint-disable no-undef */

export default {
  components: {
    BaseButton,
    ValidationObserver,
    BaseInput,
    ArrowSvg,
    MAF
  },
  props: {
    isVisible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isError: false,
      isLoading: false,
      data: {},
      email: "",
      activeListType: "",
      userSavedEmail: null,
      isJoinOurCommunityLoading: false,
      isUserJoinedOurCommunity: false,

      isSafari: false,
      currentLocation: "",
      allRightsReservedText: ''
    };
  },
  async fetch() {
    try {
      this.isLoading = true;

      const {data: res} = await this.$axios.get(endPoints.GET_FOOTER);

      // TODO: show no data msg when there's no data found.
      if (res.Success && res.Result) this.data = res.Result;

      this.currentLocation = this.$getSiteCurrentEnvironment(false, true);
      const currentYear = new Date().getFullYear();
      this.allRightsReservedText = this.$t("FOOTER.ALL_RIGHTS_RESERVED", {
        location: this.$t(`LOCATIONS.${this.currentLocation}`),
        year: currentYear,
      });

      this.isLoading = false;
    } catch (err) {
      this.isError = true;
      this.isLoading = false;
      console.log({err});
    }
  },
  mounted() {
    const mobileOS = this.$getMobileOS(navigator.userAgent || navigator.vendor || window.opera)
    this.isSafari = mobileOS === 'iOS';

    gsap.registerPlugin(ScrollToPlugin);
  },
  methods: {
    scrollToTop() {
      gsap.to(window, {duration: 1, scrollTo: 0});
    },
    async joinCommunity() {
      try {
        this.isJoinOurCommunityLoading = true;

        const res = await this.$axios.post(
          process.env.SHARED_ENVS.APIGEE_BASE_URL +
          customLayerEndPoints.JOIN_NEWS_LETTER,
          {email: this.email, newsletter_type: newsletterTypes.JOIN_NEWSLETTER},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res && res.status === 200 && res.data && res.data.email) {
          this.$repositories.updatesNewsletterEvent(this.email)
          this.$showToast({
            type: "green",
            text: this.$t("FOOTER.JOIN_COMMUNITY.DESCRIPTION")
          });
          this.userSavedEmail = this.email;
          this.isUserJoinedOurCommunity = true;
        } else
          this.$showToast({
            type: "red",
            text: this.$t("COMMON.ERROR_MESSAGES.ERROR_OCCURRED")
          });
        this.isJoinOurCommunityLoading = false;
      } catch (err) {
        this.isJoinOurCommunityLoading = false;
        this.$showToast({
          type: "red",
          text: this.$t("COMMON.ERROR_MESSAGES.ERROR_OCCURRED")
        });
        console.log({err});
      }
    },
    validateJoinCommunityForm() {
      this.$refs["join-community"].validate().then((res) => {
        if (res) this.joinCommunity();
      });
    },
    addEvent(item) {
      this.$repositories.socialMediaEvent(item)
    },
    toggleActiveList(listType) {
      if (this.activeListType === listType) this.activeListType = "";
      else this.activeListType = listType;
    },
    async getPrivacyUrl() {
      let url = `${process.env.PRIVACY_CENTER_URL}${process.env.PRIVACY_CENTER_APP_ID}?lang=${this.$i18n.localeProperties.detectedLang}`;
      if (this.$isUserAuthenticated()) {
        const accessToken = await this.$getToken(false);
        url += `&access-token=${accessToken}`
      }

      window.open(url, '_blank');
    },
    addInstallAppEvent(type) {
      this.$repositories.installAppEvent(type)
    },
    openCookieSetting() {
      window.OneTrust.ToggleInfoDisplay()
    }
  }
};
</script>
<style scoped lang="scss">
@import "./Footer.scss";
</style>
