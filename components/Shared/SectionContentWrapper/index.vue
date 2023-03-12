<template>
  <section
    class="section-content-wrapper"
    :class="[sectionWrapperClasses,isWithBgImage?'bg-no-repeat bg-center bg-cover':'',isWithBgLayer?'relative':'']"
    :style="{...(isWithBgImage ? {backgroundImage:`url(${bgImage})`} : {})}"
  >
    <div v-if="isWithBgLayer" class="bg-gray-layer" :class="bgLayerCustomClasses" />
    <div class="section-content" :class="sectionContentClasses">
      <HeroLoader v-if="isWithBgImage&&!$slots['section-content']" />

      <slot name="section-content" />
    </div>
  </section>
</template>

<script>
import HeroLoader from "@/components/Shared/HeroLoader";

export default {
  name: "SectionContentWrapper",
  components: {HeroLoader},
  props: {
    sectionWrapperClasses: {
      type: [String, Array],
      default: "",
    },
    sectionContentClasses: {
      type: [String, Array],
      default: "",
    },
    isWithBgImage: {
      type: Boolean,
      default: false,
    },
    isWithBgLayer: {
      type: Boolean,
      default: false
    },
    bgLayerCustomClasses: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      bgImage: ""
    };
  },
  created() {
    if (this.isWithBgImage) {
      this.bgImage = this.$getSiteConfig("siteBackground");
    }
  }
};
</script>

<style lang="scss" scoped>
.section-content-wrapper {
  @apply flex justify-center w-full;

  .bg-gray-layer {
    @apply absolute bg-[#F7F7F7] h-full top-0 w-full -z-1;
  }

  .section-content {
    @apply max-w-screen-ski-dubai-content-max text-white h-full w-full xl:px-0;
  }
}
</style>
