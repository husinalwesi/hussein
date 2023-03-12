<template>
  <CardContainer wrapper-classes="p-0">
    <template #card-content>
      <div class="membership-card-container">
        <snowflake-loader
          v-if="isLoading || ($isEmptyObject(selectedUserDetails) && !isError)"
          loader-classes="w-24 h-24"
        />
        <template v-else-if="memberships.length && !isError">
          <div class="card-header">
            <div class="memberships-details-container">
              <template v-if="selectedUserDetails.hasMembership">
                <template v-if="selectedUserDetails.memberships.length > 1">
                  <h2 class="title">
                    {{ $t("ACCOUNT_PAGE.PROFILE.MEMBERSHIPS.HEADER.HAS_MEMBERSHIPS.TITLE") }}
                  </h2>

                  <ul class="content-wrapper">
                    <li
                      v-for="(userMembership, idx) in selectedUserDetails.memberships"
                      :key="userMembership.id"
                      class="user-membership"
                      :class="{'mt-8': idx}"
                    >
                      {{
                        $t("ACCOUNT_PAGE.PROFILE.MEMBERSHIPS.HEADER.HAS_MEMBERSHIPS.MEMBERSHIP_VALIDITY", {
                          title: userMembership[isArabicLang ? 'membership_title_ar' : 'membership_title_en'] + " - ",
                          date: $dateFormatter(userMembership.start_date, "fullDate", false)
                        })
                      }}

                      <div class="text-[#606060]">
                        {{
                          $t("ACCOUNT_PAGE.PROFILE.MEMBERSHIPS.HEADER.HAS_MEMBERSHIPS.MEMBERSHIP_EXPIRATION", {
                            title: userMembership[isArabicLang ? 'membership_title_ar' : 'membership_title_en'] + " - ",
                            date: $dateFormatter(userMembership.end_date, "fullDate", false)
                          })
                        }}
                      </div>
                    </li>
                  </ul>
                </template>

                <template v-else>
                  <h2 class="title">
                    {{ selectedUserDetails.memberships[0][isArabicLang ? 'membership_title_ar' : 'membership_title_en'] + " " }}
                  </h2>

                  <div class="content-wrapper">
                    <div class="user-membership">
                      {{
                        $t("ACCOUNT_PAGE.PROFILE.MEMBERSHIPS.HEADER.HAS_MEMBERSHIPS.MEMBERSHIP_VALIDITY", {
                          title: "",
                          date: $dateFormatter(selectedUserDetails.memberships[0].start_date, "fullDate", false)
                        })
                      }}

                      <div class="text-[#606060]">
                        {{
                          $t("ACCOUNT_PAGE.PROFILE.MEMBERSHIPS.HEADER.HAS_MEMBERSHIPS.MEMBERSHIP_EXPIRATION", {
                            title: "",
                            date: $dateFormatter(selectedUserDetails.memberships[0].end_date, "fullDate", false)
                          })
                        }}
                      </div>
                    </div>
                  </div>
                </template>
              </template>

              <template v-else>
                <h2 class="title">
                  {{ defaultData.header.title }}
                </h2>

                <div class="content-wrapper">
                  <p class="no-memberships-description">
                    {{ defaultData.header.description }}
                  </p>
                </div>
              </template>
            </div>

            <img
              :src="defaultData.image.image_url"
              :alt="defaultData.image.alt_text"
              :title="defaultData.image.title"
              width="81"
              height="81"
              class="card-image"
            >
          </div>


          <ul class="memberships-list">
            <li
              v-for="(membership, idx) in memberships"
              :key="idx"
              class="membership-item"
            >
              <div class="image-wrapper">
                <img
                  :src="getMembershipImageObject(membership).image_url || defaultData.membershipImage.image_url"
                  :alt="getMembershipImageObject(membership).alt_text || defaultData.membershipImage.alt_text"
                  :title="getMembershipImageObject(membership).title || defaultData.membershipImage.title"
                  width="40"
                  height="40"
                  class="rounded-lg w-10 h-10"
                >
              </div>

              <div class="body">
                <div class="details-container">
                  <div v-if="membership.title" class="title">
                    {{ membership.title }}
                  </div>
                  <div class="flex w-fit gap-2 items-center">
                    <div class="price">
                      {{
                        `${$t("COMMON.BINARY_PARTS", {
                          key: currency,
                          value: $getPackagePrice(membership)
                        })}`
                      }}
                    </div>
                    <div
                      class="text-includes"
                      @click.prevent="viewMembershipDetails(membership)"
                    >
                      {{ $t("ACCOUNT_PAGE.PROFILE.MEMBERSHIPS.WHATS_INCLUDED") }}
                    </div>
                  </div>
                </div>

                <BaseButton
                  v-if="membership.cta"
                  btn-type="button"
                  :cta="membership.cta"
                  :text="
                    membership.cta.title
                      ? membership.cta.title
                      : defaultData.cta.title
                  "
                  :b-t-ndisabled="
                    isMembershipTypeActive(membership.tickets , membership.experience_type)
                  "
                  @onBtnClick="onJoinMembershipBtnClick(membership)"
                />
              </div>
            </li>
          </ul>
        </template>
        <template v-else>
          <NoDataFound
            :no-data-text="$t('ACCOUNT_PAGE.PROFILE.MEMBERSHIPS.NO_MEMBERSHIPS_MSG')"
            :is-show-c-t-a="false"
          />
        </template>
      </div>

      <template v-if="selectedMembership">
        <MembershipFeatures
          :is-modal-active="isModalActive"
          :membership="selectedMembership"
          :user-data="{
            id: selectedUserDetails.id,
            dateOfBirth: selectedUserDetails.dateOfBirth
          }"
          :is-buy-button-disabled="
            isMembershipTypeActive(selectedMembership.tickets , selectedMembership.experience_type)
          "
          :currency="currency"
          @onCloseBtnClick="isModalActive = false"
        />
      </template>
    </template>
  </CardContainer>
</template>

<script>
import NoDataFound from "@/components/Accounts/Shared/NoDataFound";
import MembershipFeatures from "./MembershipFeatures";

import {endPoints} from "@/const/api";

/* eslint-disable no-undef */

export default {
  components: {
    MembershipFeatures,
    NoDataFound
  },
  props: {
    selectedUserDetails: {
      type: Object,
      default: () => ({}),
    },
    isError: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      isLoading: false,
      isModalActive: false,
      memberships: [],
      defaultData: {
        image: {
          image_url: require("@/assets/images/Accounts/helmet.png"),
          alt_text: "helmet",
          title: "helmet"
        },
        header: {
          title: this.$t("ACCOUNT_PAGE.PROFILE.MEMBERSHIPS.HEADER.NO_MEMBERSHIPS.TITLE"),
          description: this.$t("ACCOUNT_PAGE.PROFILE.MEMBERSHIPS.HEADER.NO_MEMBERSHIPS.DESCRIPTION")
        },
        cta: {
          title: this.$t("ACCOUNT_PAGE.PROFILE.MEMBERSHIPS.JOIN")
        },
        membershipImage: {
          image_url: require(`@/assets/images/Passes/7.webp`),
          title: "membership",
          alt_text: "membership"
        },
      },
      currentEnv: '',
      currency: '',
      isArabicLang: false,
      selectedMembership: null
    };
  },
  created() {
    const siteConfig = this.$getSiteConfig();
    const siteLang = this.$i18n.localeProperties.detectedLang;

    this.isArabicLang = siteLang === 'ar';
    this.currentEnv = siteConfig.code;
    this.currency = siteConfig.currency(siteLang);

    this.getData();
  },
  methods: {
    isMembershipTypeActive(tickets, type) {
      const userAge = this.$ageHandler(this.selectedUserDetails.dateOfBirth);

      if (tickets && tickets.length && tickets[0].minimum_age > userAge) return true;

      if (this.selectedUserDetails.hasMembership) {
        const membership = this.selectedUserDetails.memberships.find(
          (membership) => +membership.experience_type === type
        );

        if (membership) return membership.isValid;
      }

      return false;
    },
    viewMembershipDetails(membership) {
      this.selectedMembership = membership;
      this.isModalActive = true;
    },
    onJoinMembershipBtnClick(data) {
      const userAge = this.$ageHandler(this.selectedUserDetails.dateOfBirth);
      const userType =
        userAge < 7 ? "child" : userAge < 14 ? "junior" : "adult";

      data.userID = this.selectedUserDetails.id;
      data.ageType = userType;

      this.$updateAkAndRoute(data.id, -1, "membership", data);
    },
    async getData() {
      try {
        this.isLoading = true;

        const res = await this.$axios.$get(endPoints.GET_MEMBERSHIPS);

        if (res.Success && res.Result && res.Result.cards_section)
          this.memberships = res.Result.cards_section.cards
            ? res.Result.cards_section.cards
            : [];

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$showToast({
          type: "red",
          text: this.$t("ACCOUNT_PAGE.PROFILE.MEMBERSHIPS.ERROR_MESSAGE")
        });
        console.log({err});
      }
    },
    getMembershipImageObject(membership) {
      return membership.tickets &&
      membership.tickets.length &&
      membership.tickets[0].booking_card_icon
        ? membership.tickets[0].booking_card_icon
        : membership.image || {};
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./MemberchipCard.scss";
</style>
