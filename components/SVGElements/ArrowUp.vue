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
      d="M8.53548 4.29299C8.926 4.68351 8.926 5.31668 8.53548 5.7072C8.14495 6.09772 7.51179 6.09772 7.12126 5.7072L5 3.58594L2.87874 5.7072C2.48821 6.09772 1.85505 6.09772 1.46452 5.7072C1.074 5.31668 1.074 4.68351 1.46452 4.29299L4.28372 1.47379C4.28673 1.4707 4.28977 1.46762 4.29284 1.46456C4.48888 1.26852 4.74606 1.17089 5.003 1.17167C5.25794 1.17242 5.51265 1.27005 5.70717 1.46456C5.71022 1.46761 5.71325 1.47068 5.71626 1.47377L8.53548 4.29299Z"
      :fill="arrowColor"
    />
  </svg>
</template>
<script>
export default {
  name: "ArrowUp",
  props: {
    arrowColor: {
      type: String,
      default: "#1A1A1A",
    },
    width: {
      type: String,
      default: "10",
    },
    height: {
      type: String,
      default: "10",
    },
    viewBox: {
      type: String,
      default: "0 0 10 10",
    },
  }
   };
</script>
