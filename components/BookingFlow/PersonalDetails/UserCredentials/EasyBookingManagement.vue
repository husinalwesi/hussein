<template>
  <CardContainer>
    <template #card-content>
      <div class="box-container easy-booking-management-container">
        <div v-if="isFullPageLoaderEnabled" class="loader-container">
          <CircleLoader />
        </div>
        <div class="title-container">
          <h2 class="title">
            {{
              staticLabels.continue_as_user &&
                staticLabels.continue_as_user.title
                ? staticLabels.continue_as_user.title
                : $t("BOOKINGFLOW_PAGE.EASY_TICKET_BOOKING_AND_MANAGMENT")
            }}
          </h2>
        </div>

        <div class="mt-6">
          <ul class="account-benifits-list">
            <li
              v-for="(benifit, i) in accountBenifits"
              :key="i"
              class="benifit-item"
            >
              <span class="checkmark-wrapper"><Checkmark /></span>
              {{ benifit.title }}
            </li>
          </ul>
        </div>
      </div>

      <UserAccessBar :round-top-borders="false" :static-labels="staticLabels" />
    </template>
  </CardContainer>
</template>

<script>
import UserAccessBar from "./UserAccessBar";

export default {
  components: { UserAccessBar },
  props: {
    isFullPageLoaderEnabled: {
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
      accountBenifits: [
        {
          title: this.$t("BOOKINGFLOW_PAGE.RECEIVE_YOUR_SNOW_ITINERARY"),
        },
        {
          title: this.$t("BOOKINGFLOW_PAGE.SIGN_WAIVER_FOR_ALL_GUESTS"),
        },
        {
          title: this.$t("BOOKINGFLOW_PAGE.RENT_AND_SAVE_GEAR"),
        },
        {
          title: this.$t("BOOKINGFLOW_PAGE.TRACK_YOUR_SKI_SCHOOL"),
        },
      ],
    };
  },
  mounted() {
    if (
      this.staticLabels &&
      this.staticLabels.continue_as_user &&
      this.staticLabels.continue_as_user.notes &&
      this.staticLabels.continue_as_user.notes.length
    ) {
      this.accountBenifits = this.staticLabels.continue_as_user.notes;
    }
  },
};
</script>
<style lang="scss">
.easy-booking-management-container {
  & .loader-container {
    @apply bg-[#ffffffba] w-full h-full absolute z-[11] flex justify-center items-center rounded-bl-3xl rounded-br-3xl;
  }
}
</style>
