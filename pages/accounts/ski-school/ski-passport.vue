<template>
  <div>
    <CardContainer wrapper-classes="p-0">
      <template #card-content>
        <div class="user-passport-box">
          <template v-if="errors.getUsers">
            <NoDataFound
              :no-data-text="$t('ACCOUNT_PAGE.SKI_SCHOOL.ERRORS_MESSAGES.GET_USERS')"
              :btn-text="$t('COMMON.TRY_AGAIN')"
              container-classes="my-8"
              @fetchData="getUsers"
            />
          </template>
          <template v-else>
            <UsersSelector
              v-if="!loaders.getUsers"
              :users-list="usersList"
              :selected-user-details="selectedUserDetails"
              :show-add-btn="false"
              @setSelectedUserDetails="toggleSelectedUser($event)"
            />

            <template v-if="errors.getLesson">
              <NoDataFound
                :no-data-text="$t('ACCOUNT_PAGE.SKI_SCHOOL.ERRORS_MESSAGES.GET_USER_PASSPORTS')"
                :btn-text="$t('COMMON.TRY_AGAIN')"
                container-classes="my-8"
                @fetchData="getUserNextLesson"
              />
            </template>
            <template v-else>
              <snowflake-loader
                v-if="loaders.getUsers || loaders.getLesson"
                loader-wrapper-classes="h-52 bg-[#ffffff6e] rounded-3xl"
              />
              <template v-else>
                <UserPassport
                  :user-lesson-details="selectedUserDetails"
                  :card-general-data="passportHeaderData"
                  passport-locale-type="SKI_PASSPORT"
                  @bookLessonEmiter="bookLessonEmitHandler"
                />
              </template>
            </template>
          </template>
        </div>
      </template>
    </CardContainer>

    <CardContainer
      container-classes="mt-8"
      wrapper-classes="py-[23px] min-700:p-[31px]"
    >
      <template #card-content>
        <template v-if="errors.getUserPassport">
          <NoDataFound
            :no-data-text="$t('ACCOUNT_PAGE.SKI_SCHOOL.ERRORS_MESSAGES.GET_USER_ASSESSMENTS')"
            :btn-text="$t('COMMON.TRY_AGAIN')"
            container-classes="my-8"
            @fetchData="getUserPassport"
          />
        </template>
        <template v-else>
          <snowflake-loader
            v-if="loaders.getUserPassport"
            loader-wrapper-classes="h-52 bg-[#ffffff6e] rounded-3xl"
          />
          <template
            v-else-if="
              selectedUserDetails.details &&
                selectedUserDetails.details.user_levels &&
                selectedUserDetails.details.user_levels.length
            "
          >
            <PassportAssessments
              :title="$t('ACCOUNT_PAGE.SKI_SCHOOL.PASSPORT_ASSESSMENTS.SKI_SCHOOL')"
              :selected-user-details="selectedUserDetails"
              :is-book-btn-enabled="loaders.getLesson ? true : $isEmptyObject(selectedUserDetails.nextLesson || {})"
              @bookLessonEmiter="bookLessonEmitHandler"
              @fetchData="getUserPassport"
            />
          </template>
        </template>
      </template>
    </CardContainer>

    <CompletedTicket v-if="isUserFinishAllLevels" />
  </div>
</template>

<script>
import NoDataFound from "@/components/Accounts/Shared/NoDataFound";

import UsersSelector from "@/components/Accounts/Shared/UsersSelector";
import UserPassport from "@/components/Accounts/SkiSchool/UserPassport";
import PassportAssessments from "@/components/Accounts/SkiSchool/PassportAssessments";
import CompletedTicket from "@/components/Accounts/SkiSchool/CompletedTicket";

import {customLayerEndPoints} from "@/const/api";
import {lookups} from "@/const/enum";

import moment from "moment";

/* eslint-disable no-undef */

// TODO: Modify component structure APIs process.

export default {
  components: {
    NoDataFound,
    UsersSelector,
    UserPassport,
    PassportAssessments,
    CompletedTicket
  },
  data() {
    return {
      usersList: [],
      selectedUserDetails: {},
      passportHeaderData: {
        passportType: "Ski",
        description: this.$t("ACCOUNT_PAGE.SKI_SCHOOL.SKI_PASSPORT.NO_PREVIOUS_PASSPORT_DESCRIPTION"),
      },
      loaders: {
        getUsers: false,
        getLesson: false,
        getUserPassport: true,
      },
      errors: {
        getUsers: false,
        getLesson: false,
        getUserPassport: false,
      },
    };
  },
  head() {
    return this.$seoGenerator({}, this.$t("PAGES_TITLE.ACCOUNTS.SKI_SCHOOL.SKI_PASSPORT"));
  },
  computed: {
    isUserFinishAllLevels() {
      if (this.$isEmptyObject(this.selectedUserDetails || {})) return false;
      if (this.$isEmptyObject(this.selectedUserDetails.details || {}))
        return false;
      return this.selectedUserDetails.isCompletedLessonAssessments;
    },
  },
  created() {
    this.getUsers();
  },
  methods: {
    checkifJoinedPassport(level) {
      if (
        level > 1 ||
        (this.selectedUserDetails.nextLesson &&
          this.selectedUserDetails.nextLesson.title)
      )
        return true;
      return false;
    },
    buildBadge(level) {
      return {
        level_id: level,
        questions: [],
      };
    },
    isBadgeExist(badges, level) {
      for (let index = 0; index < badges.length; index++) {
        if (Number(badges[index].level_id) == Number(level)) return true;
      }
      return false;
    },
    getBadge(badges, level) {
      for (let index = 0; index < badges.length; index++) {
        if (Number(badges[index].level_id) == Number(level))
          return badges[index];
      }
    },
    checkBadges(badges) {
      let temp = [];
      for (let index = 0; index < 6; index++) {
        if (this.isBadgeExist(badges, index + 1)) {
          temp.push(this.getBadge(badges, index + 1));
        } else {
          temp.push(this.buildBadge(index + 1));
        }
      }
      return temp;
    },
    bookLessonEmitHandler(data = {}) {
      if (this.$isEmptyObject(data)) data.level = this.selectedUserDetails.details.current_level;

      this.$router.push(
        this.localePath(
          `/ski-lessons?level=${data.level}&lesson=0&age=${this.selectedUserDetails.ageEnum}`
        )
      );
    },
    async getUserNextLesson() {
      try {
        this.loaders.getLesson = true;

        if (this.errors.getLesson) this.errors.getLesson = false;

        const { data: res } = await this.$axios.get(
          `${process.env.SHARED_ENVS.APIGEE_BASE_URL}${customLayerEndPoints.GET_NEXT_LESSON}?type=${lookups.PASSPORT_TYPE[0].id}`,
          {
            headers: {
              "user-id": this.selectedUserDetails.id,
            },
          }
        );

        if (res && res.event_date) {
          this.selectedUserDetails.nextLesson = {
            title: this.$getItemTitle(res) || res.title_en,
            level: "Level 1",
            date: res.event_date,
            time: res.event_date
          };
          this.selectedUserDetails.isJoinedPassport = true;
        } else this.selectedUserDetails.nextLesson = {};

        this.loaders.getLesson = false;
      } catch (err) {
        this.errors.getLesson = true;
        this.loaders.getLesson = false;
        console.log({ err });
      }
    },
    async getUserPassport() {
      try {
        this.loaders.getUserPassport = true;

        if (this.errors.getUserPassport) this.errors.getUserPassport = false;

        const { data: res } = await this.$axios.get(
          `${process.env.SHARED_ENVS.APIGEE_BASE_URL}${customLayerEndPoints.GET_PASSPORT}/${this.selectedUserDetails.id}/${lookups.PASSPORT_TYPE[0].id}`
        );

        if (res && res.data) {
          this.selectedUserDetails.details = res.data;
          this.selectedUserDetails.details.current_level = +this.selectedUserDetails.details.current_level > 6 ? 6 : this.selectedUserDetails.details.current_level;

          this.selectedUserDetails.details.user_levels = this.checkBadges(
            this.selectedUserDetails.details.user_levels
          );

          this.selectedUserDetails.isJoinedPassport =
            !this.selectedUserDetails.isJoinedPassport
              ? this.checkifJoinedPassport(
                  this.selectedUserDetails.details.current_level
                )
              : true;

          const isUserCompletedLessonAssessments = this.userAssessmentsChecker(
            this.selectedUserDetails.details.current_level,
            this.selectedUserDetails.details.user_levels
          );

          this.selectedUserDetails.isCompletedLessonAssessments = isUserCompletedLessonAssessments;

          if (isUserCompletedLessonAssessments) {
            this.passportHeaderData = {
              passportType: "Ski",
              description: this.$t("ACCOUNT_PAGE.SKI_SCHOOL.SKI_PASSPORT.PREVIOUS_PASSPORT_DESCRIPTION")
            };
          }

          this.selectedUserDetails.level = {
            name: this.setLastFullMarkLevel(
              this.selectedUserDetails.details.current_level,
              this.selectedUserDetails.details.user_levels
            ),
          };
        }

        this.loaders.getUserPassport = false;
      } catch (err) {
        this.errors.getUserPassport = true;
        this.loaders.getUserPassport = false;
        console.log({ err });
      }
    },
    toggleSelectedUser(user) {
      this.selectedUserDetails = {
        id: user.id,
        firstName: user.firstName,
        fullName: user.firstName + " " + user.lastName,
        userAK: user.user_ak,
        skiPassportID: user.skiPassportID,
        ageEnum: this.getAgeEnum(user.dateOfBirth, "ski"),
        parent_user_id: user.parent_user_id,
        isJoinedPassport: false,
        isCompletedLessonAssessments: false,
        level: {
          name: "",
        },
        nextLesson: {},
        details: {},
      };
      this.getUserNextLesson();
      this.getUserPassport();
    },
    setLastFullMarkLevel(level, levels) {
      level = Number(level) - 1;
      if (level < 0) level = 0;
      if (level == 0) {
        return this.getBadgeName(1);
      } else {
        let questions = levels[level].questions;
        for (let index = 0; index < questions.length; index++) {
          if (questions[index].status != 1) return this.getBadgeName(level);
        }
      }
      return this.getBadgeName(level + 1);
    },
    userAssessmentsChecker(currentLevel, allLevels) {
      if (+currentLevel === 6) {
        const lastLevelQuestions = allLevels[allLevels.length - 1].questions;

        for (let index = 0; index < lastLevelQuestions.length; index++) {
          if (lastLevelQuestions[index].status != 1) return false;
        }

        return true;
      }

      return false;
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
    async getUsers() {
      try {
        this.loaders.getUsers = true;

        if (this.errors.getUsers) this.errors.getUsers = false;

        const { data: res } = await this.$axios.get(
          process.env.SHARED_ENVS.APIGEE_BASE_URL +
            customLayerEndPoints.GET_PRIMARY_SUB_ACCOUNTS
        );

        // TODO: show no data msg when there's no data found.
        if (res && res.users && res.users.length) {
          const flattendUsersList = res.users.filter(
            (user) => moment().diff(user.dateOfBirth, "years") >= 3
          );

          this.usersList = flattendUsersList;
          this.toggleSelectedUser(flattendUsersList[0]);
        }

        this.loaders.getUsers = false;
      } catch (err) {
        this.errors.getUsers = true;
        this.loaders.getUsers = false;
        console.log({ err });
      }
    },
    calculateAge(dateString) {
      var today = new Date();
      var birthDate = new Date(dateString);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    getAgeEnum(dateString, passportType) {
      let age = Number(this.calculateAge(dateString));
      if (passportType == "ski") {
        if (age >= 3 && age <= 6) return 4;
        else if (age >= 7 && age <= 13) return 2;
        else if (age >= 14) return 1;
        else return 0;
      } else {// snowboard
        if (age >= 8 && age <= 13) return 3;
        else if (age >= 14) return 1;
        else return 0;
      }
    },
  },
};
</script>
