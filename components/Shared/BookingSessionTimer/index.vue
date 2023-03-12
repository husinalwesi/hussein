<template>
  <div class="booking-session-timer-container">
    <BaseModal
      :show-modal="showModal"
      :show-close-icon="false"
      :classes="['flex', 'flex-col', 'justify-center', 'items-center']"
      :content-wrapper-classes="isLoading?'mt-0':'mt-4'"
    >
      <template v-if="isLoading">
        <snowflake-loader slot="content" loader-classes="w-20 h-20" />
      </template>
      <template v-else>
        <h2 slot="header" class="modal-header">
          {{ sessionTimerModal.header }}
        </h2>
        <p slot="content" class="text-center">
          {{ sessionTimerModal.content }}
        </p>
        <div slot="extra-element">
          <BaseButton
            :text="sessionTimerModal.btnText"
            btn-type="button"
            @onBtnClick="onTimerModalBtnClick"
          />
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      isLoading: false,
      endSessionRoute: "",
      sessionTimerMsgs: {
        warning: {
          header: this.$t("BOOKINGFLOW_PAGE.TIME_AND_TIMESLOTS_WAIT_FOR_NO_MAN"),
          content: this.$t("BOOKINGFLOW_PAGE.YOUVE_ONLY_GOT_5_MIN_LEFT"),
          btnText: this.$t("BOOKINGFLOW_PAGE.CONTINUE"),
          actionType: "continueShopping",
        },
        endSession: {
          header: this.$t("BOOKINGFLOW_PAGE.OH_NO_YOUR_BOOKING_SESSION"),
          content: this.$t("BOOKINGFLOW_PAGE.DID_YOU_GET_DISTRACTED_BY_ALL_THE_AWESOMENESS"),
          btnText: this.$t("BOOKINGFLOW_PAGE.EXPLORE"),
          actionType: "clearBookingFlowData",
        },
      },
      showModal: false,
      sessionTimerModal: {
        header: "",
        content: "",
        btnText: "",
        actionType: "",
      },
      sessionEndModalTimeout: null,
      warningModalTimeout: null,
    };
  },
  computed: { ...mapGetters("bookingFlow", ["bookingSessionTimer"]) },
  watch: {
    bookingSessionTimer() {
      if (this.bookingSessionTimer.isStart) {
        this.clearBookingSessionTimeouts();
        this.timerCounterHandler();
      } else {
        this.clearBookingSessionTimeouts();
      }
    },
  },
  created() {
    this.getStaticLabels();
  },
  mounted() {
    if (this.bookingSessionTimer.isStart) {
      if (
        new Date(this.bookingSessionTimer.endDateTime) < new Date() &&
        !this.sessionTimerModal.actionType
      )
        this.remainingMinutesMsgHandler("endSession");
      else this.timerCounterHandler();
    }
  },
  beforeDestroy() {
    this.clearBookingSessionTimeouts();
  },
  methods: {
    getEndSessionRoutePath() {
      const selectedRoute = "/passes-packages/explore";

      return selectedRoute;
    },
    async getStaticLabels() {
      try {
        this.isLoading = true;

        const data = this.$repositories.getSiteGeneralContent();

        if (data) {
          const sessionExpiredObject = data.session_expired || {};
          const warningTimerObject = data.warning_timer_remaining || {};

          this.endSessionRoute = (sessionExpiredObject.cta || {}).url || this.getEndSessionRoutePath();
          this.sessionTimerMsgs = {
            warning: {
              header: warningTimerObject.title || this.$t("BOOKINGFLOW_PAGE.TIME_AND_TIMESLOTS_WAIT_FOR_NO_MAN"),
              content: warningTimerObject.description || this.$t("BOOKINGFLOW_PAGE.YOUVE_ONLY_GOT_5_MIN_LEFT"),
              btnText: (warningTimerObject.cta || {}).title || this.$t("BOOKINGFLOW_PAGE.CONTINUE"),
              actionType: "continueShopping",
            },
            endSession: {
              header: sessionExpiredObject.title || this.$t("BOOKINGFLOW_PAGE.OH_NO_YOUR_BOOKING_SESSION"),
              content: sessionExpiredObject.description || this.$t("BOOKINGFLOW_PAGE.DID_YOU_GET_DISTRACTED_BY_ALL_THE_AWESOMENESS"),
              btnText: (sessionExpiredObject.cta || {}).title || this.$t("BOOKINGFLOW_PAGE.EXPLORE"),
              actionType: "clearBookingFlowData",
            },
          };
        } else {
          this.endSessionRoute = this.getEndSessionRoutePath();
        }

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        console.log({ err });
      }
    },
    clearBookingSessionTimeouts() {
      if (this.sessionEndModalTimeout) {
        clearTimeout(this.sessionEndModalTimeout);
        window.clearTimeout(this.sessionEndModalTimeout);
        this.sessionEndModalTimeout = null;
      }
      if (this.warningModalTimeout) {
        clearTimeout(this.warningModalTimeout);
        window.clearTimeout(this.warningModalTimeout);
        this.warningModalTimeout = null;
      }
    },
    async remainingMinutesMsgHandler(msgType) {
      if (this.showModal) this.showModal = false;

      if (this.bookingSessionTimer.isStart) {
        this.sessionTimerModal = { ...this.sessionTimerMsgs[msgType] };

        if (msgType === "endSession") {
          await this.$store.dispatch("bookingFlow/clearCartAndBookingFlowInfo");
          this.clearBookingSessionTimeouts();
        }

        this.showModal = true;
      }
    },
    timerCounterHandler() {
      const sessionEndTime = new Date(this.bookingSessionTimer.endDateTime);
      const warnMsgTime = sessionEndTime - 60000 * 5 - new Date(); // TODO: make this dynamic.

      if (warnMsgTime > 0) {
        this.warningModalTimeout = setTimeout(
          () => this.remainingMinutesMsgHandler("warning"),
          warnMsgTime
        );
      }

      this.sessionEndModalTimeout = setTimeout(
        () => this.remainingMinutesMsgHandler("endSession"),
        sessionEndTime - new Date()
      );
    },
    onTimerModalBtnClick() {
      if (this.sessionTimerModal.actionType === "clearBookingFlowData") {
        this.$store.dispatch("bookingFlow/clearBookingSessionTimer");
        this.$router.push(this.localePath(this.endSessionRoute || "/passes-packages/explore"));
      }

      this.showModal = false;
    },
  },
};
</script>

<style lang="scss">
@import "./BookingSessionTimer.scss";
</style>
