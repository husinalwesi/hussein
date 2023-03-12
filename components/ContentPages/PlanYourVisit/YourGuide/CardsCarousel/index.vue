<template>
  <!--TODO: Remove the passes card from here and put a slot to accept all types of cards (preview, product, image, ..etc)-->
  <section class="cards-carousel-section py-16" :class="classes">
    <div class="content-contianer">
      <h3 class="title">
        {{ data.title }}
      </h3>
      <!--//TODO: See why VueSlickCarousel returns errors when using it in SSR-->
      <client-only>
        <div class="cards-carousel-container">
          <VueSlickCarousel
            ref="cardsSlickCarousel"
            class="cards-carousel"
            v-bind="settings"
            @beforeChange="setNewCardIndex"
          >
            <PassesCard
              v-for="card in data.activities"
              :key="card.id"
              :card-data="card"
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
      </client-only>
    </div>
  </section>
</template>

<script>
import PassesCard from "./PassesCard";

import VueSlickCarousel from "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.common";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.css";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-theme.css";

export default {
  components: {VueSlickCarousel, PassesCard},
  props: {
    classes: {
      type: Array,
      default: () => [],
    },
    data: {type: Object, default: () => ({})},
  },
  data() {
    const isArabicLocale = this.$i18n.localeProperties.detectedLang === 'ar';

    return {
      settings: {
        infinite: false,
        rtl: isArabicLocale,
        arrows: true,
        dots: false,
        slidesToShow: 3,
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
              arrows: true,
              dots: false,
              slidesToShow: 2,
              slidesToScroll: 1,
              rtl: isArabicLocale,
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
      return this.data.activities ? this.data.activities.length : 0;
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

      // eslint-disable-next-line no-extra-boolean-cast
      if (!!this.$refs.cardsSlickCarousel)
        this.$refs.cardsSlickCarousel.goTo(activeCardIndex - 1);
    },
    setNewCardIndex(oldCardIndex, newCardIndex) {
      this.setActiveCardIndex(newCardIndex + 1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./CardsCarousel.scss";
</style>
