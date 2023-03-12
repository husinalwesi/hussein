<template>
  <CardContainer>
    <template #card-content>
      <TimeSlots
        :package-details="packageDetails"
        :change-evt="changeEvt"
        :static-labels="staticLabels"
        :is-full-page-loader-enabled="isFullPageLoaderEnabled"
        @selectionChangeEmiter="selectionChangeEmitHandler"
        @mainSelectionChangeEmit="mainSelectionChangeEmitHandler"
        @removeAgeTypeEmiter="removeAgeTypeEmitHandler"
        @guestChangeEmiter="guestChangeEmitHandler"
        @selectTimeSlotEmiter="selectTimeSlotEmitHandler"
        @selectTimeSlotTableEmiter="selectTimeSlotTableEmitHandler"
        @selectionChangeCinemaEmiter="selectionChangeCinemaEmitHandler"
        @selectionChangeEmiterLast="selectionChangeEmiterLast"
        @bonusTableLoaderEmiter="bonusTableLoaderEmiter"
        @cancelUpgradeTicketEmiter="cancelUpgradeTicketHandler"
        @upgradeTicketsEmiter="upgradeTicketsHandler"
      />
    </template>
  </CardContainer>
</template>
<script>
import TimeSlots from "@/components/BookingFlow/AddActivity/TimeSlots";

export default {
  name:"BookingAddingActivity",
  components: {
    TimeSlots,
  },
  props: {
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
    isFullPageLoaderEnabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['upgradeTicketsEmiter', 'cancelUpgradeTicketEmiter', 'selectionChangeEmiterLast', 'selectionChangeCinemaEmiter', 'selectTimeSlotTableEmiter', 'selectTimeSlotEmiter', 'guestChangeEmiter', 'removeAgeTypeEmiter', 'mainSelectionChangeEmit', 'selectionChangeEmiter', 'bonusTableLoaderEmiter'],
  head() {
    return this.$seoGenerator({}, this.$t("PAGES_TITLE.BOOKING.ACTIVITIES"));
  },
  methods: {
    bonusTableLoaderEmiter(data) {
      this.$emit("bonusTableLoaderEmiter", data);
    },
    selectionChangeEmitHandler(data) {
      this.$emit("selectionChangeEmiter", data);
    },
    mainSelectionChangeEmitHandler(ageType) {
      this.$emit("mainSelectionChangeEmit", ageType);
    },
    removeAgeTypeEmitHandler(ageType, index) {
      this.$emit("removeAgeTypeEmiter", ageType, index);
    },
    guestChangeEmitHandler(data) {
      this.$emit("guestChangeEmiter", data);
    },
    selectTimeSlotEmitHandler(data) {
      this.$emit("selectTimeSlotEmiter", data);
    },
    selectTimeSlotTableEmitHandler(data) {
      this.$emit("selectTimeSlotTableEmiter", data);
    },
    selectionChangeCinemaEmitHandler(data) {
      this.$emit("selectionChangeCinemaEmiter", data);
    },
    selectionChangeEmiterLast(data) {
      this.$emit("selectionChangeEmiterLast", data);
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
.card-container::v-deep .card-content-wrapper {
  @apply px-0 min-550:px-0;
}
</style>
