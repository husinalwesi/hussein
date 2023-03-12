<template>
  <div class="gear">
    <div :class="customClass">
      <CardContainer wrapper-classes="px-[15px] pb-[31px] pt-[23px] md:px-[23px] md:py-[31px]">
        <template #card-content>
          <div class="mb-8 flex justify-between">
            <div>
              <div class="card-title">
                {{ userGear ? $t('GEAR.TITLE') : $t('GEAR.POST_BOOKING_TITLE') }}
              </div>
              <div class="description-wrapper">
                <div v-if="!userGear" class="description">
                  {{
                    $t('GEAR.POST_BOOKING_DESCRIPTION', {
                      location: $t(`LOCATIONS.${currentEnv}`),
                      country: $t(`LOCATIONS.${country}`)
                    })
                  }}
                </div>
                <div v-else class="description">
                  {{ $t('GEAR.DESCRIPTION') }}
                </div>
              </div>
            </div>
            <div v-if="showBackBtn" class="hidden md:block">
              <BaseButton
                class-name="back-btn"
                :text="$t('HEADER.GO_BACK')"
                btn-type="button"
                @onBtnClick="goBackClicked"
              />
            </div>
          </div>
          <div class="card-body">
            <template v-if="isError">
              <NoDataFound
                no-data-text="An error occurred while getting your gear, please try again."
                container-classes="my-8"
                @fetchData="getData()"
              />
            </template>
            <template v-else>
              <snowflake-loader
                v-if="isLoading"
                loader-wrapper-classes="h-52 bg-[#ffffff6e] rounded-3xl"
                loader-classes="w-24 h-24"
              />
              <template v-else>
                <!--              //profile-->
                <template v-if="userGear">
                  <div
                    v-for="(user,mainIndex) in orderData"
                    :key="mainIndex"
                    :class="{'mt-8': mainIndex !== 0}"
                  >
                    <div class="guest-list flex flex-col gap-y-2">
                      <div class="guest-card relative flex flex-col">
                        <div
                          class="flex flex-row justify-between mobiles:flex-col cursor-pointer"
                          @click="openGear(user)"
                        >
                          <div class="mobiles:mb-2">
                            <div class="flex gap-1 capitalize">
                              <div class="user-name fit-width">
                                {{ user.name }}
                              </div>
                              <div
                                v-if="!user.parent_user_id"
                                class="primary-account-text"
                              >
                                {{ `- ${$t("GEAR.PRIMARY_ACCOUNT")}` }}
                              </div>
                            </div>
                            <div class="description">
                              {{ getEquipmentStatus(getUserTicketGear(user)) }}
                            </div>
                          </div>
                          <div
                            class="flex gap-x-2 items-center mobiles:content-start mobiles:justify-end mobiles:flex-row-reverse"
                          >
                            <div class="flex flex-row-reverse md:flex-row gap-2 md:gap-4">
                              <div
                                class="flex items-center ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold text-[0.75rem] text-dark-gray leading-4"
                              >
                                {{ getGearStatus(user) }}
                              </div>
                              <!--TODO: Modify this element--->
                              <arrow-svg
                                :with-wrapper="true"
                                :wrapper-class="`w-6 h-6 md:w-8 md:h-8 ${
                                  selectedRow === user.id
                                    ? 'bg-dark-gray'
                                    : getGearStatus(user, 'icon') === 'checkmark'
                                      ? 'bg-[#142B73]'
                                      : 'bg-[#0a14321a]'
                                }`"
                                :direction="selectedRow === user.id ? 'up' : 'down'"
                                :check-mark-icon="selectedRow === user.id ? false : getGearStatus(user, 'icon') === 'checkmark'"
                                :arrow-color="selectedRow === user.id ? '#FFFFFF' : getGearStatus(user, 'icon') === 'checkmark' ? '#FFFFFF' : '#0A1432'"
                                :checkmark-attrs="{
                                  viewBox: '0 0 15 15',
                                  width: '16',
                                  height: '16'
                                }"
                              />
                            </div>
                          </div>
                        </div>
                        <GearForm
                          v-if="selectedRow===user.id"
                          :gear-data="selectedGear"
                          :user="user"
                          :is-user="true"
                          :user-type="getUserType(user)"
                          :meta-data="filterGear(user)"
                          @saveGear="saveGear()"
                        />
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else-if="orderData&&orderData.collections">
                  <div
                    v-for="(mainTicket,mainIndex) in orderData.collections"
                    :key="mainIndex"
                    :class="{'mt-8': mainIndex !== 0}"
                  >
                    <div class="flex flex-row items-end justify-between pb-2 md:pb-4">
                      <div class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold  flex items-center">
                        {{ $getItemTitle(mainTicket) }}
                      </div>
                      <div v-if="mainIndex === 0" class="flex flex-col action-details">
                        {{ $t('BOOKING_CONFIRMATION.BOOKING_REFERENCE') }}
                        <div v-if="orderData" class="sub-action pt-1">
                          {{ orderData.reservation_code }}
                        </div>
                      </div>
                    </div>
                    <div class="guest-list flex flex-col gap-y-2">
                      <template v-for="ticket of filterUniqueTickets(mainTicket.tickets)">
                        <div
                          v-if="ticket.is_addon ? ticket.is_supervision : true"
                          :key="ticket.id"
                          class="guest-card relative flex flex-col"
                        >
                          <div
                            class="flex flex-col gap-x-6 justify-between md:flex-row md:items-center"
                            @click="isValidGear(mainTicket.event_date)?openGear(ticket):''"
                          >
                            <div class="user-name mb-2 md:mb-0 capitalize">
                              {{ getUser(ticket).name }}
                            </div>
                            <!-- TODO: Modify SVGs, spans and components -->
                            <div v-if="isValidGear(mainTicket.event_date)" class="flex flex-1 justify-between flex-row-reverse md:flex-row flex-wrap gap-2">
                              <div
                                v-if="!getUserTicketGear(ticket).isNew&&selectedRow!==ticket.id"
                                class="flex pointer-events-none flex-row items-center gap-x-[27px] md:gap-x-10"
                              >
                                <BaseCheckbox
                                  v-if="ticket.need_gear&&!isGuest&&isDubaiEnv"
                                  :id="`equipmentCheckboxModel`"
                                  :value="getUserTicketGear(ticket)?!!getUserTicketGear(ticket).equipment_id:false"
                                  :label="$t('GEAR.EQUIPMENT')"
                                />
                                <BaseCheckbox
                                  :id="`equipmentCheckboxModel`"
                                  :value="getUserTicketGear(ticket)?getUserTicketGear(ticket).GearItems.length>0:false"
                                  :label="$t('GEAR.GEAR')"
                                />
                              </div>
                              <!-- TODO: Use the predefined icons components rather than SVGs -->
                              <div class="accordion-icons-wrapper" :class="{'open-gear': selectedRow === ticket.id}">
                                <svg
                                  v-if="
                                    !getUserTicketGear(ticket).isNew ||
                                      selectedRow === ticket.id
                                  "
                                  :width="$globalData.isMobileDevice ? '24' : '32'"
                                  :height="$globalData.isMobileDevice ? '24' : '32'"
                                  viewBox="0 0 32 32"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  class="lg:hover:cursor-pointer"
                                >
                                  <circle
                                    r="16"
                                    transform="matrix(1 0 0 -1 16 16)"
                                    fill="#ECECEC"
                                  />
                                  <path
                                    d="M8.36106 14.1402L8.31718 14.0966H8.25532H7.09229H6.72866L6.98653 14.353L14.1724 21.4973L14.2785 21.6028L14.3842 21.497L14.9657 20.9155L15.0721 20.8091L14.9654 20.703L8.36106 14.1402Z"
                                    fill="#1A1A1A"
                                    stroke="#1A1A1A"
                                    stroke-width="0.3"
                                  />
                                  <path
                                    d="M24.9756 14.3529L25.2332 14.0966H24.8698H23.6653H23.6031L23.5592 14.1405L15.8749 21.8248L15.8749 21.8248L15.2933 22.4063L15.1873 22.5124L15.2933 22.6185L15.8749 23.2L15.9807 23.3058L16.0868 23.2002L24.9756 14.3529Z"
                                    fill="#1A1A1A"
                                    stroke="#1A1A1A"
                                    stroke-width="0.3"
                                  />
                                  <path
                                    d="M16.1241 21.5756L15.2933 22.4063L15.3994 22.5124L15.5055 22.6184L16.3362 21.7877L16.2302 21.6816L16.1241 21.5756Z"
                                    fill="#1A1A1A"
                                    stroke="#1A1A1A"
                                    stroke-width="0.3"
                                  />
                                  <path
                                    d="M15.003 20.4541L14.1723 21.2849L14.2783 21.3909L14.3844 21.497L15.2151 20.6663L15.1091 20.5602L15.003 20.4541Z"
                                    fill="#1A1A1A"
                                    stroke="#1A1A1A"
                                    stroke-width="0.3"
                                  />
                                </svg>
                                <div
                                  v-else
                                  class="flex flex-row-reverse md:flex-row gap-2 md:gap-4 items-center lg:hover:cursor-pointer"
                                >
                                  <span class="add-gear-text">{{ $t("GEAR.ADD_GEAR") }}</span>
                                  <svg
                                    :width="$globalData.isMobileDevice ? '24' : '32'"
                                    :height="$globalData.isMobileDevice ? '24' : '32'"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <circle
                                      cx="16"
                                      cy="16"
                                      r="16"
                                      fill="#ECECEC"
                                    />
                                    <path
                                      d="M15.8672 8.11719L16.0167 23.9995"
                                      stroke="#1A1A1A"
                                    />
                                    <path
                                      d="M23.8831 15.8987L8.14035 15.8987"
                                      stroke="#1A1A1A"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <label v-else class="limit-text">
                              {{ $t('GEAR.HOURS_LIMIT', {hour: 24}) }}
                            </label>
                          </div>
                          <div v-if="selectedRow === ticket.id">
                            <GearForm
                              :ticket="ticket"
                              :user-type="getUserType(ticket)"
                              :gear-data="selectedGear"
                              :is-ski-school="mainTicket.type==='ski_school'"
                              :user="getUser(ticket)"
                              :meta-data="filterGear(ticket)"
                              :related-tickets="getRelatedTickets(mainTicket.tickets,ticket)"
                              @saveGear="saveGear()"
                            />
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
              </template>
            </template>
          </div>
        </template>
      </CardContainer>
      <SharedModal
        :custom-class="'base-modal-body lg flex flex-col full-modal'"
        :btn-class="'flex justify-end justify-items-end'"
        :modal-data="closeFormModalData"
        :modal-content-class="'text-start'"
        :is-modal-active="isWarningModalActive"
        @btnClicked="closePopup($event)"
      />
    </div>
  </div>
</template>

<script>
import * as _ from "lodash"
import moment from "moment-timezone";
import {customLayerEndPoints} from "@/const/api";
import {CommonEvent} from "@/services/app-events";

import NoDataFound from "@/components/Accounts/Shared/NoDataFound";
import SharedModal from "@/components/Shared/SharedModal";
import GearForm from "./GearForm";

import {AppConfig} from "@/const/variable";

export default {
  name: "Gear",
  components: {
    NoDataFound,
    SharedModal,
    GearForm,
  },
  props: {
    customClass: {
      type: String,
      default: () => "w-full lg:w-[40.5rem]",
    },
    showBackBtn: {
      type: Boolean,
      default: false,
    },
    showCheckboxContainer: {
      type: Boolean,
      default: true,
    },
    showChangeLabel: {
      default: false,
      type: Boolean,
    },
    showBookingRefernce: {
      default: true,
      type: Boolean,
    },
    showIsPrimary: {
      type: Boolean,
      default: false,
    },
    userGear: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isError: false,
      userDetails: {},

      equipmentCheckboxModel: false,
      gearCheckboxModel: false,
      gearExpand: false,
      tickets: [],
      orderData: {},
      metaData: [],
      userList: [],
      gears: [],
      f: [],
      id: Date.now(),
      isLoading: true,
      showAddLoader: false,
      selectedGear: {},
      selectedRow: -1,
      closeFormModalData: {
        title: this.$t('GEAR.WARNING_MODAL.TITLE'),
        description: this.$t('GEAR.WARNING_MODAL.DESCRIPTION'),
        noText: this.$t('GEAR.WARNING_MODAL.NO_TEXT'),
        btnConfirmationText: this.$t('GEAR.WARNING_MODAL.CONFIRMATION_TEXT'),
      },
      isWarningModalActive: false,
      newItem: {},
      isGuest: false,
      tod: new Date(),
      currentEnv: '',
      isDubaiEnv: false,
      country: 'UAE',
      gearStatusTypes: {
        add: {
          text: this.$t('GEAR.ADD_GEAR'),
          icon: "arrow-svg"
        },
        updateEquipment: {
          text: this.$t('GEAR.UPDATE_EQUIPMENT'),
          icon: "arrow-svg"
        },
        updateGear: {
          text: this.$t('GEAR.UPDATE_GEAR'),
          icon: "arrow-svg"
        },
        change: {
          text: this.$t('GEAR.CHANGE'),
          icon: "checkmark"
        }
      }
    };
  },
  created() {
    this.currentEnv = this.$getSiteCurrentEnvironment(false, true);
    this.isDubaiEnv = this.currentEnv.toLowerCase().includes("dubai");

    if (this.currentEnv.toLowerCase().includes("oman")) {
      this.country = 'OMAN'
    }

  },
  mounted() {
    this.getData();
    this.isGuest = !this.$isUserAuthenticated();
  },
  methods: {
    /**
     * Open User Gear
     * @param {Object} item user/ticekt
     * @return void
     */
    openGear(item) {
      if (this.selectedRow === -1) {
        this.setOpenSectionData(item);
        this.newItem = item;
      } else if (this.selectedRow === item.id) {
        this.selectedRow = -1;
        this.newItem = {};
        this.isWarningModalActive = false;
      } else {
        this.newItem = item;
        this.moveToNewSection(item);
        // this.setOpenSectionData(item)
      }
    },
    /**
     * Go Back to Profile Screen
     * @return void
     */
    goBackClicked() {
      this.$router.push(this.localePath("/accounts/profile/personal-details"));
    },
    /**
     * Get User Gear Data Based on Flow post-booking/profile
     * @param {boolean} showLoader show data loading
     * @return void
     */
    async getData(showLoader = true, isFetchGearMetaData = true) {
      try {
        if (this.isError) this.isError = false;

        this.isLoading = showLoader;

        if (!this.userGear) {
          let res = await this.$repositories.getGear(this.$route.params.id);
          if (res && res.isError) {
            this.orderData = {};
            this.isError = true;
          } else {
            if (res && res.collections)
              res.collections = res.collections.filter((item) =>
                this.isValidDateEvent(item.event_date) && item.type.toLowerCase() !== 'membership'
              );

            this.orderData = res;
          }
        } else {
          //TODO remove -1 once backend change it
          this.orderData = await this.$repositories.getUsersGears(-1);
        }

        if (isFetchGearMetaData) await this.getMetaData();

        this.isLoading = false;
      } catch (err) {
        this.isError = false;
        this.isLoading = false;
        console.log({err});
      }
    },
    /**
     * Get Gear/Equipment  Data From CMS
     * @return void
     */
    async getMetaData() {
      this.metaData = await this.$repositories.getGearMetaData()
    },
    /**
     * Collapse card when gear saved
     * @return void
     */
    async saveGear() {
      this.selectedRow = -1;
      await this.getData(false, false);
    },
    /**
     * Disabled Bottom Bar Button when no gear selected in post-booking
     * @return void
     */
    disabledBottomButton() {
      if (document.getElementById("submit-btn"))
        document.getElementById("submit-btn").classList.add("disabled-btn");
    },
    /**
     * Check Equipment Status based on selected Equipment
     * @param {Object} gear User Gear Data
     * @return string
     */
    getEquipmentStatus(gear) {

      if (!this.isDubaiEnv) {
        if (gear.GearItems && gear.GearItems.length > 0) {
          return this.$t("GEAR.COMPLETE");
        }
        return this.$t("GEAR.INCOMPLETE");
      }

      if (!gear.equipment_id) {
        return this.$t("GEAR.INCOMPLETE");
      }

      let userEquipment = this.metaData?.equipments.find(
        (item) => item.id.toString() === gear.equipment_id.toString()
      );

      if (!userEquipment) {
        return this.$t("GEAR.INCOMPLETE");
      } else if (
        userEquipment.title.toLowerCase().indexOf("snowboard") !== -1
      ) {
        return "Snowboarder";
      } else if (
        userEquipment.title.toLowerCase().indexOf("skis and poles") !== -1
      ) {
        return "Skier";
      }
    },
    /**
     * Check Gear Status based on selected Gear
     * @param {Object} ticketGear User Ticket Gear
     * @return string
     */
    getGearStatusType(ticketGear) {
      const isContainEquipment = ticketGear.equipment_id;
      const isContainItems = (ticketGear.GearItems || []).length > 0;

      if (this.isDubaiEnv && !isContainEquipment && !isContainItems) return "add";
      else if (this.isDubaiEnv && !isContainEquipment && isContainItems) return "updateEquipment";
      else if ((this.isDubaiEnv && isContainEquipment && !isContainItems) || (!this.isDubaiEnv && !isContainItems)) return "updateGear";

      return "change";
    },
    /**
     * Check Gear Status based on selected Gear
     * @param {Object} gearData User Gear Data
     * @param {String} contentType Status returned Type
     * @return string
     */
    getGearStatus(gearData, contentType = "text") {
      const userTicketGear = this.getUserTicketGear(gearData);
      const statusType = this.getGearStatusType(userTicketGear);

      return this.gearStatusTypes[statusType][contentType];
    },
    /**
     * Get User Assign-ticket/Profile
     * @param {Object} ticket User/Ticket
     * @return Object
     */
    getUser(ticket) {
      if (this.userGear) {
        return ticket;
      }
      return ticket.guest_types[0] && ticket.guest_types[0].user
        ? ticket.guest_types[0].user
        : this.isGuest
          ? {
            id: this.orderData.userId,
            name: this.$t(`COMMON.PEOPLE.${ticket.guest_types[0].title?.toUpperCase()}`)
          }
          : {};
    },
    /**
     * Get User Pre-Saved Gear
     * @param {Object} ticket User/Ticket
     * @return Object
     */
    getUserTicketGear(ticket) {
      let defaultGear = {
        ski_or_snowboard: 1,
        gear: [],
        equipment_id: null,
        level: -1,
        GearItems: [],
        id: ticket.id,
        isNew: true,
      };
      if (this.userGear) {
        return ticket.UserGear ? ticket.UserGear : defaultGear;
      }

      let waiver = ticket.UserGears && ticket.UserGears.length > 0 ? ticket.UserGears[0] :
        ticket.guest_types[0] && ticket.guest_types[0].user
          ? ticket.guest_types[0].user.UserGear || defaultGear
          : defaultGear;

      return waiver;
    },
    /**
     * Filter Gear Meta based on user type
     * @param {Object} ticket User/Ticket
     * @return Object
     */
    filterGear(ticket) {
      let type = this.getUserType(ticket);
      let filter = [];
      if (type === "adult" || type === "ticket") {
        filter = "1";
      } else if (type === "junior") {
        filter = "2";
      } else {
        filter = "4";
      }
      let gear = this.metaData.gear.filter((item) =>
        item.age_group.includes(filter)
      );

      // if (!ticket.need_gear && !this.userGear && this.getUserType(ticket) === 'adult') {
      //   gear = gear.filter(item => item.isLongJacket === 'long_jacket')
      // }

      let metaData = Object.assign({}, this.metaData, {gear});

      return metaData;
    },
    /**
     * Get User Type adult,junior,child
     * @param {Object} ticket User/Ticket
     * @return string
     */
    getUserType(ticket) {
      if (this.userGear) {
        return this.filterDataByAge(ticket.age);
      }
      let type = ticket.guest_types[0] ? ticket.guest_types[0].title : "-1";

      if (type === 'ticket') {
        type = 'adult'
      }

      return type
    },
    /**
     * Try To Move To another user/ticket with out saveing
     * @return void
     */
    moveToNewSection() {
      if (this.selectedRow !== -1) this.isWarningModalActive = true;
    },
    /**
     * Close Warning Modal
     * @param {string} event
     * @return void
     */
    closePopup(event) {
      if (event === "yes") {
        this.setOpenSectionData(this.newItem);
      }
      this.isWarningModalActive = false;
    },
    /**
     * Open Section from Warning Modal
     * @param {Object} item selected ticket/user
     * @return void
     */
    setOpenSectionData(item) {
      this.selectedRow = item.id;
      this.selectedGear = this.getUserTicketGear(item);
    },
    /**
     * Get User Type Based on Age
     * @param {Number} age user Age
     * @return String
     */
    filterDataByAge(age) {
      // TODO: Check with the BE team why the additional_data is not returned in the case of userGear.
      let type = "";
      if (age >= 14) {
        type = "adult";
      } else if (age >= 7 && age <= 13) {
        type = "junior";
      } else if (age >= 2 && age <= 6) {
        type = "child"; // The minimum aging was 3 but was changed to 2 because the additional_data was not returned from the API.
      }

      return type;
    },
    /**
     * Check if Attendance time less than 24 hours and before 10 pm
     * @param {Number} date  Ticket Date (event Date)
     * @return boolean
     */
    isValidGear(date) {
      let today = moment();
      let visitDate = moment(date);
      if (visitDate.isSame(today, "day")) return false;

      let timeZone = AppConfig[this.currentEnv].timezone;
      let tomorrow = moment().add(1, "days");
      let timeNow = moment().format("x");
      let tenPM = moment().tz(timeZone).set({h: 22, m: 0, s: 0});
      let twelveAM = moment().tz(timeZone).set({h: 23, m: 59, s: 59});

      if (
        moment(timeNow).isAfter(tenPM, "hour") &&
        moment(timeNow).isBefore(twelveAM, "hour") &&
        moment(visitDate).isSame(tomorrow, "day")
      )
        return false;

      return true;
    },
    /**
     * Check if Event Date != Today
     * @param {Number} eventDate  Ticket Date (event Date)
     * @return boolean
     */
    isValidDateEvent(eventDate) {
      const date = new Date(eventDate);
      if (date.setHours(0, 0, 0, 0) >= this.tod.setHours(0, 0, 0, 0))
        return true;

      return false;
    },
    /**
     * Save And Continue
     * will submit gears not mapping with tickets
     * @return void
     */
    async saveAndContinue() {
      try {
        CommonEvent.$emit("global-loader", true);

        let axiosArray = []
        let gearNames = _.keyBy(this.metaData.gear, 'id')
        let equipmentsNames = _.keyBy(this.metaData.equipments, 'id')

        let gtmData = {
          gears: [],
          equipments: []
        }
        let dates = []

        for (let i = 0; i < this.orderData.collections.length; i++) {
          let collection = this.orderData.collections[i]
          dates.push(moment(collection.event_date).toISOString())

          let tickets = collection.tickets.filter((ticket) =>
            ticket.is_addon ? ticket.is_supervision : true
          );
          for (let j = 0; j < tickets.length; j++) {
            let vivaTicket = tickets[j]
            let gear = null;
            let user = null;
            let gearItems = []
            if (vivaTicket.guest_types[0] && vivaTicket.guest_types[0].user) {
              gear = vivaTicket.guest_types[0].user.UserGear || vivaTicket.UserGears[0];
              user = vivaTicket.guest_types[0].user;
            }

            if (gear && user && this.isValidGear(collection.event_date)) {
              if (equipmentsNames[gear.equipment_id]) {
                gtmData.equipments.push(equipmentsNames[gear.equipment_id].title)
              }
              gearItems = gear.GearItems.map(item => {
                if (gearNames[item.id || item.gear_id]) {
                  gtmData.gears.push(gearNames[item.id || item.gear_id].title)
                }
                return {
                  "id": item.id || item.gear_id,
                  "size": item.gear_size ? item.gear_size.toString() : ''
                }
              })


              if (this.$isUserAuthenticated()) {

                let request = {
                  "user_id": user.id,
                  "equipment_id": gear.equipment_id,
                  "level": gear.level,
                  "height": gear.height,
                  "weight": gear.weight,
                  "ticket_id": vivaTicket.id,
                  "ski_or_snowboard": gear.equipment_id === 'eq01' ? 1 : 2,
                  "sp_orientation": gear.equipment_id === 'eq02' ? 1 : gear.equipment_id === 'eq03' ? 2 : -1,
                  "gear": gearItems,
                  "first_name": gear.first_name,
                  "last_name": gear.last_name,
                  'date_of_birth': gear.date_of_birth,
                  'is_sub_guest': gear.is_sub_guest,
                  'guest_type_id': gear.guest_type_id
                }

                let headers = {}

                let newPromise = this.$axios({
                  method: 'post',
                  url: process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.GET_GEAR,
                  data: request
                }, {
                  headers
                })

                axiosArray.push(newPromise)
              }
            }
          }
        }

        if (this.$isUserAuthenticated()) {
          Promise.all(axiosArray)
            .then(res => {

              CommonEvent.$emit("global-loader", false);

              let query = ''
              if (this.$route.query.needWaiver && this.$route.query.needWaiver === "true") {
                query += `?needWaiver=${this.$route.query.needWaiver}`
              }

              const bookingRef = this.$route.params.id
              this.$repositories.addGearEvent(bookingRef, gtmData.gears, gtmData.equipments, dates)

              this.$router.push(this.localePath(`/extra/confirm/${bookingRef}${query}`))
            })
        } else {

          let query = ``
          if (this.$route.query.needWaiver && this.$route.query.needWaiver === "true") {
            query += `?needWaiver=${this.$route.query.needWaiver}`
          }
          const bookingRef = this.$route.params.id
          this.$repositories.addGearEvent(bookingRef, gtmData.gears, gtmData.equipments, dates)
          CommonEvent.$emit("global-loader", false);
          this.$router.push(this.localePath(`/extra/confirm/${this.$route.params.id}${query}`))
        }
      } catch (e) {
        console.log(e)
        return null
      }
    },
    /**
     * show only one ticket in camps tickets based on camp_group_id
     * @return Object
     */
    filterUniqueTickets(tickets) {

      let isCamps = tickets.filter(item => item.camp_group_id)
      if (isCamps.length > 0) {
        return _.uniqBy(tickets, 'camp_group_id')
      }

      return tickets
    },
    /**
     * get Related Tickets
     * @return Array
     */
    getRelatedTickets(tickets, ticket) {
      return tickets.filter(item => item.camp_group_id && item.camp_group_id === ticket.camp_group_id)
    }
  },
};
</script>

<style scoped lang="scss">
@import "gear";
</style>
