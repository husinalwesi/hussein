<template>
  <div class="waiver">
    <div class="cards-container flex flex-row mobiles:flex-col pb-10">
      <div :class="customClass">
        <CardContainer>
          <template #card-content>
            <div class="mb-8 flex justify-between">
              <div>
                <div v-if="!currentEnv.includes('dubai')" class="mb-4">
                  <StatusIndicator
                    status-type="general"
                    tooltip-text="Waiver forms are needed for ski and snowboard activities on the slope. These activities are only available at Ski Dubai."
                    tooltip-wrapper-classes="lg:z-[162]"
                  />
                </div>
                <div class="card-title">
                  {{ showUserWaiver ? $t('WAIVER.ACCOUNT.TITLE') : $t('WAIVER.TITLE') }}
                </div>
                <div v-if="!showUserWaiver" class="sub-title">
                  {{ $t('WAIVER.POST_BOOKING.SUB_TITLE') }}
                </div>
                <div v-else class="sub-title text-[#606060] mt-[8px]">
                  <div> {{ $t('WAIVER.ACCOUNT.VIEW_EDIT_WAIVER') }}</div>
                  <div>
                    {{ $t('WAIVER.ACCOUNT.WAIVERS_REQUIRED_TEXT') }}
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
                  :no-data-text="$t('COMMON.ERROR_MESSAGES.DATA_ERROR')"
                  container-classes="my-8"
                  @fetchData="getUsersData()"
                />
              </template>
              <template v-else>
                <snowflake-loader
                  v-if="isLoading"
                  loader-wrapper-classes="h-52 bg-[#ffffff6e] rounded-3xl"
                  loader-classes="w-24 h-24"
                />
                <template v-else>
                  <template v-if="showUserWaiver">
                    <div
                      v-for="(user, mainIndex) in orderData"
                      :key="mainIndex"
                      :class="{'mt-8': mainIndex !== 0}"
                    >
                      <div class="guest-list flex flex-col gap-y-2">
                        <div class="guest-card relative">
                          <!--                      header-->
                          <div class="flex justify-between mobiles:flex-col">
                            <div class="flex flex-col mobiles:mb-3">
                              <div class="name capitalize">
                                {{
                                  user.fullName ||
                                  user.first_name + " " + user.last_name
                                }}
                                {{
                                  user.parent_user_id
                                    ? ""
                                    : ` - ${$t('COMMON.PRIMARY_ACCOUNT')}`
                                }}
                              </div>
                            </div>
                            <div
                              class="flex gap-x-2 md:gap-x-4 items-center mobiles:content-start mobiles:justify-end mobiles:flex-row-reverse"
                            >
                              <div class="badge-text-container">
                                <div
                                  class="badge capitalize lg:hover:cursor-pointer"
                                  :class="{
                                    'success-bg':
                                      getUserTicketWaiver(user).status ===
                                      'approved',
                                    'error-bg not-approved lg:hover:cursor-pointer':
                                      getUserTicketWaiver(user).status !==
                                      'approved',
                                  }"
                                  @click="badgeClicked(user)"
                                >
                                  <InfoIcon
                                    :stroke="
                                      getUserTicketWaiver(user).status !==
                                        'approved'
                                        ? '#FF173D'
                                        : '#58B150'
                                    "
                                  />
                                  <span class="ltr:ml-[5px] rtl:mr-[5px]">{{
                                      (getUserTicketWaiver(user).status !==
                                      "approved"
                                        ? $t('WAIVER.SIGNATURE')
                                        : "") + getUserTicketWaiver(user).status ? $t(`WAIVER.${getUserTicketWaiver(user).status.toUpperCase()}`) : ''
                                    }}</span>
                                </div>
                                <p
                                  v-if="
                                    getUserTicketWaiver(user).status ===
                                      'approved'
                                  "
                                  class="expires-text"
                                >
                                  {{
                                    $t("WAIVER.VALID_UNTIL", {
                                      date: formatDate(getUserTicketWaiver(user).createdAt)
                                    })
                                  }}
                                </p>
                              </div>
                              <div>
                                <svg
                                  v-if="
                                    getUserTicketWaiver(user).status ===
                                      'approved'
                                  "
                                  :width="$globalData.isMobileDevice ? '24' : '32'"
                                  :height="$globalData.isMobileDevice ? '24' : '32'"
                                  viewBox="0 0 32 32"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  @click="badgeClicked(user)"
                                >
                                  <ellipse
                                    rx="16"
                                    ry="16"
                                    transform="matrix(-1 8.74228e-08 8.74228e-08 1 16 16)"
                                    fill="#142B73"
                                  />
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M7.49658 16.2188L11.7248 20.2872L11.0521 20.9573L6.82391 16.8889L7.49658 16.2188Z"
                                    fill="white"
                                    stroke="white"
                                    stroke-width="0.5"
                                  />
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M24.6967 11.3371L13.0211 22.8721L12.3484 22.2499L13.0211 21.532L24.0241 10.667L24.6967 11.3371Z"
                                    fill="white"
                                    stroke="white"
                                    stroke-width="0.5"
                                  />
                                </svg>

                                <arrow-svg
                                  v-else
                                  :with-wrapper="true"
                                  :wrapper-class="`w-6 h-6 md:w-8 md:h-8 ${
                                    selectedMenu === user.id
                                      ? 'bg-dark-gray'
                                      : 'bg-[#ECECEC]'
                                  } open-drop-list`"
                                  :arrow-color="`${
                                    selectedMenu === user.id
                                      ? 'white'
                                      : '#0A1432'
                                  }`"
                                  :direction="
                                    selectedMenu === user.id ? 'up' : 'down'
                                  "
                                  :width="$globalData.isMobileDevice ? '16' : '21.33'"
                                  :height="$globalData.isMobileDevice ? '16' : '21.33'"
                                  @onArrowClick="openWaiver(user)"
                                />
                              </div>
                            </div>
                          </div>
                          <WaiverForm
                            v-if="selectedMenu === user.id"
                            :key="mainIndex"
                            :is-users-waiver="showUserWaiver"
                            :user-list="userList"
                            :waiver-data="selectedWaiver"
                            :user="getUser(user)"
                            :waiver-meta="waiverMeta"
                            @submit="onFormSubmit($event)"
                          />
                          <StatusModal
                            v-if="user.id === selectedRow.id"
                            :status-title="`${$t(`WAIVER.${(selectedRow.status||'').toUpperCase()}`)}`"
                            :primary-title="
                              user.name
                                ? user.name
                                : user.first_name + ' ' + user.last_name
                            "
                            :status-class="
                              getUserTicketWaiver(user).status === 'approved'
                                ? 'success-bg'
                                : getUserTicketWaiver(user).status === 'pending'
                                  ? 'error-bg'
                                  : 'warning-bg '
                            "
                            :show-modal="showStatusModal"
                            :user="user"
                            :waiver="getUserTicketWaiver(user)"
                            @submit="changeWaiver(user)"
                            @close-modal="closeModal($event, 'showStatusModal')"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                  <template
                    v-else-if="
                      orderData &&
                        orderData.collections &&
                        orderData.collections.length
                    "
                  >
                    <div
                      v-for="(mainTicket, mainIndex) in orderData.collections"
                      :key="mainIndex"
                      :class="{'mt-8': mainIndex !== 0}"
                    >
                      <div
                        class="flex flex-row items-end justify-between pb-2 md:pb-4"
                      >
                        <div class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold  flex items-center">
                          {{ mainTicket.title_en }}
                        </div>
                        <div
                          v-if="mainIndex === 0"
                          class="flex flex-col action-details"
                        >
                          {{ $t('COMMON.BOOKING_REFERENCE') }}
                          <div v-if="orderData" class="sub-action pt-1">
                            {{ orderData.reservation_code }}
                          </div>
                        </div>
                      </div>
                      <div class="guest-list flex flex-col gap-y-2">
                        <div
                          v-for="ticket of filterUniqueTickets(mainTicket.tickets)"
                          :key="ticket.id"
                          class="guest-card relative"
                        >
                          <div class="flex min-700:items-center justify-between mobiles:flex-col">
                            <div class="flex flex-col mobiles:mb-3">
                              <div class="name capitalize">
                                {{
                                  getUser(ticket).name ||
                                  getUser(ticket).first_name +
                                  " " +
                                  getUser(ticket).last_name
                                }}
                              </div>
                              <div class="description">
                                {{ ticketTitle(ticket, mainTicket) }}
                              </div>
                            </div>
                            <div
                              class="flex gap-x-2 md:gap-x-4 items-center mobiles:content-start mobiles:justify-end mobiles:flex-row-reverse"
                            >
                              <div class="badge-text-container">
                                <div
                                  class="badge capitalize"
                                  :class="{
                                    'success-bg approved':
                                      getUserTicketWaiver(ticket).status ===
                                      'approved',
                                    'error-bg not-approved lg:hover:cursor-pointer':
                                      getUserTicketWaiver(ticket).status !==
                                      'approved',
                                  }"
                                  @click="badgeClicked(ticket)"
                                >
                                  <InfoIcon
                                    :stroke="
                                      getUserTicketWaiver(ticket).status !==
                                        'approved'
                                        ? '#FF173D'
                                        : '#58B150'
                                    "
                                  />
                                  <span class="ltr:ml-[5px] rtl:mr-[5px]">{{
                                      (getUserTicketWaiver(ticket).status !==
                                      "approved"
                                        ? $t('WAIVER.SIGNATURE')
                                        : "") + getUserTicketWaiver(ticket).status ? $t(`WAIVER.${getUserTicketWaiver(ticket).status.toUpperCase()}`) : ''
                                    }}</span>
                                </div>
                                <p
                                  v-if="
                                    getUserTicketWaiver(ticket).status ===
                                      'approved'
                                  "
                                  class="expires-text"
                                >
                                  {{
                                    $t("WAIVER.VALID_UNTIL", {
                                      date: formatDate(getUserTicketWaiver(ticket).createdAt)
                                    })
                                  }}
                                </p>
                              </div>
                              <div>
                                <svg
                                  v-if="
                                    getUserTicketWaiver(ticket).status ===
                                      'approved'
                                  "
                                  class="lg:hover:cursor-pointer"
                                  :width="$globalData.isMobileDevice ? '24' : '32'"
                                  :height="$globalData.isMobileDevice ? '24' : '32'"
                                  viewBox="0 0 32 32"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  @click="badgeClicked(ticket)"
                                >
                                  <ellipse
                                    rx="16"
                                    ry="16"
                                    transform="matrix(-1 8.74228e-08 8.74228e-08 1 16 16)"
                                    fill="#142B73"
                                  />
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M7.49658 16.2188L11.7248 20.2872L11.0521 20.9573L6.82391 16.8889L7.49658 16.2188Z"
                                    fill="white"
                                    stroke="white"
                                    stroke-width="0.5"
                                  />
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M24.6967 11.3371L13.0211 22.8721L12.3484 22.2499L13.0211 21.532L24.0241 10.667L24.6967 11.3371Z"
                                    fill="white"
                                    stroke="white"
                                    stroke-width="0.5"
                                  />
                                </svg>

                                <arrow-svg
                                  v-else
                                  :with-wrapper="true"
                                  :wrapper-class="`w-6 h-6 md:w-8 md:h-8 ${
                                    selectedMenu === ticket.id
                                      ? 'bg-dark-gray'
                                      : 'bg-[#ECECEC]'
                                  } open-drop-list`"
                                  :arrow-color="`${
                                    selectedMenu === ticket.id
                                      ? 'white'
                                      : '#0A1432'
                                  }`"
                                  :direction="
                                    selectedMenu === ticket.id ? 'up' : 'down'
                                  "
                                  :width="$globalData.isMobileDevice ? '16' : '21.33'"
                                  :height="$globalData.isMobileDevice ? '16' : '21.33'"
                                  @onArrowClick="openWaiver(ticket)"
                                />
                              </div>
                            </div>
                          </div>
                          <div
                            v-if="
                              selectedMenu === ticket.id &&
                                Object.keys(selectedWaiver).length > 0
                            "
                          >
                            <WaiverForm
                              :waiver-data="selectedWaiver"
                              :user-list="userList"
                              :show-apply-all="mainTicket.tickets.length > 1"
                              :user="getUser(ticket)"
                              :related-tickets="getRealtedTickets(mainTicket.tickets,ticket)"
                              :waiver-meta="waiverMeta"
                              @submit="onFormSubmit($event)"
                            />
                          </div>
                          <StatusModal
                            v-if="ticket.id === selectedRow.id"
                            :status-title="`${$t(`WAIVER.${(selectedRow.status||'').toUpperCase()}`)}`"
                            :primary-title="
                              getUser(ticket).name ||
                                getUser(ticket).first_name +
                                ' ' +
                                getUser(ticket).last_name
                            "
                            :is-users-waiver="showUserWaiver"
                            :show-modal="showStatusModal"
                            :status-class="
                              getUserTicketWaiver(ticket).status === 'approved'
                                ? 'success-bg'
                                : getUserTicketWaiver(ticket).status ===
                                  'pending'
                                  ? 'error-bg'
                                  : 'warning-bg '
                            "
                            :user="getUser(ticket)"
                            :waiver="getUserTicketWaiver(ticket)"
                            @submit="changeWaiver(ticket)"
                            @close-modal="closeModal($event, 'showStatusModal')"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                </template>
              </template>
            </div>
          </template>
        </CardContainer>
      </div>
    </div>
  </div>
</template>

<script>
import StatusModal from "@/components/Shared/StatusModal/index.vue";
import StatusIndicator from "@/components/Shared/StatusIndicator";
import NoDataFound from "@/components/Accounts/Shared/NoDataFound";

import {globalHelpers} from "@/plugins/helpers";
import InfoIcon from "@/components/SVGElements/info-icon.vue";
import WaiverForm from "./WaiverForm";
import moment from "moment";
import {CommonEvent} from "@/services/app-events";
import * as _ from "lodash"

export default {
  name: "Waiver",
  components: {
    WaiverForm,
    StatusModal,
    InfoIcon,
    StatusIndicator,
    NoDataFound,
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
    showBookingRefernce: {
      type: Boolean,
      default: true,
    },
    showUserWaiver: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isError: false,
      selectedMenu: -1,
      isLoading: true,
      selectedRow: {},
      showStatusModal: false,
      userList: [],
      orderData: {},
      selectedWaiver: {},
      defaultEmergencyContact: {},
      defaultGuardian: {},
      applyToAllGuest: false,
      applyToAllGuardian: false,
      tod: new Date(),
      currentEnv: '',
      isRtl: false,
      waiverMeta: {}
    };
  },
  created() {
    //TODO to be handled in router auth
    if (!this.$isDubai()) {
      this.$router.push(this.localePath('/page-not-found'))
    } else {
      this.getMeta()
      this.currentEnv = this.$getSiteCurrentEnvironment();
      this.isRtl = this.$isArabic();
    }
  },
  mounted() {
    this.getUsersData();
  },
  methods: {
    openWaiver(ticket) {
      if (this.selectedMenu === ticket.id) {
        this.selectedMenu = -1;
        return;
      }

      this.selectedMenu = ticket.id;
      this.selectedWaiver = this.getUserTicketWaiver(ticket);
      this.selectedWaiver.user_id = this.getUser(ticket).id;
      if (!this.showUserWaiver) {
        this.selectedWaiver.order_id = this.orderData.id;
        this.selectedWaiver.reservation_code = this.orderData.reservation_code;
        if (this.selectedWaiver.ticket_id !== ticket.id) {
          this.selectedWaiver.id = null
        }

        this.selectedWaiver.ticket_id = ticket.id;
      }
      this.selectedWaiver.mobileDetails = globalHelpers.mobileNumberFormatter(
        this.selectedWaiver.emergency_contact_phone
      );

      if (this.selectedWaiver.id) {
        this.selectedWaiver.mobile =
          this.selectedWaiver.emergency_contact_phone;
      }

      if (this.applyToAllGuest && (!this.selectedWaiver.id || ticket.id)) {
        this.selectedWaiver.emergency_contact_name =
          this.defaultEmergencyContact.emergency_contact_name;
        this.selectedWaiver.mobileDetails = this.defaultEmergencyContact.mobile;
      }

      if (this.applyToAllGuardian && (!this.selectedWaiver.id)) {
        this.selectedWaiver.guardian_name = this.defaultGuardian.name;
        this.selectedWaiver.guardian_birthday =
          this.defaultGuardian.date_of_birth;
        this.selectedWaiver.guardian_id = this.defaultGuardian.id;
        this.selectedWaiver.guardian_sign_value =
          this.defaultGuardian.sign_value;
        this.selectedWaiver.showNewGuardin = true;
      }
      this.$forceUpdate();
    },
    badgeClicked(ticket) {
      let waiver = this.getUserTicketWaiver(ticket);

      if (waiver.status && ticket.id !== this.selectedRow.id) {
        this.selectedRow = {};
        this.selectedRow = ticket;
        this.selectedRow.status = waiver.status;
        // this.selectedRow.index = index
        this.showStatusModal = true;
      }
    },
    closeModal(event, type) {
      if (type === "showStatusModal") {
        this.selectedRow = {};
        // this.showStatusModal = false
      }
      this[type] = event;
    },
    goBackClicked() {
      this.$router.push(this.localePath("/accounts/profile/personal-details"));
    },
    async getUsersData() {
      try {
        if (this.isError) this.isError = false;

        if (this.showUserWaiver) {
          //TODO remove -1 once backend change it
          this.orderData = await this.$repositories.getUsersWaiver();
          this.userList = [...this.orderData];
        } else {
          let res = await this.$repositories.getWaiver(this.$route.params.id);

          if (!res) this.$router.push("/");
          else {
            if (res.isError) {
              this.orderData = {};
              this.isError = true;
            } else {
              if (res && res.collections)
                res.collections = res.collections.filter((item) =>
                  this.isValidDateEvent(item.event_date) && item.tickets.length > 0
                );

              if (res.collections.length === 0) {
                this.$router.push(this.localePath(`/extra/gear/${this.$route.params.id}?needWaiver=false`))
              }
              this.orderData = res;
              this.userList = await this.$repositories.getUsers();
            }
          }
        }

        this.isLoading = false;
        setTimeout(() => {
          this.checkValidation();
        });
      } catch (e) {
        this.isError = true;
        this.isLoading = false;
        console.log({e});
      }
    },
    getUser(ticket) {
      if (this.showUserWaiver) {
        return ticket;
      }
      return ticket.guest_types[0] && ticket.guest_types[0].user
        ? ticket.guest_types[0].user
        : {};
    },
    ticketTitle(ticket, mainTicket) {

      if (this.isRtl) {
        return ticket.title_ar ? (ticket.title_ar.length > 0 ? ticket.title_ar : mainTicket.title_ar) : mainTicket.title_ar
      }

      return ticket.title_en ? (ticket.title_en.length > 0 ? ticket.title_en : mainTicket.title_en) : mainTicket.title_en
    },
    getUserTicketWaiver(ticket) {
      let defaultWaiver = {
        status: "pending",
        skill_level: "",
        minimum_requirements: true,
        guardian_sign_value: "",
        sign_value: "",
        showNewGuardin: false,
        guardian_birthday: "",
      };
      let waiver = null
      if (this.showUserWaiver) {
        waiver = ticket.waivers && ticket.waivers.length > 0 ? ticket.waivers[0] : defaultWaiver;
      } else {
        waiver =
          ticket.guest_types[0] && ticket.guest_types[0].user
            ? (ticket.guest_types[0].user.waivers && ticket.guest_types[0].user.waivers.length > 0) ? ticket.guest_types[0].user.waivers[0] : defaultWaiver
            : defaultWaiver;
      }

      if (waiver.expiry_date && !moment(waiver.expiry_date).isAfter(moment())) {
        waiver.status = 'expired'
      }

      return waiver;
    },
    checkValidation() {
      let isValid = true;
      let approvedLabel = document.querySelectorAll(".approved");
      if (approvedLabel && approvedLabel.length === 0) {
        isValid = false;
      }
      if (isValid)
        if (document.getElementById("submit-btn"))
          document.getElementById("submit-btn").disabled = false;
    },
    onFormSubmit(event) {
      if (event.applyToAll) {
        this.defaultEmergencyContact = event.data;
        this.applyToAllGuest = true;
      }

      if (event.applyToAllGuardian) {
        this.defaultGuardian = event.guardianData;
        this.applyToAllGuardian = true;
      }

      this.selectedWaiver = {};
      this.selectedRow = {};
      this.selectedMenu = -1;
      this.getUsersData();
      this.checkValidation();
    },
    changeWaiver(ticket) {
      if (this.selectedMenu === -1 || this.selectedMenu !== ticket.id) {
        this.openWaiver(ticket);
      }
      this.showStatusModal = false;
    },
    formatDate(date) {
      return moment(date).add(1, "years").format("DD MMMM YYYY");
    },
    isValidDateEvent(eventDate) {
      const date = new Date(eventDate);
      if (date.setHours(0, 0, 0, 0) >= this.tod.setHours(0, 0, 0, 0))
        return true;

      return false;
    },
    async saveAndContinue() {
      try {
        CommonEvent.$emit("global-loader", true);

        let dates = []
        for (let i = 0; i < this.orderData.collections.length; i++) {
          let collection = this.orderData.collections[i]
          dates.push(moment(collection.event_date).toISOString())

          let tickets = collection.tickets.filter((ticket) =>
            ticket.is_addon ? ticket.is_supervision : true
          );
          for (let j = 0; j < tickets.length; j++) {
            let vivaTicket = tickets[j]
            let waiver = vivaTicket.guest_types[0].user.waivers && vivaTicket.guest_types[0].user.waivers.length > 0 ? vivaTicket.guest_types[0].user.waivers[0] : null
            let user = vivaTicket.guest_types[0].user

            if (waiver && waiver.status === 'approved' && ((waiver.ticket_id && waiver.ticket_id.toString() !== vivaTicket.id.toString()) || !waiver.ticket_id)) {
              let request = {
                "id": vivaTicket.id !== waiver.ticket_id ? null : waiver.id,
                "emergency_contact_name": waiver.emergency_contact_name,
                "emergency_contact_phone": waiver.emergency_contact_phone,
                "minimum_requirements": waiver.minimum_requirements,
                "skill_level": waiver.skill_level,
                "guardian_sign_value": waiver.guardian_sign_value,
                "sign_value": waiver.sign_value,
                "guardian_id": waiver.guardian_id,
                "guardian_name": waiver.guardian_name,
                "guardian_birthday": waiver.guardian_birthday,
                "user_id": user.id,
                "ticket_id": vivaTicket.id,
                "order_id": collection.orderId,
                "booking_id": this.orderData.reservation_code,
                "status": waiver.status
              }
              await this.$repositories.saveWaiver(request)
            }
          }
        }
        CommonEvent.$emit("global-loader", false);


        const bookingReference = this.$route.params.id
        this.$repositories.addWaiverEvent(bookingReference, dates)

        if (this.$route.query.isMembership && !this.$route.query.isOnlyMembership && this.$route.query.isMembership.toString() === "true") {
          let query = `?needWaiver=true`
          this.$router.push(this.localePath(`/extra/confirm/${bookingReference}${query}`))
        } else {
          this.$router.push(this.localePath(`/extra/gear/${bookingReference}?needWaiver=true`))
        }
      } catch (e) {
        console.log(e)
        return null
      }
    },
    filterUniqueTickets(tickets) {

      let isCamps = tickets.filter(item => item.camp_group_id)
      if (isCamps.length > 0) {
        return _.uniqBy(tickets, 'camp_group_id')
      }

      return tickets
    },
    getRealtedTickets(tickets, ticket) {
      return tickets.filter(item => item.camp_group_id && item.camp_group_id === ticket.camp_group_id)
    },
    async getMeta() {
      this.waiverMeta = await this.$repositories.getWaiverMeta()
    }
  },
};
</script>

<style scoped lang="scss">
@import "waiver.scss";
</style>
