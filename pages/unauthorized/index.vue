<!--TODO: Move this page to be a layout when we finish from dev and handle the errors by checking the error status & type(400, 404, ..etc).-->
<template>
  <main class="unauthorized-main">
    <div
      :style="{ backgroundImage: `url(${bgImage})` }"
      class="bg-gradient-image"
    />
    <Snow class="fixed inset-o w-full h-full" />

    <section class="section-wrapper">
      <div>
        <h1 class="title">
          {{ $t("UNAUTHORIZED_PAGE.TITLE") }}
        </h1>
        <div class="sub-title-wrapper">
          <h2 class="sub-title">
            {{ $t("UNAUTHORIZED_PAGE.DESCRIPTION") }}
          </h2>
        </div>

        <BaseButton
          :text="$t('HEADER.SIGN_IN')"
          btn-type="button"
          @onBtnClick="onAccessBtnClick"
        />
      </div>
    </section>
  </main>
</template>

<script>
import Snow from "@/components/Shared/Snow.vue";
import BaseButton from "@/components/Shared/BaseUI/BaseButton";

import {CommonEvent} from "@/services/app-events";

/* eslint-disable no-undef */

export default {
  components: {Snow, BaseButton},
  middleware: ["authenticated"],
  data() {
    return {
      bgImage: ""
    };
  },
  fetch() {
    this.bgImage = this.$getSiteConfig("siteBackground");
  },
  head() {
    return {
      title: "Unauthorized",
      meta: [
        {
          hid: "title",
          property: "title",
          content: "Unauthorized"
        },
        {
          hid: "description",
          property: "description",
          content: "You need to sign in in order to see this page."
        },
        {
          hid: "og:title",
          property: "og:title",
          content: "Unauthorized"
        },
        {
          hid: "og:description",
          property: "og:description",
          content: "You need to sign in in order to see this page."
        }
      ],
      /* eslint-disable no-undef */
      link: [
        {
          hid: "canonical",
          rel: "canonical",
          href: process.env.SHARED_ENVS.WEB_BASE_URL + this.$route.fullPath,
        },
        {
          hid: "alternate",
          rel: "alternate",
          href: process.env.SHARED_ENVS.WEB_BASE_URL + this.$route.fullPath,
        }
      ]
    };
  },
  mounted() {
    CommonEvent.$emit("show-bottom-bar", false);
  },
  methods: {
    async onAccessBtnClick() {
      CommonEvent.$emit("show-screen-loader", true);
      this.$lastRouteHandler(this.$route.fullPath);
      this.$auth.ctx.$auth.strategies.auth0.options.clientId = this.$getMpassClientId();
      const {containsShare, countryDetails} = this.$getSiteConfig();

      await this.$auth.loginWith("auth0", {
        params: {
          lang: this.$i18n.localeProperties.detectedLang,
          share_tc: containsShare, // yes or no,
          country: countryDetails.iso3 // iso3 code
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./unauthorized.scss";
</style>
