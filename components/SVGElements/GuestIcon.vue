<template>
  <svg
    width="18"
    height="20"
    viewBox="0 0 18 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="9"
      cy="5"
      r="4"
      :stroke="iconColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M17 19C17 15.6863 13.4183 13 9 13C4.58172 13 1 15.6863 1 19"
      :stroke="iconColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
<script>
export default {
  name: "GuestIcon",
  props: ["iconColor"],
};
</script>
