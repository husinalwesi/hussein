<!--TODO: Enhance this component and make the shared parts be as shred component-->
<template>
  <div
    class="global-header-container"
    :class="{'z-[40]': activeBoxType && !$globalData.isDesktopDevice}"
  >
    <div class="h-px bg-[#D9D9D9] w-full mb-7 lg:hidden" />
    <div class="lg:flex lg:flex-row lg:gap-x-4 lg:flex-wrap lg:justify-center">
      <div class="lg:flex lg:gap-x-6 lg:relative">
        <div
          v-if="(environments || []).length"
          class="env-list-box-container"
          @mouseleave="$globalData.isDesktopDevice && (environments || []).length > 1 ? toggleActiveBox('env', true) : ''"
        >
          <div
            class="gh-item flex items-center"
            :class="{'lg:cursor-pointer': environments.length > 1}"
            @click.prevent="environments.length > 1 ? toggleActiveBox('env') : ''"
          >
            {{ currentEnv }}
            <template v-if="environments.length > 1">
              <arrow-svg
                direction="down"
                :width="$globalData.isDesktopDevice ? '12' : '16'"
                :height="$globalData.isDesktopDevice ? '12' : '16'"
                :arrow-color="$globalData.isDesktopDevice ? '#0A143299' : '#0A1432CC'"
                class="ltr:ml-[10px] rtl:mr-[10px]"
              />
            </template>
          </div>
          <div
            v-if="environments.length > 1 && activeBoxType === 'env'"
            class="env-list-box-wrapper"
          >
            <div class="content-box">
              <button
                aria-label="Close"
                class="btn-close"
                @click="toggleActiveBox('', true)"
              >
                <close-svg color="black" width="24" height="24" />
              </button>

              <ul>
                <li
                  v-for="environment in environments"
                  :key="environment.id"
                  class="env-item"
                  :class="{selected: currentEnv.toLowerCase() === environment.label.toLowerCase()}"
                  @click="changeEnv(environment)"
                >
                  {{ environment.label }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          v-if="globalHeaderData.live_update"
          class="status-update-box-container"
          @mouseleave="
            $globalData.isDesktopDevice ? toggleActiveBox('statusUpdates', true) : ''
          "
        >
          <a
            href="javascript:void(0)"
            class="gh-item status-update-link"
            :class="{active: activeBoxType === 'statusUpdates'}"
            @click="toggleActiveBox('statusUpdates')"
          >
            {{ $t('HEADER.LIVE_UPDATE') }}
            <div
              v-if="
                globalHeaderData.live_update.start_working_hour_time &&
                  globalHeaderData.live_update.end_working_hour_time
              "
              class="indicator-wrapper"
              :class="{active: isLocationWorking}"
            >
              <span />
            </div>
            <div
              v-if="!$globalData.isDesktopDevice"
              class="ltr:ml-[0.625rem] rtl:mr-[0.625rem]"
            >
              <arrow-svg arrow-color="#0A1432CC" />
            </div>
          </a>

          <div
            v-if="activeBoxType === 'statusUpdates'"
            class="status-update-box-wrapper"
          >
            <div class="content-box">
              <button
                aria-label="Close"
                class="btn-close"
                @click="toggleActiveBox('', true)"
              >
                <close-svg color="black" width="24" height="24" />
              </button>

              <h3 class="title">
                {{ globalHeaderData.live_update.title }}
              </h3>

              <div class="mt-4">
                <ul
                  v-if="(globalHeaderData.live_update.live_status_category || []).length"
                  class="updates-items-list"
                >
                  <li
                    v-for="updateItem in globalHeaderData.live_update.live_status_category"
                    :key="updateItem.id"
                    class="update-item"
                    :class="{selected: selectedUpdateTab.id === updateItem.id}"
                    @click="selectedUpdateTab = updateItem"
                  >
                    {{ updateItem.title }}
                  </li>
                </ul>

                <ul
                  v-if="selectedUpdateTab.live_status_subcategory"
                  class="status-list"
                >
                  <li
                    v-for="updateStatus in selectedUpdateTab.live_status_subcategory"
                    :key="updateStatus.id"
                    class="status-item"
                  >
                    {{ updateStatus.title }}

                    <span
                      class="status-indicator"
                      :class="{active: updateStatus.status_color_id === 1}"
                    >
                      {{ updateStatus.status_text }}
                    </span>
                  </li>
                </ul>

                <div
                  v-if="globalHeaderData.live_update.info_cards"
                  class="extra-information-cards-container"
                >
                  <div
                    v-for="extraInfo in globalHeaderData.live_update.info_cards"
                    :key="extraInfo.id"
                    class="information-card"
                  >
                    <div v-if="extraInfo.icon" class="image-wrapper">
                      <img
                        :src="extraInfo.icon.image_url"
                        :alt="extraInfo.icon.alt_text"
                        :title="extraInfo.icon.title"
                        width="32"
                        height="32"
                        class="w-fit h-fit max-h-[32px] max-w-[32px]"
                      >
                    </div>
                    <div
                      v-if="extraInfo.title_highlighted"
                      class="description"
                      v-html="extraInfo.title_highlighted"
                    />
                  </div>
                </div>

                <template v-if="globalHeaderData.live_update.cta">
                  <BaseButton
                    :btn-type="$isExternalLink(globalHeaderData.live_update.cta.url) ? 'externalLink' : 'link'"
                    :text="globalHeaderData.live_update.cta.title"
                    :path="globalHeaderData.live_update.cta.url"
                    :is-with-icon-element="true"
                    class-name="cta"
                  >
                    <template #icon-element>
                      <span class="icon-wrapper">
                        <direction-curved-arrow-icon />
                      </span>
                    </template>
                  </BaseButton>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="(languange || {}).key" class="language-wrapper">
        <a
          href="javascript:void(0)"
          class="gh-item language"
          @click="changeSelectedLanguage(languange)"
        >
          {{ languange.title }}
        </a>
      </div>
    </div>

    <div
      v-if="(globalHeaderData.cta_items || []).length"
      class="cta-items-container"
    >
      <div
        v-for="(cta, ctaIndex) in globalHeaderData.cta_items"
        :key="cta.id"
        :class="['flex items-center',{'cta-item-container': !!ctaIndex}]"
      >
        <div v-if="!!ctaIndex" class="vertical-line" />
        <BaseButton
          :btn-type="$isExternalLink(cta.url) ? 'externalLink' : 'link'"
          :text="cta.title"
          :path="cta.url"
          class-name="gh-item cta-link"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ArrowSvg from "@/components/SVGElements/arrow-svg.vue";
import CloseSvg from "@/components/SVGElements/close-svg.vue";
import DirectionCurvedArrowIcon from "@/components/SVGElements/direction-curved-arrow-icon.vue";

import BaseButton from "@/components/Shared/BaseUI/BaseButton";

import {mapGetters} from "vuex";
import {CommonEvent} from "@/services/app-events";

import moment from "moment";
import {globalHelpers} from "~/plugins/helpers";

export default {
  components: {
    ArrowSvg,
    CloseSvg,
    DirectionCurvedArrowIcon,
    BaseButton
  },
  props: {
    menuIsActive: {
      type: Boolean,
      default: false
    },
    globalHeaderData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['closeSideBar', 'setBoxType'],
  data() {
    return {
      // TODO: Get these values from the CMS.
      environments: [
        {
          id: "1",
          title: "Ski Dubai",
          label: this.$t("LOCATIONS.SKI_DUBAI"),
        },
        {
          id: "2",
          title: "Snow Abu Dhabi",
          label: this.$t("LOCATIONS.SNOW_ABU_DHABI"),
        },
        {
          id: "3",
          title: "Snow Oman",
          label: this.$t("LOCATIONS.SNOW_OMAN"),
        },
      ],
      activeBoxType: null,
      selectedUpdateTab: {},
      currentEnv: "",
      warningModalData: {
        title: this.$t("COMMON.WARNING_MODAL.CHANGE_ENV_MODAL.TITLE"),
        description: this.$t("COMMON.WARNING_MODAL.CHANGE_ENV_MODAL.DESCRIPTION"),
        continueText: this.$t("COMMON.WARNING_MODAL.CHANGE_ENV_MODAL.CONTINUE_TEXT"),
        btnConfirmationText: this.$t("COMMON.WARNING_MODAL.CHANGE_ENV_MODAL.BTN_CONFIRMATION")
      }
    };
  },
  computed: {
    ...mapGetters("bookingFlow", ["bookingData"]),
    isLocationWorking() {
      if (this.globalHeaderData && this.globalHeaderData.live_update) {
        const currentTime = moment();
        const startWorkingHour = moment(
          this.globalHeaderData.live_update.start_working_hour_time,
          "hh:mm"
        );
        const endWorkingHour = moment(
          this.globalHeaderData.live_update.end_working_hour_time,
          "hh:mm"
        );

        return (
          currentTime.isAfter(startWorkingHour) &&
          currentTime.isBefore(endWorkingHour)
        );
      }

      return true;
    },
    languange() {
      const unselectedLanguage = (this.globalHeaderData.language || []).length
        ? this.globalHeaderData.language.find((item) => item.key.toLowerCase() !== this.$i18n.localeProperties.detectedLang)
        : {};

      return unselectedLanguage;
    }
  },
  mounted() {
    this.currentEnv = this.$t(`LOCATIONS.${this.$getSiteCurrentEnvironment(true, true)}`);

    this.setChangeLocationModalContentMessages();
    if (this.globalHeaderData) {
      if (
        this.globalHeaderData.live_update &&
        this.globalHeaderData.live_update.live_status_category &&
        this.globalHeaderData.live_update.live_status_category.length
      ) {
        const defaultSelectedTab =
          this.globalHeaderData.live_update.live_status_category[0];
        this.selectedUpdateTab = defaultSelectedTab;
      }
    }
  },
  methods: {
    toggleActiveBox(type, close = false) {
      if (close) this.activeBoxType = null;
      else if (this.activeBoxType === type) this.activeBoxType = null;
      else this.activeBoxType = type;

      if (!this.$globalData.isDesktopDevice) this.$emit("setBoxType", this.activeBoxType);
    },
    changeSelectedLanguage(language) {
      CommonEvent.$emit("show-screen-loader", true);

      const currentEnv = this.$i18n.locale.toLowerCase();
      const locale = currentEnv.includes("dhabi") ? `${language.key}-ae/snow-abu-dhabi` : currentEnv.includes("oman") ? `${language.key}-om/snow-oman` : `${language.key}-ae/ski-dubai`;

      window.location.href = this.switchLocalePath(locale);
    },
    async changeEnv(env) {
      if (this.currentEnv.toLowerCase() !== env.label.toLowerCase()) {
        if (this.bookingData && this.bookingData.length) {
          this.$emit("closeSideBar");
          CommonEvent.$emit("show-warning-modal", {
            actionType: "change_env",
            title: this.warningModalData.title,
            description: this.warningModalData.description,
            continueText: this.warningModalData.continueText,
            btnConfirmationText: this.warningModalData.btnConfirmationText,
            currentEnv: env.title
          });
        } else {
          CommonEvent.$emit("show-screen-loader", true);
          // TODO: change the location of this array and make it public.
          ["isUpdateMessageActive", "dashboard", "skiPassport", "snowboardPassport"].forEach((ref) => globalHelpers.siteMessagesHandler(ref));

          Promise.all([
            this.$store.dispatch("bookingFlow/clearCartAndBookingFlowInfo"),
            this.$store.dispatch("bookingFlow/clearBookingSessionTimer"),
            this.$store.dispatch("bookingBar/clearBookingBarData"),
          ]);
          window.localStorage.setItem('hard_refresh_pages', 'refresh' + new Date());

          const directedEnv = env.title.toLowerCase();
          const currentLang = this.$i18n.localeProperties.detectedLang;

          const locale = directedEnv.includes("dhabi") ? `${currentLang}-ae/snow-abu-dhabi` : directedEnv.includes("oman") ? `${currentLang}-om/snow-oman` : `${currentLang}-ae/ski-dubai`;

          if (this.$isUserAuthenticated()) {
            this.$lastRouteHandler("/");
            this.$router.push(this.localeRoute('/', locale))
          } else {
            setTimeout(() => {
              window.location.href = `/${locale}`;
            }, 1000);
          }
        }
      } else this.toggleActiveBox("env", true);
    },
    setChangeLocationModalContentMessages() {
      const res = this.$repositories.getSiteGeneralContent();

      if (res && res.change_location_clear_shopping_cart_message)
        this.warningModalData = {
          title: res.change_location_clear_shopping_cart_message.title || this.warningModalData.title,
          description: res.change_location_clear_shopping_cart_message.description || this.warningModalData.description,
          continueText: (res.change_location_clear_shopping_cart_message.left_cta || {}).title || this.warningModalData.continueText,
          btnConfirmationText: (res.change_location_clear_shopping_cart_message.right_cta || {}).title || this.warningModalData.btnConfirmationText,
        };
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./GlobalHeader.scss";
</style>
