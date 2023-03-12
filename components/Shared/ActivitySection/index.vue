<template>
  <section
    :id="`activitySection${sectionData.id}`"
    :key="sectionData.id + sectionData.order_number"
    class="activity-section-wrapper"
    :class="{ 'second-section': sectionIndex === 0 }"
  >
    <div class="activtiy-section">
      <div
        class="activtiy-section-part-wrapper px-5 md:px-0"
        :class="[
          sectionIndex % 2 !== 0
            ? 'md:order-2 md:ltr:pr-10 xl:ltr:pr-43 md:rtl:pl-10 xl:rtl:pl-43'
            : 'md:ltr:pl-10 xl:ltr:pl-43 md:rtl:pr-10 xl:rtl:pr-43',
        ]"
      >
        <div class="content-container">
          <div class="mb-8 md:mb-10">
            <h2
              class="activtiy-section-title"
              v-html="$splitTextToLines(sectionData.title)"
            />
            <h3
              class="activtiy-section-sub-title"
              v-html="$splitTextToLines(sectionData.subtitle)"
            />
            <p
              class="activtiy-section-paragraph"
              v-html="$splitTextToLines(sectionData.description)"
            />
          </div>

          <div
            v-if="sectionData.cta && sectionData.cta.title"
            class="base-button"
          >
            <BaseButton
              :cta="sectionData.cta"
              :text="sectionData.cta.title"
              :btn-type="
                sectionData.cta.url &&
                  (sectionData.cta.url.includes('https') ||
                    sectionData.cta.url.includes('http'))
                  ? 'externalLink'
                  : 'link'
              "
              :path="sectionData.cta.url"
            />
          </div>
        </div>
      </div>
      <div
        class="activtiy-section-part-wrapper"
        :class="{
          'md:order-1': sectionIndex % 2 === 0,
          'scale-x-[-1]': isArabicLocale ? sectionData.is_image_flip_ar : sectionData.is_image_flip_en
        }"
      >
        <nuxt-img
          v-if="$globalData.isMobileDevice&& (sectionData.mobile_web_image || sectionData.image || {}).image_url"
          :src="(sectionData.mobile_web_image || sectionData.image).image_url"
          :alt="(sectionData.mobile_web_image || sectionData.image).alt_text"
          :title="(sectionData.mobile_web_image || sectionData.image).title"
          loading="lazy"
          class="w-full h-auto max-h-full activity-image"
        />
        <div
          v-else
          class="w-full h-auto max-h-full"
          :class="[
            sectionIndex % 2 === 0 ? 'md:flex md:ltr:justify-end' : '',
            sectionIndex % 2 === 0 ? 'md:rtl:justify-end' : 'md:rtl:justify-start'
          ]"
        >
          <template v-if="sectionData.hevc_video_link || sectionData.webm_video_link">
            <client-only>
              <video
                :id="`lottieActiity${sectionData.id}`"
                :preload="sectionIndex === 0 ? true : 'none'"
                muted="muted"
                width="100%"
                height="100%"
                :loop="isVideoLooping"
                class="w-fit h-fit max-h-full"
                style="background: transparent;"
              >
                <source
                  :src="sectionData.hevc_video_link"
                  type="video/mp4; codecs=&quot;hvc1&quot;"
                >
                <source :src="sectionData.webm_video_link" type="video/webm">
                <!--TODO: change this to be the alt image of the video when added from the CMS-->
                <nuxt-img
                  v-if="(sectionData.mobile_web_image || sectionData.image || {}).image_url"
                  :src="(sectionData.image || sectionData.mobile_web_image).image_url"
                  :alt="(sectionData.image || sectionData.mobile_web_image).alt_text"
                  :title="(sectionData.image || sectionData.mobile_web_image).title"
                  loading="lazy"
                  class="w-fit h-fit max-h-full"
                />
              </video>
            </client-only>
          </template>
          <nuxt-img
            v-else-if="sectionData.image || sectionData.mobile_web_image"
            :src="(sectionData.image || sectionData.mobile_web_image).image_url"
            :alt="(sectionData.image || sectionData.mobile_web_image).alt_text"
            :title="(sectionData.image || sectionData.mobile_web_image).title"
            loading="lazy"
            class="w-fit h-fit max-h-full"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BaseButton from "@/components/Shared/BaseUI/BaseButton";

import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {SplitText} from "@/assets/js/SplitText.js";
import BezierEasing from "bezier-easing";

export default {
  components: {
    BaseButton
  },
  props: {
    sectionData: {
      type: Object,
      required: true,
    },
    sectionIndex: {type: Number, required: true},
    currentEvent: {
      type: String,
      default: "",
    },
    isVideoLooping: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isArabicLocale: this.$i18n.localeProperties.detectedLang === "ar"
    }
  },
  watch: {
    currentEvent() {
      this.$nextTick(() => this.animateActivitySection());
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.animateActivitySection();
    });
  },
  beforeDestroy() {
    if (ScrollTrigger) {
      ScrollTrigger.getById("activitySectionTrigger")?.kill(true);
      ScrollTrigger.getById("activitySectionImageDesktopTrigger")?.kill(true);
      ScrollTrigger.getById("activitySectionImageMobileTrigger")?.kill(true);
      ScrollTrigger.getById("activitySectionLottieTrigger")?.kill(true);
    }
  },
  methods: {
    animateActivitySection() {
      gsap.registerPlugin(ScrollTrigger);

      const activitySection = document.querySelector(
          `#activitySection${this.sectionData.id}`
      );

      if (activitySection) {
        const contentContainer =
            activitySection.querySelector(".content-container");

        const title = activitySection.querySelector("h2");
        const subTitle = activitySection.querySelector("h3");
        const paragraph = activitySection.querySelector("p");
        const button = activitySection.querySelector(".base-button");

        let titleAnimation = null;
        let subTitleAnime = null;
        let paragraphAnime = null;
        let buttonAnime = null;

        if (this.$detectMobile()) {
          titleAnimation = this.titleAnimationHandler(title, 0.67, 0);
          buttonAnime = this.revealElementUpAnimeHandler(button, 0.67, 0.17);
        } else {
          titleAnimation = this.titleAnimationHandler(title, 0.67, 0.03);
          buttonAnime = this.revealElementUpAnimeHandler(button, 0.67, 0.07);
        }

        subTitleAnime = this.revealElementUpAnimeHandler(subTitle, 0.67, 0.13);
        paragraphAnime = this.revealElementUpAnimeHandler(
            paragraph,
            0.67,
            0.07
        );

        const tl = gsap.timeline();
        if (titleAnimation) tl.add(titleAnimation);
        if (subTitleAnime) tl.add(subTitleAnime, "<");
        if (paragraphAnime) tl.add(paragraphAnime, "<");
        if (buttonAnime) tl.add(buttonAnime, "<");

        ScrollTrigger.create({
          id: "activitySectionTrigger",
          trigger: contentContainer,
          animation: tl,
          start: `top ${this.$detectMobile() ? "90%" : "75%"}`,
          toggleActions: "play none none reverse",
        });

        if (
            this.$detectMobile() &&
            (this.sectionData.mobile_web_image || this.sectionData.image || {}).image_url
        ) {
          const activitySectionImage = activitySection.querySelector(".activity-image");

          if (activitySectionImage)
            if (window.innerHeight > 700) {
              ScrollTrigger.create({
                id: "activitySectionImageDesktopTrigger",
                trigger: activitySectionImage,
                toggleClass: "active",
                start: "top 90%",
              });
            } else {
              const tl2 = gsap.timeline();
              tl2.add(
                gsap.to(activitySectionImage, {
                  opacity: 1,
                  transitionDelay: 0.17,
                  duration: 0.33,
                  ease: BezierEasing(0.4, 0, 0.05, 1),
                })
              );
              ScrollTrigger.create({
                id: "activitySectionImageMobileTrigger",
                trigger: activitySectionImage,
                animation: tl2,
              });
            }
        } else if (
            this.sectionData.hevc_video_link ||
            this.sectionData.webm_video_link
        ) {
          const lottieVideo = document.querySelector(`#lottieActiity${this.sectionData.id}`);
          const activitySectionInnerWrapper = activitySection.querySelector(".activtiy-section");

          if (lottieVideo && activitySectionInnerWrapper)
            ScrollTrigger.create({
              id: "activitySectionLottieTrigger",
              trigger: activitySectionInnerWrapper,
              start: "top center",
              onEnter: () => {
                if (lottieVideo.currentTime === 0) lottieVideo?.play();
              },
            });
        }
      }
    },
    titleAnimationHandler(title, dur, del = 0) {
      if (!title) return "";

      title.split = new SplitText(title, {
        type: "words",
      });

      return gsap
          .fromTo(title.split.words, {
                duration: dur,
                transitionTimingFunction: (0.33, 0.0, 0.0, 1.0),
                y: 200,
                stagger: 0.06,
              },
              {
                duration: dur,
                transitionTimingFunction: (0.33, 0.0, 0.0, 1.0),
                y: 0,
                stagger: 0.06
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
  },
};
</script>

<style scoped lang="scss">
@import "./ActivitySection.scss";
</style>
