<template>
  <section id="hero-section">
    <div v-if="!$isEmptyObject(data)" class="hero-section-container">
      <h1
        id="hero-title"
        v-html="
          $splitHighlightedText(
            data.title,
            data.title_highlighted_word,
            false
          )
        "
      />
      <CountDownChristmas
        v-if="data && data.countdown_event && isCountDownStarted" class="order-3 lg:order-2"
        :data="data.countdown_event"
      />
      <h2
        v-else
        id="hero-subtitle"
        v-html="
          $splitHighlightedText(
            data.subtitle,
            data.subtitle_highlighted_word,
            true
          )
        "
      />

      <div ref="gsSkierImageContainer" class="gs-skier-image-container">
        <img
          v-if="(data.image || data.mobile_web_image || {}).image_url"
          ref="gsSkierImage"
          :src="getHeroImageEntityValue('image_url')"
          :alt="getHeroImageEntityValue('alt_text')"
          :title="getHeroImageEntityValue('title')"
          class="gs-skier-image"
          :class="{isChristmasTheme: data.countdown_event && isCountDownStarted}"
        >
      </div>

      <div
        v-if="scrollToContinueCta && scrollToContinueCta.title"
        ref="scrollToContinue"
        class="scroll-to-continue"
        @click.prevent="scrollToContinue()"
      >
        <p class="scroll-text">
          {{ scrollToContinueCta.title }}
        </p>
        <div class="indicator">
          <div class="w-0.5 h-2 bg-white absolute top-0 ltr:left-0 rtl:right-0 z-[1]" />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import moment from "moment-timezone";
import gsap from "gsap";
import BezierEasing from "bezier-easing";
import CountDownChristmas from "@/components/Shared/CountDownChristmas";

export default {
  components: {
    CountDownChristmas
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    scrollToContinueCta: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      sectionOutAnimatorTimout: null,
      currentEnvTimezone: 'Asia/Dubai',
      isArabicLang: false
    };
  },
  computed: {
    isCountDownStarted() {
      return this.data && this.data.countdown_event && this.data.countdown_event.start_countdown ? moment().tz(this.currentEnvTimezone).isAfter(moment.utc(this.data.countdown_event.start_countdown).subtract({hours: 4}).tz(this.currentEnvTimezone).format()) : false;
    },
  },
  watch: {
    "$store.state.packageSelection.selection": function () {
      if (this.$route.fullPath === this.localePath("/"))
        this.animateSectionOut();
    },
  },
  mounted() {
    this.isArabicLang = this.$isArabic();
    this.currentEnvTimezone = this.$getSiteConfig('timezone');
    window.addEventListener("resize", this.onResizeEvent);
    setTimeout(() => {
      this.$nextTick(() => {
        this.setHeights();
        this.initializeAnimation();
      });
    }, 500);
  },
  beforeDestroy() {
    if (this.sectionOutAnimatorTimout)
      clearTimeout(this.sectionOutAnimatorTimout);
    window.removeEventListener("resize", this.onResizeEvent);
  },
  methods: {
    getHeroImageEntityValue(entityName) {
      return this.$globalData.isDesktopDevice
        ? (this.data.image || this.data.mobile_web_image)[entityName]
        : (this.data.mobile_web_image || this.data.image)[entityName];
    },
    animateSectionOut() {
      if (!this.$detectDesktop()) return false;
      let heroMainTitleTags = document.querySelectorAll("#hero-title > span");
      let heroSubTitleTags = document.querySelector("#hero-subtitle");
      let skierImage = document.querySelector(".gs-skier-image");

      if (heroMainTitleTags) {
        if (heroMainTitleTags[0])
          gsap.to(heroMainTitleTags[0], {
            y: "-10rem",
            opacity: 0,
            duration: 0.67,
            ease: BezierEasing(0.33, 0, 0, 1),
          });

        if (heroMainTitleTags[1])
          gsap
            .to(heroMainTitleTags[1], {
              y: "-10rem",
              opacity: 0,
              duration: 0.67,
              ease: BezierEasing(0.33, 0, 0, 1),
            })
            .delay(0.07);
      }

      if (heroSubTitleTags)
        gsap
          .to(heroSubTitleTags, {
            y: "-10rem",
            opacity: 0,
            duration: 0.67,
            ease: BezierEasing(0.33, 0, 0, 1),
          })
          .delay(0.14);

      if (skierImage)
        gsap
          .to(skierImage, {
            y: "-10rem",
            opacity: 0,
            duration: 0.67,
            ease: BezierEasing(0.33, 0, 0, 1),
          })
          .delay(0.21);

      this.sectionOutAnimatorTimout = setTimeout(() => {
        if (heroMainTitleTags) {
          if (heroMainTitleTags[0])
            gsap.set(heroMainTitleTags[0], {
              y: 0,
              opacity: 1,
            });

          if (heroMainTitleTags[1])
            gsap.set(heroMainTitleTags[1], {
              y: 0,
              opacity: 1,
            });
        }

        if (heroSubTitleTags)
          gsap.set(heroSubTitleTags, {
            y: 0,
            opacity: 1,
          });

        if (skierImage)
          gsap.set(skierImage, {
            y: 0,
            opacity: 1,
          });
      }, 1000);
    },
    onResizeEvent() {
      this.setHeights();
    },
    setHeights() {
      this.setImageContainerHeight();
      let heroMainTitleTags = document.querySelectorAll("#hero-title span");
      let subHeroMainTitleTags = document.querySelectorAll("#hero-subtitle span");
      heroMainTitleTags.forEach((tag) => {
        tag.style.height = "auto";
      });
      subHeroMainTitleTags.forEach((tag) => {
        tag.style.height = "auto";
      });
      heroMainTitleTags.forEach((tag) => {
        tag.style.height = `${tag.offsetHeight + (this.isArabicLang && this.$globalData.isDesktopDevice ? 65 : 12)}px`;
      });
      subHeroMainTitleTags.forEach((tag) => {
        tag.style.height = `${tag.offsetHeight + (this.isArabicLang && this.$globalData.isDesktopDevice ? 15 : 17)}px`;
      });
    },
    initializeAnimation() {
      this.animateMainTitle();
      this.animateSubTitle();
      this.animateSkierImage();
      this.animateScrollToContinue();
    },
    animateMainTitle() {
      const heroMainTitleTagsHighlitted = gsap.utils.toArray(
        "#hero-title span.highlighted"
      );

      const heroMainTitleTagsNotHighlitted = gsap.utils.toArray(
        "#hero-title span.not-highlighted"
      );

      heroMainTitleTagsNotHighlitted.forEach((item) => {
        let itemHeight = item.offsetHeight;
        gsap
          .fromTo(
            item,
            {
              height: 0,
              overflow: "hidden",
              rotation: this.$globalData.isDesktopDevice ? 3 : 2,
              paddingBottom: 0,
              visibility: "hidden",
            },
            {
              height: `${itemHeight}px`,
              rotation: 0,
              paddingBottom: "0.5rem",
              visibility: "visible",
              duration: 1.17,
              ease: BezierEasing(0.33, 0, 0, 1),
            }
          )
          .delay(this.$globalData.isDesktopDevice ? 0.07 : 0.07);
        gsap
          .fromTo(
            item,
            {
              marginTop: this.$globalData.isDesktopDevice ? "2rem" : "1.25rem",
            },
            {
              marginTop: 0,
              duration: 0.7,
            }
          )
          .delay(this.$globalData.isDesktopDevice ? 0.55 : 0.35);
      });

      heroMainTitleTagsHighlitted.forEach((item) => {
        let itemHeight = item.offsetHeight;
        gsap
          .fromTo(
            item,
            {
              height: 0,
              overflow: "hidden",
              rotation: this.$globalData.isDesktopDevice ? 3 : 2,
              paddingBottom: 0,
              visibility: "hidden",
            },
            {
              height: `${itemHeight}px`,
              rotation: 0,
              paddingBottom: "0.5rem",
              visibility: "visible",
              duration: 1.17,
              ease: BezierEasing(0.33, 0, 0, 1),
            }
          )
          .delay(this.$globalData.isDesktopDevice ? 0.14 : 0.14);

        gsap
          .fromTo(
            item,
            {
              marginTop: this.$globalData.isDesktopDevice ? "2rem" : "1.25rem",
            },
            {
              marginTop: 0,
              duration: 0.7,
            }
          )
          .delay(this.$globalData.isDesktopDevice ? 0.55 : 0.35);
      });
    },
    animateSubTitle() {
      const sections = gsap.utils.toArray("#hero-subtitle span");
      sections.forEach((item, i) => {
        let itemHeight = item.offsetHeight;
        gsap
          .fromTo(
            item,
            {
              height: 0,
              overflow: "hidden",
              rotation: 3,
              visibility: "hidden",
            },
            {
              height: `${itemHeight}px`,
              rotation: 0,
              visibility: "visible",
              duration: 0.67,
              ease: this.$globalData.isDesktopDevice
                ? BezierEasing(0.4, 0, 0.1, 1)
                : BezierEasing(0.33, 0, 0, 1),
            }
          )
          .delay(0.3 * (i + 1));
      });
    },
    animateSkierImage() {
      const heroSkierImage = this.$refs.gsSkierImage;
      if (heroSkierImage)
        if (this.$globalData.isDesktopDevice) {
          gsap
            .fromTo(
              heroSkierImage,
              {
                opacity: 0,
                paddingTop: "60px",
              },
              {
                opacity: 1,
                paddingTop: 0,
                duration: 1,
                ease: BezierEasing(0.33, 0, 0, 1),
              }
            )
            .delay(1.04);
        } else {
          gsap
            .fromTo(
              heroSkierImage,
              {
                opacity: 0,
                paddingTop: "6rem",
              },
              {
                opacity: 1,
                paddingTop: 0,
                duration: 1,
                ease: BezierEasing(0.33, 0, 0, 1),
              }
            )
            .delay(1.7);
        }
    },
    scrollToContinue() {
      let nextSection;
      if (this.$globalData.isDesktopDevice) {
        nextSection =
          document.querySelector("#hero-section").nextElementSibling;
      } else {
        nextSection = document.querySelector(".second-section");
      }
      if (nextSection) {
        nextSection.scrollIntoView({
          behavior: "smooth",
          inline: "end",
        });
      }
    },
    setImageContainerHeight() {
      if (!this.$refs.gsSkierImageContainer || !this.$refs.gsSkierImage) return false;
      if (!this.$refs.gsSkierImage.offsetHeight) return false;
      this.$refs.gsSkierImageContainer.style.height = `${this.$refs.gsSkierImage.offsetHeight}px`;
    },
    animateScrollToContinue() {
      let scrollToContinueEle = this.$refs.scrollToContinue;
      if (!scrollToContinueEle) return false;
      gsap
        .to(
          scrollToContinueEle,
          {
            opacity: 1,
            duration: 0.67,
            ease: BezierEasing(0.33, 0, 0, 1),
          })
        .delay(2.37);
    },
  },
};
</script>
<style lang="scss">
@import "./HeroSection.scss";
</style>
