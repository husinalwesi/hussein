<template>
  <div class="dashboard-page-container">
    <snowflake-loader
      v-if="isLoading"
      loader-wrapper-classes="h-52"
      loader-classes="w-24 h-24"
    />
    <template v-else>
      <template v-if="isError">
        <NoDataFound
          :no-data-text="$t('COMMON.ERROR_MESSAGES.DATA_ERROR')"
          :btn-text="$t('COMMON.TRY_AGAIN')"
          container-classes="my-8"
          @fetchData="getUserBookingData"
        />
      </template>
      <template
        v-else-if="
          (userBooking.transactions || []).length ||
            (generalData || {}).welcome_back_section ||
            (generalData || {}).popular_passes_section
        "
      >
        <template
          v-if="(generalData || {}).welcome_back_section && (!userBooking.isActive || !(userBooking.transactions || []).length)"
        >
          <CTABox :data="generalData.welcome_back_section" />
          <div
            v-if="(generalData || {}).popular_passes_section || (userBooking.transactions || []).length"
            class="divider-dashed"
          />
        </template>

        <template v-if="(generalData || {}).popular_passes_section && !(userBooking.transactions || []).length">
          <PopulerPasses :data="generalData.popular_passes_section" />
        </template>

        <section v-if="userBooking.transactions && userBooking.transactions.length">
          <SectionHeader :header-data="sectionHeaderData" />

          <div class="flex flex-col gap-y-10">
            <div
              v-for="(booking, bookingIndex) in userBooking.transactions"
              :key="booking.id"
            >
              <div
                v-if="userBooking.transactions.length > 1"
                class="ltr:font-inter-medium rtl:font-noto-sans-arabic-medium mb-6 md:hidden text-[#191919] text-sm"
              >
                {{
                  $t("ACCOUNT_PAGE.DASHBOARD.BOOKING_NUMBER", {
                    orderNum: bookingIndex + 1,
                    totalOrders: userBooking.transactions.length
                  })
                }}
              </div>
              <ReservedBooking
                :reserved-booking="booking"
                :active-booking-id="activeBookingId"
                :is-booking-active="!!userBooking.isActive"
                @toggleActiveBooking="toggleActiveBooking(booking.id)"
              />
            </div>
          </div>
        </section>
      </template>
      <template v-else>
        <NoDataFound
          :no-data-text="$t('COMMON.NO_DATA_FOUND')"
          :is-show-c-t-a="false"
          container-classes="my-8"
        />
      </template>
    </template>
  </div>
</template>

<script>
import NoDataFound from "@/components/Accounts/Shared/NoDataFound";
import CTABox from "@/components/Accounts/Dashboard/CTABox";
import SectionHeader from "@/components/Accounts/Dashboard/SectionHeader";
import PopulerPasses from "@/components/Accounts/Dashboard/PopulerPasses";
import ReservedBooking from "@/components/Accounts/Dashboard/ReservedBooking";
// import PageMessage from '@/components/Accounts/Shared/PageMessage';

import {endPoints} from "@/const/api";
import {customLayerEndPoints} from "@/const/api";

export default {
  components: {
    NoDataFound,
    CTABox,
    SectionHeader,
    ReservedBooking,
    PopulerPasses
  },
  data() {
    return {
      isError: false,
      isLoading: false,
      sectionHeaderData: {
        title: this.$t("ACCOUNT_PAGE.DASHBOARD.SECTION_HEADER.LAST_BOOKING.TITLE"),
        description: this.$t("ACCOUNT_PAGE.DASHBOARD.SECTION_HEADER.LAST_BOOKING.DESCRIPTION", {location: this.$t(`LOCATIONS.${this.$getSiteCurrentEnvironment(false, true)}`)}),
        cta: null
      },
      generalData: {},
      userBooking: {
        isActive: true,
        transactions: [],
      },
      activeBookingId: null,
    };
  },
  head() {
    return this.$seoGenerator({}, this.$t("PAGES_TITLE.ACCOUNTS.DASHBOARD"));
  },
  created() {
    this.getUserBookingData();
  },
  methods: {
    async getDashboardCMSData() {
      try {
        const {data: res} = await this.$axios.get(
          endPoints.GET_USER_DASHBOARD
        );

        if (res && res.Result) this.generalData = res.Result;
        // TODO: show a proper message for the empty data response.
      } catch (err) {
        this.isError = true;
        this.isLoading = false;
        console.log({err});
      }
    },
    async getUserBookingData() {
      try {
        if (this.isError) this.isError = false;

        this.isLoading = true;

        // eslint-disable-next-line no-undef
        const {data: res} = await this.$axios.get(process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.GET_USER_DASHBOARD_BOOKING);

        //TODO: Enhance this when the API response is completly clear and finished.
        if (res) {
          this.userBooking = res;
          if (res.transactions && res.transactions.length && res.isActive) {
            this.sectionHeaderData = {
              title: this.$t('ACCOUNT_PAGE.DASHBOARD.SECTION_HEADER.UPCOMING_BOOKING.TITLE'),
              description: `${this.$t('ACCOUNT_PAGE.DASHBOARD.SECTION_HEADER.UPCOMING_BOOKING.DESCRIPTION')}`,
              cta: {
                title: this.$t('ACCOUNT_PAGE.DASHBOARD.SECTION_HEADER.UPCOMING_BOOKING.CTA_TITLE'),
                url: "/plan-your-visit/come-prepared"
              }
            };
          }

          if (!res.isActive || !(res.transactions || []).length)
            await this.getDashboardCMSData();
        }

        this.isLoading = false;
      } catch (err) {
        this.isError = true;
        this.isLoading = false;
        console.log({err});
      }
    },
    toggleActiveBooking(id) {
      if (this.activeBookingId === id) this.activeBookingId = null;
      else this.activeBookingId = id;
    }
  }
};
</script>
