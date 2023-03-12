<template>
  <figure class="time-slot-image-container">
    <img
      :src="getImage.image_url"
      :alt="getImage.alt_text"
      :title="getImage.title"
    />
    <figcaption v-if="text">
      {{ text }}
    </figcaption>
  </figure>
</template>
<script>
export default {
  name: "SlotImage",
  props: {
    text: {
      type: String,
      default: "",
    },
    image: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    getImage() {
      if (!!this.image) {
        return this.image;
      } else {
        return {
          image_url:
            "https://www.lonestarpark.com/wp-content/uploads/2019/04/image-placeholder-500x500.jpg",
          alt_text: "alt_txt",
          title: "title",
        };
      }
    },
  },
};
</script>
<style scoped lang="scss">
@import "./SlotImage.scss";
</style>