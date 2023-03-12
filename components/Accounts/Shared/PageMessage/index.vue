<template>
  <div
    v-if="isPageMessageVisible"
    class="bg-[#142B73] flex items-center mb-2 md:mb-6 px-4 py-2 rounded-lg w-full"
    :class="wrapperClasses"
  >
    <label class="flex-1 ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler leading-6 md:ltr:mr-6 ltr:mr-2 md:rtl:ml-6 rtl:ml-2 text-sm text-white">
      <!--// TODO: Back here and handle the highlighted text in a better way.-->
      {{ msg }} <span v-if="highlightedText" class="ltr:font-inter-bold rtl:font-noto-sans-arabic-bold">{{ highlightedText }}</span>
    </label>
    <button
      type="button"
      class="h-fit w-fit"
      aria-label="close"
      @click.prevent="closePageMessage"
    >
      <close-svg />
    </button>
  </div>
</template>

<script>
import {globalHelpers} from "~/plugins/helpers";

export default {
  props: {
    msg: {
      type: String,
      default: () => "",
    },
    highlightedText:{
      type: String,
      default: () => "",
    },
    reference: {
      type: String,
      required: true,
    },
    wrapperClasses: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      isPageMessageVisible: true,
    };
  },
  created() {
    const pageMessageStatus = globalHelpers.getSessionStorage(this.reference);
    if (pageMessageStatus !== null && String(pageMessageStatus) !== "true") this.isPageMessageVisible = false;
  },
  methods: {
    closePageMessage() {
      globalHelpers.setSessionStorage(this.reference, false);
      this.isPageMessageVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
