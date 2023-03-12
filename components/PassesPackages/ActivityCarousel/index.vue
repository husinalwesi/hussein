<template>
  <section class="activity-carousel-container">
    <VueSlickCarousel class="activity-carousel" v-bind="settings">
      <div
        v-for="(activity, i) in data"
        :key="i"
        class="activities-container"
        :style="{
          backgroundImage: `url('${
            options.imagePath === 'api' && activity.image
              ? activity.image.image_url
              : activity[options.imagePath]
          }')`,
        }"
      >
        <div class="active-activity-wrapper">
          <div class="title-wrapper">
            <h2>{{ activity[options.title] }}</h2>
          </div>
          <div class="details-wrapper">
            <p>{{ activity[options.details] }}</p>
          </div>
          <template v-if="activity.cta && activity.cta.url">
            <BaseButton
              :btn-type="ctaTypeHandler(activity.cta.url)"
              :cta="activity.cta"
              :text="activity.cta.title"
              :path="activity.cta.url"
            />
          </template>
        </div>
      </div>
    </VueSlickCarousel>
  </section>
</template>

<script>
import BaseButton from "@/components/Shared/BaseUI/BaseButton";
import VueSlickCarousel from "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.common";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.css";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-theme.css";

/* eslint-disable no-undef */

export default {
  components: { VueSlickCarousel,BaseButton },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => ({
        title: "title",
        details: "details",
        btnText: "btnText",
        path: "",
        imagePath: "imgUrl",
      }),
    },
  },
  data() {
    return {
      settings: {
        dots: true,
        arrows: false,
        speed: 500,
        rtl: this.$i18n.localeProperties.detectedLang === 'ar',
        autoplay: true,
        autoplaySpeed: 12000,
        slidesToShow: 1,
        dotsClass: "slick-dots custom-dot-class",
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
      },
      activities: []
    };
  },
  mounted() {
    if (this.$globalData.isMobileDevice) this.handleCarouselDirection();
  },
  methods: {
    handleCarouselDirection() {
      this.settings.vertical = false;
      this.settings.verticalSwiping = false;
    },
    ctaTypeHandler(cta){
      return this.$isExternalLink(cta) ? 'externalLink' : 'link'
    }
  },
};
</script>

<style scoped lang="scss">
@import "./ActivityCarousel.scss";
</style>
