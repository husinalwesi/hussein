<!--TODO: modify this component-->
<template>
  <div class="booking-progress-indicator-container" :class="customClasses">
    <img
      :src="require('@/assets/images/Accounts/right-snowflake.png')"
      alt="snowflake"
      title="snowflake"
      width="89"
      height="165"
      class="img-snowflake"
    >
    <div class="card-header">
      <h3 class="title">
        {{ cardHeader.title }}
      </h3>
      <div class="description-wrapper">
        <p class="description">
          {{ cardHeader.description }}
        </p>
      </div>
    </div>

    <ul class="progress-tabs-list" :class="{ 'step-wizard': tabs.length <= 2 }">
      <div
        id="progress-line-indicator"
        :style="{ width: completeProgress + '%' }"
        class="progress-line"
      />
      <li
        v-for="(tab, index) in tabs"
        :key="index"
        :class="[
          { 'mid-tab': index !== 0 && index !== tabs.length - 1 },
          index === 0
            ? `first-tab ${tabs.length > 2 ? 'with-max-width' : ''}`
            : '',
          index === tabs.length - 1
            ? `last-tab ${tabs.length > 2 ? 'with-max-width' : ''}`
            : '',
        ]"
        class="progress-tab-item"
      >
        <div
          :class="
            checkTabActivity(tab)
              ? 'active'
              : activeIndex + 1 === index
                ? 'not-active'
                : ''
          "
          class="circles"
        >
          <!--1 is the active index -- > 2 will be the second active index, ..etc-->
          <span v-if="activeIndex + 1 === index" class="next-step-circle" />
          {{ index + 1 }}
        </div>
        <p class="tab-title">
          {{ tab.title }}
        </p>
      </li>
    </ul>

    <div class="mt-12 mb-6 md:hidden mx-[15px]">
      <div class="divider-dashed" />
    </div>

    <div
      class="card-footer-container"
      :class="
        !isValidGear() && !isAllDataAdded() ? 'justify-between' : 'justify-end'
      "
    >
      <div
        v-if="!isValidGear() && !isAllDataAdded()"
        class="warning-msg-wrapper"
      >
        <p class="warning-msg">
          {{
            $t("COMMON.BOOKING_PROGRESS_INDICATOR.HOURS_LIMIT.WARNING_MESSAGE", {location: $t(`LOCATIONS.${currentLocation}`)})
          }}
        </p>
      </div>
      <div class="action-btn-wrapper">
        <BaseButton
          :text="ctaText"
          btn-type="button"
          :b-t-ndisabled="!isValidGear() && !isAllDataAdded()"
          @onBtnClick="generateCtaLink"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment-timezone";
import {AppConfig} from "@/const/variable";

export default {
  name: "StepWizard",
  props: {
    customClasses: {
      type: [String, Array],
      default: "pt-[31px]",
    },
    orderStatus: {
      type: Object,
      default: () => ({}),
    },
    reservationCode: {
      type: String,
      default: "",
    },
    needWaiver: {
      type: Boolean,
      default: true,
    },
    orderDay: {
      type: [String, Date],
      default: null,
    },
    isMembership: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["tabs"],
  data() {
    return {
      activeIndex: 0,
      completeProgress: 0,
      ctaText: "",
      cardHeader: {},
      steps: [
        {
          title: this.$t("COMMON.BOOKING_PROGRESS_INDICATOR.NEXT_STEPS.COME_PREPARED_CTA"),
          id: "booking",
        },
        {
          title: this.$t("COMMON.BOOKING_PROGRESS_INDICATOR.NEXT_STEPS.ADD_GUESTS"),
          id: "add_guest",
        },
        {
          title: this.$t("COMMON.BOOKING_PROGRESS_INDICATOR.NEXT_STEPS.SIGN_WAVER"),
          id: "waiver",
        },
        {
          title: this.$t("COMMON.BOOKING_PROGRESS_INDICATOR.NEXT_STEPS.CHOOSE_GEAR"),
          id: "gear",
        },
      ],
      tabs: [],
      currentLocation: 'ski dubai'
    };
  },
  created() {
    this.currentLocation = this.$getSiteCurrentEnvironment(false, true)
  },
  mounted() {

    let bookingSteps = this.steps;
    if (!this.needWaiver) {
      bookingSteps = this.steps.filter((item) => item.id !== "waiver");
    }

    if (this.isMembership) {
      if (this.needWaiver) {
        bookingSteps = this.steps.filter((item) => item.id === "waiver" || item.id === "booking");
      } else {
        bookingSteps = this.steps.filter((item) => item.id === "booking");
      }
    }

    if (!this.$isUserAuthenticated()) {
      bookingSteps = this.steps.filter((item) => item.id !== "waiver" && item.id !== "add_guest");
    }

    this.tabs = bookingSteps;
    this.setInitialValues();
  },
  methods: {
    checkTabActivity(tab) {
      if (tab.id === "add_guest") {
        return this.orderStatus.guest_added;
      } else if (tab.id === "waiver" && this.needWaiver) {
        return this.orderStatus.waiver_added;
      } else if (tab.id === "gear") {
        return this.orderStatus.gear_added;
      } else if (tab.id === "booking") {
        return true;
      }
    },
    isValidGearTime() {
      const today = moment();
      const visitDate = moment(this.orderDay);
      if (visitDate.isSame(today, "day")) return false;

      const timeZone = AppConfig[this.currentLocation].timezone;
      const tomorrow = moment().add(1, "days");
      const timeNow = moment().format("x");
      const tenPM = moment().tz(timeZone).set({h: 22, m: 0, s: 0});
      const twelveAM = moment().tz(timeZone).set({h: 23, m: 59, s: 59});

      if (
        moment(timeNow).isAfter(tenPM, "hour") &&
        moment(timeNow).isBefore(twelveAM, "hour") &&
        moment(visitDate).isSame(tomorrow, "day")
      )
        return false;

      return true;
    },
    isValidGear() {
      if (this.orderDay) {
        if (this.$isUserAuthenticated()) {
          const isConsiderWaiverDataEntered = this.needWaiver
            ? this.orderStatus.waiver_added
            : true;
          const isValid =
            this.orderStatus.guest_added &&
            isConsiderWaiverDataEntered &&
            !this.orderStatus.gear_added
              ? this.isValidGearTime()
              : true;

          return isValid;
        } else {
          const isValid = this.isValidGearTime();

          return isValid;
        }
      }
    },
    isAllDataAdded() {
      if (this.isMembership) {
        if (this.needWaiver) return this.orderStatus.waiver_added;

        return true;
      }
      const isConsiderWaiverDataEntered = this.needWaiver
        ? this.orderStatus.waiver_added
        : true;

      if (!this.$isUserAuthenticated()) {
        return this.orderStatus.gear_added;
      }

      return (
        this.orderStatus.guest_added &&
        isConsiderWaiverDataEntered &&
        this.orderStatus.gear_added
      );
    },
    ctaTextHandler() {
      if (!this.$isUserAuthenticated()) {
        if (!this.orderStatus.gear_added)
          return this.$t("COMMON.BOOKING_PROGRESS_INDICATOR.NEXT_STEPS.CHOOSE_GEAR");

        return this.$t("COMMON.BOOKING_PROGRESS_INDICATOR.NEXT_STEPS.COME_PREPARED_CTA");
      }

      if (this.isMembership) {
        if (this.needWaiver) {
          if (!this.orderStatus.waiver_added)
            return this.$t("COMMON.BOOKING_PROGRESS_INDICATOR.NEXT_STEPS.SIGN_WAVER");
        }

        return this.$t("COMMON.BOOKING_PROGRESS_INDICATOR.NEXT_STEPS.COME_PREPARED_CTA");
      }

      if (!this.orderStatus.guest_added)
        return this.$t("COMMON.BOOKING_PROGRESS_INDICATOR.NEXT_STEPS.ADD_GUESTS");
      else if (!this.orderStatus.waiver_added && this.needWaiver)
        return this.$t("COMMON.BOOKING_PROGRESS_INDICATOR.NEXT_STEPS.SIGN_WAVER");
      else if (!this.isValidGear() && !this.isAllDataAdded())
        return this.$t("COMMON.BOOKING_PROGRESS_INDICATOR.HOURS_LIMIT.TITLE");
      else if (!this.orderStatus.gear_added)
        return this.$t("COMMON.BOOKING_PROGRESS_INDICATOR.NEXT_STEPS.CHOOSE_GEAR");
      else
        return this.$t("COMMON.BOOKING_PROGRESS_INDICATOR.NEXT_STEPS.COME_PREPARED_CTA");
    },
    setInitialValues() {
      // TODO: enhance this process when we have time.
      const tabsLength = this.tabs.length;
      const currentEnv = this.$getSiteCurrentEnvironment(false, true);
      const currentEnvText = this.$t(`LOCATIONS.${currentEnv}`);

      let progressIndicatorWidthVal = 0;
      let activeTabIndex = 0;

      if (this.isAllDataAdded()) {
        this.cardHeader = {
          title: this.$t("COMMON.BOOKING_PROGRESS_INDICATOR.ALL_DONE.TITLE"),
          description: `${this.$t(
            "COMMON.BOOKING_PROGRESS_INDICATOR.ALL_DONE.DESCRIPTION"
          )} ${currentEnvText}. ${this.$t("COMMON.SEE_YOU")}`,
        };
        activeTabIndex = tabsLength - 1;
        progressIndicatorWidthVal = 100;
      } else {
        this.cardHeader = {
          title: this.$t("COMMON.BOOKING_PROGRESS_INDICATOR.ALMOST_DONE.TITLE"),
          description: `${this.$t(
            "COMMON.BOOKING_PROGRESS_INDICATOR.ALMOST_DONE.DESCRIPTION"
          )} ${currentEnvText}`,
        };
        const tabsPercentage = 100 / tabsLength;

        for (var i = 0; i < tabsLength; i++) {
          if (this.tabs[i].id === "add_guest") {
            activeTabIndex = this.orderStatus.guest_added ? i : 0;
            progressIndicatorWidthVal = this.orderStatus.guest_added
              ? tabsPercentage * (i + 2) - 8
              : progressIndicatorWidthVal;
          } else if (this.tabs[i].id === "waiver" && this.needWaiver) {
            activeTabIndex = this.orderStatus.waiver_added ? i : activeTabIndex;
            progressIndicatorWidthVal = this.orderStatus.waiver_added
              ? tabsPercentage * (i + 2) - 8
              : progressIndicatorWidthVal;
          } else if (this.tabs[i].id === "booking") {
            activeTabIndex = i;
            progressIndicatorWidthVal = tabsPercentage * (i + 2) - 8;
          }
        }
      }

      this.activeIndex = activeTabIndex;
      this.completeProgress = progressIndicatorWidthVal;
      this.$nextTick(() => {
        this.ctaText = this.ctaTextHandler();
      });
    },
    generateCtaLink() {
      let query = "";

      // TODO: get back here..
      if (this.needWaiver) {
        query += query.length > 0 ? `&needWaiver=true` : `?needWaiver=true`;
      }

      if (!this.$isUserAuthenticated()) {
        if (!this.orderStatus.gear_added) {
          const gearLocalePath = this.localePath("/extra/gear");
          this.$router.push(
            gearLocalePath + "/" + this.reservationCode + query
          );
        } else {
          sessionStorage.removeItem('token')
          this.$router.push(this.localePath("/plan-your-visit/come-prepared"));
        }
        return;
      }

      if (this.isAllDataAdded()) {
        this.$router.push(this.localePath("/plan-your-visit/come-prepared"));
      } else if (!this.orderStatus.guest_added && !this.isMembership) {
        // TODO: Get back here and see why it's not working when we don't isolate it.
        const guestLocalePath = this.localePath("/extra/add-guest");
        this.$router.push(guestLocalePath + "/" + this.reservationCode + query);
      } else if (
        !this.orderStatus.waiver_added &&
        (this.needWaiver || this.isMembership)
      ) {
        // TODO: Get back here and see why it's not working when we don't isolate it.
        const waiverLocalePath = this.localePath("/extra/waiver");
        this.$router.push(
          waiverLocalePath +
          "/" +
          this.reservationCode +
          (query +
            (this.isMembership ? `&isMembership=${this.isMembership}` : ""))
        );
      } else if (!this.orderStatus.gear_added) {
        // TODO: Get back here and see why it's not working when we don't isolate it.
        const gearLocalePath = this.localePath("/extra/gear");
        this.$router.push(gearLocalePath + "/" + this.reservationCode + query);
      } else {
        this.$router.push(this.localePath("/"));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./BookingProgressIndicator.scss";
</style>
