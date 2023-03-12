<template>
  <div class="age-type-activities-container">
    <div class="age-type-activities">
      <div class="activities-head">
        <div class="left-side">
          <p class="custom-title">
            {{ $t(`BOOKINGFLOW_PAGE.${ageType.toUpperCase()}`) }}
            <span v-if="isMultipleGuest">{{ guestOrder }} </span>
          </p>
          <button
            v-if="!packageDetails.card.is_movie && isShowRemoveButton"
            class="circle-plus-minus-btn"
            :aria-label="$t('BOOKINGFLOW_PAGE.REMOVE_GUEST')"
            type="button"
            @click="removeAgeType()"
          >
            <Minus />
          </button>
        </div>
        <div
          v-if="
            !packageDetails.card.is_movie && isMultipleGuest && guestOrder == 1
          "
          class="right-side"
        >
          <BaseCheckbox
            :id="`activityCheckbox-${ageType}`"
            v-model="applyToAllTemp"
            :label="$t(`BOOKINGFLOW_PAGE.APPLY_TO_ALL_${ageType.toUpperCase()}`)"
          />
        </div>
      </div>
      <ul v-if="isDesktopDeviceLoc" class="activities-ul">
        <ActivityItem
          v-for="(ticket, ticketIndex) in packageDetails.tickets"
          :key="ticketIndex"
          :ticket-data="ticket"
          :age-type="ageType"
          :selection="guestSelection"
          :package-details="packageDetails"
          :change-evt="changeEvt"
          :guest-order="guestOrder"
          :static-labels="staticLabels"
          @selectionChangeEmiter="selectionChangeEmitHandler"
          @emitDateUnavailableMessageForGuestsApplyToAllEmiter="
            emitDateUnavailableMessageForGuestsApplyToAllHandler
          "
        />
      </ul>
      <div v-else id="activities-carousel">
        <div>
          <VueSlickCarousel
            :key="carouselKey"
            v-bind="settings"
            @beforeChange="disableButton()"
          >
            <ActivityItem
              v-for="(ticket, ticketIndex) in packageDetails.tickets"
              :key="ticketIndex"
              :ticket-data="ticket"
              :age-type="ageType"
              :selection="guestSelection"
              :package-details="packageDetails"
              :change-evt="changeEvt"
              :guest-order="guestOrder"
              :static-labels="staticLabels"
              @selectionChangeEmiter="selectionChangeEmitHandler"
              @emitDateUnavailableMessageForGuestsApplyToAllEmiter="
                emitDateUnavailableMessageForGuestsApplyToAllHandler
              "
            />
          </VueSlickCarousel>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ActivityItem from "@/components/BookingFlow/AddActivity/ActivityItem";
import Minus from "@/components/SVGElements/Minus.vue";

import VueSlickCarousel from "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.common";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.css";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-theme.css";

export default {
  name: "Activities",
  components: {
    Minus,
    ActivityItem,
    VueSlickCarousel,
  },
  props: {
    packageDetails: {
      type: Object,
      default: () => ({}),
    },
    ageType: {
      type: String,
      default: "",
    },
    index: {
      type: Number,
      default: 0,
    },
    activities: {
      type: Array,
      default: () => [],
    },
    applyToAll: {
      type: Boolean,
      default: false,
    },
    isMultipleGuest: {
      type: Boolean,
      default: false,
    },
    guestOrder: {
      type: Number,
      default: 0,
    },
    guestSelection: {
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
    isShowRemoveButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      screenWidth: window.innerWidth,
      applyToAllInline: false,
      applyToAllTemp: this.applyToAll || false,
      isDesktopDeviceLoc: false,
      settings: {
        dots: false,
        arrows: false,
        speed: 833,
        infinite: false,
        rtl: this.$i18n.localeProperties.detectedLang === 'ar',
        centerMode: false,
        centerPadding: "0",
      },
      carouselKey: this.$getTimeStamp(),
      isBtnDisabled: false,
    };
  },
  watch: {
    applyToAll() {
      this.applyToAllTemp = this.applyToAll;
    },
    applyToAllTemp() {
      this.$emit("changeApplyToAllEmiter", this.applyToAllTemp);
      this.emitMainSelection();
    },
  },
  mounted() {
    this.isDesktopDeviceLoc = this.detectDesktopLoc();
    window.addEventListener("resize", this.onResizeEvent);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResizeEvent);
  },
  methods: {
    emitDateUnavailableMessageForGuestsApplyToAllHandler(data) {
      this.$emit("selectionChangeEmiterLast", data);
    },
    selectionChangeEmitHandler(data) {
      this.$emit("selectionChangeEmiter", data);
      this.emitMainSelection();
    },
    disableButton() {
      this.isBtnDisabled = true;
      setTimeout(() => {
        this.isBtnDisabled = false;
      });
    },
    emitMainSelection() {
      if (this.isMultipleGuest && this.guestOrder == 1 && this.applyToAllTemp) {
        this.$emit("mainSelectionChangeEmit", true);
      }
    },
    removeAgeType() {
      this.$emit("removeAgeTypeEmiter", this.ageType, this.guestOrder - 1);
    },
    detectDesktopLoc() {
      return window.innerWidth >= 1024;
    },
    onResizeEvent() {
      if (this.screenWidth != window.innerWidth) {
        // special case happens when scrolling and hide the browser search bar..
        this.carouselKey = this.$getTimeStamp();
        this.isDesktopDeviceLoc = this.detectDesktopLoc();
      }
    },
  },
};
</script>
<style scoped lang="scss">
@import "./Activities.scss";
</style>
