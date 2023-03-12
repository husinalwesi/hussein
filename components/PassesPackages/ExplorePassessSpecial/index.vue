<template>
  <div
    id="find-your-child-section"
    class="
      main-bg-layer
      mt-8
      lg:mt-12
      mb-16
      lg:mb-[12.5rem]
      overflow-hidden
      lg:overflow-visible
    "
  >
    <div
      class="
        relative
        pt-10
        lg:pt-20
        w-[89%]
        bg-[#f4f4f4]
        rounded-tr-[1.25rem] rounded-br-[1.25rem]
        mx-0
        max-w-[auto]
        h-[838px]
        lg:max-w-[1096px] lg:h-[680px] lg:mx-auto lg:ltr:mr-auto lg:rtl:ml-auto
        xl:w-[76%] xl:mx-auto
      "
    >
      <div v-if="$globalData.isDesktopDevice" class="passes-container relative flex">
        <template v-if="passesData.data&&passesData.data[0]">
          <div class="passes-item">
            <PassesCard
              :passes-data="passesData.data[0]"
              :disabled="passesData.data[0].is_sold_out"
              class="inline-block w-passes-img-desktop"
            />
          </div>
        </template>
        <div class="passes-item relative ltr:pl-[1.188rem] rtl:pr-[1.188rem]">
          <div class="ltr:ml-[3.75rem] rtl:mr-[3.75rem] pt-4 max-w-[424px]">
            <p class="font-caveat-bold text-dark-gray text-2xl leading-6">
              {{ data.title }}
            </p>
            <p class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-sm leading-6 text-[#606060] pt-4">
              {{ data.description }}
            </p>
          </div>
          <div class="flex items-start mt-14">
            <template v-if="passesData.data && passesData.data[1]">
              <PassesCard
                :passes-data="passesData.data[1]"
                :disabled="passesData.data[1].is_sold_out"
                class="inline-block w-passes-img-desktop"
              />
            </template>
            <PassessArrow class="hidden lg:block ltr:ml-[67.7px] rtl:mr-[67.7px]" />
          </div>
        </div>
      </div>
      <div v-else>
        <div class="ltr:pl-8 rtl:pr-8 w-[95%]">
          <p class="font-caveat-bold text-dark-gray text-2xl leading-6">
            {{ data.title }}
          </p>
          <p class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-sm leading-6 text-[#606060] pt-4">
            {{ data.description }}
          </p>
        </div>
        <div id="passes-carousel-container">
          <PassesCarousel
            :min-size="1024"
            class="mt-8"
            :passes-data="passesData"
          />
        </div>
      </div>

      <template v-if="cta&&cta.title">
        <NuxtLink
          :to="localePath(cta.url||'/')"
          class="
            absolute
            text-dark-gray
            ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold
            text-sm
            leading-[0.875rem]
            bottom-10
            ltr:right-[2.438rem]
            rtl:left-[2.438rem]
            lg:bottom-[3.5rem] lg:ltr:right-[3.5rem]
            lg:rtl:left-[3.5rem]
          "
        >
          {{ cta.title }}
        </NuxtLink>
      </template>
    </div>
  </div>
</template>
<script>
import PassesCard from "@/components/PassesPackages/PassesCard";
import PassessArrow from "@/components/SVGElements/PassessArrow";
import PassesCarousel from "@/components/PassesPackages/PassesCarousel";

export default {
  name: "ExplorePassessSpecial",
  components: {
    PassesCard,
    PassessArrow,
    PassesCarousel,
  },
  props: {
    passesData: {
      type: Object,
      default: () => ({}),
    },
    cta: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    this.calculateCarouselContainerWidth();
    window.addEventListener("resize", this.calculateCarouselContainerWidth);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.calculateCarouselContainerWidth);
  },
  methods: {
    calculateCarouselContainerWidth() {
      setTimeout(() => {
        if (this.$globalData.isDesktopDevice) return false;

        let passesCarouselContainer = document.querySelector(
          "#passes-carousel-container"
        );
        if (!passesCarouselContainer) return false;

        if (passesCarouselContainer) {
          passesCarouselContainer.style.width = `${window.innerWidth - 16}px`;
        } else {
          passesCarouselContainer.style.width = `auto`;
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
@import "./ExplorePassessSpecial.scss";
</style>
