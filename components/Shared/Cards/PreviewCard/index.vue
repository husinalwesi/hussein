<template>
  <div
    class="preview-card-container"
    :class="cardIsFixedWidth ? 'fixed-width-card' : 'flexible-card'"
    @mouseenter="scaleCardImage($event)"
    @mouseleave="scaleCardImage($event, false)"
  >
    <img
      v-if="cardData && (cardData.image || cardData.web_mobile_view_image)"
      :src="
        $globalData.isMobileDevice &&
          cardData.web_mobile_view_image &&
          cardData.web_mobile_view_image.image_url
          ? cardData.web_mobile_view_image.image_url
          : cardData.image.image_url
      "
      :alt="
        $globalData.isMobileDevice &&
          cardData.web_mobile_view_image &&
          cardData.web_mobile_view_image.alt_text
          ? cardData.web_mobile_view_image.alt_text
          : cardData.image.alt_text
      "
      :title="
        $globalData.isMobileDevice &&
          cardData.web_mobile_view_image &&
          cardData.web_mobile_view_image.title
          ? cardData.web_mobile_view_image.title
          : cardData.image.title
      "
      class="w-full h-full"
    >
    <div class="overlay-shadow" />
    <div class="card-content" :class="{'with-label':!!cardData.label_text}">
      <div
        v-if="cardData.label_text"
        class="card-label-text"
      >
        {{ cardData.label_text }}
      </div>
      <div>
        <h3 v-if="cardData.title" class="title">
          {{ cardData.title }}
        </h3>
        <p v-if="cardData.description" class="description">
          {{ cardData.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import gsap from "gsap";
import BezierEasing from "bezier-easing";

export default {
  props: {
    cardData: {
      type: Object,
      required: true,
    },
    cardIsFixedWidth: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    scaleCardImage(event, isEnterEvent = true) {
      if (this.$globalData.isDesktopDevice) {
        const selectedCard = event.target;
        const cardImage = selectedCard.querySelector("img");

        gsap.to(cardImage, {
          scale: isEnterEvent ? 1.1 : 1,
          duration: 0.667,
          ease: BezierEasing(0.33, 0, 0, 1)
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./PreviewCard.scss";
</style>
