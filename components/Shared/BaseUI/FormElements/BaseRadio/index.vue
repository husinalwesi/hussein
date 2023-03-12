<template>
  <ValidationProvider
    ref="radio-observer" v-slot="{ errors }" :name="RBIOname"
    :rules="rules"
  >
    <input
      :id="RBIOid"
      v-model="inputValue"
      type="radio"
      :value="attrVal"
      :name="RBIOname"
      class="hidden"
    >
    <label :for="RBIOid" :class="labelClass + ` gap-x-${gapVal}`">
      <span
        class="
          bg-white
          border-1 border-solid border-black border-opacity-10
          flex
          h-4
          items-center
          justify-center
          lg:cursor-pointer
          rounded-full
          w-4
        "
        :class="{ 'border-light-red border-opacity-100': !!errors.length||showError }"
      >
        <span class="w-2 h-2 rounded-full bg-white" :class="{'error-dot':showError}" /></span>

      <slot v-if="contentType === 'component'" name="inner-content" />

      <template v-else>
        <span :class="{'radio-error-text':showError}">{{ RBIOlabel }}</span>
      </template>
    </label>
  </ValidationProvider>
</template>

<script>
export default {
  props: {
    contentType: {
      type: String,
      default: "text",
    },
    RBIOlabel: {
      type: String,
      default: "",
    },
    RBIOname: {
      type: String,
      default: "",
    },
    RBIOid: {
      type: String,
      default: "radio",
    },
    value: {
      type: [String, Number],
      default: "",
    },
    labelClass: {
      type: String,
      default:
        "ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold text-base text-[#191919] flex items-center",
    },
    rules: {
      type: [String, Object],
      default: () => {
      },
    },
    attrVal: {type: String, default: ""},
    gapVal: {
      type: Number,
      default: 2,
    },
    showError: {
      default: false,
      type: Boolean
    }
  },
  emits: ['input'],
  computed: {
    inputValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>

<style lang="scss">
input[type="radio"]:checked + label span span {
  @apply bg-dark-blue;
  &.error-dot {
    @apply bg-[#FF173D]
  }
}

.radio-error-text {
  color: #FF173D
}
</style>
