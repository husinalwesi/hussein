<template>
  <div
    class="arrow-wrapper"
    :class="[
      withWrapper
        ? 'flex items-center justify-center rounded-full ' + wrapperClass
        : '',
    ]"
    @click="$emit('onArrowClick')"
  >
    <svg
      v-if="!checkMarkIcon"
      :width="width"
      :height="height"
      :viewBox="viewBox"
      :class="direction"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_9289_111038)">
        <path
          d="M2.29686 5.57832L2.25298 5.53472L2.19113 5.53472L1.31885 5.53472L0.955226 5.53472L1.21309 5.79109L6.6025 11.1493L6.70857 11.2548L6.81433 11.149L7.25046 10.7129L7.35686 10.6065L7.25013 10.5004L2.29686 5.57832Z"
          :fill="arrowColor"
          :stroke="arrowColor"
          stroke-width="0.3"
        />
        <path
          d="M14.7579 5.79111L15.0155 5.5348L14.6521 5.5348L13.7487 5.5348L13.6866 5.5348L13.6426 5.57873L7.8794 11.342L7.87939 11.342L7.44325 11.7781L7.33718 11.8842L7.44325 11.9902L7.8794 12.4264L7.98521 12.5322L8.09128 12.4266L14.7579 5.79111Z"
          :fill="arrowColor"
          :stroke="arrowColor"
          stroke-width="0.3"
        />
        <path
          d="M8.0663 11.1547L7.44325 11.7777L7.54932 11.8838L7.65538 11.9899L8.27843 11.3668L8.17237 11.2607L8.0663 11.1547Z"
          :fill="arrowColor"
          :stroke="arrowColor"
          stroke-width="0.3"
        />
        <path
          d="M7.22548 10.3139L6.60243 10.9369L6.7085 11.043L6.81456 11.149L7.43761 10.526L7.33155 10.4199L7.22548 10.3139Z"
          :fill="arrowColor"
          :stroke="arrowColor"
          stroke-width="0.3"
        />
      </g>
      <defs>
        <clipPath id="clip0_9289_111038">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
    <checkmark
      v-else :viewBox="checkmarkAttrs.viewBox" :color="arrowColor"
      :width="checkmarkAttrs.width" :height="checkmarkAttrs.height"
    />
  </div>
</template>

<script>
import checkmark from "@/components/SVGElements/Checkmark.vue";
export default {
  name: "ArrowSvg",
  components:{
    checkmark
  },
  props: {
    checkMarkIcon:{
      default:false,
      type:Boolean
    },
    arrowColor: {
      type: String,
      default: "#191919",
    },
    direction: {
      type: String,
      default: "down",
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
    withWrapper: { type: Boolean, default: false },
    wrapperClass: { type: String, default: "w-8 h-8 bg-[#142B73]" },
    checkmarkAttrs: {
      type: Object,
      default: () => ({
        viewBox: "0 -2 12 15",
        width: "22",
        height: "22"
      })
    }
  },
  emits: ['onArrowClick']
};
</script>

<style lang="scss" scoped>
.arrow-wrapper {
  @apply lg:cursor-pointer;

  .left {
    transform: rotate(90deg);
  }
  .right {
    transform: rotate(270deg);
  }
  .up {
    transform: rotate(180deg);
  }
}
</style>
