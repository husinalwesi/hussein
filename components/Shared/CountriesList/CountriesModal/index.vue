<template>
  <transition name="slide-fade">
    <div v-if="showModal" class="countries-modal-container">
      <div class="flex items-center p-5">
        <div class="cursor-pointer lg:hidden" @click="$emit('close')">
          <arrow-svg
            :direction="$i18n.localeProperties.detectedLang === 'en' ? 'left' : 'right'" height="23" width="23"
            :arrow-color="'#a1a1a1'"
          />
        </div>
        <div class="flex-grow ltr:ml-4 rtl:mr-4 rtl:ml-0 lg:ltr:ml-0 lg:ltr:mr-0">
          <slot name="header" />
        </div>
      </div>

      <div class="flex-grow overflow-y-scroll mt-3">
        <div class="h-full lg:h-auto">
          <slot name="content" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
};
</script>

<style lang="scss" scoped>
@import "./CountriesModal.scss";
</style>
