<template>
  <div
    class="base-input-container"
    :class="[{ 'min-w-[12.5rem]': hasMinWidth }, wrapperClasses]"
  >
    <ValidationProvider
      ref="observer"
      v-slot="{ errors }"
      :vid="INPname"
      :name="INPname"
      :rules="rules"
    >
      <textarea
        :id="INPname"
        v-model.trim="inputValue"
        :name="INPname"
        :type="INPtype"
        :readonly="readonly || isPopupField"
        :disabled="disabled"
        placeholder=" "
        autocomplete="off"
        class="
          base-input
          border-1 border-solid border-black border-opacity-10
          disabled:opacity-50
          ltr:font-inter-reguler
          rtl:font-noto-sans-arabic-reguler
          leading-4
          lg:disabled:cursor-not-allowed
          outline-none
          px-4
          read-only:bg-white read-only:text-dark-gray
          rounded-lg
          text-dark-gray text-sm
          w-full
        "
        :class="
          classes +
            [
              showErrors && errors.length
                ? 'border-1 border-[#DD0028] border-opacity-100 '
                : '',
            ]
        "
        :rows="rows"
        :cols="cols"
        @input="showErrors = false"
        @blur="onBlur"
        @keyup="$emit('keyup')"
      />

      <div
        v-if="showErrors && errors.length"
        class="
          ltr:text-left
          rtl:text-right
          mt-1
          text-[#DD0028]
          ltr:font-inter-reguler
          rtl:font-noto-sans-arabic-reguler
          text-xs
        "
      >
        {{ customError || errors[0] }}
      </div>

      <div
        v-if="!!innerComponent"
        class="
          absolute
          lg:cursor-pointer
          flex
          h-full
          items-center
          px-4
          right-0
          top-0
        "
        :class="innerComponentClasses"
        @click="onInnerComponentClick"
      >
        <component :is="innerComponent" />
      </div>
      <label :for="INPname">{{ INPplaceholder }}</label>
      <!--This is to fix clicking over disabled input in Firefox-->
      <div
        v-if="isPopupField"
        class="absolute left-0 right-0 top-0 bottom-0 lg:cursor-pointer"
        @click="onPopupInputFieldClick"
      />
    </ValidationProvider>
  </div>
</template>

<script>
import {ValidationProvider} from 'vee-validate';

export default {
  components: {ValidationProvider},
  props: {
    INPname: { type: String, default: "" },
    INPtype: { type: String, default: "" },
    INPplaceholder: { type: String, default: "" },
    rows: { type: String, default: "8" },
    cols: { type: String, default: "50" },
    classes: {
      type: [String, Array],
      default: () => "",
    },
    innerComponentClasses: {
      type: Array,
      default: function () {
        return [];
      },
    },
    hasMinWidth: {
      type: Boolean,
      default: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    innerComponent: {
      type: String,
      default: null,
    },
    rules: {
      type: [String, Object],
      default: function () {
        return {};
      },
    },
    value: { type: [String, Number], default: null },
    isPopupField: {
      type: Boolean,
      default: false,
    },
    wrapperClasses: {
      type: String,
      default: () => "",
    },
    customError: {
      type: String,
      default: () => "",
    },
  },
  emits: ["keyup", "input", "inner-component-click"],
  data() {
    return { showErrors: true };
  },
  computed: {
    inputValue: {
      get() {
        return this.INPtype === "pass"
          ? this.$passwordStarsReplacer(this.value)
          : this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    }
  },
  methods: {
    onBlur(e) {
      this.$refs.observer.validate();
      this.showErrors = true;
    },
    onPopupInputFieldClick() {},
    onInnerComponentClick(e) {
      this.$emit("inner-component-click", e);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./BaseTextarea.scss";
</style>
