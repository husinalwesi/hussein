<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="viewBox"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8.53101 1.23633L1.28444 8.82811L8.53101 1.23633Z"
      fill="white"
    />
    <path d="M8.53101 1.23633L1.28444 8.82811" :stroke="color" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.53041 6.82296L1.58927 0.881836L0.882165 1.58894L6.82331 7.53007L7.53041 6.82296ZM8.16553 7.45808L7.45843 8.16519L8.41081 9.11757L9.11792 8.41046L8.16553 7.45808Z"
      :fill="color"
    />
  </svg>
</template>

<script>
export default {
  name: "CloseIcon",
  props: {
    width: {
      type: String,
      default: "12",
    },
    height: {
      type: String,
      default: "12",
    },
    viewBox: { type: String, default: "0 0 10 10" },
    color: {
      type: String,
      default: "white",
    },
  },
};
</script>