<template>
  <div class="base-modal-container">
    <transition name="fade" appear>
      <div v-if="showModal" class="modal-overlay" />
    </transition>

    <transition name="base-modal" appear>
      <div v-if="showModal" class="base-modal-wrapper" role="dialog">
        <div
          class="
            base-modal-body
            max-w-[54.563rem]
            min-320:py-10
            min-550:py-14
            py-14
            min-550:px-12
            px-4
          "
          :class="classes"
        >
          <template v-if="!isLoading">
            <slot name="header" />
            <div :class="contentWrapperClasses">
              <slot name="content" />
            </div>
            <slot name="extra-element" />

            <button
              v-if="showCloseIcon"
              :disabled="isCloseButtonDisabled"
              class="close-modal-btn-icon"
              :class="closeModalColor"
              aria-label="close"
              @click.prevent="closeModal()"
            >
              <close-svg
                :color="textCloseColor"
                :width="closeIconWidth"
                :height="closeIconHeight"
              />
            </button>
          </template>
          <template v-else>
            <snowflake-loader loader-classes="w-20 h-20" />
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import CloseSvg from "@/components/SVGElements/close-svg.vue";
import SnowflakeLoader from "@/components/Shared/Loaders/SnowflakeLoader";

export default {
  components: {
    CloseSvg,
    SnowflakeLoader
  },
  props: {
    closeModalColor: {
      type: String,
      default: "bg-[#142B73]",
    },
    textCloseColor: {
      type: String,
      default: "white",
    },
    showModal: {
      type: Boolean,
      default: false,
    },
    classes: {
      type: [String, Array],
      default: "",
    },
    showCloseIcon: {
      type: Boolean,
      default: true,
    },
    contentWrapperClasses: {
      type: [String, Array],
      default: "mt-4",
    },
    isCloseButtonDisabled: { type: Boolean, default: false },
    closeIconWidth: {
      type: String,
      default: "12",
    },
    closeIconHeight: {
      type: String,
      default: "12",
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["closeModal"],
  watch: {
    showModal() {
      const body = document.querySelector("body");

      if (this.showModal) body.style.overflow = "hidden";
      else body.style.overflow = "visible";
    },
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>

<style lang="scss">
@import "./BaseModal.scss";
</style>
