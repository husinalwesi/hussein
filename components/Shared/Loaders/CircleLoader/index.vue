<template>
  <div class="circle-loader" :class="[showOverlay?'overlay':'',customClass]">
    <svg
      id="L9" version="1.1" xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
      y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0"
      xml:space="preserve"
      style="position: absolute;left: 0;right: 0;width: 100px;height: 100%;display: inline-block;z-index: 999;margin: auto;"
    >
      <path
        fill="#fff"
        d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
        style="fill: #142b73;"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          dur="1s"
          from="0 50 50"
          to="360 50 50"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  </div>
</template>

<script>
export default {
  name: "CircleLoader",
  props: {
    showOverlay: {
      type: Boolean,
      default: () => false
    },
    customClass: {
      type: String,
      default: () => ""
    }
  }
};
</script>

<style scoped lang="scss">
.circle-loader {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 9;

  &.overlay {
    position: fixed;
    z-index: 200;
  }

  &.h-100 {
    height: 100%;
  }
}
</style>
