<template>
  <section id="appSection" class="mobile-app-wrapper">
    <div class="activtiy-section">
      <div class="activtiy-section-part-wrapper order-1 px-9 md:px-0 md:order-2">
        <div class="content-container">
          <div class="mb-4">
            <h2 v-if="sectionData.title" class="activtiy-section-title">
              {{ sectionData.title }}
            </h2>
            <h3 v-if="sectionData.subtitle" class="activtiy-section-sub-title sub-title-animation">
              {{ sectionData.subtitle }}
            </h3>
            <p v-if="sectionData.description" class="activtiy-section-paragraph description-animation">
              {{ sectionData.description }}
            </p>
          </div>

          <div v-if="sectionData.benefits" class="mb-4 md:mb-6 description-animation">
            <AppFeatures :app-features="sectionData.benefits" />
          </div>

          <div v-if="$globalData.isDesktopDevice" class="md:flex gap-x-6 btn-animation">
            <a
              v-if="sectionData.app_store_cta" :href="sectionData.app_store_cta.url" target="_blank"
              class="cursor-pointer" @click="addEvent('app store')"
            >
              <img
                v-if="sectionData.app_store_cta.icon"
                :src="sectionData.app_store_cta.icon.image_url"
                :title="sectionData.app_store_cta.icon.title"
                :alt="sectionData.app_store_cta.icon.alt_text"
                width="120"
                height="40"
                class="w-[120px] h-10"
              ></a>
            <a
              v-if="sectionData.google_play_cta" :href="sectionData.google_play_cta.url"
              target="_blank" class="cursor-pointer" @click="addEvent('play store')"
            >
              <img
                v-if="sectionData.google_play_cta.icon"
                :src="sectionData.google_play_cta.icon.image_url"
                :title="sectionData.google_play_cta.icon.title"
                :alt="sectionData.google_play_cta.icon.alt_text"
                width="135"
                height="40"
                class="w-[135px] h-10"
              ></a>
          </div>
          <div v-else class="btn-animation">
            <BaseButton
              v-if="(appCTA || {}).url"
              :text="(sectionData.cta || {}).title || $t('COMMON.GET_THE_APP')"
              :cta="appCTA"
              :btn-type="$isExternalLink(appCTA.url) ? 'externalLink' : 'link'"
              :path="appCTA.url"
            />
          </div>
        </div>
      </div>

      <div class="activtiy-section-part-wrapper mobile-lottie order-2 md:order-1">
        <div id="appSectionLottie" class="w-full h-auto" />
      </div>
    </div>
  </section>
</template>

<script>
import AppFeatures from "./AppFeatures.vue";
import BaseButton from "@/components/Shared/BaseUI/BaseButton";

import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {SplitText} from "@/assets/js/SplitText.js";

export default {
  components: {
    AppFeatures,
    BaseButton
  },
  props: {
    sectionData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isAppleDevice: false
    }
  },
  computed: {
    appCTA() {
      const data = this.sectionData || {};
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
    this.animateAppSection();
  },
  beforeDestroy() {
    if (ScrollTrigger) ScrollTrigger.getById("mobileAppSectionTrigger")?.kill(true);
  },
  methods: {
    animateAppSection() {
      gsap.registerPlugin(ScrollTrigger);

      const appSection = document.querySelector("#appSection");

      if (appSection) {
        const contentContainer = appSection.querySelector(".content-container");

        const title = appSection.querySelector("h2");
        const subTitle = appSection.querySelector("h3");
        const description = appSection.querySelectorAll(".description-animation");
        const button = appSection.querySelector(".btn-animation");

        let titleAnimation = null;
        let subTitleAnime = null;
        let descriptionAnime = null;
        let buttonAnime = null;

        if (this.$detectMobile()) {
          titleAnimation = this.titleAnimationHandler(title, 0.67, 0);
          subTitleAnime = this.revealElementUpAnimeHandler(
            subTitle,
            0.67,
            0.13
          );
          descriptionAnime = this.revealElementUpAnimeHandler(
            description,
            0.67,
            0.07
          );
          buttonAnime = this.revealElementUpAnimeHandler(button, 0.67, 0.17);
        } else {
          titleAnimation = this.titleAnimationHandler(title, 0.67, 0.03);
          subTitleAnime = this.revealElementUpAnimeHandler(
            subTitle,
            0.67,
            0.13
          );
          descriptionAnime = this.revealElementUpAnimeHandler(
            description,
            0.67,
            0.07
          );
          buttonAnime = this.revealElementUpAnimeHandler(button, 0.67, 0.07);
        }

        const tl = gsap.timeline();
        if (titleAnimation) tl.add(titleAnimation);
        if (subTitleAnime) tl.add(subTitleAnime, "<");
        if (descriptionAnime) tl.add(descriptionAnime, "<");
        if (buttonAnime) tl.add(buttonAnime, "<");

        ScrollTrigger.create({
          id: "mobileAppSectionTrigger",
          trigger: contentContainer,
          animation: tl,
          start: `top ${this.$detectMobile() ? "90%" : "70%"}`,
          toggleActions: "play none none reverse",
        });

        if (this.sectionData.image_document_link)
          this.LottieScrollTrigger(appSection);
      }
    },
    titleAnimationHandler(title, dur, del = 0) {
      if (!title) return "";

      title.split = new SplitText(title, {
        type: "words",
      });

      return gsap
        .from(title.split.words, {
          duration: dur,
          transitionTimingFunction: (0.33, 0.0, 0.0, 1.0),
          y: 200,
          stagger: 0.06,
        })
        .delay(del);
    },
    revealElementUpAnimeHandler(elem, dur, del) {
      if (!elem) return "";

      return gsap
        .from(elem, {
          autoAlpha: 0,
          transitionTimingFunction: (0.33, 0.0, 0.0, 1.0),
        })
        .duration(dur)
        .delay(del);
    },
    async LottieScrollTrigger(wrapper) {
      try {
        const {data: res} = await this.$axios.get(
          this.sectionData.image_document_link
        );

        const startFrame = res.ip;
        const endFrame = res.op;

        if ((startFrame || startFrame === 0) && endFrame) {
          const target = wrapper.querySelector("#appSectionLottie");
          const animation = this.$lottie.loadAnimation({
            container: target,
            renderer: "svg",
            loop: false,
            autoplay: false,
            path: this.sectionData.image_document_link,
          });

          ScrollTrigger.create({
            trigger: wrapper.querySelector(`${this.$detectMobile() ? ".mobile-lottie" : ".activtiy-section"}`),
            start: "20% bottom",
            onEnter: () => {
              animation.playSegments(
                [
                  [startFrame, endFrame],
                  [endFrame - 20, endFrame]
                ],
                true
              );
              animation.loop = true;
            },
          });
        }
      } catch (err) {
        console.log({err});
      }
    },
    addEvent(type) {
      this.$repositories.installAppEvent(type)
    }
  },
};
</script>

<style lang="scss" scoped>
@import './MobileAppSection.scss';
</style>
