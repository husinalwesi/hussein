<template>
  <svg
    :width="width" :height="height" :viewBox="viewBox"
    :fill="fill" xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7.21185 15.2575C3.43325 14.786 0.672923 11.4571 0.909105 7.65658C1.14529 3.85602 4.29652 0.894531 8.10442 0.894531C11.9123 0.894531 15.0636 3.85602 15.2997 7.65658C15.5257 11.2927 13.0089 14.497 9.48169 15.1804" :stroke="stroke" stroke-linecap="round" />
    <path d="M8.09018 5.16504V6.26359" :stroke="stroke" stroke-linecap="round" />
    <path d="M8.09018 7.82617V11.8243" :stroke="stroke" stroke-linecap="round" />
  </svg>
</template>
<script>
export default {
  name: "InfoIcon",
  props: {
    fill: {
      type: String,
      default: "none",
    },
    stroke: {
      type: String,
      default: "#58B150",
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
  }
   };
</script>
