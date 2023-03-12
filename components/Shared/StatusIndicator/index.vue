<template>
  <div class="status-indicator-container" :class="statusWrapperContainer">
    <div
      class="status-wrapper"
      :class="[statusType, { 'with-tooltip': !!tooltipText }]"
    >
      <exclamation-mark-icon :color="iconColor" />
      <label class="status-label">{{ labelText }}</label>

      <div v-if="tooltipText" class="tooltip-wrapper z-[1] lg:-translate-x-20 max-w-[303px] md:max-w-[348px]" :class="tooltipWrapperClasses">
        <p class="tooltip-text">
          {{ tooltipText }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import ExclamationMarkIcon from "@/components/SVGElements/exclamation-mark-icon";

export default {
  components: { ExclamationMarkIcon },
  props: {
    statusWrapperContainer: {
      type: String,
      default: () => "",
    },
    statusType: {
      type: String,
      default: () => "general",
    },
    customIconColor: {
      type: String,
      default: () => "",
    },
    customLabelText: {
      type: String,
      default: () => "",
    },
    tooltipText: {
      type: String,
      default: () => "",
    },
    tooltipWrapperClasses: { type: String, default: () => "" },
  },
  data() {
    return {
      iconColor: "",
      labelText: "",
    };
  },
  created() {
    this.iconColor = this.customIconColor
      ? this.customIconColor
      : this.statusType === "done"
      ? "#58B150"
      : this.statusType === "waiting"
      ? "#FF9603"
      : this.statusType === "error"
      ? "#ff173d"
      : "#0A1432";

    this.labelText = this.customLabelText
      ? this.customLabelText
      : this.statusType === "done"
      ? this.$t("COMMON.APPROVED")
      : this.statusType === "waiting"
      ? this.$t("COMMON.AWAITING_APPROVAL")
      : this.statusType === "error"
      ? this.$t("COMMON.PENDING")
      : "Required for Ski Dubai only"; // TODO: Come back here to translate this sentence.
  },
};
</script>

<style lang="scss" scoped>
@import "./StatusIndicator.scss";
</style>
