<template>
  <div class="time-slot-table-container">
    <p v-if="selection.isUpgradeEnabled" class="custom-title">
      {{
        packageDetails.booking_info && packageDetails.booking_info.bonus_ticket_booking_title ? packageDetails.booking_info.bonus_ticket_booking_title : $t('BOOKINGFLOW_PAGE.WHEN_WOULD_YOU_LIKE_TO_GO')
      }}
    </p>
    <div
      class="time-slot-table"
      :class="{ slotsUnavailable: !isThereEnabledSlot || !selection.isUpgradeEnabled }"
    >
      <div class="image-holder">
        <SlotImage :image="data.image" />
      </div>
      <div class="content-holder">
        <p>
          {{ $t('BOOKINGFLOW_PAGE.APPLICABLE_FOR_ALL_GUESTS') }}
        </p>
        <p class="description">
          {{ data.description_one }}
        </p>
        <p class="description hidden lg:block">
          {{ data.description_two }}
        </p>
        <button
          v-if="!selection.isUpgradeEnabled"
          type="button" class="upgrade-ticket-button lg:hidden" @click="upgradeTickets"
        >
          {{ packageDetails.upgrade_ticket && packageDetails.upgrade_ticket.upgrade_cta && packageDetails.upgrade_ticket.upgrade_cta.title ? packageDetails.upgrade_ticket.upgrade_cta.title : $t('BOOKINGFLOW_PAGE.UPGRADE_TICKETS') }}
        </button>
      </div>
      <div class="slot-list-container">
        <template v-if="selection.isUpgradeEnabled">
          <Slots
            class="slot-list-items"
            :data="slotsAvailable"
            :selected-slot="selection.selectedAK"
            :selected-time="selection.selectedSlot"
            :is-cancel-enabled="true"
            :cancel-button-text="packageDetails.upgrade_ticket && packageDetails.upgrade_ticket.cancel_cta && packageDetails.upgrade_ticket.cancel_cta.title ? packageDetails.upgrade_ticket.cancel_cta.title : $t('COMMON.CANCEL')"
            @changeSelectedSlotEmiter="changeSelectedSlot"
            @emitDateUnavailableMessageForGuests="emitDateUnavailableMessageForGuestsHandler"
            @cancelUpgradeTicketEmiter="cancelUpgradeTicketHandler"
          />
          <div
            v-if="!isThereEnabledSlot"
            class="unavailable-date-message unavailable-date-message-box"
          >
            <p>{{ staticLabels && staticLabels.date_unavailable_message ? staticLabels.date_unavailable_message : $t('BOOKINGFLOW_PAGE.IS_UNAVAILABLE_ON_THE_SELECTED_DATE') }}</p>
          </div>
          <div v-if="isLoaderEnabled" class="unavailable-date-message">
            <CircleLoader />
          </div>
        </template>
        <template v-else>
          <button
            type="button" class="upgrade-ticket-button hidden lg:block" @click="upgradeTickets"
          >
            {{ packageDetails.upgrade_ticket && packageDetails.upgrade_ticket.upgrade_cta && packageDetails.upgrade_ticket.upgrade_cta.title ? packageDetails.upgrade_ticket.upgrade_cta.title : $t('BOOKINGFLOW_PAGE.UPGRADE_TICKETS') }}
          </button>
        </template>
      </div>
      <p v-if="isThereEnabledSlot || !selection.isUpgradeEnabled" class="mobile-description">
        {{ data.description_two }}
      </p>
    </div>
    <div class="dashed-line" />
    <YesNoModal
      :is-modal-active="modalData.isModalActive"
      :show-close-icon="false"
      :is-loading="false"
      :data="modalData"
      @onBtn1Click="onModalBtn1Click"
      @onBtn2Click="onModalBtn2Click"
    />
  </div>
</template>
<script>
import SlotImage from "@/components/BookingFlow/AddActivity/SlotImage";
import Slots from "@/components/BookingFlow/AddActivity/Slots";
import YesNoModal from "@/components/BookingFlow/Modals/YesNoModal";

export default {
  name: "TableSlot",
  components: {
    SlotImage,
    Slots,
    YesNoModal
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
    changeEvt: {
      type: Object,
      default: () => ({}),
    },
    staticLabels: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['cancelUpgradeTicketEmiter', 'selectTimeSlotEmiter', 'bonusTableLoaderEmiter', 'upgradeTicketsEmiter'],
  data() {
    return {
      slots: [],
      slotsAvailable: [],
      isLoaderEnabled: true,
      prevDates: {
        from: "",
        to: "",
      },
      modalData: {
        isModalActive: false,
        btn1Text: "",
        btn2Text: "",
        title: "",
        description: "",
      },
    };
  },
  computed: {
    getTotalGuest() {
      let peopleData = this.packageDetails.people;
      return this.$getNumber(peopleData.adult) + this.$getNumber(peopleData.junior) + this.$getNumber(peopleData.child);
    },
    isThereEnabledSlot() {
      return this.countEnabledSlots > 0;
    },
    countEnabledSlots() {
      if (!this.packageDetails.isDateAvailable) return 0;
      return this.slotsAvailable.filter(slot => !slot.isDisabled).length;
    },
    getEnabledSlots() {
      if (!this.packageDetails.isDateAvailable) return false;
      return this.slotsAvailable.filter(slot => !slot.isDisabled);
    },
  },
  watch: {
    "selection.isUpgradeEnabled": {
      deep: true,
      immediate: false,
      handler(newData, oldData) {
        if (newData) this.getTimeSlots();
      },
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
      if (!this.selection.isUpgradeEnabled) return false;
      this.slotsAvailable = this.slots.map((res) => {
        const result = {
          ak: res.ak,
          slot: res.slot,
          isDisabled: res.isDisabled || +res.availability < this.getTotalGuest,
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
      if (!this.selection.isUpgradeEnabled || !this.packageDetails.isDateAvailable) {
        this.slots = [];
        this.isLoaderEnabled = false;
        return false;
      }
      this.$emit("bonusTableLoaderEmiter", true);

      if (
        new Date(this.prevDates.from).setHours(0, 0, 0, 0) ==
        new Date(this.packageDetails.date).setHours(0, 0, 0, 0)
      ) {
        return false;
      }
      this.prevDates = {
        from: this.packageDetails.date,
        to: this.packageDetails.date,
      };

      this.isLoaderEnabled = true;
      if (this.packageDetails.upgrade_ticket.performanceDetails.isSuccess && this.packageDetails.upgrade_ticket.performanceDetails.isTimeBased && this.packageDetails.upgrade_ticket.performanceDetails.performanceAK) {
        let calendarAvailabilityPayload = {
          eventAK: this.packageDetails.upgrade_ticket.performanceDetails.performanceAK,
          from: this.packageDetails.date,
          to: this.packageDetails.date,
        };
        let calendarAvailabilityResult = await this.$repositories.getCalendarAvailability(calendarAvailabilityPayload);
        let result = {
          isSuccess: true,
          isTimeBased: true,
          performanceAK: this.packageDetails.upgrade_ticket.performanceDetails.performanceAK,
          slots: calendarAvailabilityResult.slots,
        };

        if (result.isSuccess) {
          this.slots = result.slots.map((res) => {
            const result = {
              ak: res.AK,
              slot: res.TIME,
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
      } else {
        this.slots = [];
        this.isLoaderEnabled = false;
      }
      this.$emit("bonusTableLoaderEmiter", false);
    },
    async changeSelectedSlot(slot) {
      let data = {
        isUpgradeEnabled: true,
        isSelected: !!slot.value,
        selectedAK: slot.selectedAK,
        selectedSlot: slot.value,
      };
      this.$emit("selectTimeSlotEmiter", data);
    },
    cancelUpgradeTicketHandler(e){
      this.modalData = {
        isModalActive: true,
        btn1Text: this.staticLabels.cancel_upgrade_message && this.staticLabels.cancel_upgrade_message.left_cta && this.staticLabels.cancel_upgrade_message.left_cta.title ? this.staticLabels.cancel_upgrade_message.left_cta.title : this.$t('BOOKINGFLOW_PAGE.CONFIRM'),
        btn2Text: this.staticLabels.cancel_upgrade_message && this.staticLabels.cancel_upgrade_message.right_cta && this.staticLabels.cancel_upgrade_message.right_cta.title ? this.staticLabels.cancel_upgrade_message.right_cta.title : this.$t('COMMON.CANCEL'),
        title: this.staticLabels.cancel_upgrade_message && this.staticLabels.cancel_upgrade_message.title ? this.staticLabels.cancel_upgrade_message.title : this.$t('BOOKINGFLOW_PAGE.ARE_YOU_SURE_YOU_WANT_TO_CANCEL_THE_TICKET_UPGRADING'),
        description: this.staticLabels.cancel_upgrade_message && this.staticLabels.cancel_upgrade_message.description ? this.staticLabels.cancel_upgrade_message.description : this.$t('BOOKINGFLOW_PAGE.ARE_YOU_SURE_YOU_WANT_TO_CANCEL_THE_TICKET_UPGRADING'),
      };
    },
    upgradeTickets(e){
      this.$emit("upgradeTicketsEmiter");
    },
    onModalBtn1Click(data){
      this.modalData.isModalActive = false;
      this.$emit("cancelUpgradeTicketEmiter");
    },
    onModalBtn2Click(data){
      this.modalData.isModalActive = false;
    }
  },
};
</script>
<style scoped lang="scss">
@import "./TableSlotUpgrade.scss";
</style>
