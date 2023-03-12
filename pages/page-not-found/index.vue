<template>
  <main v-if="!isLoading" class="page-not-found-main">
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
            :text="data.cta.title ? data.cta.title : defaultData.ctaTitle"
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
  name: "PageNotFound",
  components: {
    Snow,
    BaseButton
  },
  layout: "error",
  asyncData({error}) {
    return error({statusCode: 404})
  },
  data() {
    return {
      isLoading: true,
      data: {},
      defaultData: {
        title: this.$t("PAGE_NOT_FOUND.TITLE"),
        subtitle: this.$t("PAGE_NOT_FOUND.SUBTITLE"),
        description_highlighted: this.$t("PAGE_NOT_FOUND.DESCRIPTION_CONTENT"),
        ctaTitle: this.$t("PAGE_NOT_FOUND.CTA_TITLE")
      },
      bgImage: ""
    };
  },
  async fetch() {
    try {
      this.bgImage = this.$getSiteConfig("siteBackground");

      const {data: res} = await this.$axios.get(endPoints.GET_ERROR_PAGE);
      if (res.Success && res.Result) this.data = res.Result.error_page || this.defaultData;

      this.isLoading = false;
    } catch (err) {
      this.isLoading = false;
    }
  },
  head() {
    return this.$seoGenerator(this.data, "Page Not Found");
  },
  mounted() {
    CommonEvent.$emit("show-booking-bar", false);
    CommonEvent.$emit("show-bottom-bar", false);
  }
};
</script>

<style lang="scss" scoped>
@import "./page-not-found.scss";
</style>
