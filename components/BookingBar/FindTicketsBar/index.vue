<template>
  <div id="booking-bar">
    <div
      v-if="!isDesktopDeviceLoc"
      id="findTicketButton"
      ref="findTicketContainerMobile"
    >
      <button
        class="findTicketButton"
        :class="[
          isButtonDisabled
            ? 'bg-[#fff29f] text-[#696969]'
            : 'bg-light-yellow text-[#1a1a1a]',
        ]"
        @click="findTicket()"
      >
        <ChangeValueAnimation
          id="find-ticket-booking-bar-button-mobile"
          class="relative"
          :text="buttonText"
          transition="btt-across"
          :delay="buttonDelay"
        />
      </button>
    </div>
    <div id="shadow">
      <div id="dark-shadow" />
    </div>
    <div class="findTicketBarBackShadow">
      <div
        id="findTicketBar"
        v-click-outside.special="closeMobileMenu"
        :class="{ 'mobile-ddl-enabled': isMobileMenuEnabled }"
      >
        <div>
          <div
            class="booking-bar-unorder-item-container"
            :class="`step-${steps.currentStep}`"
          >
            <div
              ref="experienceDDL"
              v-click-outside="closeExperienceDDL"
              class="
                booking-bar-item booking-bar-item-with-ddl
                lg:w-[25%]
                max-w-[unset]
                lg:max-w-[352px]
              "
              :class="{
                activeDDL: experience.isEnabled,
              }"
              @click="selectStep(1, $event)"
            >
              <div
                class="main-tab justify-between px-10 lg:px-4 xl:px-8"
                :class="{
                  'empty-card-error': cardsValidator.isActivityCardEmpty,
                }"
                @click="experience.isEnabled = !experience.isEnabled"
              >
                <div class="corner ltr:rounded-tl-2xl rtl:rounded-tr-2xl" />
                <div class="tab-details lg:mt-[3px]">
                  <label class="section-title">{{ $t("FIND_TICKETS_BAR.EXPERIENCE") }}</label>
                  <ChangeValueAnimation
                    id="experience-text-booking-bar"
                    class="section-value"
                    :text="
                      experience.title
                        ? getElementLocaleTitle('experience')
                        : $t('FIND_TICKETS_BAR.WHAT_DO_YOU_WANT_TO_DO')
                    "
                    transition="btt-across"
                  />
                </div>
                <div class="arrow-btn">
                  <ArrowDown />
                </div>
              </div>

              <div
                class="ddl experienceTab"
                :class="{ activeStep: steps.currentStep == 1 }"
                @click="isDesktopDeviceLoc ? $event.stopPropagation() : ''"
              >
                <div class="mobile-section-title-container">
                  <ChangeValueAnimation
                    id="experience-text-booking-bar-mobile"
                    class="mobile-section-title"
                    :text="
                      experience.title && steps.currentStep != 1
                        ? getElementLocaleTitle('experience')
                        : $t('FIND_TICKETS_BAR.CHOOSE_AN_ACTIVITY')
                    "
                    transition="sentanceBTT"
                    :is-current-step="steps.currentStep == 1"
                    :current-step="1"
                  />
                </div>
                <Experience
                  :data="data.experience_categories"
                  :choosed-experience-id="`${experience.id}`"
                  :is-d-d-l-enabled="
                    (!isMobileMenuEnabled && experience.isEnabled) ||
                      (isMobileMenuEnabled && steps.currentStep == 1)
                  "
                  @emitExperience="emitExperienceHandler($event)"
                />
              </div>
            </div>
            <div
              ref="dateDDL"
              v-click-outside="closeDateDDL"
              class="
                booking-bar-item booking-bar-item-with-ddl
                lg:w-[22.5%]
                dots
                lg:rounded-tl-none lg:rounded-tr-none
                max-w-[unset]
                lg:max-w-[333px]
              "
              :class="{
                activeDDL: date.isEnabled,
              }"
              @click="selectStep(2, $event)"
            >
              <div
                class="main-tab justify-between ltr:pl-8 rtl:pr-8 lg:px-4 xl:px-8"
                :class="{ 'empty-card-error': cardsValidator.isDateCardEmpty }"
                @click="date.isEnabled = !date.isEnabled"
              >
                <div class="corner" />
                <div class="tab-details lg:mt-[3px]">
                  <label class="section-title">
                    {{ isDateEnabled ? $t("FIND_TICKETS_BAR.DATE") : $t("FIND_TICKETS_BAR.LEVEL") }}
                  </label>
                  <ChangeValueAnimation
                    id="date-text-booking-bar"
                    class="section-value -mt-px"
                    :text="getSecondBarText"
                    transition="btt-across"
                  />
                </div>
                <div class="arrow-btn">
                  <ArrowDown />
                </div>
              </div>

              <div
                class="ddl"
                :class="{
                  activeStep: steps.currentStep == 2,
                }"
                @click="isDesktopDeviceLoc ? $event.stopPropagation() : ''"
              >
                <div class="mobile-section-title-container" :class="{'open':steps.currentStep === 2}">
                  <ChangeValueAnimation
                    id="date-text-booking-bar-mobile"
                    class="mobile-section-title"
                    :text="getSecondBarText"
                    transition="sentanceBTT"
                    :is-current-step="steps.currentStep == 2"
                    :current-step="2"
                  />
                </div>
                <DateComponent
                  v-if="isDateEnabled"
                  :blocked-dated="data.blocked_dates"
                  :data="date"
                  :is-d-d-l-enabled="
                    (!isMobileMenuEnabled && date.isEnabled) ||
                      (isMobileMenuEnabled && steps.currentStep == 2)
                  "
                  @emitDate="emitDateHandler($event)"
                />
                <LevelBar
                  v-else
                  :data="levels"
                  :selected-level="level"
                  :is-d-d-l-enabled="
                    (!isMobileMenuEnabled && date.isEnabled) ||
                      (isMobileMenuEnabled && steps.currentStep == 2)
                  "
                  @emitLevel="emitLevelHandler($event)"
                />
              </div>
            </div>
            <div
              ref="peopleDDL"
              v-click-outside="closePeopleDDL"
              class="
                booking-bar-item booking-bar-item-with-ddl
                lg:w-[28.75%]
                dots
                lg:rounded-tl-none lg:rounded-tr-none
                max-w-[unset]
                lg:max-w-[319px]
              "
              :class="{
                activeDDL: people.isEnabled,
              }"
              @click="selectStep(3, $event)"
            >
              <div
                class="main-tab ltr:pl-[2.063rem] rtl:pr-[2.063rem] lg:px-4 justify-between xl:px-8"
                @click="people.isEnabled = !people.isEnabled"
              >
                <div class="corner" />
                <div class="tab-details lg:mt-[3px] ltr:-ml-px rtl:-mr-px lg:ltr:ml-[2px] lg:rtl:mr-[2px]">
                  <label class="section-title">
                    {{ isDateEnabled ? $t("FIND_TICKETS_BAR.PEOPLE") : $t("FIND_TICKETS_BAR.AGE") }}</label>
                  <ChangeValueAnimation
                    id="people-text-booking-bar"
                    class="section-value -mt-px capitalize"
                    :text="peopleText"
                    transition="btt-across"
                  />
                </div>
                <div class="arrow-btn">
                  <ArrowDown />
                </div>
              </div>
              <div
                class="ddl people-ddl"
                :class="{ activeStep: steps.currentStep == 3 }"
              >
                <div class="mobile-section-title-container">
                  <ChangeValueAnimation
                    id="people-text-booking-bar-mobile"
                    class="mobile-section-title"
                    :text="peopleText"
                    transition="sentanceBTT"
                    :is-current-step="steps.currentStep == 3"
                    :current-step="3"
                  />
                </div>
                <People
                  v-if="isDateEnabled"
                  id="booking-bar"
                  :is-d-d-l-enabled="
                    (!isMobileMenuEnabled && people.isEnabled) ||
                      (isMobileMenuEnabled && steps.currentStep == 3)
                  "
                  :initial-data="people.data"
                  @emitCounterDataEmitter="
                    emitCounterDataEmitterHandler($event)
                  "
                />

                <Age
                  v-else
                  :selected-age="age"
                  :is-d-d-l-enabled="
                    (!isMobileMenuEnabled && people.isEnabled) ||
                      (isMobileMenuEnabled && steps.currentStep == 3)
                  "
                  :type="experience.ski_school_experience_category_type"
                  @emitAge="emitAgeHandler($event)"
                />
              </div>
            </div>

            <div
              v-if="isDesktopDeviceLoc"
              ref="findTicketContainer"
              class="
                booking-bar-item
                findTicketContainer
                lg:w-[23.75%]
                max-w-[unset]
                lg:max-w-[312px]
                opacity-0
                lg:opacity-100
              "
              :class="
                isMobileMenuEnabled && steps.currentStep != 1
                  ? 'mb-[1.125rem]'
                  : 'mb-0'
              "
            >
              <button
                class="findTicketButton"
                :class="[
                  isButtonDisabled
                    ? 'bg-[#fff29f] text-[#696969]'
                    : 'bg-light-yellow text-[#1a1a1a]',
                ]"
                @click="findTicket()"
              >
                <ChangeValueAnimation
                  id="find-ticket-booking-bar-button"
                  class="relative"
                  :text="buttonText"
                  transition="btt-across"
                  :delay="buttonDelay"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ChangeValueAnimation from "@/components/Shared/ChangeValueAnimation";
import ArrowDown from "@/components/SVGElements/ArrowDown.vue";
import Experience from "@/components/BookingBar/Experience";
import People from "@/components/BookingBar/People";
import DateComponent from "@/components/BookingBar/Date";
import LevelBar from "@/components/BookingBar/Level";
import Age from "@/components/BookingBar/Age";
import BezierEasing from "bezier-easing";
import gsap from "gsap";
import {CommonEvent} from "@/services/app-events";

export default {
  name: "FindTicketsBar",
  components: {
    ArrowDown,
    Experience,
    People,
    DateComponent,
    ChangeValueAnimation,
    LevelBar,
    Age,
  },
  data() {
    return {
      levels: [],
      isSubmit: false,
      age: {
        id: 0,
        title: "",
        localized_title: null,
        isInProgress: false,
      },
      level: {
        id: 0,
        title: "",
        localized_title: null,
        isInProgress: false,
      },
      experience: {
        isEnabled: false,
        title: "",
        value: "",
        route: "",
        id: null,
        ski_school_experience_category_type: 0,
        localized_title: null,
        isInProgress: false,
      },
      date: {
        isEnabled: false,
        value: "",
        shortDate: "",
        selectedDate: null,
        isInProgress: false,
      },
      people: {
        isEnabled: false,
        value: 0,
        data: {
          adult: 0,
          junior: 0,
          child: 0,
        },
      },
      isMobileMenuEnabled: false,
      steps: {
        currentStep: 0,
        isStep1AbleToClick: true,
        isStep2AbleToClick: false,
        isStep3AbleToClick: false,
      },
      tempPeople: {
        data: {
          adult: 0,
          junior: 0,
          child: 0,
        },
        totalCounter: 0,
      },
      buttonTextTemp: {
        peopleTotal: 0,
        date: "",
      },
      ismobileButtonInFront: false,
      buttonDelay: 0,
      isDesktopDeviceLoc: false,
      toucStart: 0,
      currentTouc: 0,
      cardTop: 0,
      cardTopChange: 0,
      screen: {
        width: window.innerWidth,
      },
      isBookingBarInViewport: false,
      isBookingBarInProgress: false,
      cardsValidator: {
        isActivityCardEmpty: false,
        isDateCardEmpty: false,
      },
      peopleIsChanged: false,
      data: {},
      isArabicLang: false
    };
  },
  computed: {
    isDateEnabled() {
      let ski_school_experience_category_type =
        this.experience.ski_school_experience_category_type;
      return (
        ski_school_experience_category_type == 0 ||
        ski_school_experience_category_type === null
      );
    },
    getSecondBarText() {
      if (this.isDateEnabled) {
        return this.date.value ? this.$dateFormatter(this.date.value) : this.$t("FIND_TICKETS_BAR.PICK_A_DATE");
      } else {
        const levelTextTitle = this.getElementLocaleTitle("level");
        return levelTextTitle ? levelTextTitle : this.$t("FIND_TICKETS_BAR.WHAT_IS_YOUR_LEVEL");
      }
    },
    peopleText() {
      if (this.isDateEnabled) {
        if (this.isDesktopDeviceLoc) {
          return this.peopleIsChanged
            ? this.people.value > 0
              ? this.guestText
              : this.$t("FIND_TICKETS_BAR.HOW_MANY_PEOPLE")
            : this.$t("FIND_TICKETS_BAR.HOW_MANY_PEOPLE");
        } else {
          if (!this.peopleIsChanged) return this.$t(`FIND_TICKETS_BAR.GUESTS`);
          return this.people.value > 0 && this.steps.currentStep !== 3
            ?
            this.$t(`BOOKINGFLOW_PAGE.${this.$options.filters.plural('guest', this.people.value)}`, {count: this.people.value})
            : this.$t(`FIND_TICKETS_BAR.GUESTS`);
        }
      } else {
        const ageTextTitle = this.getElementLocaleTitle("age");
        return ageTextTitle ? ageTextTitle : this.$t("FIND_TICKETS_BAR.WHO_IS_THIS_FOR");
      }
    },
    guestText() {
      let temp = [];
      for (const key in this.people.data) {
        if (this.people.data[key] > 0)
          temp.push(
            this.$t(`BOOKINGFLOW_PAGE.${this.$options.filters.plural(key, this.people.data[key])}`, {count: this.people.data[key]})
          );
      }

      let tempText = "";
      for (let index = 0; index < temp.length; index++) {
        tempText += temp[index];
        if (index + 1 != temp.length) tempText += ",  ";
      }
      return tempText;
    },
    isButtonDisabled() {
      return (
        !this.isDesktopDeviceLoc &&
        (!this.steps.isStep2AbleToClick || !this.steps.isStep3AbleToClick) &&
        this.isMobileMenuEnabled
      );
    },
    buttonText() {
      if (this.isDateEnabled) {
        let peopleTxt =
          this.buttonTextTemp.peopleTotal > 0
            ? `, ${this.$t(`BOOKINGFLOW_PAGE.${this.$options.filters.plural("guest", this.buttonTextTemp.peopleTotal)}`, {count: this.buttonTextTemp.peopleTotal})}`
            : "";
        let buttonText = `${this.$dateFormatter(this.date.selectedDate, null)}${peopleTxt} <span class="ltr:font-druk-text-medium-italic rtl:font-adapter">&nbsp;&nbsp;[${
          this.isDesktopDeviceLoc ? this.$t("FIND_TICKETS_BAR.UPDATE") : this.$t("FIND_TICKETS_BAR.CHANGE")
        }]</span>`;
        if (this.isDesktopDeviceLoc) {
          return this.isSubmit ? buttonText : this.$t("FIND_TICKETS_BAR.FIND_TICKETS");
        } else {
          return this.isMobileMenuEnabled
            ? this.$t('COMMON.CONTINUE')
            : this.isSubmit
              ? buttonText
              : this.$t("FIND_TICKETS_BAR.FIND_TICKETS");
        }
      } else {
        return this.$t('BOOKINGFLOW_PAGE.BOOK_LESSONS');
      }
    },
  },
  watch: {
    "steps.currentStep"() {
      this.animateButton(
        this.steps.currentStep == 2 || this.steps.currentStep == 3
      );
    },
  },
  created() {
    this.restoreSearchHistory();
    this.getBookingbarData();
  },
  mounted() {
    this.isArabicLang = this.$isArabic();
    this.isDesktopDeviceLoc = this.$detectDesktop();
    this.initializeAnimation();
    this.animateBookingBar();
    document.addEventListener("scroll", this.checkOffset);
    window.addEventListener("resize", this.onResizeScreen);
  },
  beforeDestroy() {
    document.removeEventListener("scroll", this.checkOffset);
    window.removeEventListener("resize", this.onResizeScreen);
  },
  methods: {
    emitAgeHandler(e) {
      this.age.id = e.id;
      this.age.title = e.title;
      this.age.localized_title = e.localized_title;
    },
    emitLevelHandler(e) {
      this.level.id = e.key;
      this.level.title = e.Value;
      this.level.localized_title = e.localized_title;

      this.checkStepStatus();

      if (this.level.isInProgress) return false;
      if (this.isDesktopDeviceLoc) {
        this.closeExperienceDDL();
      } else {
        this.level.isInProgress = true;
        setTimeout(() => {
          this.animateStep(3);
          this.steps.currentStep = 3;
          this.level.isInProgress = false;
        }, 500);
      }
      //
    },
    emitExperienceHandler(e) {
      let old_ski_school_experience_category_type =
        this.experience.ski_school_experience_category_type;
      if (this.cardsValidator.isActivityCardEmpty)
        this.cardsValidator.isActivityCardEmpty = false;
      this.experience.title = e.title;
      this.experience.value = e.value;
      this.experience.route = e.route;
      this.experience.localized_title = e.localized_title;
      this.experience.id = e.id;
      this.experience.ski_school_experience_category_type =
        e.ski_school_experience_category_type;

      if (
        old_ski_school_experience_category_type !=
        e.ski_school_experience_category_type
      )
        this.prepareDDLSize();

      this.checkStepStatus();

      this.age = {
        id: 0,
        title: "",
        isInProgress: false,
        //
      };
      if (this.experience.isInProgress) return false;
      if (this.isDesktopDeviceLoc) {
        this.closeExperienceDDL();
      } else {
        this.experience.isInProgress = true;
        setTimeout(() => {
          this.animateStep(2);
          this.steps.currentStep = 2;
          this.experience.isInProgress = false;
        }, 766);
      }
    },
    checkStepStatus() {
      this.steps.isStep2AbleToClick = this.experience.value ? true : false;
      this.steps.isStep3AbleToClick = this.date.value || this.level.id ? true : false;
    },
    emitDateHandler(e) {
      if (this.cardsValidator.isDateCardEmpty)
        this.cardsValidator.isDateCardEmpty = false;
      this.date.value = e.fullDate;
      this.date.shortDate = e.shortDate;
      this.date.selectedDate = e.selectedDate;
      this.checkStepStatus();

      if (this.date.isInProgress) return false;
      if (this.isDesktopDeviceLoc) {
        this.closeDateDDL();
      } else {
        this.date.isInProgress = true;
        setTimeout(() => {
          this.animateStep(3);
          this.steps.currentStep = 3;
          this.date.isInProgress = false;
        }, 500);
      }
    },
    selectStep(stepNo, ele) {
      if (
        (this.isDesktopDeviceLoc
          ? stepNo == 1
          : stepNo == 1 && this.steps.isStep1AbleToClick) ||
        (this.isDesktopDeviceLoc
          ? stepNo == 2
          : stepNo == 2 && this.steps.isStep2AbleToClick) ||
        (this.isDesktopDeviceLoc
          ? stepNo == 3
          : stepNo == 3 && this.steps.isStep3AbleToClick)
      ) {
        this.toggleCurrentDDL(ele.currentTarget, stepNo);
        this.animateStep(stepNo);
        setTimeout(() => {
          this.steps.currentStep = stepNo;
        });
      }
    },
    scrollTabsToTop() {
      let ddls = document.querySelectorAll(".ddl");
      ddls.forEach((element, index) => {
        element.scroll({top: 0, behavior: "smooth"});
      });
    },
    animateStep(currentStep, isOpenMenu = false) {
      if (this.isDesktopDeviceLoc) return false;
      this.scrollTabsToTop();
      let experienceTab = this.$refs.experienceDDL;
      let peopleTab = this.$refs.peopleDDL;
      let dateTab = this.$refs.dateDDL;

      let peopleTop = 0;
      let dateTop = 0;
      if (currentStep == 1) {
        peopleTop = 82.02;
        dateTop = 69.91;
      } else if (currentStep == 2) {
        peopleTop = 74.71;
        dateTop = 14.6;
      } else if (currentStep == 3) {
        peopleTop = 25.13;
        dateTop = 14.25;
      } else if (currentStep == 4) {
        peopleTop = 100;
        dateTop = 100;
      }

      // to rest top attribute when swiping..
      let mainBookingBar = document.querySelector(".findTicketBarBackShadow");
      gsap.to(mainBookingBar, {
        top: this.cardTop,
        overwrite: true,
        duration: 0.8,
        ease: BezierEasing(0.33, 0, 0, 1),
      });
      //
      if (currentStep != 4) {
        gsap
          .to(experienceTab, {
            top: "-1px",
            duration: 0.8,
            ease: BezierEasing(0.33, 0, 0, 1),
            overwrite: true,
          })
          .delay(0.14);
      }

      gsap
        .to(dateTab, {
          top: `${dateTop}%`,
          duration: currentStep == 4 ? 0.67 : 0.57,
          ease: BezierEasing(0.33, 0, 0, 1),
          overwrite: true,
        })
        .delay(0.07);

      gsap.to(peopleTab, {
        top: `${peopleTop}%`,
        duration: 0.47,
        ease: BezierEasing(0.33, 0, 0, 1),
        overwrite: true,
      });

      if (currentStep != 3) this.updatePeopleValue();
      //
      setTimeout(
        () => {
          this.steps.currentStep = currentStep;
        },
        isOpenMenu ? 400 : 0
      );
    },
    toggleCurrentDDL(currentEle, stepNo) {
      if (!this.isDesktopDeviceLoc) return false;
      let isActive = false;

      if (stepNo == 1) isActive = this.experience.isEnabled;
      else if (stepNo == 2) isActive = this.date.isEnabled;
      else isActive = this.people.isEnabled;
      let corner = currentEle.querySelector(".corner");
      let ddl = currentEle.querySelector(".ddl");
      if (!ddl) return false;
      gsap.to(corner, {
        top: isActive ? "-0.5rem" : 0,
        duration: 0.67,
        ease: BezierEasing(0.33, 0.0, 0.0, 1.0),
        overwrite: true,
      });

      gsap.to(ddl, {
        y: isActive ? `${-ddl.offsetHeight + 16}px` : 0,
        duration: 0.67,
        ease: BezierEasing(0.33, 0.0, 0.0, 1.0),
        overwrite: true,
      });

      if (stepNo == 3 && !isActive && !this.$isEmptyObject(this.tempPeople)) {
        // only change the data when close the tab..
        this.updatePeopleValue();
      }
    },
    updatePeopleValue() {
      if (this.$isEmptyObject(this.tempPeople)) return false;

      this.people.value = this.tempPeople.totalCounter;
      this.people.data.adult = this.tempPeople.data.adult;
      this.people.data.junior = this.tempPeople.data.junior;
      this.people.data.child = this.tempPeople.data.child;
      this.peopleIsChanged = true;
    },
    isActiveStep(stepNo) {
      return this.steps.currentStep >= stepNo;
    },
    closeExperienceDDL() {
      if (this.experience.isEnabled) {
        this.experience.isEnabled = false;
        this.toggleCurrentDDL(this.$refs.experienceDDL, 1);
      }
    },
    closeDateDDL() {
      if (this.date.isEnabled) {
        this.date.isEnabled = false;
        this.toggleCurrentDDL(this.$refs.dateDDL, 2);
      }
    },
    closePeopleDDL() {
      if (this.people.isEnabled) {
        this.people.isEnabled = false;
        this.toggleCurrentDDL(this.$refs.peopleDDL, 3);
      }
    },
    isCurrentPagePassesPackages() {
      let path = this.$route.path;
      if (path.indexOf("passes-packages") !== -1) return true;
      return false;
    },
    isRoutingToTheCurrentPath(nextRoute) {
      let path = this.$route.path;
      if (path.indexOf(`passes-packages/${nextRoute}`) !== -1) return true;
      return false;
    },
    scrollToTopSmothly() {
      gsap.to(window, {duration: 1, scrollTo: 0});
    },
    findTicket() {
      if (this.isDesktopDeviceLoc) {
        if (this.experience.value && (this.date.value || this.level.id)) {
          this.peopleIsChanged = true;
          this.updatePeopleValue();
          setTimeout(() => {
            this.updateTempData();
          });
          this.cacheData();
          this.setDataToStore();
          let textChangeDelayTime = this.isEleInViewport(
            document.getElementById("hero-section")
          )
            ? 880
            : 0; //if redirected from another page to passes and packages..
          if (this.isCurrentPagePassesPackages()) {
            if (this.isRoutingToTheCurrentPath(this.experience.route)) {
              textChangeDelayTime = 0;
            } else {
              textChangeDelayTime = 600;
              this.scrollToTopSmothly();
            }
          }
          setTimeout(() => {
            if (this.$route.path.includes(this.experience.route)) {
              CommonEvent.$emit('update-data')
            } else {
              this.$router.push(
                this.localePath(
                  this.isDateEnabled
                    ? `/passes-packages/${this.experience.route}`
                    : `/${
                      this.experience.ski_school_experience_category_type === 1
                        ? "ski-lessons"
                        : "snowboard-lessons"
                    }?level=${this.level ? this.level.id : 0}&lesson=0&age=${
                      this.age ? this.age.id : 0
                    }`
                )
              );
            }
            this.isSubmit = true;
            //
            this.closeExperienceDDL();
            this.closeDateDDL();
            this.closePeopleDDL();
            //
          }, textChangeDelayTime);
          //
        } else {
          this.cardsValidator.isActivityCardEmpty = !this.experience.value;
          this.cardsValidator.isDateCardEmpty = !this.date.value;
        }
      } else {
        if (!this.isButtonDisabled) {
          if (this.isMobileMenuEnabled) {
            if (this.experience.value && (this.date.value || this.level.id)) {
              this.peopleIsChanged = true;
              this.cacheData();
              this.$router.push(
                this.localePath(
                  this.isDateEnabled
                    ? `/passes-packages/${this.experience.route}`
                    : `/${
                      this.experience.ski_school_experience_category_type ===
                      1
                        ? "ski-lessons"
                        : "snowboard-lessons"
                    }?level=${this.level ? this.level.id : 0}&lesson=0&age=${
                      this.age ? this.age.id : 0
                    }`
                )
              );
              this.isSubmit = true;
              this.closeMobileMenu(this.experience.route);
              this.setDataToStore();
            }
          } else {
            this.toggleMobileMenu();
          }
        }
      }
    },
    updateTempData() {
      this.buttonTextTemp.peopleTotal = this.people.value;
      this.buttonTextTemp.date = this.date.shortDate;
    },
    setDataToStore() {
      setTimeout(() => {
        this.calculateTotal();
        let bookingBarFilter = this.$store.getters["bookingBar/getFilterData"];
        if (!bookingBarFilter) return false;
        let filterData = {};
        filterData[bookingBarFilter.experience.value] = {
          adult: bookingBarFilter.people.adult || 0,
          junior: bookingBarFilter.people.junior || 0,
          child: bookingBarFilter.people.child || 0,
        };
        this.$store.commit("packageSelection/setSelection", filterData);
      });
    },
    emitCounterDataEmitterHandler(data) {
      this.tempPeople = data;
    },
    cacheData() {
      this.updatePeopleValue();
      this.$store.commit("bookingBar/setFilterData", {
        experience: {
          title: this.experience.title || "",
          value: this.experience.value || "",
          route: this.experience.route || "",
          localized_title: this.experience.localized_title,
          ski_school_experience_category_type:
            this.experience.ski_school_experience_category_type || 0,
          id: this.experience.id || null,
        },
        date: {
          fullDate: this.date.value || "",
          shortDate: this.date.shortDate || "",
          selectedDate: this.date.selectedDate || null,
        },
        people: {
          adult: this.people.data.adult || 0,
          junior: this.people.data.junior || 0,
          child: this.people.data.child || 0,
        },
        age: {
          id: this.age.id || 0,
          title: this.age.title || 0,
          localized_title: this.age.localized_title,
        },
        level: {
          id: this.level.id || 0,
          title: this.level.title || 0,
          localized_title: this.level.localized_title
        },
      });
    },
    restoreSearchHistory() {
      let bookingBarFilter = this.$store.getters["bookingBar/getFilterData"];

      if (!this.$isEmptyObject((bookingBarFilter || {})) && this.$isEmptyObject((bookingBarFilter.people || {}))) {
        bookingBarFilter["people"] = {
          adult: 1,
          junior: 0,
          child: 0
        };
      }

      if (this.$isEmptyObject(bookingBarFilter)) {
        this.people.data.adult = 1;
        this.people.value = 1;
        this.tempPeople.data.adult = 1;
        this.tempPeople.totalCounter = 1;
        this.updateTempData();
        return false;
      }

      if (!this.$isEmptyObject(bookingBarFilter.age || {})) {
        this.age.id = bookingBarFilter.age.id || "";
        this.age.title = bookingBarFilter.age.title || "";
        this.age.localized_title = bookingBarFilter.age.localized_title
          ? {...bookingBarFilter.age.localized_title}
          : null;

        const barFilteredLevel = bookingBarFilter.level || {};
        this.level.id = barFilteredLevel.id || "";
        this.level.title = barFilteredLevel.title || "";
        this.level.localized_title = barFilteredLevel.localized_title
          ? {...barFilteredLevel.localized_title}
          : null;
      }

      this.experience.title = (bookingBarFilter.experience || {}).title || "";
      this.experience.value = (bookingBarFilter.experience || {}).value || "";
      this.experience.route = (bookingBarFilter.experience || {}).route || "";
      this.experience.id = (bookingBarFilter.experience || {}).id || null;
      this.experience.localized_title = (bookingBarFilter.experience || {}).localized_title || null;
      this.experience.ski_school_experience_category_type =
        (bookingBarFilter.experience || {}).ski_school_experience_category_type || null;

      let isPastDateVar = this.$isPastDate(
        bookingBarFilter.date !== undefined
          ? bookingBarFilter.date.fullDate
          : new Date()
      );
      let fullDate = "";
      let shortDate = "";
      let todayDate = "";
      if (isPastDateVar) {
        todayDate = new Date();
        const selectedDateArr = todayDate.toDateString().split(" ");
        fullDate =
          selectedDateArr[2] +
          " " +
          selectedDateArr[1] +
          " " +
          selectedDateArr[3];
        shortDate = selectedDateArr[2] + " " + selectedDateArr[1];
      }
      this.date.value = !isPastDateVar
        ? bookingBarFilter.date !== undefined
          ? bookingBarFilter.date.fullDate
          : new Date()
        : fullDate;

      this.date.shortDate = !isPastDateVar
        ? bookingBarFilter.date !== undefined
          ? bookingBarFilter.date.shortDate
          : new Date()
        : shortDate;

      this.date.selectedDate = !isPastDateVar
        ? bookingBarFilter.date !== undefined
          ? bookingBarFilter.date.selectedDate
          : new Date()
        : todayDate;

      this.people.data.adult = bookingBarFilter.people.adult || 0;
      this.people.data.junior = bookingBarFilter.people.junior || 0;
      this.people.data.child = bookingBarFilter.people.child || 0;
      //
      this.tempPeople.data.adult = this.people.data.adult;
      this.tempPeople.data.junior = this.people.data.junior;
      this.tempPeople.data.child = this.people.data.child;

      this.tempPeople.totalCounter =
        this.people.data.adult +
        this.people.data.junior +
        this.people.data.child;
      //
      this.peopleIsChanged = true;
      this.calculateTotal();
      this.checkStepStatus();
      this.updateTempData();
      this.isSubmit = true;
    },
    calculateTotal() {
      let tempTotal = 0;
      for (const key in this.people.data) {
        tempTotal += this.people.data[key];
      }
      this.people.value = tempTotal;
    },
    checkOffset() {
      let bookingBar = document.getElementById("booking-bar");
      if (!bookingBar) return false;
      let findTicketBar = document.querySelector(
        this.isDesktopDeviceLoc ? "#findTicketBar" : "#findTicketButton"
      );
      if (!findTicketBar) return false;
      let footer = document.querySelector("footer");
      if (
        this.getRectTop(findTicketBar) +
        document.body.scrollTop +
        findTicketBar.offsetHeight >=
        this.getRectTop(footer) + document.body.scrollTop - 10
      ) {
        this.closeDateDDL();
        this.closePeopleDDL();
        this.closeExperienceDDL();
        bookingBar.classList.add("animate-hide-booking-bar");
      }
      if (
        document.body.scrollTop + window.innerHeight <
        this.getRectTop(footer) + document.body.scrollTop
      ) {
        bookingBar.classList.remove("animate-hide-booking-bar");
      }
    },
    getRectTop(el) {
      if (!el) return false;
      let rect = el.getBoundingClientRect();
      return rect.top;
    },
    initializeAnimation() {
      let findTicketBar = document.querySelector(".findTicketBarBackShadow");
      if (!findTicketBar) return false;
      gsap
        .fromTo(
          findTicketBar,
          {
            y: `${findTicketBar.offsetHeight}px`,
          },
          {
            y: 0,
            duration: 1,
          }
        )
        .delay(0.57);
    },
    prepareDDLSize() {
      setTimeout(() => {
        let ddls = document.querySelectorAll(".ddl");
        ddls.forEach((element, index) => {
          let innerHeight = 0;
          if (index == 0) innerHeight = "75%";
          else if (index == 1) innerHeight = "65%";
          else innerHeight = "55%"; //2

          let totalSize = 0;
          let innerElements = element.querySelectorAll(":scope > *");
          innerElements.forEach((innerElement, innerIndex) => {
            if (!innerElement) return false;
            totalSize += innerElement.offsetHeight || 0;
          });
          ddls[index].style.height = this.isDesktopDeviceLoc
            ? `${totalSize + (window.innerWidth >= 1280 ? 16 : 20)}px`
            : innerHeight;

          if (this.isDesktopDeviceLoc)
            ddls[index].closest(".booking-bar-item").style.top = 0;

          ddls[index].closest(".booking-bar-item").style.zIndex = null;

          ddls[index]
            .closest(".booking-bar-item")
            .querySelector(".corner").style.top = 0;
          ddls[index].style.transform = "translate(0, 0)";

          this.experience.isEnabled = false;
          this.date.isEnabled = false;
          this.people.isEnabled = false;
        });
        if (this.$refs.findTicketContainer)
          this.$refs.findTicketContainer.style.zIndex = null;
        if (this.$refs.findTicketContainerMobile)
          this.$refs.findTicketContainerMobile.style.zIndex = null;
        //
        this.initializeFindTicketButton();
      }, 500);
    },
    onResizeScreen() {
      if (!document.querySelector("#findTicketBar")) return false;
      this.isDesktopDeviceLoc = this.$detectDesktop();

      if (this.screen.width != window.innerWidth) {
        // special case happens when scrolling and hide the browser search bar..
        this.closeMobileMenu();
        this.screen.width = window.innerWidth;
        this.prepareDDLSize();
        this.prepareSwipeEvents();
      }
      if (this.isDesktopDeviceLoc) {
        document.querySelector("#findTicketBar").style.top = "100%";
      } else {
        document.querySelector("#findTicketBar").style.top = null;
      }
    },
    toggleMobileMenu() {
      if (this.isMobileMenuEnabled) this.closeMobileMenu();
      else this.openMobileMenu();
    },
    openMobileMenu() {
      this.buttonDelay = 1;
      if (this.isDesktopDeviceLoc) return false;
      if (!this.isMobileMenuEnabled) {
        this.$refs.findTicketContainerMobile.style.zIndex = 100; //return it back..
        document.body.style.overflow = "hidden";
        this.animateBackShadow(true);
        this.animateCards(true);
        this.animateStep(1, true);
        setTimeout(() => {
          this.isMobileMenuEnabled = true;
        });
        this.ismobileButtonInFront = true;
        setTimeout(() => {
          this.animateButton(false);
        }, 100);
      }
    },
    animateCards(isActive) {
      let bookingBarItems = document.querySelectorAll(".booking-bar-item");
      let mainBookingBar = document.querySelector(".findTicketBarBackShadow");

      if (isActive) {
        bookingBarItems[0].style.zIndex = 150;
        bookingBarItems[1].style.zIndex = 150;
        bookingBarItems[2].style.zIndex = 150;
        if (!document.querySelector("#booking-bar")) return false;
        document
          .querySelector("#booking-bar")
          ?.classList.toggle("mobile-ddl-container-enabled");
      }

      this.cardTop = window.innerHeight <= 700 ? 24 : 100;

      gsap
        .to(mainBookingBar, {
          top: isActive ? this.cardTop : "100%",
          overwrite: true,
          duration: isActive ? 0.8 : 0.77,
          ease: BezierEasing(0.33, 0, 0, 1),
          onComplete: () => {
            if (!isActive) {
              bookingBarItems[0].style.zIndex = this.isDesktopDeviceLoc
                ? null
                : -1;
              bookingBarItems[1].style.zIndex = this.isDesktopDeviceLoc
                ? null
                : -1;
              bookingBarItems[2].style.zIndex = this.isDesktopDeviceLoc
                ? null
                : -1;

              bookingBarItems[0].style.top = null;
              bookingBarItems[1].style.top = null;
              bookingBarItems[2].style.top = null;

              let findTicketContainer = this.$refs.findTicketContainerMobile;
              findTicketContainer.style.zIndex = 150;
              if (!document.querySelector("#booking-bar")) return false;
              document
                .querySelector("#booking-bar")
                .classList.toggle("mobile-ddl-container-enabled");

              if (!this.isDesktopDeviceLoc) {
                let bookingBar = document.querySelector("#findTicketButton");
                bookingBar.style.transform = null;
              }
            }
          },
        })
        .delay(isActive ? 0 : 0.07);
    },
    animateBackShadow(isActive) {
      let shadowEle = document.querySelector("#booking-bar > #shadow");
      let darkShadowEle = shadowEle.querySelector("#dark-shadow");
      if (isActive) shadowEle.style.zIndex = 100;
      gsap
        .to(darkShadowEle, {
          opacity: isActive ? 1 : 0,
          overwrite: true,
          duration: 0.633,
          onComplete: () => {
            if (!isActive) shadowEle.style.zIndex = -1;
          },
        })
        .delay(isActive ? 0.2 : 0);
    },
    closeMobileMenu(nextRoute = "") {
      this.buttonDelay = 0;
      if (this.isDesktopDeviceLoc) return false;
      if (this.isMobileMenuEnabled) {
        this.isMobileMenuEnabled = false;
        if (this.isSubmit) {
          let textChangeDelayTime = 1433; //if redirected from another page to passes and packages..
          if (this.isCurrentPagePassesPackages()) {
            if (this.isRoutingToTheCurrentPath(nextRoute)) {
              textChangeDelayTime = 600;
            } else {
              textChangeDelayTime = 600;
              this.scrollToTopSmothly();
            }
          }

          this.isSubmit = false;
          setTimeout(() => {
            this.isSubmit = true;
            this.updateTempData();
          }, textChangeDelayTime);
        }
        document.body.style.overflow = "auto";
        this.animateStep(4);
        this.animateBackShadow(false);
        this.animateCards(false);
        this.animateButton(false);
      }
    },
    animateButton(isActive) {
      if (this.isDesktopDeviceLoc) return false;
      if (this.ismobileButtonInFront == isActive) return false;
      this.ismobileButtonInFront = isActive;
      let findTicketContainer = this.$refs.findTicketContainerMobile;
      if (isActive) {
        findTicketContainer.style.transform = "translateY(5.625rem)";
        findTicketContainer.style.zIndex = 150;
        findTicketContainer.style.opacity = 0;
      }
      gsap.to(findTicketContainer, {
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : "5.625rem",
        duration: 0.3,
        onComplete: () => {
          if (!isActive) {
            findTicketContainer.style.transform = "translate(0, 0)";
            findTicketContainer.style.zIndex = 100;
            findTicketContainer.style.opacity = 1;
          }
        },
      });
    },
    initializeFindTicketButton() {
      let button = document.querySelector("#findTicketButton");
      if (!button || this.isDesktopDeviceLoc || this.isMobileMenuEnabled)
        return false;
      button.style.zIndex = 150;
    },
    touchStart(event, ddl) {
      let clientY = event.touches[0].clientY;
      this.toucStart = clientY;
      this.currentTouc = clientY;

      let card = document.querySelector(".findTicketBarBackShadow");
      let cardTop = parseInt(card.style.top);
      if (!cardTop) cardTop = 0;

      this.cardTopChange = cardTop;
      card.style.transition = "top 0.01s ease 0";
      this.swipeCards(clientY, ddl);
    },
    touchEnd(event, ddl) {
      let card = document.querySelector(".findTicketBarBackShadow");
      if (!card) return false;
      this.swipeCards(event.changedTouches[0].clientY, ddl);
      card.style.transition = null;
    },
    touchMove(event, ddl) {
      this.swipeCards(event.changedTouches[0].clientY, ddl);
    },
    swipeCards(y, ddl) {
      if (this.steps.currentStep != 1) return false;
      if (!ddl) return false;
      if (!ddl.classList.contains("activeStep")) return false;
      ddl.style.height = "97%";
      let otherDDLs = document.querySelectorAll(".ddl:not(.activeStep)");

      gsap.to(ddl.closest(".booking-bar-item"), {
        borderBottomLeftRadius: "1.5rem",
        borderBottomRightRadius: "1.5rem",
        height: "97%",
        overwrite: true,
        duration: 0.83,
        ease: BezierEasing(0.4, 0, 0.1, 1),
      });
      gsap.to(otherDDLs[0].closest(".booking-bar-item"), {
        top: "97%",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        height: "100%",
        overwrite: true,
        duration: 0.83,
        ease: BezierEasing(0.4, 0, 0.1, 1),
      });
      gsap.to(otherDDLs[1].closest(".booking-bar-item"), {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        top: "98.5%",
        height: "100%",
        overwrite: true,
        duration: 0.83,
        ease: BezierEasing(0.4, 0, 0.1, 1),
      });

      let card = document.querySelector(".findTicketBarBackShadow");
      let newPosition = parseInt(this.toucStart - y);
      let dir = y > this.currentTouc ? "botom" : "top";
      if (dir == "top") {
        let totalSize = 64; //2rem top and 2rem bottom padding..
        let innerElements = ddl.querySelectorAll(":scope > *");
        innerElements.forEach((innerElement, innerIndex) => {
          if (!innerElement) return false;
          totalSize += innerElement.offsetHeight || 0;
        });
      }
      let newTop = this.cardTopChange - newPosition;
      if (newTop > this.cardTop) newTop = this.cardTop;

      if (newTop > -4) card.style.top = `${newTop}px`;
    },
    prepareSwipeEvents() {
      if (window.innerHeight > 700) return false;
      let _this = this;
      let ddls = document.querySelectorAll(".booking-bar-item-with-ddl .ddl");
      ddls.forEach((ddl) => {
        ddl.addEventListener("touchstart", function (e) {
          _this.touchStart(e, ddl);
        });
        ddl.addEventListener("touchend", function (e) {
          _this.touchEnd(e, ddl);
        });
        ddl.addEventListener("touchmove", function (e) {
          _this.touchMove(e, ddl);
        });
      });
    },
    animateBookingBar() {
      let bookingBar = document.querySelector(
        this.isDesktopDeviceLoc ? "#findTicketBar" : "#findTicketButton"
      );

      gsap
        .fromTo(
          bookingBar,
          {
            y: this.isDesktopDeviceLoc ? "4.063rem" : "5.563rem",
          },
          {
            y: 0,
            overwrite: true,
            duration: 0.933,
            ease: BezierEasing(0.33, 0, 0, 1),
            onComplete: () => {
              bookingBar.style.transform = null;
              if (!document.querySelector("#booking-bar")) return false;
              document
                .querySelector("#booking-bar")
                .classList.add("initialized");
            },
          }
        )
        .delay(1.4);
    },
    async getBookingbarData() {
      this.levels = await this.$repositories.getSkiLevels();
      try {
        // TODO: get lang based on user selection & timezone based on user timezone.
        const result = await this.$axios.get(
          `/api/BookingBarFilterData/GetBookingBarFilterData`,
          {
            params: {
              lang: "en",
              timeZone: this.$getSiteConfig('timezone'),
            },
          }
        );

        if (result && result.status == 200) {
          if (result.data.Result) {
            this.data = result.data.Result;
            this.prepareDDLSize();
            this.prepareSwipeEvents();
          }
        }
      } catch (err) {
        console.log({err});
      }
    },
    getElementLocaleTitle(fieldType) {
      return this[fieldType].localized_title ? (this.isArabicLang ? this[fieldType].localized_title.ar : this[fieldType].localized_title.en) : this[fieldType].title;
    },
    isEleInViewport(ele) {
      if (!ele) return false;
      var bounding = ele.getBoundingClientRect();
      var eleHeight = ele.offsetHeight;
      var eleWidth = ele.offsetWidth;
      if (bounding.top >= -eleHeight
        && bounding.left >= -eleWidth
        && bounding.right <= (window.innerWidth || document.documentElement.clientWidth) + eleWidth
        && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) + eleHeight) return true;
      return false;
    }
  },
};
</script>
<style scoped lang="scss">
@import "./FindTicketsBar.scss";
</style>
