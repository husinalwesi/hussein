<template>
  <Waiver
    :show-user-waiver="true" custom-class="w-[100%]" :show-back-btn="true"
    :show-booking-refernce="false"
  />
</template>

<script>
import Waiver from "@/components/Shared/waiver";

export default {
  components: {Waiver},
  head() {
    return this.$seoGenerator({}, this.$t("PAGES_TITLE.ACCOUNTS.PROFILE.WAIVER"));
  }
};
</script>
