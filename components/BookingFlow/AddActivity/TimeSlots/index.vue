<template>
  <div v-if="$isEmptyObject(packageDetails || {})" class="relative h-20">
    <CircleLoader />
  </div>
  <div
    v-else
    class="time-slot-container"
    :class="{
      tableBased:
        packageDetails.card.is_table ||
        packageDetails.tickets.length == 0 ||
        packageDetails.cardType == 'passes' ||
        packageDetails.cardType == 'lessons',
    }"
  >
    <div v-if="isFullPageLoaderEnabled" class="loader-container">
      <CircleLoader />
    </div>
    <p
      v-if="!$isEmptyObject(packageDetails.booking_info || {})"
      class="time-slot-title"
    >
      {{
        packageDetails.booking_info.select_activity_box_title ||
          $t('BOOKINGFLOW_PAGE.CHOOSE_YOUR_ACTIVITY')
      }}
    </p>
    <p
      v-if="!packageDetails.BonusTicketViewModel"
      class="time-slot-description"
      v-html="getSubTitle"
    />

    <TableSlotUpgrade
      v-if="!$isEmptyObject(packageDetails.upgrade_ticket || {})"
      :data="packageDetails.upgrade_ticket"
      :selection="packageDetails.upgradeSelection"
      :change-evt="changeEvt"
      :package-details="packageDetails"
      :static-labels="staticLabels"
      @cancelUpgradeTicketEmiter="cancelUpgradeTicketHandler"
      @upgradeTicketsEmiter="upgradeTicketsHandler"
      @selectTimeSlotEmiter="selectTimeSlotEmitHandler"
      @bonusTableLoaderEmiter="bonusTableLoaderEmiter"
    />
    <TableSlot
      v-if="!$isEmptyObject(packageDetails.BonusTicketViewModel) || !$isEmptyObject(packageDetails.bonus_ticket)"
      :key="packageDetails.uniqueID"
      :data="!$isEmptyObject(packageDetails.BonusTicketViewModel) ? packageDetails.BonusTicketViewModel : packageDetails.bonus_ticket"
      :selection="!$isEmptyObject(packageDetails.BonusTicketViewModel) ? packageDetails.bonusSelection : packageDetails.bonus_ticketSelection"
      :ak="!$isEmptyObject(packageDetails.BonusTicketViewModel) ? packageDetails.BonusTicketViewModel.event_ak : packageDetails.bonus_ticket.event_ak"
      :change-evt="changeEvt"
      :is-event-a-k="true"
      :tickets-selected-timeslots="getSelectedSlots"
      :package-details="packageDetails"
      :static-labels="staticLabels"
      :is-private-lesson="false"
      @selectTimeSlotEmiter="selectTimeSlotEmitHandler"
      @bonusTableLoaderEmiter="bonusTableLoaderEmiter"
    />

    <template
      v-if="
        (packageDetails.cardType == 'passes' ||
          packageDetails.cardType == 'lessons') &&
          !packageDetails.card.is_table &&
          !packageDetails.card.is_movie
      "
    >
      <TableSlot
        v-if="packageDetails.isPassTimebased"
        :key="packageDetails.uniqueID"
        :data="{
          image: packageDetails.tickets[0].booking_card_icon,
          title: packageDetails.tickets[0].title,
          minimum_age:
            packageDetails.tickets[0].minimum_age ||
            packageDetails.tickets[0].minimum_age_label,
        }"
        :selection="packageDetails.isPassTimebasedSelection"
        :ak="packageDetails.tickets[0].ak"
        :performance-a-k="packageDetails.tickets[0].eventsType.main.performanceAK"
        :change-evt="changeEvt"
        :is-event-a-k="false"
        :tickets-selected-timeslots="[]"
        :package-details="packageDetails"
        :static-labels="staticLabels"
        :is-private-lesson="!!packageDetails.tickets[0].additional_ak"
        @selectTimeSlotEmiter="selectTimeSlotEmitHandler"
        @bonusTableLoaderEmiter="bonusTableLoaderEmiter"
      />
    </template>

    <TableSlotBreakfastContainer
      v-if="packageDetails.card.is_table"
      :package-details="packageDetails"
      :change-evt="changeEvt"
      :static-labels="staticLabels"
      @selectTimeSlotTableEmiter="selectTimeSlotTableEmitHandler"
      @bonusTableLoaderEmiter="bonusTableLoaderEmiter"
    />

    <p
      v-if="packageDetails.BonusTicketViewModel"
      class="time-slot-description"
      v-html="getSubTitle"
    />
    <template
      v-if="
        !packageDetails.card.is_table &&
          !packageDetails.card.is_movie &&
          packageDetails.tickets.length > 0
      "
    >
      <template
        v-if="
          packageDetails.cardType == 'packages' &&
            ((isPackageWithBounsTicket && isBounsTicketSelected) ||
              !isPackageWithBounsTicket)
        "
      >
        <div class="age-type-activities-container">
          <template v-for="(guestObj, ageType) in packageDetails.people">
            <div
              v-for="(guest, innerIndex) in guestObj"
              :key="`${ageType} ${innerIndex}`"
              class="age-type-activities"
            >
              <Activities
                :guest-order="innerIndex + 1"
                :is-multiple-guest="guestObj.length > 1"
                :age-type="ageType"
                :change-evt="changeEvt"
                :package-details="packageDetails"
                :guest-selection="guest"
                :static-labels="staticLabels"
                :is-show-remove-button="isShowRemoveGuestButton"
                @selectionChangeEmiter="selectionChangeEmitHandler($event, innerIndex, ageType)"
                @mainSelectionChangeEmit="mainSelectionChangeEmitHandler(ageType)"
                @changeApplyToAllEmiter="changeApplyToAllEmitHandler(ageType, $event)"
                @selectionChangeEmiterLast="selectionChangeEmiterLast"
                @removeAgeTypeEmiter="removeAgeTypeEmitHandler"
              />
              <div class="dashed-line" />
            </div>
          </template>
        </div>
      </template>
    </template>
    <ActivitiesCinema
      v-if="packageDetails.card.is_movie && (
        (
          (packageDetails.bonus_ticketSelection && packageDetails.bonus_ticketSelection.isSelected) ||
          (packageDetails.bonusSelection && packageDetails.bonusSelection.isSelected)
        ) 
        ||
        (
          $isEmptyObject(packageDetails.BonusTicketViewModel) &&
          $isEmptyObject(packageDetails.bonus_ticket)
        )
      )
      "
      :package-details="packageDetails"
      :guest-selection="packageDetails.guestSelection"
      :change-evt="changeEvt"
      @selectionCinemaChangeEmiter="selectionCinemaChangeEmitHandler"
    />

    <AddMoreGuests
      v-if="
        !packageDetails.card.is_table &&
          !packageDetails.card.is_movie &&
          packageDetails.tickets.length > 0 &&
          packageDetails.cardType == 'packages'
      "
      :package-details="packageDetails"
      @guestChangeEmiter="guestChangeEmitHandler"
    />
  </div>
</template>
<script>
import Activities from "@/components/BookingFlow/AddActivity/Activities";
import ActivitiesCinema from "@/components/BookingFlow/AddActivity/ActivitiesCinema";
import TableSlot from "@/components/BookingFlow/AddActivity/TableSlot";
import TableSlotUpgrade from "@/components/BookingFlow/AddActivity/TableSlotUpgrade";
import TableSlotBreakfastContainer from "@/components/BookingFlow/AddActivity/TableSlotBreakfastContainer";
import AddMoreGuests from "@/components/BookingFlow/AddActivity/AddMoreGuests";

export default {
  name: "TimeSlots",
  components: {
    Activities,
    TableSlot,
    TableSlotUpgrade,
    AddMoreGuests,
    TableSlotBreakfastContainer,
    ActivitiesCinema,
  },
  props: {
    packageDetails: {
      type: Object,
      default: () => {},
    },
    changeEvt: {
      type: Object,
      default: () => ({}),
    },
    staticLabels: {
      type: Object,
      default: () => ({}),
    },
    isFullPageLoaderEnabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['upgradeTicketsEmiter', 'cancelUpgradeTicketEmiter', 'mainSelectionChangeEmit', 'selectTimeSlotTableEmiter', 'selectionChangeCinemaEmiter', 'selectTimeSlotEmiter', 'removeAgeTypeEmiter', 'selectionChangeEmiter', 'selectionChangeEmiterLast', 'guestChangeEmiter', 'bonusTableLoaderEmiter'],
  data() {
    return {
      applyToAll: {
        adult: false,
        junior: false,
        child: false,
      },
      isFirstCinemaChange: true
    };
  },
  computed: {
    isBounsTicketSelected() {
      if (this.isPackageWithBounsTicket) {
        return this.packageDetails.bonusSelection.isSelected;
      }
      return false;
    },
    isPackageWithBounsTicket() {
      if (
        this.packageDetails.BonusTicketViewModel &&
        this.packageDetails.cardType == "packages"
      )
        return true;
      return false;
    },
    getSelectedSlots() {
      let temp = [];
      let guestData = this.packageDetails.people;
      for (const ageType in guestData) {
        for (let index = 0; index < guestData[ageType].length; index++) {
          if(guestData[ageType][index].isSelected){
            temp.push({
              selectedSlot: guestData[ageType][index].selectedSlot,
              selectedSlotEnd: guestData[ageType][index].selectedSlotEnd,
            });
          }
        }
      }
      //
      this.$removeEmptyArrayCell(temp);
      this.$removeDublicateArrayCell(temp);
      return temp;
    },
    getSelectedMoveTimeSlot() {
      if (this.packageDetails.guestSelection === undefined) return [];
      if (!this.packageDetails.guestSelection.isSelected) return [];
      return [this.packageDetails.guestSelection.selectedSlot];
    },
    getSubTitle() {
      if (this.$isEmptyObject(this.packageDetails.booking_info || {})) return "";
      return this.packageDetails.booking_info.select_activity_box_subtitle;
    },
    isShowRemoveGuestButton() {
      const {adult = [], junior = [], child = []} = this.packageDetails.people || {};
      const totalGuestsCount = adult.length + junior.length + child.length;

      return totalGuestsCount > 1;
    }
  },
  methods: {
    bonusTableLoaderEmiter(data) {
      this.$emit("bonusTableLoaderEmiter", data);
    },
    guestChangeEmitHandler(data) {
      this.$emit("guestChangeEmiter", data);
    },
    selectionCinemaChangeEmitHandler(data) {
      this.$emit("selectionChangeCinemaEmiter", data);
    },
    selectionChangeEmiterLast(data) {
      this.$emit("selectionChangeEmiterLast", data);
    },
    selectionChangeEmitHandler(data, index, ageType) {
      this.$emit("selectionChangeEmiter", {
        data: data,
        guest: {
          ageType: ageType,
          ageTypeIndex: index,
        },
      });
    },
    getGuestOrderInSameType(guestIndex) {
      let guestType = this.packageDetails.people[guestIndex].guestType;
      let counter = 0;
      for (let index = 0; index < this.packageDetails.people.length; index++) {
        if (this.packageDetails.people[index].guestType == guestType) {
          counter++;
          if (guestIndex == index) return counter;
        }
      }
    },
    removeAgeTypeEmitHandler(ageType, index) {
      this.$emit("removeAgeTypeEmiter", ageType, index);
    },
    selectTimeSlotEmitHandler(data) {
      this.$emit("selectTimeSlotEmiter", data);

      if(!this.isFirstCinemaChange){
        this.$emit("selectionChangeCinemaEmiter", {
          title: '',
          ak: '',
          isSelected: false,
          selectedSlot: '',
          selectedSlotEnd: ''
        });
        this.isFirstCinemaChange = false;
      }
    },
    selectTimeSlotTableEmitHandler(data) {
      this.$emit("selectTimeSlotTableEmiter", data);
    },
    changeApplyToAllEmitHandler(ageType, $event) {
      this.applyToAll[ageType] = $event;
    },
    mainSelectionChangeEmitHandler(ageType) {
      this.$emit("mainSelectionChangeEmit", ageType);
    },
    cancelUpgradeTicketHandler(e){
      this.$emit("cancelUpgradeTicketEmiter");
    },
    upgradeTicketsHandler(e){
      this.$emit("upgradeTicketsEmiter");
    }
  },
};
</script>
<style scoped lang="scss">
@import "./TimeSlots.scss";
</style>
