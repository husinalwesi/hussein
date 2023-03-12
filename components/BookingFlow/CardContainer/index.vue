<template>
  <div class="card-container" :class="containerClasses">
    <div class="card-content-wrapper" :class="wrapperClasses">
      <slot name="card-content" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    containerClasses: { type: [String, Array], default: "" },
    wrapperClasses: {
      type: [String, Array],
      default: "px-[0.938rem] py-6 min-550:px-[1.938rem] min-550:py-8",
    }
  }
};
</script>

<style lang="scss">
@import "./CardContainer.scss";
</style>
