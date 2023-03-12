<template>
  <main class="find-your-booking-main">
    <SolidBlurBG
      custom-class="-z-1"
      :is-bg-image="true"
      section-image-classes="h-[200px] w-[254px] lg:h-[244px] lg:w-[298px]"
      :section-image="{
        image_url:bgImageUrl +'find-your-booking-bg.png',
        alt: 'family',
        title: 'family',
      }"
    />

    <section class="flex justify-center max-w-[648px] mx-auto booking-ref">
      <CardContainer
        wrapper-classes="px-[15px] py-[23px] md:px-[39px] md:py-[31px]"
      >
        <template #card-content>
          <div
            class="card-header"
            :class="{'mb-4 md:mb-6': !error.isHideSignBtn}"
          >
            <h1 class="title">
              {{ cardHeader.title }}
            </h1>
            <div class="subtitle-wrapper">
              <h2 class="subtitle">
                {{ cardHeader.subtitle }}
              </h2>
            </div>
          </div>

          <div
            class="card-body"
            :class="{'action-btns-container': error.type === 'invalidAccount'}"
          >
            <template v-if="error.type !== 'invalidAccount'">
              <h3 class="title">
                {{ $t("FIND_YOUR_BOOKING.ENTER_BOOKING_ID") }}
              </h3>

              <div class="mt-2">
                <ValidationObserver
                  v-slot="{ invalid }"
                  ref="find-booking-validator"
                >
                  <BaseInput
                    v-model="bookingReference"
                    i-n-ptype="number"
                    i-n-pname="Booking ID"
                    i-n-pplaceholder="XXXXXXXXXXXX"
                    :classes="['cursor-pointer', 'bg-white']"
                    errors-classes="ltr:pl-4 rtl:pr-4"
                    :custom-error="
                      error.isActive &&
                        error.type === 'invalidReference' &&
                        lastBookingReference === bookingReference
                        ? error.message
                        : ''
                    "
                    :is-show-custom-error-by-default="true"
                    :readonly="isLoading"
                    :rules="{ required: true, min: 12 }"
                  />

                  <div class="mt-6 flex justify-end">
                    <BaseButton
                      btn-type="button"
                      :text="$t('COMMON.CONTINUE')"
                      :b-t-ndisabled="
                        invalid ||
                          !bookingReference ||
                          isLoading ||
                          lastBookingReference === bookingReference
                      "
                      :is-loading="isLoading"
                      loader-wrapper-classes="absolute top-0 ltr:left-0 rtl:right-0"
                      loader-classes="w-12 h-12"
                      @onBtnClick="validateBookingReference"
                    />
                  </div>
                </ValidationObserver>
              </div>
            </template>
            <template v-else>
              <template v-if="!error.isHideSignBtn">
                <BaseButton
                  btn-type="button"
                  :text="$t('HEADER.SIGN_IN')"
                  @onBtnClick="onAccessBtnClick"
                />
              </template>
              <div
                v-if="error.isTryAgainBtnVisible"
                class="try-again-btn-wrapper"
              >
                <button
                  type="button"
                  class="btn-try-again"
                  @click.prevent="clearOldValues"
                >
                  {{ $t("COMMON.TRY_AGAIN") }}
                </button>
              </div>
            </template>
          </div>
        </template>
      </CardContainer>
    </section>
  </main>
</template>

<script>
import SolidBlurBG from "@/components/Shared/SolidBlurBG";
import CardContainer from "@/components/BookingFlow/CardContainer";
import {ValidationObserver} from "vee-validate";
import BaseInput from "@/components/Shared/BaseUI/FormElements/BaseInput";
import BaseButton from "@/components/Shared/BaseUI/BaseButton";

import {mapGetters} from "vuex";
import {CommonEvent} from "@/services/app-events";
import {AppConfig} from "@/const/variable";

const errorDefaultValue = {type: "", isActive: false, message: ""};

export default {
  name: "FindYourBooking",
  components: {
    SolidBlurBG,
    CardContainer,
    ValidationObserver,
    BaseInput,
    BaseButton,
  },
  data() {
    return {
      case: 1,
      isLoading: false,
      bookingReference: null,
      lastBookingReference: null,
      cardHeaderDefaultValue: {},
      cardHeader: {},
      currentLocation: "Ski Dubai",
      error: {...errorDefaultValue},
      bgImageUrl: null
    };
  },
  async fetch() {
    const currentEnv = this.$getSiteCurrentEnvironment(false, true);
    const loweredCaseEnv = currentEnv.toLowerCase();

    this.currentLocation = this.$t(`LOCATIONS.${currentEnv}`);

    /* eslint-disable no-undef */
    const heroSectionImagePath = loweredCaseEnv.includes("oman")
      ? process.env.SNOW_OMAN.SITEFINITY_DOMAIN_BASE_URL + process.env.SNOW_OMAN.CMS_ASSETS
      : loweredCaseEnv.includes("dhbai")
        ? process.env.SNOW_ABD.SITEFINITY_DOMAIN_BASE_URL + process.env.SNOW_ABD.CMS_ASSETS
        : process.env.SKI_DUBAI.SITEFINITY_DOMAIN_BASE_URL + process.env.SKI_DUBAI.CMS_ASSETS;

    this.bgImageUrl = heroSectionImagePath;

    this.cardHeaderDefaultValue = {
      title: this.$t("FIND_YOUR_BOOKING.FIND_BOOKING.TITLE"),
      subtitle: this.$t("FIND_YOUR_BOOKING.FIND_BOOKING.DESCRIPTION", {location: this.currentLocation}),
    };
    this.cardHeader = {...this.cardHeaderDefaultValue};
  },
  head() {
    return {
      title: this.$t("FIND_YOUR_BOOKING.FIND_BOOKING.HEADER_TITLE", {location: this.currentLocation}),
      meta: [
        {
          hid: "title",
          property: "title",
          content: this.$t("FIND_YOUR_BOOKING.FIND_BOOKING.HEADER_TITLE", {location: this.currentLocation}),
        },
        {
          hid: "description",
          property: "description",
          content: this.$t("FIND_YOUR_BOOKING.FIND_BOOKING.HEADER_TITLE", {location: this.currentLocation}),
        },
        {
          hid: "og:title",
          property: "og:title",
          content: this.$t("FIND_YOUR_BOOKING.FIND_BOOKING.HEADER_TITLE", {location: this.currentLocation}),
        },
        {
          hid: "og:description",
          property: "og:description",
          content: this.$t("FIND_YOUR_BOOKING.FIND_BOOKING.HEADER_TITLE", {location: this.currentLocation}),
        },
      ],
      /* eslint-disable no-undef */
      link: [
        {
          hid: "canonical",
          rel: "canonical",
          href: process.env.SHARED_ENVS.WEB_BASE_URL + this.$route.fullPath,
        },
        {
          hid: "alternate",
          rel: "alternate",
          href: process.env.SHARED_ENVS.WEB_BASE_URL + this.$route.fullPath,
        },
      ],
    };
  },
  computed: {
    ...mapGetters("bookingFlow", ["bookingData"]),
  },
  methods: {
    async getBookingOrder() {
      try {
        this.isLoading = true;

        const res = await this.$repositories.getBookingDetails(this.bookingReference);

        if (res.success) {
          if (res.data && res.data.booking_valid && res.data.order_case === 3) {
            if (this.$isUserAuthenticated()) this.$router.push(this.localePath(`/booking-confirmed/${this.bookingReference}`));
            else {
              this.error = {
                type: "invalidAccount",
                isActive: true,
                message: "",
                isHideSignBtn: true,
                isTryAgainBtnVisible: false
              };
              this.cardHeader = {
                title: this.$t("FIND_YOUR_BOOKING.GUEST_BOOKING.TITLE"),
                subtitle: this.$t("FIND_YOUR_BOOKING.GUEST_BOOKING.DESCRIPTION")
              };
            }
          } else if (res.data.order_case === 1) {
            this.error = {
              type: "invalidReference",
              isActive: true,
              message: this.$t("FIND_YOUR_BOOKING.BOOKING_ID_ERROR")
            };
            this.lastBookingReference = this.bookingReference;
          } else if (res.data.order_case === 2) {
            if (!this.$isUserAuthenticated()) {
              this.error = {
                type: "invalidAccount",
                isActive: true,
                message: "",
                isTryAgainBtnVisible: false
              };
              this.cardHeader = {
                title: this.$t("FIND_YOUR_BOOKING.LOGIN_PROMPT.TITLE"),
                subtitle: this.$t("FIND_YOUR_BOOKING.LOGIN_PROMPT.DESCRIPTION")
              };
            } else {
              this.error = {
                type: "invalidAccount",
                isActive: true,
                message: "",
                isTryAgainBtnVisible: true
              };
              this.cardHeader = {
                title: this.$t("FIND_YOUR_BOOKING.DIFFERENT_BOOKING.TITLE"),
                subtitle: this.$t("FIND_YOUR_BOOKING.DIFFERENT_BOOKING.DESCRIPTION")
              };
            }
          } else if (res.data.order_case === 4) {
            const site_id = res.data.siteId || 1;
            const siteConfigName = Object.keys(AppConfig).find(config => AppConfig[config].site_id === site_id);

            CommonEvent.$emit("show-warning-modal", {
              actionType: "change_env",
              title: this.$t("FIND_YOUR_BOOKING.LOCATION_CHANGE.TITLE", {location: this.$t(`LOCATIONS.${siteConfigName}`)}),
              description: this.$t("FIND_YOUR_BOOKING.LOCATION_CHANGE.DESCRIPTION", {location: this.$t(`LOCATIONS.${siteConfigName}`)}),
              continueText: this.$t("COMMON.CANCEL"),
              btnConfirmationText: this.$t("COMMON.CONTINUE"),
              currentEnv: AppConfig[siteConfigName].title,
              redirectedRoute: `/booking-confirmed/${this.bookingReference}`
            });
          }
        } else
          this.$showToast({
            type: "red",
            text: this.$t("COMMON.ERROR_MESSAGES.ERROR_OCCURRED")
          });

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        console.log({err});
      }
    },
    validateBookingReference() {
      this.$refs["find-booking-validator"].validate().then((res) => {
        if (res) this.getBookingOrder();
      });
    },
    async onAccessBtnClick() {
      if (this.$isUserAuthenticated()) {
        if (this.bookingData && this.bookingData.length)
          CommonEvent.$emit("show-warning-modal", true);
      }

      // TODO: get back here if the business decided to login users when they clear their cart.
      if (!(this.bookingData && this.bookingData.length)) {
        CommonEvent.$emit("show-screen-loader", true);
        this.$lastRouteHandler(this.$route.fullPath);
        this.$auth.ctx.$auth.strategies.auth0.options.clientId = this.$getMpassClientId();
        const {containsShare, countryDetails} = this.$getSiteConfig();

        await this.$auth.loginWith("auth0", {
          params: {
            prompt: "login",
            lang: this.$i18n.localeProperties.detectedLang,
            share_tc: containsShare, // yes or no,
            country: countryDetails.iso3 // iso3 code
          }
        });
      }
    },
    clearOldValues() {
      this.bookingReference = null;
      this.cardHeader = {...this.cardHeaderDefaultValue};
      this.error = {
        ...errorDefaultValue
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./find-your-booking.scss";
</style>
