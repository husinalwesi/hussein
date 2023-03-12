<template>
  <Gear
    :user-gear="true"
    custom-class="w-[100%]" :show-back-btn="showBackBtn" :show-checkbox-container="false"
    :show-booking-refernce="false" :show-change-label="true" :show-is-primary="true"
  />
</template>

<script>
import Gear from "@/components/Shared/Gear";

export default {
  components: {Gear},
  data() {
    return {
      showBackBtn: true
    }
  },
  head() {
    return this.$seoGenerator({}, this.$t("PAGES_TITLE.ACCOUNTS.PROFILE.GEAR"));
  }
};
</script>
