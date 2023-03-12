<template>
  <section id="appSection" class="plan-your-visit-section">
    <div class="activtiy-section">
      <div class="activtiy-section-part-wrapper order-1 px-5 md:px-0 md:order-2">
        <div class="content-container">
          <div class="mb-4">
            <!--TODO: Get back here and remove this customization-->
            <h2
              class="activtiy-section-title"
              v-html="$globalData.isMobileDevice?sectionData.title:$splitTextToLines(sectionData.title)"
            />
            <h3 class="activtiy-section-sub-title sub-title-animation">
              {{ sectionData.subtitle }}
            </h3>
            <p class="activtiy-section-paragraph description-animation">
              {{ sectionData.description }}
            </p>
          </div>

          <div v-if="sectionData.benefits" class="mb-8 description-animation">
            <AppFeatures list-format="column" :app-features="sectionData.benefits" />
          </div>

          <div v-if="sectionData.cta" class="btn-animation">
            <BaseButton
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
        class="activtiy-section-part-wrapper flex justify-center ltr:pl-4 rtl:pr-4 ltr:pr-8 rtl:pl-8 md:p-0 py-8 md:py-0 order-2 md:order-1"
      >
        <img
          v-if="sectionData.image"
          :src="sectionData.image.image_url"
          :alt="sectionData.image.alt_text"
          :title="sectionData.image.title"
          loading="lazy"
          class="w-fit h-auto mobiles:max-h-full md:h-fit activity-image"
        >
      </div>
    </div>
  </section>
</template>

<script>
import AppFeatures from "@/components/HomePage/MobileAppSection/AppFeatures.vue";
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
      default: () => ({})
    },
  },
  mounted() {
    this.animateAppSection();
  },
  beforeDestroy() {
    if (ScrollTrigger) ScrollTrigger.getById("contentContainerTrigger")?.kill(true);
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
          id: "contentContainerTrigger",
          trigger: contentContainer,
          animation: tl,
          start: `top ${this.$detectMobile() ? "90%" : "70%"}`,
          toggleActions: "play none none reverse",
        });
      }
    },
    titleAnimationHandler(title, dur, del = 0) {
      if (title) {
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
      }
    },
    revealElementUpAnimeHandler(elem, dur, del) {
      if (elem)
        return gsap
          .from(elem, {
            autoAlpha: 0,
            transitionTimingFunction: (0.33, 0.0, 0.0, 1.0),
          })
          .duration(dur)
          .delay(del);
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
@import './PlanYourVisit.scss';
</style>
