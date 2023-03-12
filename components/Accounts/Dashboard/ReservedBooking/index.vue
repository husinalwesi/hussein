<template>
  <CardContainer wrapper-classes="p-0">
    <template #card-content>
      <div class="relative my-[1.9375rem]">
        <div class="flex gap-x-5 px-4 md:px-0">
          <BookingReference
            :booking-reference="{
              referenceId: reservedBooking.bookingReference,
              totalNumOfTickets: reservedBooking.orderTicketsCount || '0',
              totalPrice:
                reservedBooking.totalPrice - reservedBooking.redeemedAmount ||
                0,
              qrCodeImage: reservedBooking.qr_code,
            }"
          />

          <arrow-svg
            v-if="$globalData.isMobileDevice"
            :with-wrapper="true"
            :wrapper-class="`w-6 h-6 md:w-8 md:h-8 ${
              activeBookingId === reservedBooking.id
                ? 'bg-dark-gray'
                : 'bg-[#ECECEC]'
            }`"
            :arrow-color="`${
              activeBookingId === reservedBooking.id ? 'white' : '#0A1432'
            }`"
            :direction="activeBookingId === reservedBooking.id ? 'up' : 'down'"
            width="16"
            height="16"
            @onArrowClick="$emit('toggleActiveBooking', reservedBooking.id)"
          />
        </div>

        <!--The collapsible behaviour will be on the mobiles only.-->
        <div
          v-if="
            $globalData.isMobileDevice
              ? activeBookingId === reservedBooking.id
              : true
          "
          class="flex flex-col"
        >
          <div class="order-2 md:order-1">
            <template v-for="ticket in reservedBooking.reservedEvents">
              <ReservedEvent
                v-if="
                  isBookingActive ? isValidDateEvent(ticket.eventDate) : true
                "
                :key="ticket.id"
                :ticket="ticket"
                :share-redeemed-amount="reservedBooking.redeemedAmount"
                :location="reservedBooking.location"
              />
            </template>
          </div>

          <div v-if="isBookingActive" class="mb-10 md:mb-0 md:order-2 order-1">
            <div class="divider-dashed" />
            <BookingProgressIndicator
              :order-status="reservedBooking"
              :need-waiver="reservedBooking.needWaiver"
              :reservation-code="reservedBooking.bookingReference"
              :order-day="orderDate"
              :is-membership="isMembershipOrder()"
              custom-classes="pt-14 md:pt-12"
            />
          </div>
        </div>
      </div>
    </template>
  </CardContainer>
</template>

<script>
import BookingReference from "./BookingReference.vue";
import ReservedEvent from "./ReservedEvent";
import BookingProgressIndicator from "@/components/Shared/BookingProgressIndicator";

export default {
  components: { BookingReference, ReservedEvent, BookingProgressIndicator },
  props: {
    activeBookingId: {
      type: [String, Number],
      default: null
    },
    reservedBooking: {
      type: Object,
      default: () => ({})
    },
    isBookingActive: {
      type: Boolean,
      default: false
    }
  },
  emits: ["toggleActiveBooking"],
  data() {
    return {
      orderDate: "",
      tod: new Date()
    };
  },
  mounted() {
    // TODO: enhance this.
    this.orderDate = new Date(
      Math.max(
        ...this.reservedBooking.reservedEvents.map((element) => {
          return new Date(element.eventDate);
        })
      )
    );
  },
  methods: {
    isMembershipOrder() {
      let type = this.reservedBooking.collectionTypes.filter(
        (item) => item.toLowerCase() !== "membership"
      );

      return type.length === 0;
    },
    isValidDateEvent(eventDate) {
      const date = new Date(eventDate);
      if (date.setHours(0, 0, 0, 0) >= this.tod.setHours(0, 0, 0, 0))
        return true;

      return false;
    }
  }
};
</script>

<style scoped lang="scss">
.divider-dashed {
  margin-top: 40px !important;
  margin-bottom: 0px !important;
}
</style>
