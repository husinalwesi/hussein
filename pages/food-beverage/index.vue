<template>
  <main v-if="!isLoading" class="food-beverage-main">
    <template v-if="isError">
      <ErrorModal :show-error-modal="isError" />
    </template>
    <template v-else-if="data">
      <template v-if="data.hero">
        <SectionContentWrapper
          section-wrapper-classes="h-fit min-700:h-[27rem]"
          section-content-classes="flex min-700:py-0 px-4 pb-[72px] pt-[128px]"
          :is-with-bg-image="true"
        >
          <template #section-content>
            <div
              class="text-container"
              :class="{ 'without-img': !data.hero.image }"
            >
              <h1 class="title">
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
              >
            </div>
          </template>
        </SectionContentWrapper>
      </template>

      <SectionContentWrapper
        v-if="data.card_sections && data.card_sections.length"
        section-content-classes="px-4 flex flex-col mt-20 mobile:mt-[52px]"
      >
        <template #section-content>
          <EventCard
            v-for="(card, i) in data.card_sections"
            :key="i"
            :class="{ 'mobiles:mb-0': i === data.card_sections.length - 1 }"
            :data="card"
            class="mb-[5.25rem]"
            :direction="i % 2 === 0 ? 'right' : 'left'"
            custom-container-classes="flex-col-reverse lg:flex-row"
          />
        </template>
      </SectionContentWrapper>

      <SectionContentWrapper
        v-if="data.passes_and_events_section"
        section-content-classes="'px-0 md:px-4 py-16 md:py-20"
      >
        <template #section-content>
          <div class="passes-eventes">
            <h3 v-if="data.passes_and_events_section.title" class="title">
              {{ data.passes_and_events_section.title }}
            </h3>
            <div
              v-if="data.passes_and_events_section.description"
              class="description-wrapper"
            >
              <p class="description">
                {{ data.passes_and_events_section.description }}
              </p>
            </div>
            <template
              v-if="
                data.passes_and_events_section.cards &&
                  data.passes_and_events_section.cards.length
              "
            >
              <PassesContainer
                custom-class="full-container"
                :passes-data="slopeEventsData"
                :show-email="false"
                :card-type="'time-based'"
                :is-without-side-slides="true"
              />
            </template>
          </div>
        </template>
      </SectionContentWrapper>

      <PackagesContainer
        v-if="data.packages_section"
        :title="data.packages_section.title"
        :packages-data="data.packages_section.cards"
        :sub-title="data.packages_section.description"
        title-class="max-w-[868px]"
        subtitle-class="max-w-[760px]"
        background-color="bg-[#fafafa]"
        class="py-10 lg:py-20 bg-[#fafafa]"
      />

      <section v-if="data.plan_your_visit" class="plan-your-visit-section">
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
import PassesContainer from "@/components/PassesPackages/PassesContainer";
import PackagesContainer from "@/components/PassesPackages/PackagesContainer";
import AppSection from "@/components/Shared/AppSection";
import NoData from "@/components/Shared/NoData";

import {endPoints} from "@/const/api";

/* eslint-disable no-undef */

export default {
  components: {
    ErrorModal,
    SectionContentWrapper,
    EventCard,
    PassesContainer,
    PackagesContainer,
    AppSection,
    NoData
  },
  data() {
    return {
      isError: false,
      isLoading: false,
      slopeEventsData: {
        data: [],
        moments: {
          isActive: false,
          data: {
            id: "",
            title: "",
            description: "",
            image: {},
            cta: {},
            notify_text: {},
          },
        },
      },
      data: null,
    };
  },
  async fetch() {
    try {
      this.isLoading = true;

      const res = await this.$axios.$get(endPoints.GET_FOOD_AND_BEVERAGE);

      // TODO: show no data msg when there's no data found.
      if (res.Success && res.Result) {
        this.data = res.Result;
        this.mapData();
      }

      this.isLoading = false;
    } catch (err) {
      this.isError = true;
      this.isLoading = false;
      console.log({err});
    }
  },
  head() {
    return this.$seoGenerator(this.data, `Food Beverage`)
  },
  watch: {
    data() {
      if (this.data) {
        let tab = {
          title: 'F&B',
          id: 'F&B'
        }
        this.$repositories.viewItemListEvent(tab, this.data.passes_and_events_section)
      }
    }
  },
  methods: {
    mapData() {
      if (this.data && this.data.passes_and_events_section) {
        this.slopeEventsData.data =
          this.data.passes_and_events_section.cards.map((item) => {
            let data = {
              ak: item.id,
              title: item.title,
              price: item.price,
              img: item.image
                ? item.image.image_url
                : require(`@/assets/images/Passes/7.webp`),
              includes: item.includes,
              extra: item.external_link,
              bookingBarDetails: {},
            };
            return Object.assign({}, data, item);
          });

        if (this.data.passes_and_events_section.great_moment) {
          this.slopeEventsData.moments = {
            isActive: true,
            data: {
              id: this.data.passes_and_events_section.great_moment.id,
              title: this.data.passes_and_events_section.great_moment.title,
              image: this.data.passes_and_events_section.great_moment.image
                ? {...this.data.passes_and_events_section.great_moment.image}
                : {},
              cta: this.data.passes_and_events_section.great_moment.cta
                ? {...this.data.passes_and_events_section.great_moment.cta}
                : {},
            },
          };
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./food-beverage.scss";
</style>
