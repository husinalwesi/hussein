<template>
  <main v-if="!isLoading" class="ski-dubai-main">
    <template v-if="isError">
      <ErrorModal :show-error-modal="isError" />
    </template>

    <template v-else>
      <template v-if="homePageData">
        <div class="bg-homepage" />
        <Snow
          :is-strong-snow="currentEvent === 'challenge'"
          class="fixed inset-o w-full h-full"
        />
        <HeroSection
          id="hero-section"
          :data="homePageData.hero"
          :scroll-to-continue-cta="homePageData.scroll_to_continue_cta"
        />
        <template v-if="currentEvent && homePageData.let_the_thrill_begin">
          <ThrillSection
            :key="homePageData.let_the_thrill_begin.id"
            :current-event="currentEvent"
            :section-data="homePageData.let_the_thrill_begin"
            @changeActivityType="setActivityData($event)"
          />
        </template>
        <ActivitySection
          v-for="(activityData, index) in getActivityData(currentEvent)"
          :key="index"
          :section-data="activityData"
          :section-index="index"
          :current-event="currentEvent"
        />

        <template v-if="homePageData.plan_your_visit">
          <MobileAppSection
            :key="homePageData.plan_your_visit.id"
            :section-data="homePageData.plan_your_visit"
          />
        </template>
      </template>
      <template v-else>
        <NoData />
      </template>
    </template>
  </main>
</template>

<script>
import Snow from "@/components/Shared/Snow.vue";
import HeroSection from "@/components/HomePage/HeroSection";
import ThrillSection from "@/components/HomePage/ThrillSection";
import MobileAppSection from "@/components/HomePage/MobileAppSection";
import ActivitySection from "@/components/Shared/ActivitySection";
import ErrorModal from "@/components/Shared/ErrorModal";
import NoData from "@/components/Shared/NoData";

/* eslint-disable no-undef */

export default {
  name: "SkiDubaiHome",
  components: {
    Snow,
    HeroSection,
    ThrillSection,
    ActivitySection,
    MobileAppSection,
    ErrorModal,
    NoData
  },
  props: {
    homePageData: {
      type: Object,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: true
    },
    isError: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentEvent: "explore",
    };
  },
  mounted() {
    if (this.homePageData) {
      this.setActivityData("explore");
    }
  },
  methods: {
    setActivityData(activityType) {
      this.currentEvent = activityType;
    },
    getActivityData(activityType) {
      if (activityType === "challenge")
        return this.homePageData.activities.be_challenged_activities;
      else
        return this.homePageData.activities.start_exploring_activities;
    },
  }
};
</script>

<style lang="scss" scoped>
@import "./DubaiHomepage.scss";
</style>
