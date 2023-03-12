<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.30674 15.529L0.817076 9.31637C0.642707 9.12979 0.542373 8.88593 0.534912 8.63055C0.551795 8.38926 0.651472 8.16124 0.817076 7.98508L8.31445 0.804221C8.70095 0.445468 9.29842 0.445468 9.68493 0.804221L17.1823 7.98508C17.3655 8.14903 17.4685 8.3846 17.4645 8.63054C17.4749 8.88941 17.3719 9.13994 17.1823 9.31637L8.67721 17.4654"
      :stroke="color"
    />
    <path
      d="M10.9344 8.08066H7.46788C7.32206 8.06939 7.17818 8.11964 7.07101 8.21923C6.96384 8.31883 6.90314 8.45873 6.90357 8.6051V11.2677"
      :stroke="color"
      stroke-linecap="round"
    />
    <path
      d="M9.3624 6.22363L11.015 7.87766C11.0692 7.93077 11.0997 8.00347 11.0997 8.07937C11.0997 8.15527 11.0692 8.22796 11.015 8.28108L9.20117 10.0965"
      :stroke="color"
      stroke-linecap="round"
    />
  </svg>
</template>

<script>
export default {
  props: {
    width: { type: String, default: "18" },
    height: { type: String, default: "18" },
    color: {
      type: String,
      default: "#ffffff",
    },
  },
};
</script>
