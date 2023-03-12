<template>
  <div class="informative-modal-wrapper">
    <BaseModal :show-modal="isModalActive" :show-close-icon="showCloseIcon">
      <template v-if="data.title" #header>
        <h1 class="informative-modal-header">
          {{ data.title }}
        </h1>
      </template>
      <template v-if="data.description" #content>
        <p class="informative-modal-content">
          {{ data.description }}
        </p>
      </template>

      <template #extra-element>
        <div class="divider-dashed" />
        <div class="actions-container">
          <button
            type="button"
            class="btn-action"
            :disabled="isLoading"
            @click.prevent="$emit('onBtnClick')"
          >
            {{ data.btnText }}

            <snowflake-loader
              v-if="isLoading"
              loader-wrapper-classes="absolute bg-[#ffffffcb] h-full rounded-lg z-10 inset-0"
              loader-classes="w-14 h-14"
            />
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script>
export default {
  props: {
    isModalActive: {
      type: Boolean,
      default: false,
    },
    showCloseIcon: { type: Boolean, default: false },
    isLoading: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['onBtnClick']
};
</script>

<style lang="scss" scoped>
@import "./InformativeModal.scss";
</style>