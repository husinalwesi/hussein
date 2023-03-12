<template>
  <li v-click-outside="closeGuestDDL">
    <div class="dashed-line my-4" />
    <div class="ticket-details">
      <div class="ticket-main-row">
        <p class="ticket-title">
          {{ ticketData.title }}
        </p>
        <div class="price-container">
          <span
            v-if="!ticketData.isBonus" class="price-txt flex gap-1"
          >
            <span class="ltr:order-1 rtl:order-2">{{ currency }}</span>
            <span class="ltr:order-2 rtl:order-1">{{
              $decimalPlaces(getGuestCount * (ticketData.isUpgradedTicket ? (packageDetails.upgrade_ticket.price - packageDetails.card.price) : packageDetails.card.price), true)
            }}</span>
          </span>
          <div
            v-if="
              !ticketData.isBonus && (isMultipleGuestType || isMultipleTimeSlot)
            "
          >
            <button
              type="button"
              class="guest-ddl-button"
              :class="{ idDDLEnabled: isPeopleDDLEnabled }"
              @click="isPeopleDDLEnabled = !isPeopleDDLEnabled"
            >
              <ArrowUp />
            </button>
          </div>
        </div>
      </div>
      <div class="ticket-guest-row">
        <p class="guest-title">
          {{
            ticketData.isUpgradedTicket ? $t('BOOKINGFLOW_PAGE.ALL_GUESTS') : getAgeText(getAdultCount, getJuniorCount, getChildCount)
          }}
        </p>
        <span
          v-if="isMultipleTimeSlot" class="multiple-time-slots"
        >{{ $t('BOOKINGFLOW_PAGE.MULTIPLE_TIME_SLOTS') }}</span>
        <template v-else>
          <span
            v-if="!ticketData.isBonus && getSlots().length > 0"
            class="time-slot"
          >{{ $dateFormatter(getSlots()[0], "timeSlot") }}</span>
          <span
            v-if="ticketData.isBonus && ticketData.slotsSelection.selectedSlot"
            class="time-slot"
          >{{ $dateFormatter(ticketData.slotsSelection.selectedSlot, "timeSlot") }}</span>
        </template>
      </div>
      <span
        v-if="ticketData.enableAdultSuperVisionMessage"
        class="multiple-time-slots"
      >{{ staticLabels.requires_supervision_message }}</span>
      <span v-if="ticketData.enableAdultMessage" class="multiple-time-slots">{{
        staticLabels.requires_adult_message
      }}</span>
      <div v-if="isUnavailableMsgEnabled">
        <span class="unavailable-ticket">
          ⚠ {{ getGlobalNonEventMessage }}
        </span>
      </div>
    </div>
    <div class="drop-down-list" :class="{ ddlEnabled: isPeopleDDLEnabled }">
      <ul class="ticket-detailed-list">
        <template v-for="(guest, ageType, index) in ticketData.guest">
          <li v-if="guest.length > 0" :key="`ticket-guest-detailed-${index}`">
            <div>
              <span
                class="age-type"
              >
                {{ $t(`BOOKINGFLOW_PAGE.${$options.filters.plural(ageType, guest.length)}`, {count: guest.length}) }}
              </span>
            </div>
            <div class="slot-container">
              <span
                v-for="(slot, index) in timeSlots(ageType)"
                :key="`timeslots-${index}`"
                class="slot"
              >{{ $dateFormatter(slot, "timeSlot") }}</span>
            </div>
            <div>
              <span
                class="price flex gap-1"
              >
                <span class="ltr:order-1 rtl:order-2">{{ currency }}</span>
                <span class="ltr:order-2 rtl:order-1">{{
                  $decimalPlaces(guest.length * packageDetails.card.price, true)
                }}</span>
              </span>
            </div>
          </li>
        </template>
      </ul>
    </div>
  </li>
</template>
<script>
import BookingCalender from "@/components/SVGElements/BookingCalender.vue";
import ArrowUp from "@/components/SVGElements/ArrowUp.vue";

export default {
  name: "Ticket",
  components: {
    ArrowUp,
    BookingCalender,
  },
  props: {
    ticketData: {
      type: Object,
      default: () => {
      },
    },
    packageDetails: {
      type: Object,
      default: () => {
      },
    },
    isPaymentStep: {
      type: Boolean,
      default: false,
    },
    staticLabels: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isPeopleDDLEnabled: false,
      currency: ""
    };
  },
  computed: {
    getGlobalMessageDate() {
      if (!this.isNonEventMsgEnabled) return "";
      if (this.staticLabels && this.staticLabels.non_event_warning_wessage && this.staticLabels.non_event_warning_wessage[0]) {
        let date = this.staticLabels.non_event_warning_wessage[0].date;
        let dateSTR = date.split("T")[0];
        let dateArrNew = dateSTR.split("-");
        // 2022-05-12
        return `${dateArrNew[1]}/${dateArrNew[2]}/${dateArrNew[0]}`;
      }
    },
    isUnavailableMsgEnabled() {
      if (this.isNonEventMsgEnabled && !this.ticketData.isTimeBased) {
        let selectedDate = this.$stringToDate(this.packageDetails.date);
        if (
          selectedDate.getTime() ==
          this.$stringToDate(this.getGlobalMessageDate).getTime()
        )
          return true;
      }
      return false;
    },
    isNonEventMsgEnabled() {
      if (this.staticLabels && this.staticLabels.non_event_warning_wessage)
        return this.staticLabels.non_event_warning_wessage.length > 0;
    },
    getGlobalNonEventMessage() {
      if (!this.isNonEventMsgEnabled) return "";
      if (this.staticLabels.non_event_warning_wessage)
        return this.staticLabels.non_event_warning_wessage[0].message;
    },
    isMultipleTimeSlot() {
      if (!this.ticketData.isBonus) {
        let slots = this.getSlots();
        return slots.length > 1;
      }
      return false;
    },
    getAdultCount() {
      let data = this.ticketData.guest.adult;
      return this.$getNumber(data);
    },
    getJuniorCount() {
      let data = this.ticketData.guest.junior;
      return this.$getNumber(data);
    },
    getChildCount() {
      let data = this.ticketData.guest.child;
      return this.$getNumber(data);
    },
    getGuestCount() {
      return this.getAdultCount + this.getJuniorCount + this.getChildCount;
    },
    isMultipleGuestType() {
      if (!this.ticketData.isBonus) {
        let adult = this.ticketData.guest.adult.length > 0;
        let child = this.ticketData.guest.child.length > 0;
        let junior = this.ticketData.guest.junior.length > 0;
        if ((adult && child) || (adult && junior) || (child && junior))
          return true;
      }
      return false;
    },
    getAgeTextPaymentPage() {
      let adult = this.packageDetails.isCinemaBased
        ? this.packageDetails.people.data.adult
        : this.getTotalSelectedAdults;
      let junior = this.packageDetails.isCinemaBased
        ? this.packageDetails.people.data.junior
        : this.getTotalSelectedJunior;
      let child = this.packageDetails.isCinemaBased
        ? this.packageDetails.people.data.child
        : this.getTotalSelectedChilds;
      return adult + junior + child;
    },
    slotText() {
      if (this.packageDetails.isCinemaBased && !this.ticketData.isInclude) {
        return this.cinemaBasedText;
      } else {
        return (
          this.ticketData.timeSlot ||
          this.packageDetails.tablesSlot[0].selectedTimeSlot
        );
      }
    },
    getTotalSelectedAdults() {
      return this.ticketData.people.data.adult.data.filter(
        (adultTicket) => adultTicket.isSelected || adultTicket.selectedTimeSlot
      ).length;
    },
    getTotalSelectedJunior() {
      return this.ticketData.people.data.junior.data.filter(
        (adultTicket) => adultTicket.isSelected || adultTicket.selectedTimeSlot
      ).length;
    },
    getTotalSelectedChilds() {
      return this.ticketData.people.data.child.data.filter(
        (adultTicket) => adultTicket.isSelected || adultTicket.selectedTimeSlot
      ).length;
    },
    cinemaBasedText() {
      if (!this.ticketData.details) return "";
      return this.ticketData.details.selectedLabel || "";
    },
  },
  created() {
    this.currency = this.$getSiteConfig('currency');
  },
  methods: {
    getSlots() {
      let temp = [];
      if (
        this.ticketData.slotsSelection &&
        this.ticketData.slotsSelection.selectedSlot
      ) {
        temp.push(this.ticketData.slotsSelection.selectedSlot);
      } else {
        for (const ageType in this.ticketData.guest) {
          for (
            let index = 0;
            index < this.ticketData.guest[ageType].length;
            index++
          ) {
            temp.push(this.ticketData.guest[ageType][index].selectedSlot);
          }
        }
      }
      temp = this.$removeEmptyArrayCell(temp);
      return this.$removeDublicateArrayCell(temp);
    },
    getTotalSelected(ageType) {
      return this.ticketData.people.data[ageType].data.filter(
        (adultTicket) => adultTicket.isSelected || adultTicket.selectedTimeSlot
      ).length;
    },
    timeSlots(ageType) {
      let temp = [];
      let data = this.ticketData.guest[ageType];
      for (let index = 0; index < data.length; index++) {
        temp.push(data[index].selectedSlot);
      }
      temp = this.$removeEmptyArrayCell(temp);
      return this.$removeDublicateArrayCell(temp);
    },
    closeGuestDDL() {
      this.isPeopleDDLEnabled = false;
    },
    getAgeText(adult, junior, child) {
      let tempAgeTextArr = [];
      if (adult > 0) tempAgeTextArr.push(`${this.$t(`BOOKINGFLOW_PAGE.${this.$options.filters.plural("adult", adult)}`, {count: adult})}`);
      if (junior > 0) tempAgeTextArr.push(`${this.$t(`BOOKINGFLOW_PAGE.${this.$options.filters.plural("junior", junior)}`, {count: junior})}`);
      if (child > 0) tempAgeTextArr.push(`${this.$t(`BOOKINGFLOW_PAGE.${this.$options.filters.plural("child", child)}`, {count: child})}`);

      return tempAgeTextArr
        .map((ageTextItem) => {
          return ageTextItem;
        })
        .join(", ");
    },
  },
};
</script>
<style lang="scss">
@import "./Ticket.scss";
</style>
