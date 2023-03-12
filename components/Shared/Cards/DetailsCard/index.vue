<template>
  <div class="details-card">
    <img
      v-if="cardData&&(cardData.image||cardData.web_mobile_view_image)"
      :src="$globalData.isMobileDevice&&cardData.web_mobile_view_image&&cardData.web_mobile_view_image.image_url?cardData.web_mobile_view_image.image_url:cardData.image.image_url"
      :alt="$globalData.isMobileDevice&&cardData.web_mobile_view_image&&cardData.web_mobile_view_image.alt_text?cardData.web_mobile_view_image.alt_text:cardData.image.alt_text"
      :title="$globalData.isMobileDevice&&cardData.web_mobile_view_image&&cardData.web_mobile_view_image.title?cardData.web_mobile_view_image.title:cardData.image.title"
      width="320"
      height="216"
      class="w-full h-[208px] md:h-[216px] rounded-xl"
    >

    <div class="card-body-container">
      <h4 v-if="cardData.title" class="title">
        {{ cardData.title }}
      </h4>
      <div
        v-if="cardData.description_highlighted"
        class="description"
        v-html="cardData.description_highlighted"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cardData: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./DetailsCard.scss";
</style>
