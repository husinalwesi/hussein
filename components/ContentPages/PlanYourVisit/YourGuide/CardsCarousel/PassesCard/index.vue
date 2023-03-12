<template>
  <div class="passes-event-card">
    <img
      v-if="cardData&&(cardData.image||cardData.web_mobile_view_image)"
      :src="$globalData.isMobileDevice&&cardData.web_mobile_view_image&&cardData.web_mobile_view_image.image_url?cardData.web_mobile_view_image.image_url:cardData.image.image_url"
      :alt="$globalData.isMobileDevice&&cardData.web_mobile_view_image&&cardData.web_mobile_view_image.alt_text?cardData.web_mobile_view_image.alt_text:cardData.image.alt_text"
      :title="$globalData.isMobileDevice&&cardData.web_mobile_view_image&&cardData.web_mobile_view_image.title?cardData.web_mobile_view_image.title:cardData.image.title"
      width="320"
      height="216"
      class="card-image"
    >

    <div class="card-body-container">
      <h4 v-if="cardData.title" class="title">
        {{ cardData.title }}
      </h4>
      <p v-if="cardData.description" class="description">
        {{ cardData.description }}
      </p>
    </div>
    <template v-if="(cardData.cta || {}).url">
      <BaseButton
        :cta="cardData.cta"
        :btn-type="$isExternalLink(cardData.cta.url) ? 'externalLink' : 'link'"
        :text="cardData.cta.title"
        :path="cardData.cta.url"
        class-name="cta-link"
      />
    </template>
  </div>
</template>

<script>
import BaseButton from "@/components/Shared/BaseUI/BaseButton";

export default {
  components: {BaseButton},
  props: {
    cardData: {
      type: Object,
      required: true,
    }
  }
};
</script>

<style lang="scss">
@import "./PassesCard.scss";
</style>
