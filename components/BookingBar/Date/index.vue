<template>
  <div
    id="booking-bar-date"
    ref="calender"
    class="booking-bar-datepicker-wrapper"
    :class="{
      camp: dateType != 'default',
      dayCamp: dateType == 'days',
      weekCamp: dateType == 'week',
    }"
  >
    <p v-if="dateType != 'default'" class="extra-text">
      {{
        $t('BOOKINGFLOW_PAGE.CHOOSE_YOUR_CAMP_DATE', {
          count: highlight,
          campType: $t(`BOOKINGFLOW_PAGE.${dateType == "days" ? "DAY" : "WEEK"}`)
        })
      }}
    </p>
    <date-picker
      :key="key"
      v-model="date"
      inline
      :disabled-date="disabledBeforeToday"
      :title-format="'DD MMMM YYYY'"
      :lang="lang"
      :class="{ 'double-arrows': !isApplyingDiasblingBehaviour }"
      @change="onDateChange($event)"
      @calendar-change="calendarChange"
    />
    <CircleLoader
      v-if="isLoading"
      :custom-class="'h-100'"
      :show-overlay="true"
    />
  </div>
</template>
<script>
import "vue2-datepicker/index.css";

import gsap from "gsap";
import BezierEasing from "bezier-easing";
import 'vue2-datepicker/locale/en';
import 'vue2-datepicker/locale/ar';
import DatePicker from "vue2-datepicker";
import moment from "moment";

export default {
  components: {DatePicker},
  props: {
    packageDetails: {
      type: Object,
      default: () => ({}),
    },
    immediateEmit: {
      type: Boolean,
      default: false,
    },
    isDDLEnabled: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    highlight: {
      type: Number,
      default: 1,
    },
    blockedDated: {
      type: Array,
      default: () => [],
    },
    allowedDisabledDates: {
      type: Array,
      default: () => [],
    },
    isApplyingDiasblingBehaviour: {
      type: Boolean,
      default: true,
    },
    dateType: {
      type: String,
      default: "default",
    },
    dates: {
      type: Array,
      default: () => [],
    },
    guestCount: {
      type: Number,
      default: 1,
    },
  },
  emits: ['emitDates', 'dateLoaderEmiter', 'emitDate', 'emitDateChangeHandlerImmediate'],
  data() {
    return {
      isLoading: false,
      campAvailableDays: [],
      allowedDates: [],
      lang: this.$i18n.localeProperties.detectedLang,
      date: new Date(),
      dot: new Date().setHours(0, 0, 0, 0), // date of today
      key: this.$getTimeStamp(),
    };
  },
  computed: {
    getAllowedDisabledDates() {
      if (this.allowedDates.length == 0) return [];
      let selectedMonthYearAllowedDates = this.allowedDisabledDates;
      if (selectedMonthYearAllowedDates.length == 0) return this.allowedDates;
      let isAllDatesAreActive = selectedMonthYearAllowedDates.filter(dateObj => dateObj.is_active).length == selectedMonthYearAllowedDates.length;
      let isAllDatesAreInActive = selectedMonthYearAllowedDates.filter(dateObj => !dateObj.is_active).length == selectedMonthYearAllowedDates.length;
      if (!isAllDatesAreActive && !isAllDatesAreInActive) {
        selectedMonthYearAllowedDates = selectedMonthYearAllowedDates.filter(dateData => dateData.is_active);
        isAllDatesAreActive = true;
      }
      const flattendAllowedDates = this.allowedDates.map(vivaData => {
        let isDateDataExistInCMS = !this.$isEmptyObject(this.isDateExistInDates(vivaData.date, selectedMonthYearAllowedDates, false));
        return {
          id: vivaData.id,
          date: vivaData.date,
          is_active: isAllDatesAreActive ? isDateDataExistInCMS ? vivaData.is_active : false : isDateDataExistInCMS ? false : vivaData.is_active
        }
      });
      return flattendAllowedDates;
    },
    getDateDisabledList() {
      return this.blockedDated
        .map((res) => {
          const result = {
            date: Date.parse(res.date),
          };
          return result;
        })
        .flatMap(
          //used to convert array of object to an array with a one array level.
          (elem) => elem.date
        );
    },
  },
  watch: {
    "data.selectedDate": {
      handler(newVal, oldVal) {
        this.date = this.data.selectedDate
          ? new Date(this.data.selectedDate)
          : new Date();
      },
      immediate: false,
      deep: false,
    },
    campAvailableDays(newData, oldData) {
      if (oldData.length == 0 && newData.length > 0) {
        this.$nextTick(() => {
          this.onDateChangeImmediate(this.date);
        });
      }
    },
    isDDLEnabled(isDDLEnabled) {
      if (isDDLEnabled) {
        this.key = this.$getTimeStamp();
        setTimeout(() => {
          this.calendarChange(
            this.getFirstDayOfNextMonth(this.data.selectedDate)
          );
        });
        this.setCalenderAttributes();
      }
      this.datepickerCardAnimeHandler();
    },
    guestCount(){
      if(this.dateType != 'default'){
        this.$nextTick(() => {
          this.onDateChangeImmediate(this.date,false);
        });
      }
    }
  },
  mounted() {
    this.calendarChange(this.getFirstDayOfNextMonth(this.data.selectedDate), true);
    this.setAriaLabelValues();
    this.datepickerCardAnimeHandler();
    this.$nextTick(() => {
      this.date = this.data.selectedDate
        ? new Date(this.data.selectedDate)
        : new Date();
    });
    this.setCalenderAttributes();
    if (this.immediateEmit && this.dateType == "default") {
      this.$nextTick(() => {
        this.onDateChangeImmediate(this.date);
      });
    }
  },
  methods: {
    isDateInCampRangeWeek(date) {
      for (let index = 0; index < this.campAvailableDays.length; index++) {
        if (
            this.isDateMatched(this.campAvailableDays[index].date, date) &&
            this.campAvailableDays[index].maxAvailability >= this.guestCount
          ) {          
          if (this.isNextDaysExistAvailableInViva(date, "week")) {
            if (this.isMainDateInCamp(date)) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        }
      }
      return true;
    },
    getNextWeekDates(date) {
      const nextDateAfterTheSelectedDate = new Date(date);
      nextDateAfterTheSelectedDate.setDate(date.getDate() + 7);
      return nextDateAfterTheSelectedDate;
    },
    isNextDaysExistAvailableInViva(date, calanderType) {
      let iterations = this.highlight;
      for (let index = 0; index < iterations - 1; index++) {
        date =
          calanderType == "days"
            ? this.$getNextDates(date)
            : this.getNextWeekDates(date);
        if (!this.isDateInAvailableCamps(date)) return false;
      }
      return true;
    },
    isDateInAvailableCamps(date) {
      for (let index = 0; index < this.campAvailableDays.length; index++) {
        if (this.isDateMatched(this.campAvailableDays[index].date, date))
          return true;
      }
      return false;
    },
    isDateInCampRange(date) {
      for (let index = 0; index < this.campAvailableDays.length; index++) {
        if (
          this.isDateMatched(this.campAvailableDays[index].date, date) &&
          this.campAvailableDays[index].maxAvailability >= this.guestCount
        ) {          
          if (this.isMainDateInCamp(date)) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      }
      return true;
    },
    setCampHighlitted() {
      let calenderElement = this.$refs.calender;
      if (!calenderElement.offsetParent) return false;
      //only opened..
      let cells = calenderElement.querySelectorAll(".cell");
      cells.forEach((element, index) => {
        element.classList.remove("main-camp");
        element.classList.remove("sub-camp");
        element.classList.remove("active-end");
        element.classList.remove("in-range");
        if (!element.classList.contains("disabled")) {
          element.classList.add("main-camp");
        }
      });
      let activeCell = calenderElement.querySelector(".cell.active");
      if (!activeCell) {
        this.selectInRange();
        return false;
      }

      if (this.dateType == "days") {
        this.setRangeHighlight(activeCell);
        this.setCampTextDates("day");
      } else if (this.dateType == "week") {
        this.setRangeHighlightWeek(activeCell);
        this.setCampTextDates("week");
      }
    },
    isDateSelected(date) {
      for (let index = 0; index < this.dates.length; index++) {
        if (this.isDateMatched(new Date(this.dates[index]), date)) {
          return {
            isMatch: true,
            isFirst: index == 0,
            isLast: this.dates.length - 1 == index,
          };
        }
      }
      return {
        isMatch: false,
        isFirst: false,
        isLast: false,
      };
    },
    selectInRange() {
      let calenderElement = this.$refs.calender;
      let cells = calenderElement.querySelectorAll(".cell");
      cells.forEach((element, index) => {
        let dateText = element.getAttribute("title");
        let date = this.parseDate(dateText);
        let match = this.isDateSelected(date);
        if (match.isMatch) {
          let classs = ["in-range"];
          if (match.isFirst) classs = ["main-camp", "active"];
          else if (match.isLast) classs = ["active-end"];
          //
          for (let index2 = 0; index2 < classs.length; index2++) {
            element.classList.add(classs[index2]);
          }
          //
        }
      });
    },
    setCampTextDates(campType) {
      let iterations = this.highlight;
      let selectedDate = new Date(this.date);
      let temp = [];
      temp.push(selectedDate);
      for (let index = 0; index < iterations - 1; index++) {
        if (campType == "day") {
          selectedDate = this.$getNextDates(selectedDate);
        } else {
          // week
          selectedDate = this.getNextWeekDates(selectedDate);
        }
        temp.push(selectedDate);
      }
      this.$emit("emitDates", temp);
    },
    setRangeHighlightWeek(mainActiveCampDateEle) {
      let range = this.highlight - 1;
      let startEle = this.getNextWeekElement(mainActiveCampDateEle);
      if (!startEle) return false;
      for (let index = 0; index < range; index++) {
        let isLastIteration = index == range - 1;
        this.setInRangeAttrWeek(startEle, isLastIteration);
      }
    },
    getNextWeekElement(ele) {
      let c_el_attr = ele.getAttribute("data-row-col");
      let c_el_attr_arr = c_el_attr.split(",");
      let row = Number(c_el_attr_arr[0]);
      let col = Number(c_el_attr_arr[1]);
      let next_week_col = this.$refs.calender.querySelector(
        `.mx-table-date tbody > .mx-date-row:nth-child(${
          row + 2
        }) > .cell:nth-child(${col + 1})`
      );
      return next_week_col;
    },
    setRangeHighlight(mainActiveCampDateEle) {
      let range = this.highlight - 1;
      let startEle = this.nextEle(mainActiveCampDateEle);
      if (!startEle) return false;
      for (let index = 0; index < range; index++) {
        let isLastIteration = index == range - 1;
        this.setInRangeAttr(startEle, isLastIteration);
      }
    },
    nextEle(ele) {
      let nextLineEle = ele.nextElementSibling;
      if (!nextLineEle) {
        let c_el_attr = ele.getAttribute("data-row-col");
        let c_el_attr_arr = c_el_attr.split(",");
        let row = Number(c_el_attr_arr[0]);
        let nextEleNewLine = this.$refs.calender.querySelector(
          `.mx-table-date tbody > .mx-date-row:nth-child(${
            row + 2
          }) > .cell:nth-child(1)`
        );
        nextLineEle = nextEleNewLine;
      }
      return nextLineEle;
    },
    setInRangeAttrWeek(ele, isLastIteration) {
      if (!ele) return false;
      if (ele.classList.contains("in-range")) {
        let nxtEle = this.getNextWeekElement(ele);
        return this.setInRangeAttrWeek(nxtEle, isLastIteration);
      } else {
        ele.classList.add(isLastIteration ? "active-end" : "in-range");
        return true;
      }
    },
    setInRangeAttr(ele, isLastIteration) {
      if (!ele) return false;
      if (ele.classList.contains("in-range")) {
        let nextLineEle = this.nextEle(ele);
        if (!nextLineEle) return false;
        return this.setInRangeAttr(nextLineEle, isLastIteration);
      } else {
        ele.classList.add(isLastIteration ? "active-end" : "in-range");
        return true;
      }
    },
    backToFirstEleWeek(activeCell) {
      // recursive to get the first main selected camp element.
      if (!activeCell) return false;
      if (!activeCell.classList.contains("main-camp")) {
        let c_el_attr = activeCell.getAttribute("data-row-col");
        let c_el_attr_arr = c_el_attr.split(",");
        let row = Number(c_el_attr_arr[0]);
        let col = Number(c_el_attr_arr[1]);
        let prev_week_col = this.$refs.calender.querySelector(
          `.mx-table-date tbody > .mx-date-row:nth-child(${row}) > .cell:nth-child(${
            col + 1
          })`
        );
        return this.backToFirstEleWeek(prev_week_col);
      } else {
        return activeCell;
      }
    },
    backToFirstEle(activeCell) {
      // recursive to get the first main selected camp element.
      if (!activeCell) return false;
      if (!activeCell.classList.contains("main-camp"))
        return this.backToFirstEle(activeCell.previousElementSibling);
      else return activeCell;
    },
    isMainDateInCamp(date) {
      for (
        let index = 0;
        index < this.packageDetails.card.start_booking_days.length;
        index++
      ) {
        if (
          this.isDateMatched(
            date,
            new Date(this.packageDetails.card.start_booking_days[index].date)
          )
        )
          return true;
      }
      return false;
    },
    isDateMatched(date1, date2) {
      return date1.setHours(0, 0, 0, 0) == date2.setHours(0, 0, 0, 0);
    },
    getPrevDate(date) {
      const nextDateBeforeTheSelectedDate = new Date(date);
      nextDateBeforeTheSelectedDate.setDate(date.getDate() - 1);
      return nextDateBeforeTheSelectedDate;
    },
    getFirstDayOfMonth(date) {
      let nextMonth = new Date(date);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    },
    async calendarChange(event, isImmediate = false) {
      this.$emit("dateLoaderEmiter", true);
      this.allowedDates = [];
      let firstDayOfMonth = event;
      let lastDayOfMonth = this.getPrevDate(this.getFirstDayOfMonth(event));
      let dates = [];
      let showMessage = true;
      let isMovie = (this.packageDetails.card || {}).is_movie || false;

      if (isMovie) {
        this.isLoading = true;
        let eventAK = "";
        if (!this.$isEmptyObject(this.packageDetails.BonusTicketViewModel) || !this.$isEmptyObject(this.packageDetails.bonus_ticket)) {
          eventAK = (this.packageDetails.BonusTicketViewModel || {}).event_ak || (this.packageDetails.bonus_ticket || {}).event_ak;
        } else {
          // multiple movies case
          let tickets = this.packageDetails.tickets;
          let eventsType = tickets && tickets.length > 0 ? !this.$isEmptyObject(tickets[0].eventsType) ? tickets[0].eventsType : {} : {};
          if(this.$isEmptyObject(eventsType)) return false;
          eventAK = ((eventsType.adult || {}).performanceAK || "") || ((eventsType.junior || {}).performanceAK || "") || ((eventsType.child || {}).performanceAK || "") || ((eventsType.main || {}).performanceAK || "");
        }
        dates = await this.$repositories.getCalendarAvailabilityCalendar(
          firstDayOfMonth,
          lastDayOfMonth,
          eventAK
        );
        if (dates.length == 0) dates = this.getDisabledDates(firstDayOfMonth);
        dates = this.fillNotExistDates(firstDayOfMonth, lastDayOfMonth, dates);
        this.allowedDates = dates;
      } else if (!this.$isEmptyObject(this.packageDetails.BonusTicketViewModel || {}) && !isMovie) {
        this.isLoading = true;
        let eventAK = this.packageDetails.BonusTicketViewModel.event_ak;
        dates = await this.$repositories.getCalendarAvailabilityCalendar(
          firstDayOfMonth,
          lastDayOfMonth,
          eventAK
        );
        if (dates.length == 0) dates = this.getDisabledDates(firstDayOfMonth);
        dates = this.fillNotExistDates(firstDayOfMonth, lastDayOfMonth, dates);
        this.allowedDates = dates;
      } else if (
        this.packageDetails.cardType === "passes" &&
        !isMovie &&
        (
          (this.packageDetails.tickets.length == 1 && this.packageDetails.tickets[0].eventsType.main.isTimeBased) ||
          (this.$isUpgradedTicket(this.packageDetails))
        )
      ) {
        this.isLoading = true;
        let eventAK = this.$isUpgradedTicket(this.packageDetails) ? this.packageDetails.upgrade_ticket.performanceDetails.performanceAK : this.packageDetails.tickets[0].eventsType.main.performanceAK;
        dates = await this.$repositories.getCalendarAvailabilityCalendar(
          firstDayOfMonth,
          lastDayOfMonth,
          eventAK
        );
        if (dates.length == 0) dates = this.getDisabledDates(firstDayOfMonth);
        dates = this.fillNotExistDates(firstDayOfMonth, lastDayOfMonth, dates);
        this.allowedDates = dates;
      } else if (
        this.packageDetails.cardType === "lessons" &&
        this.packageDetails.tickets.length == 1
      ) {
        let codes = this.packageDetails.tickets[0].code;
        let data = {
          productAK: this.packageDetails.tickets[0].ak,
          performanceAK:
          this.packageDetails.tickets[0].eventsType.main.performanceAK,
          from: firstDayOfMonth,
          to: lastDayOfMonth,
        };
        this.isLoading = true;
        if (this.dateType == "default") {
          let daysAvailability = await this.$repositories.getAKEventTypeSkiCalendar(
            data,
            codes
          );
          dates = daysAvailability.slots;
        } else if (this.dateType == "days" || this.dateType == "week") {
          let actualRange = this.getActualStartEndDays(
            firstDayOfMonth,
            lastDayOfMonth
          );

          dates = [];
          if (actualRange.length > 0) {
            let startDate = actualRange[0];
            let endDate =
              actualRange.length == 2 ? actualRange[1] : actualRange[0];
            data.from = startDate;
            if (this.dateType == "days") {
              let nextDate = this.getDateAfterNoOfDays(endDate);
              data.to = nextDate;
            } else if (this.dateType == "week") {
              let nextDate = this.getDateAfterNoOfWeeks(endDate);
              data.to = nextDate;
            }

            let daysAvailability = await this.$repositories.getAKEventTypeSkiCalendar(
              data,
              codes
            );
            dates = daysAvailability.slots;
          }
        }

        if (dates.length == 0) dates = this.getDisabledDates(firstDayOfMonth);
        if (this.dateType == "default") {
          dates = this.fillNotExistDates(
            firstDayOfMonth,
            lastDayOfMonth,
            dates
          );
          this.allowedDates = dates;
        } else if (this.dateType == "days") {
          showMessage = false;
          this.campAvailableDays = dates;
          this.clearDisabledDatesFromCMS();
          setTimeout(() => {
            this.setCampHighlitted();
          });
        } else if (this.dateType == "week") {
          showMessage = false;
          this.campAvailableDays = dates;
          this.clearDisabledDatesWeekFromCMS();
          setTimeout(() => {
            this.setCampHighlitted();
          });
        }
      } else {
        showMessage = false;
        this.allowedDates = this.allowedDisabledDates;
        this.setCalenderAttributes();
      }

      if (this.$repositories.toBoolean(isImmediate)) {
        this.$nextTick(() => {
          this.onDateChangeImmediate(this.date, showMessage);
        });
      }

      this.isLoading = false;
      this.$emit("dateLoaderEmiter", false);
    },
    fillNotExistDates(firstDayOfMonth, lastDayOfMonth, dates) {
      let temp = [];
      firstDayOfMonth = new Date(firstDayOfMonth).setHours(0, 0, 0, 0);
      lastDayOfMonth = new Date(lastDayOfMonth).setHours(0, 0, 0, 0);
      //
      while (firstDayOfMonth <= lastDayOfMonth) {
        let res = this.isDateExistInDates(firstDayOfMonth, dates, true);
        if (!this.$isEmptyObject(res)) {
          temp.push(res);
        } else {
          temp.push({
            id: new Date(firstDayOfMonth),
            date: new Date(firstDayOfMonth),
            is_active: false,
            maxAvailability: 0,
            performances: []
          });
        }
        //
        firstDayOfMonth = this.$getNextDates(new Date(firstDayOfMonth));
      }
      return temp;
    },
    isDateExistInDates(date, dates, isFullCheck = false) {
      for (let index = 0; index < dates.length; index++) {
        if (
          new Date(dates[index].date).setHours(0, 0, 0, 0) ===
          new Date(date).setHours(0, 0, 0, 0)
        ){
          if(isFullCheck){
            if(
                !!this.packageDetails.tickets[0].additional_ak && dates[index].maxAvailability > 0 ||
                this.packageDetails.card.is_table && this.guestCount <= this.getTableGuestCountAvailable(dates[index].performances) ||
                this.guestCount <= dates[index].maxAvailability
            ){
              return dates[index];
            }
          } else {
              return dates[index];
          }
        }
      }
      return {};
    },
    getTableGuestCountAvailable(performances = []){
      let tableCount = 0;
      let maxNumberPerTable = +this.packageDetails.card.max_number_per_table;
      for (let index = 0; index < performances.length; index++) {
        tableCount+=parseInt(performances[index].available / maxNumberPerTable);
      }
      return tableCount * maxNumberPerTable;
    },
    getDateAfterNoOfDays(date) {
      for (let index = 0; index < Number(this.highlight) - 1; index++) {
        date = this.$getNextDates(date);
      }
      return date;
    },
    getDateAfterNoOfWeeks(date) {
      for (let index = 0; index < Number(this.highlight) - 1; index++) {
        date = this.getNextWeekDates(date);
      }
      return date;
    },
    getActualStartEndDays(firstDayOfMonth, lastDayOfMonth) {
      firstDayOfMonth = new Date(firstDayOfMonth);
      lastDayOfMonth = new Date(lastDayOfMonth);
      let start_booking_days = this.packageDetails.card.start_booking_days;
      let temp = [];
      for (let index = 0; index < start_booking_days.length; index++) {
        let day = new Date(start_booking_days[index].date);
        //
        if (day >= firstDayOfMonth && day <= lastDayOfMonth) temp.push(day);
      }

      if (temp.length == 0) return [];
      let min = this.getMinDate(temp);
      let max = this.getMaxDate(temp);
      return [min, max];
    },
    getMinDate(dates) {
      return new Date(Math.min(...dates.map((e) => e)));
    },
    getMaxDate(dates) {
      return new Date(Math.max(...dates.map((e) => e)));
    },
    clearDisabledDatesWeekFromCMS() {
      let temp = [];
      for (let index = 0; index < this.campAvailableDays.length; index++) {
        if (!this.isPresentedDateWithinDisabledDatesWeek(this.campAvailableDays[index].date)) temp.push(this.campAvailableDays[index]);
      }
      this.campAvailableDays = temp;
    },
    clearDisabledDatesFromCMS() {
      let temp = [];
      for (let index = 0; index < this.campAvailableDays.length; index++) {
        if (!this.isPresentedDateWithinDisabledDates(this.campAvailableDays[index].date)) temp.push(this.campAvailableDays[index]);
      }
      this.campAvailableDays = temp;
    },
    isPresentedDateWithinDisabledDatesWeek(date) {
      for (let index = 0; index < this.allowedDisabledDates.length; index++) {
        if (this.allowedDisabledDates[index].is_active) continue;
        let disableDate = new Date(this.allowedDisabledDates[index].date);
        let presentedDate = date;
        if (this.isDateMatched(disableDate, presentedDate)) return true;
        for (let index2 = 0; index2 < this.highlight - 1; index2++) {
          presentedDate = this.getNextWeekDates(presentedDate);
          if (this.isDateMatched(disableDate, presentedDate)) return true;
        }
      }
      return false;
    },
    isPresentedDateWithinDisabledDates(date) {
      for (let index = 0; index < this.allowedDisabledDates.length; index++) {
        if (this.allowedDisabledDates[index].is_active) continue;
        let disableDate = new Date(this.allowedDisabledDates[index].date);
        let presentedDate = date;
        if (this.isDateMatched(disableDate, presentedDate)) return true;
        for (let index2 = 0; index2 < this.highlight - 1; index2++) {
          presentedDate = this.$getNextDates(presentedDate);
          if (this.isDateMatched(disableDate, presentedDate)) return true;
        }
      }
      return false;
    },
    getFirstDayOfNextMonth(date) {
      date = new Date(date);
      return new Date(date.getFullYear(), date.getMonth(), 1);
    },
    getDisabledDates(firstDayOfMonth) {
      let nextMonth = this.getFirstDayOfNextMonth(firstDayOfMonth);
      let lastDayOfCurrentMonth = this.getPrevDate(nextMonth);
      let month = lastDayOfCurrentMonth.getMonth();
      let year = lastDayOfCurrentMonth.getFullYear();
      let temp = [];
      for (let index = 1; index <= lastDayOfCurrentMonth.getDate(); index++) {
        let date = new Date(`${year}-${month}-${index}`);
        temp.push({
          id: date,
          date: date,
          is_active: true,
          maxAvailability: 0,
          performances: []
        });
      }
      return temp;
    },
    setAriaLabelValues() {
      const calendarHeader = this.$refs.calender.querySelector(
        ".mx-calendar-header"
      );
      const rightArrow = calendarHeader.querySelector(".mx-btn-icon-right");
      const leftArrow = calendarHeader.querySelector(".mx-btn-icon-left");

      rightArrow.setAttribute("aria-label", "swipe, right");
      leftArrow.setAttribute("aria-label", "swipe, left");
    },
    isValid(date) {
      if (this.dateType == "default") {
        return true;
      } else {
        for (let index = 0; index < this.campAvailableDays.length; index++) {
          if (this.isDateMatched(this.campAvailableDays[index].date, date))
            return true;
        }
      }
      return false;
    },
    onDateChange(date) {
      const selectedDate = date.toDateString().split(" ");

      if (this.isValid(date))
        this.$emit("emitDate", {
          fullDate:
            selectedDate[2] + " " + selectedDate[1] + " " + selectedDate[3],
          shortDate: selectedDate[2] + " " + selectedDate[1],
          selectedDate: date,
          isDateAvailable: !this.disabledBeforeToday(date),
          showMessage: true
        });
      this.setCalenderAttributes();
    },
    onDateChangeImmediate(date, showMessage = true) {
      this.setCalenderAttributes();
      let isDateAvailable = !this.disabledBeforeToday(date);
      let newDate = new Date(moment().subtract(1, 'day'));
      const selectedDate = this.dateType != 'default' && !isDateAvailable ? newDate.toDateString().split(" ") : date.toDateString().split(" ");
      if(this.dateType != 'default' && !isDateAvailable) this.$emit("emitDates", []);

      this.$emit("emitDateChangeHandlerImmediate", {
        fullDate: selectedDate[2] + " " + selectedDate[1] + " " + selectedDate[3],
        shortDate: selectedDate[2] + " " + selectedDate[1],
        selectedDate: this.dateType != 'default' && !isDateAvailable ? newDate : date,
        isDateAvailable: isDateAvailable,
        showMessage: showMessage
      });
    },
    datepickerCardAnimeHandler() {
      const datepickerWrapper = document.querySelector(
        ".booking-bar-datepicker-wrapper"
      );

      const calendarHeader = datepickerWrapper.querySelector(
        ".mx-calendar-header"
      );
      const thead = datepickerWrapper.querySelector("thead tr");
      const tbody = datepickerWrapper.querySelectorAll("tbody tr");

      const calendarElements = [calendarHeader, thead, ...tbody]; // Convert to array to display items in sequence after each other by row.
      calendarElements.forEach((element, index) => {
        gsap
          .fromTo(
            element,
            {opacity: this.isDDLEnabled ? 0 : 1},
            {
              opacity: this.isDDLEnabled ? 1 : 0,
              ease:
                this.$globalData.isDesktopDevice || !this.isDDLEnabled
                  ? BezierEasing(0.33, 0.0, 0.0, 1.0)
                  : BezierEasing(0.4, 0.0, 0.1, 1.0),
              duration:
                this.$globalData.isDesktopDevice || !this.isDDLEnabled ? 0.67 : 0.58,
            }
          )
          .delay((index + 1) * 0.07);
      });
    },
    isDateDisabledFromCMS(calenderDate) {
      return (
        this.getDateDisabledList.filter(function (date) {
          return date.valueOf() === calenderDate.valueOf();
        }).length > 0
      );
    },
    disabledBeforeToday(date) {
      if (this.dateType == "default") {
        if (this.isApplyingDiasblingBehaviour) {
          if (this.$isPastDate(date)) return true;
          if (this.getAllowedDisabledDates.length == 0) {
            return this.isDateDisabledFromCMS(date) || date < this.dot;
          } else {
            if (this.isAllowedDisabledDatesOnlyActivated()) {
              return this.searchAllowedDatesByDate(date) ? false : true;
            } else if (this.isAllowedDisabledDatesOnlyDeActivated()) {
              return this.searchAllowedDatesByDate(date) ? true : false;
            } else {
              return this.searchAllowedDatesByDate(date)
                ? !this.searchAllowedDatesByDate(date).is_active
                : true;
            }
          }
        } else {
          return date > this.dot;
        }
      } else if (this.dateType == "days") {
        if (this.$isPastDate(date)) return true;
        return this.isDateInCampRange(date);
      } else if (this.dateType == "week") {
        if (this.$isPastDate(date)) return true;
        return this.isDateInCampRangeWeek(date);
      }
    },
    searchAllowedDatesByDate(date) {
      for (
        let index = 0;
        index < this.getAllowedDisabledDates.length;
        index++
      ) {
        let iterationDate = new Date(
          this.getAllowedDisabledDates[index].date
        ).setHours(0, 0, 0, 0);
        let dateWithoutTime = date.setHours(0, 0, 0, 0);
        if (iterationDate === dateWithoutTime) {
          return this.getAllowedDisabledDates[index];
        }
      }
      return false;
    },
    isAllowedDisabledDatesOnlyActivated() {
      for (
        let index = 0;
        index < this.getAllowedDisabledDates.length;
        index++
      ) {
        if (!this.getAllowedDisabledDates[index].is_active) return false;
      }
      return true;
    },
    isAllowedDisabledDatesOnlyDeActivated() {
      for (
        let index = 0;
        index < this.getAllowedDisabledDates.length;
        index++
      ) {
        if (this.getAllowedDisabledDates[index].is_active) return false;
      }
      return true;
    },
    blockPrevDate(calenderElement, element, numberOfInput) {
      let className = "pointer-events-none";
      if (element.previousElementSibling === null) {
        let col = element.getAttribute("data-row-col").split(",")[0];
        let prevCol = calenderElement.querySelector(
          `tbody > tr:nth-child(${col})`
        );
        if (prevCol === null) return false;
        prevCol.querySelector("td:nth-child(7)").classList.add(className);
        if (numberOfInput > 1) {
          prevCol.querySelector("td:nth-child(6)").classList.add(className);
        }
      } else {
        element.previousElementSibling.classList.add(className);
        if (numberOfInput > 1) {
          if (element.previousElementSibling.previousElementSibling === null) {
            let col = element.getAttribute("data-row-col").split(",")[0];
            let prevCol = calenderElement.querySelector(
              `tbody > tr:nth-child(${col})`
            );
            prevCol.querySelector("td:nth-child(7)").classList.add(className);
          } else {
            element.previousElementSibling.previousElementSibling.classList.add(
              className
            );
          }
        }
      }
    },
    blockLastDate() {
      let calenderElement = this.$refs.calender;
      if (calenderElement === undefined) return false;
      let enabledCells = calenderElement.querySelectorAll(
        ".cell:not(.disabled)"
      );
      if (enabledCells === undefined) return false;
      if (enabledCells.length > 1) {
        enabledCells[enabledCells.length - 1].classList.add(
          "pointer-events-none"
        );
      }
      //
      if (enabledCells.length > 2) {
        if (this.highlight == 3) {
          enabledCells[enabledCells.length - 2].classList.add(
            "pointer-events-none"
          );
        }
      }
    },
    setCalenderAttributes() {
      if (this.dateType != "default") {
        setTimeout(() => {
          this.setCampHighlitted();
        });
        return false;
        //
      } else if (this.dateType == "default" && this.highlight - 1 > 0) {
        //default
        this.resetHighlightSelection();
        let dates = [];
        let date = this.date;
        while (dates.length < this.highlight) {
          if (!this.disabledBeforeToday(date)) dates.push(date);
          date = this.$getNextDates(date);
        }
        this.$emit("emitDates", dates);
        setTimeout(() => {
          let calenderElement = this.$refs.calender;
          let tds = calenderElement.querySelectorAll(".cell");
          tds.forEach(td => {
            let isDateHighlitted = !!dates.filter(date => this.isDateMatched(date, this.parseDate(td.getAttribute("title")))).length;
            if (isDateHighlitted) td.classList.add("highlight");
          });
        });
      }
    },
    parseDate(strDate) {
      if (moment(strDate).isValid()) return new Date(strDate);
      //
      let dateArray = strDate.split(" ");
      let rtlMonth = dateArray[1];
      let month = moment(moment(rtlMonth, 'MMMM')).month() + 1

      return new Date(`${month}/${dateArray[0]}/${dateArray[2]}`);
    },
    setNextAvailableDateAsHighlitted(ele) {
      if (
        ele?.classList.contains("disabled") ||
        ele?.classList.contains("highlight")
      ) {
        this.setNextAvailableDateAsHighlitted(ele.nextSibling);
      } else {
        ele?.classList.add("highlight");
      }
    },
    resetHighlightSelection() {
      let calenderElement = this.$refs.calender;
      let highlightedElements =
        calenderElement.querySelectorAll("td.highlight");
      highlightedElements.forEach((element, index) => {
        element?.classList.remove("highlight");
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./Date.scss";
</style>
