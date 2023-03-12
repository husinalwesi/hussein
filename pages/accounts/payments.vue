<template>
  <Payments />
</template>

<script>
import Payments from "@/components/Accounts/Payments";
export default {
  components: {Payments},
  head() {
    return this.$seoGenerator({}, this.$t("PAGES_TITLE.ACCOUNTS.PAYMENTS"));
  }
};
</script>
