<template>
  <div v-click-outside="closeGuestDDL" class="add-more-guests">
    <div class="add-more-guests-button-container">
      <button
        class="circle-plus-minus-btn"
        aria-label="Add More Guest"
        type="button"
        @click="isGuestDDLEnabled = !isGuestDDLEnabled"
      >
        <Plus />
      </button>
      <p class="add-more-text" @click="isGuestDDLEnabled = !isGuestDDLEnabled">
        {{ $t('BOOKINGFLOW_PAGE.ADD_MORE_GUESTS') }}
      </p>
    </div>
    <div class="drop-down-list" :class="{ ddlEnabled: isGuestDDLEnabled }">
      <People
        id="add-more-guest"
        class="booking-flow"
        :initial-data="{
          adult: packageDetails.people.adult.length,
          child: packageDetails.people.child.length,
          junior: packageDetails.people.junior.length,
        }"
        :is-d-d-l-enabled="isGuestDDLEnabled"
        :enabled-age-type="enabledAgeTypeVar"
        @emitCounterDataEmitter="emitCounterDataEmitterHandler($event)"
      />
    </div>
  </div>
</template>
<script>
import People from "@/components/BookingBar/People";
import Plus from "@/components/SVGElements/Plus.vue";
export default {
  name: "AddMoreGuests",
  components: {
    People,
    Plus,
  },
  props: {
    packageDetails: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isGuestDDLEnabled: false,
      enabledAgeTypeVar: {
        adult: true,
        junior: true,
        child: true,
      },
    };
  },
  watch: {
    isGuestDDLEnabled() {
      this.$restContainerPadding();
      this.$nextTick(() => {
        this.$handleDDLScroll();
      });
    },
  },
  mounted() {
    setTimeout(() => {
      this.enabledAgeType();
    });
  },
  methods: {
    closeGuestDDL() {
      this.isGuestDDLEnabled = false;
    },
    emitCounterDataEmitterHandler(data) {
      this.$emit("guestChangeEmiter", data);
    },
    enabledAgeType() {
      let junior = false;
      let child = false;
      for (
        let index = 0;
        index < this.packageDetails.tickets.length;
        index++
      ) {
        let ticketMinimumAge = this.packageDetails.tickets[index].minimum_age;
        let isJuniorTicketEnabled = !this.$isTicketNeedSupervision(
          ticketMinimumAge,
          "junior"
        );
        let isChildTicketEnabled = !this.$isTicketNeedSupervision(
          ticketMinimumAge,
          "child"
        );
        if (isJuniorTicketEnabled) junior = true;
        if (isChildTicketEnabled) child = true;
      }
      this.enabledAgeTypeVar = {
        adult: true,
        junior: junior,
        child: child,
      };
    },
  },
};
</script>
<style scoped lang="scss">
@import "./AddMoreGuests.scss";
</style>
