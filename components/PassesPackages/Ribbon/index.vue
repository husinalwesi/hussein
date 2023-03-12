<template>
  <span v-if="text" class="ribbon-wrapper shadow-ribon">{{ text }}</span>
</template>
<script>
export default {
  name: "Ribbon",
  props: {
    text: {
      type: String,
      default: () => "",
    },
  },
};
</script>
<style lang="scss" scoped>
.ribbon-wrapper {
  @apply ltr:-mr-13 rtl:-ml-13 absolute bg-light-yellow ltr:font-druk-text-medium-italic rtl:font-adapter font-normal leading-3 mt-8.5 overflow-hidden
         py-1.5 ltr:right-0 rtl:left-0 ltr:rotate-45 rtl:-rotate-45 text-center text-dark-gray ltr:text-sm rtl:text-[12px] top-0 uppercase w-ribbon-passes whitespace-nowrap z-10;
}
</style>
