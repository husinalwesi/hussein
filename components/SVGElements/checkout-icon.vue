<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.15625 5.12805V5.12805C4.22696 5.12805 3.43029 5.79184 3.26257 6.70588L1.1207 18.3791C0.895268 19.6077 1.83874 20.74 3.08786 20.74H18.9121C20.1613 20.74 21.1047 19.6077 20.8793 18.3791L18.7487 6.7671C18.5744 5.8176 17.7469 5.12805 16.7815 5.12805H15.1536"
      :stroke="color"
      stroke-linecap="round"
    />
    <path d="M15.125 6.875H7.21875" :stroke="color" stroke-linecap="round" />
    <path
      d="M6.98962 6.875V4.76953C6.98962 2.51509 8.81721 0.6875 11.0717 0.6875V0.6875C13.3261 0.6875 15.1537 2.51509 15.1537 4.76953V6.875"
      :stroke="color"
      stroke-linecap="round"
    />
    <path
      d="M15.125 17.875L19.25 17.875"
      :stroke="color"
      stroke-linecap="round"
    />
  </svg>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "#ffffff",
    },
    width: {
      type: String,
      default: "22",
    },
    height: {
      type: String,
      default: "22",
    },
  },
};
</script>

<style lang="">
</style>