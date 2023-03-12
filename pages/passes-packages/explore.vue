<!--//TODO: Modify these elements when we have time-->
<template>
  <div v-if="data" class="pt-10 lg:pt-20">
    <PassesMain
      :title="data.title"
      :first-subtitle="data.subtitle_one"
      :second-subtitle="data.subtitle_two"
    />

    <div class="explore-section">
      <template v-if="data.slope_box">
        <ExplorePassessSpecial
          :data="data.slope_box" :passes-data="$mapPassesContainerData(data.slope_box)"
          :cta="data.slope_box.cta"
        />
      </template>

      <template v-if="data.carousel_activities && data.carousel_activities.length > 0">
        <ActivityCarousel
          :options="carouselOptions"
          :data="data.carousel_activities"
        />
      </template>

      <div
        v-if="
          data.package_section &&
            data.package_section.cards &&
            data.package_section.cards.length
        "
        class="PackagesContainer"
      >
        <PackagesContainer
          class="pt-3 lg:pt-[4.938rem] pb-[1.375rem] lg:pb-[5rem]"
          :title="data.package_section.title"
          :sub-title="data.package_section.subtitle_one"
          :second-sub-title="data.package_section.subtitle_two"
          background-color="bg-[#fafafa]"
          :packages-data="data.package_section.cards"
        />
      </div>

      <section v-if="data.plan_your_visit" class="mobile-app-section">
        <AppSection :app-section-data="data.plan_your_visit" />
      </section>

      <div
        v-if="slopeEventsData&&slopeEventsData.data&&slopeEventsData.data.length"
        class="bg-[#fafafa] pt-10 lg:pt-20"
      >
        <PassesMain :title="data.event_section.title" />
        <PassesContainer
          custom-class="pt-2 lg:pt-[2.563rem] pb-[3.5rem] lg:pb-[7.5rem]"
          :passes-data="slopeEventsData"
          :is-without-side-slides="true"
        />
      </div>
    </div>
  </div>
</template>
<script>
import PassesContainer from "@/components/PassesPackages/PassesContainer";
import PackagesContainer from "@/components/PassesPackages/PackagesContainer";
import ActivityCarousel from "@/components/PassesPackages/ActivityCarousel";
import PassesMain from "@/components/PassesPackages/PassesMain";
import ExplorePassessSpecial from "@/components/PassesPackages/ExplorePassessSpecial";
import AppSection from "@/components/Shared/AppSection";

export default {
  name: "Explore",
  components: {
    PassesContainer,
    PackagesContainer,
    PassesMain,
    ActivityCarousel,
    ExplorePassessSpecial,
    AppSection
  },
  props: {
    data: {
      type: [Object, Array],
      default: () => ({}),
    },
  },
  data() {
    return {
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
          },
        },
      },
      carouselOptions: {
        title: "title",
        details: "description",
        btnText: "cta",
        path: "",
        imagePath: "api",
      },
    };
  },
  fetch() {
    this.mapData();
  },
  watch: {
    data() {
      this.mapData();
    },
  },
  methods: {
    mapData() {
      if (this.data && this.data.event_section) {
        this.slopeEventsData.data =
          this.data.event_section.cards && this.data.event_section.cards.length
            ? this.data.event_section.cards.map((item) => {
              let data = {
                ak: item.id,
                title: item.title,
                price: item.price,
                img: item.image
                  ? item.image.image_url
                  // eslint-disable-next-line no-undef
                  : require(`@/assets/images/Passes/7.webp`),
                includes: item.includes,
                extra: item.sticker_text,
                bookingBarDetails: {},
              };
              return Object.assign({}, data, item);
            })
            : [];

        if (this.data.event_section.great_moment) {
          this.slopeEventsData.moments = {
            isActive: true,
            data: {
              id: this.data.event_section.great_moment.id,
              title: this.data.event_section.great_moment.title,
              description: this.data.event_section.great_moment.description,
              image: this.data.event_section.great_moment.image
                ? {...this.data.event_section.great_moment.image}
                : {},
              cta: this.data.event_section.great_moment.cta
                ? {...this.data.event_section.great_moment.cta}
                : {},
            },
          };
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.PackagesContainer::v-deep .packages-carousel {
  @apply pt-[1.375rem] lg:pt-20;
  & .slick-list > .slick-track > .slick-slide {
    @apply transition-all duration-[400ms];

    &.slick-active {
      @apply transition-all duration-[400ms] pt-[1.5625rem] lg:pt-0;
    }
  }
}

.mobile-app-section {
  @apply w-full 3xl:mx-auto flex h-[63.875rem] items-center max-w-screen-3xl md:h-[48.5rem];
}
</style>
