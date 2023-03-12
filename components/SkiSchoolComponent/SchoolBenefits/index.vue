<template>
  <div>
    <div class="body-title mt-[5rem] mobiles:mt-10 px-4">
      {{ data.title }}
    </div>
    <div class="body-subtitle lg:px-0 px-4">
      {{ data.subtitle || data.description }}
    </div>
    <div v-if="data.cta && data.cta.url" class="mt-6 lg:px-0 px-4">
      <BaseButton
        :btn-type="$isExternalLink(data.cta.url) ? 'externalLink' : 'link'"
        :text="data.cta.title"
        :path="data.cta.url"
        class-name="school-passport-link"
      />
    </div>

    <div class="binifit-cards-carousel-wrapper">
      <div class="content-contianer">
        <div class="cards-carousel-container">
          <VueSlickCarousel
            ref="cardsSlickCarousel"
            class="cards-carousel"
            v-bind="settings"
            @beforeChange="setNewCardIndex"
          >
            <SkiCard
              v-for="(cardItem, cardIndex) in data.activities"
              :key="cardIndex"
              :card-item="cardItem"
            />
          </VueSlickCarousel>

          <div class="carousel-custom-dots-wrapper">
            <div v-if="numberOfCards > 1" class="custom-dots-container">
              <div
                class="dots"
                :style="`transform:translateX(${transformX}px)`"
              >
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
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/Shared/BaseUI/BaseButton";
import SkiCard from "@/components/SkiSchoolComponent/SkiCard";

import VueSlickCarousel from "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.common";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.css";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-theme.css";

export default {
  components: {
    BaseButton,
    SkiCard,
    VueSlickCarousel
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
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
            breakpoint: 699,
            settings: {
              arrows: false,
              dots: false,
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true,
              centerPadding: "16px",
              rtl: isArabicLocale,
            },
          },
          {
            breakpoint: 1023,
            settings: {
              arrows: false,
              dots: false,
              slidesToShow: 2,
              slidesToScroll: 1,
              rtl: isArabicLocale,
            },
          },
        ],
      },
      biniftCardIndex: 1,
      transformX: 2,
      numberOfCards: 0,
      isRTL: isArabicLocale
    };
  },
  mounted() {
    this.numberOfCards = this.data.activities.length;
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
  }
};
</script>

<style lang="scss" scoped>
@import "./SchoolBenefits.scss";
</style>
