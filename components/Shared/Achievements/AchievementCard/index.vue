<template>
  <div class="achievement-card-container">
    <div v-if="data.image" class="achievement-logo">
      <img
        :src="data.image.image_url"
        :alt="data.image.alt_text"
        :title="data.image.title"
        width="200"
        height="200"
        class="w-fit h-fit rounded-full max-w-[200px] max-h-[200px]"
      >
    </div>

    <div v-if="data.title" class="title" v-html="$splitTextToLines(data.title)" />
  </div>
</template>

<script>
export default {
  props: {
    data: { type: Object, required: true }
  }
};
</script>

<style lang="scss" scoped>
@import './AchievementCard.scss';
</style>
