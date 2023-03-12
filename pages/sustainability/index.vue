<template>
  <main v-if="!isLoading" class="sustainability-main">
    <template v-if="isError">
      <ErrorModal :show-error-modal="isError" />
    </template>

    <template v-else-if="data">
      <template v-if="data.hero">
        <SectionContentWrapper
          section-wrapper-classes="h-fit min-700:h-[27rem]"
          section-content-classes="flex min-700:py-0 px-4 pb-[104px] pt-[128px]"
          :is-with-bg-image="true"
        >
          <template #section-content>
            <div
              class="text-container"
              :class="{ 'without-img': !data.hero.image }"
            >
              <h1 v-if="data.hero.title" class="title">
                {{ data.hero.title }}
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

      <template v-if="data.page_categories && data.page_categories.length">
        <SectionContentWrapper
          section-wrapper-classes="mt-[-35px]"
          section-content-classes="px-4"
        >
          <template #section-content>
            <ul class="tabs-list" vue-dragscroll>
              <li
                v-for="tab in data.page_categories"
                :key="tab.id"
                class="tab"
                :class="{active: selectedTabDetails && selectedTabDetails.id === tab.id,}"
                @click="selectedTabDetails = tab"
              >
                {{ tab.title }}
              </li>
            </ul>

            <div
              v-if="
                selectedTabDetails &&
                  selectedTabDetails.card_sections &&
                  selectedTabDetails.card_sections.length
              "
              class="flex flex-col gap-y-16 mt-10 md:mt-20"
            >
              <EventCard
                v-for="(card, i) in selectedTabDetails.card_sections"
                :key="i"
                :data="card"
                :direction="i % 2 !== 0 ? 'right' : 'left'"
                :show-event-button="false"
                custom-container-classes="flex-col-reverse lg:flex-row"
              />
            </div>
          </template>
        </SectionContentWrapper>
      </template>

      <template v-if="data.achievements_section">
        <SectionContentWrapper
          section-wrapper-classes="bg-[#FAFAFA] mt-16 lg:mt-20"
        >
          <template #section-content>
            <Achievements :data="data.achievements_section" />
          </template>
        </SectionContentWrapper>
      </template>

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
import Achievements from "@/components/Shared/Achievements";
import AppSection from "@/components/Shared/AppSection";
import NoData from "@/components/Shared/NoData";

import {endPoints} from "@/const/api";

/* eslint-disable no-undef */

export default {
  name: "Event",
  components: {
    ErrorModal,
    SectionContentWrapper,
    EventCard,
    Achievements,
    AppSection,
    NoData
  },
  data() {
    return {
      isError: false,
      isLoading: false,
      data: null,
      selectedTabDetails: {},
    };
  },
  async fetch() {
    try {
        this.isLoading = true;

        const res = await this.$axios.$get(endPoints.GET_SUSTAINABILITY);

        // TODO: show no data msg when there's no data found.
        if (res.Success && res.Result) {
          this.data = res.Result;

          if (res.Result.page_categories && res.Result.page_categories.length) this.selectedTabDetails = res.Result.page_categories[0];
        }

        this.isLoading = false;
      } catch (err) {
        this.isError = true;
        this.isLoading = false;
        console.log({ err });
      }
  },
  head() {
    return this.$seoGenerator(this.data, `Sustainability`)
  },
};
</script>

<style lang="scss" scoped>
@import "./sustainability.scss";
</style>
