<template>
  <div class="time-slot-table-container">
    <p class="custom-title">
      {{
        !$isEmptyObject(packageDetails.booking_info || {})
          ? packageDetails.booking_info.bonus_ticket_booking_title
          : packageDetails.card.is_movie ? $t('BOOKINGFLOW_PAGE.WHEN_DO_YOU_LIKE_TO_GO') : $t('BOOKINGFLOW_PAGE.CHOOSE_YOUR_ACTIVITY')
      }}
    </p>
    <div
      class="time-slot-table"
      :class="{ slotsUnavailable: !isThereEnabledSlot }"
    >
      <div class="image-holder">
        <SlotImage :image="data.image" />
      </div>
      <div class="content-holder">
        <p>
          <span>{{ data.title }}</span>
        </p>
        <p>{{ $t('BOOKINGFLOW_PAGE.MIN_AGES', {age: data.minimum_age}) }}</p>
      </div>
      <div class="slot-list-container">
        <Slots
          class="slot-list-items"
          :data="slotsAvailable"
          :selected-slot="selection.selectedAK"
          :selected-time="selection.selectedSlot"
          :disabled-slots="ticketsSelectedTimeslots"
          @changeSelectedSlotEmiter="changeSelectedSlot"
          @emitDateUnavailableMessageForGuests="
            emitDateUnavailableMessageForGuestsHandler
          "
        />
        <div
          v-if="!isThereEnabledSlot && staticLabels"
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
    ak: {
      type: String,
      default: "",
    },
    changeEvt: {
      type: Object,
      default: () => ({}),
    },
    staticLabels: {
      type: Object,
      default: () => ({}),
    },
    isEventAK: {
      type: Boolean,
      default: false,
    },
    performanceAK: {
      type: String,
      default: "",
    },
    isPrivateLesson: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      slots: [],
      slotsAvailable: [],
      isLoaderEnabled: true,
      prevDates: {
        from: "",
        to: "",
      },
      isDateAvailablePrev: false
    };
  },
  computed: {
    isSkiLesson() {
      if (this.packageDetails.tickets.length == 0) return false;
      let firstTicket = this.packageDetails.tickets[0];
      if (firstTicket.ages_type_id === undefined) return false;
      return !!firstTicket.ages_type_id.length;
    },
    getCodes() {
      if (!this.isSkiLesson) return "";
      return this.packageDetails.tickets[0].code;
    },
    getTotalGuest() {
      return (
        this.$getNumber(this.packageDetails.people.adult) +
        this.$getNumber(this.packageDetails.people.junior) +
        this.$getNumber(this.packageDetails.people.child)
      );
    },
    isThereEnabledSlot() {
      if (!this.packageDetails.isDateAvailable) return false;
      return (
        this.slotsAvailable.filter((slot) => {
          return !slot.isDisabled;
        }).length > 0
      );
    },
    countEnabledSlots() {
      if (!this.packageDetails.isDateAvailable) return false;
      return this.slotsAvailable.filter((slot) => {
        return !slot.isDisabled;
      }).length;
    },
    getEnabledSlots() {
      if (!this.packageDetails.isDateAvailable) return false;
      return this.slotsAvailable.filter((slot) => {
        return !slot.isDisabled;
      });
    },
  },
  watch: {
    "packageDetails.isDateAvailable": {
      handler(newData, oldData) {
        this.getTimeSlots();
      },      
    },
    ak(){
      this.getTimeSlots();
    },
    "changeEvt.date": {
      deep: true,
      immediate: false,
      handler(newData, oldData) {
        if (oldData !== undefined) this.getTimeSlots();
      },
    },
    "changeEvt.guest": {
      deep: true,
      immediate: true,
      handler() {
        this.updateAvailability();
      },
    },
  },
  mounted() {
    this.getTimeSlots();
  },
  methods: {
    async updateAvailability() {
      this.slotsAvailable = this.slots.map((res) => {
        const result = {
          ak: res.ak,
          slot: res.slot,
          slotEnd: res.slotEnd,
          isDisabled:
            res.isDisabled ||
            Number(res.availability) <
              (this.isPrivateLesson ? 1 : this.getTotalGuest),
        };
        return result;
      });
    },
    emitDateUnavailableMessageForGuestsHandler() {
      this.$showToast({
        type: "orange",
        text: `${this.data.title} ${this.$t('BOOKINGFLOW_PAGE.IS_UNAVAILABLE_ON_THE_NEW_DATE')}`,
      });
    },
    async getTimeSlots() {
      if (!this.packageDetails.isDateAvailable) {
        this.slots = [];
        this.isLoaderEnabled = false;
        this.isDateAvailablePrev = false;
        return false;
      }
      this.$emit("bonusTableLoaderEmiter", true);

      if (
        new Date(this.prevDates.from).setHours(0, 0, 0, 0) ==
        new Date(this.packageDetails.date).setHours(0, 0, 0, 0) &&
        this.isDateAvailablePrev
      ) {
        return false;
      }
      this.prevDates = {
        from: this.packageDetails.date,
        to: this.packageDetails.date,
      };
      this.isDateAvailablePrev = true;

      this.isLoaderEnabled = true;
      let result;
      if (this.isEventAK) {
        let calendarAvailabilityPayload = {
          eventAK: this.ak,
          from: this.packageDetails.date,
          to: this.packageDetails.date,
        };
        let calendarAvailabilityResult = await this.$repositories.getCalendarAvailability(
          calendarAvailabilityPayload
        );
        result = {
          isSuccess: true,
          isTimeBased: true,
          performanceAK: this.ak,
          slots: calendarAvailabilityResult.slots,
        };
      } else {
        let data = {
          code: this.ak,
          productAK: this.ak,
          performanceAK: this.performanceAK,
          from: this.packageDetails.date,
          to: this.packageDetails.date,
        };
        if (this.isSkiLesson) {
          result = await this.$repositories.getAKEventTypeSki(data, this.getCodes);
        } else {
          let calendarAvailabilityPayload = {
            eventAK: this.performanceAK,
            from: this.packageDetails.date,
            to: this.packageDetails.date,
          };
          let calendarAvailabilityResult = await this.$repositories.getCalendarAvailability(
            calendarAvailabilityPayload
          );
          result = {
            isSuccess: true,
            isTimeBased: true,
            performanceAK: this.performanceAK,
            slots: calendarAvailabilityResult.slots,
          };
        }
      }

      if (result.isSuccess) {
        this.slots = result.slots.map((res) => {
          const result = {
            ak: res.AK,
            slot: res.TIME,
            slotEnd: res.ENDTIME,
            availability: res.AVAILABILITY.AVAILABLE,
            isDisabled: res.STATUS != 2 || !this.$repositories.toBoolean(res.SELLABLE),
          };
          return result;
        });
        await this.updateAvailability();
        this.isLoaderEnabled = false;
      } else {
        this.slots = [];
        this.isLoaderEnabled = false;
      }
      this.$emit("bonusTableLoaderEmiter", false);
    },
    async changeSelectedSlot(slot) {
      let data = {
        isSelected: !!slot.value,
        selectedAK: slot.selectedAK,
        selectedSlot: slot.value,
        selectedSlotEnd: slot.endValue,
        campPerformances: [],
      };
      if (
        this.packageDetails.card.every_range_of_booking === 1 ||
        this.packageDetails.card.every_range_of_booking === 2
      ) {
        this.isLoaderEnabled = true;
        let payload = {
          code: this.ak,
          productAK: this.ak,
          performanceAK: this.performanceAK,
          from: this.packageDetails.dates[0],
          to: this.packageDetails.dates[this.packageDetails.dates.length - 1],
          time: slot.value,
          qty: this.getTotalGuest
        };
        let result = await this.$repositories.getAKEventTypeSkiCamp(
          payload,
          this.getCodes,
          this.packageDetails.dates
        );
        data["campPerformances"] = result;
        this.isLoaderEnabled = false;
      }
      this.$emit("selectTimeSlotEmiter", data);
    },
  },
};
</script>
<style scoped lang="scss">
@import "./TableSlot.scss";
</style>
