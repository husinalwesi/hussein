<template>
  <div class="card-nav flex flex-wrap gap-x-6">
    <div class="md:min-w-[343px] hidden xl:block" :class="navClasses">
      <div
        v-for="(nav,navIndex) in tabs" :key="navIndex" class="card-navigator cursor-pointer"
        :class="{'active':selectedTab.id===nav.id}"
        @click="navClicked(nav)"
      >
        <div class="navigator-title">
          {{ nav.title }}
        </div>
        <arrow-svg
          :with-wrapper="true"
          :arrow-color="'black'"
          :direction="$i18n.localeProperties.detectedLang === 'en' ? 'right' : 'left'"
          :wrapper-class="`w-6 h-6 md:w-8 md:h-8 ${selectedTab.id===nav.id?'bg-[#FFFFFF]':'bg-[#0a14321a]'}`"
        />
      </div>
    </div>
    <div v-if="selectedTab&&selectedTab.lesson_details" class="hidden xl:block">
      <BlueCardContent :data="selectedTab" />
    </div>
    <div class="w-full block  xl:hidden">
      <BaseAccordion
        v-for="(nav, i) in tabs"
        :key="i"
        :show-expand="nav.isExpand"
        :body-class="''"
        class-name="mobile-navigator overflow-hidden pt-5"
        card-class="w-full items-center"
        :show-section="false"
        arrow-wrapper-color="bg-[#FAD903]"
        icon-color="bg-[#000000]"
        arrow-color="#000000"
        @accordion-expand="expandAccordion($event, nav)"
      >
        <div :class="{'active':nav.cardActive}">
          <div class="navigator-title">
            {{ nav.title }}
          </div>
        </div>
        <template #accordion-content>
          <BlueCardContent v-if="nav.isExpand" :data="nav" />
        </template>
      </BaseAccordion>
    </div>
  </div>
</template>

<script>
import BlueCardContent from "@/components/SkiSchoolComponent/BlueCard/BlueCardContent";
import BaseAccordion from "@/components/Shared/BaseUI/BaseAccordion/index.vue"

export default {
  components: {
    BlueCardContent,
    BaseAccordion
  },
  props: {
    navClasses: {
      default: 'flex-1 m',
      type: String
    },
    tabs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      navigatorLst: [
        {dscription: 'Discovery', cardActive: false, isExpand: false},
        {dscription: 'Beginner', cardActive: true, isExpand: false},
        {dscription: 'Intermediate - Level 1', cardActive: false, isExpand: false},
        {dscription: 'Intermediate - Level 2', cardActive: false, isExpand: false},
        {dscription: 'Advance - Level 3', cardActive: false, isExpand: false},
        {dscription: 'Advance - Level 4', cardActive: false, isExpand: false},
        {dscription: 'Advance - Freestyle', cardActive: false, isExpand: false},
        {dscription: 'Advance - Slalom', cardActive: false, isExpand: false},
        {dscription: 'Advance - Raceclub', cardActive: false, isExpand: false},
        {dscription: 'Advance - Ski Camps', cardActive: false, isExpand: false},
      ],
      selectedTab: {}
    }
  },
  watch: {
    tabs: function () {
      this.navClicked(this.tabs[0])
    }
  },
  mounted() {
    this.navClicked(this.tabs[0])
  },
  methods: {
    navClicked(nav) {
      this.navigatorLst.forEach(element => {
        element.cardActive = false;
      });
      nav.cardActive = !nav.cardActive;
      this.selectedTab = nav
    },
    fillCardData() {
      this.title = "begginer",
        this.subtitle = 'With a Beginners’ Lesson, you’ll learn the basics of skiing from the safety of the beginners’ slope. Our instructors will teach you how to turn on your skis or board and take you through how to slide and stop safely.'
    },
    expandAccordion(event, item) {
      item.isExpand = event;
    },
  }
}
</script>

<style scoped lang="scss">
@import "LessonGuid";
</style>
