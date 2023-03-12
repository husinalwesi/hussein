<template>
  <div class="section-header">
    <div class="header-text">
      <h2 class="title">
        {{ headerData.title }}
      </h2>
      <p class="description">
        {{ headerData.description }}
      </p>
    </div>
    <NuxtLink v-if="headerData.cta" :to="headerData.cta.url?localePath(headerData.cta.url):$route.path" class="cta-link">
      {{
        headerData.cta.title
      }}
    </NuxtLink>
  </div>
</template>

<script>
export default {
  props: {
    headerData: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

<style lang="scss" scoped>
.section-header {
  @apply flex flex-wrap items-end justify-between w-full gap-x-3 gap-y-6 mb-6;

  .header-text {
    @apply flex flex-col;

    .title {
      @apply ltr:font-inter-bold rtl:font-noto-sans-arabic-bold text-[#191919] text-[20px] leading-6;
    }
    .description {
      @apply ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-sm leading-6 mt-4 md:mt-2 text-[#606060];
    }
  }

  .cta-link {
    @apply ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold text-sm leading-6 text-dark-gray;
  }
}
</style>
