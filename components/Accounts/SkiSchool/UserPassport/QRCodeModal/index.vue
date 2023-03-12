<template>
  <BaseModal
    :show-modal="showModal"
    :show-close-icon="false"
    content-wrapper-classes="mt-6 md:mt-[56px] flex flex-col items-center"
  >
    <template #header>
      <div class="qr-code-modal-header-container">
        <div class="passport-name-wrapper">
          <h3 class="passport-name">
            {{ $t(`ACCOUNT_PAGE.SKI_SCHOOL.${modalData.passportType}.CODE`) }}
          </h3>
        </div>
        <button
          class="btn-close"
          aria-label="close"
          @click.prevent="$emit('closeModal')"
        >
          <close-svg width="16" height="16" />
        </button>
      </div>
    </template>
    <template #content>
      <div class="qr-code-image-wrapper">
        <img
          :src="`${qrCodeURL}?reservationCode=${modalData.passportNumber}`"
          alt="qr code"
          title="qr code"
          width="256"
          height="256"
          class="w-full h-full rounded-2xl"
        >
      </div>
      <div class="user-details-container">
        <div class="user-full-name">
          {{ modalData.userFullName }}
        </div>
        <div class="user-ak">
          {{ modalData.passportNumber }}
        </div>
      </div>
      <div class="note-text">
        {{ $t(`ACCOUNT_PAGE.SKI_SCHOOL.SCAN_QR_CODE`) }}
      </div>
    </template>
  </BaseModal>
</template>

<script>
import {customLayerEndPoints} from "@/const/api";

export default {
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => ({})
    },
  },
  emits: ["closeModal"],
  data() {
    return {
      qrCodeURL: ''
    }
  },
  created() {
    // eslint-disable-next-line no-undef
    this.qrCodeURL= process.env.SHARED_ENVS.EXTRA_LAYER_AMAZON_BASE_URL + customLayerEndPoints.GET_USER_PASSPORT_QR_CODE;
  }
};
</script>

<style lang="scss" scoped>
@import "./QRCodeModal.scss";
</style>
