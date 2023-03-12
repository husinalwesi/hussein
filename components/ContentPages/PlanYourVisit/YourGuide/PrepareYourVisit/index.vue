<template>
  <section class="prepare-your-visit-section" :class="classes">
    <div class="header-container">
      <h2 v-if="prepareYourVisitData.title" class="title">
        {{ prepareYourVisitData.title }}
      </h2>
      <div>
        <p v-if="prepareYourVisitData.description" class="description">
          {{ prepareYourVisitData.description }}
        </p>
        <NuxtLink
          v-if="prepareYourVisitData.cta"
          :to="localePath(prepareYourVisitData.cta.url)"
          class="cta-link"
        >
          {{ prepareYourVisitData.cta.title }}
        </NuxtLink>
      </div>
    </div>

    <div v-if="prepareYourVisitData.plan_your_visit" class="mobile-app-wrapper">
      <AppSection :app-section-data="prepareYourVisitData.plan_your_visit" />
    </div>
  </section>
</template>

<script>
import AppSection from "@/components/Shared/AppSection";

export default {
  components: {AppSection},
  props: {
    prepareYourVisitData: { type: Object, required: true },
    classes: { type: [String,Array], default: () => "" },
  },
};
</script>

<style lang="scss" scoped>
@import "./PrepareYourVisit.scss";
</style>
