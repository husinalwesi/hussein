<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 24 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0.552734H24" :stroke="color" />
    <path d="M18.2285 8.50049H23.9999" :stroke="color" />
    <path d="M0 8.50049H16.2857" :stroke="color" />
    <path d="M0 16.4487H24" :stroke="color" />
  </svg>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: "24",
    },
    height: {
      type: String,
      default: "17",
    },
    color: {
      type: String,
      default: "white",
    },
  },
};
</script>
