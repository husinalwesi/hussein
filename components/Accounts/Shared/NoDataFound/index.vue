<template>
  <div class="no-data-found" :class="containerClasses">
    <p
      class="
        ltr:font-inter-semi-bold
        rtl:font-noto-sans-arabic-semi-bold
        text-base
      "
      :class="{'mb-3': isShowCTA}"
    >
      {{ noDataText || $t("COMMON.NO_DATA_FOUND") }}
    </p>
    <template v-if="isShowCTA">
      <BaseButton
        :text="btnText || $t('COMMON.TRY_AGAIN')"
        btn-type="button"
        @onBtnClick="$emit('fetchData')"
      />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    containerClasses: {
      type: String,
      default: () => ""
    },
    noDataText: {
      type: String,
      default: () => ""
    },
    btnText: { type: String, default: () => "" },
    isShowCTA: {
      type: Boolean,
      default: true,
    }
  },
  emits: ["fetchData"]
};
</script>

<style lang="scss" scoped>
.no-data-found {
  @apply flex flex-col items-center text-center;

  .gs-base-button-default-styles {
    @apply py-[9px] px-[23px] text-white rounded-lg bg-dark-blue;
  }
}
</style>
