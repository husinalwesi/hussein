<template>
  <div class="penguin-card">
    <div v-if="cardData.image" class="image-container">
      <img
        class="penguin-image"
        :src="cardData.image.image_url"
        :alt="cardData.image.altText"
        :title="cardData.image.title"
        width="320"
        height="320"
      >
    </div>
    <div v-if="cardData.description" class="title">
      {{ cardData.description }}
    </div>
    <div v-if="cardData.title" class="number">
      {{ cardData.title }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cardData: {
      type: Object,
      required: true,
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./penguinCard.scss";
</style>
