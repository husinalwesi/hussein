<template>
  <div class="age-type-activities-container">
    <div class="age-type-activities">
      <div class="activities-head">
        <div class="left-side">
          <p class="custom-title">
            {{ packageDetails.booking_info && packageDetails.booking_info.card_booking_title ? packageDetails.booking_info.card_booking_title : $t('BOOKINGFLOW_PAGE.WHAT_MOVIE_DO_YOU_WANT_TO_WATCH') }}
          </p>
        </div>
      </div>
      <div v-if="isLoading" class="flex justify-center pt-8">
        <snowflake-loader loader-classes="w-24 h-24" />
      </div>
      <template v-else-if="!isLoading && tickets.length > 0">
        <ul v-if="isDesktopDeviceLoc" class="activities-ul">
          <template v-if="tickets.length > 0">
            <ActivityItemCinema
              v-for="(ticket, ticketIndex) in tickets"
              :key="ticketIndex"
              :ticket-data="ticket"
              :selection="guestSelection"
              :package-details="packageDetails"
              @selectionCinemaChangeEmiter="selectionCinemaChangeEmit"
            />
          </template>
        </ul>
        <div v-else id="activities-carousel">
          <div v-if="tickets.length > 0">
            <VueSlickCarousel
              :key="carouselKey"
              v-bind="settings"
            >
              <ActivityItemCinema
                v-for="(ticket, ticketIndex) in tickets"
                :key="ticketIndex"
                :ticket-data="ticket"
                :selection="guestSelection"
                :package-details="packageDetails"
                @selectionCinemaChangeEmiter="selectionCinemaChangeEmit"
              />
            </VueSlickCarousel>
          </div>
        </div>
      </template>
      <template v-else-if="!isLoading && tickets.length == 0">
        <p class="px-4 lg:px-8 text-gray-600 ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler">
          {{ $t('BOOKINGFLOW_PAGE.THERE_ARE_NO_MOVIES') }}
        </p>
      </template>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import ActivityItemCinema from "@/components/BookingFlow/AddActivity/ActivityItemCinema";
import VueSlickCarousel from "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.common";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.css";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-theme.css";

export default {
  name: "ActivitiesCinema",
  components: {
    ActivityItemCinema,
    VueSlickCarousel
  },
  props: {
    packageDetails: {
      type: Object,
      default: () => ({}),
    },
    guestSelection: {
      type: Object,
      default: () => ({}),
    },
    changeEvt: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['selectionCinemaChangeEmiter'],
  data() {
    return {
      isDesktopDeviceLoc: false,
      isLoading: false,
      performances: [],
      settings: {
        dots: false,
        arrows: false,
        speed: 833,
        infinite: false,
        rtl: this.$i18n.localeProperties.detectedLang === 'ar',
        centerMode: false,
        centerPadding: "0",
      },
      carouselKey: this.$getTimeStamp(),
    };
  },
  computed: {
    tickets(){
      // day: 1 sunday    day: 7 saturday
      let selectedDayIndex = +(new Date(this.packageDetails.date).getDay()) + 1;      
      if (!this.$isEmptyObject(this.packageDetails.BonusTicketViewModel) || !this.$isEmptyObject(this.packageDetails.bonus_ticket)) {
        let selectedSlot = (this.packageDetails.bonus_ticketSelection || {}).selectedSlot || (this.packageDetails.bonusSelection || {}).selectedSlot;
        if(!selectedSlot) return [];
        let nextHourPerformance = (this.performances || []).find(performance => this.isNextHourHasMovieInViva(selectedSlot, performance.time));
        if(!nextHourPerformance) return [];
        let nextHourMovie = (this.packageDetails.tickets[0].movie_configuration || []).filter(movie => movie.hour && movie.day_id).find(movie => movie.day_id == selectedDayIndex && this.isTimeEqual(movie.hour, nextHourPerformance.time));
        let image = nextHourMovie ? nextHourMovie.image : null;
        let title = nextHourMovie ? nextHourMovie.title : this.$t("BOOKINGFLOW_PAGE.MOVIE");
        let localizedTitle = nextHourMovie && nextHourMovie.localized_title ? nextHourMovie.localized_title : {
          en: title,
          ar: title
        };
        if (!image) {
          image = {
            image_url: require('@/assets/images/BookingFlow/movie.webp'),
            alt_text: title,
            title: title
          }
        }

        return [
          {
            booking_card_icon: image,
            title: title,
            localizedTitle: localizedTitle,
            availability: nextHourPerformance.availability,
            slot: {
                slot: nextHourPerformance.time,
                ak: nextHourPerformance.ak,
            }
          }
        ];
      } else {
        return (this.performances || []).map(performance => {
          let movieData = (this.packageDetails.tickets[0].movie_configuration || []).find(movie => movie.hour && movie.day_id && movie.day_id == selectedDayIndex && this.isTimeEqual(movie.hour, performance.time));
          let image = movieData ? movieData.image : null;
          let title = movieData ? movieData.title : this.$t("BOOKINGFLOW_PAGE.MOVIE");
          let localizedTitle = movieData && movieData.localized_title ? movieData.localized_title : {
            en: title,
            ar: title
          };
          if (!image) {
            image = {
              image_url: require('@/assets/images/BookingFlow/movie.webp'),
              alt_text: title,
              title: title
            }
          }

          return {
            booking_card_icon: image,
            title: title,
            localizedTitle: localizedTitle,
            availability: performance.availability,
            slot: {
                slot: performance.time,
                ak: performance.ak,
            }
          };
        });
      }
    },
  },
  watch: {
    "changeEvt.date": {
      deep: true,
      immediate: true,
      handler() {
        this.getCinemaTicketSlots();
      },
    },
    "changeEvt.guest": {
      deep: true,
      immediate: true,
      handler() {
        this.checkAvailability();
      },
    },
  },
  mounted() {
    this.isDesktopDeviceLoc = this.detectDesktopLoc();
    window.addEventListener("resize", this.onResizeEvent);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResizeEvent);
  },
  methods: {
    isTimeEqual(movieTime, nextMovieTime){
      if(!movieTime || !nextMovieTime) return false;
      let movieTimeArr = movieTime.split(":");
      let nextMovieTimeSpanArr = nextMovieTime.split(":");
      let movieDateTime = moment().set({h: +movieTimeArr[0], m: +movieTimeArr[1], s: 0, millisecond: 0});
      let nextMovieDateTime = moment().set({h: +nextMovieTimeSpanArr[0], m: +nextMovieTimeSpanArr[1], s: 0, millisecond: 0});
      return movieDateTime.isSame(nextMovieDateTime);
    },
    checkAvailability(){
      if(this.guestSelection.isSelected){
        let selectedMoviePerformanceAK = this.guestSelection.ak;
        let people = this.packageDetails.people;
        let totalGuest = this.$getNumber(people.adult) + this.$getNumber(people.junior) + this.$getNumber(people.child);
        let movie = this.performances.find(performance => performance.ak == selectedMoviePerformanceAK);
        if(!movie) return false;
        let movieAvailability = movie.availability;
        if(totalGuest > movieAvailability){
          this.$showToast({
            type: "red",
            text: `${this.guestSelection.title} ${this.$t('BOOKINGFLOW_PAGE.IS_UNAVAILABLE_ON_THE_SELECTED_DATE')}`,
          });
          this.$emit("selectionCinemaChangeEmiter", {
            title: '',
            ak: '',
            isSelected: false,
            selectedSlot: '',
          });
        }
      }
    },
    isNextHourHasMovieInViva(bounsTime, performanceTime){
      let performanceTimeArr = performanceTime.split(":");
      let performanceDateTime = new Date().setHours(+performanceTimeArr[0], +performanceTimeArr[1], 0, 0);
      let bounsTimeArr = bounsTime.split(":");
      let bounsDateTime = new Date().setHours(+bounsTimeArr[0] + 1, +bounsTimeArr[1], 0, 0);
      return performanceDateTime == bounsDateTime;
    },
    selectionCinemaChangeEmit(data) {
      this.$emit("selectionCinemaChangeEmiter", data);
    },
    detectDesktopLoc() {
      return window.innerWidth >= 1024;
    },
    onResizeEvent() {
      this.isDesktopDeviceLoc = this.detectDesktopLoc();
      this.carouselKey = this.$getTimeStamp();
    },
    async getCinemaTicketSlots() {
      let movieProductAK = '';
      if(this.packageDetails && this.packageDetails.tickets && this.packageDetails.tickets.length){
        let eventsType = this.packageDetails.tickets[0].eventsType;
        movieProductAK = (eventsType.main || {}).performanceAK || (eventsType.adult || {}).performanceAK || (eventsType.junior || {}).performanceAK || (eventsType.child || {}).performanceAK || '';
      }
      if(!movieProductAK) return false;
      this.isLoading = true;
      let result = await this.$repositories.getCalendarAvailabilityCamp({
        from: this.packageDetails.date,
        to: this.packageDetails.date,
        eventAK: movieProductAK
      });

      this.performances = (result && result.DAYLIST  && result.DAYLIST.DAY && result.DAYLIST.DAY.PERFORMANCELIST && result.DAYLIST.DAY.PERFORMANCELIST.PERFORMANCE ? result.DAYLIST.DAY.PERFORMANCELIST.PERFORMANCE : []).map(performance => {
        return {
          ak: performance.AK,
          availability: +performance.AVAILABILITY.AVAILABLE,
          time: performance.TIME
        };
      });
      this.isLoading = false;
    },
  },
};
</script>
<style scoped lang="scss">
@import "./ActivitiesCinema.scss";
</style>
