<template>
  <SectionContentWrapper :section-wrapper-classes="['bg-[#FAFAFA] pt-10 pb-16 md:py-20 px-4',wrapperClasses]">
    <template #section-content>
      <h3 v-if="data.title" class="section-title" :class="sectionTitleClasses">
        {{ data.title }}
      </h3>
      <div class="mt-4" :class="descriptionWrapperClasses">
        <p
          v-if="data.description"
          class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-sm leading-6 text-[#606060]"
        >
          {{ data.description }}
        </p>
      </div>

      <div
        v-if="data.categories && data.categories.length"
        class="tabs-container"
      >
        <ul class="tabs-list" vue-dragscroll>
          <li
            v-for="category in data.categories"
            :key="category.id"
            class="tab"
            :class="{ active: selectedCategoryDetails.id === category.id }"
            @click.prevent="changeTab(category)"
          >
            {{ category.title }}
          </li>
        </ul>

        <div class="bottom-line" />
      </div>

      <div
        v-if="
          selectedCategoryDetails.instructor_cards &&
            selectedCategoryDetails.instructor_cards.length
        "
        class="instructor-cards-container"
      >
        <div class="instructor-cards-wrapper">
          <ProfileCard
            v-for="instructor in instructors"
            :key="instructor.id"
            :profile-data="instructor"
            @profile-clicked="onProfileClick(instructor)"
          />
        </div>

        <div
          v-if="selectedCategoryDetails.instructor_cards.length>4"
          class="flex justify-center mt-10"
        >
          <BaseButton
            btn-type="button"
            :text="selectedCategoryDetails.instructor_cards.length !== instructors.length
              ? (data.more_show_cta || {}).title || $t('OUR_INSTRUCTOR_PAGE.SHOW_ALL_INSTRUCTORS')
              : (data.less_show_cta|| {}).title || $t('OUR_INSTRUCTOR_PAGE.SHOW_LESS')
            "
            @onBtnClick="showAllInstructors"
          />
        </div>
      </div>
      <ProfileModal
        :show-modal="showModal"
        :profile-data="clickedProfileDetails"
        @close-modal="showModal = false"
      />
    </template>
  </SectionContentWrapper>
</template>

<script>
import SectionContentWrapper from "@/components/Shared/SectionContentWrapper";
import ProfileCard from "@/components/SkiSchoolComponent/ProfileCard";
import BaseButton from "@/components/Shared/BaseUI/BaseButton";
import ProfileModal from "@/components/SkiSchoolComponent/ProfileModal";

export default {
  name: "OurInstructor",
  components: {
    SectionContentWrapper,
    ProfileCard, 
    BaseButton,
    ProfileModal
  },
  props: {
    wrapperClasses: {
      type: String,
      default: () => ""
    },
    data: {type: Object, default: () => ({})},
    sectionTitleClasses: {
      type: String,
      default: () => ""
    },
    descriptionWrapperClasses: {
      type: String,
      default: () => "max-w-[872px]"
    },
  },
  data() {
    return {
      selectedCategoryDetails: {},
      clickedProfileDetails: {},
      showModal: false,
      instructors: [],
      showAll: false
    };
  },
  mounted() {
    if (this.data && this.data.categories && this.data.categories.length)
      this.selectedCategoryDetails = this.data.categories[0];

    if (this.selectedCategoryDetails.instructor_cards)
      this.instructors = this.selectedCategoryDetails.instructor_cards.slice(0, 4)
  },
  methods: {
    onProfileClick(instructor) {
      this.clickedProfileDetails = instructor;
      this.showModal = true;
    },
    showAllInstructors() {
      this.showAll = !this.showAll
      if (!this.showAll) {
        this.instructors = this.selectedCategoryDetails.instructor_cards.slice(0, 4)
      } else {
        this.instructors = this.selectedCategoryDetails.instructor_cards
      }
    },
    changeTab(tab) {
      this.selectedCategoryDetails = tab
      this.instructors = this.selectedCategoryDetails.instructor_cards.slice(0, 4)
    }
  }
};
</script>

<style lang="scss" scoped>
@import "our-instructor";
</style>
