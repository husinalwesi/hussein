<template>
  <div id="booking-bar-experience" class="booking-bar-experience-wrapper">
    <!-- {{selectedExperienceId}} -->
    <!-- {{ getExperienceList }} -->
    <!-- {{ data }} -->
    <ul class="experience-list">
      <li
        v-for="experience in getExperienceList"
        :key="experience.id"
        class="experience-item"
        :class="{ active: selectedExperienceId === experience.id }"
        @click="emitExperience(experience)"
      >
        <img
          :src="experience.img"
          :alt="experience.imgAlt"
          :title="experience.type"
          class="experience-img"
          width="48"
          height="48"
        >
        <div class="experience-details-container">
          <span class="experience-type">{{ experience.type }}</span>
          <span
            class="experience-description"
            :class="{
              'md:opacity-100': selectedExperienceId !== experience.id,
            }"
          >{{ experience.description }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import gsap from "gsap";
import BezierEasing from "bezier-easing";

export default {
  name: "Experience",
  props: {
    isDDLEnabled: {
      type: Boolean,
      default: false,
    },
    choosedExperienceId: {
      type: String,
      default: "-1",
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedExperienceId: "-1",
    };
  },
  computed: {
    getExperienceList() {
      return this.data.map((res) => {
        let title = res.title;
        const result = {
          id: res.id,
          type: title,
          description: res.booking_bar_subtitle,
          img: res.booking_bar_icon ? res.booking_bar_icon.image_url : '',
          imgAlt: res.booking_bar_icon ? res.booking_bar_icon.alt_text : '',
          localized_title: res.localized_title,
          route: res.url_key,
          ski_school_experience_category_type:
          res.ski_school_experience_category_type,
        };
        return result;
      });
    },
  },
  watch: {
    isDDLEnabled() {
      this.experienceCardAnimeHandler();
    },
    getExperienceList() {
      this.saveTempororyBarData();
    },
    $route: {
      handler() {
        this.saveTempororyBarData();
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(
      () => (this.selectedExperienceId = this.choosedExperienceId)
    );
  },
  methods: {
    saveTempororyBarData() {
      let currentPath = window.location.pathname;
      if (currentPath.indexOf("/passes-packages/") !== -1) {
        let currentPathWithoutPreLink = currentPath.replace(
          "/passes-packages/",
          ""
        );
        if (currentPathWithoutPreLink == "explore") {
          this.$store.commit("bookingBar/setTempExpercienceData", {
            title: "",
            value: "",
            route: "",
            id: "",
            localized_title: null
          });
          //
          return false;
        }
        for (let index = 0; index < this.getExperienceList.length; index++) {
          if (
            this.getExperienceList[index].route == currentPathWithoutPreLink
          ) {
            this.$store.commit("bookingBar/setTempExpercienceData", {
              title: this.getExperienceList[index].type,
              value: "slopeAccess",
              route: this.getExperienceList[index].route,
              id: this.getExperienceList[index].id,
              localized_title: this.getExperienceList[index].localized_title,
            });
            break;
          }
        }
      }
    },
    experienceCardAnimeHandler() {
      const experienceCardWrapper = document.querySelector(
        ".booking-bar-experience-wrapper"
      );
      const experienceList = gsap.utils.toArray(
        experienceCardWrapper.querySelectorAll(".experience-list li")
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
    emitExperience(exp) {
      this.selectedExperienceId = exp.id;
      this.$emit("emitExperience", {
        title: exp.type,
        value: "slopeAccess",
        route: exp.route,
        id: exp.id,
        localized_title: exp.localized_title,
        ski_school_experience_category_type:
        exp.ski_school_experience_category_type,
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./Experience.scss";
</style>
