<template>
  <div class="passes-main-wrapper" :class="wrapperClasses">
    <h2 class="main-title">
      {{ title }}
    </h2>

    <div
      v-if="firstSubtitle || secondSubtitle"
      class="subtitle-text-container"
      :class="{'bottom-margin': !secondSubtitle}"
    >
      <h3 v-if="firstSubtitle" class="subtitle-text">
        {{ firstSubtitle }}
      </h3>
      <h4 v-if="secondSubtitle" class="subtitle-text">
        {{ secondSubtitle }}
      </h4>
    </div>
  </div>
</template>

<script>
export default {
  name: "PassesMain",
  props: {
    title: {
      type: String,
      default: ""
    },
    firstSubtitle: {
      type: String,
      default: ""
    },
    secondSubtitle: {
      type: String,
      default: ""
    },
    wrapperClasses: { type: String, default: "mb-6" }
  }
};
</script>

<style scoped lang="scss">
@import "./PassesMain.scss";
</style>
