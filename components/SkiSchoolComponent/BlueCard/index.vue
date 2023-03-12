<template>
  <SectionContentWrapper
    section-wrapper-classes="relative mt-[4.125rem] lg:mt-10"
    section-content-classes="mobiles:px-4 pb-0 px-[4rem]"
  >
    <template #section-content>
      <div class="blue-continer" />
      <div class="w-full relative main-container">
        <div class="flex gap-x-6">
          <div class="flex-1">
            <div class="title" v-html="data.title" />

            <div class="relative lg:mt-8 mt-6">
              <div class="lessons-tabs-wrapper">
                <ul class="tabs-list" vue-dragscroll>
                  <li
                    v-for="schoolTab in data.help_box_categories"
                    :key="schoolTab.id"
                    class="tab"
                    :class="{
                      active: selectedTab.id === schoolTab.id,
                    }"
                    @click="onTabChange(schoolTab)"
                  >
                    {{ schoolTab.title }}
                  </li>
                </ul>
                <div class="tab-border" />
              </div>
            </div>
            <div class="description">
              {{ selectedTab.description }}
            </div>
          </div>
          <div
            v-if="data.icon"
            class="w-fit h-fit hidden min-900:block lg:mt-[-88px] lg:ltr:mr-[-32px] lg:rtl:ml-[-32px]"
          >
            <img
              :src="data.icon.image_url"
              :alt="data.icon.alt_text"
              :title="data.icon.title"
              class="passport-img"
            >
          </div>
        </div>
        <div
          class="
            ltr:font-inter-bold rtl:font-noto-sans-arabic-bold
            text-[1.25rem]
            mt-12
            mobiles:text-[1.5rem]
            flex
            justify-between
          "
        >
          {{ selectedTab.lesson_title }}
          <template
            v-if="
              selectedTab.check_skill_level_popup &&
                selectedTab.check_skill_level_popup.question_sections &&
                selectedTab.check_skill_level_popup.question_sections.length
            "
          >
            <BaseButton
              class-name="body-btn lg:block hidden"
              :text="$t('SKI_SCHOOL.CHECK_SKILL_LEVEL')"
              btn-type="button"
              @onBtnClick="modalHandler"
            />
          </template>
        </div>
        <div
          v-if="selectedTab.lessons && selectedTab.lessons.length > 0"
          class="nav-body"
        >
          <LessonGuid :tabs="selectedTab.lessons" />
        </div>
      </div>

      <template v-if="showModal">
        <SkillsQuestionsModal
          :show-modal="showModal"
          :prepared-data="selectedTab.check_skill_level_popup"
          :is-a-p-i-call="false"
          @close-modal="modalHandler(true)"
          @update-filter="updateFilter"
        />
      </template>
    </template>
  </SectionContentWrapper>
</template>

<script>
import LessonGuid from "@/components/SkiSchoolComponent/LessonGuid";
import SkillsQuestionsModal from "@/components/SkiSchoolComponent/SkillsQuestionsModal";
import BaseButton from "@/components/Shared/BaseUI/BaseButton";
import SectionContentWrapper from "@/components/Shared/SectionContentWrapper";

export default {
  name: "SkiLessons",
  components: {
    LessonGuid,
    SkillsQuestionsModal,
    BaseButton,
    SectionContentWrapper
  },
  props: {
    data: {
      type: Object,
      default: () => {
      },
    },
  },
  emits: ["blueTabClicked"],
  data() {
    return {
      activeSchoolTabId: 1,
      schoolTabs: [
        {id: 1, name: "ski"},
        {id: 2, name: "snowboard"},
      ],
      selectedTab: {},
      showModal: false,
    };
  },
  mounted() {
    if (this.data.help_box_categories.length > 0)
      this.selectedTab = this.data.help_box_categories[0];
  },
  methods: {
    updateFilter(skillLevel) {
      this.modalHandler(true);
      this.$router.push(this.localePath(`/${this.selectedTab.category_type === 1 ? 'ski-lessons' : 'snowboard-lessons'}?level=${skillLevel.id}&lesson=0&age=0`));
    },
    onTabChange(tab) {
      this.selectedTab = tab;
      this.$emit("blueTabClicked", tab);
    },
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
  },
};
</script>
<style scoped lang="scss">
@import "./BlueCard.scss";
</style>
