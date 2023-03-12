<template>
  <div class="achievements-card">
    <div v-if="data.title" class="title-wrapper">
      <h3 class="title">
        {{ data.title }}
      </h3>
    </div>

    <div
      v-if="data.achievements && data.achievements.length"
      class="cards-carousel-container"
    >
      <VueSlickCarousel
        ref="cardsSlickCarousel"
        class="cards-carousel"
        v-bind="settings"
        @beforeChange="setNewCardIndex"
      >
        <AchievementCard
          v-for="achievement in data.achievements"
          :key="achievement.id"
          :data="achievement"
        />
      </VueSlickCarousel>

      <div class="carousel-custom-dots-wrapper">
        <div v-if="numberOfCards > 1" class="custom-dots-container">
          <div class="dots" :style="`transform:translateX(${transformX}px)`">
            <span
              v-for="cardIndex of numberOfCards"
              :key="cardIndex"
              :class="{ active: cardIndex === biniftCardIndex }"
              @click="setActiveCardIndex(cardIndex)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueSlickCarousel from "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.common";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.css";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-theme.css";


import AchievementCard from "./AchievementCard";

export default {
  components: {
    VueSlickCarousel,
    AchievementCard,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const isArabicLocale = this.$i18n.localeProperties.detectedLang === 'ar';

    return {
      settings: {
        infinite: false,
        rtl: isArabicLocale,
        arrows: false,
        dots: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1023,
            settings: {
              arrows: false,
              dots: false,
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true,
              centerPadding: "0px",
              rtl: isArabicLocale,
            },
          },
        ],
      },
      biniftCardIndex: 1,
      transformX: 2,
      isRTL: isArabicLocale
    };
  },
  computed: {
    numberOfCards() {
      return this.data && this.data.achievements
        ? this.data.achievements.length
        : 0;
    },
  },
  methods: {
    setActiveCardIndex(biniftCardIndex) {
      this.biniftCardIndex = biniftCardIndex;
      let transformX = 2;

      if (biniftCardIndex > 2) {
        if (this.numberOfCards === biniftCardIndex)
          transformX = (biniftCardIndex - 4) * -10;
        else transformX = (biniftCardIndex - 3) * -10;

        if (this.isRTL) {
          if (transformX < 0) transformX *= -1;
          transformX += 9;
        } else transformX -= 9;
      }
      this.transformX = transformX;
      if (this.$refs.cardsSlickCarousel)
        this.$refs.cardsSlickCarousel.goTo(biniftCardIndex - 1);
    },
    setNewCardIndex(oldCardIndex, newCardIndex) {
      this.setActiveCardIndex(newCardIndex + 1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "Achievements.scss";
</style>
