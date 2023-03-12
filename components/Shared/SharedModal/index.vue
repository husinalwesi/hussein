<template>
  <div class="shared-modal-wrapper">
    <BaseModal
      :show-close-icon="false"
      :show-modal="isModalActive"
      :classes="customClass"
    >
      <template #header>
        <h2 class="modal-header">
          {{ modalData.title }}
        </h2>
      </template>
      <template #content>
        <div class="modal-content" :class="modalContentClass">
          <p class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler">
            {{ modalData.description }}
          </p>
        </div>
      </template>

      <template #extra-element>
        <div class="actions-container" :class="btnClass">
          <button
            type="button"
            :disabled="isLoading"
            class="btn-keep"
            @click.prevent="btnClicked('no')"
          >
            {{ modalData.noText }}
          </button>
          <button
            type="button"
            :disabled="isLoading"
            class="btn-clear"
            @click.prevent="btnClicked('yes')"
          >
            {{ modalData.btnConfirmationText }}
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script>

export default {
  name: 'SharedModal',
  props: {
    isModalActive: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => ({
        title: 'modal',
        description: "description",
        confirmationText: "Are you sure you want to ...?",
        noText: "no",
        btnConfirmationText: "yes"
      })
    },
    isLoading: {
      type: Boolean,
      default: () => false
    },
    customClass: {
      type: String,
      default: () => 'flex flex-col items-center justify-center py-10 px-10 min-320:py-10 min-320:px-10 min-550:py-10 min-550:px-10'
    },
    btnClass: {
      type: String,
      default: () => 'items-center justify-center'
    },
    modalContentClass: {
      type: String,
      default: () => 'text-center'
    }
  },
  emits: ['btnClicked'],
  methods: {
    btnClicked(type) {
      this.$emit('btnClicked', type)
    }
  },
};
</script>

<style lang="scss" scoped>
@import "shared-modal";
</style>
