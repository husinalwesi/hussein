<template>
  <div>
    <svg
      width="24"
      height="80"
      viewBox="0 0 24 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="hidden lg:block"
    >
      <mask
        id="mask0_5122_16131"
        style="mask-type: alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="80"
      >
        <rect width="24" height="80" fill="#C4C4C4" />
      </mask>
      <g mask="url(#mask0_5122_16131)">
        <mask
          id="mask1_5122_16131"
          style="mask-type: alpha"
          maskUnits="userSpaceOnUse"
          x="0"
          y="-29"
          width="44"
          height="147"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M44 -7C44 -19.1503 34.1503 -29 22 -29V-29C9.84974 -29 0 -19.1503 0 -7V-3.57628e-07C0 13.2548 15.0347 25.6436 15.9604 38.8661C15.9867 39.2406 16 39.6188 16 40C16 40.3812 15.9867 40.7594 15.9604 41.1339C15.0347 54.3564 0 66.7452 0 80V96C0 108.15 9.84974 118 22 118V118C34.1503 118 44 108.15 44 96V-7Z"
            fill="#142B73"
          />
        </mask>
        <g mask="url(#mask1_5122_16131)">
          <rect
            id="corner"
            x="-8" width="32" height="80"
            fill="#142B73"
          />
        </g>
      </g>
    </svg>

    <svg
      width="14"
      height="65"
      viewBox="0 0 14 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="lg:hidden"
    >
      <mask
        id="mask0_5131_16375"
        style="mask-type: alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="14"
        height="65"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 1C0 0.447715 0.447715 0 1 0H13C13.5523 0 14 0.447715 14 1V64C14 64.5523 13.5523 65 13 65H1C0.447716 65 0 64.5523 0 64V64C0 53.5893 12 43.4107 12 33V33V33C12 22.5893 0 12.5604 0 2.14969V1Z"
          fill="#142B73"
        />
      </mask>
      <g mask="url(#mask0_5131_16375)">
        <rect
          id="corner"
          y="2" width="14" height="62"
          fill="#152C73"
        />
      </g>
    </svg>
  </div>
</template>
<script>
export default {
  name: "CurvePackage"
};
</script>

<style lang="scss" scoped>
@import "assets/css/variables";

html[env='snow-oman'] {
  #corner {
    fill: $oman-card-bg;
  }
}

</style>
