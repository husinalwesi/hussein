<template>
  <ShareComponent />
</template>

<script>
import ShareComponent from "@/components/Accounts/ShareAccount/index.vue";

export default {
  components:{
    ShareComponent
  },
  head() {
    return this.$seoGenerator({}, this.$t("PAGES_TITLE.ACCOUNTS.SHARE"));
  }
};
</script>
