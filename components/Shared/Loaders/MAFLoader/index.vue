<template>
  <div class="maf-loader-container" :class="{active: isLoading}">
    <div class="loader-bg" :class="loaderClass" />
    <div class="flex items-center w-full flex-col">
      <div class="mb-5">
        <img
          :src="require(`@/assets/images/Shared/${siteLogo}.png`)"
          alt="site logo"
          width="92"
          height="109"
        >
      </div>

      <div class="dot-pulse" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {type: Boolean, default: false}
  },
  computed: {
    siteLogo() {
      const env = this.$getSiteCurrentEnvironment();
      // TODO: Add the Snow Oman logo when the design team presents it to us.
      return env.includes('dhabi') ? 'snow-ad-logo-icon' : env.includes("oman") ? 'snow-oman-logo-icon' : 'ski-dubai-logo-icon'
    },
    loaderClass() {
      const env = this.$getSiteCurrentEnvironment();
      return env.includes("dhabi") ? "snow-ad" : env.includes("oman") ? "snow-oman" : "ski-dubai";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./MAFLoader.scss";
</style>
