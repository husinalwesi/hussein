<template>
  <CardContainer :wrapper-classes="'p-0'">
    <template #card-content>
      <div class="cta-box-container">
        <div
          v-if="defaultData.snowflake && defaultData.snowflake.img"
          class="snowflake-image-wrapper"
        >
          <img
            :src="defaultData.snowflake.img.url"
            :alt="defaultData.snowflake.img.alt"
            :title="defaultData.snowflake.img.title"
            width="152"
            height="87"
            class="w-[118px] md:w-[152px] h-[80px]"
          >
        </div>
        <div class="box-text">
          <p class="title">
            {{ data.title ? data.title : defaultData.title }}
          </p>
          <p class="description">
            {{ data.description ? data.description : defaultData.description }}
          </p>
        </div>

        <template v-if="data.cta">
          <BaseButton
            btn-type="link"
            :cta="data.cta"
            :text="
              data.cta && data.cta.title
                ? data.cta.title
                : defaultData.cta.title
            "
            :path="
              data.cta && data.cta.url ? data.cta.url : defaultData.cta.url
            "
          />
        </template>
      </div>
    </template>
  </CardContainer>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      defaultData: {
        title: this.$t("ACCOUNT_PAGE.DASHBOARD.CTA_BOX.TITLE"),
        description: this.$t("ACCOUNT_PAGE.DASHBOARD.CTA_BOX.DESCRIPTION"),
        cta: {
          title: this.$t("ACCOUNT_PAGE.DASHBOARD.CTA_BOX.CTA_TITLE"),
          url: "/passes-packages/explore",
        },
        snowflake: {
          img: {
            // eslint-disable-next-line no-undef
            url: require("@/assets/images/Accounts/snowflake.png"),
            alt: "snowflake",
            title: "snowflake",
          },
        },
      },
    };
  },
  created() {
    const currentEnv = this.$getSiteCurrentEnvironment(false, true);
    const currentEnvText = this.$t(`LOCATIONS.${currentEnv}`);
    this.defaultData.description = `${this.$t("ACCOUNT_PAGE.DASHBOARD.CTA_BOX.DESCRIPTION", {location:currentEnvText})}.`;
  },
};
</script>

<style lang="scss" scoped>
@import "./CTABox.scss";
</style>
