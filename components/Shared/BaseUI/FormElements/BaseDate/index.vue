<template>
  <div v-click-outside.special="closeDatePopup" class="relative">
    <div v-if="showInputTitle" class="mb-2">
      <p class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold text-sm leading-4 text-dark-gray">
        {{ $t('CREDENTIALS_FORM.FIELDS.DATE_OF_BIRTH') }}
      </p>
    </div>

    <div class="w-full" @click="datePopuoIsActive = !datePopuoIsActive">
      <BaseInput
        v-model="date"
        i-n-ptype="text"
        i-n-pname="date"
        :i-n-pplaceholder="placeholder || $t('CREDENTIALS_FORM.FIELDS.DATE_OF_BIRTH')"
        :classes="['cursor-pointer', 'bg-white']"
        :is-popup-field="true"
        :rules="{ required: true, ...extraRules }"
        :inner-component="'arrow-svg'"
      />
    </div>
    <div
      class="date-popup-container"
      :class="{
        active: datePopuoIsActive,
        'dynamic-placement': dynamicPlacement,
      }"
    >
      <DateComponent
        :is-d-d-l-enabled="datePopuoIsActive"
        :data="date ? {selectedDate: date} : {}"
        :is-applying-diasbling-behaviour="isDatePickerOldDaysDisabled"
        @emitDate="onDateSelect($event)"
      />
    </div>
  </div>
</template>

<script>
import DateComponent from "@/components/BookingBar/Date";

export default {
  name: "BaseDate",
  components: {DateComponent},
  props: {
    showInputTitle: {
      type: Boolean,
      default: true
    },
    dynamicPlacement: {
      type: Boolean,
      default: false
    },
    date: {
      type: String,
      default: ""
    },
    extraRules: {
      type: Object,
      default: () => ({})
    },
    placeholder: {
      type: String,
      default: ""
    },
    isDatePickerOldDaysDisabled: {type: Boolean, default: true}
  },
  emits: ['selectDate'],
  data() {
    return {
      datePopuoIsActive: false,
    };
  },
  methods: {
    closeDatePopup() {
      this.datePopuoIsActive = false;
    },
    onDateSelect(date) {
      this.$emit("selectDate", date);
      this.closeDatePopup();
    },
  },
};
</script>

<style lang="scss" scoped>
.date-popup-container {
  @apply py-2 absolute w-full max-w-md ltr:left-0 top-14 bg-white border border-solid border-black border-opacity-10 -z-1 opacity-0 hidden rounded-lg shadow-light-black;

  &.active {
    @apply z-[11] opacity-100 block;
  }

  &.dynamic-placement {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
