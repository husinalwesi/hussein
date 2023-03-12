<template>
  <div class="school-moments-card-container">
    <img
      v-if="data.image"
      :src="data.image.image_url"
      :alt="data.image.alt_text"
      :title="data.image.title"
      width="104"
      height="104"
      class="rounded-full"
    >
    <div class="font-caveat-bold mt-6 leading-6 text-2xl text-dark-gray">
      {{ data.title }}
    </div>
    <div class="description-wrapper">
      <p class="description">
        {{ data.description }}
      </p>
    </div>

    <BaseButton
      v-if="(data.cta || {}).url"
      :cta="data.cta"
      :btn-type="$isExternalLink(data.cta.url) ? 'externalLink' : 'link'"
      :text="data.cta.title"
      :path="data.cta.url"
      class-name="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold leading-[14px] mt-6 text-dark-gray text-sm"
    />
  </div>
</template>

<script>
export default {
  name: "MomentsCard",
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style lang="scss" scoped>
.school-moments-card-container {
  @apply border border-dark-gray border-dashed border-opacity-20 flex flex-col h-[448px] items-center justify-center max-w-[352px] rounded-2xl w-full;

  .description-wrapper {
    @apply max-w-[280px] mt-4 text-center;

    .description {
      @apply text-[#606060] leading-6 text-sm ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler;
    }
  }
}
</style>
