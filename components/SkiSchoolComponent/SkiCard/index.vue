<template>
  <div class="img-card-continer">
    <img
      v-if="cardItem.image"
      :alt="cardItem.image.alt_text"
      :src="cardItem.image.image_url"
      :title="cardItem.image.title"
      width="223"
      height="223"
    >
    <div class="card-description">
      {{ cardItem.title || cardItem.description }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cardItem: {
      required: true,
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./skiCard.scss";
</style>
