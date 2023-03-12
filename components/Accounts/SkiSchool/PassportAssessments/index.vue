<!--TODO: add the exact semantic HTML items (h3, h4, ..etc)-->
<template>
  <div class="passport-assessments-container">
    <div class="title-wrapper">
      <h2 class="title">
        {{ title }}
      </h2>
    </div>

    <div
      v-if="selectedUserDetails.details.user_levels.length > 0"
      class="badges-container"
    >
      <VueSlickCarousel
        ref="cardsSlickCarousel"
        class="cards-carousel"
        v-bind="settings"
        :initial-slide="initialSlideIndex"
        @beforeChange="setNewCardIndex"
      >
        <PassportBadge
          v-for="(
            assessment, i
          ) in selectedUserDetails.details.user_levels.slice(0, 6)"
          :key="i"
          :name="getBadgeName(assessment.level_id)"
          :badge-img-classes="[
            assessment.level_id < selectedUserDetails.details.current_level
              ? ''
              : assessment.level_id ===
                selectedUserDetails.details.current_level
                ? 'lg:scale-[1.36] lg:-mt-4 lg:mb-4'
                : 'opacity-50',
            'min-w-[128.75px] min-h-[132px] lg:hover:cursor-pointer min-700:min-w-[95.31px] min-700:min-h-[97.71px]',
          ]"
          :progress-wrapper-classes="
            assessment.level_id <= selectedUserDetails.details.current_level
              ? ''
              : 'hidden'
          "
          :progress-classes="calculatePercentage(assessment)"
          :date="getDate(assessment.questions[assessment.questions.length - 1])"
          @onBadgeClick="getBadgeInfo(assessment)"
        />
      </VueSlickCarousel>
      <div class="carousel-custom-dots-wrapper">
        <div
          v-if="selectedUserDetails.details.user_levels.length > 1"
          class="custom-dots-container"
        >
          <div class="dots" :style="`transform:translateX(${transformX}px)`">
            <span
              v-for="cardIndex of selectedUserDetails.details.user_levels
                .length"
              :key="cardIndex"
              :class="{ active: cardIndex === biniftCardIndex }"
              @click="setActiveCardIndex(cardIndex)"
            />
          </div>
        </div>
      </div>
    </div>

    <template v-if="!selectedUserDetails.isCompletedLessonAssessments">
      <div class="px-[15px] min-700:px-0">
        <div class="divider-dashed passport-divider" />
      </div>

      <!--will show based on the selected badge-->
      <div class="selected-badge-container">
        <div class="skill-results-container">
          <div class="skill-results">
            <div class="flex justify-between items-center">
              <div class="skill-results-text">
                {{ $t("ACCOUNT_PAGE.SKI_SCHOOL.PASSPORT_ASSESSMENTS.SKILL_RESULTS_TEXT") }}
              </div>
              <template v-if="isLessonBookingBtnVisible">
                <BaseButton
                  :text="isLevelHasFailure ? $t('ACCOUNT_PAGE.SKI_SCHOOL.REBOOK_LESSON') : $t('ACCOUNT_PAGE.SKI_SCHOOL.BOOK_LESSON')"
                  btn-type="button"
                  :b-t-ndisabled="!(badge.exercises&&badge.exercises.length)"
                  @onBtnClick="
                    $emit('bookLessonEmiter', { level: badge.level })
                  "
                />
              </template>
            </div>

            <div v-if="getInstructorName(badge.level)" class="instructor-name">
              {{
                $t(
                  "ACCOUNT_PAGE.SKI_SCHOOL.PASSPORT_ASSESSMENTS.INSTRUCTOR_NAME", {
                    instructorName: getInstructorName(badge.level)
                  }
                )
              }}
            </div>
          </div>

          <div class="passed-indicator">
            {{ $t("ACCOUNT_PAGE.SKI_SCHOOL.STATUS_CHECKER.PASSED") }}
            <span class="number-of-passed-assessmentes">{{
              `${numberOfPassesAssesments(badge.level)}/${
                badge.exercises.length
              }`
            }}</span>
          </div>
        </div>

        <!--TODO: get this list from the selected badge-->
        <ul v-if="badge.exercises&&badge.exercises.length" class="exercises-list">
          <li v-for="(ex, i) in badge.exercises" :key="i" class="exercise-item">
            <div class="flex justify-between gap-[22px] flex-wrap">
              <div class="flex items-center gap-x-3 min-700:gap-x-8">
                <div class="item-number">
                  {{ i + 1 }}
                </div>
                <div class="item-title">
                  {{ ex.title }}
                </div>
              </div>

              <status-checker :status="getStatus(ex.status)" />
            </div>

            <div
              v-if="i !== badge.exercises.length - 1"
              class="divider-dashed"
            />
          </li>
        </ul>
        <template v-else>
          <NoDataFound
            :no-data-text="$t('ACCOUNT_PAGE.SKI_SCHOOL.PASSPORT_ASSESSMENTS.NO_ASSESSMENTS_FOUND')"
            container-classes="my-8"
            @fetchData="$emit('fetchData')"
          />
        </template>

        <div v-if="isLessonBookingBtnVisible" class="book-lesson-btn-wrapper">
          <BaseButton
            :text="isLevelHasFailure ? $t('ACCOUNT_PAGE.SKI_SCHOOL.REBOOK_LESSON') : $t('ACCOUNT_PAGE.SKI_SCHOOL.BOOK_LESSON')"
            btn-type="button"
            :b-t-ndisabled="!(badge.exercises&&badge.exercises.length)"
            @onBtnClick="$emit('bookLessonEmiter', { level: badge.level })"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import PassportBadge from "@/components/Accounts/SkiSchool/PassportBadge";
import StatusChecker from "./StatusChecker.vue";
import NoDataFound from "@/components/Accounts/Shared/NoDataFound";

import VueSlickCarousel from "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.common";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.css";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-theme.css";

export default {
  components: { PassportBadge, StatusChecker, VueSlickCarousel, NoDataFound },
  props: {
    title: {
      type: String,
      default: () => ""
    },
    selectedUserDetails: {
      type: Object,
      default: () => ({})
    },
    isBookBtnEnabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['bookLessonEmiter', 'fetchData'],
  data() {
    const isArabicLocale = this.$i18n.localeProperties.detectedLang === 'ar';

    return {
      badge: {},
      settings: {
        infinite: false,
        rtl: isArabicLocale,
        arrows: false,
        dots: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1025,
            settings: {
              arrows: false,
              dots: false,
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true,
              centerPadding: "0px",
              rtl: isArabicLocale
            }
          }
        ]
      },
      biniftCardIndex: 1,
      transformX: 2,
      isRTL: isArabicLocale,
      initialSlideIndex: 0
    };
  },
  computed: {
    isLevelHasFailure() {
      if (!((this.badge || {}).exercises || []).length) return false;

      if (!this.badge.exercises[0].status) return false;

      for (let index = 0; index < this.badge.exercises.length; index++) {
        if (this.badge.exercises[index].status != 1) return true;
      }

      return false;
    },
    isLessonBookingBtnVisible() {
      if (this.isBookBtnEnabled) {
        const userCurrentLevel = this.selectedUserDetails.details.current_level;
        const badgeLevel = this.badge.level;

        return userCurrentLevel === badgeLevel || (userCurrentLevel === 0 && badgeLevel === 1)
      }

      return false;
    },
  },
  watch: {
    selectedUserDetails: {
      deep: true,
      immediate: true,
      handler() {
        const userCurrentLevel = +this.selectedUserDetails.details.current_level;
        const c_level = userCurrentLevel - 1 < 0 ? 0 : userCurrentLevel - 1;

        this.initialSlideIndex = c_level;
        this.setActiveCardIndex(userCurrentLevel, false); // Badge Inforrmation will be updated in this handler by default.
      }
    }
  },
  methods: {
    getDate(question = {}) {
      if (this.$isEmptyObject(question)) return "";
      //
      return question.completed_on || question.updated_at;
    },
    setActiveCardIndex(biniftCardIndex, isUpdateCarouselPointer = true) {
      this.biniftCardIndex = biniftCardIndex;

      let transformX = 2;

      if (biniftCardIndex > 2) {
        if (
          this.selectedUserDetails.details.user_levels.length ===
          biniftCardIndex
        )
          transformX = (biniftCardIndex - 4) * -10;
        else transformX = (biniftCardIndex - 3) * -10;

        if (this.isRTL) {
          if (transformX < 0) transformX *= -1;
          transformX += 9;
        } else transformX -= 9;
      }

      this.transformX = transformX;

      if (this.$refs.cardsSlickCarousel && isUpdateCarouselPointer)
        this.$refs.cardsSlickCarousel.goTo(biniftCardIndex - 1);

      const selectedBadge = this.selectedUserDetails.details.user_levels[biniftCardIndex-1];
      this.getBadgeInfo(selectedBadge);
    },
    setNewCardIndex(oldCardIndex, newCardIndex) {
      this.setActiveCardIndex(newCardIndex + 1);
    },
    getInstructorName(level) {
      level = level - 1;
      if (level < 0) level = 0;
      //
      let exercises =
        this.selectedUserDetails.details.user_levels[level].questions;

      let question = exercises[exercises.length - 1];
      if (this.$isEmptyObject(question || {})) return "";
      return exercises[exercises.length - 1].instructor_name || "";
    },
    numberOfPassesAssesments(level) {
      level = level - 1;
      if (level < 0) level = 0;
      //
      let exercises =
        this.selectedUserDetails.details.user_levels[level].questions;
      let counter = 0;
      for (let index = 0; index < exercises.length; index++) {
        if (exercises[index].status == "1") counter++;
      }
      return counter;
    },
    calculatePercentage(assessment) {
      if (this.$isEmptyObject(assessment || {})) return "100%";
      if (
        assessment.level_id === this.selectedUserDetails.details.current_level
      ) {
        return (
          Math.ceil(
            (this.numberOfPassesAssesments(assessment.level_id) /
              assessment.questions.length) *
              100
          ) + "%"
        );
      }
      return 100 + "%";
    },
    getStatus(status) {
      if (status == "1") return "passed";
      else if (status == "2") return "needMorePractice";
      else if (status == "3") return "notAssessed";
      else if (status == "null") return "notJoined";
    },
    getBadgeName(levelID) {
      levelID = levelID.toString();
      if (levelID == "1") return "discovery";
      else if (levelID == "2") return "beginner";
      else if (levelID == "3") return "level1";
      else if (levelID == "4") return "level2";
      else if (levelID == "5") return "level3";
      else if (levelID == "6") return "level4";
    },
    getBadgeInfo(event) {
      this.badge = {
        level: event.level_id,
        exercises: event.questions.map((res) => {
          const result = {
            title: res.description,
            status: res.status,
          };
          return result;
        })
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./PassportAssessments.scss";
</style>
