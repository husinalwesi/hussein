<template>
  <main v-if="!isLoading" class="your-guide-main">
    <template v-if="isError">
      <ErrorModal :show-error-modal="isError" />
    </template>

    <template v-else-if="data">
      <template v-if="data.hero">
        <SectionContentWrapper
          section-wrapper-classes="hero-section"
          section-content-classes="hero-section-content-container"
          :is-with-bg-image="true"
        >
          <template #section-content>
            <div
              class="text-container"
              :class="{'without-img': !data.hero.image}"
            >
              <h1 v-if="data.hero.title" class="title">
                {{ data.hero.title }}
              </h1>
              <div class="sub-elems-container">
                <h2 v-if="data.hero.subtitle" class="sub-title">
                  {{ data.hero.subtitle }}
                </h2>
                <img
                  v-if="env.includes('dubai')"
                  src="~/assets/images/ContentPages/PlanYourVisit/YourGuide/yellowUnderline.png"
                  alt="yellow line"
                  title="yellow line"
                  width="244"
                  height="22"
                  class="w-[15.25rem] h-[1.375rem] ltr:ml-3 rtl:mr-3 min-550:ltr:ml-0 min-550:rtl:mr-0"
                >
              </div>
            </div>

            <div v-if="data.hero.image" class="image-wrapper">
              <img
                :src="
                  data.hero.image.image_url
                    ? data.hero.image.image_url
                    : defaultData.image.image_url
                "
                :alt="
                  data.hero.image.alt_text
                    ? data.hero.image.alt_text
                    : defaultData.image.alt_text
                "
                :title="
                  data.hero.image.title
                    ? data.hero.image.title
                    : defaultData.image.title
                "
                width="340"
                height="340"
              >
            </div>
          </template>
        </SectionContentWrapper>
      </template>

      <template v-if="data.pass_section && data.pass_section.cards && data.pass_section.cards.length">
        <SectionContentWrapper section-wrapper-classes="mt-10 md:mt-20 mb-6">
          <template #section-content>
            <h3
              v-if="data.pass_section.title"
              class="
                  ltr:font-druk-wide-heavy-italic
                  rtl:font-adapter
                  leading-6
                  md:leading-8 md:text-[2rem]
                  min-1120:px-0
                  px-4
                  text-2xl text-dark-gray
                "
            >
              {{ data.pass_section.title }}
            </h3>

            <PassesContainer
              v-if="slopeEventsData.data"
              custom-class="full-container"
              :passes-data="slopeEventsData"
              :show-email="false"
              :hide-pass-price="true"
              class="mt-6 md:mt-10"
              card-type="time-based"
              :is-without-side-slides="true"
            />
          </template>
        </SectionContentWrapper>
      </template>

      <template
        v-if="
          data.carousel_activity &&
            data.carousel_activity.activities &&
            data.carousel_activity.activities.length
        "
      >
        <CardsCarousel :data="data.carousel_activity" :classes="['pt-10']" />
      </template>

      <template v-if="data.experience_box">
        <ExperienceActivities
          :experience-activities-data="data.experience_box"
          :classes="
            !(
              data.carousel_activity &&
              data.carousel_activity.activities &&
              data.carousel_activity.activities.length
            )
              ? 'mt-10'
              : ''
          "
        />
      </template>

      <template v-if="data.extra_carousel_activity">
        <CardsCarousel :data="data.extra_carousel_activity" />
      </template>

      <template v-if="data.title || data.description">
        <SectionContentWrapper
          section-wrapper-classes="pt-[4.5rem]"
          section-content-classes="px-4"
        >
          <template #section-content>
            <div class="exploration-section-content">
              <h3
                v-if="data.title"
                class="title"
                v-html="$splitTextToLines(data.title)"
              />
              <div v-if="data.description" class="description-wrapper">
                <div
                  class="description"
                  v-html="$splitTextToLines(data.description)"
                />
              </div>
            </div>
          </template>
        </SectionContentWrapper>
      </template>

      <template v-if="data.experiences_boxes && data.experiences_boxes.length">
        <ExperienceActivities
          v-for="(experience_box, idx) in data.experiences_boxes"
          :key="idx"
          :experience-activities-data="experience_box"
          :classes="idx === 0 ? 'mt-16 md:mt-20' : ''"
          :is-with-bg-layer="idx % 2 === 0"
        />
      </template>

      <template
        v-if="
          data.cards_section &&
            data.cards_section.cards &&
            data.cards_section.cards.length
        "
      >
        <SectionContentWrapper
          section-wrapper-classes="py-16 md:py-[120px]"
          section-content-classes="px-4 flex flex-col"
        >
          <template #section-content>
            <div class="mb-8 md:mb-[120px]">
              <h3
                v-if="data.cards_section.title"
                class="
                    ltr:font-druk-wide-heavy-italic
                    rtl:font-adapter
                    leading-6
                    md:text-[2rem] md:leading-8
                    text-dark-gray text-2xl
                    uppercase
                  "
              >
                {{ data.cards_section.title }}
              </h3>
            </div>
            <EventCard
              v-for="(card, i) in data.cards_section.cards"
              :key="i"
              :data="card"
              :direction="i % 2 === 0 ? 'right' : 'left'"
              :custom-container-classes="
                i !== data.cards_section.cards.length - 1
                  ? 'mb-10 md:mb-6'
                  : ''
              "
            />
          </template>
        </SectionContentWrapper>
      </template>

      <template v-if="data.extra_card">
        <SectionContentWrapper
          section-wrapper-classes="py-16 md:py-[120px]"
          section-content-classes="px-4"
          :is-with-bg-layer="true"
        >
          <template #section-content>
            <EventCard :data="data.extra_card" direction="right" />
          </template>
        </SectionContentWrapper>
      </template>

      <template v-if="data.plan_your_visit_box">
        <PrepareYourVisit
          :prepare-your-visit-data="data.plan_your_visit_box"
          :classes="!data.extra_carousel_activity ? 'mt-8 min-700:mt-20' : ''"
        />
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
import PassesContainer from "@/components/PassesPackages/PassesContainer";
import CardsCarousel from "@/components/ContentPages/PlanYourVisit/YourGuide/CardsCarousel";
import ExperienceActivities from "@/components/ContentPages/PlanYourVisit/YourGuide/ExperienceActivities";
import EventCard from "@/components/Shared/Event-Card";
import PrepareYourVisit from "@/components/ContentPages/PlanYourVisit/YourGuide/PrepareYourVisit";
import NoData from "@/components/Shared/NoData";

import {endPoints} from "@/const/api";

export default {
  components: {
    ErrorModal,
    SectionContentWrapper,
    PassesContainer,
    CardsCarousel,
    ExperienceActivities,
    EventCard,
    PrepareYourVisit,
    NoData
  },
  data() {
    return {
      isLoading: true,
      isError: false,
      data: null,
      defaultData: {
        image: {
          // eslint-disable-next-line no-undef
          image_url: require("@/assets/images/ContentPages/Shared/family.png"),
          alt_text: "Family",
          title: "Family"
        }
      },
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
            notify_text: {}
          }
        }
      },
      env: ""
    };
  },
  async fetch() {
    try {
      //TODO: Talk to Mohamed Khalaf in order to standardize the APIs for this page to be just one API.
      const currentEnv = this.$getSiteCurrentEnvironment();
      this.env = currentEnv;

      const endPoint = currentEnv.includes("dhabi")
        ? endPoints.GET_SNOW_AD_PLAN_YOUR_VISIT_YOUR_GUIDE_DATA
        : currentEnv.includes("oman")
          ? endPoints.GET_SNOW_OMAN_PLAN_YOUR_VISIT_YOUR_GUIDE_DATA
          : endPoints.GET_PLAN_YOUR_VISIT_YOUR_GUIDE_DATA;

      let res = await this.$axios.$get(endPoint);

      // TODO: show no data msg when there's no data found.
      if (res.Success && res.Result) {
        if (res.Result.experiences_boxes && res.Result.experiences_boxes.length) {
          res.Result.experiences_boxes = res.Result.experiences_boxes.map(
            (exp) => {
              const flattendActivitiesArr = this.activitiesPairingHandler(
                exp.activities
              );

              return {
                ...exp,
                activities: flattendActivitiesArr,
              };
            }
          );
        }

        if (res.Result.experience_box && res.Result.experience_box.activities)
          // pairing the activities.
          res.Result.experience_box.activities = this.activitiesPairingHandler(
            res.Result.experience_box.activities
          );

        if (res.Result.pass_section && res.Result.pass_section.cards && res.Result.pass_section.cards.length) this.mapData(res.Result.pass_section);

        this.data = res.Result;
      }

      this.isLoading = false;
    } catch (err) {
      this.isError = true;
      this.isLoading = false;
      console.log({err});
    }
  },
  head() {
    return this.$seoGenerator(this.data, `Your Guide`)
  },
  methods: {
    activitiesPairingHandler(activities) {
      const arr = activities.reduce((result, value, index, array) => {
        if (index % 2 === 0) {
          return [...result, array.slice(index, index + 2)];
        }
        return result;
      }, []);

      return arr;
    },
    mapData(data) {
      this.slopeEventsData.data = data.cards.map((item) => {
        let data = {
          ak: item.id,
          title: item.title,
          price: item.price,
          img: item.image
            ? item.image.image_url
            : // eslint-disable-next-line no-undef
            require(`@/assets/images/Passes/7.webp`),
          includes: item.includes,
          extra: item.sticker_text,
          bookingBarDetails: {},
        };
        return Object.assign({}, data, item);
      });

      if (data.great_moment) {
        this.slopeEventsData.moments = {
          isActive: true,
          data: {
            id: data.great_moment.id,
            title: data.great_moment.title,
            description: data.great_moment.description,
            image: data.great_moment.image
              ? {...data.great_moment.image}
              : {},
            cta: data.great_moment.cta ? {...data.great_moment.cta} : {},
            notify_text: data.great_moment.notify_text
          }
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./your-guide.scss";
</style>
