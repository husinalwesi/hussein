<template>
  <div
    :class="[customClass, isBgImage ? 'bg-no-repeat bg-center bg-cover' : '']"
    class="solid-bg bg-cover"
    :style="{ backgroundImage: isBgImage ? `url(${bgImage})` : '' }"
  >
    <div
      v-if="sectionImage && sectionImage.image_url"
      class="section-img-wrapper justify-start"
      :class="sectionImageWrapperClasses"
    >
      <img
        :src="sectionImage.image_url"
        :alt="sectionImage.alt"
        :title="sectionImage.title"
        onerror="this.style.display = 'none'"
        width="300"
        height="300"
        :class="sectionImageClasses"
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isBgImage: {
      type: Boolean,
      default: () => false,
    },
    customClass: {
      type: String,
      default: () => "",
    },
    sectionImage: {
      type: Object,
      default: () => ({}),
    },
    sectionImageWrapperClasses: {
      type: String,
      default: () => "",
    },
    sectionImageClasses: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      bgImage: "",
    };
  },
  created() {
    /* eslint-disable no-undef */
    if (this.isBgImage) {
      this.bgImage = this.$getSiteConfig("siteBackground");
    }
  }
};
</script>

<style scoped lang="scss">
@import "./SolidBlurBG.scss";
</style>
