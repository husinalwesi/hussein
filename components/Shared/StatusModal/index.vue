<template>
  <BaseModal
    :classes="[`status-modal max-w-[40rem] mobiles:max-w-[343px]`]" :show-close-icon="false" :show-modal="showModal"
    @closeModal="closeModal"
  >
    <template slot="header">
      <div class="badge-info" :class="statusClass">
        {{ statusTitle }}
      </div>
    </template>
    <template slot="content">
      <div class="primary-title mt-10">
        {{ primaryTitle }}
      </div>
      <div v-if="user&&!user.parent_user_id" class="modal-subtitle mt-2">
        {{ $t('COMMON.PRIMARY_ACCOUNT') }}
      </div>
      <div class="modal-subtitle description mt-6" v-html="statusLabel[waiver.status.toLowerCase()]" />
    </template>
    <template slot="extra-element">
      <div v-if="$globalData.isMobileDevice" class="section-border mt-8" />
      <div class="flex justify-end md:justify-center mt-6 md:mt-10">
        <BaseButton
          class-name="btn-cancel"
          :text="$t('WAIVER.STATUS_MODAL.CANCEL_BTN')" btn-type="button"
          @onBtnClick="closeModal"
        />
        <BaseButton
          class-name="w-submit-btn"
          :text="$t('WAIVER.STATUS_MODAL.YES_BTN')" btn-type="button"
          @onBtnClick="submit"
        />
      </div>
    </template>
  </BaseModal>
</template>

<script>
export default {
  props: {
    statusTitle: {
      required: true,
      type: String
    },
    statusClass: {
      //predefined classes are success-bg/error-bg/warning-bg
      default: 'success-bg',
      type: String
    },
    primaryTitle: {
      required: true,
      type: String
    },
    showModal: {
      required: true,
      type: Boolean
    },
    user: {
      type: Object,
      default: () => {
      }
    },
    waiver: {
      type: Object,
      default: () => {
      }
    },
  },
  emits: ['close-modal', 'submit'],
  data() {
    return {
      statusLabel: {
        'approved': this.$t('WAIVER.STATUS_MODAL.APPROVED'),
        'expired': this.$t('WAIVER.STATUS_MODAL.EXPIRED'),
        'pending': this.$t('WAIVER.STATUS_MODAL.PENDING')
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close-modal', false);
    },
    submit() {
      this.$emit('submit', false);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./StatusModal.scss";
</style>
