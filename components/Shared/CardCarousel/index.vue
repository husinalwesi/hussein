<template>
  <section class="cards-carousel-section" :class="classes">
    <div class="content-contianer">
      <div class="cards-carousel-container">
        <VueSlickCarousel
          ref="cardsSlickCarousel"
          class="cards-carousel"
          v-bind="settings"
          @beforeChange="setNewCardIndex"
        >
          <PassesCard
            v-for="(card,i) in cards"
            :key="i" :show-badge="!!card.label_text"
            :badge-label="card.label_text" class="mb-12"
            :disabled="card.is_sold_out"
            :cta-label="'Book lessons'"
            :show-price="true"
            :card-type="cardType"
            :passes-data="card"
          />
        </VueSlickCarousel>

        <div class="carousel-custom-dots-wrapper">
          <div v-if="numberOfCards > 1" class="custom-dots-container">
            <div class="dots" :style="`transform:translateX(${transformX}px)`">
              <span
                v-for="cardIndex of numberOfCards"
                :key="cardIndex"
                :class="{ active: cardIndex === activeCardIndex }"
                @click="setActiveCardIndex(cardIndex)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

import VueSlickCarousel from "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.common";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.css";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-theme.css";

import PassesCard from "@/components/PassesPackages/PassesCard";

export default {
  name: 'CardCarousel',
  components: {PassesCard, VueSlickCarousel},
  props: {
    classes: {
      type: [String,Array],
      default: () => [],
    },
    title: {
      type: String,
      required: true,
    },
    cards: {
      type: Array,
      required: true,
    },
    isLessonCard: {
      type: Boolean,
      required: false,
    },
    cardType:{
      type:String,
      default:'passes'
    }
  },
  data() {
    const isArabicLocale = this.$i18n.localeProperties.detectedLang === 'ar';

    return {
      settings: {
        infinite: false,
        rtl: isArabicLocale,
        arrows: true,
        dots: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 699,
            settings: {
              arrows: false,
              dots: false,
              rtl: isArabicLocale,
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true,
              centerPadding: "0px",
            },
          },
          {
            breakpoint: 1023,
            settings: {
              arrows: true,
              dots: false,
              rtl: isArabicLocale,
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
        ],
      },
      activeCardIndex: 1,
      transformX: 2,
      isRTL: isArabicLocale
    };
  },
  computed: {
    numberOfCards() {
      return this.cards.length;
    },
  },
  methods: {
    setActiveCardIndex(activeCardIndex) {
      this.activeCardIndex = activeCardIndex;
      let transformX = 2;

      if (activeCardIndex > 2) {
        if (this.numberOfCards === activeCardIndex)
          transformX = (activeCardIndex - 4) * -10;
        else transformX = (activeCardIndex - 3) * -10;

        if (this.isRTL) {
          if (transformX < 0) transformX *= -1;
          transformX += 9;
        } else transformX -= 9;
      }
      this.transformX = transformX;
      if (this.$refs.cardsSlickCarousel)
        this.$refs.cardsSlickCarousel.goTo(activeCardIndex - 1);
    },
    setNewCardIndex(oldCardIndex, newCardIndex) {
      this.setActiveCardIndex(newCardIndex + 1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./card-carousel.scss";
</style>
