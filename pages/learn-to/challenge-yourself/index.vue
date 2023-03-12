<template>
  <main v-if="!isLoading" class="challenge-yourself-main">
    <template v-if="isError">
      <ErrorModal :show-error-modal="isError" />
    </template>

    <template v-else-if="data">
      <template v-if="data.hero">
        <SectionContentWrapper
          section-wrapper-classes="h-fit min-700:h-[27rem]"
          section-content-classes="flex min-700:py-0 px-4 pb-16 pt-[7.75rem]"
          :is-with-bg-image="true"
        >
          <template #section-content>
            <div
              class="text-container"
              :class="{ 'without-img': !data.hero.image }"
            >
              <h1 class="title">
                {{ data.hero.title }}
              </h1>
              <div v-if="data.hero.subtitle" class="mt-4">
                <h2 class="sub-title">
                  {{ data.hero.subtitle }}
                </h2>
              </div>
            </div>

            <div v-if="data.hero.image" class="image-wrapper">
              <img
                :src="data.hero.image.image_url"
                :alt="data.hero.image.alt_text"
                :title="data.hero.image.title"
                width="340"
                height="340"
              >
            </div>
          </template>
        </SectionContentWrapper>
      </template>

      <SectionContentWrapper
        v-if="data.cards_section"
        section-wrapper-classes="h-fit"
        section-content-classes="pt-10 pb-14 min-700:pt-[88px] min-700:pb-[120px] px-0 md:px-4"
      >
        <template #section-content>
          <div class="w-full max-w-[648px] px-4 md:px-0">
            <h3 v-if="data.cards_section.title" class="shared-title-styles">
              {{ data.cards_section.title }}
            </h3>
            <div v-if="data.cards_section.description" class="mt-2">
              <p class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-sm leading-6 text-[#606060]">
                {{ data.cards_section.description }}
              </p>
            </div>
          </div>
          <div
            v-if="data.cards_section.cards && data.cards_section.cards.length"
            class="mt-6 min-700:mt-10 text-dark-gray"
          >
            <PassesContainer
              custom-class="full-container"
              :passes-data="slopeEventsData"
              :show-email="false"
              :card-type="'time-based'"
              :is-without-side-slides="true"
              :hide-pass-price="true"
            />
          </div>
        </template>
      </SectionContentWrapper>

      <ExperienceActivities
        v-if="data.experience_box"
        :experience-activities-data="data.experience_box"
      />

      <section v-if="data.our_community" class="our-community-section">
        <div class="content-container">
          <img
            :src="
              require(`@/assets/images/ContentPages/SkiLearnTo/ChallengeYourself/${
                $globalData.isMobileDevice
                  ? 'mobile-bg-white-snow.png'
                  : 'bg-white-snow.png'
              }`)
            "
            alt="snow white"
            title="snow white background"
            width="1440"
            height="328"
            class="w-full h-full top-0 ltr:left-0 rtl:right-0 absolute"
          >
          <div class="w-fit relative max-w-[648px]">
            <h3 class="shared-title-styles text-center">
              {{
                isUserJoinedOurCommunity
                  ? data.our_community.joined_title
                    ? data.our_community.joined_title
                    : joinCommuntiySection.joinedTitle
                  : data.our_community.title
                    ? data.our_community.title
                    : joinCommuntiySection.notJoinedTitle
              }}
            </h3>
            <div v-if="!isUserJoinedOurCommunity" class="strokes-wrapper">
              <img
                :src="
                  require('@/assets/images/ContentPages/SkiLearnTo/ChallengeYourself/strokes.png')
                "
                width="37"
                height="40"
                class="w-full h-full"
              >
            </div>
          </div>
          <div class="relative mt-4 max-w-[648px] text-center mb-8">
            <p class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-sm leading-6 text-[#606060]">
              {{
                isUserJoinedOurCommunity
                  ? data.our_community.joined_description
                    ? data.our_community.joined_description
                    : joinCommuntiySection.description
                  : data.our_community.subtitle
                    ? data.our_community.subtitle
                    : joinCommuntiySection.description
              }}
            </p>
          </div>
          <ValidationObserver
            ref="join-community"
            v-slot="{ invalid }"
            class="join-community-input-validator"
          >
            <div class="flex-1 min-550:max-w-[312px]">
              <BaseInput
                v-model="email"
                i-n-ptype="email"
                i-n-pname="email"
                :i-n-pplaceholder="$t('COMMON.EMAIL_ADDRESS')"
                :rules="{
                  required: true,
                  max: 254,
                  emailRegex: true
                }"
              />
            </div>
            <BaseButton
              btn-type="button"
              :text="`${
                isUserJoinedOurCommunity && isUserEmailSaved
                  ? joinCommuntiySection.cta.joinedTitle
                  : joinCommuntiySection.cta.notJoinedTitle
              }`"
              :is-loading="isJoinOurCommunityLoading"
              :b-t-ndisabled="invalid || !email || isUserEmailSaved || isJoinOurCommunityLoading"
              loader-wrapper-classes="absolute top-0 ltr:left-0 rtl:right-0"
              loader-classes="w-12 h-12"
              loader-color="#122b6f"
              class="btn-join-community"
              :class="isUserJoinedOurCommunity && isUserEmailSaved ? 'joined' : 'not-joined'"
              @onBtnClick="validateJoinCommunityForm"
            />
          </ValidationObserver>
        </div>
      </section>

      <section
        v-if="data.plan_your_visit"
        class="3xl:mx-auto flex items-center max-w-screen-3xl mb-[97px] min-700:mb-[84px] w-full"
      >
        <AppSection :app-section-data="data.plan_your_visit" />
      </section>
    </template>
    <template v-else>
      <NoData />
    </template>
  </main>
</template>

<script>
import ErrorModal from "@/components/Shared/ErrorModal";
import SectionContentWrapper from "@/components/Shared/SectionContentWrapper";
import ExperienceActivities from "@/components/ContentPages/PlanYourVisit/YourGuide/ExperienceActivities";
import PassesContainer from "@/components/PassesPackages/PassesContainer";
import {ValidationObserver} from 'vee-validate';
import BaseInput from "@/components/Shared/BaseUI/FormElements/BaseInput";
import BaseButton from "@/components/Shared/BaseUI/BaseButton";
import AppSection from "@/components/Shared/AppSection";
import NoData from "@/components/Shared/NoData";

import {endPoints} from "@/const/api";
import {customLayerEndPoints} from "@/const/api";
import {newsletterTypes} from "@/const/enum";

/* eslint-disable no-undef */

export default {
  components: {
    ErrorModal,
    SectionContentWrapper,
    ExperienceActivities,
    PassesContainer,
    ValidationObserver,
    BaseInput,
    BaseButton,
    AppSection,
    NoData
  },
  data() {
    return {
      isError: false,
      isLoading: false,
      data: null,
      slopeEventsData: {
        data: [],
        moments: {
          isActive: false,
          data: {
            id: "",
            title: "",
            description: "",
            image: {},
            cta: {},
            notify_text: {},
          },
        },
      },
      userSavedEmail: null,
      isJoinOurCommunityLoading: false,
      isUserJoinedOurCommunity: false,
      email: "",
      joinCommuntiySection: {
        joinedTitle: "thank you!",
        notJoinedTitle: "Our community",
        description:
          "Come join our community of folks who love to workout in the cold! Our expert instructors will help you hit your fitness goals and have fun, too. Why hit the gym when you can work up a sweat in the snow?",
        cta: {
          joinedTitle: "Sent!",
          notJoinedTitle: "Join",
        },
      },
    };
  },
  async fetch() {
    try {
      this.isLoading = true;

      const res = await this.$axios.$get(endPoints.GET_CHALLENGE_YOUR_SELF);

      // TODO: show no data msg when there's no data found.
      if (res.Success && res.Result) {
        if (res.Result.experience_box && res.Result.experience_box.activities)
          // pairing the activities.
          res.Result.experience_box.activities =
            res.Result.experience_box.activities.reduce(
              (result, value, index, array) => {
                if (index % 2 === 0) {
                  return [...result, array.slice(index, index + 2)];
                }
                return result;
              },
              []
            );

        this.data = res.Result;
        this.mapData();
      }

      this.isLoading = false;
    } catch (err) {
      this.isError = true;
      this.isLoading = false;
      console.log({err});
    }
  },
  head() {
    return this.$seoGenerator(this.data, `Challenge Yourself`)
  },
  computed: {
    isUserEmailSaved() {
      return (
        this.email === this.userSavedEmail && this.isUserJoinedOurCommunity
      );
    }
  },
  methods: {
    mapData() {
      if (
        this.data &&
        this.data.cards_section &&
        this.data.cards_section.cards
      ) {
        this.slopeEventsData.data = this.data.cards_section.cards.map(
          (item) => {
            let data = {
              ak: item.id,
              title: item.title,
              price: item.price,
              img: item.image
                ? item.image.image_url
                : require(`@/assets/images/Passes/7.webp`),
              includes: item.includes,
              extra: item.external_link,
              bookingBarDetails: {},
              is_coming_soon: item.is_coming_soon,
              coming_soon_popup: item.coming_soon_popup,
            };
            return Object.assign({}, data, item);
          }
        );

        if (this.data.cards_section.great_moment) {
          this.slopeEventsData.moments = {
            isActive: true,
            data: {
              id: this.data.cards_section.great_moment.id,
              title: this.data.cards_section.great_moment.title,
              description: this.data.cards_section.great_moment.description,
              image: this.data.cards_section.great_moment.image
                ? {...this.data.cards_section.great_moment.image}
                : {},
              cta: this.data.cards_section.great_moment.cta
                ? {...this.data.cards_section.great_moment.cta}
                : {},
            },
          };
        }
      }
    },
    async joinCommunity() {
      try {
        this.isJoinOurCommunityLoading = true;

        const res = await this.$axios.post(
          process.env.SHARED_ENVS.APIGEE_BASE_URL +
          customLayerEndPoints.JOIN_NEWS_LETTER,
          {email: this.email, newsletter_type: newsletterTypes.JOIN_COMMUNITY},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res && res.status === 200 && res.data && res.data.email) {
          this.$repositories.updatesNewsletterEvent(this.email)
          this.$showToast({
            type: "green",
            text: "Your details have been received, we will contact you shortly. Thank you!",
          });
          this.isUserJoinedOurCommunity = true;
          this.userSavedEmail = this.email;
          this.isUserJoinedOurCommunity = true;
        } else
          this.$showToast({
            type: "red",
            text: "An error occurred while sending the email, please try again.",
          });

        this.isJoinOurCommunityLoading = false;
      } catch (err) {
        this.isJoinOurCommunityLoading = false;
        this.$showToast({
          type: "red",
          text: "An error occurred while sending the email, please try again.",
        });
        console.log({err});
      }
    },
    validateJoinCommunityForm() {
      this.$refs["join-community"].validate().then((res) => {
        if (res) this.joinCommunity();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./challenge-yourself.scss";
</style>
