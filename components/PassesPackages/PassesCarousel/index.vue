<template>
  <div v-if="passesData.data && passesData.data.length" class="relative">
    <VueSlickCarousel
      :key="carouselKey"
      v-bind="settings"
      ref="carouselPasses"
      class="passess-carousel"
      :class="{ singleSlideAtView: isWithoutSideSlides }"
      @beforeChange="beforeChangeCarousel"
    >
      <PassesCard
        v-for="(iteration, index) in passesData.data"
        :key="index"
        :passes-data="iteration"
        :min-size="minSize"
        class="mb-10"
        :show-price="!hidePassPrice"
        :card-type="cardType"
        :disabled="iteration.is_sold_out"
        :badge-label="!!iteration.label_text ? iteration.label_text : ''"
        :show-badge="!!iteration.label_text"
        @openNotificationModal="$emit('openNotificationModal', iteration)"
      />
      <MomentsCard
        v-if="passesData.moments.isActive"
        class="mb-10"
        :data="passesData.moments.data"
        :show-email="showEmail"
      />
    </VueSlickCarousel>

    <div
      v-if="slideCounter > 1"
      class="dots-container absolute bottom-1 left-0 right-0"
    >
      <div class="dots" :style="`transform:translateX(${transformX}px)`">
        <a
          v-for="slideCount of slideCounter"
          :key="slideCount"
          href="javascript:void(0);"
          aria-label="carousel-dots"
          :class="{
            active: slideCount == currentSlide,
            currentSlide:
              slideCount == currentSlide + 1 ||
              slideCount == currentSlide - 1 ||
              (slideCount == currentSlide + 2 && currentSlide == 1) ||
              (slideCount == currentSlide - 2 && currentSlide == slideCounter),
          }"
          @click="setSlide(slideCount)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import PassesCard from "@/components/PassesPackages/PassesCard";
import MomentsCard from "@/components/PassesPackages/MomentsCard";
import VueSlickCarousel from "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.common";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.css";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-theme.css";

export default {
  name: "PassesCarousel",
  components: {
    PassesCard,
    VueSlickCarousel,
    MomentsCard,
  },
  props: {
    passesData: {
      type: Object,
      default: () => ({})
    },
    minSize: {
      type: Number,
      default: 0
    },
    isWithoutSideSlides: {
      type: Boolean,
      default: false
    },
    showEmail: {
      type: Boolean,
      default: false
    },
    cardType: {
      type: String,
      default: "passes"
    },
    hidePassPrice: {
      type: Boolean,
      default: false
    }
  },
  emits: ["openNotificationModal"],
  data() {
    const isArabicLocale = this.$i18n.localeProperties.detectedLang === "ar";

    return {
      currentSlide: 1,
      settings: {
        dots: false,
        arrows: false,
        speed: 833,
        infinite: false,
        rtl: isArabicLocale,
        centerMode: true,
        centerPadding: "0",
      },
      carouselKey: this.$getTimeStamp(),
      transformX: 2,
      isRTL: isArabicLocale
    };
  },
  computed: {
    slideCounter() {
      if (!this.passesData.data) return 0;
      let passesLength = this.passesData.data.length;
      if (this.passesData.moments.isActive) passesLength++;
      return passesLength;
    },
  },
  watch: {
    passesData() {
      this.reInitializeCarousel();
    },
  },
  mounted() {
    setTimeout(() => {
      this.setSlide(1);
    });
  },
  methods: {
    reInitializeCarousel() {
      this.carouselKey = this.$getTimeStamp();
      setTimeout(() => {
        this.setSlide(1);
      });
    },
    setSlide(slideCount) {
      this.currentSlide = slideCount;
      let transformX = 2;

      if (slideCount > 2) {
        if (this.slideCounter == slideCount)
          transformX = (slideCount - 4) * -10;
        //if last slide
        else transformX = (slideCount - 3) * -10;

        if (this.isRTL) {
          if (transformX < 0) transformX *= -1;
          transformX += 9;
        } else transformX -= 9;
      }

      this.transformX = transformX;

      if (this.$refs.carouselPasses)
        this.$refs.carouselPasses.goTo(slideCount - 1);
    },
    beforeChangeCarousel(oldSlideIndex, newSlideIndex) {
      this.setSlide(newSlideIndex + 1);
    }
  }
};
</script>
<style scoped lang="scss">
@import "./PassesCarousel.scss";
</style>
