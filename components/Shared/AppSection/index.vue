<template>
  <div
    id="mobileAppSection"
    class="planing-your-visit-sec content-bg"
    :class="customClass"
  >
    <div class="info-part">
      <div class="px-9 xl:px-0 w-full md:w-fit">
        <h2 v-if="appSectionData.title" class="title rtl:mb-10">
          {{ appSectionData.title }}
        </h2>
        <h3 v-if="appSectionData.subtitle" class="sub-title">
          {{ appSectionData.subtitle }}
        </h3>
        <div class="mb-5 md:mb-8">
          <AppFeatures
            v-if="appSectionData.benefits && appSectionData.benefits.length"
            :app-features="appSectionData.benefits"
          />
        </div>

        <div v-if="!$globalData.isMobileDevice" class="md:flex gap-x-4">
          <a
            v-if="appSectionData.app_store_cta"
            :href="appSectionData.app_store_cta.url"
            target="_blank"
            class="cursor-pointer"
            @click="addEvent('app store')"
          >
            <img
              :src="appSectionData.app_store_cta.icon.image_url"
              :title="appSectionData.app_store_cta.icon.title"
              :alt="appSectionData.app_store_cta.icon.alt_text"
              width="120"
              height="40"
              class="w-[120px] h-10"
            ></a>
          <a
            v-if="appSectionData.google_play_cta"
            :href="appSectionData.google_play_cta.url"
            target="_blank"
            class="cursor-pointer"
            @click="addEvent('play store')"
          >
            <img
              :src="appSectionData.google_play_cta.icon.image_url"
              :title="appSectionData.google_play_cta.icon.title"
              :alt="appSectionData.google_play_cta.icon.alt_text"
              width="135"
              height="40"
              class="w-[135px] h-10"
            ></a>
        </div>
        <div v-else>
          <BaseButton
            v-if="(appCTA || {}).url"
            :text="(appSectionData.cta || {}).title || $t('COMMON.GET_THE_APP')"
            :cta="appCTA"
            :btn-type="$isExternalLink(appCTA.url) ? 'externalLink' : 'link'"
            :path="appCTA.url"
            class="base-button"
          />
        </div>
      </div>
    </div>

    <div v-if="appSectionData.image && appSectionData.image.image_url" class="mobile-img-part">
      <div class="img-wrapper" :class="{ 'flex items-end': $globalData.isMobileDevice }">
        <img
          :src="appSectionData.image.image_url"
          :title="appSectionData.description"
          alt="Download our app to plan your visit!"
          class="w-full h-auto max-w-[483px] max-h-[552px]"
        >
      </div>
    </div>
  </div>
</template>

<script>
import AppFeatures from "@/components/HomePage/MobileAppSection/AppFeatures.vue";
import BaseButton from "@/components/Shared/BaseUI/BaseButton";

import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

export default {
  components: {
    AppFeatures,
    BaseButton
  },
  props: {
    appSectionData: {
      type: Object,
      required: true
    },
    customClass: {
      type: String,
      default: () => ""
    },
  },
  data() {
    return {
      isAppleDevice: false
    }
  },
  computed: {
    appCTA() {
      const data = this.appSectionData || {};
      const cta = this.isAppleDevice ? data.app_store_cta : data.google_play_cta;

      return cta;
    }
  },
  created() {
    // eslint-disable-next-line no-undef
    if (process.client) {
      const mobileOS = this.$getMobileOS(navigator.userAgent || navigator.vendor || window.opera);
      this.isAppleDevice = ["iOS", "Safari"].includes(mobileOS);
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$globalData.isDesktopDevice) this.applyParallaxEffect();
    });
  },
  beforeDestroy() {
    if (this.$globalData.isDesktopDevice) ScrollTrigger.getById("appSectionTrigger")?.kill(true);
  },
  methods: {
    applyParallaxEffect() {
      gsap.registerPlugin(ScrollTrigger);

      const appSection = document.querySelector("#mobileAppSection");

      if (appSection) {
        const mobileImg = appSection.querySelector(".img-wrapper");

        let appSectionScrollTrigger = gsap.timeline({
          scrollTrigger: {
            id: "appSectionTrigger",
            trigger: appSection,
            scrub: 0,
            end: "bottom bottom",
          },
        });

        if (mobileImg)
          appSectionScrollTrigger
            .from(mobileImg, {
              y: "0",
              ease: "none"
            })
            .to(mobileImg, {
              y: "-8%",
              ease: "none"
            });
      }
    },
    addEvent(type) {
      this.$repositories.installAppEvent(type)
    }
  },
};
</script>

<style scoped lang="scss">
@import "./AppSection.scss";
</style>
