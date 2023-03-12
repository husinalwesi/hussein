<template>
  <div class="main-tickets-container relative">
    <div
      id="tickets-container"
      :class="{
        selectedPackage: isSelectedPackage && !isBuyOrAddOns,
        isAddOnsEnabled: packageDetails.addOnsSelection.length > 0,
        'disabled-btn': isFullPageLoaderEnabled,
      }"
    >
      <div class="ticket-head-row">
        <div class="flex gap-2 flex-1">
          <p class="package-title">
            {{ $isUpgradedTicket(packageDetails) ? packageDetails.card.upgrade_title : packageDetails.card.title }}
          </p>
          <a
            v-if="
              (!isSelectedPackage || isBuyOrAddOns) &&
                !$route.fullPath.includes('buy-tickets')
            "
            href="javascript:void(0);"
            class="edit-package-button"
            @click="setActivePackage()"
          >{{ $t('BOOKINGFLOW_PAGE.EDIT') }}</a>
        </div>

        <div class="pacakge-price flex gap-1 justify-end">
          <template v-if="isSelectedPackage || isBuyOrAddOns">
            <!--TODO: get back here to fix this-->
            <span class="flex gap-1">
              <span class="ltr:order-1 rtl:order-2">{{ currency }}</span>
              <span class="ltr:order-2 rtl:order-1">{{ $decimalPlaces(calculatePerPersonAmount, true) }}</span>
            </span>
            {{ $t('BOOKINGFLOW_PAGE.PER_PERSON') }}
          </template>
          <template v-else>
            {{
              `${$t("COMMON.BINARY_PARTS", {
                key: currency,
                value: $decimalPlaces($calculatePackageTotalPrice(packageDetails) + $calculatePackageAddOnsTotalPrice(packageDetails), true)
              })}`
            }}
          </template>
        </div>
      </div>

      <div
        v-if="packageDetails.card.additional_price"
        class="additional-price-text-container"
      >
        <div class="ltr:mr-1 rtl:ml-1">
          {{
            `${$t("COMMON.BINARY_PARTS", {
              key: currency,
              value: packageDetails.card.additional_price
            })}`
          }}
        </div>
        {{ $t('BOOKINGFLOW_PAGE.PER_ADDITIONAL_PERSON') }}
      </div>

      <p
        v-if="packageDetails.card.level_note"
        class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-xs text-[#606060] mt-2"
      >
        {{ packageDetails.card.level_note }}
      </p>
      <div v-if="isUnavailableMsgEnabled" class="mt-2">
        <span class="unavailable-ticket">
          ⚠ {{ getGlobalNonEventMessage }}
        </span>
      </div>
      <div
        v-for="(messageItem, messageIndex) in getWarningMessages" :key="`warning-message-${messageIndex}`"
        class="mt-2"
      >
        <span class="unavailable-ticket"> {{ messageItem.message }} </span>
      </div>
      <div class="menu-with-ddl pt-4">
        <div v-click-outside="closeDateDDL" class="field-row">
          <button
            type="button"
            :class="{ ddlEnabled: isDateDDLEnabled }"
            @click="isDateDDLEnabled = !isDateDDLEnabled"
          >
            <BookingCalender :icon-color="getIconColor" />
            <p
              class="field-title"
              v-html="getNumberOfBookingDays > 1 ? getMultipleDates ? getMultipleDates : $t('BOOKINGFLOW_PAGE.WHEN_ARE_YOU_GOING') : $dateFormatter(packageDetails.date, 'dayMonthYear', false,'DD MMMM YYYY')"
            />
            <ArrowUp class="arrowUp" />
          </button>
          <div
            class="drop-down-list drop-down-list-date"
            :class="{ ddlEnabled: isDateDDLEnabled }"
          >
            <DateComponent
              :highlight="getNumberOfBookingDays"
              :data="{ selectedDate: packageDetails.date }"
              :allowed-disabled-dates="packageDetails.allowed_dates"
              :is-d-d-l-enabled="isDateDDLEnabled"
              :package-details="packageDetails"
              :immediate-emit="true"
              :date-type="getDateType"
              :dates="packageDetails.dates"
              :guest-count="getGuestCount"
              @emitDate="emitDateChangeHandler"
              @emitDateChangeHandlerImmediate="emitDateChangeHandlerImmediate"
              @emitDates="emitDatesChangeHandler"
              @dateLoaderEmiter="dateLoaderEmiter"
            />
          </div>
        </div>
        <div v-click-outside="closeGuestDDL" class="field-row mt-2">
          <button
            type="button"
            :class="{ ddlEnabled: isGuestDDLEnabled }"
            @click="isGuestDDLEnabled = !isGuestDDLEnabled"
          >
            <GuestIcon :icon-color="getIconColor" />
            <p class="field-title">
              {{
                getAgeText(getAdultCount, getJuniorCount, getChildCount) ||
                  $t('BOOKINGFLOW_PAGE.HOW_MANY_PEOPLE')
              }}
            </p>
            <ArrowUp class="arrowUp" />
          </button>
          <div
            class="drop-down-list drop-down-list-guest"
            :class="{ ddlEnabled: isGuestDDLEnabled }"
          >
            <div
              v-if="packageDetails.card.note_in_guests_menu"
              class="bg-blue-100 flex items-center px-4 py-3 rounded-t-lg shadow-md text-blue-900" role="alert"
            >
              <div>
                <exclamation-mark-icon
                  class="ltr:mr-4 rtl:ml-4" color="#3b82f6" width="24"
                  height="24"
                />
              </div>
              <p class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-sm">
                {{ packageDetails.card.note_in_guests_menu }}
              </p>
            </div>

            <People
              :id="`ticket-guest-${packageDetails.uniqueID}`"
              class="booking-flow"
              :is-d-d-l-enabled="isGuestDDLEnabled"
              :max-total="packageDetails.card.max_number_of_guests || packageDetails.card.required_quantity || 36"
              :initial-data="{
                adult: getAdultCount,
                child: getChildCount,
                junior: getJuniorCount,
              }"
              :enabled-age-type="enabledAgeTypeVar"
              :age-type-text="getAgeTypeText"
              :minimum_age="getMinimumAgeTicket"
              @emitCounterDataEmitter="emitCounterDataEmitterHandler"
            />
          </div>
        </div>
      </div>
      <div
        v-if="isCurrentRequiresSupervisionMessage"
        class="multiple-time-slots-container"
      >
        <span class="multiple-time-slots">{{
          staticLabels.requires_supervision_message
        }}</span>
      </div>
      <div
        v-if="isCurrentRequiresAdultMessage"
        class="multiple-time-slots-container"
      >
        <span class="multiple-time-slots">{{
          staticLabels.requires_adult_message
        }}</span>
      </div>
      <ul
        v-if="(isBuyOrAddOns || isSelectedPackage) && isPackageDetailsEnabled"
        class="ticket-list"
      >
        <Ticket
          v-for="(ticket, index) in getTicketsSelection"
          :key="index"
          :ticket-data="ticket"
          :package-details="packageDetails"
          :static-labels="staticLabels"
        />
      </ul>
      <div>
        <button type="button" class="removePackage" @click="removePackage()">
          {{ $t('BOOKINGFLOW_PAGE.REMOVE') }}
        </button>
      </div>
    </div>
    <AddOnsSide
      v-if="packageDetails.addOnsSelection.length > 0"
      :data="packageDetails.addOnsSelection"
      :current-step="currentStep"
      @editAddOnsEmiter="editAddOnsEmitHandler"
    />
  </div>
</template>
<script>
import BookingCalender from "@/components/SVGElements/BookingCalender.vue";
import GuestIcon from "@/components/SVGElements/GuestIcon.vue";
import ArrowUp from "@/components/SVGElements/ArrowUp.vue";
import Ticket from "@/components/BookingFlow/Ticket";
import AddOnsSide from "@/components/BookingFlow/AddOnsSide";
import People from "@/components/BookingBar/People";
import DateComponent from "@/components/BookingBar/Date";
import ExclamationMarkIcon from "@/components/SVGElements/exclamation-mark-icon";

export default {
  name: "Tickets",
  components: {
    BookingCalender,
    GuestIcon,
    ArrowUp,
    Ticket,
    People,
    DateComponent,
    AddOnsSide,
    ExclamationMarkIcon
  },
  props: {
    isFullPageLoaderEnabled: {
      type: Boolean,
      default: false,
    },
    packageDetails: {
      type: Object,
      default: () => {
      },
    },
    selectedPackageID: {
      type: String,
      default: "",
    },
    getSelectedPackageDate: {
      type: String,
      default: "",
    },
    index: {
      type: Number,
      default: 0,
    },
    currentStep: {
      type: String,
      default: "",
    },
    staticLabels: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['dateLoaderEmiter', 'editAddOnsEmiter', 'removePackageEmiter', 'changePackageEmiter', 'guestChangeEmiter', 'datesChangeEmiter', 'dateChangeEmiter'],
  data() {
    return {
      enabledAgeTypeVar: {
        adult: true,
        junior: true,
        child: true,
      },
      dates: [],
      isDateDDLEnabled: false,
      isGuestDDLEnabled: false,
      isPaymentStep: false,
      currency: ""
    };
  },
  computed: {
    getMinimumAgeTicket() {
      let tickets = this.packageDetails.tickets;
      let min = tickets.length ? tickets[0].minimum_age : 3;
      for (let index = 0; index < tickets.length; index++) {
        if (tickets[index].minimum_age < min) min = tickets[index].minimum_age;
      }
      return min;
    },
    calculatePerPersonAmount() {
      let days_of_booking =
        this.packageDetails.card.days_of_booking === 0
          ? 1
          : this.packageDetails.card.days_of_booking;
      if (this.getDateType == "default") days_of_booking = 1;
      return (this.$isUpgradedTicket(this.packageDetails) ? this.packageDetails.upgrade_ticket.price : this.packageDetails.card.price) * days_of_booking;
    },
    getDateType() {
      if (this.packageDetails.card.every_range_of_booking === 1) return "days";
      else if (this.packageDetails.card.every_range_of_booking === 2)
        return "week";
      // Defult -> 0
      // Day  ---> 1
      // Week ---> 2
      return "default";
    },
    getAgeTypeText() {
      if (
        this.packageDetails.cardType != "passes" &&
        this.packageDetails.cardType != "packages"
      ) {
        let ages_type_id = this.packageDetails.tickets[0].ages_type_id;
        let adult = "";
        let junior = "";
        let child = "";
        for (let index = 0; index < ages_type_id.length; index++) {
          if (ages_type_id[index] == 0) {
            return {
              adult: "ALL_AGES",
              junior: "ALL_AGES",
              child: "ALL_AGES",
            };
          } else if (ages_type_id[index] == 1) {
            adult = "ADULT_14_PLUS";
          } else if (ages_type_id[index] == 2) {
            junior = "JUNIOR_7_13";
          } else if (ages_type_id[index] == 3) {
            junior = "JUNIOR_8_13";
          } else if (ages_type_id[index] == 4) {
            child = "CHILD_3_6";
            let ticketRoleAge = Number(
              this.packageDetails.tickets[0].minimum_age
            );
            if (ticketRoleAge == 2) child = "CHILD_2_6";
          }
        }

        return {
          adult: adult,
          junior: junior,
          child: child,
        };
      }
      return "";
    },
    getWarningMessages() {
      if (this.staticLabels && this.staticLabels.cards_warning_messages && this.staticLabels.cards_warning_messages.length) {
        return (this.staticLabels.cards_warning_messages.filter(messageItem => messageItem.card_Id == this.packageDetails.card.id && messageItem.message) || []).slice(0, 2);
      }
      return [];
    },
    getGlobalMessageDate() {
      if (!this.isNonEventMsgEnabled) return "";
      let date = this.staticLabels.non_event_warning_wessage[0].date;
      let dateSTR = date.split("T")[0];
      let dateArrNew = dateSTR.split("-");
      // 2022-05-12
      return `${dateArrNew[1]}/${dateArrNew[2]}/${dateArrNew[0]}`;
    },
    isUnavailableEventMsgEnabled() {
      return "";
    },
    isUnavailableMsgEnabled() {
      if (
        this.packageDetails.cardType == "passes" &&
        this.isNonEventMsgEnabled
      ) {
        let selectedDate = this.$stringToDate(this.packageDetails.date);
        if (
          selectedDate.getTime() ==
          this.$stringToDate(this.getGlobalMessageDate).getTime()
        )
          return true;
      }

      return false;
    },
    isNonEventMsgEnabled() {
      return (
        this.staticLabels &&
        this.staticLabels.non_event_warning_wessage &&
        this.staticLabels.non_event_warning_wessage.length > 0
      );
    },
    getGlobalNonEventMessage() {
      if (!this.isNonEventMsgEnabled) return "";
      if (!this.staticLabels) return "";
      return this.staticLabels.non_event_warning_wessage[0].message;
    },
    isPackageDetailsEnabled() {
      return (
        this.packageDetails.cardType == "packages" ||
        this.packageDetails.card.is_table ||
        this.packageDetails.card.is_movie ||
        this.$isUpgradedTicket(this.packageDetails)
      );
    },
    getIconColor() {
      return this.isSelectedPackage && !this.isBuyOrAddOns
        ? "#142B73"
        : "#1A1A1A";
    },
    isBuyOrAddOns() {
      return (
        this.currentStep == "buy-tickets" ||
        (this.currentStep == "add-ons" &&
          this.packageDetails.cardType == "packages") ||
        (this.currentStep == "personal-details" &&
          this.packageDetails.cardType == "packages") ||
        ((this.currentStep == "personal-details" ||
            this.currentStep == "buy-tickets" ||
            this.currentStep == "add-ons") &&
          this.packageDetails.cardType == "passes" &&
          (this.packageDetails.isPassTimebased || this.packageDetails.card.is_movie || this.$isUpgradedTicket(this.packageDetails))) ||
        ((this.currentStep == "buy-tickets" ||
            this.currentStep == "add-ons" ||
            this.currentStep == "personal-details") &&
          this.packageDetails.cardType == "lessons")
      );
    },
    isSelectedPackage() {
      return this.selectedPackageID == this.packageDetails.uniqueID;
    },
    getAdultCount() {
      let data = this.packageDetails.people.adult;
      return this.$getNumber(data);
    },
    getJuniorCount() {
      let data = this.packageDetails.people.junior;
      return this.$getNumber(data);
    },
    getChildCount() {
      let data = this.packageDetails.people.child;
      return this.$getNumber(data);
    },
    getTicketsSelection() {
      let tickets = [];

      if (this.isUpgradedTicketSelected(this.packageDetails)) {
        tickets.push({
          ak: "",
          isTimeBased: true,
          title: this.packageDetails.upgrade_ticket.title,
          isBonus: false,
          slotsSelection: {
            selectedSlot: this.packageDetails.upgradeSelection.selectedSlot,
            isMultipleSlots: false,
          },
          guest: {
            adult: this.packageDetails.people.adult,
            junior: this.packageDetails.people.junior,
            child: this.packageDetails.people.child,
          },
          isUpgradedTicket: true
        });
      }

      if (this.packageDetails.BonusTicketViewModel) {
        tickets.push({
          ak: "",
          isTimeBased: true,
          title: this.packageDetails.BonusTicketViewModel.title,
          isBonus: true,
          slotsSelection: {
            selectedSlot: this.packageDetails.bonusSelection.selectedSlot,
            isMultipleSlots: false,
          },
          guest: {
            adult: this.packageDetails.people.adult.length,
            junior: this.packageDetails.people.junior.length,
            child: this.packageDetails.people.child.length,
          },
        });
      }

      if (this.packageDetails.bonus_ticket) {
        tickets.push({
          ak: "",
          isTimeBased: true,
          title: this.packageDetails.bonus_ticket.title,
          isBonus: true,
          slotsSelection: {
            selectedSlot:
            this.packageDetails.bonus_ticketSelection.selectedSlot,
            isMultipleSlots: false,
          },
          guest: {
            adult: this.packageDetails.people.adult,
            junior: this.packageDetails.people.junior,
            child: this.packageDetails.people.child,
          },
        });
      }
      if (this.packageDetails.card.is_table) {
        let adult = this.packageDetails.people.adult;
        let junior = this.packageDetails.people.junior;
        let child = this.packageDetails.people.child;
        let totalGuest = adult + junior + child;
        let tablesCount = this.$getTablesCountDependsOnNumberOfGuest(
          totalGuest,
          this.packageDetails.card.max_number_per_table
        );
        tickets.push({
          ak: "",
          isTimeBased: true,
          title: this.$pluralTextHandler(tablesCount, 'TABLES_RESERVED'),
          isBonus: false,
          guest: {
            adult: adult,
            junior: junior,
            child: child,
          },
          enableAdultSuperVisionMessage: this.isTicketAdultRequiredTable(
            this.packageDetails.tickets[0]
          ),
          enableAdultMessage: this.isTicketAdultRequiredTableNonSupervision(
            this.packageDetails.tickets[0]
          ),
        });
      } else if (this.packageDetails.card.is_movie) {
        if (this.packageDetails.guestSelection.isSelected) {          
          const isArabicLocale = this.$i18n.localeProperties.detectedLang === 'ar';
          let enName = this.packageDetails.guestSelection && this.packageDetails.guestSelection.localizedTitle && this.packageDetails.guestSelection.localizedTitle.en ? this.packageDetails.guestSelection.localizedTitle.en : this.packageDetails.guestSelection.title;
          let arName = this.packageDetails.guestSelection && this.packageDetails.guestSelection.localizedTitle && this.packageDetails.guestSelection.localizedTitle.ar ? this.packageDetails.guestSelection.localizedTitle.ar : this.packageDetails.guestSelection.title;
          tickets.push({
            ak: "",
            isTimeBased: true,
            title: isArabicLocale ? arName : enName,
            isBonus: false,
            slotsSelection: {
              selectedSlot: this.packageDetails.guestSelection.selectedSlot,
              isMultipleSlots: false,
            },
            enableAdultSuperVisionMessage: false,
            enableAdultMessage: false,
            guest: {
              adult: this.packageDetails.people.adult,
              junior: this.packageDetails.people.junior,
              child: this.packageDetails.people.child,
            },
          });
        }
        //
      } else {
        if (this.packageDetails.tickets.length > 0) {
          let adultCounter = this.packageDetails.people.adult.length;
          for (
            let index = 0;
            index < this.packageDetails.tickets.length;
            index++
          ) {
            //
            let adult = this.getSelectionTicketsOfAgeType(
              this.packageDetails,
              "adult",
              this.packageDetails.tickets[index].id
            );
            let child = this.getSelectionTicketsOfAgeType(
              this.packageDetails,
              "child",
              this.packageDetails.tickets[index].id
            );
            let junior = this.getSelectionTicketsOfAgeType(
              this.packageDetails,
              "junior",
              this.packageDetails.tickets[index].id
            );
            //
            if (adult.length > 0 || child.length > 0 || junior.length > 0) {
              tickets.push({
                ak: this.packageDetails.tickets[index].adult_ak,
                isTimeBased:
                  this.packageDetails.tickets[index].eventsType["adult"]
                    .isTimeBased || false,
                title: this.packageDetails.tickets[index].title,
                isBonus: false,
                slotsSelection: {
                  selectedSlot: "",
                  isMultipleSlots: false,
                },
                enableAdultSuperVisionMessage: this.isTicketAdultRequired(
                  this.packageDetails.tickets[index]
                ),
                enableAdultMessage:
                  adultCounter > 0
                    ? false
                    : this.isTicketAdultRequiredNonSupervision(
                      this.packageDetails.tickets[index]
                    ),
                guest: {
                  adult: adult,
                  junior: junior,
                  child: child,
                },
              });
            }
          }
        }
      }
      return tickets;
    },
    getNumberOfBookingDays() {
      return this.packageDetails.card.days_of_booking === 0
        ? 1
        : this.packageDetails.card.days_of_booking;
    },
    getMultipleDates() {
      let months = [
        this.$t('BOOKINGFLOW_PAGE.JANUARY'),
        this.$t('BOOKINGFLOW_PAGE.FEBRUARY'),
        this.$t('BOOKINGFLOW_PAGE.MARCH'),
        this.$t('BOOKINGFLOW_PAGE.APRIL'),
        this.$t('BOOKINGFLOW_PAGE.MAY'),
        this.$t('BOOKINGFLOW_PAGE.JUNE'),
        this.$t('BOOKINGFLOW_PAGE.JULY'),
        this.$t('BOOKINGFLOW_PAGE.AUGUEST'),
        this.$t('BOOKINGFLOW_PAGE.SEPTEMBER'),
        this.$t('BOOKINGFLOW_PAGE.OCTOBER'),
        this.$t('BOOKINGFLOW_PAGE.NOVEMBER'),
        this.$t('BOOKINGFLOW_PAGE.DECEMBER'),
      ];
      let dates = [];

      let globalDates = this.packageDetails.dates;
      for (let index = 0; index < globalDates.length; index++) {
        let date = this.$stringToDate(globalDates[index]);
        dates.push({
          day: date.getDate(),
          month: months[date.getMonth()],
          year: date.getFullYear(),
        });
      }
      //
      let str = ``;
      for (let index = 0; index < dates.length; index++) {
        if (index != 0) {
          if (dates[index].month !== dates[index - 1].month) {
            str += ` <span class='date-space'>&nbsp;${dates[index - 1].month}</span> `;
            if (dates[index].year !== dates[index - 1].year)
              str += ` <span class='date-space'>&nbsp;${dates[index - 1].year}</span> `;
            str += ` <span class='date-space'>,&nbsp;</span> `;
          } else {
            if (dates[index - 1].day + 1 == dates[index].day) {
              str += ` <span class='date-space'>-</span> `;
            } else {
              if (dates[index].day == 1) {
                str += ` <span class='date-space'>-</span> `;
              } else {
                str += ` <span class='date-space'>,</span> `;
              }
            }
          }
          if (index + 1 == dates.length) {
            // no more iterations.
            str += ` <span class='date-space'>${dates[index].day}</span>&nbsp;<span>${dates[index].month} ${dates[index].year}</span> `;
          } else {
            // there is more iterations.
            if (dates[index].month === dates[index + 1].month) {
              str += ` <span class='date-space'>${dates[index].day}</span> `;
            } else {
              str += ` <span class='date-space'>${dates[index].day}</span> `;
              if (dates.length == 2) {
                str += ` <span class='date-space'>&nbsp;${dates[index].month}</span> `;
              }
            }
          }
        } else {
          str += ` <span class='date-space first-date-space'>${dates[index].day}</span> `;
        }
      }
      return str;
    },
    isCurrentRequiresSupervisionMessage() {
      if (
        this.$isEmptyObject(this.packageDetails.BonusTicketViewModel) &&
        this.$isEmptyObject(this.packageDetails.bonus_ticket) &&
        !this.packageDetails.card.is_table &&
        !this.packageDetails.card.is_movie
      ) {
        return this.isTicketAdultRequiredTable(this.packageDetails.tickets[0]);
      }
      return false;
    },
    isCurrentRequiresAdultMessage() {
      if (
        this.$isEmptyObject(this.packageDetails.BonusTicketViewModel) &&
        this.$isEmptyObject(this.packageDetails.bonus_ticket) &&
        !this.packageDetails.card.is_table &&
        !this.packageDetails.card.is_movie
      ) {
        return this.isTicketAdultRequiredTableNonSupervision(
          this.packageDetails.tickets[0]
        );
      }
      return false;
    },
    getGuestCount(){
      return this.getAdultCount + this.getJuniorCount + this.getChildCount;
    },
  },
  watch: {
    packageDetails: {
      handler(newVal, oldVal) {
        if (newVal) {
          if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
            setTimeout(() => {
              this.enabledAgeType();
            });
          }
        }
      },
      immediate: true,
      deep: true,
    },
    isDateDDLEnabled() {
      this.$restContainerPadding();
      this.$nextTick(() => {
        this.$handleDDLScroll();
      });
    },
    isGuestDDLEnabled() {
      this.$restContainerPadding();
      this.$nextTick(() => {
        this.$handleDDLScroll();
      });
    },
  },
  created() {
    this.currency = this.$getSiteConfig('currency');
  },
  methods: {
    dateLoaderEmiter(data) {
      this.$emit("dateLoaderEmiter", data);
    },
    enabledAgeType() {
      if (this.packageDetails.cardType == "passes") {
        let ticketRoleAge = this.packageDetails.tickets.length ? this.packageDetails.tickets[0].minimum_age : 3;
        let junior = !this.$isTicketNeedSupervision(ticketRoleAge, "junior");
        let child = !this.$isTicketNeedSupervision(ticketRoleAge, "child");
        this.emitCounterDataEmitterHandlerEnabledDisabled(true, junior, child);
        this.enabledAgeTypeVar = {
          adult: true,
          junior: junior,
          child: child,
        };
      } else if (
        this.packageDetails.cardType != "passes" &&
        this.packageDetails.cardType != "packages"
      ) {
        let adult = false;
        let junior = false;
        let child = false;
        let ages_type_id = this.packageDetails.tickets[0].ages_type_id;
        for (let index = 0; index < ages_type_id.length; index++) {
          if (ages_type_id[index] == 0) {
            this.enabledAgeTypeVar = {
              adult: true,
              junior: true,
              child: true,
            };
          } else if (ages_type_id[index] == 1) {
            adult = true;
          } else if (ages_type_id[index] == 2 || ages_type_id[index] == 3) {
            junior = true;
          } else if (ages_type_id[index] == 4) {
            child = true;
          }
        }
        //
        this.emitCounterDataEmitterHandlerEnabledDisabled(adult, junior, child);
        this.enabledAgeTypeVar = {
          adult: adult,
          junior: junior,
          child: child,
        };
      } else if (this.packageDetails.cardType == "packages") {
        //
        let junior = false;
        let child = false;
        for (
          let index = 0;
          index < this.packageDetails.tickets.length;
          index++
        ) {
          let ticketRoleAge = this.packageDetails.tickets[index].minimum_age;
          let junior_local = !this.$isTicketNeedSupervision(
            ticketRoleAge,
            "junior"
          );
          let child_local = !this.$isTicketNeedSupervision(
            ticketRoleAge,
            "child"
          );
          //
          if (junior_local) junior = true;
          if (child_local) child = true;
        }
        this.emitCounterDataEmitterHandlerEnabledDisabled(true, junior, child);
        this.enabledAgeTypeVar = {
          adult: true,
          junior: junior,
          child: child,
        };
        //
      } else {
        this.enabledAgeTypeVar = {
          adult: true,
          junior: true,
          child: true,
        };
      }
    },
    emitCounterDataEmitterHandlerEnabledDisabled(adult, junior, child) {
      let adult_counter = adult ? this.getAdultCount : 0;
      let junior_counter = junior ? this.getJuniorCount : 0;
      let child_counter = child ? this.getChildCount : 0;
      let totalCounter = adult_counter + junior_counter + child_counter;
      if (totalCounter == 0) {
        if (adult) {
          if (!adult_counter) adult_counter = 1;
        } else if (junior) {
          if (!junior_counter) junior_counter = 1;
        } else if (child) {
          if (!child_counter) child_counter = 1;
        }
      }
      //
      this.emitCounterDataEmitterHandler({
        totalCounter: adult_counter + junior_counter + child_counter,
        data: {
          adult: adult_counter,
          junior: junior_counter,
          child: child_counter,
        },
      });
    },
    isTicketAdultRequiredTableNonSupervision(ticket) {
      if (this.packageDetails.people.adult > 0) return false;
      //
      if (ticket.required_adult) {
        if (
          this.packageDetails.people.junior > 0 ||
          this.packageDetails.people.child > 0
        )
          return true;
      }
      return false;
    },
    isSupervisionSelected() {
      for (
        let index = 0;
        index < this.packageDetails.addOnsSelection.length;
        index++
      ) {
        if (
          this.packageDetails.addOnsSelection[index].addOnsType == "supervision"
        )
          return true;
      }
      return false;
    },
    isTicketAdultRequiredTable(ticket) {
      if (this.isSupervisionSelected()) return false;
      if (this.packageDetails.people.adult > 0) return false;
      //
      if (ticket.requires_adult_supervision) {
        if (
          this.packageDetails.people.junior > 0 ||
          this.packageDetails.people.child > 0
        )
          return true;
      }
      return false;
    },
    isMovieAdultRequired(ticket) {
      if (ticket.requires_adult_supervision) {
        if (ticket.id == this.packageDetails.guestSelection.id) {
          if (this.packageDetails.people.adult > 0) {
            return false;
          } else {
            if (
              this.packageDetails.people.junior > 0 ||
              this.packageDetails.people.child > 0
            )
              return true;
          }
        }
      }
      return false;
    },
    isMovieAdultRequiredNonSupervision(ticket) {
      if (ticket.required_adult) {
        if (ticket.id == this.packageDetails.guestSelection.id) {
          if (this.packageDetails.people.adult > 0) {
            return false;
          } else {
            if (
              this.packageDetails.people.junior > 0 ||
              this.packageDetails.people.child > 0
            )
              return true;
          }
        }
      }
      return false;
    },
    isTicketAdultRequired(ticket) {
      if (this.isSupervisionSelected()) return false;
      if (ticket.requires_adult_supervision)
        return this.checkIfTicketSelectionHasAdultSelection(ticket.id);
      return false;
    },
    isTicketAdultRequiredNonSupervision(ticket) {
      if (ticket.required_adult)
        return this.checkIfTicketSelectionHasAdultSelection(ticket.id);
      return false;
    },
    checkIfTicketSelectionHasAdultSelection(ticketID) {
      for (const ageType in this.packageDetails.people) {
        for (
          let index = 0;
          index < this.packageDetails.people[ageType].length;
          index++
        ) {
          if (this.packageDetails.people[ageType][index].id == ticketID) {
            if (ageType == "adult") {
              if (this.packageDetails.people[ageType][index].isSelected)
                return false;
            } else {
              if (this.packageDetails.people[ageType][index].isSelected) {
                return true;
              }
            }
          }
        }
      }
      return false;
    },
    editAddOnsEmitHandler() {
      this.$emit("editAddOnsEmiter");
    },
    getMovieIndexByID(movieID) {
      for (let index = 0; index < this.packageDetails.tickets.length; index++) {
        if (this.packageDetails.tickets[index].id == movieID) return index;
      }
      return 0;
    },
    removePackage() {
      this.$emit("removePackageEmiter", true);
    },
    setActivePackage() {
      this.$emit("changePackageEmiter", true);
    },
    closeDateDDL() {
      this.isDateDDLEnabled = false;
    },
    closeGuestDDL() {
      this.isGuestDDLEnabled = false;
    },
    emitCounterDataEmitterHandler(data) {
      if (this.isSelectedPackage) {
        this.$emit("guestChangeEmiter", data);
      }
    },
    emitDatesChangeHandler(dates) {
      this.dates = dates;
      this.$emit("datesChangeEmiter", dates);
    },
    emitDateChangeHandler(data) {
      this.$emit("dateChangeEmiter", data);
      if (this.isDateDDLEnabled) {
        setTimeout(() => {
          this.isDateDDLEnabled = false;
        }, 500);
      }
    },
    emitDateChangeHandlerImmediate(data) {
      if (this.isSelectedPackage) {
        this.$emit("dateChangeEmiter", data);
      }
    },
    getAgeText(adult, junior, child) {
      let tempAgeTextArr = [];
      if (adult > 0) tempAgeTextArr.push(`${this.$t(`BOOKINGFLOW_PAGE.${this.$options.filters.plural("adult", adult)}`, {count: adult})}`);
      if (junior > 0) tempAgeTextArr.push(`${this.$t(`BOOKINGFLOW_PAGE.${this.$options.filters.plural("junior", junior)}`, {count: junior})}`);
      if (child > 0) tempAgeTextArr.push(`${this.$t(`BOOKINGFLOW_PAGE.${this.$options.filters.plural("child", child)}`, {count: child})}`);

      return tempAgeTextArr
        .map((ageTextItem) => {
          return ageTextItem;
        })
        .join(", ");
    },
    isUpgradedTicketSelected(packageDetails) {
      return this.$isUpgradedTicket(packageDetails) ? packageDetails.upgradeSelection.isSelected : false;
    },
    getSelectionTicketsOfAgeType(packageDetails, ageType, ticketID) {
      if (packageDetails.people && typeof packageDetails.people[ageType] === "object") {
        return packageDetails.people[ageType].filter((guest) => {
          return guest.id == ticketID && guest.isSelected;
        });
      }
      return false;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./Tickets.scss";
</style>
