<template>
  <li
    v-click-outside="closeDDL"
    class="activity-item"
    :class="{
      isSlotsEnabled: isTimeBased,
      selected: isCurrentActivityIsSelected,
      'opacity-60': isCurrentActivityDisabled,
    }"
  >
    <div class="list-item-main-container" :class="{ ddlEnalbed: isDDLEnabled }">
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
        <div
          v-if="isCurrentActivityIsSelected && selection.selectedSlot"
          class="slot-based-container"
        >
          <span class="slot-based">{{
            $dateFormatter(selection.selectedSlot, "timeSlot")
          }}</span>
        </div>

        <p v-else class="activity-age">
          {{ ageText }}
        </p>
        <button
          v-if="!isCurrentActivityDisabled"
          type="button"
          class="activity-add-button"
          @click="changeSelection"
        >
          <Correct v-if="isCurrentActivityIsSelected" class="mx-auto" />
          <span v-else>{{ $t('BOOKINGFLOW_PAGE.ADD') }}</span>
        </button>
      </div>
    </div>
    <div v-if="isLoaderEnabled" class="activity-micro-loader">
      <CircleLoader />
    </div>
    <div
      v-if="isTimeBased"
      class="time-slot-table"
      :class="{ ddlEnalbed: isDDLEnabled }"
    >
      <div v-if="availableSlots.length == 0" class="unavailable-date-message">
        <p>{{ staticLabels.date_unavailable_message }}</p>
      </div>
      <Slots
        :data="availableSlots"
        :selected-slot="selectedSlot"
        :selected-time="selectedTime"
        :is-activity="true"
        :age-type="ageType"
        :disabled-slots="getDisabledSlots"
        :package-details="packageDetails"
        @changeSelectedSlotEmiter="changeSelectedSlotEmitHandler"
        @emitDateUnavailableMessageForGuests="
          emitDateUnavailableMessageForGuestsApplyToAllHandler
        "
      />
    </div>
  </li>
</template>
<script>
import SlotImage from "@/components/BookingFlow/AddActivity/SlotImage";
import Slots from "@/components/BookingFlow/AddActivity/Slots";
import Correct from "@/components/SVGElements/Correct.vue";
export default {
  name: "ActivityItem",
  components: {
    SlotImage,
    Correct,
    Slots,
  },
  props: {
    staticLabels: {
      type: Object,
      default: () => ({}),
    },
    ticketData: {
      type: Object,
      default: () => {},
    },
    activityData: {
      type: Object,
      default: () => {},
    },
    guestOrder: {
      type: Number,
      default: 0,
    },
    ageType: {
      type: String,
      default: "",
    },
    isBtnDisabled: {
      type: Boolean,
      default: false,
    },
    packageDetails: {
      type: Object,
      default: () => ({}),
    },
    selection: {
      type: Object,
      default: () => ({}),
    },
    changeEvt: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isDDLEnabled: false,
      isTimeBased: false,
      slots: [],
      isLoaderEnabled: false,
      isInitialized: false,
      performanceAK: "",
    };
  },
  computed: {
    getCurrentSelectionData() {
      return this.packageDetails.people[this.ageType][this.guestOrder - 1];
    },
    selectedSlot() {
      return this.ticketData.id == this.selection.id
        ? this.selection.selectedAK
        : "";
    },
    selectedTime() {
      return this.ticketData.id == this.selection.id
        ? this.selection.selectedSlot
        : "";
    },
    availableSlots() {
      let currentAgeTypeData = this.packageDetails.people[this.ageType];
      let currentUserData = currentAgeTypeData[this.guestOrder - 1];
      //
      return this.slots.map((res) => {
        let reset = res.availability - this.getEventAKSelectionCounter(res.ak);
        let isCurrentSelectGivinPerformanceAK = false;
        if (currentUserData !== undefined) {
          if (currentUserData.selectedAK == res.ak)
            isCurrentSelectGivinPerformanceAK = true;
        }
        const result = {
          ak: res.ak,
          slot: res.slot,
          slotEnd: res.slotEnd,
          isDisabled:
            res.status != 2 ||
            (reset <= 0 && !isCurrentSelectGivinPerformanceAK),
          availableSeat: res.availability,
        };
        return result;
      });
    },
    getProductAKSelectionCounter() {
      let counter = 0;
      let ageTypeData = this.packageDetails.people[this.ageType];
      for (let index = 0; index < ageTypeData.length; index++) {
        if (ageTypeData[index].productAK == this.getCurrentAK) {
          counter++;
        }
      }
      return counter;
    },
    getTotalGuest() {
      return (
        this.packageDetails.people.adult.length +
        this.packageDetails.people.junior.length +
        this.packageDetails.people.child.length
      );
    },
    isThereEnabledSlot() {
      return (
        this.slots.filter((slot) => {
          return !slot.isDisabled;
        }).length > 0
      );
    },
    getCurrentAK() {
      if (this.ageType == "adult") {
        return this.ticketData.adult_ak;
      } else if (this.ageType == "junior") {
        return this.ticketData.junior_ak;
      } else {
        return this.ticketData.child_ak;
      }
    },
    getDisabledSlots() {
      if (!this.$isEmptyObject(this.packageDetails)) {
        if (!this.$isEmptyObject(this.packageDetails.bonusSelection)) {
          if (this.packageDetails.bonusSelection.isSelected) {
            return [
              {
                selectedSlot: this.packageDetails.bonusSelection.selectedSlot,
                selectedSlotEnd: this.packageDetails.bonusSelection.selectedSlotEnd,
              }
            ];
          }
        }
      }
      return [];
    },
    isCurrentActivityIsSelected() {
      return (
        this.selection.isSelected && this.ticketData.id == this.selection.id
      );
    },
    ageText() {
      if (this.isCurrentActivityDisabled) {
        return this.$t('BOOKINGFLOW_PAGE.MUST_BE_MIN_AGE_YEARS_OR_OLDER' , {minimumAge: this.ticketData.minimum_age});
      } else {
        return this.$t('BOOKINGFLOW_PAGE.MIN_AGES', {age: this.ticketData.minimum_age});
      }
    },
    isCurrentActivityDisabled() {
      if(!this.getCurrentAK) return true;
      if (!this.packageDetails.isDateAvailable) return true;
      if (this.packageDetails.card.is_movie) {
        if (this.packageDetails.bonus_ticketSelection.isSelected) {
          return true;
        }
      } else {
        return this.$isTicketNeedSupervision(
          this.ticketData.minimum_age,
          this.ageType
        );
      }
      return false;
    },
  },
  watch: {
    isDDLEnabled() {
      this.$restContainerPadding();
      this.$nextTick(() => {
        this.$handleDDLScroll();
      });
    },
    ticketData() {
      this.detectEventType();
    },
    availableSlots(newData, oldData) {
      if (oldData.length > 0) this.validatePrevSelection();
    },
    "changeEvt.date": {
      deep: true,
      handler() {
        this.isInitialized = false;
        this.emitSelection({
          id: this.ticketData.id,
          isSelected: false,
          selectedAK: "",
          selectedSlot: "",
          productAK: "",
        });
      },
    },
  },
  mounted() {
    this.detectEventType();
  },
  methods: {
    getLastIndexOfPerformanceAK(performanceAK) {
      let selection = this.packageDetails.people[this.ageType];
      for (let index = selection.length; index >= 0; index--) {
        if (selection[index] === undefined) continue;
        if (selection[index].selectedAK == performanceAK) return index;
      }
      return 0;
    },
    validatePrevSelection() {
      if (this.selectedSlot && this.isTimeBased) {
        if (this.isCurrentSelectedSlotExistInData()) {
        } else {
          if (this.isSimilarSlotTimeExist()) {
            // renew the data
            let similarSlot = this.getSimilarSlotTime();
            this.emitSelection({
              id: this.ticketData.id,
              isSelected: true,
              selectedAK: similarSlot.ak,
              selectedSlot: similarSlot.slot,
              productAK: this.getCurrentAK,
            });
            //
          } else {
            this.emitDateUnavailableMessageForGuestsHandler();
            this.emitSelection({
              id: this.ticketData.id,
              isSelected: false,
              selectedAK: "",
              selectedSlot: "",
              productAK: "",
            });
          }
        }
      }
    },
    isSimilarSlotTimeExist() {
      for (let index = 0; index < this.availableSlots.length; index++) {
        if (this.availableSlots[index].slot == this.selectedTime) return true;
      }
      return false;
    },
    getSimilarSlotTime() {
      for (let index = 0; index < this.availableSlots.length; index++) {
        if (this.availableSlots[index].slot == this.selectedTime)
          return this.availableSlots[index];
      }
      return {};
    },
    isCurrentSelectedSlotExistInData() {
      for (let index = 0; index < this.availableSlots.length; index++) {
        if (
          this.availableSlots[index].ak == this.selectedSlot &&
          !this.availableSlots[index].isDisabled
        )
          return true;
      }
      return false;
    },
    isCurrentSelectedSlotExistInDataAndDisabled() {
      for (let index = 0; index < this.availableSlots.length; index++) {
        if (this.availableSlots[index].ak == this.selectedSlot) {
          return true;
        }
      }
      return false;
    },
    getEventAKSelectionCounter(performanceAK) {
      let counter = 0;
      let ageTypeData = this.packageDetails.people[this.ageType];
      for (let index = 0; index < ageTypeData.length; index++) {
        if (
          ageTypeData[index].isSelected &&
          ageTypeData[index].selectedSlot &&
          ageTypeData[index].selectedAK == performanceAK
        ) {
          counter++;
        }
      }
      return counter;
    },
    emitDateUnavailableMessageForGuestsApplyToAllHandler(performanceAK) {
      let lastIndex = this.getLastIndexOfPerformanceAK(performanceAK);
      if (lastIndex == 0) return false;
      this.$emit("emitDateUnavailableMessageForGuestsApplyToAllEmiter", {
        ageType: this.ageType,
        lastIndex: lastIndex,
        title: this.ticketData.title,
      });
    },
    emitDateUnavailableMessageForGuestsHandler() {
      this.$showToast({
        type: "orange",
        text: `${this.ticketData.title} ${this.$t('BOOKINGFLOW_PAGE.FOR')} ${this.ageType} ${this.guestOrder} ${this.$t('BOOKINGFLOW_PAGE.IS_UNAVAILABLE_ON_THE_NEW_DATE')}`,
      });
    },
    async updateSlots() {
      this.isLoaderEnabled = true;
      if (!this.isInitialized) await this.getTimeSlots();
      this.isLoaderEnabled = false;
    },
    detectEventType() {
      this.isTimeBased = this.ticketData.eventsType[this.ageType].isTimeBased;
      this.performanceAK =
        this.ticketData.eventsType[this.ageType].performanceAK;
    },
    async changeSelection($event) {
      this.isLoaderEnabled = true;
      if (this.isTimeBased) {
        if (this.isDDLEnabled) {
          this.isDDLEnabled = false;
          this.isLoaderEnabled = false;
        } else {
          await this.updateSlots();
          this.isDDLEnabled = !this.isDDLEnabled;
          this.isLoaderEnabled = false;
        }
      } else {
        this.emitSelection({
          id: this.ticketData.id,
          isSelected: !this.isCurrentActivityIsSelected,
          selectedAK: this.getCurrentAK,
          selectedSlot: "",
        });
        this.isLoaderEnabled = false;
      }
    },
    changeSelectedSlotEmitHandler(slot) {
      this.emitSelection({
        id: this.ticketData.id,
        isSelected: !!slot.value,
        selectedAK: slot.selectedAK,
        selectedSlot: slot.value,
        selectedSlotEnd: slot.endValue,
        productAK: this.getCurrentAK,
      });
    },
    emitSelection(data) {
      this.$emit("selectionChangeEmiter", data);
    },
    async getTimeSlots() {
      let data = {
        eventAK: this.performanceAK,
        from: this.packageDetails.date,
        to: this.packageDetails.date,
      };
      let result = await this.$repositories.getCalendarAvailability(data);
      if (result.isSuccess) {
        let temp = [];
        for (let index = 0; index < result.slots.length; index++) {
          temp.push({
            ak: result.slots[index].AK,
            slot: result.slots[index].TIME,
            slotEnd: result.slots[index].ENDTIME,            
            status: result.slots[index].STATUS,
            availability: result.slots[index].AVAILABILITY.AVAILABLE,
          });
        }
        this.slots = temp;
        this.isInitialized = true;
      } else {
        this.slots = [];
      }
    },
    closeDDL() {
      this.isDDLEnabled = false;
    },
  },
};
</script>
<style scoped lang="scss">
@import "./ActivityItem.scss";
</style>
