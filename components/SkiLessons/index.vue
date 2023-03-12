<template>
  <main class="ski-lessons-main">
    <SectionContentWrapper
      section-wrapper-classes="h-fit min-700:h-[27rem]"
      section-content-classes="flex min-700:py-0 px-4 pb-[72px] pt-[128px]"
      :is-with-bg-image="true"
    >
      <template v-if="data" #section-content>
        <div
          class="text-container"
          :class="{ 'without-img': data.hero&&!data.hero.image }"
        >
          <h1 v-if="data.hero" class="title">
            {{ data.hero.title }}
          </h1>
          <div class="mt-4">
            <h2 class="sub-title">
              {{ data.hero.subtitle }}
            </h2>
          </div>
        </div>

        <div v-if="data.hero&&data.hero.image" class="image-wrapper">
          <img
            :src="data.hero.image.image_url"
            :alt="data.hero.image.alt_text"
            :title="data.hero.image.title"
            width="340"
            height="340"
          >
        </div>
      </template>
    </SectionContentWrapper>

    <SectionContentWrapper section-wrapper-classes="mt-[-44px]" section-content-classes="flex relative">
      <template #section-content>
        <ul v-if="$globalData.skiSchoolTabsLabel" class="tabs-list" vue-dragscroll>
          <li
            v-for="tab in tabs"
            :key="tab.id"
            class="tab"
            :class="{active: isActiveTab(tab)}"
            @click="onTabChange(tab)"
          >
            {{ $globalData.skiSchoolTabsLabel[tab.key] }}
          </li>
        </ul>
      </template>
    </SectionContentWrapper>

    <SectionContentWrapper
      v-if="data" section-wrapper-classes="overflow-hidden"
      section-content-classes="px-4 min-1176:px-0"
    >
      <template #section-content>
        <div class="flex flex-col w-full">
          <div class="mt-20 flex flex-col header-section mobiles:mt-12">
            <div class="flex flex-row mobiles:flex-col justify-between mb-4">
              <div class="w-1/2 mobiles:w-full mobiles:mb-4">
                <div class="title">
                  {{ data.title }}
                </div>
              </div>
              <div
                class="
                    w-1/3
                    mobiles:w-full
                    flex flex-col
                    mobiles:items-start
                    items-end
                  "
              >
                <div
                  class="
                      flex
                      text-black
                      gap-2
                      mobiles:grid mobiles:grid-cols-2
                      flex-row
                    "
                >
                  <BaseDP
                    :id="'discovery-dp'"
                    :class-name="'dp-container'"
                    :name="'discovery'"
                    :list-class="'out-parent'"
                    :dp-options="levels"
                    :item-value="selected.selectedLevel"
                    title-key="Value"
                    :selected-place-holder="$t('SKI_SCHOOL.LEVELS')"
                    :show-unit="false"
                    @item-selected="getLessonsType"
                  />
                  <BaseDP
                    :id="'guest-dp'"
                    :class-name="'dp-container'"
                    :name="'guest-dp'"
                    :list-class="'out-parent'"
                    :dp-options="ages"
                    :item-value="selected.selectedAge"
                    title-key="title"
                    :selected-place-holder="$t('SKI_SCHOOL.AGE')"
                    :show-unit="false"
                    @item-selected="ageChange"
                  />
                  <BaseDP
                    :id="'lessons-dp'"
                    :class-name="'dp-container'"
                    :name="'lessons-dp'"
                    :list-class="'out-parent'"
                    :dp-options="lessons"
                    :selected-place-holder="$t('SKI_SCHOOL.LESSONS')"
                    :item-value="selected.selectedLessons"
                    title-key="Value"
                    :show-unit="false"
                    @item-selected="lessonsTypeChange"
                  />
                </div>
              </div>
            </div>
            <div
              class="
                  flex flex-row
                  mobiles:flex-col
                  items-center
                  justify-between
                "
            >
              <div class="sub-title w-2/3 mobiles:w-full mobiles:mb-8">
                {{ data.subtitle }}
              </div>
              <div v-if="data&&data.check_skill_level_popup" class="mobiles:w-full">
                <button
                  :id="skillLevelId + 'check-skill-level'"
                  type="button"
                  class="
                      level-btn
                      items-center
                      w-[9.125rem]
                      justify-center
                      text-center
                      rounded-lg
                      uppercase
                      text-white
                      h-8
                      mobiles:h-10 mobiles:w-full
                    "
                  @click.prevent="modalHandler(false)"
                >
                  {{ $t('SKI_SCHOOL.CHECK_SKILL_LEVEL') }}
                </button>
              </div>
            </div>
          </div>

          <EmptyCard
            v-if="data.sections.length === 0"
            class="mt-[32px] mobiles:mt-[20px] pb-10"
            :data="data.empty_state"
          />
          <template v-else>
            <template v-if="!dataLoader">
              <div
                v-for="(section, index) in data.sections"
                :key="index"
                class="mt-12 package-container"
              >
                <template v-if="index === 1 && data.available_soon_section">
                  <div v-if="isAllLesson" class="pt-24 pb-24">
                    <EmptyPackage
                      :title="data.available_soon_section.title"
                      :cta-label="data.available_soon_section.subtitle_two"
                      :sub-title="data.available_soon_section.subtitle_one"
                    />
                  </div>
                </template>
                <template v-else>
                  <div class="package-title mb-6">
                    {{ section.title_one }}
                    <span class="ltr:ml-4 rtl:mr-4  status mobiles:ltr:ml-0 mobiles:rtl:mr-0">{{
                      section.title_two
                    }}</span>
                  </div>

                  <CardCarousel
                    v-if="$globalData.isMobileDevice"
                    classes="pb-5"
                    :is-lesson-card="true"
                    :cards="section.cards"
                    card-type="lessons"
                    :title="section.title_one"
                  />

                  <div
                    v-else
                    class="flex flex-row mobiles:flex-col gap-5 flex-wrap"
                  >
                    <PassesCard
                      v-for="(card, i) in section.cards"
                      :key="i"
                      :show-badge="card.label_text.length > 0"
                      :badge-label="card.label_text"
                      class="mb-12"
                      card-type="lessons"
                      :disabled="card.is_sold_out"
                      :cta-label="card.cta ? card.cta.title : ''"
                      :passes-data="card"
                    />
                  </div>
                </template>
              </div>
            </template>
            <template v-else>
              <snowflake-loader />
            </template>
          </template>
        </div>
      </template>
    </SectionContentWrapper>
    <template v-else>
      <snowflake-loader />
    </template>
    <template v-if="showModal">
      <SkillsQuestionsModal
        :show-modal="showModal"
        :qa-type="type"
        @close-modal="modalHandler(true)"
        @update-filter="updateFilter"
      />
    </template>
  </main>
</template>

<script>
import {lookups} from "@/const/enum";

import PassesCard from "@/components/PassesPackages/PassesCard";
import BaseDP from "@/components/Shared/BaseUI/BaseDP";
import EmptyPackage from "@/components/Shared/EmptyPackage";
import CardCarousel from "@/components/Shared/CardCarousel";
import SkillsQuestionsModal from "@/components/SkiSchoolComponent/SkillsQuestionsModal";
import EmptyCard from "@/components/Shared/EmptyCard";
import SectionContentWrapper from "@/components/Shared/SectionContentWrapper";

export default {
  name: "SkiLessons",
  components: {
    EmptyCard,
    CardCarousel,
    EmptyPackage,
    BaseDP,
    PassesCard,
    SkillsQuestionsModal,
    SectionContentWrapper
  },
  props: {
    type: {
      type: Number,
      default: () => 1,
    },
  },
  data() {
    return {
      showModal: false,
      skillLevelId: 1,
      selected: {
        levelType: 1,
        ageType: 0,
        lessonType: 0,
        item: {},
        selectedLevel: {},
        selectedAge: {},
        selectedLessons: {},
      },
      lessons: [],
      lookups,
      lessonsFilter: {
        SkiSchoolExperienceCategoryType: this.type,
        LevelType: 1,
        LessonType: 0,
        AgeType: 0,
        Lang: this.$i18n.localeProperties.detectedLang,
        TimeZone: "Asia/Dubai",
      },
      levelFilter: {
        LevelType: 0,
        Lang: this.$i18n.localeProperties.detectedLang,
        TimeZone: "Asia/Dubai",
      },
      data: null,
      levels: [],
      seo: null,
      tabs: [
        {
          id: 1,
          name: "Shine at Ski Academy",
          hero: {
            title: 'Shine at Ski Academy',
            subTitle: 'Bringing skiing and snowboarding to the middle of the desert',
            customClass: '-z-1 large'
          },
          url: '/ski-academy',
          key: 'shine_at_ski_school_tab_title'
        },
        {
          id: 2,
          name: "Ski lessons",
          hero: {
            title: 'Learn to Ski',
            subTitle: 'Bringing skiing and snowboarding to the middle of the desert',
            customClass: '-z-1 large'
          },
          url: '/ski-lessons',
          key: 'ski_lessons_tab_title'
        },
        {
          id: 3,
          name: "Snowboard lessons",
          hero: {
            title: 'Learn to snowboard',
            subTitle: 'Bringing skiing and snowboarding to the middle of the desert',
            customClass: '-z-1 large'
          },
          url: '/snowboard-lessons',
          key: 'snowboard_lessons_tab_title'
        },
      ],
      dataLoader: false,
      currentSiteTimezone: '',
      ages: []
    };
  },
  async fetch() {
    try {
      this.currentSiteTimezone = this.$getSiteConfig('timezone');
      this.lessonsFilter.TimeZone = this.currentSiteTimezone;
      this.levelFilter.TimeZone = this.currentSiteTimezone;

      this.dataLoader = true;
      if (!this.data)
        await this.init();

      let response = await this.$repositories.getLessons(this.lessonsFilter);
      if (response && response.experience_categorie) {
        this.data = response.experience_categorie;
        this.seo = response.experience_categorie.seo
        if (
          this.data &&
          this.data.available_soon_section &&
          this.data.sections.length > 0
        ) {
          this.data.sections.splice(1, 0, {});
        }
      }
      this.dataLoader = false
    } catch (e) {
      console.log(e);
    }
  },
  head() {
    return this.$seoGenerator(this.seo, "Ski Lessons");
  },
  computed: {
    isAllLesson() {
      return this.lessonsFilter.LessonType === 0;
    },
  },
  watch: {
    data() {
      if (this.data) {
        let tab = {
          title: this.type === 1 ? 'Ski Lessons' : 'SnowBoard Lessons',
          id: this.type === 1 ? '2' : '3'
        }
        this.$repositories.viewItemListEvent(tab, this.data.sections, 'ski')
        let query = `level=${this.lessonsFilter.LevelType}&lesson=${this.lessonsFilter.LessonType}&age=${this.lessonsFilter.AgeType}`;
        this.addQueryParams(query);

      }
    }
  },
  destroyed() {
    this.addQueryParams("");
  },
  methods: {
    modalHandler(isClose = false) {
      const body = document.querySelector("body");

      if (isClose) {
        body.style.overflow = "visible";
        this.showModal = false;
      } else {
        body.style.overflow = "hidden";
        this.showModal = true;
      }
    },
    updateFilter(skillLevel) {
      let level = this.levels.find((item) => item.key === Number(skillLevel.id));
      if (level) {
        this.selected.selectedLevel = level;
        this.selected.levelType = Number(level.key);
      }
      this.getLessonsType(this.selected.selectedLevel);
      this.modalHandler(true);
    },
    initFilter() {
      this.lessonsFilter = Object.assign({}, this.lessonsFilter, {
        SkiSchoolExperienceCategoryType: this.type,
        LevelType: this.selected.levelType,
        LessonType: this.selected.lessonType,
        AgeType: this.selected.ageType,
        Lang: this.$i18n.localeProperties.detectedLang,
        TimeZone: this.currentSiteTimezone,
      });
    },
    async getLevels(query) {
      this.levels = await this.$repositories.getSkiLevels();

      if (query.level) {
        let level = this.levels.find((item) => item.key === Number(query.level));
        if (level) {
          this.selected.selectedLevel = level;
          this.getLessonsType(level);
        }
        this.selected.levelType = Number(query.level);
      } else {
        this.selected.selectedLevel = this.levels[0];
        this.getLessonsType(this.selected.selectedLevel);
      }
    },
    async getLessonsType(event) {
      this.levelFilter.LevelType = event.key;
      this.lessonsFilter.LevelType = event.key;

      this.lessons = await this.$repositories.getLessonsByLevel(this.levelFilter);

      let query = this.$route.query;

      if (query.lesson) {
        let lesson = this.lessons.find(
          (item) => item.key === Number(query.lesson)
        );
        if (lesson) {
          this.selected.selectedLessons = lesson;
          this.lessonsFilter.LessonType = lesson.key;
        }
      }
      this.$fetch();
    },
    async lessonsTypeChange(event) {
      this.lessonsFilter.LessonType = event.key;
      this.$fetch();
    },
    ageChange(event) {
      this.selected.ageType = event.id;
      this.lessonsFilter.AgeType = event.id;
      this.$fetch();
    },
    addQueryParams(query) {
      if (query.length > 0) {
        let newurl =
          window.location.protocol +
          "//" +
          window.location.host +
          window.location.pathname +
          "?" +
          query;
        window.history.pushState({path: newurl}, "", newurl);
      }
    },
    isActiveTab(tab) {
      let currentPath = this.$route.path
      return this.localePath(tab.url.toString()) === this.localePath(currentPath.toString())
    },
    onTabChange(tab) {
      this.$router.push(this.localePath(tab.url))
    },
    async init() {
      this.ages = this.type === 1 ? lookups.SKI_AGE_TYPE(this.$i18n.localeProperties.detectedLang) : lookups.SNOW_BOARD_AGE_TYPE(this.$i18n.localeProperties.detectedLang);
      let query = this.$route.query;

      await this.getLevels(query);

      if (query.age) {
        this.selected.ageType = Number(query.age);
        let age = this.ages.find((item) => item.id === Number(query.age));
        if (age) this.selected.selectedAge = age;
      } else {
        this.selected.selectedAge = this.ages[0];
      }
      if (query.lesson) {
        this.selected.lessonType = Number(query.lesson);
        this.lessonsFilter.LessonType = Number(query.lesson);
      } else {
        this.selected.selectedLessons = {};
      }
      this.initFilter();
    }
  },
};
</script>

<style lang="scss">
@import "ski-lessons";
</style>
