<template>
  <BaseModal :show-modal="showRemoveModal" :show-close-icon="false">
    <template #header>
      <div class="remove-modal-header">
        {{ removeModal.header }}
      </div>
    </template>
    <template #content>
      <!--TODO: Remove this customisation(br).-->
      <div class="remove-modal-content">
        {{ removeModal.description }}<br>{{ removeModal.confirmationText }}
      </div>
    </template>

    <template #extra-element>
      <div class="divider-dashed" />
      <div class="actions-container">
        <button
          type="button"
          class="btn-close"
          :disabled="isLoading"
          @click.prevent="$emit('closeRemoveModal')"
        >
          {{ removeModal.closeModalText }}
        </button>
        <button
          type="button"
          class="btn-remove"
          :disabled="isLoading"
          @click.prevent="$emit('removePaymentCard')"
        >
          {{ removeModal.removeCardText }}

          <snowflake-loader
            v-if="isLoading"
            loader-wrapper-classes="absolute bg-[#ffffffcb] h-full rounded-lg z-10 inset-0"
            loader-classes="w-14 h-14"
          />
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script>
export default {
  props: {
    showRemoveModal: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ["closeRemoveModal", "removePaymentCard"],
  data() {
    return {
      removeModal: {
        header: this.$t("ACCOUNT_PAGE.PAYMENTS.PAYMENT_CARD.REMOVE_MODAL.TITLE"),
        description: this.$t("ACCOUNT_PAGE.PAYMENTS.PAYMENT_CARD.REMOVE_MODAL.DESCRIPTION"),
        confirmationText: this.$t("ACCOUNT_PAGE.PAYMENTS.PAYMENT_CARD.REMOVE_MODAL.CONFIRMATION_TEXT"),
        closeModalText: this.$t("ACCOUNT_PAGE.PAYMENTS.PAYMENT_CARD.REMOVE_MODAL.CANCEL_TEXT"),
        removeCardText: this.$t("ACCOUNT_PAGE.PAYMENTS.PAYMENT_CARD.REMOVE_MODAL.REMOVE_TEXT")
      },
    };
  }
};
</script>

<style lang="scss" scoped>
@import "./RemoveModal.scss";
</style>