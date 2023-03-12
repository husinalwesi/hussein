<template>
  <main v-if="!isLoading" class="school-group">
    <template v-if="isError">
      <ErrorModal :show-error-modal="isError" />
    </template>
    <template v-else-if="data">
      <template v-if="data.hero">
        <SectionContentWrapper
          section-wrapper-classes="h-fit min-700:h-[27rem]"
          section-content-classes="flex min-700:py-0 items-center px-4 pb-[4.5rem] pt-32"
          :is-with-bg-image="true"
        >
          <template #section-content>
            <div
              class="text-container"
              :class="{ 'without-img': !data.hero.image }"
            >
              <h1 class="title">
                {{ data.hero.title ? data.hero.title : title }}
              </h1>
              <div v-if="data.hero.subtitle" class="mt-4">
                <h2 class="sub-title">
                  {{ data.hero.subtitle }}
                </h2>
              </div>
            </div>

            <div v-if="data.hero.image" class="image-wrapper">
              <img
                :src="data.hero.image.image_url"
                :alt="data.hero.image.alt_text"
                :title="data.hero.image.title"
                width="340"
                height="340"
                class="w-fit h-fit max-h-[340px]"
              >
            </div>
          </template>
        </SectionContentWrapper>
      </template>

      <SectionContentWrapper
        v-if="data.categories && data.categories.length"
        :section-wrapper-classes="[
          'mt-[-35px] flex relative',
          !(selectedTabDetails.activities || []).length ? 'mb-10 lg:mb-20' : '',
        ]"
      >
        <template #section-content>
          <ul class="tabs-list" vue-dragscroll>
            <li
              v-for="tab in data.categories"
              :key="tab.id"
              class="tab"
              :class="{
                active: selectedTabDetails && selectedTabDetails.id === tab.id,
              }"
              @click="selectedTabDetails = tab"
            >
              {{ tab.title }}
            </li>
          </ul>

          <div
            v-if="selectedTabDetails && selectedTabDetails.card_section"
            class="mt-10 md:mt-20 px-4 xl:px-0"
          >
            <EventCard
              :data="selectedTabDetails.card_section"
              :show-event-button="true"
              direction="right"
            />
          </div>
        </template>
      </SectionContentWrapper>

      <SectionContentWrapper
        v-if="
          selectedTabDetails.activities && selectedTabDetails.activities.length
        "
        section-wrapper-classes="md:mb-[8.5rem] mb-6 md:mt-20 mt-10"
        section-content-classes="px-4 flex gap-x-[1.25rem] justify-center xl:justify-start gap-y-6 flex-wrap"
      >
        <template #section-content>
          <DetailsCard
            v-for="activity in selectedTabDetails.activities"
            :key="activity.id"
            :card-data="activity"
          />
          <SchoolMomentsCard
            v-if="selectedTabDetails.great_moment"
            :data="selectedTabDetails.great_moment"
          />
        </template>
      </SectionContentWrapper>

      <section
        v-if="data.plan_your_visit"
        class="plan-your-visit-section"
      >
        <AppSection :app-section-data="data.plan_your_visit" />
      </section>
    </template>
    <template v-else>
      <NoData />
    </template>
  </main>
</template>

<script>
import ErrorModal from "@/components/Shared/ErrorModal";
import SectionContentWrapper from "@/components/Shared/SectionContentWrapper";
import EventCard from "@/components/Shared/Event-Card";
import DetailsCard from "@/components/Shared/Cards/DetailsCard";
import SchoolMomentsCard from "@/components/ContentPages/Shared/SchoolMomentsCard";
import AppSection from "@/components/Shared/AppSection";
import NoData from "@/components/Shared/NoData";

import {endPoints} from "@/const/api";

export default {
  components: {
    ErrorModal,
    SectionContentWrapper,
    EventCard,
    DetailsCard,
    SchoolMomentsCard,
    AppSection,
    NoData
  },
  data() {
    return {
      isError: false,
      isLoading: false,
      data: null,
      title: "School group packages",
      selectedTabDetails: {}
    };
  },
  async fetch() {
    try {
      this.isLoading = true;

      const res = await this.$axios.$get(endPoints.GET_SCHOOL_TRIP);
      // TODO: show no data msg when there's no data found.
      if (res.Success && res.Result) {
        this.data = res.Result;

        if (res.Result.categories && res.Result.categories.length)
          this.selectedTabDetails = res.Result.categories[0];
      }
      this.isLoading = false;
    } catch (err) {
      this.isError = true;
      this.isLoading = false;
      console.log({err});
    }
  },
  head() {
    return this.$seoGenerator(this.data, `School Group`)
  },
};
</script>

<style lang="scss" scoped>
@import "./school-group.scss";
</style>
