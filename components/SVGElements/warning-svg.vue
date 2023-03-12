<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="viewBox"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.81356 14H15L8.01695 2L1 14H2.35593"
      :stroke="color"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M8 12V11" :stroke="color" stroke-linecap="round" />
    <path d="M8 9V6" :stroke="color" stroke-linecap="round" />
  </svg>
</template>

<script>
export default {
  name: "Checkmark",
  props: {
    color: {
      type: String,
      default: "white",
    },
    width: {
      type: String,
      default: "16",
    },
    height: {
      type: String,
      default: "16",
    },
    viewBox: {
      type: String,
      default: "0 0 16 16",
    },
  },
};
</script>
