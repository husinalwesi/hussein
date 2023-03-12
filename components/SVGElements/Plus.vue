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
      d="M7 5C7.55228 5 8 4.55228 8 4C8 3.44772 7.55228 3 7 3L5 3L5 1C5 0.447715 4.55228 -1.50704e-07 4 -1.74846e-07C3.44772 -1.98987e-07 3 0.447715 3 1L3 3L1 3C0.447715 3 -1.50704e-07 3.44771 -1.74846e-07 4C-1.98987e-07 4.55228 0.447715 5 1 5L3 5L3 7C3 7.55228 3.44772 8 4 8C4.55228 8 5 7.55228 5 7L5 5L7 5Z"
      :fill="fill"
      :width="width"
      :height="height"
       :viewBox="viewBox"
    />
  </svg>
</template>

<script>
export default {
  name: "Plus",
  props: {
    fill: {
      type: String,
      default: "#1A1A1A",
    },
    width: {
      type: String,
      default: "8",
    },
    height: {
      type: String,
      default: "8",
    },
    viewBox: {
      type: String,
      default: "0 0 8 8",
    },
  },
};
</script>
