<template>
  <section id="thrillSection" class="thrill-section">
    <div class="flex items-center h-fit w-full 3xl:mx-auto max-w-screen-3xl">
      <div class="flex-1 rtl:scale-x-[-1]">
        <div
          ref="startExploringLottie"
          class="lottie-active"
          :class="{ 'lottie-inactive': currentEvent !== 'explore' }"
        />
      </div>
      <div class="event-type-part-container">
        <h2 v-if="sectionData.title" class="ltr:font-druk-heavy-italic rtl:font-adapter text-7xl uppercase px-2 overflow-hidden">
          {{ sectionData.title }}
        </h2>
        <span v-if="sectionData.subtitle" class="ltr:font-inter-bold rtl:font-noto-sans-arabic-bold text-xs mt-2">{{ sectionData.subtitle }}</span>

        <div class="event-handler-wrapper">
          <div id="exploring" class="btn-toggle-container">
            <button
              type="button"
              class="btn-toggle"
              :class="{ 'not-active': currentEvent !== 'explore' }"
              @click="onEventClick('explore')"
            >
              {{ sectionData.left_button_text }}
            </button>
          </div>
          <div id="challenged" class="btn-toggle-container">
            <button
              type="button"
              class="btn-toggle"
              :class="{ 'not-active': currentEvent !== 'challenge' }"
              @click="onEventClick('challenge')"
            >
              {{ sectionData.right_button_text }}
            </button>
          </div>

          <div class="background-slider" />
        </div>
      </div>
      <div class="flex-1 rtl:scale-x-[-1]">
        <div
          ref="beChallengedLottie"
          class="lottie-active"
          :class="{ 'lottie-inactive': currentEvent !== 'challenge' }"
        />
      </div>
    </div>
  </section>
</template>
<script>
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {SplitText} from "@/assets/js/SplitText.js";

export default {
  props: {
    currentEvent: {
      required: true,
      type: String,
    },
    sectionData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      exploreLottie: null,
      beChallengedLottie: null,
    };
  },
  mounted() {
    this.initLotties();

    if (this.currentEvent === "explore") {
      gsap.set(".background-slider", {
        clipPath: "polygon(100% 0, 100% 0, 95% 100%, 0 100%, 0 0)",
        right: "50%",
        left: 4,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
      });
    } else {
      gsap.set(".background-slider", {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%, 5% 0)",
        left: "53%",
        right: 4,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      });
    }

    this.animateThrillSection();
  },
  methods: {
    initLotties() {
      if (this.sectionData.left_image_document) {
        this.exploreLottie = this.$lottie.loadAnimation({
          container: this.$refs.startExploringLottie,
          loop: false,
          autoplay: false,
          path: this.sectionData.left_image_document,
        });
        this.exploreLottie.setSpeed(1.3);
      }
      if (this.sectionData.right_image_document) {
        this.beChallengedLottie = this.$lottie.loadAnimation({
          container: this.$refs.beChallengedLottie,
          loop: false,
          autoplay: false,
          path: this.sectionData.right_image_document,
        });
        this.beChallengedLottie.setSpeed(1.3);
      }
    },
    animateThrillSection() {
      gsap.registerPlugin(ScrollTrigger);

      const sectionTitle = document.querySelector(
        ".event-type-part-container h2"
      );

      let titleAnimation = null;
      let selectionTextAnime = null;

      if (sectionTitle) {
        sectionTitle.split = new SplitText(sectionTitle, {
          type: "words",
        });

        titleAnimation = gsap
          .from(sectionTitle.split.words, {
            duration: 0.67,
            transitionTimingFunction: (0.33, 0.0, 0.0, 1.0),
            y: 150,
            stagger: 0.06,
          })
          .delay(0.03);
      }

      if (this.sectionData.subtitle) {
        selectionTextAnime = gsap.from(".event-type-part-container span", {
          opacity: 0,
          ease: "Linear.ease",
          duration: 2,
        });
      }

      const eventHandlerWrapperAnime = gsap
        .fromTo(
          ".event-handler-wrapper",
          {
            autoAlpha: 0,
            translateY: 100,
          },
          {
            autoAlpha: 1,
            translateY: 0,
          }
        )
        .duration(1.33);

      const tl = gsap.timeline();
      if (titleAnimation) tl.add(titleAnimation);
      if (selectionTextAnime) tl.add(selectionTextAnime, "<");
      tl.add(eventHandlerWrapperAnime, "<");

      ScrollTrigger.create({
        trigger: ".event-type-part-container",
        toggleActions: "play none none reset",
        animation: tl,
      });

      ScrollTrigger.create({
        trigger: document.querySelector("#thrillSection"),
        start: "30% bottom",
        onEnter: () => {
          if (this.currentEvent === "explore") this.exploreLottie?.play();
          else this.beChallengedLottie?.play();
        },
      });
    },
    handleExploreBtnAnimation() {
      gsap.to(".background-slider", {
        clipPath: "polygon(100% 0, 100% 0, 95% 100%, 0 100%, 5% 0)",
        right: 8,
        left: 37,
        borderRadius: 0,
      });
      gsap
        .to(".background-slider", {
          clipPath: "polygon(100% 0, 100% 0, 95% 100%, 0 100%, 0 0)",
          right: "50%",
          left: 4,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
        })
        .delay(0.2);
    },
    handleChallengeBtnAnimation() {
      gsap.to(".background-slider", {
        clipPath: "polygon(100% 0, 100% 0, 95% 100%, 0 100%, 5% 0)",
        left: 8,
        right: 37,
        borderRadius: 0,
      });
      gsap
        .to(".background-slider", {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%, 5% 0)",
          left: "53%",
          right: 4,
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        })
        .delay(0.2);
    },
    onEventClick(eventType) {
      if (this.currentEvent !== eventType) {
        if (eventType === "explore") {
          this.handleExploreBtnAnimation();

          this.beChallengedLottie?.setDirection(-1);
          this.exploreLottie?.setDirection(1);
          this.beChallengedLottie?.play();
          this.exploreLottie?.play();
        } else {
          this.handleChallengeBtnAnimation();

          this.beChallengedLottie?.setDirection(1);
          this.exploreLottie?.setDirection(-1);
          this.beChallengedLottie?.play();
          this.exploreLottie?.play();
        }

        this.$emit("changeActivityType", eventType);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "./ThrillSection.scss";
</style>
