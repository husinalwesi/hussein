<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="viewBox"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="16" cy="16" r="16" :fill="bgColor" />
    <path d="M15.8662 8.11719L16.0158 23.9995" :stroke="fill" />
    <path d="M23.8831 15.8987L8.14035 15.8987" :stroke="fill" />
  </svg>
</template>
§
<script>
export default {
  name: "AddBtnDropDown",
  props: {
    fill: {
      type: String,
      default: "#1A1A1A",
    },
    width: {
      type: String,
      default: "32",
    },
    height: {
      type: String,
      default: "32",
    },
    viewBox: {
      type: String,
      default: "0 0 32 32",
    },
    bgColor: {
      type: String,
      default: "#ECECEC",
    },
  },
};
</script>
