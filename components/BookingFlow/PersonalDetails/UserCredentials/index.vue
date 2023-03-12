<template>
  <div class="user-credentials-wrapper">
    <component
      :is="component"
      :is-full-page-loader-enabled="isFullPageLoaderEnabled"
      :static-labels="staticLabels"
    />
  </div>
</template>

<script>
import EasyBookingManagement from "./EasyBookingManagement.vue";
import Guest from "./Guest";

//TODO: decide which component to show based on the tickets type (have timeslot? --> EasyBookingManagement else Guest).
export default {
  components: {EasyBookingManagement, Guest},
  props: {
    isLoginRequired: {
      type: Boolean,
      default: false
    },
    isFullPageLoaderEnabled: {
      type: Boolean,
      default: false
    },
    staticLabels: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      component: "Guest"
    };
  },
  watch: {
    isLoginRequired: {
      deep: true,
      immediate: true,
      handler() {
        if (this.isLoginRequired) {
          this.component = "EasyBookingManagement";
        } else {
          this.component = "Guest";
        }
      }
    }
  }
};
</script>

<style lang="scss">
@import "./UserCredentials.scss";
</style>
