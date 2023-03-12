<!--TODO: Change the source of this loader-->
<template>
  <div
    class="w-[100%] h-full flex justify-center items-center"
    :class="loaderWrapperClasses"
  >
    <svg
      id="L9"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
      enable-background="new 0 0 0 0"
      xml:space="preserve"
      :class="loaderClasses"
    >
      <path
        fill="#fff"
        d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
        :style="{fill: loaderColor}"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          dur="1s"
          from="0 50 50"
          to="360 50 50"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  </div>
</template>

<script>
export default {
  name: "SnowflakeLoader",
  props: {
    loaderWrapperClasses: { type: [String, Array], default: "" },
    loaderClasses: { type: [String, Array], default: "w-[100px] h-[100px]" },
    loaderColor:{ type:String, default: ()=>"#142b73"}
  }
};
</script>
