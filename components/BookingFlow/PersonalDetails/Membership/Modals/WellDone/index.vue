<template>
  <div class="memberships-terms-conditions-modal-wrapper">
    <BaseModal :show-modal="showModal" :show-close-icon="false">
      <template #header>
        <h2 class="modal-header">
          {{ $t('BOOKINGFLOW_PAGE.WELL_DONE') }}
        </h2>
      </template>
      <template slot="content">
        <div class="description-wrapper">
          <p class="description">
            {{ $t('BOOKINGFLOW_PAGE.YOU_ADDED_GUEST_NAME_AS_A_NEW_GUEST', { guestName: guestName }) }}
          </p>
        </div>
      </template>
      <template #extra-element>
        <div class="flex justify-end min-550:mt-10 mt-[1.875rem]">
          <BaseButton
            :text="$t('BOOKINGFLOW_PAGE.CLOSE')"
            btn-type="button"
            @onBtnClick="$emit('closeModal')"
          />
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script>
export default {
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    guestName: {
      type: String,
      default: "",
    },
  },
  emits: ['closeModal'],
};
</script>

<style lang="scss" scoped>
@import "./WellDone.scss";
</style>