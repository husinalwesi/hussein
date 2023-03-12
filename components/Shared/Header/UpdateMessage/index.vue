<template>
  <div v-if="showUpdateMessage" class="update-msg-container">
    <div class="update-msg" v-html="updateMessage" />

    <button
      type="button"
      aria-label="Close update message"
      @click="closeUpdateMessage"
    >
      <close-svg width="16" height="16" color="black" />
    </button>
  </div>
</template>

<script>
import CloseSvg from "@/components/SVGElements/close-svg.vue";
import {globalHelpers} from "~/plugins/helpers";

export default {
  components: {
    CloseSvg
  },
  props: {
    updateMessage: {
      type: String,
      default: () => "",
    }
  },
  data() {
    return {
      showUpdateMessage: false
    };
  },
  mounted() {
    const updateMessageStatus = globalHelpers.getSessionStorage("isUpdateMessageActive");
    if (updateMessageStatus !== null && String(updateMessageStatus) !== "true") this.showUpdateMessage = false;
    else this.showUpdateMessage = true;
  },
  methods: {
    closeUpdateMessage() {
      globalHelpers.setSessionStorage("isUpdateMessageActive", false);
      this.showUpdateMessage = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./UpdateMessage.scss";
</style>
