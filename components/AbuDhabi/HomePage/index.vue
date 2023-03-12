<template>
  <main v-if="!isLoading" class="snow-abu-dhabi-main">
    <template v-if="isError">
      <ErrorModal :show-error-modal="isError" />
    </template>
    <template v-else>
      <template v-if="homePageData">
        <div class="bg-homepage" />
        <Snow class="fixed inset-o w-full h-full" />
        <template v-if="homePageData.hero">
          <Hero
            :data="homePageData.hero"
            :scroll-to-continue-cta="homePageData.scroll_to_continue_cta"
          />
        </template>
        <template
          v-if="
            homePageData.activities_with_out_order &&
              homePageData.activities_with_out_order.length
          "
        >
          <ActivitySection
            v-for="(activityData, index) in homePageData.activities_with_out_order"
            :key="index"
            :section-data="activityData"
            :section-index="index"
          />
        </template>

        <template v-if="homePageData.plan_your_visit">
          <PlanYourVisit :section-data="homePageData.plan_your_visit" />
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
import Hero from "@/components/AbuDhabi/HomePage/Hero";
import ActivitySection from "@/components/Shared/ActivitySection";
import PlanYourVisit from "@/components/AbuDhabi/HomePage/PlanYourVisit";
import ErrorModal from "@/components/Shared/ErrorModal";
import NoData from "@/components/Shared/NoData";


export default {
  name: "AbuDhabiHome",
  components: {
    Snow,
    Hero,
    ActivitySection,
    PlanYourVisit,
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
  }
};
</script>

<style lang="scss" scoped>
@import "./AbuDhabiHomepage.scss";
</style>
