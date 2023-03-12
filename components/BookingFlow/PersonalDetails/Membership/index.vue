<template>
  <section class="membership-section">
    <CardContainer
      container-classes="mt-4"
      wrapper-classes="px-[15px] py-[23px] md:px-[31px] md:pt-[27px] md:pb-[31px]"
    >
      <template #card-content>
        <div class="card-header">
          <h3 class="title">
            {{ $t('BOOKINGFLOW_PAGE.ADD_GUEST_TO_MEMBERSHIP') }}
          </h3>
          <div
            class="terms-conditions-info-wrapper"
            @click.prevent="isTermsConditionsModalActive = true"
          >
            <InfoIcon stroke="#0A1432" />
            <label class="terms-conditions-label"> {{ $t('BOOKINGFLOW_PAGE.TERMS_AND_CONDITIONS_SIGN') }} </label>
          </div>
        </div>
        <div class="divider-dashed my-4" />
        <div
          v-for="(ticket, ticketIndex) in tickets"
          :key="ticket.id"
          class="membership-ticket-accordian"
          :class="{ 'mt-2': ticketIndex !== 0 }"
        >
          <div>
            <div class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold  text-base text-[#191919]">
              {{ $t('BOOKINGFLOW_PAGE.MEMBER') + ` ${ticketIndex + 1}` }}
            </div>
            <div class="minimum-age-text">
              {{ `${$t('BOOKINGFLOW_PAGE.MIN_AGES', {age: getMinimumUserAge(ticket)})}` }}
            </div>
          </div>
          <div
            v-click-outside.special="closeUsersListPopup"
            class="users-list-popup-indicator-opener"
          >
            <snowflake-loader
              v-if="isLoading"
              loader-wrapper-classes="loader-wrapper"
              loader-classes="h-8 w-8"
            />
            <div
              v-else
              class="membership-user-name"
              :class="{ 'opacity-50': !(ticket.assignedUser || {}).fullName }"
              @click.prevent="onMembershipSelectorClick(ticket)"
            >
              {{ (ticket.assignedUser || {}).fullName || $t('BOOKINGFLOW_PAGE.ADD_TO_MEMBERSHIP') }}
            </div>
            <arrow-svg
              :with-wrapper="true"
              :wrapper-class="`w-6 h-6 md:w-8 md:h-8 order-1 min-700:order-2 ${
                activeAccordianId === ticket.id
                  ? 'bg-dark-gray'
                  : 'bg-[#ECECEC]'
              }`"
              :arrow-color="`${
                activeAccordianId === ticket.id ? 'white' : '#0A1432'
              }`"
              :direction="activeAccordianId === ticket.id ? 'up' : 'down'"
              :width="$globalData.isMobileDevice ? '12' : '18'"
              :height="$globalData.isMobileDevice ? '12' : '18'"
              @onArrowClick="toggleActiveAccordian(ticket.id)"
            />
          </div>

          <div
            v-if="activeAccordianId === ticket.id"
            class="users-list-wrapper"
          >
            <snowflake-loader
              v-if="isLoading"
              loader-wrapper-classes="h-full"
              loader-classes="w-7 h-7"
            />
            <template v-else>
              <ul class="users-list">
                <li
                  v-for="(user, userIndex) in notSelectedUsersListWithAgeFilter(
                    ticket
                  )"
                  :key="user.id"
                  class="user"
                  :class="{ 'mt-2': userIndex !== 0 }"
                  @click.prevent="assignUser(ticketIndex, user)"
                >
                  {{ user.fullName }}
                </li>
              </ul>

              <div
                v-if="
                  notSelectedUsersListWithAgeFilter(ticket) &&
                    notSelectedUsersListWithAgeFilter(ticket).length
                "
                class="divider-dashed mt-2 mb-4"
              />

              <button
                type="button"
                class="btn-add-sub-account"
                @click.prevent="openSubAccountFormModal(ticket.minimumUserAge)"
              >
                <PlusIcon width="24" height="24" bg-color="#ECECEC" />
                {{ $t('BOOKINGFLOW_PAGE.ADD_NEW_MEMBER') }}
              </button>
            </template>
          </div>
        </div>
      </template>
    </CardContainer>

    <template v-if="isSubAccountFormModalActive">
      <SubAccountFormModal
        :is-modal-active="isSubAccountFormModalActive"
        :selected-user-data="selectedUserData"
        :is-update-action="isUpdateAction"
        :minimum-user-age="minAge"
        :site-default-mobile-details="siteDefaultMobileDetails"
        @updateUsersList="updateUsersList($event)"
        @closeModal="
          isSubAccountFormModalActive = false;
          isUpdateAction = false;
        "
      />
    </template>
    <template v-if="isTermsConditionsModalActive">
      <TermsConditions
        :show-modal="isTermsConditionsModalActive"
        :package-details="packageDetails"
        @closeModal="isTermsConditionsModalActive = false"
      />
    </template>
    <template v-if="isWellDoneModalActive">
      <WellDone
        :show-modal="isWellDoneModalActive"
        :guest-name="guestName"
        @closeModal="isWellDoneModalActive = false"
      />
    </template>
  </section>
</template>

<script>
import InfoIcon from "@/components/SVGElements/info-icon.vue";
import PlusIcon from "@/components/SVGElements/AddBtnDropDown.vue";
import SubAccountFormModal from "./Modals/SubAccountForm";
import TermsConditions from "./Modals/TermsConditions";
import WellDone from "./Modals/WellDone";

import {customLayerEndPoints} from "@/const/api";
import {CommonEvent} from "@/services/app-events";

// TODO: Modify this component when we have time.

export default {
  components: {
    InfoIcon,
    PlusIcon,
    SubAccountFormModal,
    TermsConditions,
    WellDone,
  },
  props: {
    tickets: {
      type: Array,
      default: () => [],
    },
    packageDetails: {
      type: Object,
      default: () => ({}),
    },
    packages: {
      type: Array,
      default: () => [],
    },
    siteDefaultMobileDetails: {
      type: Object,
      default: () => ({
        regionCode: "ae",
        countryCode: "+971",
        significantMobileNumber: ""
      })
    }
  },
  emits: ['updateAssignUserEmiter', 'assignUserEmiter'],
  data() {
    return {
      isLoading: false,
      isUpdateAction: false,
      selectedUserData: null,
      usersList: [],

      activeAccordianId: null,
      isSubAccountFormModalActive: false,
      isTermsConditionsModalActive: false,
      selectedTicket: -1,
      isWellDoneModalActive: false,
      guestName: "",
      minAge: 1,
    };
  },
  computed: {
    notSelectedUsersList() {
      let temp = [];
      for (let index = 0; index < this.usersList.length; index++) {
        if (!this.isUserSelected(this.usersList[index].id)) {
          if (!this.isMembershipExist(this.usersList[index].memberships || {})) {
            let age = this.calculate_age(this.usersList[index].dateOfBirth);
            if (Number(age) >= Number(this.tickets[0].minimumUserAge)) {
              if (!this.isUserSelectedBefore(this.usersList[index].id)) {
                temp.push(this.usersList[index]);
              }
            }
          }
        }
      }
      return temp;
    },
  },
  mounted() {
    CommonEvent.$on("fetch-users", () => {
      this.getUsers();
    });

    this.getUsers(true);
  },
  methods: {
    notSelectedUsersListWithAgeFilter(ticket) {
      let min_age = this.getMinimumUserAge(ticket);
      let max_age = this.getMaximumUserAge(ticket);
      let temp = [];
      for (let index = 0; index < this.usersList.length; index++) {
        if (!this.isUserSelected(this.usersList[index].id)) {
          if (!this.isMembershipExist(this.usersList[index].memberships || {})) {
            let age = this.calculate_age(this.usersList[index].dateOfBirth);
            if (
              Number(age) >= Number(min_age) &&
              Number(age) <= Number(max_age)
            ) {
              if (!this.isUserSelectedBefore(this.usersList[index].id)) {
                temp.push(this.usersList[index]);
              }
            }
          }
        }
      }
      return temp;
    },
    getMaximumUserAge(ticket) {
      if (ticket.ageType == "child") return 6;
      else if (ticket.ageType == "junior") return 13;
      return 1000;
    },
    getMinimumUserAge(ticket) {
      let minimumUserAge = Number(ticket.minimumUserAge);
      let ticketMinAge = this.detectAgeType(ticket.ageType);
      if (ticketMinAge > minimumUserAge && ticket.ageType != "child") minimumUserAge = ticketMinAge;
      return minimumUserAge;
    },
    detectAgeType(ageType) {
      if (ageType == "child") return 3;
      else if (ageType == "junior") return 7;
      return 14;
    },
    setMembershipFromStore() {
      let membershipUserID =
        this.$store.state.bookingFlow.tempCard.membershipUserID;
      if (!membershipUserID) return false;
      membershipUserID = membershipUserID.toString();
      for (let index = 0; index < this.notSelectedUsersList.length; index++) {
        if (
          this.notSelectedUsersList[index].id.toString() == membershipUserID
        ) {
          this.assignUser(0, this.notSelectedUsersList[index]);
        }
      }
    },
    isMembershipExist(memberships) {
      return memberships && memberships.length ? !!memberships.
      filter((membership) => membership.isValid && +membership.experience_type === this.packageDetails.card.experience_type).length : false;
    },
    isUserSelectedBefore(userID) {
      let savedBookingFlow = this.$deepCloneArray(this.packages);
      for (let index = 0; index < savedBookingFlow.length; index++) {
        let assignedUsers = savedBookingFlow[index].assignedUsers || [];
        for (let index2 = 0; index2 < assignedUsers.length; index2++) {
          if (assignedUsers[index2].id == userID && +this.packageDetails.card.experience_type === +savedBookingFlow[index].card.experience_type) return true;
        }
      }
      return false;
    },
    calculate_age(dob) {
      dob = new Date(dob);
      var diff_ms = Date.now() - dob.getTime();
      var age_dt = new Date(diff_ms);
      return Math.abs(age_dt.getUTCFullYear() - 1970);
    },
    isUserSelected(userID) {
      for (let index = 0; index < this.tickets.length; index++) {
        if (this.tickets[index].assignedUser) {
          if (this.tickets[index].assignedUser.id == userID) return true;
        }
      }
      return false;
    },
    primaryUserHandler(primaryUser) {
      const ticketsList = this.tickets;

      for (let ticketIndex = 0; ticketIndex < ticketsList.length; ticketIndex++) {
        const ticket = ticketsList[ticketIndex];

        if (ticket.assignedUser && ticket.assignedUser.id === primaryUser.id && !ticket.assignedUser.parent_user_id) {
          this.$emit("updateAssignUserEmiter", {
            userDetails: primaryUser,
            selectedTicketIndex: ticketIndex
          });
          break;
        }
      }
    },
    async getUsers(setPreselectedUser = false) {
      try {
        this.isLoading = true;

        const { data: res } = await this.$axios.get(
          // eslint-disable-next-line no-undef
          process.env.SHARED_ENVS.APIGEE_BASE_URL +
            customLayerEndPoints.GET_PRIMARY_SUB_ACCOUNTS
        );

        if (res && res.users && res.users.length) {
          let primaryUser = null;
          const flattendList = res.users.map((user) => {
            if (!user.parent_user_id) {
              primaryUser = {
                ...user,
                mobileDetails: this.$mobileNumberFormatter(user.mobile),
              };
              return primaryUser;
            }

            return {
              ...user,
              mobileDetails: this.$mobileNumberFormatter(user.mobile),
            };
          });
          this.usersList = flattendList;

         this.primaryUserHandler(primaryUser)
        }

        this.isLoading = false;
        if(setPreselectedUser) this.setMembershipFromStore();
      } catch (err) {
        //TODO: Add a proper message in case an error happened.
        this.$showToast({
          type: "red",
          text: this.$t('SHARED.AN_ERROR_OCCURRED_WHILE_FETCHING_USERS'),
        });
        this.isLoading = false;
        console.log(err);
      }
    },
    closeUsersListPopup() {
      if (this.activeAccordianId) this.activeAccordianId = null;
    },
    toggleActiveAccordian(id) {
      if (this.activeAccordianId === id) this.closeUsersListPopup();
      else this.activeAccordianId = id;
    },
    updateUsersList(data) {
      if (data.userData) {
        if (data.type === "updateSubAccount") {
          // TODO: Change the logic for saving users to be by index in order to easily update users by index instead of iterating over them.
          this.usersList = this.usersList.map((user) => user.id === data.userData.id ? data.userData : user);

          this.$emit("updateAssignUserEmiter", {
            userDetails: data.userData,
            selectedTicketIndex: this.selectedTicket,
          });
          this.selectedTicket = -1;
        } else if (data.type === "createNewSubAccount") {
          this.guestName = `${data.userData.firstName} ${data.userData.lastName}`;
          this.isWellDoneModalActive = true;
          //
          const newSubAccountUser = {
            ...data.userData,
            mobileDetails: this.$mobileNumberFormatter(data.userData.mobile),
          };

          this.usersList.push(newSubAccountUser);
        }
      }
      if (this.selectedUserData) this.selectedUserData = null;
      if (this.isUpdateAction) this.isUpdateAction = false;
      this.isSubAccountFormModalActive = false;
    },
    assignUser(ticketIndex, user) {
      this.selectedTicket = ticketIndex;
      if (user.profile_image) {
        this.$emit("assignUserEmiter", {
          index: ticketIndex,
          user: user,
        });
      } else {
        this.onMembershipSelectorClick({
          id: user.id,
          assignedUser: user,
        });
      }
    },
    openSubAccountFormModal(minAge) {
      let ticketMinimumAge = +this.packageDetails.tickets[0].minimum_age;
      if (+minAge == 3 && ticketMinimumAge < 3) minAge = ticketMinimumAge;
      this.minAge = minAge;
      this.isSubAccountFormModalActive = true;
    },
    getAgeType(dob) {
      let age = this.calculate_age(dob);
      if (age <= 6) return 3;
      //child
      else if (age >= 7 && age <= 13) return 7; //junior
      return 14; //adult
    },
    onMembershipSelectorClick(ticket) {
      // We check the parent_user_id to see if the user we're clicking on is a primary account or a sub account (if it has a parent user ID then it's a sub).
      if (ticket.assignedUser && ticket.assignedUser.user_ak) {
        this.isUpdateAction = true;
        this.selectedUserData = this.getSubAccountDetailsByID(ticket.id);
        this.openSubAccountFormModal(
          this.getAgeType(ticket.assignedUser.dateOfBirth)
        );
      } else this.toggleActiveAccordian(ticket.id);
    },
    getSubAccountDetailsByID(id) {
      for (let index = 0; index < this.usersList.length; index++) {
        if (this.usersList[index].id == id) return this.usersList[index];
      }
      return {};
    },
  },
};
</script>

<style lang="scss" scoped>
@import "Membership";
</style>
