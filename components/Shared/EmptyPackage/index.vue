<template>
  <div class="empty-package flex items-center mobiles:text-center flex-col justify-center">
    <div class="title mb-2">
      {{ title }}
    </div>
    <div class="sub-title mb-2">
      {{ subTitle }}
    </div>
    <div v-if="ctaLabel" class="cta">
      {{ ctaLabel }}
    </div>
  </div>
</template>

<script>
export default {
  name: "EmptyPackage",
  props: {
    title: {
      type: String,
      default: () => 'Ski camps will be available next season'
    },
    subTitle: {
      type: String,
      default: () => 'Explore all the other lessons that we offer at Ski School.'
    },
    ctaLabel: {
      type: String,
      default: () => 'Summer 2022'
    }
  }
}
</script>

<style scoped lang="scss">
.empty-package {

  .title {
    @apply ltr:font-druk-text-heavy-italic rtl:font-adapter text-dark-gray uppercase;
    font-size: 40px;
  }

  .sub-title {
    @apply ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler;
    color: #606060;
    font-size: 14px;
  }

  .cta {
    @apply font-caveat-bold text-[#142B73];
    font-size: 24px;
  }

}
</style>
