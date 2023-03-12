<!--TODO: Move this page to be a layout when we finish from dev and handle the errors by checking the error status & type(400, 404, ..etc).-->
<template>
  <main v-if="!isLoading" class="maintenance-main">
    <div v-if="data.logo" class="m-10 mobiles:m-5">
      <img :src="data.logo.image_url">
    </div>
    <div
      :style="{backgroundImage: `url(${bgImage})`}"
      class="bg-gradient-image"
    />
    <Snow class="fixed inset-o w-full h-full" />
    <section v-if="data" class="section-wrapper">
      <div>
        <div
          class="title"
          v-html="
            $globalData.isDesktopDevice
              ? $splitTextToLines(data.title || defaultData.title)
              : $splitTextToLines(data.web_mobile_title || data.title || defaultData.title)
          "
        />
        <div class="sub-title-wrapper">
          <h2 class="sub-title">
            {{ data.subtitle || defaultData.subtitle }}
          </h2>
        </div>

        <div
          class="description-container"
          v-html="data.description_highlighted || defaultData.description_highlighted"
        />

        <template v-if="data.cta">
          <BaseButton
            :btn-type="$isExternalLink(data.cta.url) ? 'externalLink' : 'link'"
            :text="data.cta.title ? data.cta.title : 'Take me home'"
            :path="data.cta.url"
          />
        </template>
      </div>
    </section>
  </main>
</template>

<script>
import Snow from "@/components/Shared/Snow.vue";
import BaseButton from "@/components/Shared/BaseUI/BaseButton";

import {CommonEvent} from "@/services/app-events";
import {endPoints} from "@/const/api";

/* eslint-disable no-undef */

export default {
  name: "Maintenance",
  components: {
    Snow,
    BaseButton
  },
  layout: "error",
  data() {
    return {
      isLoading: true,
      bgImage: "",
      data: {},
      defaultData: {
        title: this.$t("MAINTENANCE_PAGE.TITLE"),
        web_mobile_title: this.$t("MAINTENANCE_PAGE.MOBILE_TITLE"),
        subtitle: this.$t("MAINTENANCE_PAGE.SUBTITLE"),
        description_highlighted: this.$t("MAINTENANCE_PAGE.DESCRIPTION_CONTENT")
      }
    };
  },
  async fetch() {
    try {
      this.bgImage = this.$getSiteConfig("siteBackground");

      const {data: res} = await this.$axios.get(endPoints.GET_ERROR_PAGE);
      if (res.Success && res.Result) this.data = res.Result.maintenance_page || this.defaultData;

      this.isLoading = false;
    } catch (err) {
      this.isLoading = false;
    }
  },
  head() {
    if (this.data)
      return {
        title: this.data.seo ? this.data.seo.meta_title : "Maintenance",
        meta: [
          {
            hid: "title",
            property: "title",
            content: this.data.seo ? this.data.seo.meta_title : "Maintenance",
          },
          {
            hid: "description",
            property: "description",
            content: this.data.seo ? this.data.seo.meta_description : "Maintenance",
          },
          {
            hid: "og:title",
            property: "og:title",
            content: this.data.seo ? this.data.seo.meta_title : "Maintenance",
          },
          {
            hid: "og:description",
            property: "og:description",
            content: this.data.seo ? this.data.seo.meta_description : "Maintenance",
          },
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
          },
        ],
      };
  },
  mounted() {
    CommonEvent.$emit("show-bottom-bar", false);
  }
};
</script>

<style lang="scss" scoped>
@import "./maintenance.scss";
</style>
