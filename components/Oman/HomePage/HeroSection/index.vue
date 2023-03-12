<template>
  <section class="hero-section">
    <div class="hero-content-container">
      <div v-if="!$isEmptyObject(data)" class="text-container">
        <h1
          id="hero-title"
          class="title"
          v-html="
            $splitHighlightedText(
              data.title,
              data.title_highlighted_word,
              false
            )
          "
        />
        <div
          v-if="data.subtitle || data.subtitle_highlighted_word"
          class="subtitle-wrapper"
        >
          <h2
            id="hero-subtitle"
            class="subtitle"
            v-html="
              $splitHighlightedText(
                data.subtitle,
                data.subtitle_highlighted_word,
                true
              )
            "
          />
        </div>
      </div>

      <div v-if="data.image && data.image.image_url" class="image-wrapper">
        <!--//TODO: Save the value of the image object inside an image var in case
          the business don't want us to track the resizing behaviour -->
        <img
          :src="getImageObject().image_url"
          :alt="getImageObject().alt_text"
          :title="getImageObject().title"
          width="738"
          height="407"
        >
      </div>
    </div>

    <div
      v-if="scrollToContinueCta && scrollToContinueCta.title"
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
  </section>
</template>

<script>
import gsap from "gsap";
import BezierEasing from "bezier-easing";

export default {
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
      isArabicLang: false
    }
  },
  mounted() {
    this.isArabicLang = this.$isArabic();
    window.addEventListener("resize", this.onResizeEvent);
    setTimeout(() => {
      this.$nextTick(() => {
        this.setHeights();
        this.initializeAnimation();
      });
    }, 500);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResizeEvent);
  },
  methods: {
    onResizeEvent() {
      this.setHeights();
    },
    setHeights() {
      let heroMainTitleTags = document.querySelectorAll(
        "#hero-subtitle span,#hero-title span"
      );
      heroMainTitleTags.forEach((tag) => {
        tag.style.height = "auto";
      });
      heroMainTitleTags.forEach((tag) => {
        tag.style.height = `${tag.offsetHeight + (this.isArabicLang && this.$globalData.isDesktopDevice ? 25 : 0)}px`;
      });
    },
    initializeAnimation() {
      this.animateMainTitle();
      this.animateSubTitle();
      this.animateHeroImage();
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
              overflow: "visible",
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

          gsap.to(item,{overflow: "visible"}).delay(this.$globalData.isDesktopDevice ? 0.7 : 0.5);
      });
    },
    animateSubTitle() {
      const sections = gsap.utils.toArray("#hero-subtitle span");
      const isDesktop = this.$globalData.isDesktopDevice;

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
              paddingTop: isDesktop ? "2.3px" : 0,
              rotation: 0,
              visibility: "visible",
              duration: 0.67,
              ease: isDesktop
                ? BezierEasing(0.4, 0, 0.1, 1)
                : BezierEasing(0.33, 0, 0, 1),
            }
          )
          .delay(0.3 * (i + 1));

        if (!isDesktop)
          gsap.to(item, {overflow: "visible"}).delay(2.3);
      });
    },
    animateHeroImage() {
      const heroSkierImage = document.querySelector(".image-wrapper img");
      if (!heroSkierImage) return false;
      gsap
        .fromTo(
          heroSkierImage,
          {
            opacity: 0,
            translateX: this.$globalData.isDesktopDevice ? "-3.75rem" : "-6rem",
          },
          {
            opacity: 1,
            translateX: 0,
            duration: 1,
            ease: BezierEasing(0.33, 0, 0, 1),
          }
        )
        .delay(this.$globalData.isDesktopDevice ? 1.04 : 1.7);
    },
    getImageObject() {
      return this.$globalData.isMobileDevice && this.data.mobile_web_image
        ? this.data.mobile_web_image
        : this.data.image;
    },
    scrollToContinue() {
      const nextSection = document.querySelector(".second-section");

      if (nextSection) {
        nextSection.scrollIntoView({
          behavior: "smooth",
          inline: "end",
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./HeroSection.scss";
</style>
