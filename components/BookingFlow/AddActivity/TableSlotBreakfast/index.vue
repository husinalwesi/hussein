<template>
  <div class="time-slot-table-container">
    <p class="custom-title">
      {{ $t('BOOKINGFLOW_PAGE.TABLE') }} {{ index + 1 }}
    </p>
    <div
      class="time-slot-table"
      :class="{ slotsUnavailable: getUnifiedSlots.length == 0 }"
    >
      <div class="image-holder">
        <SlotImage :image="data.image" />
      </div>
      <div class="content-holder">
        <p>
          <span class="hidden lg:block">{{ data.title }}</span>
          <span class="block lg:hidden">{{ $t('BOOKINGFLOW_PAGE.TABLE') }} {{ index + 1 }}</span>
        </p>
        <p>{{ $t('BOOKINGFLOW_PAGE.UP_TO', {guests : packageDetails.card.max_number_per_table}) }}</p>
      </div>
      <div class="slot-list-container">
        <Slots
          :data="getUnifiedSlots"
          :selected-slot="selection.selectedAK"
          :selected-time="selection.selectedSlot"
          :disabled-slots="ticketsSelectedTimeslots"
          :is-tabel="true"
          @changeSelectedSlotEmiter="changeSelectedSlot"
        />
        <div
          v-if="!isThereEnabledSlot"
          class="unavailable-date-message unavailable-date-message-box"
        >
          <p>{{ staticLabels.date_unavailable_message }}</p>
        </div>
        <div v-if="isLoaderEnabled" class="unavailable-date-message">
          <CircleLoader />
        </div>
      </div>
    </div>
    <div class="dashed-line" />
  </div>
</template>
<script>
import SlotImage from "@/components/BookingFlow/AddActivity/SlotImage";
import Slots from "@/components/BookingFlow/AddActivity/Slots";
export default {
  name: "TableSlot",
  components: {
    SlotImage,
    Slots,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    selection: {
      type: Object,
      default: () => ({}),
    },
    packageDetails: {
      type: Object,
      default: () => ({}),
    },
    ticketsSelectedTimeslots: {
      type: Array,
      default: [],
    },
    index: {
      type: Number,
      default: 0,
    },
    slots: {
      type: Array,
      default: [],
    },
    isLoaderEnabled: {
      type: Boolean,
      default: false,
    },
    staticLabels: {
      type: Object,
      default: () => ({}),
    },
    changeEvt: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    getUnifiedSlots() {
      let filteredArr = [];
      for (let index = 0; index < this.slots.length; index++) {
        if (!this.isInArrayByKey(filteredArr, this.slots[index].slot)) {
          filteredArr.push(this.slots[index]);
        }
      }
      return filteredArr;
    },
    isThereEnabledSlot() {
      return (
        this.slots.filter((slot) => {
          return !slot.isDisabled;
        }).length > 0
      );
    },
  },
  watch: {
    getUnifiedSlots(unifiedSlots) {
      if (this.selection.isSelected) {
        if (this.getUnifiedSlots.length == 0) {
          // remove the selection
          this.changeSelectedSlot({
            value: "",
            selectedAK: "",
          });
          this.$showToast({
            type: "orange",
            text: `${this.packageDetails.card.title} - ${this.$t('BOOKINGFLOW_PAGE.TABLE')} ${
              this.index + 1
            } ${this.$t('BOOKINGFLOW_PAGE.IS_UNAVAILABLE_ON_THE_NEW_DATE')}`,
          });
        } else {
          if (
            this.isSlotAKExistInData(
              this.getUnifiedSlots,
              this.selection.selectedAK
            )
          ) {
            //nothing to do..
          } else {
            if (
              this.isSlotTimeExistInData(
                this.getUnifiedSlots,
                this.selection.selectedSlot
              )
            ) {
              let newSlotDataWithSameTime = this.getSlotTimeData(
                this.selection.selectedSlot
              );

              this.changeSelectedSlot({
                value: newSlotDataWithSameTime.slot, ///but the data
                selectedAK: newSlotDataWithSameTime.ak,
              });
              // just renew the data.
            } else {
              // remove the selection
              this.changeSelectedSlot({
                value: "",
                selectedAK: "",
              });
              this.$showToast({
                type: "orange",
                text: `${this.packageDetails.card.title} - ${this.$t('BOOKINGFLOW_PAGE.TABLE')} ${
                  this.index + 1
                } ${this.$t('BOOKINGFLOW_PAGE.IS_UNAVAILABLE_ON_THE_NEW_DATE')}`,
              });
            }
          }
        }
      }
    },
  },
  methods: {
    getSlotTimeData(selectedSlot) {
      for (let index = 0; index < this.getUnifiedSlots.length; index++) {
        if (this.getUnifiedSlots[index].slot == selectedSlot)
          return this.getUnifiedSlots[index];
      }
      return {};
    },
    isSlotTimeExistInData(slots, selectedSlot) {
      for (let index = 0; index < slots.length; index++) {
        if (slots[index].slot == selectedSlot) return true;
      }
      return false;
    },
    isSlotAKExistInData(slots, selectedAK) {
      for (let index = 0; index < slots.length; index++) {
        if (slots[index].ak == selectedAK) return true;
      }
      return false;
    },
    isInArrayByKey(array, slot) {
      for (let index = 0; index < array.length; index++) {
        if (array[index].slot == slot) return true;
      }
      return false;
    },
    changeSelectedSlot(slot) {
      let data = {
        isSelected: !!slot.value,
        selectedAK: slot.selectedAK,
        selectedSlot: slot.value,
      };
      this.$emit("selectTimeSlotEmiter", data);
    },
  },
};
</script>
<style scoped lang="scss">
@import "./TableSlotBreakfast.scss";
</style>
