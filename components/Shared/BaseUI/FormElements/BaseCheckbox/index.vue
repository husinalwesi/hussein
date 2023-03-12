<template>
  <ValidationProvider
    ref="checkbox-observer"
    v-slot="{ errors }"
    :vid="id"
    :name="INPname"
    :rules="rules"
  >
    <div class="checkbox-container" :class="checkboxWrapperClasses">
      <input
        :id="id"
        v-model="checkboxValue"
        type="checkbox"
        class="checkbox"
        :class="{error: errors.length}"
        :name="INPname"
      >
      <label
        :for="id"
        class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler"
        :class="classes"
        @click="$event.preventDefault()"
      >{{ label }}
        <span
          v-if="underlinedText"
          class="underlined-text"
          :class="underlinedTextClasses + ' ' + $i18n.localeProperties.detectedLang"
          @click="$emit('onUnderlineTextClick')"
        >{{ underlinedText }}</span>
      </label>
    </div>

    <div
      v-if="errors && errors.length"
      class="ltr:text-left rtl:text-right mt-1 text-[#DD0028] ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-xs"
    >
      {{ errors[0] }}
    </div>
  </ValidationProvider>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: "",
    },
    INPname: { type: String, default: "" },
    value: { type: Boolean, default: false },
    label: { type: String, default: "" },
    underlinedText: { type: String, default: "" },
    classes: {
      type: [String,Array],
      default: () => ["text-[#606060]"],
    },
    rules: { type: Object, default: () => ({}) },
    checkboxWrapperClasses: { type: [String, Array], default: () => "" },
    underlinedTextClasses: {
      type: [String, Array],
      default: () => "",
    },
  },
  emits: ['onUnderlineTextClick', 'input'],
  computed: {
    checkboxValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./BaseCheckbox.scss";
</style>
