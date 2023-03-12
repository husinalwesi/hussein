<template>
  <div class="personal-details-page">
    <UserDetails
      :is-loading="isLoading"
      :users-list="usersList"
      :selected-user-details="selectedUserDetails"
      :is-error="isError"
      @updateUsers="updateUsers($event)"
      @selectedUserDetails="setSelectedUserDetails($event)"
      @fetchData="getUsers"
    />

    <div class="action-cards-container">
      <ActionCard
        v-for="actionCard in actionCards"
        :key="actionCard.id"
        :card-data="actionCard"
        :container-custom-classes="actionCards.length === 1 ? 'md:max-w-[26.5rem]' : ''"
        :status="statusHandler(actionCard.type)"
        :icon-custom-class="actionCard.type === 'gear' ? 'max-h-[5.5625rem] max-w-[4.6875rem]' : ''"
        :is-loading="isLoading"
      />
    </div>

    <template v-if="(cmsSiteConfig || {}).enable_membership">
      <MemberchipCard
        :selected-user-details="selectedUserDetails"
        :is-error="isError"
      />
    </template>
  </div>
</template>

<script>
import UserDetails from "@/components/Accounts/Profile/PersonalDetails/UserDetails";
import ActionCard from "@/components/Accounts/Profile/ActionCard";
import MemberchipCard from "@/components/Accounts/Profile/PersonalDetails/MemberchipCard";

import {mapGetters} from "vuex";

import {customLayerEndPoints} from "@/const/api";

/* eslint-disable no-undef */

export default {
  components: {
    UserDetails,
    ActionCard,
    MemberchipCard,
  },
  props: {
    cmsSiteConfig: {
      type: Object,
      default: () => ({
        enable_membership: false
      })
    }
  },
  head() {
    return this.$seoGenerator({}, this.$t("PAGES_TITLE.ACCOUNTS.PROFILE.PERSONAL_DETAILS"));
  },
  computed: {
    ...mapGetters("currentUser", ["userInformation"])
  },
  // eslint-disable-next-line vue/order-in-components
  data() {
    return {
      isError: false,
      isLoading: false,
      usersList: [],
      selectedUserDetails: {},
      defaultActionCards: [
        {
          id: "actionCard1",
          type: "waiver",
          img: {
            image_url: require("@/assets/images/Accounts/waiver.png"),
            alt: "waiver",
            title: "waiver",
          },
          title: this.$t("ACCOUNT_PAGE.PROFILE.ACTION_CARDS.WAIVER.TITLE"),
          description: this.$t("ACCOUNT_PAGE.PROFILE.ACTION_CARDS.WAIVER.DESCRIPTION"),
          cta: {
            title: this.$t("ACCOUNT_PAGE.PROFILE.ACTION_CARDS.WAIVER.CTA_TITLE"),
            path: "/accounts/profile/waiver-form",
          },
        },
        {
          id: "actionCard2",
          type: "gear",
          img: {
            image_url: require("@/assets/images/Accounts/gear.png"),
            alt: "gear",
            title: "gear",
          },
          title: this.$t("ACCOUNT_PAGE.PROFILE.ACTION_CARDS.GEAR.TITLE"),
          description: this.$t("ACCOUNT_PAGE.PROFILE.ACTION_CARDS.GEAR.DESCRIPTION"),
          cta: {
            title: this.$t("ACCOUNT_PAGE.PROFILE.ACTION_CARDS.GEAR.CTA_TITLE"),
            path: "/accounts/profile/set-your-gear",
          },
        },
      ],
      actionCards: [],
      currentEnv: ""
    };
  },
  created() {
    const currentLocation = this.$getSiteCurrentEnvironment(false, true);
    const isWaiverNeeded = currentLocation.toLowerCase().includes("dubai");

    this.currentEnv = currentLocation;

    if (isWaiverNeeded) {
      let cards = this.defaultActionCards;
      cards[0].description = this.$t('ACCOUNT_PAGE.PROFILE.ACTION_CARDS.WAIVER.DESCRIPTION', {location: this.$t(`LOCATIONS.${currentLocation}`)})
      this.actionCards = [...cards];
    }
    else this.actionCards = [this.defaultActionCards[1]]; // only gear card needed.

    this.getUsers();
  },
  methods: {
    async getUsers() {
      try {
        if (this.isError) this.isError = false;

        this.isLoading = true;

        const {data: res} = await this.$axios.get(
          process.env.SHARED_ENVS.APIGEE_BASE_URL +
            customLayerEndPoints.GET_PRIMARY_SUB_ACCOUNTS,
          {isIgnoreCachedToken:true}
        );

        if (res && res.users && res.users.length) {
          let primaryAccount = null;

          const flattendList = res.users.map((user, idx) => {
            if (!user.parent_user_id) {
              primaryAccount = {
                ...user,
                userIndex: idx,
                hasMembership:
                  user.memberships && user.memberships.length
                    ? !!user.memberships.filter((membership) => membership.isValid).length
                    : false,
                mobileDetails: this.$mobileNumberFormatter(user.mobile),
              };

              return primaryAccount;
            }

            return {
              ...user,
              userIndex: idx,
              hasMembership:
                user.memberships && user.memberships.length
                  ? !!user.memberships.filter((membership) => membership.isValid).length
                  : false,
              mobileDetails: this.$mobileNumberFormatter(user.mobile),
            };
          });

          this.usersList = flattendList;

          if (primaryAccount) {
            this.selectedUserDetails = {...primaryAccount};
            this.$store.dispatch("currentUser/updateUserInformation", {
              data: {
                firstName: primaryAccount.firstName,
                lastName: primaryAccount.lastName,
                mobile: primaryAccount.mobile,
                country_of_residence: primaryAccount.country_of_residence,
                dateOfBirth: primaryAccount.dateOfBirth,
                title: primaryAccount.title,
                gender: primaryAccount.title.toLowerCase() === "mr" ? "male" : "female",
                fullName: `${primaryAccount.firstName} ${primaryAccount.lastName}`,
                mobileDetails: { ...primaryAccount.mobileDetails },
                countryName: primaryAccount.countryName,
                nationalityCountryName: primaryAccount.nationalityCountryName,
                nationality: primaryAccount.nationality,
                age: this.$ageHandler(primaryAccount.dateOfBirth)
              },
              update: true
            });
          } else this.selectedUserDetails = {...flattendList[0]};
        }

        this.isLoading = false;
      } catch (err) {
        this.isError = true;
        this.isLoading = false;
        console.log(err);
      }
    },
    updateUsers(data) {
      // TODO: modify this.
      if (data.userData) {
        if (data.type === "updateSubAccount") {
          this.usersList = this.usersList.map((user) => {
            if (user.id === data.userData.id) {
              this.selectedUserDetails = data.userData;
              return data.userData;
            }

            return user;
          });
        } else if (data.type === "createNewSubAccount") {
          const newUser = {
            ...data.userData,
            mobileDetails: this.$mobileNumberFormatter(data.userData.mobile),
          };

          this.selectedUserDetails = newUser;
          this.usersList.push(newUser);
        } else if (data.type === "updatePrimaryAccount") {
          this.usersList = this.usersList.map((user) => {
            if (!user.parent_user_id) {
              this.selectedUserDetails = data.userData;
              return data.userData;
            }

            return user;
          });
        }
      }
    },
    setSelectedUserDetails(user) {
      this.selectedUserDetails = {...user};
    },
    statusHandler(type) {
      if (type === "waiver") {
        if (!this.currentEnv.toLowerCase().includes("dubai")) {
          return {
            type: "general",
            tooltipText: this.$t("ACCOUNT_PAGE.PROFILE.PERSONAL_DETAILS.STATUS_INDICATOR.TOOLTIP_TEXT"),
            text: this.$t("ACCOUNT_PAGE.PROFILE.PERSONAL_DETAILS.STATUS_INDICATOR.LABEL_TEXT")
          };
        }

        if ((this.selectedUserDetails.waivers || []).length) {
          if (this.selectedUserDetails.waivers[0].status === "approved") {
            return {
              type: "done"
            };
          } else {
            return {
              cta: {
                title: this.$t("ACCOUNT_PAGE.PROFILE.ACTION_CARDS.WAIVER.CTA_CHANGE_TITLE"),
                path: "/accounts/profile/waiver-form",
              },
            };
          }
        } else {
          return {
            cta: {
              title: this.$t("ACCOUNT_PAGE.PROFILE.ACTION_CARDS.WAIVER.CTA_TITLE"),
              path: "/accounts/profile/waiver-form",
            },
          };
        }
      } else if (type === "gear") {
        if (this.selectedUserDetails.UserGear) {
          return {
            cta: {
              title: this.$t("ACCOUNT_PAGE.PROFILE.ACTION_CARDS.GEAR.CTA_CHANGE_TITLE"),
              path: "/accounts/profile/set-your-gear",
            }
          };
        }

        return {
          cta: {
            title: this.$t("ACCOUNT_PAGE.PROFILE.ACTION_CARDS.GEAR.CTA_TITLE"),
            path: "/accounts/profile/set-your-gear",
          }
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.personal-details-page {
  &::v-deep {
    .card-content-wrapper {
      @apply p-0;
    }
  }

  .action-cards-container {
    @apply flex flex-col gap-y-[31px] gap-x-6 md:flex-row md:py-12 pb-[35px] pt-10 w-full;
  }
}
</style>
