<template>
  <section id="packages-carousel-container" :class="backgroundColor">
    <div class="container-carousel">
      <div class="flex flex-col">
        <div class="title">
          <div :class="titleClass">
            {{ title }}
          </div>
          <div v-if="subTitle" class="sub-title px-2 mt-4" :class="subtitleClass">
            {{ subTitle }}
          </div>
          <div v-if="secondSubTitle" class="sub-title px-2">
            {{ secondSubTitle }}
          </div>
        </div>
      </div>


      <template v-if="packagesData.length">
        <VueSlickCarousel
          class="packages-carousel"
          v-bind="settings"
        >
          <PackageCard
            v-for="(iteration, index) in packagesData"
            :key="index"
            :packages-data="iteration"
            :corner-color="backgroundColor"
            class="w-full mb-10 mx-0"
          />
        </VueSlickCarousel>
      </template>
    </div>
  </section>
</template>

<script>
import PackageCard from "@/components/PassesPackages/PackageCard";
import VueSlickCarousel from "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.common";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.css";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-theme.css";

export default {
  name: "PackagesContainer",
  components: {
    PackageCard,
    VueSlickCarousel
  },
  props:{
    title: {
      type: String,
      default: ""
    },
    packagesData:{
      type: Array,
      default: () => []
    },
    backgroundColor:{
      type: String,
      default: ""
    },
    subTitle:{
      type: String,
      default: ""
    },
    secondSubTitle:{
      type: String,
      default: ""
    },
    titleClass:{
      type: String,
      default: ""
    },
    subtitleClass: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      settings: {
        infinite: false,
        rtl: this.$i18n.localeProperties.detectedLang === 'ar',
        arrows: true,
        dots: true,
        centerMode: true,
        centerPadding: "0"
      }
    };
  },
  watch: {
    "$globalData.isDesktopDevice"() {
      this.setCarouselSettings();
    }
  },
  mounted() {
    this.setCarouselSettings();
  },
  methods: {
    setCarouselSettings() {
      const isDesktopDevice = this.$globalData.isDesktopDevice;

      this.settings.dots = !isDesktopDevice;
      this.settings.arrows = isDesktopDevice;
    }
  }
};
</script>

<style scoped lang="scss">
@import "./PackagesContainer.scss";
</style>
