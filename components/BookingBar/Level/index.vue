<template>
  <div id="level-bar" class="level-bar-wrapper">
    <ul class="level-list">
      <li
        v-for="level in data"
        :key="level.key"
        class="level-item"
        :class="{ active: level.key === selectedLevel.id }"
        @click="emitLevel(level)"
      >
        <div class="level-details-container">
          <span class="level-type">{{ level.Value }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import gsap from "gsap";
import BezierEasing from "bezier-easing";

export default {
  name: "LevelBar",
  props: {
    isDDLEnabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: 1,
    },
    selectedLevel: {
      type: Object,
      default: () => {
      },
    },
    data: {
      type: Array,
      default: () => [],
    },    
  },
  watch: {
    isDDLEnabled() {
      this.experienceCardAnimeHandler();
    },
  },
  methods: {
    experienceCardAnimeHandler() {
      const experienceCardWrapper =
        document.querySelector(".level-bar-wrapper");
      const experienceList = gsap.utils.toArray(
        experienceCardWrapper.querySelectorAll(".level-list li")
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
    emitLevel(level) {
      this.$emit("emitLevel", level);
    },
  },
};
</script>

<style scoped lang="scss">
@import "level";
</style>
