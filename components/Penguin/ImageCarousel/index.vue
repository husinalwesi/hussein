<template>
  <SectionContentWrapper section-content-classes="mt-[2.25rem] min-700:my-20 relative">
    <template #section-content>
      <div class="text-header-container">
        <h3 class="title" v-html="data.title?data.title:'Penguin life at Ski Dubai'" />
        <p class="description" v-html="activeCardDetails.description" />
      </div>

      <div v-if="data.carousel_activities&&data.carousel_activities.length" class="cards-carousel-container">
        <!--//TODO: See why VueSlickCarousel returns errors when using it in SSR-->
        <client-only>
          <VueSlickCarousel
            ref="cardsSlickCarousel"
            class="cards-carousel"
            v-bind="carouselSettubgs"
            @beforeChange="setNewCardIndex"
          >
            <img
              v-for="(item, index) in data.carousel_activities"
              :key="index"
              :src="item.image.image_url"
              :alt="item.image.alt_text"
              :title="item.image.title"
              width="250"
              height="250"
              class="h-[250px] max-h-[250px] md:h-[544px] md:max-h-[544px]"
            >
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
                  :class="{ active: cardIndex === activeCardIndex }"
                  @click="setActiveCardIndex(cardIndex)"
                />
              </div>
            </div>
          </div>
        </client-only>
      </div>
    </template>
  </SectionContentWrapper>
</template>

<script>
import SectionContentWrapper from "@/components/Shared/SectionContentWrapper";

import VueSlickCarousel from "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.common";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.css";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-theme.css";

export default {
  components: {
    SectionContentWrapper,
    VueSlickCarousel,
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
      carouselSettubgs: {
        infinite: false,
        rtl: isArabicLocale,
        dots: false,
        arrows: true,
        centerMode: true,
        centerPadding: "0",
        responsive: [
          {
            breakpoint: 699,
            settings: {
              arrows: false,
              dots: false,
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true,
              rtl: isArabicLocale,
            },
          },
          {
            breakpoint: 1023,
            settings: {
              arrows: true,
              dots: false,
              slidesToShow: 1,
              slidesToScroll: 1,
              rtl: isArabicLocale,
            },
          },
        ],
      },
      activeCardDetails: {
        title: "",
        description: "",
      },
      activeCardIndex: 1,
      transformX: 2,
      isRTL: isArabicLocale
    };
  },
  computed: {
    numberOfCards() {
      return this.data&&this.data.carousel_activities ? this.data.carousel_activities.length : 0;
    },
  },
  mounted() {
    if (
      this.data &&
      this.data.carousel_activities &&
      this.data.carousel_activities.length
    )
      this.activeCardDetails = {description: this.data.carousel_activities[0].description};
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
      this.activeCardDetails = {description: this.data.carousel_activities[newCardIndex].description};
      this.setActiveCardIndex(newCardIndex + 1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./imageCarousel.scss";
</style>
