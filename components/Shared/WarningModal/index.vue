<template>
  <div class="logout-warning-modal-wrapper">
    <BaseModal
      :show-close-icon="false"
      :show-modal="isModalActive"
      :classes="'flex flex-col items-center justify-center py-10 px-10 min-320:py-10 min-320:px-10 min-550:py-10 min-550:px-10'"
    >
      <template #header>
        <h2 class="modal-header">
          {{ modalData.title }}
        </h2>
      </template>
      <template #content>
        <div class="modal-content" v-html="modalData.description" />
      </template>

      <template #extra-element>
        <div class="actions-container">
          <button
            type="button"
            :disabled="isLoading"
            class="btn-keep"
            @click.prevent="$emit('closeModal')"
          >
            {{ modalData.continueText }}
          </button>
          <button
            type="button"
            :disabled="isLoading"
            class="btn-clear"
            @click.prevent="clearCartAndCloseModal"
          >
            {{ modalData.btnConfirmationText }}
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import {CommonEvent} from "@/services/app-events";
import {globalHelpers} from "~/plugins/helpers";

export default {
  name: 'WarningModal',
  props: {
    isModalActive: {type: Boolean, default: false},
    modalData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['closeModal'],
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    async clearCartAndCloseModal() {
      this.isLoading = true;
      if (this.modalData.actionType !== 'change_env') {
        CommonEvent.$emit("show-screen-loader", true);
        Promise.all([
          this.$store.dispatch("bookingFlow/clearCartAndBookingFlowInfo"),
          this.$store.dispatch("bookingFlow/clearBookingSessionTimer"),
          this.$store.dispatch("bookingBar/clearBookingBarData"),
          this.modalData.actionType === 'logout' ? this.$store.dispatch("currentUser/clearUserInformation") : '',
          this.modalData.actionType === 'logout' ? this.$auth.logout() : '',
        ]);
        if (this.modalData.actionType === 'logout') {
          this.$auth.strategies.auth0.reset();
          window.localStorage.setItem('logged_out', 'logout' + new Date());
        }
        else if (this.modalData.actionType !== 'logout') localStorage.clear()
      }

      if (this.modalData.actionType === 'change_env') {
        CommonEvent.$emit("show-screen-loader", true);
        // TODO: change the location of this array and make it public.
        ["isUpdateMessageActive", "dashboard", "skiPassport", "snowboardPassport"].forEach((ref) => globalHelpers.siteMessagesHandler(ref));

        Promise.all([
          this.$store.dispatch("bookingFlow/clearCartAndBookingFlowInfo"),
          this.$store.dispatch("bookingFlow/clearBookingSessionTimer"),
          this.$store.dispatch("bookingBar/clearBookingBarData"),
        ]);

        window.localStorage.setItem('hard_refresh_pages', 'refresh' + new Date());

        const directedEnv = this.modalData.currentEnv.toLowerCase();
        const currentLang = this.$i18n.localeProperties.detectedLang;

        const locale = directedEnv.includes("dhabi") ? `${currentLang}-ae/snow-abu-dhabi` : directedEnv.includes("oman") ? `${currentLang}-om/snow-oman` : `${currentLang}-ae/ski-dubai`;

        if (this.$isUserAuthenticated()) {
          if (this.modalData.redirectedRoute) this.$lastRouteHandler(this.modalData.redirectedRoute);
          else this.$lastRouteHandler("/"); // To always redirect users to the home page

          this.$router.push(this.localeRoute('/', locale))
        } else {
          setTimeout(() => {
            window.location.href = `/${locale}`;
          }, 1000);
        }
      }
      this.isLoading = false;
      this.$emit("closeModal");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "WarningModal";
</style>
