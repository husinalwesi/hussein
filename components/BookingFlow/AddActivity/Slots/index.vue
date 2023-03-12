<template>
  <ul class="time-slot-list">
    <template v-for="(slot, index) in data">
      <li v-if="!slot.isDisabled && !isTimeIncludesOnDisabled(slot)" :key="index">
        <a
          href="javascript:void(0);"
          :class="{
            active: selectedSlot == slot.ak && slot.ak && selectedSlot,
            disabled: false,
          }"
          @click="changeSelectedSlot(slot)"
        >{{ $dateFormatter(slot.slot, "timeSlot") }}</a>
      </li>
    </template>
    <li v-if="isCancelEnabled">
      <a
        href="javascript:void(0);"
        class="cancel-button"
        @click="cancelUpgradeTicket"
      >{{ cancelButtonText }}</a>
    </li>
  </ul>
</template>
<script>
export default {
  name: "Slots",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    selectedSlot: {
      type: String,
      default: "",
    },
    selectedTime: {
      type: String,
      default: "",
    },
    ageType: {
      type: String,
      default: "",
    },
    disabledSlots: {
      type: Array,
      default: () => [],
    },
    isTabel: {
      type: Boolean,
      default: false,
    },
    isActivity: {
      type: Boolean,
      default: false,
    },
    packageDetails: {
      type: Object,
      default: () => ({}),
    },
    isCancelEnabled: {
      type: Boolean,
      default: false,
    },
    cancelButtonText: {
      type: String,
      default: "",
    }
  },
  emits: ['cancelUpgradeTicketEmiter', 'changeSelectedSlotEmiter', 'emitDateUnavailableMessageForGuests'],
  watch: {
    data() {
      this.validatePrevSelection();
    },
  },
  methods: {
    getEventAKSelectionCounter() {
      let counter = 0;
      let ageTypeData = this.packageDetails.people[this.ageType];
      for (let index = 0; index < ageTypeData.length; index++) {
        if (
          ageTypeData[index].isSelected &&
          ageTypeData[index].selectedAK == this.selectedSlot
        ) {
          counter++;
        }
      }
      return counter;
    },
    isSameAKsDisabled(ak) {
      for (let index = 0; index < this.data.length; index++) {
        if (this.data[index].ak == ak && this.data[index].isDisabled) {
          return true;
        }
      }
      return false;
    },
    validatePrevSelection() {
      if (this.isActivity) {
        for (let index = 0; index < this.data.length; index++) {
          if (
            this.getEventAKSelectionCounter() > this.data[index].availableSeat
          ) {
            this.$emit(
              "emitDateUnavailableMessageForGuests",
              this.data[index].ak
            );
          }
        }
        return false;
      }
      if (this.data.length == 0) return false;
      if (!this.data[0].ak) {
        return false;
      }
      if (!this.selectedSlot) return false;
      if (!this.isAKExistsInData(this.selectedSlot)) {
        this.changeSelectedSlot(this.getTimeSlot(), false);
        if (!this.isSameTimeSlotExist())
          this.$emit("emitDateUnavailableMessageForGuests");
      } else {
        if (!this.isTabel && !this.isActivity) {
          let timeSlot = this.getTimeSlot();
          if (!timeSlot.ak) this.$emit("emitDateUnavailableMessageForGuests");
          this.changeSelectedSlot(timeSlot, false);
        }
      }
    },
    getTimeSlot() {
      for (let index = 0; index < this.data.length; index++) {
        if (
          this.data[index].slot == this.selectedTime &&
          !this.data[index].isDisabled
        )
          return this.data[index];
      }
      return {
        ak: "",
        slot: "",
        isDisabled: false,
      };
    },
    isSameTimeSlotExist() {
      for (let index = 0; index < this.data.length; index++) {
        if (this.data[index].slot == this.selectedTime) return true;
      }
      return false;
    },
    isAKExistsInData(ak) {
      for (let index = 0; index < this.data.length; index++) {
        if (this.data[index].ak == ak) return true;
      }
      return false;
    },
    isTimeInBetweenRangeTime(disabledSlotStartTime, disabledSlotEndTime, startTime, endTime){
      let disabledSlotStartTimeMoment = this.$dateFormatter(disabledSlotStartTime, "slots", false);
      let disabledSlotEndTimeMoment = this.$dateFormatter(disabledSlotEndTime, "slots", false);
      let startTimeMoment = this.$dateFormatter(startTime, "slots", false);
      let endTimeMoment = this.$dateFormatter(endTime, "slots", false);

      // check if the slot is in the range or equal to the disabled times
      return  startTimeMoment.isBetween(disabledSlotStartTimeMoment, disabledSlotEndTimeMoment) || 
      endTimeMoment.isBetween(disabledSlotStartTimeMoment, disabledSlotEndTimeMoment) ||
      startTimeMoment.isSame(disabledSlotStartTimeMoment) ||
      startTimeMoment.isSame(disabledSlotEndTimeMoment) ||
      endTimeMoment.isSame(disabledSlotStartTimeMoment) || 
      startTimeMoment.isSame(disabledSlotEndTimeMoment);
    },
    isTimeIncludesOnDisabled(slot) {
      return !!this.disabledSlots.filter(disabledSlot => this.isTimeInBetweenRangeTime(disabledSlot.selectedSlot, disabledSlot.selectedSlotEnd, slot.slot, slot.slotEnd)).length;
    },
    changeSelectedSlot(slot, toggle = true) {
      let value = "";

      if (toggle) value = this.selectedSlot == slot.ak ? "" : slot.slot;
      else value = slot.slot;

      this.$emit("changeSelectedSlotEmiter", {
        selectedAK: value ? slot.ak : "",
        value: value,
        endValue: value ? slot.slotEnd : ""
      });
    },
    cancelUpgradeTicket(e){
      this.$emit("cancelUpgradeTicketEmiter");
    }
  },
};
</script>
<style scoped lang="scss">
@import "./Slots.scss";
</style>
