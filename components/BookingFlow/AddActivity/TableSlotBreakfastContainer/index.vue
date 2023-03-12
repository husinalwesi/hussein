<template>
  <div v-if="packageDetails.card.is_table">
    <TableSlotBreakfast
      v-for="(table, index) in getTablesCount"
      :key="index"
      :index="index"
      :data="{
        title: packageDetails.card.title,
        image: packageDetails.tickets[0].booking_card_icon,
      }"
      :slots="getSlots(index)"
      :selection="packageDetails.tableSelection[index]"
      :is-loader-enabled="isLoaderEnabled"
      :change-evt="changeEvt"
      :package-details="packageDetails"
      :tickets-selected-timeslots="[]"
      :static-labels="staticLabels"
      @selectTimeSlotEmiter="selectTimeSlotTableEmitHandler($event, index)"
    />
  </div>
</template>
<script>
import TableSlotBreakfast from "@/components/BookingFlow/AddActivity/TableSlotBreakfast";
export default {
  name: "TableSlotBreakfastContainer",
  components: {
    TableSlotBreakfast,
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
  },
  data() {
    return {
      slots: {},
      isLoaderEnabled: false,
      isFirstTimeFired: false,
      prevDates: {
        from: "",
        to: "",
      },
    };
  },
  computed: {
    getTablesCount() {
      let guestCount =
        this.packageDetails.people.adult +
        this.packageDetails.people.junior +
        this.packageDetails.people.child;

      let max_number_per_table = this.packageDetails.card.max_number_per_table;
      return this.$getTablesCountDependsOnNumberOfGuest(
        guestCount,
        max_number_per_table
      );
    },
    getGuestCount() {
      return (
        this.packageDetails.people.adult +
        this.packageDetails.people.junior +
        this.packageDetails.people.child
      );
    },
  },
  watch: {
    "changeEvt.date": {
      deep: true,
      immediate: false,
      handler(newData, oldData) {
        if (oldData !== undefined) this.getTablesData();
      },
    },
  },
  mounted() {
    if (!this.isFirstTimeFired) {
      this.getTablesData();
    }
  },
  methods: {
    getOtherTablesSelection(currentIndex) {
      let performancesAK = [];
      for (
        let index = 0;
        index < this.packageDetails.tableSelection.length;
        index++
      ) {
        if (index != currentIndex) {
          if (this.packageDetails.tableSelection[index].isSelected) {
            performancesAK.push(
              this.packageDetails.tableSelection[index].selectedAK
            );
          }
        }
      }
      return performancesAK;
    },
    getSlots(index) {
      let otherSelections = this.getOtherTablesSelection(index);
      if (this.$isEmptyObject(this.slots || {})) {
        return [];
      } else {
        let allSlots = this.slots.slots;
        let currentTableAvailableSlots = [];
        for (let index = 0; index < allSlots.length; index++) {
          if (!otherSelections.includes(allSlots[index].ak)) {
            currentTableAvailableSlots.push(allSlots[index]);
          }
        }
        return currentTableAvailableSlots;
      }
    },
    async getTablesData() {
      if (!this.packageDetails.isDateAvailable) {
        this.slots = [];
        this.isLoaderEnabled = false;
        return false;
      }

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

      this.$emit("bonusTableLoaderEmiter", true);
      this.isLoaderEnabled = true;
      let ak = {
        eventAK: this.packageDetails.tickets[0].ak,
        performanceAk: "",
        slots: [],
      };
      let data = {
        eventAK: this.packageDetails.tickets[0].eventsType.main.performanceAK,
        from: this.packageDetails.date,
        to: this.packageDetails.date,
      };
      let max_number_per_table = Number(
        this.packageDetails.card.max_number_per_table
      );
      let result = await this.$repositories.getCalendarAvailability(data);
      if (result.isSuccess) {
        ak.performanceAk = result.performanceAK;
        let temp = [];
        for (let index = 0; index < result.slots.length; index++) {
          if (
            result.slots[index].STATUS != 2 ||
            !this.$repositories.toBoolean(result.slots[index].SELLABLE) ||
            result.slots[index].AVAILABILITY.AVAILABLE == 0 ||
            result.slots[index].AVAILABILITY.AVAILABLE < max_number_per_table
          )
            continue;

          temp.push({
            ak: result.slots[index].AK,
            slot: result.slots[index].TIME,
            isDisabled: false,
          });
        }
        ak.slots = temp;
        if (!this.isThereEnabledSlot(ak.slots)) {
          ak.slots = [];
        }
        this.slots = ak;
        this.isLoaderEnabled = false;
      } else {
        this.slots = {
          eventAK: this.packageDetails.tickets[0].ak,
          performanceAk: "",
          slots: [],
        };

        this.isLoaderEnabled = false;
      }
      this.$emit("bonusTableLoaderEmiter", false);
    },
    isThereisAselection() {
      for (
        let index = 0;
        index < this.packageDetails.tableSelection.length;
        index++
      ) {
        if (this.packageDetails.tableSelection[index].isSelected) return true;
      }
      return false;
    },
    isThereEnabledSlot(slots) {
      return (
        slots.filter((slot) => {
          return !slot.isDisabled;
        }).length > 0
      );
    },
    selectTimeSlotTableEmitHandler(data, index) {
      this.$emit("selectTimeSlotTableEmiter", {
        index: index,
        data: data,
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import "./TableSlotBreakfastContainer.scss";
</style>
