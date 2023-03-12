<!--TODO: Change the styles of this page when the design team provide us with a design.-->
<template>
  <div :style="{backgroundImage: `url(${bgImage})`}" class="no-data-main">
    <Snow class="fixed inset-o w-full h-full" />
    <div class="no-data-content-container">
      <h1 class="title">
        {{ title || $t("COMMON.NO_DATA_FOUND") }}
      </h1>

      <div
        id="noData"
        ref="noData"
        class="w-72 h-72 md:w-[400px] md:h-[400px]"
      />

      <template v-if="$route.fullPath !== localePath('/')">
        <BaseButton
          btn-type="link"
          :text="cta.title || $t('COMMON.TAKE_ME_HOME')"
          :path="cta.path || '/'"
        />
      </template>
    </div>
  </div>
</template>

<script>
import Snow from "@/components/Shared/Snow.vue";
import BaseButton from "@/components/Shared/BaseUI/BaseButton";

/* eslint-disable no-undef */

export default {
  components: {Snow, BaseButton},
  props: {
    title: {
      type: String,
      default: () => ""
    },
    cta: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      bgImage: "",
    };
  },
  created() {
    this.bgImage = this.$getSiteConfig("siteBackground");
  },
  mounted() {
    const target = this.$refs.noData;

    if (target)
      this.$lottie.loadAnimation({
        container: target,
        renderer: "svg",
        loop: true,
        animationData: require("./no-data.json"),
      });
  },
};
</script>

<style lang="scss" scoped>
@import "./NoData.scss";
</style>
