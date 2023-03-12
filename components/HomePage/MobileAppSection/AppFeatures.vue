<template>
  <ul
    class="app-features-list"
    :class="listFormat === 'row' ? 'row-list' : 'column-list'"
  >
    <li
      v-for="feature in appFeatures"
      :key="feature.id"
      class="feature-item"
      :class="{
        'empty-space': !feature.have_bullet,
        'row-format': listFormat === 'row'
      }"
    >
      <span v-if="feature.have_bullet" class="checkmark-icon-wrapper">
        <Checkmark />
      </span>
      {{ feature.benefit_text }}
    </li>
  </ul>
</template>

<script>
import Checkmark from "@/components/SVGElements/Checkmark.vue";

export default {
  name: "AppFeatures",
  components: {Checkmark},
  props: {
    listFormat: {
      type: String,
      default: "row"
    },
    appFeatures: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped lang="scss">
.app-features-list {
  @apply flex;

  &.row-list {
    @apply flex-wrap max-w-md gap-x-4;
  }

  &.column-list {
    @apply flex-col gap-y-4 w-full;
  }

  .feature-item {
    @apply lg:hover:cursor-text flex gap-4 items-center ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold text-base text-white w-full;

    &.empty-space {
      @apply md:ltr:pl-9 md:rtl:pr-9;
    }

    &.row-format {
      @apply w-52 pb-4 md:gap-3;
    }

    .checkmark-icon-wrapper {
      @apply bg-opacity-20 bg-white h-6 inline-flex items-center justify-center rounded-full w-6;
    }
  }
}
</style>