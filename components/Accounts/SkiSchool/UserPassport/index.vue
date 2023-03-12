<!---TODO: Modify this component when we have time-->
<template>
  <div class="user-passport-container">
    <div
      class="flex flex-wrap gap-x-10"
      :class="{'items-center': userLessonDetails.isCompletedLessonAssessments}"
    >
      <div class="flex-1">
        <div
          class="passport-details-container"
          :class="{'passport-badge-indicator': userLessonDetails.isJoinedPassport}"
        >
          <div class="card-header">
            <div class="title-wrapper">
              <h1 class="title">
                {{ $t(`ACCOUNT_PAGE.SKI_SCHOOL.${passportLocaleType}.TITLE`) }}
              </h1>

              <div
                v-if="userLessonDetails.userAK"
                class="qr-code-image"
                @click.prevent="isQRCodeModalActive = true"
              >
                <img
                  :src="require('@/assets/images/Accounts/QRCode.png')"
                  alt="qr code"
                  title="qr code"
                  width="26"
                  height="26"
                >
              </div>
            </div>

            <div class="description-wrapper">
              <p class="description">
                {{ cardGeneralData.description }}
              </p>
            </div>
          </div>

          <PassportBadge
            v-if="userLessonDetails.isJoinedPassport"
            :name="userLessonDetails.level.name"
            badge-container-classes="min-550:hidden ltr:pr-[9px] rtl:pl-[9px]"
            progress-wrapper-classes="w-[60px] mt-[6px]"
            badge-img-classes="w-[64.5px] h-[70.3px]"
            :show-badge-date="false"
            :progress-classes="calculatePercentage"
          />
        </div>

        <div
          v-if="
            !$isEmptyObject(userLessonDetails.nextLesson || {}) &&
              !userLessonDetails.isCompleted
          "
        >
          <div class="divider-dashed" />
          <div class="next-lesson-details-container">
            <div class="title">
              {{
                $t("ACCOUNT_PAGE.SKI_SCHOOL.LESSONS.NEXT_LESSON", {
                  lessonTitle: userLessonDetails.nextLesson.title
                })
              }}
            </div>
            <div class="date-time-container">
              <div class="date">
                {{
                  $dateFormatter(
                    userLessonDetails.nextLesson.time,
                    "dayMonthYear",
                    false,
                    "DD-MM-YYYY",
                    $i18n.localeProperties.detectedLang,
                    true
                  )
                }}
              </div>
              <div class="time-wrapper">
                <span class="time">{{
                  $dateFormatter(
                    userLessonDetails.nextLesson.time,
                    (formatType = "time"),
                    false
                  )
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PassportBadge
        v-if="userLessonDetails.isJoinedPassport && userLessonDetails.level.name"
        :name="userLessonDetails.level.name"
        badge-container-classes="pt-1 hidden min-550:flex ltr:pr-[18px] rtl:pl-[18px]"
        badge-img-classes="w-[129px] h-[140.5px]"
        :show-badge-date="false"
        :progress-classes="calculatePercentage"
      />
    </div>

    <BaseButton
      v-if="
        !userLessonDetails.isJoinedPassport &&
          $isEmptyObject(userLessonDetails.nextLesson || {})
      "
      btn-type="button"
      :text="isLevelHasFailure ? $t('ACCOUNT_PAGE.SKI_SCHOOL.REBOOK_LESSON') : $t('ACCOUNT_PAGE.SKI_SCHOOL.BOOK_LESSON')"
      @onBtnClick="$emit('bookLessonEmiter')"
    />

    <QRCodeModal
      :show-modal="isQRCodeModalActive"
      :modal-data="{
        passportNumber: cardGeneralData.passportType.toLowerCase() === 'ski' ? userLessonDetails.skiPassportID : userLessonDetails.snowPassportID,
        userFullName: userLessonDetails.fullName,
        passportType: passportLocaleType
      }"
      @closeModal="isQRCodeModalActive = false"
    />
  </div>
</template>

<script>
import PassportBadge from "@/components/Accounts/SkiSchool/PassportBadge";
import QRCodeModal from "./QRCodeModal";

export default {
  components: {
    PassportBadge,
    QRCodeModal
  },
  props: {
    cardGeneralData: {
      type: Object,
      default: () => ({})
    },
    userLessonDetails: {
      type: Object,
      default: () => ({})
    },
    passportLocaleType: {
      type: String,
      default: ""
    }
  },
  emits: ["bookLessonEmiter"],
  data() {
    return {
      isQRCodeModalActive: false
    };
  },
  computed: {
    isLevelHasFailure() {
      if (!this.userLessonDetails.details.user_levels) return false;
      let levelName = this.userLessonDetails.level.name;
      let levelID = 0; //discovery
      if (levelName === "beginner") levelID = 1;
      else if (levelName === "level1") levelID = 2;
      else if (levelName === "level2") levelID = 3;
      else if (levelName === "level3") levelID = 4;
      else if (levelName === "level4") levelID = 5;

      const exercises = (this.userLessonDetails.details.user_levels[levelID] || {}).questions;
      if ((exercises || []).length) {
        if (exercises[0] && !exercises[0].status) return false;

        for (let index = 0; index < exercises.length; index++) {
          if (exercises[index] && exercises[index].status !== 1) return true;
        }
      }

      return false;
    },
    calculatePercentage() {
      if (this.$isEmptyObject(this.userLessonDetails || {})) return 100 + "%";
      if (this.$isEmptyObject(this.userLessonDetails.details || {}))
        return 100 + "%";
      //
      let levelName = this.userLessonDetails.level.name || "";
      if (!levelName) return 100 + "%";
      //
      let levelID = 0;
      if (levelName == "discovery") levelID = 1;
      else if (levelName == "beginner") levelID = 2;
      else if (levelName == "level1") levelID = 3;
      else if (levelName == "level2") levelID = 4;
      else if (levelName == "level3") levelID = 5;
      else if (levelName == "level4") levelID = 6;
      //
      let levelIndex = levelID - 1;
      if (levelIndex < 0) levelIndex = 0;
      //
      const questions = (this.userLessonDetails.details.user_levels[levelIndex] || {}).questions;
      let counter = 0;

      if ((questions || []).length) {
        for (let index = 0; index < questions.length; index++) {
          if (questions[index].status == "1") counter++;
        }

        return Math.ceil((counter / questions.length) * 100) + "%";
      }

      return "0%";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./UserPassport.scss";
</style>
