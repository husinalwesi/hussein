<template>
  <main v-if="!isLoading" class="terms-conditions-main">
    <template v-if="isError">
      <ErrorModal :show-error-modal="isError" />
    </template>
    <template v-else-if="data">
      <SectionContentWrapper
        section-wrapper-classes="h-fit min-700:h-[27rem]"
        section-content-classes="flex min-700:py-0 items-center px-4 pb-12 pt-32"
        :is-with-bg-image="true"
      >
        <template #section-content>
          <div class="title-wrapper">
            <h1 class="title">
              {{ data.hero_title ? data.hero_title : termsAndConditionsData.title }}
            </h1>
          </div>
        </template>
      </SectionContentWrapper>

      <SectionContentWrapper
        :section-wrapper-classes="'mobiles:pt-10 py-20'"
        :section-content-classes="'px-4'"
      >
        <template #section-content>
          <div class="terms-conditions">
            <div
              class="terms-conditions-description-text"
              v-html="data.description_highlighted ? data.description_highlighted : termsAndConditionsData.termsAndConditions"
            />
          </div>
        </template>
      </SectionContentWrapper>
    </template>
    <template v-else>
      <NoData />
    </template>
  </main>
</template>

<script>
import ErrorModal from "@/components/Shared/ErrorModal";
import SectionContentWrapper from "@/components/Shared/SectionContentWrapper";
import NoData from "@/components/Shared/NoData";

import {endPoints} from "@/const/api";

export default {
  components: {
    ErrorModal,
    SectionContentWrapper,
    NoData
  },
  data() {
    return {
      isLoading: true,
      isError: false,
      data: null,
      termsAndConditionsData: {
        title: "Terms and Conditions",
        termsAndConditions:
          "            Important information for slope guests Skiing and snowboarding are " +
          "            extreme sports involving an element of risk. Guests are responsible " +
          "            for their participation, Ski Dubai takes no responsibility for " +
          "            personal injury or injury of others. Guests should meet the minimum " +
          "            Skills requirements to use the Slope : Stopping Safely Speed Control " +
          "            Link Turns Ability to use the lifts Skiers and Snow Boarders must " +
          "            wear helmets all the times while using the Slope Guests are " +
          "            responsible for all the rented Ski Dubai Skiing/ Snowboarding Gears " +
          "            Ski School lessons / Penguin Encounters For Ski School Lessons( " +
          "            Skiing/Snow Boarding) or Penguin Encounters, guests must arrive 40 " +
          "            minutes earlier to Ski Dubai to reach on time for the " +
          "            encounter/lessons. Otherwise Ski Dubai reserve the right to refuse " +
          "            admission and no refund will be provided To Skip the Ticketing and " +
          "            Rental Counters queues, we advise all our guests to book ticket & " +
          "            outfit/equipment online as they will head straight to the Rental " +
          "            Area to collect Access Cards, Wrist band, Outfit and Equipment from " +
          "            the online counters. Cancellation & Modifications of bookings " +
          "            Cancellation Policy Any cancellation request before 48 hours, full " +
          "            refund will be provided Any cancellation request notification within " +
          "            24 hours, half of the refund will be provided Any cancellation " +
          "            request on the same day of the booking is not accepted and full " +
          "            amount will be charged Modification Policy All Tickets modifications " +
          "            should take place before 24 hours Same day modification are subject " +
          "            to tickets availability Need help? To modify, cancel and Inquire " +
          "            about bookings Call 800386 (within UAE) or 009714800886 (outside " +
          "            UAE) Send an email to skidxb.callcenter@maf.ae Visit our Guest " +
          "            Service Counter Admission Policy Snow Park / Snow Penguin For their " +
          "            own safety, children under two years of age are not permitted inside " +
          "            Ski Dubai Children aged 14 years or under must be accompanied by an " +
          "            adult aged 16 yrs or above To ride on the Snow Bullet Ride children " +
          "            must be above 8 years, 125 cm in height and more than 30 kgs in " +
          "            weight.Adults should not weigh more than 120 kgs Slope For their own " +
          "            safety, children under Two years of age are not permitted in Ski " +
          "            Dubai Slope Skiers/Snowboarders between the ages of 2-8 years can " +
          "            only enter with adult supervision Skiers/snowboarders between the " +
          "            ages of 9 - 12 years can enter if the guardian is present within " +
          "            Mall of the Emirates premises Skiers/snowboarders below 21 years old " +
          "            must submit the waiver form signed by their guardian to enter the " +
          "            slope Ski School Lessons Kids enrolled in Discovery Lessons do not " +
          "            require adult supervision as they will be supervised by our " +
          "            qualified instructors Minimum age for Ski lessons is 3 years and 8 " +
          "            years for Snowboard lessons " +
          "          ",
      },
    };
  },
  async fetch() {
    try {
      const res = await this.$axios.$get(
        endPoints.GET_TERMS_CONDITIONS_AND_PRIVACY_POLICY
      );

      if (res.Success && res.Result) {
        this.data = res.Result.terms_and_conditions;
      }
      this.isLoading = false;
    } catch (err) {
      this.isError = true;
      this.isLoading = false;
      console.log({err});
    }
  },
  head() {
    return this.$seoGenerator(this.data, "Terms And Conditions");
  },
};
</script>

<style lang="scss" scoped>
.terms-conditions-main {
  .title-wrapper {
    @apply w-full max-w-[872px];

    .title {
      @apply w-full min-900:text-6xl text-white uppercase ltr:font-druk-wide-heavy-italic rtl:font-adapter leading-8 min-320:text-[30px] min-360:text-[32px] min-700:text-5xl text-3xl;
    }
  }

  .terms-conditions {
    @apply w-full h-fit;

    .terms-conditions-description-text {
      @apply ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-dark-gray;

      &::v-deep {
        ul {
          @apply ltr:pl-6 rtl:pr-6 list-disc;
        }

        ol {
          @apply ltr:pl-6 rtl:pr-6 list-decimal;
        }
      }
    }
  }

  &::v-deep {
    h1 {
      @apply text-2xl rtl:leading-[unset];
    }

    strong {
      @apply ltr:font-inter-bold rtl:font-noto-sans-arabic-bold;
    }
  }
}
</style>
