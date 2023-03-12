<template>
  <div class="error-modal-container">
    <BaseModal
      :show-modal="showErrorModal"
      :show-close-icon="false"
      :classes="['flex', 'flex-col', 'justify-center', 'items-center']"
    >
      <h2 slot="header" class="modal-header">
        {{ errorModal.header || $t("COMMON.ERROR_MODAL.TITLE") }}
      </h2>
      <p slot="content" class="text-center">
        {{ errorModal.message || $t("COMMON.ERROR_MODAL.DESCRIPTION") }}
      </p>
      <div slot="extra-element">
        <BaseButton
          v-if="isShowReloadBtn"
          :text="$t('COMMON.ERROR_MODAL.RELOAD_PAGE')"
          btn-type="button"
          @onBtnClick="$router.go()"
        />
        <BaseButton
          v-if="isShowCloseBtn"
          btn-type="button"
          :text="closeBtnText || $t('COMMON.TRY_AGAIN')"
          @onBtnClick="$emit('onCloseBtnClick')"
        />
      </div>
    </BaseModal>
  </div>
</template>

<script>
import BaseModal from "@/components/Shared/BaseUI/BaseModal";
import BaseButton from "@/components/Shared/BaseUI/BaseButton";

export default {
  components: {
    BaseModal,
    BaseButton
  },
  props: {
    showErrorModal: {
      type: Boolean,
      default: false,
    },
    isShowReloadBtn: {
      type: Boolean,
      default: true,
    },
    isShowCloseBtn: { type: Boolean, default: false },
    errorModal: {
      type: Object,
      default: () => {
        return {
          header: "",
          message: ""
        };
      },
    },
    closeBtnText: {
      type: String,
      default: ""
    }
  },
  emits: ["onCloseBtnClick"]
};
</script>

<style lang="scss">
@import "./ErrorModal.scss";
</style>
