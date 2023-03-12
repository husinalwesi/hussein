<template>
  <section class="hero-section">
    <!--// TODO: Remove this when the new transparent video is ready.-->
    <video
      v-if="isHeroSectionVideoVisible && data.background_video"
      id="heroSectionVideo"
      preload
      muted
      width="100%"
      height="100%"
      class="particles-video"
    >
      <source :src="data.background_video" type="video/mp4">
    </video>
    <!--TODO: Add the background video (Particles) when the design team provide us with.-->
    <div class="content-container">
      <!--TODO: Animate the title and subtitle when the design team provide us with a video of their animations.-->
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

      <div class="subtitle-wrapper">
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
          the business don't want us to track the browser resizing behaviour -->
      <img
        :src="getImageObject().image_url"
        :alt="getImageObject().alt_text"
        :title="getImageObject().title"
        width="888"
        height="550"
        class="ziplinner-img"
      >
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
      default: () => ({
        title: "Snow",
        title_highlighted_word: "Abu Dhabi",
        subtitle: "Go on an",
        subtitle_highlighted_word: "adventure!",
        image: {
          image_url: null,
          alt_text: "",
          title: "",
        },
      }),
    },
    scrollToContinueCta: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      heroSectionVideoTimout: null,
      bodyOverflowTimerout: null,
      isHeroSectionVideoVisible: true,
      isArabicLang: false
    };
  },
  mounted() {
    this.isArabicLang = this.$isArabic();

    window.addEventListener("resize", this.onResizeEvent);

    const heroSectionVideo = document.querySelector("#heroSectionVideo");
    if (heroSectionVideo) {
      this.heroSectionVideoTimout = setTimeout(() => {
        heroSectionVideo?.play();
      }, 1500);
      this.heroSectionVideoTimout = setTimeout(() => {
        this.isHeroSectionVideoVisible = false;
      }, 5000);
    }

    setTimeout(() => {
      this.$nextTick(() => {
        this.setHeights();
        this.initializeAnimation();
      });
    }, 500);
  },
  beforeDestroy() {
    if (this.heroSectionVideoTimout) clearTimeout(this.heroSectionVideoTimout);
    window.removeEventListener("resize", this.onResizeEvent);
  },
  methods: {
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
    },
    onResizeEvent() {
      this.setHeights();
    },
    setHeights() {
      let heroMainTitleTags = document.querySelectorAll("#hero-title span");
      let subHeroMainTitleTags = document.querySelectorAll("#hero-subtitle span");
      heroMainTitleTags.forEach((tag) => {
        tag.style.height = "auto";
      });
      subHeroMainTitleTags.forEach((tag) => {
        tag.style.height = "auto";
      });
      heroMainTitleTags.forEach((tag) => {
        tag.style.height = `${tag.offsetHeight + (this.isArabicLang && this.$globalData.isDesktopDevice ? 14 : 0)}px`;
      });
      subHeroMainTitleTags.forEach((tag) => {
        tag.style.height = `${tag.offsetHeight + (this.isArabicLang && this.$globalData.isDesktopDevice ? 15 : 0)}px`;
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./Hero.scss";
</style>
