<template>
  <main class="ski-school-main">
    <SectionContentWrapper
      section-wrapper-classes="h-fit min-700:h-[27rem]"
      section-content-classes="flex min-700:py-0 px-4 pb-[72px] pt-[128px]"
      :is-with-bg-image="true"
    >
      <template v-if="!isLoading&&data" #section-content>
        <div
          class="text-container"
          :class="{'without-img': data.hero && !data.hero.image}"
        >
          <h1 v-if="data.hero" class="title">
            {{ data.hero.title }}
          </h1>
          <div class="mt-4">
            <h2 class="sub-title">
              {{ data.hero.subtitle }}
            </h2>
          </div>
        </div>

        <div v-if="data.hero&&data.hero.image" class="image-wrapper">
          <img
            v-if="data.hero&&data.hero.image"
            :src="data.hero.image.image_url"
            :alt="data.hero.image.alt_text"
            :title="data.hero.image.title"
            width="340"
            height="340"
          >
        </div>
      </template>
    </SectionContentWrapper>

    <SectionContentWrapper section-wrapper-classes="mt-[-44px]" section-content-classes="flex relative">
      <template #section-content>
        <ul v-if="$globalData.skiSchoolTabsLabel" class="tabs-list" vue-dragscroll>
          <li
            v-for="tab in tabs"
            :key="tab.id"
            class="tab"
            :class="{active: isActiveTab(tab)}"
            @click="onPageTabChange(tab)"
          >
            {{ $globalData.skiSchoolTabsLabel[tab.key] }}
          </li>
        </ul>
      </template>
    </SectionContentWrapper>

    <template v-if="!isLoading && data">
      <SectionContentWrapper section-wrapper-classes="mt-10 md:mt-20">
        <template #section-content>
          <template v-if="activityTabData">
            <div
              v-if="activityTabData.title || activityTabData.description"
              class="activity-tab-events-header"
            >
              <h3 v-if="activityTabData.title" class="title">
                {{ activityTabData.title }}
              </h3>

              <div
                v-if="activityTabData.description"
                class="description-wrapper"
              >
                <p class="description">
                  {{ activityTabData.description }}
                </p>
              </div>
            </div>

            <PassesContainer
              v-if="
                activityTabData.activities_cards &&
                  activityTabData.activities_cards.length
              "
              custom-class="full-container"
              :passes-data="slopeEventsData"
              :show-email="true"
              card-type="time-based"
              :is-without-side-slides="true"
            />
          </template>
          <template v-if="data.ski_school_activity_section">
            <SchoolBenefits :data="data.ski_school_activity_section" />
          </template>
        </template>
      </SectionContentWrapper>

      <BlueCard
        v-if="data.ski_school_help_box"
        :data="data.ski_school_help_box"
        @blueTabClicked="blueTabChanged"
      />

      <div class="arrow-container">
        <img
          src="~/assets/images/ContentPages/PlanYourVisit/YourGuide/PassesEvents/Desktop/down-arrow.png"
          alt="arrow image"
          title="arrow image"
          class="rtl:scale-x-[-1]"
        >
      </div>

      <template v-if="data.instructor_section">
        <OurInstructor
          :data="data.instructor_section"
          :wrapper-classes="!!data.plan_your_visit ? 'mb-8 mobiles:mb-[3rem]' : ''"
          section-title-classes="max-w-[20.4375rem] md:max-w-[40.5rem] min-1120:max-w-[46.875rem]"
          description-wrapper-classes="min-1120:max-w-[54.5rem] max-w-[20.4375rem] md:max-w-[40.5rem]"
        />
      </template>

      <div v-if="data.plan_your_visit" class="mobile-app-wrapper">
        <AppSection :app-section-data="data.plan_your_visit" />
      </div>
    </template>
    <template v-else>
      <snowflake-loader />
    </template>
  </main>
</template>

<script>
import BlueCard from "@/components/SkiSchoolComponent/BlueCard";
import OurInstructor from "@/components/Shared/OurInstructor";
import SchoolBenefits from "@/components/SkiSchoolComponent/SchoolBenefits";
import PassesContainer from "@/components/PassesPackages/PassesContainer";
import SectionContentWrapper from "@/components/Shared/SectionContentWrapper";
import AppSection from "@/components/Shared/AppSection";
import SnowflakeLoader from "@/components/Shared/Loaders/SnowflakeLoader";

export default {
  name: "SkiSchool",
  components: {
    BlueCard,
    OurInstructor,
    PassesContainer,
    SchoolBenefits,
    SectionContentWrapper,
    AppSection,
    SnowflakeLoader
  },
  data() {
    return {
      activityTabData: {},
      activeCardIndex: 1,
      transformX: 2,
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
            notify_text: {},
          },
        },
      },
      seo: null,
      tabs: [
        {
          id: 1,
          name: "Shine at Ski Academy",
          hero: {
            title: 'Shine at Ski Academy',
            subTitle: 'Bringing skiing and snowboarding to the middle of the desert',
            customClass: '-z-1 large'
          },
          url: '/ski-academy',
          key: 'shine_at_ski_school_tab_title'
        },
        {
          id: 2,
          name: "Ski lessons",
          hero: {
            title: 'Learn to Ski',
            subTitle: 'Bringing skiing and snowboarding to the middle of the desert',
            customClass: '-z-1 large'
          },
          url: '/ski-lessons',
          key: 'ski_lessons_tab_title'
        },
        {
          id: 3,
          name: "Snowboard lessons",
          hero: {
            title: 'Learn to snowboard',
            subTitle: 'Bringing skiing and snowboarding to the middle of the desert',
            customClass: '-z-1 large'
          },
          url: '/snowboard-lessons',
          key: 'snowboard_lessons_tab_title'
        },
      ],
      isLoading: false
    };
  },
  async fetch() {
    try {
      this.isLoading = true
      const result = await this.$repositories.getSkiSchool();

      if ((((result || {}).ski_school_help_box || {}).help_box_categories || []).length) {
        const schoolCateg = result.ski_school_help_box.help_box_categories[0].ski_school_filter_category || null;

        if (schoolCateg) {
          this.activityTabData = schoolCateg;
          this.mapData(schoolCateg);
        }

        this.data = result;
        this.seo = result.seo;
      }
      this.isLoading = false
    } catch (err) {
      this.isLoading = false
      // TODO: show proper error message.
      console.log({err});
    }
  },
  head() {
    return this.$seoGenerator(this.seo, "Ski Academy");
  },
  watch: {
    activityTabData() {
      if (this.activityTabData) {
        let tab = {
          title: 'Ski Academy',
          id: '1'
        }
        this.$repositories.viewItemListEvent(tab, this.activityTabData.activities_cards, 'ski', 'Ski Academy')
      }
    }
  },
  methods: {
    blueTabChanged(tab) {
      this.mapData(tab.ski_school_filter_category);
      this.activityTabData = tab.ski_school_filter_category;
    },
    setActiveCardIndex(activeCardIndex) {
      this.activeCardIndex = activeCardIndex;
      let transformX = 2;

      if (activeCardIndex > 2) {
        if (this.numberOfCards === activeCardIndex) {
          transformX = (activeCardIndex - 4) * -10;
        } else transformX = (activeCardIndex - 3) * -10;

        transformX = transformX - 9;
      }
      this.transformX = transformX;
      if (this.$refs.cardsSlickCarousel)
        this.$refs.cardsSlickCarousel.goTo(activeCardIndex - 1);
    },
    setNewCardIndex(oldCardIndex, newCardIndex) {
      this.setActiveCardIndex(newCardIndex + 1);
    },
    mapData(data) {
      if (data && data.activities_cards && data.activities_cards.length) {
        this.slopeEventsData.data = data.activities_cards.map((item) => {
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
      }

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
            notify_text: data.great_moment.notify_text,
          },
        };
      }
    },
    onPageTabChange(tab) {
      this.$router.push(this.localePath(tab.url))
    },
    isActiveTab(tab) {
      let currentPath = this.$route.path
      return this.localePath(tab.url.toString()) === this.localePath(currentPath.toString())
    },
  },
};
</script>

<style lang="scss" scoped>
@import "SkiSchoolComponent";
</style>
