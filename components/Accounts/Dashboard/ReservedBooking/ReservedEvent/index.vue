<template>
  <div class="reserved-event-container">
    <h3 class="event-name">
      {{ ticket.title }}
    </h3>

    <div class="reservation-details">
      <div v-if="location" class="details-container">
        <p class="title">
          {{
            $t(
              "ACCOUNT_PAGE.DASHBOARD.RESERVED_BOOKING.RESERVED_EVENT.LOCATION"
            )
          }}
        </p>
        <p class="desc">
          <!--TODO: Translate this-->
          {{ location }}
        </p>
      </div>

      <div class="details-container mt-4 md:mt-0">
        <p class="title">
          {{
            $t("ACCOUNT_PAGE.DASHBOARD.RESERVED_BOOKING.RESERVED_EVENT.DATE")
          }}
        </p>
        <p class="desc">
          {{ $dateFormatter(ticket.eventDate) }}
        </p>
      </div>

      <div class="details-container num-of-ticket">
        <p class="title">
          {{
            $t(
              "ACCOUNT_PAGE.DASHBOARD.RESERVED_BOOKING.BOOKING_REFERENCE.NUM_OF_TICKETS"
            )
          }}
        </p>

        <p class="desc">
          {{ $pluralTextHandler(ticket.ticketsCount, "tickets") }}
        </p>
      </div>
    </div>

    <div
      v-if="ticket.activities && ticket.activities.length"
      class="event-activities-container"
    >
      <div class="activity-card indicator-card">
        <p class="title">
          {{
            $t(
              "ACCOUNT_PAGE.DASHBOARD.RESERVED_BOOKING.RESERVED_EVENT.ACTIVITIES"
            )
          }}
        </p>
      </div>

      <div class="flex flex-1 gap-4 flex-wrap">
        <div
          v-for="activity in ticket.activities"
          :key="activity.id"
          class="activity-card product-card"
        >
          <p class="title">
            {{ activity.name }}
          </p>

          <div class="reserved-activity-details">
            <div
              v-for="(item, i) in activity.details"
              :key="i"
              class="activity-details-container"
            >
              <p class="guests">
                {{ item.guests }}
              </p>
              <div class="reserved-times-container">
                <div
                  v-for="(time, timeIndex) in item.times"
                  :key="timeIndex"
                  class="time-wrapper"
                >
                  <span class="time">{{
                    $dateFormatter(time, "time", false)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ticket: {
      type: Object,
      default: () => ({})
    },
    location: {
      type: String,
      default: ""
    },
    shareRedeemedAmount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    calculatePrice(data) {
      let total = 0;
      data.activities.forEach((item) => {
        total += item.details.reduce(function (acc, obj) {
          return acc + obj.price;
        }, 0);
      });

      return total;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./ReservedEvent.scss";
</style>
