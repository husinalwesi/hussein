<template>
  <div class="informative-modal-wrapper">
    <BaseModal :show-modal="isModalActive" :show-close-icon="showCloseIcon">
      <template v-if="data.title" #header>
        <h1 class="informative-modal-header">
          {{ data.title }}
        </h1>
      </template>
      <template v-if="data.description" #content>
        <div class="informative-modal-content" v-html="data.description" />
      </template>

      <template #extra-element>
        <div class="divider-dashed" />
        <div class="actions-container">
          <button
            type="button"
            class="btn-cancel"
            :disabled="isLoading"
            @click.prevent="$emit('onBtn2Click', data.extraData)"
          >
            {{ data.btn2Text }}

            <snowflake-loader
              v-if="isLoading"
              loader-wrapper-classes="absolute bg-[#ffffffcb] h-full rounded-lg z-10 inset-0"
              loader-classes="w-14 h-14"
            />
          </button>
          <button
            type="button"
            class="btn-action"
            :disabled="isLoading"
            @click.prevent="$emit('onBtn1Click', data.extraData)"
          >
            {{ data.btn1Text }}

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
    showCloseIcon: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {
      }
    },
  },
  emits: ['onBtn1Click', 'onBtn2Click']
};
</script>

<style lang="scss" scoped>
@import "./YesNoModal.scss";
</style>
