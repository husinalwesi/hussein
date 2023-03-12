<template>
  <div class="accounts-container">
    <main class="accounts-content">
      <AccountsNavigator :cms-site-config="cmsSiteConfig" />

      <section
        class="
          flex-1
          h-full
          lg:max-w-[892px]
          lg:overflow-x-visible
          lg:px-[10px]
          overflow-x-hidden
          pb-10
        "
      >
        <NuxtChild :cms-site-config="cmsSiteConfig" />
      </section>
    </main>
  </div>
</template>

<script>
import AccountsNavigator from "@/components/Accounts/AccountsNavigator";

export default {
  name:"AccountsPage",
  components: {AccountsNavigator},
  middleware: ["authenticated"],
  data() {
    return {
      cmsSiteConfig: {}
    }
  },
  created() {
    this.setCmsSiteConfig();
  },
  mounted() {
    if (
      this.$route.fullPath === this.localePath("/accounts") ||
      this.$route.fullPath === this.localePath("/accounts") + "/"
    )
      this.$router.push(this.localePath("/accounts/dashboard"));
  },
  methods: {
    async setCmsSiteConfig() {
      this.cmsSiteConfig = await this.$repositories.getCmsSiteConfig();
    }
  }
};
</script>

<style lang="scss" scoped>
.accounts-container {
  @apply w-full relative min-h-screen h-full bg-[#FAFAFA] flex justify-center;

  .accounts-content {
    @apply lg:flex lg:items-start pt-[5.5rem] lg:pt-40 lg:gap-x-10 lg:justify-between max-w-screen-ski-dubai-content-max px-4 relative w-full xl:px-0;

    &::v-deep {
      .divider-dashed {
        @apply h-px w-full opacity-20 my-12;
        background-image: linear-gradient(
          to right,
          transparent 50%,
          #1a1a1a 50%
        );
        background-size: 8px 100%;
      }
    }
  }
}
</style>
