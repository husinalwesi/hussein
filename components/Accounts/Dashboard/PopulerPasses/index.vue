<template>
  <section>
    <SectionHeader
      :header-data="{
        title: data.title ? data.title : defaultData.title,
        description: data.description
          ? data.description
          : defaultData.description,
        cta: data.cta ? data.cta : defaultData.cta,
      }"
    />

    <template v-if="data.cards && data.cards.length">
      <PassesContainer
        custom-class="full-container"
        :is-elems-justified-start="true"
        :passes-data="{
          data: data.cards,
          moments: {
            isActive: false,
          },
        }"
        :show-email="false"
        :is-without-side-slides="true"
      />
    </template>
  </section>
</template>

<script>
import SectionHeader from "@/components/Accounts/Dashboard/SectionHeader";
import PassesContainer from "@/components/PassesPackages/PassesContainer";

export default {
  components: {
    SectionHeader,
    PassesContainer,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      defaultData: {
        title: this.$t("ACCOUNT_PAGE.DASHBOARD.POPULER_PASSES.TITLE"),
        description: this.$t("ACCOUNT_PAGE.DASHBOARD.POPULER_PASSES.DESCRIPTION"),
        cta: {
          title: this.$t("ACCOUNT_PAGE.DASHBOARD.POPULER_PASSES.CTA_TITLE"),
          url: "/passes-packages/explore",
        },
      },
    };
  },
};
</script>
