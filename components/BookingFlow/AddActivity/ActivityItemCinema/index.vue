<template>
  <li
    class="activity-item"
    :class="{
      selected: isCurrentActivityIsSelected,
      'opacity-60': isCurrentActivityIsDisabled,
    }"
  >
    <div class="list-item-main-container">
      <div>
        <SlotImage
          :image="ticketData.booking_card_icon"
          :text="ticketData.image_note_text"
        />
      </div>
      <div class="activity-content">
        <p class="activity-title">
          {{ ticketData.title }}
        </p>
        <div class="slot-based-container">
          <span class="slot-based">{{
            $dateFormatter(ticketData.slot.slot, "timeSlot")
          }}</span>
        </div>
        <button
          v-if="!isCurrentActivityIsDisabled"
          type="button"
          class="activity-add-button"
          @click="changeSelection"
        >
          <Correct v-if="isCurrentActivityIsSelected" class="mx-auto" />
          <span v-else>{{ $t('BOOKINGFLOW_PAGE.ADD') }}</span>
        </button>
        <span v-if="isCurrentActivityIsDisabled" class="fully-booked-label">
          {{ $t(`BOOKINGFLOW_PAGE.FULLY_BOOKED`) }}
        </span>
      </div>
    </div>
  </li>
</template>
<script>
import SlotImage from "@/components/BookingFlow/AddActivity/SlotImage";
import Correct from "@/components/SVGElements/Correct.vue";
export default {
  name: "ActivityItemCinema",
  components: {
    SlotImage,
    Correct,
  },
  props: {
    ticketData: {
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
  },
  emits: ['selectionCinemaChangeEmiter'],
  computed: {
    isCurrentActivityIsDisabled() {
      let people = this.packageDetails.people;
      let totalGuest = this.$getNumber(people.adult) + this.$getNumber(people.junior) + this.$getNumber(people.child);
      return totalGuest > this.ticketData.availability;
    },
    isCurrentActivityIsSelected() {
      return this.selection.isSelected && this.ticketData.slot.ak == this.selection.ak;
    },
  },
  methods: {
    async changeSelection($event) {
      this.$emit("selectionCinemaChangeEmiter", {
        title: !this.isCurrentActivityIsSelected ? this.ticketData.title : '',
        localizedTitle: this.ticketData.localizedTitle,
        ak: !this.isCurrentActivityIsSelected ? this.ticketData.slot.ak : '',
        isSelected: !this.isCurrentActivityIsSelected,
        selectedSlot: !this.isCurrentActivityIsSelected ? this.ticketData.slot.slot : '',
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import "./ActivityItemCinema.scss";
</style>
