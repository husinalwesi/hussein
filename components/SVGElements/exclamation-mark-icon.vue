<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="viewBox"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.21185 15.2579C3.43325 14.7865 0.672923 11.4576 0.909105 7.65707C1.14529 3.8565 4.29652 0.89502 8.10442 0.89502C11.9123 0.89502 15.0636 3.8565 15.2997 7.65707C15.5257 11.2932 13.0089 14.4975 9.48169 15.1809"
      :stroke="color"
      stroke-linecap="round"
    />
    <path d="M8.09033 5.16537V6.26392" :stroke="color" stroke-linecap="round" />
    <path d="M8.09033 7.82666V11.8248" :stroke="color" stroke-linecap="round" />
  </svg>
</template>

<script>
export default {
  props: {
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
    color: {
      type: String,
      default: "white",
    },
  },
};
</script>
