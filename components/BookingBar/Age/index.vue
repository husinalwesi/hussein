<template>
  <div id="age-bar" class="age-bar-wrapper">
    <ul class="age-list">
      <li
        v-for="age in data"
        :key="age.id"
        class="age-item"
        :class="{ active: age.id === selectedAge.id }"
        @click="emitAge(age)"
      >
        <div class="age-details-container">
          <span class="age-type">{{ age.title }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import gsap from "gsap";
import BezierEasing from "bezier-easing";
import {lookups} from "@/const/enum";

export default {
  name: "AgeBar",
  props: {
    isDDLEnabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: 1,
    },
    selectedAge: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      data: [],
    };
  },
  watch: {
    isDDLEnabled() {
      this.experienceCardAnimeHandler();
    },
    type: function () {
      if (this.type === 1) {
        this.data = lookups.SKI_AGE_TYPE(this.$i18n.localeProperties.detectedLang);
      } else {
        this.data = lookups.SNOW_BOARD_AGE_TYPE(this.$i18n.localeProperties.detectedLang);
      }
    }
  },
  mounted() {
    if (this.type === 1) {
      this.data = lookups.SKI_AGE_TYPE(this.$i18n.localeProperties.detectedLang);
    } else {
      this.data = lookups.SNOW_BOARD_AGE_TYPE(this.$i18n.localeProperties.detectedLang);
    }
  },
  methods: {
    experienceCardAnimeHandler() {
      const experienceCardWrapper = document.querySelector(".age-bar-wrapper");
      const experienceList = gsap.utils.toArray(
        experienceCardWrapper.querySelectorAll(".age-list li")
      );

      experienceList.forEach((experience, index) => {
        gsap
          .fromTo(
            experience,
            {opacity: this.isDDLEnabled ? 0 : 1},
            {
              opacity: this.isDDLEnabled ? 1 : 0,
              ease:
                this.$globalData.isDesktopDevice || !this.isDDLEnabled
                  ? BezierEasing(0.33, 0.0, 0.0, 1.0)
                  : BezierEasing(0.4, 0.0, 0.1, 1.0),
              duration: this.$globalData.isDesktopDevice
                ? 0.67
                : this.isDDLEnabled
                  ? 0.8
                  : 0.77,
            }
          )
          .delay((index + 1) * 0.07);
      });
    },
    emitAge(age) {
      this.$emit("emitAge", age);
    },
  },
};
</script>

<style scoped lang="scss">
@import "age";
</style>
