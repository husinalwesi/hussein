<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="viewBox"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_3881_15877)">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.33851 6.66406L4.25202 9.47825L3.78851 9.94176L0.875 7.12757L1.33851 6.66406Z"
        :fill="color"
        :stroke="color"
        stroke-width="0.3"
        stroke-miterlimit="16"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.9932 3.08852L4.94789 11.0676L4.48438 10.6372L4.94789 10.1405L12.5297 2.625L12.9932 3.08852Z"
        :fill="color"
        :stroke="color"
        stroke-width="0.3"
        stroke-miterlimit="16"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.14654 10.1406L4.48438 10.8028L5.14654 10.1406Z"
        fill="black"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.45122 9.47852L3.78906 10.1407L4.45122 9.47852Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_3881_15877">
        <rect width="14" height="14" :fill="color" />
      </clipPath>
    </defs>
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
      default: "14",
    },
    height: {
      type: String,
      default: "14",
    },
    viewBox: {
      type: String,
      default: "0 0 14 14",
    },
  },
};
</script>
