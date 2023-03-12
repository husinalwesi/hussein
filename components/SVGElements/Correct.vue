<template>
  <svg
    width="11"
    height="10"
    viewBox="0 0 11 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.82812 3.00024L4.17127 8.6571"
      :stroke="fill"
      stroke-width="2"
      stroke-linecap="round"
    />
    <path
      d="M1.34277 5.82861L4.1712 8.65704"
      :stroke="fill"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
</template>
<script>
export default {
  name: "Correct",
  props: {
    fill: {
      type: String,
      default: "#1A1A1A",
    },
  },
};
</script>