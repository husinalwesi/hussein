<template>
  <main class="confirm-page-main">
    <SolidBlurBG custom-class="-z-1" :is-bg-image="true" />
    <section class="max-w-1xl mx-auto w-full lg:w-fit confirm-page">
      <div class="md:px-10 1xl:px-43 px-4 mobiles:overflow-hidden">
        <div v-if="!isLoading" class="flex justify-start mb-2">
          <Breadcrumbs v-if="$isUserAuthenticated()&&!isMembership" :active-index="2" :crumbs="breadcrumbs" />
        </div>
        <div v-if="!isLoading" class="page-title mb-8">
          {{ isMembership ? 'Sign Waiver' : $t('GEAR.ADD_GEAR') }}
        </div>
        <div class="w-full lg:w-[40.5rem]">
          <CardContainer :wrapper-classes="['px-0',isLoading?'':'pb-[31px]']">
            <template #card-content>
              <div class="card-body">
                <template v-if="isError">
                  <NoDataFound
                    :no-data-text="$t('COMMON.ERROR_MESSAGES.ERROR_OCCURRED')"
                    container-classes="mt-8"
                    @fetchData="getOrderDetails()"
                  />
                </template>
                <snowflake-loader v-else-if="isLoading" />
                <template v-else>
                  <StepWizard
                    :need-waiver="needWaiver"
                    :is-membership="isMembership"
                    :reservation-code="reservationCode"
                    :order-status="order"
                    :order-day="orderDate"
                  />
                </template>
              </div>
            </template>
          </CardContainer>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Breadcrumbs from "@/components/Shared/breadcrumbs/breadcrumbs";
import {CommonEvent} from "@/services/app-events";

import StepWizard from "@/components/Shared/BookingProgressIndicator";
import NoDataFound from "@/components/Accounts/Shared/NoDataFound";
import moment from "moment";

export default {
  name: "ConfirmBooking",
  components: {StepWizard, Breadcrumbs, NoDataFound},
  data() {
    return {
      breadcrumbs: [
        {
          title: this.$t('BOOKING_CONFIRMATION.SELECT_GUESTS'),
          path: `/extra/add-guest/${this.$route.params.id}`,
          id: "add-guest",
        },
        {
          title: this.$t('BOOKING_CONFIRMATION.SIGN_WAIVER'),
          path: `/extra/waiver/${this.$route.params.id}`,
          id: "waiver",
        },
        {
          title: this.$t('GEAR.ADD_GEAR'),
          path: `/extra/gear/${this.$route.params.id}`,
        },
      ],
      order: {},
      orderStatus: {},
      reservationCode: "",
      needWaiver: true,
      isLoading: true,
      isMembership: false,
      orderDate: "",
      isError: false,
    };
  },
  mounted() {
    this.reservationCode = this.$route.params.id;

    CommonEvent.$emit("show-bottom-bar", false);
    CommonEvent.$emit("show-booking-bar", false);
    this.needWaiver = this.$route.query.needWaiver && this.$route.query.needWaiver === "true";
    if (!this.needWaiver) {
      this.breadcrumbs = this.breadcrumbs.filter(item => item.id !== 'waiver')
    }
    this.getOrderDetails();
  },
  methods: {
    checkIsneedWaiver() {
      let needWaive = false;
      this.isMembership =
        this.order.collections.filter((item) => item.type.toLowerCase() === "membership").length === this.order.collections.length;
      this.order.collections.map((item) => {
        let tickets = item.tickets.filter((item) => item.need_waiver);

        if (tickets.length > 0) {
          needWaive = true;
        }
      });

      this.needWaiver = needWaive;
    },
    async getOrderDetails() {
      try {
        if (!this.isLoading) this.isLoading = true;
        if (this.isError) this.isError = false;

        const res = await this.$repositories.getOrderByCode(this.reservationCode);
        let dates = []
        if (res.isError) {
          this.order = {};
          this.isError = true;
        } else {
          this.order = res;

          // TODO: enhance this.
          if (res.collections && res.collections.length)
            this.orderDate = new Date(
              Math.max(
                ...res.collections.map((element) => {
                  dates.push(moment(element.event_date).toISOString())
                  return new Date(element.event_date);
                })
              )
            );

          this.orderStatus = {
            waiver_added: this.order.waiver_added,
            guest_added: this.order.guest_added,
            gear_added: this.order.gear_added,
          };
          this.checkIsneedWaiver();

          let isCompleteOrder = this.order.waiver_added && this.order.guest_added && this.order.gear_added
          if (isCompleteOrder) {
            this.$repositories.bookingCompleteEvent(this.reservationCode, dates)
          }

        }

        this.isLoading = false;
      } catch (err) {
        this.isError = true;
        this.isLoading = false;
        console.log({err});
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.confirm-page {
  margin-top: -154px;
  color: #1a1a1a;

  .page-title {
    @apply ltr:font-druk-wide-heavy-italic rtl:font-adapter text-white uppercase;

    font-size: 32px;

    @screen mobiles {
      font-size: 22px;
    }
  }
}
</style>
