<template>
  <main v-if="!isLoading" class="health-safety-main">
    <template v-if="isError">
      <ErrorModal :show-error-modal="isError" />
    </template>
    <template v-else-if="data">
      <template v-if="data.hero">
        <SectionContentWrapper
          section-wrapper-classes="hero-section-wrapper"
          section-content-classes="hero-section-content"
          :is-with-bg-image="true"
        >
          <template #section-content>
            <div
              class="text-container"
              :class="{ 'without-img': !data.hero.image }"
            >
              <h1 class="title">
                {{ data.hero.title ? data.hero.title : heroSectionData.title }}
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
        v-if="data.page_categories && data.page_categories.length"
        section-wrapper-classes="safety-section-wrapper"
        section-content-classes="safety-section-content"
      >
        <template #section-content>
          <div class="relative w-full flex">
            <ul class="tabs-list" vue-dragscroll>
              <li
                v-for="tab in data.page_categories"
                :key="tab.id"
                class="tab"
                :class="{
                  active:
                    selectedTabDetails && selectedTabDetails.id === tab.id,
                }"
                @click="selectedTabDetails = tab"
              >
                {{ tab.title }}
              </li>
            </ul>

            <div class="bottom-line" />
          </div>

          <div
            v-if="selectedTabDetails && selectedTabDetails.card_section"
            class="mt-10 px-4 md:px-0 flex gap-6 flex-wrap"
          >
            <div class="flex flex-col flex-1">
              <h2
                v-if="selectedTabDetails.card_section.title"
                class="section-title"
              >
                {{ selectedTabDetails.card_section.title }}
              </h2>
              <div
                v-if="selectedTabDetails.card_section.image"
                class="mt-4 mb-6 md:hidden"
              >
                <img
                  :src="selectedTabDetails.card_section.image.image_url"
                  :alt="selectedTabDetails.card_section.image.alt_text"
                  :title="selectedTabDetails.card_section.image.title"
                  width="343"
                  height="280"
                  class="w-full h-full max-h-[280px] rounded-2xl"
                >
              </div>
              <div
                v-if="selectedTabDetails.card_section.description_highlighted"
                class="md:mt-10 md:text-[#606060] section-description text-[#0A1432B2]"
                v-html="selectedTabDetails.card_section.description_highlighted"
              />
            </div>

            <div
              v-if="selectedTabDetails.card_section.image"
              class="flex-1 hidden md:block"
            >
              <img
                :src="selectedTabDetails.card_section.image.image_url"
                :alt="selectedTabDetails.card_section.image.alt_text"
                :title="selectedTabDetails.card_section.image.title"
                width="536"
                height="400"
                class="w-full h-full max-h-[400px] rounded-3xl"
              >
            </div>
          </div>
        </template>
      </SectionContentWrapper>

      <SectionContentWrapper
        v-if="selectedTabDetails.collapsed_sections"
        section-wrapper-classes="questions-section-wrapper"
        section-content-classes="questions-section-content"
      >
        <template #section-content>
          <div
            v-if="selectedTabDetails.collapsed_sections.title"
            class="w-full max-w-[788px]"
          >
            <h2 class="section-title">
              {{ selectedTabDetails.collapsed_sections.title }}
            </h2>
          </div>

          <div
            v-if="
              selectedTabDetails.collapsed_sections.collapsed_sections_data &&
                selectedTabDetails.collapsed_sections.collapsed_sections_data.length
            "
            class="questions-accordian-container"
          >
            <BaseAccordion
              v-for="question in selectedTabDetails.collapsed_sections.collapsed_sections_data"
              :key="question.id"
              :show-expand="activeQuestionAccordianId === question.id"
              :body-class="''"
              class-name="question-accordian-wrapper"
              :arrow-wrapper-color="
                activeQuestionAccordianId === question.id
                  ? 'bg-[#0D4F94]'
                  : 'bg-[#ECECEC]'
              "
              :accordion-title="question.category_title"
              :title-class-name="'question-accordian-title'"
              :arrow-color="activeQuestionAccordianId === question.id ? 'white' : '#1A1A1A'"
              :divider-classes="'mt-6 mb-8'"
              @accordion-expand="accordionExpandHandler(question.id)"
            >
              <template #accordion-content>
                <div
                  v-if="question.description_highlighted"
                  class="section-description text-dark-black"
                  v-html="question.description_highlighted"
                />
              </template>
            </BaseAccordion>
          </div>
        </template>
      </SectionContentWrapper>

      <section v-if="data.plan_your_visit" class="mobile-app-section-wrapper">
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
import BaseAccordion from "@/components/Shared/BaseUI/BaseAccordion/index.vue";
import AppSection from "@/components/Shared/AppSection";
import NoData from "@/components/Shared/NoData";

import {endPoints} from "@/const/api";

/* eslint-disable no-undef */

export default {
  components: {
    ErrorModal,
    SectionContentWrapper,
    BaseAccordion,
    AppSection,
    NoData
  },
  data() {
    return {
      isError: false,
      isLoading: false,
      data: null,
      heroSectionData: {
        title: "Health and safety"
      },
      selectedTabDetails: {},
      activeQuestionAccordianId: null,
    };
  },
  async fetch() {
    try {
      this.isLoading = true;

      const res = await this.$axios.$get(endPoints.GET_HEALTH_AND_SAFETY);

      // TODO: show no data msg when there's no data found.
      if (res.Success && res.Result) {
        this.data = res.Result;

        if (
          res.Result &&
          res.Result.page_categories &&
          res.Result.page_categories.length
        )
          this.selectedTabDetails = res.Result.page_categories[0];
      }

      this.isLoading = false;
    } catch (err) {
      this.isError = true;
      this.isLoading = false;
      console.log({ err });
    }
  },
  head() {
    return this.$seoGenerator(this.data, `Health And Safety`)
  },
  methods: {
    accordionExpandHandler(id) {
      if (id === this.activeQuestionAccordianId)
        this.activeQuestionAccordianId = null;
      else this.activeQuestionAccordianId = id;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./health-safety.scss";
</style>
