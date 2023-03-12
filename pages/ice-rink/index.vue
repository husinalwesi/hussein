<template>
  <main v-if="!isLoading" class="ice-rink-main">
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
              class="text-container mt-10"
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

      <template v-if="data.card_section">
        <SectionContentWrapper section-content-classes="px-4 mt-10 md:mt-20">
          <template #section-content>
            <EventCard
              :data="data.card_section"
              direction="right"
              custom-container-classes="flex-col lg:flex-row"
            />
          </template>
        </SectionContentWrapper>
      </template>

      <SectionContentWrapper v-if="data.activity_section">
        <template #section-content>
          <SchoolBenefits :data="data.activity_section" />
        </template>
      </SectionContentWrapper>

      <template v-if="data.instructor_section">
        <OurInstructor id="instructorSection" :data="data.instructor_section" wrapper-classes="mt-8 md:mt-10" />
      </template>
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
import SchoolBenefits from "@/components/SkiSchoolComponent/SchoolBenefits";
import OurInstructor from "@/components/Shared/OurInstructor";
import NoData from "@/components/Shared/NoData";

import {endPoints} from "@/const/api";

/* eslint-disable no-undef */

export default {
  name: "IceRink",
  components: {
    ErrorModal,
    SectionContentWrapper,
    EventCard,
    SchoolBenefits,
    OurInstructor,
    NoData
  },
  data() {
    return {
        data: null,
        isError: false,
        isLoading: false,
    };
  },
  async fetch() {
    try {
        this.isLoading = true;

        const res = await this.$axios.$get(endPoints.GET_ICE_SKATING_DETAILS);
        if (res.Success && res.Result) this.data = res.Result;

        this.isLoading = false;
      } catch (err) {
        this.isError = true;
        this.isLoading = false;
        console.log({err});
      }
  },
  head() {
    return this.$seoGenerator(this.data, `Ice Rink`)
  },
};
</script>
<style lang="scss" scoped>
@import "./ice-rink.scss";
</style>
