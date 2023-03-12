<template>
  <div
    class="base-input-container"
    :class="[{'min-w-[12.5rem]': hasMinWidth}, wrapperClasses]"
  >
    <ValidationProvider
      ref="observer"
      v-slot="{errors}"
      :vid="INPname"
      :name="INPname"
      :rules="rules"
    >
      <input
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
          ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler
          h-12
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
              (errors.length && showErrors) || (isShowCustomErrorByDefault && !!customError)
                ? 'border-1 border-[#DD0028] border-opacity-100 text-[#DD0028]'
                : '',
            ]
        "
        @input="showErrors=false"
        @blur="onBlur"
        @keyup="$emit('keyup')"
      >

      <div
        v-if="(errors.length && showErrors) || (isShowCustomErrorByDefault && !!customError)"
        class="ltr:text-left rtl:text-right  mt-1 text-[#DD0028] ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-xs"
        :class="errorsClasses"
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
          ltr:right-0
          rtl:left-0
          top-0
        "
        :class="innerComponentClasses"
        @click="onInnerComponentClick"
      >
        <component :is="innerComponent"/>
      </div>
      <label :class="{'number-input': INPtype==='number'}" :for="INPname">{{ INPplaceholder }}</label>
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
import ArrowSvg from "@/components/SVGElements/arrow-svg.vue";

export default {
  components: {ValidationProvider, ArrowSvg},
  props: {
    INPname: {type: String, default: ""},
    INPtype: {type: String, default: ""},
    INPplaceholder: {type: String, default: ""},
    classes: {
      type: [String, Array],
      default: () => ""
    },
    innerComponentClasses: {
      type: Array,
      default: function () {
        return [];
      },
    },
    hasMinWidth: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    innerComponent: {
      type: String,
      default: null
    },
    rules: {
      type: [String, Object],
      default: function () {
        return {};
      }
    },
    value: {type: [String, Number], default: null},
    isPopupField: {
      type: Boolean,
      default: false
    },
    wrapperClasses: {
      type: String,
      default: () => ""
    },
    errorsClasses: {
      type: String,
      default: () => ""
    },
    customError: {
      type: String,
      default: () => ""
    },
    isShowCustomErrorByDefault: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['keyup', 'inner-component-click', 'input'],
  data() {
    return {showErrors: true};
  },
  computed: {
    inputValue: {
      get() {
        return this.INPtype === "pass"
          ? this.$passwordStarsReplacer(this.value)
          : this.INPname === "date" && this.value
            ? this.$dateFormatter(this.value)
            : this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    onBlur(e) {
      this.$refs.observer.validate();
      this.showErrors = true;
    },
    onPopupInputFieldClick() {
    },
    onInnerComponentClick(e) {
      this.$emit("inner-component-click", e);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./BaseInput.scss";
</style>
