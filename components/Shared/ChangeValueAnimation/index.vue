<template>
  <div
    :id="id"
    ref="mainText"
    :class="{
      'overflow-hidden':
        transition == 'wordByWordBTT' || transition == 'sentanceBTT',
    }"
  >
    <p
      class="opacity-0 original-text"
      v-html="
        transition == 'wordByWordBTT'
          ? $splitTextWBW(text)
          : text
      "
    />
    <p
      class="absolute animate inset-0"
      :class="[{ active: text1.class }, innerClass]"
      v-html="
        transition == 'wordByWordBTT'
          ? $splitTextWBW(text1.value)
          : text1.value
      "
    />
    <p
      class="absolute animate inset-0"
      :class="[{ active: text2.class }, innerClass]"
      v-html="
        transition == 'wordByWordBTT'
          ? $splitTextWBW(text2.value)
          : text2.value
      "
    />
  </div>
</template>
<script>
import gsap from "gsap";
import BezierEasing from "bezier-easing";
export default {
  name: "ChangeValueAnimation",
  props: [
    "text",
    "transition",
    "id",
    "signature",
    "y",
    "innerClass",
    "isCurrentStep",
    "delay",
    "isFirstVisit",
    "currentStep",
  ],
  data() {
    return {
      data: {},
      text1: {
        class: "",
        value: "",
      },
      text2: {
        class: "",
        value: "",
      },
      oldHeight: 0,
      isFirstTime: true,
    };
  },
  watch: {
    text() {
      this.changeText("change");
      this.$nextTick(() => {
        this.animateText();
      });
    },
    isCurrentStep() {
      if (
        (this.text1.class == "active" && this.text1.value == this.text) ||
        (this.text2.class == "active" && this.text2.value == this.text)
      ) {
        let p = this.$refs.mainText.querySelector("p.active");
        p.classList.remove('half-opacity');
        p.classList.remove('full-opacity');
        p.classList.add(this.isCurrentStep ? 'full-opacity' : 'half-opacity');
      }
    },
  },
  mounted() {
    this.changeText("initial");
    window.addEventListener("resize", this.onResizeEvent);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResizeEvent);
  },
  methods: {
    changeText(event) {
      if (!this.text1.class && !this.text2.class) {
        this.text1 = {
          value: this.text,
          class: "active",
        };
      } else {
        if (this.text1.class == "active") {
          this.text1.class = "";
          this.text2 = {
            value: this.text,
            class: "active",
          };
        } else {
          //text2
          this.text2.class = "";
          this.text1 = {
            value: this.text,
            class: "active",
          };
        }
      }

      if (event == "change") {
        this.calculateHeights();
        if (this.transition == "sentanceBTT") {
          let ps = this.$refs.mainText.querySelectorAll("p");
          ps[1].style.opacity = null;
          ps[2].style.opacity = null;
        }
      } else if (event == "initial") {
        if (
          this.transition == "sentanceBTT" &&
          this.currentStep != 1 &&
          !this.isCurrentStep &&
          (this.id == "date-text-booking-bar-mobile" ||
            this.id == "experience-text-booking-bar-mobile" ||
            this.id == "people-text-booking-bar-mobile")
        ) {
          let ps = this.$refs.mainText.querySelectorAll("p");
          ps[1].style.opacity = 0.4;
          ps[2].style.opacity = 0.4;
        }
      }
    },

    calculateHeights() {
      this.$emit("isCompleted", this.isFirstTime);
      setTimeout(() => {
        if (
          this.id == "main-passes-titlepasses-text-1" ||
          this.id == "main-passes-titlepasses-text-2" ||
          this.id == "main-passes-titlepasses-main-title"
        ) {
          let ele = document.querySelector(`#${this.id} .original-text`);
          if (!ele) return false;
          let oldHeight = ele.offsetHeight;
          if (this.id == "main-passes-titlepasses-main-title") {
            setTimeout(() => {
              if (!ele) return false;
              ele.style.height = "auto";
              let newHeight = ele.offsetHeight;
              if (this.isFirstTime) {
                ele.style.height = `${newHeight}px`;
                this.isFirstTime = false;
                return false;
              }
              gsap.fromTo(
                ele,
                {
                  height: `${oldHeight}px`,
                },
                {
                  height: newHeight,
                  overwrite: true,
                  duration: 0.933,
                  onComplete: () => {
                    this.$emit("isCompleted", true);
                  },
                }
              );
            }, 500);
          } else {
            ele.style.height = "auto";
            let newHeight = this.text ? `${ele.offsetHeight}px` : `0px`;
            gsap
              .fromTo(
                ele,
                {
                  height: `${oldHeight}px`,
                },
                {
                  height: newHeight,
                  overwrite: true,
                  duration: 0.5,
                  onComplete: () => {
                    this.$emit("isCompleted", true);
                  },
                }
              )
              .delay(0.1);
          }
        }
      });
    },
    animateText() {
      let ele = document.querySelectorAll(`#${this.id} .animate`);
      let oldTag = this.text1.class == "active" ? ele[1] : ele[0];
      let newTag = this.text1.class == "active" ? ele[0] : ele[1];
      if (this.transition == "rtl") this.animateRtl(oldTag, newTag);
      else if (this.transition == "signature")
        this.animateSignature(oldTag, newTag);
      else if (this.transition == "btt")
        this.animateBottomToTop(oldTag, newTag);
      else if (this.transition == "btt-across")
        this.animateBottomToTopAcross(oldTag, newTag);
      else if (this.transition == "wordByWordBTT")
        this.animateWordByWordBTT(oldTag, newTag);
      else if (this.transition == "sentanceBTT")
        this.animatesentanceBTT(oldTag, newTag);
      else if (this.transition == "signatureAcross")
        this.animateSignatureAcross(oldTag, newTag);
    },
    animatesentanceBTT(oldTag, newTag) {
      let eleMainText = document.querySelector(`#${this.id} .original-text`);
      if (!eleMainText) return false;
      let eleMainTextHeight = eleMainText.offsetHeight;

      let largeNumber =
        this.oldHeight > eleMainTextHeight ? this.oldHeight : eleMainTextHeight;
        // console.log();
      let specialCase =
        eleMainTextHeight > 32 || this.oldHeight != eleMainTextHeight;

      gsap
        .fromTo(
          oldTag,
          {
            y: 0,
          },
          {
            y: `${-largeNumber}px`,
            duration: 0.83,
            overwrite: true,
            onComplete: () => {
              oldTag.style.opacity = 0;
            },
          }
        )
        .delay(specialCase ? 0.13 : 0);

      gsap
        .fromTo(
          newTag,
          {
            opacity: this.isCurrentStep ? 1 : 0.4,
            y: `${largeNumber}px`,
          },
          {
            y: 0,
            duration: 0.83,
            overwrite: true,
          }
        )
        .delay(specialCase ? 0.13 : 0);
      setTimeout(() => {
        this.oldHeight = eleMainTextHeight;
      });
    },
    animateWordByWordBTT(oldTag, newTag) {
      setTimeout(() => {
        let oldTags = oldTag.querySelectorAll(`span`);
        let newTags = newTag.querySelectorAll(`span`);

        let eleMainText = document.querySelector(`#${this.id} .original-text`);
        if (!eleMainText) return false;
        let eleMainTextHeight = eleMainText.offsetHeight;

        let largeNumber =
          this.oldHeight > eleMainTextHeight
            ? this.oldHeight
            : eleMainTextHeight;
        let specialCase =
          eleMainTextHeight > 32 || this.oldHeight != eleMainTextHeight;
        let largeOffsetTop = 0;

        oldTags.forEach((oldTagItem, index) => {
          if (oldTagItem.offsetTop > largeOffsetTop)
            largeOffsetTop = oldTagItem.offsetTop;

          gsap
            .fromTo(
              oldTagItem,
              {
                y: 0,
              },
              {
                overwrite: true,
                y: `${-(largeNumber + oldTagItem.offsetTop)}px`,
                duration: 0.933,
                ease: BezierEasing(0.33, 0, 0, 1),
              }
            )
            .delay(specialCase ? (index + 1) * 0.166 : index * 0.166);
        });

        newTags.forEach((newTagItem, index) => {
          let delay = specialCase
            ? (index + 1) * oldTags.length * 0.166
            : index * 0.166;
          if (this.isFirstTime) delay = (index + 1) * 0.1;
          gsap
            .fromTo(
              newTagItem,
              {
                y: `${largeNumber}px`,
              },
              {
                overwrite: true,
                y: 0,
                duration: this.isFirstTime ? 0.67 : 0.933,
                ease: BezierEasing(0.33, 0, 0, 1),
              }
            )
            .delay(delay);
        });
        setTimeout(() => {
          this.oldHeight = eleMainTextHeight;
        });
      }, this.delay);
    },
    handleFlippingText() {
      // this used to hide corneres
      if (
        this.transition != "wordByWordBTT" ||
        this.transition != "sentanceBTT"
      )
        return false;
      let currentEle = this.$refs.mainText;

      setTimeout(
        () => {
          if (!currentEle.querySelector(".original-text")) return false;
          let currentEleHeight =
            currentEle.querySelector(".original-text").offsetHeight;

          let oldTags = currentEle.querySelectorAll(
            `.animate:not(.active) span`
          );

          oldTags.forEach((oldTagItem, index) => {
            oldTagItem.style.transform = `translateY(${currentEleHeight}px)`;
          });
        },
        this.id == "main-passes-titlepasses-main-title" ? 1000 : 0
      );
    },
    animateBottomToTop(oldTag, newTag) {
      setTimeout(() => {
        gsap.fromTo(
          oldTag,
          {
            y: 0,
            opacity: 1,
          },
          {
            overwrite: true,
            y: "-0.5rem",
            opacity: 0,
            duration: 0.4,
          }
        );

        gsap
          .fromTo(
            newTag,
            {
              y: this.isFirstTime ? "1rem" : "-0.5rem",
              opacity: 0,
            },
            {
              overwrite: true,
              y: 0,
              opacity: 1,
              duration: 0.4,
            }
          )
          .delay(0.4);
      }, this.delay);
    },
    animateBottomToTopAcross(oldTag, newTag) {
      let oldDelay = 0;
      let newDelay = 0.07;
      if (this.delay) {
        let tempDelay = parseFloat(this.delay);
        oldDelay += tempDelay;
        newDelay += tempDelay;
      }

      gsap
        .fromTo(
          oldTag,
          {
            y: 0,
            opacity: 1,
          },
          {
            y: "-0.5rem",
            opacity: 0,
            duration: 0.67,
          }
        )
        .delay(oldDelay);

      gsap
        .fromTo(
          newTag,
          {
            y: "0.5rem",
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.67,
          }
        )
        .delay(newDelay);
    },
    animateSignature(oldTag, newTag) {
      setTimeout(() => {
        gsap.fromTo(
          oldTag,
          {
            y: 0,
            opacity: 1,
          },
          {
            y: this.signature == "+" ? `-${this.y}` : `${this.y}`,
            opacity: 0,
            duration: 0.13,
          }
        );

        gsap
          .fromTo(
            newTag,
            {
              y: this.signature == "+" ? `${this.y}` : `-${this.y}`,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.13,
            }
          )
          .delay(0.13);
      });
    },
    animateSignatureAcross(oldTag, newTag) {
      setTimeout(() => {
        gsap.fromTo(
          oldTag,
          {
            y: 0,
            opacity: 1,
          },
          {
            y: this.signature == "+" ? `-${this.y}` : `${this.y}`,
            opacity: 0,
            duration: 0.33 / 2,
          }
        );

        gsap
          .fromTo(
            newTag,
            {
              y: this.signature == "+" ? `${this.y}` : `-${this.y}`,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.33 / 2,
            }
          )
          .delay(0.13);
      });
    },
    animateRtl(oldTag, newTag) {
      document.querySelector("#__layout").style.overflow = "hidden";
      gsap.fromTo(
        oldTag,
        {
          x: 0,
          opacity: 1,
        },
        {
          x: "-0.5rem",
          opacity: 0,
          duration: 0.266,
        }
      );

      gsap
        .fromTo(
          newTag,
          {
            x: "0.5rem",
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.3,
            onComplete: () => {
              document.querySelector("#__layout").style.overflow = null;
            },
          }
        )
        .delay(0.066);
    },
    onResizeEvent() {
      this.calculateHeights();
      setTimeout(() => {
        this.handleFlippingText();
      });
    },
  },
};
</script>
<style scoped lang="scss">
// @import "./ChangeValueAnimation.scss";
</style>
