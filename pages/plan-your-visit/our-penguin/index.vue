<template>
  <main v-if="!isLoading" class="speak-penguin-main">
    <template v-if="isError">
      <ErrorModal :show-error-modal="isError" />
    </template>

    <template v-else-if="data">
      <template v-if="data.hero">
        <SectionContentWrapper
          section-wrapper-classes="h-fit min-700:h-[27rem]"
          section-content-classes="flex min-700:py-0 px-4 pb-16 pt-[7.75rem]"
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
                class="w-fit h-fit max-h-[340px]"
              >
            </div>
          </template>
        </SectionContentWrapper>
      </template>

      <template v-if="data.carousel_activity_section">
        <ImageCarousel :data="data.carousel_activity_section" />
      </template>

      <template v-if="data.packages_section_data">
        <SectionContentWrapper
          section-wrapper-classes="mt-16 lg:mt-10"
          section-content-classes="px-4"
        >
          <template #section-content>
            <div class="max-w-[872px]">
              <div class="title text-dark-gray">
                {{ data.packages_section_data.title }}
              </div>
              <div class="subtitle mt-4">
                {{ data.packages_section_data.description }}
              </div>
            </div>
          </template>
        </SectionContentWrapper>
      </template>

      <template
        v-if="
          data.packages_section_data &&
            data.packages_section_data.package_section
        "
      >
        <PackagesContainer
          :packages-data="data.packages_section_data.package_section.cards"
          :title="data.packages_section_data.package_section.title"
          title-class="max-w-[868px] ltr:font-inter-bold rtl:font-noto-sans-arabic-bold normal-case"
        />
      </template>

      <template v-if="data.passes_section">
        <SectionContentWrapper section-wrapper-classes="pt-10">
          <template #section-content>
            <div
              v-if="data.passes_section.title"
              class="ltr:font-inter-bold rtl:font-noto-sans-arabic-bold leading-8 lg:px-0 px-4 text-[1.75rem] text-dark-gray"
            >
              {{ data.passes_section.title }}
            </div>
            <PassesContainer
              v-if="data.passes_section.cards"
              custom-class="full-container"
              :passes-data="slopeEventsData"
              :show-email="false"
              class="pt-6"
              card-type="time-based"
              :is-without-side-slides="true"
            />
          </template>
        </SectionContentWrapper>
      </template>

      <template v-if="data.card_section">
        <SectionContentWrapper
          section-wrapper-classes="mb-10 md:mb-[7.5rem] md:mt-[10rem] mt-20"
          section-content-classes="flex flex-col-reverse flex-wrap items-center justify-between lg:flex-row px-4"
        >
          <template #section-content>
            <img
              v-if="
                data.card_section.image && data.card_section.image.image_url
              "
              :src="data.card_section.image.image_url"
              :alt="data.card_section.image.alt_text"
              :title="data.card_section.image.title"
              width="536"
              height="400"
              class="h-full lg:max-h-[25rem] lg:max-w-[33.5rem] max-h-[16rem] rounded-3xl w-full"
            >

            <div class="mb-10 lg:mb-0 md:max-w-[420px]">
              <h2
                v-if="data.card_section.title"
                class="ltr:font-druk-wide-heavy-italic rtl:font-adapter leading-6 min-700:leading-8 min-700:text-[2rem] text-2xl text-dark-black  uppercase"
              >
                {{ data.card_section.title }}
              </h2>
              <div v-if="data.card_section.description_highlighted" class="md:mt-6 mt-4">
                <p class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler opacity-60 text-dark-black text-sm">
                  {{ data.card_section.description_highlighted }}
                </p>
              </div>
            </div>
          </template>
        </SectionContentWrapper>
      </template>

      <template v-if="data.did_you_know && data.did_you_know.activities && data.did_you_know.activities.length">
        <SectionContentWrapper
          :section-wrapper-classes="[
            'pt-10 pb-16 lg:pt-20 lg:pb-[6rem] bg-[#142B73]',
            !data.card_section ? 'mt-16 lg:mt-[7.5rem]' : ''
          ]"
          section-content-classes="px-4"
        >
          <template #section-content>
            <div
              v-if="data.did_you_know.title"
              class="title white-title mb-10"
            >
              {{ data.did_you_know.title }}
            </div>
            <div class="flex flex-wrap  gap-x-5 gap-y-4 md:justify-between lg:justify-start">
              <CardPenguin
                v-for="(penguinCard, penguinIndex) in data.did_you_know.activities"
                :key="penguinIndex"
                :card-data="penguinCard"
                class="min-700:max-w-[343px]"
              />
            </div>
          </template>
        </SectionContentWrapper>
      </template>

      <template v-if="data.penguins_section">
        <SectionContentWrapper
          :section-wrapper-classes="[
            'pt-10 lg:pt-20 bg-[#0D4F941A]',
            data.plan_your_visit ? '' : 'mb-16'
          ]"
        >
          <template #section-content>
            <MeetPenguin :data="data.penguins_section" />
          </template>
        </SectionContentWrapper>
      </template>

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
import ImageCarousel from "@/components/Penguin/ImageCarousel";
import PackagesContainer from "@/components/PassesPackages/PackagesContainer";
import PassesContainer from "@/components/PassesPackages/PassesContainer";
import CardPenguin from "@/components/Penguin/CardPenguin";
import MeetPenguin from "@/components/Penguin/MeetPenguin";
import AppSection from "@/components/Shared/AppSection";
import NoData from "@/components/Shared/NoData";

import {endPoints} from "@/const/api";

/* eslint-disable no-undef */

export default {
  components: {
    ErrorModal,
    SectionContentWrapper,
    CardPenguin,
    ImageCarousel,
    MeetPenguin,
    PassesContainer,
    PackagesContainer,
    AppSection,
    NoData
  },
  data() {
    return {
      isError: false,
      isLoading: false,
      data: null,
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
          }
        }
      }
    };
  },
  async fetch() {
    try {
      this.isLoading = true;

      const res = await this.$axios.$get(endPoints.GET_SPEAK_PENGUIN);

      // TODO: show no data msg when there's no data found.
      if (res.Success && res.Result) {
        this.data = res.Result;
        this.mapData();
      }

      this.isLoading = false;
    } catch (err) {
      this.isError = true;
      this.isLoading = false;
      console.log({ err });
    }
  },
  head() {
    return this.$seoGenerator(this.data, "Our Penguin")
  },
  methods: {
    mapData() {
      if (this.data && this.data.passes_section) {
        this.slopeEventsData.data = this.data.passes_section.cards.map(
          (item) => {
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
          }
        );

        if (this.data.passes_section.great_moment) {
          this.slopeEventsData.moments = {
            isActive: true,
            data: {
              id: this.data.passes_section.great_moment.id,
              title: this.data.passes_section.great_moment.title,
              description: this.data.passes_section.great_moment.description,
              image: this.data.passes_section.great_moment.image
                ? { ...this.data.passes_section.great_moment.image }
                : {},
              cta: this.data.passes_section.great_moment.cta
                ? { ...this.data.passes_section.great_moment.cta }
                : {},
              notify_text: this.data.passes_section.great_moment.notify_text,
            },
          };
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./speak-penguin.scss";
</style>
