<template>
  <main class="booking-confirmation-main">
    <template v-if="!isLoading">
      <template v-if="!isError">
        <SolidBlurBG custom-class="-z-1" :is-bg-image="true" />
        <SectionContentWrapper
          section-wrapper-classes="booking-confirmation"
          section-content-classes="px-4 mobiles:overflow-hidden pb-16 md:pb-20 "
        >
          <template #section-content>
            <div class="title-wrapper">
              <h1 class="title">
                {{
                  isUnCertain ? $t('BOOKING_CONFIRMATION.WAITING_FOR_BANK_CONFIRMATION') : $t('BOOKING_CONFIRMATION.COMPLETED', {location: currentLocation})
                }}
              </h1>
            </div>

            <div class="cards-container">
              <div class="booking-details-card-container">
                <CardContainer
                  wrapper-classes="px-[15px] py-[23px] min-550:px-[23px] min-550:py-[31px]"
                >
                  <template #card-content>
                    <template v-if="isUnCertain">
                      <div class="uncertain-container pb-6">
                        <h2 class="card-title">
                          {{ $t('BOOKING_CONFIRMATION.TRANSACTION_DETAILS.AWAITING_BANK_APPROVAL') }}
                        </h2>

                        <div class="description-wrapper">
                          <p class="description">
                            {{ $t('BOOKING_CONFIRMATION.TRANSACTION_DETAILS.ACCEPTANCE_EMAIL') }}
                          </p>
                        </div>
                      </div>
                      <BaseButton
                        btn-type="button"
                        :text="$t('BOOKING_CONFIRMATION.RECHECK_THE_ACCEPTANCE_OF_PAYMENT')"
                        @onBtnClick="reCheckpayment()"
                      />
                    </template>
                    <template v-else-if="bookingDetails && !isUnCertain">
                      <div class="card-header">
                        <div class="general-info">
                          <h2 class="card-title">
                            {{ $t('BOOKING_CONFIRMATION.TITLE') }}
                          </h2>
                          <div
                            v-if="
                              bookingDetails.payment_detail &&
                                bookingDetails.payment_detail
                                  .payment_share_detail &&
                                bookingDetails.payment_detail.payment_share_detail
                                  .balance_points
                            "
                            class="share-balance-wrapper"
                          >
                            <h3 class="share-balance-text">
                              {{ $t('BOOKING_CONFIRMATION.YOUR_SHARE_BALANCE_IS_NOW') }}
                              <span class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold ">{{
                                `${$decimalPlaces(
                                  bookingDetails.payment_detail
                                    .payment_share_detail.balance_points,
                                  true
                                )} ${$t('SHARE_COMPONENT.PTS')}.`
                              }}</span>
                            </h3>
                          </div>
                        </div>

                        <div class="booking-reference-info">
                          <div
                            class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-xs text-[#606060]"
                          >
                            {{ $t('BOOKING_CONFIRMATION.BOOKING_REFERENCE') }}
                            <div class="reservation-code-text">
                              {{ bookingDetails.reservation_code }}
                            </div>
                          </div>
                          <div class="qr-code-image-wrapper">
                            <img
                              :src="bookingDetails.qr_code"
                              title="booking qr image"
                              alt="booking qr image"
                              width="69"
                              height="69"
                            >
                          </div>
                        </div>
                      </div>
                      <div class="card-body">
                        <div class="order-tickets-wrapper">
                          <div class="grid-view">
                            <div class="table-header">
                              <div class="cell activity w-1/3 justify-center">
                                {{ $t('BOOKING_CONFIRMATION.ACTIVITY') }}
                              </div>
                              <div class="cell w-1/3 justify-center">
                                {{ $t('BOOKING_CONFIRMATION.DATE') }}
                              </div>
                              <div class="cell w-1/5 justify-center p-0">
                                {{ $t('BOOKING_CONFIRMATION.TICKETS') }}
                              </div>
                              <div class="cell w-1/5 justify-center p-0">
                                {{ $t('BOOKING_CONFIRMATION.PRICE') }}
                              </div>
                            </div>
                            <div class="">
                              <div
                                v-for="(collection, idx) in bookingDetails.collections" :key="idx"
                                class="table-data flex-col"
                              >
                                <div class="flex flex-col w-full">
                                  <div class="collection-name">
                                    {{ $getItemTitle(collection) }}
                                  </div>
                                  <div class="flex w-full">
                                    <div class="flex flex-col w-3/5">
                                      <div
                                        v-for="(item, i) in collection.groupedTicket"
                                        :key="i"
                                        class="flex flex-col"
                                      >
                                        <div class="flex flex-row items-center">
                                          <div class="cell activity w-1/2">
                                            <div class="">
                                              {{
                                                i != 0 && getMovieName(item) ? getMovieName(item) : getTicketTitle(item)
                                              }} -
                                              <span class="capitalize">
                                                {{
                                                  item.is_bonus
                                                    ? $t('BOOKINGFLOW_PAGE.ALL_GUESTS')
                                                    : $t(`BOOKINGFLOW_PAGE.${$options.filters.plural(item.guestType, item.totalTickets)}`, {count: item.totalTickets})
                                                }}</span>
                                            </div>
                                          </div>

                                          <div
                                            v-if="
                                              collection.type !==
                                                'ski_school' ||
                                                (item.camp_group_id !== null &&
                                                  item.camp_group_id.length === 0)
                                            "
                                            class="cell w-1/2"
                                          >
                                            {{ formatDate(collection, item) }}
                                          </div>
                                          <!--                                        camps dates-->
                                          <div v-else class="flex flex-col">
                                            <div
                                              v-for="(
                                                ticket, ticketIndex
                                              ) in collection.tickets.filter(
                                                (camp) =>
                                                  camp.camp_group_id ===
                                                  item.camp_group_id
                                              )"
                                              :key="ticketIndex"
                                              class="cell"
                                            >
                                              {{
                                                formatDate(collection, ticket)
                                              }}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div class="cell flex items-center w-1/5">
                                      {{ $pluralTextHandler(getTotalTickets(collection), 'tickets') }}
                                    </div>
                                    <div class="cell flex items-center w-1/5">
                                      {{
                                        `${$t("COMMON.BINARY_PARTS", {
                                          key: currency,
                                          value: collection.totalPrice
                                        })}`
                                      }}
                                    </div>
                                  </div>
                                </div>

                                <div
                                  v-for="(messageItem, messageIndex) in getWarningMessages(collection.card_id)"
                                  :key="`warning-message-${messageIndex}`" class="mt-2"
                                >
                                  <div class="cell">
                                    <span class="unavailable-ticket">
                                      {{ messageItem.message }}
                                    </span>
                                  </div>
                                </div>
                                <div
                                  v-if="
                                    getNonEventWarningMessage(
                                      collection.type,
                                      collection.event_date
                                    )
                                  "
                                >
                                  <div class="cell">
                                    <span class="unavailable-ticket">
                                      ⚠
                                      {{
                                        getNonEventWarningMessage(
                                          collection.type,
                                          collection.event_date
                                        )
                                      }}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div
                                v-for="(item, i) in getAddons(
                                  bookingDetails.addonTickets
                                )" :key="'addon' + i" class="table-data"
                              >
                                <div class="flex w-full">
                                  <div class="flex flex-col w-3/5">
                                    <div class="flex flex-row">
                                      <div class="cell activity w-1/2">
                                        <div class="collection-name add-on">
                                          {{ $getItemTitle(item) || item.name }}
                                        </div>
                                      </div>

                                      <div class="cell w-1/2">
                                        {{
                                          $dateFormatter(
                                            item.event_date
                                          )
                                        }}
                                      </div>
                                    </div>
                                  </div>
                                  <div class="cell flex items-center w-1/5">
                                    {{ $pluralTextHandler(item.quantity, 'tickets') }}
                                  </div>
                                  <div class="cell flex items-center w-1/5">
                                    {{
                                      `${$t("COMMON.BINARY_PARTS", {
                                        key: currency,
                                        value: item.price * item.quantity
                                      })}`
                                    }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="dashed-line" />

                          <div class="payment-details">
                            <div class="key">
                              {{ $t('BOOKING_CONFIRMATION.SUBTOTAL') }}
                            </div>
                            <div class="value">
                              {{
                                `${$t("COMMON.BINARY_PARTS", {
                                  key: bookingDetails.payment_detail.currency,
                                  value: $decimalPlaces(Number(bookingDetails.basket.gross) + Number(bookingDetails.promo_code_amount) * -1)
                                })}`
                              }}
                            </div>
                          </div>

                          <div
                            v-if="
                              bookingDetails.payment_detail &&
                                bookingDetails.payment_detail.points_redeemed > 0
                            "
                            class="payment-details extra-detials"
                          >
                            <div class="key">
                              <div
                                v-html="$t('BOOKING_CONFIRMATION.SHARE_TEXT_HANDLER', {
                                  typeOfAction: $t('BOOKING_CONFIRMATION.REDEEMED')
                                })"
                              />
                            </div>
                            <div class="value">
                              {{
                                $t("COMMON.SHOW_NUMBER", {
                                  operator: '-',
                                  key: bookingDetails.payment_detail.currency || currency,
                                  value: $decimalPlaces(bookingDetails.redeem_amount)
                                })
                              }}
                            </div>
                          </div>

                          <div
                            v-if="
                              bookingDetails.promo_code &&
                                bookingDetails.promo_code.length > 0
                            "
                            class="payment-details extra-detials"
                          >
                            <div class="key">
                              {{
                                $t('BOOKING_CONFIRMATION.PROMO_CODE_PAYMENT', {
                                  promoCodeDescription: bookingDetails.promo_code_description || $t('BOOKING_CONFIRMATION.COUPON'),
                                  promoCode: bookingDetails.promo_code
                                })
                              }}
                            </div>
                            <div v-if=" bookingDetails.promo_code_amount" class="value">
                              {{
                                $t("COMMON.SHOW_NUMBER", {
                                  operator: '-',
                                  key: (bookingDetails.payment_detail || {}).currency || currency,
                                  value: bookingDetails.promo_code_amount.replace('-', '') || "0.00"
                                })
                              }}
                            </div>
                          </div>

                          <div class="dashed-line" />

                          <div class="total-price-details">
                            <div class="flex items-center justify-between mb-1">
                              <div class="vat-text">
                                {{ $t('BOOKING_CONFIRMATION.VAT') }} (5%)
                              </div>
                              <div class="vat-number">
                                {{
                                  `${$t("COMMON.BINARY_PARTS", {
                                    key: (bookingDetails || {}).currency || currency,
                                    value: $decimalPlaces(bookingDetails.basket.tax)
                                  })}`
                                }}
                              </div>
                            </div>

                            <div class="flex items-center justify-between">
                              <div class="total-amount-text">
                                {{ $t('BOOKING_CONFIRMATION.TOTAL') }} <span>({{
                                  $t('BOOKING_CONFIRMATION.VAT_INCLUDED')
                                }})</span>
                              </div>
                              <div class="total-amount">
                                {{
                                  `${$t("COMMON.BINARY_PARTS", {
                                    key: bookingDetails.payment_detail.currency,
                                    value: $decimalPlaces(
                                      bookingDetails.pay_in_amount || bookingDetails.pay_in_amount === 0
                                        ? bookingDetails.pay_in_amount
                                        : bookingDetails.basket.gross
                                    )
                                  })}`
                                }}
                              </div>
                            </div>
                          </div>

                          <div class="dashed-line" />

                          <div v-if="bookingDetails.payment_detail">
                            <div
                              v-if="
                                bookingDetails.payment_detail
                                  .payment_share_detail &&
                                  bookingDetails.payment_detail
                                    .payment_share_detail.points_rewarded
                              "
                              class="payment-details extra-detials"
                            >
                              <div class="key">
                                <div
                                  v-html="$t('BOOKING_CONFIRMATION.SHARE_TEXT_HANDLER', {
                                    typeOfAction: $t('BOOKING_CONFIRMATION.EARNED')
                                  })"
                                />
                              </div>
                              <div class="value bold">
                                {{
                                  $decimalPlaces(
                                    bookingDetails.payment_detail
                                      .payment_share_detail.points_rewarded
                                  )
                                }}
                                <span>
                                  {{ `${$t('SHARE_COMPONENT.PTS')} = ` }}
                                </span>
                                {{
                                  `${$t("COMMON.BINARY_PARTS", {
                                    key: bookingDetails.payment_detail.currency || currency,
                                    value: $decimalPlaces(
                                      bookingDetails.payment_detail
                                        .payment_share_detail
                                        .points_rewarded_amount
                                    )
                                  })}`
                                }}
                              </div>
                            </div>

                            <!--TODO: Remove this condition when the promo code payment method is being handled from the BE team.-->
                            <div
                              v-if="
                                bookingDetails.payment_detail.payment_method
                              "
                              class="payment-details extra-detials"
                            >
                              <div class="key">
                                {{ $t('BOOKING_CONFIRMATION.PAYMENT_METHOD') }}
                              </div>
                              <div class="value">
                                {{
                                  bookingDetails.payment_detail.payment_method
                                }}
                              </div>
                            </div>
                          </div>

                          <div
                            v-if="
                              bookingDetails.promo_code &&
                                bookingDetails.promo_code.length > 0
                            "
                            class="payment-details extra-detials"
                          >
                            <div class="key">
                              {{ $t('BOOKING_CONFIRMATION.PROMO_CODE') }}
                            </div>
                            <div class="value">
                              {{ bookingDetails.promo_code }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </template>
                </CardContainer>
                <div class="mt-10 ltr:ml-4 rtl:mr-4 hidden xl:block">
                  <ContactUs />
                </div>
              </div>

              <div class="next-steps-wrapper">
                <CardContainer v-if="bookingDetails && !isUnCertain && nextSteps.length > 0">
                  <template #card-content>
                    <div class="card-header-container">
                      <h2 class="card-title">
                        {{ $t('BOOKING_CONFIRMATION.NEXT_STEPS') }}
                      </h2>
                      <div class="description-wrapper">
                        <p class="description">
                          {{ stepsWordConverter(nextSteps.length) }}
                        </p>
                      </div>
                    </div>

                    <!--TODO: get the active box based on the current step process.-->
                    <div class="steps-list-container">
                      <ul class="steps-list">
                        <nuxt-link
                          v-for="(step, index) in nextSteps"
                          :key="index"
                          :to="step.url"
                          class="steps-list-item"
                          :class="{
                            active:
                              inCompleteSteps[0] &&
                              inCompleteSteps[0].id === step.id,
                            'pointer-events-none': !checkIsClickableStep(
                              step.id
                            ),
                          }"
                        >
                          <div
                            class="step-number-container"
                            :class="{ 'dark-bg': currentEnv.includes('dhabi') }"
                          >
                            <span class="step-number">{{ index + 1 }}</span>
                          </div>

                          <div class="flex justify-between flex-1 items-center">
                            <div class="step-details-container">
                              <h3 class="step-details-title">
                                {{ step.title }}
                              </h3>
                              <div class="mt-2">
                                <p class="step-details-description">
                                  {{ step.description }}
                                </p>
                              </div>
                            </div>

                            <template
                              v-if="
                                inCompleteSteps[0] &&
                                  inCompleteSteps[0].id === step.id
                              "
                            >
                              <ArrowRight class="rtl:rotate-180" />
                            </template>
                          </div>
                        </nuxt-link>
                      </ul>
                    </div>

                    <div class="visit-note-wrapper">
                      <p class="visit-note-text">
                        {{ $t('BOOKING_CONFIRMATION.NEXT_STEPS_DESCRIPTION', {location: currentLocation}) }}
                      </p>
                    </div>
                  </template>
                </CardContainer>
              </div>
            </div>
            <div class="mt-10 xl:hidden">
              <ContactUs />
            </div>
          </template>
        </SectionContentWrapper>
      </template>
      <template v-if="isError">
        <NoData
          :title="$t('BOOKING_CONFIRMATION.NO_DATA.TITLE')"
          :cta="{
            title: $t('BOOKING_CONFIRMATION.NO_DATA.CTA_TITLE'),
            path: '/find-your-booking',
          }"
        />
      </template>
    </template>
    <section v-else class="relative">
      <SolidBlurBG custom-class="-z-1" :is-bg-image="true" />
      <snowflake-loader loader-classes="w-20 h-20" />
    </section>
  </main>
</template>

<script>
import ArrowRight from "@/components/SVGElements/ArrowRight.vue";
import ContactUs from "./ContactUs.vue";
import NoData from "@/components/Shared/NoData";

import _ from "lodash";
import {CommonEvent} from "@/services/app-events";

export default {
  name: "BookingConfirmed",
  components: {
    ArrowRight,
    ContactUs,
    NoData
  },
  data() {
    return {
      isLoading: false,
      bookingReference: "",
      bookingDetails: null,
      isGuest: false,
      isOnlyMembershipTickets: false,
      needWaiver: false,
      nextSteps: [],
      staticLabels: {},
      bottomBarData: null,
      nextStepBtnTitle: "",
      inCompleteSteps: "",
      tod: new Date(),
      isOrderHasActiveTickets: true,
      isUnCertain: false,
      currentEnv: '',
      currency: "",
      currentLocation: 'Ski Dubai',
      isRtl: false,
      isError: false
    };
  },
  created() {
    this.currentEnv = this.$getSiteCurrentEnvironment(true, true);
    this.currency = this.$getSiteConfig('currency');
    this.isRtl = this.$isArabic()
    this.getOrderDetails();

    this.currentLocation = this.$t(`LOCATIONS.${this.currentEnv}`);
  },
  mounted() {
    this.isGuest = !this.$isUserAuthenticated();
  },
  methods: {
    getMovieName(item) {
      let additionalData = item && item.tickets && item.tickets.length ? item.tickets[0].additional_data : '';
      if (!additionalData) return '';
      let additionalDataJSON = JSON.parse(additionalData);
      let movieTitle = additionalDataJSON && additionalDataJSON.movieTitle ? additionalDataJSON.movieTitle : "";
      let movieTitleLocalize = additionalDataJSON && additionalDataJSON.movieLocalizedTitle ? additionalDataJSON.movieLocalizedTitle : {};
      const isArabicLocale = this.$i18n.localeProperties.detectedLang === 'ar';
      let enName = movieTitleLocalize && movieTitleLocalize.en ? movieTitleLocalize.en : movieTitle;
      let arName = movieTitleLocalize && movieTitleLocalize.ar ? movieTitleLocalize.ar : movieTitle;
      return isArabicLocale ? arName : enName;
    },
    reCheckpayment() {
      this.isUnCertain = false;
      this.getOrderDetails();
    },
    isNonEventMsgEnabled() {
      if (
        !(
          this.staticLabels &&
          this.staticLabels.non_event_warning_wessage &&
          this.staticLabels.non_event_warning_wessage.length > 0
        )
      )
        return false;
      return true;
    },
    getNonEventWarningMessage(cardType, date) {
      if (!this.isNonEventMsgEnabled()) return "";
      if (cardType === "Pass") {
        let selectedDate = this.$stringToDate(date);
        if (
          selectedDate.getTime() ===
          this.$stringToDate(this.getGlobalMessageDate()).getTime()
        )
          return this.staticLabels.non_event_warning_wessage[0].message;
      }

      return "";
    },
    getGlobalMessageDate() {
      if (!this.isNonEventMsgEnabled()) return "";
      let date = this.staticLabels.non_event_warning_wessage[0].date;
      let dateSTR = date.split("T")[0];
      let dateArrNew = dateSTR.split("-");
      // 2022-05-12
      return `${dateArrNew[1]}/${dateArrNew[2]}/${dateArrNew[0]}`;
    },
    getWarningMessages(cardID) {
      if (this.staticLabels && this.staticLabels.cards_warning_messages && this.staticLabels.cards_warning_messages.length) {
        return (this.staticLabels.cards_warning_messages.filter(messageItem => messageItem.card_Id == cardID && messageItem.message) || []).slice(0, 2);
      }
      return [];
    },
    async getStaticMessages() {
      try {
        const result = this.$repositories.getSiteGeneralContent();

        this.staticLabels = result || {};
      } catch (error) {
        console.log({error});
      }
    },
    isValidDateEvent(eventDate) {
      const date = new Date(eventDate);
      if (date.setHours(0, 0, 0, 0) >= this.tod.setHours(0, 0, 0, 0))
        return true;

      return false;
    },
    checkOrderActiveTickets(tickets) {
      const activeTickets = tickets.filter((ticket) =>
        this.isValidDateEvent(ticket.event_date)
      );

      this.isOrderHasActiveTickets = activeTickets && activeTickets.length > 0;
    },
    async getOrderDetails() {
      try {
        this.isLoading = true;

        const saleAK = this.$route.params.id;

        const response = await this.$repositories.getOrderByCode(saleAK, this.$route.query);
        if (response && !response.isError) {
          if (!response.reservation_code) {
            if (this.$route.query.isUnCertain) this.isUnCertain = true;
            else
              this.$router.push(
                this.localePath("/booking-failed?noReservationCode=true")
              );
          } else {
            this.bookingDetails = response;
            if (this.bookingDetails.payment_detail)
              this.bookingDetails.payment_detail.currency =
                this.bookingDetails.payment_detail.currency || this.currency;
            this.mappingData();

            this.getStaticMessages();
          }
        } else {
          this.isError = true;
        }

        this.isLoading = false;
      } catch (err) {
        this.isError = true;
        this.isLoading = false;
      }
    },
    initBottomBar() {
      let nextStepBtnTitle = "";
      if (this.inCompleteSteps.length > 0) {
        nextStepBtnTitle =
          this.inCompleteSteps[0].id === "assign_guest"
            ? this.$t('BOOKING_CONFIRMATION.CONTINUE_TO_ADD_GUEST')
            : this.inCompleteSteps[0].id === "waiver"
              ? this.$t('BOOKING_CONFIRMATION.CONTINUE_TO_ADD_WAIVER')
              : this.$t('BOOKING_CONFIRMATION.CONTINUE_TO_ADD_GEAR')
      }
      let bottomBarItems = {
        ...(this.isOrderHasActiveTickets && this.inCompleteSteps.length > 0
          ? {
            leftItems: [
              {
                title: this.$t('BOOKING_CONFIRMATION.SKIP_FOR_NOW'),
                action: () => {
                  this.$router.push(this.localePath(`/`));
                },
                customClass: "text-btn",
              },
            ],
          }
          : {}),
        rightItems: [
          {
            id: "download-ticket",
            title: this.$t('BOOKING_CONFIRMATION.DOWNLOAD_TICKET'),
            action: () => {
              this.downloadTicketButton();
            },
            customClass: "text-btn ltr:mr-5 rtl:ml-5 md:ltr:mr-8 md:rtl:ml-8 flex flex-row items-center",
          },
          {
            title:
              this.inCompleteSteps.length > 0 && this.isOrderHasActiveTickets
                ? nextStepBtnTitle
                : this.$t("BOOKING_CONFIRMATION.COME_PREPARED_CTA"),
            action: () => {
              if (
                this.inCompleteSteps.length > 0 &&
                this.isOrderHasActiveTickets
              ) {
                let nextStep = this.inCompleteSteps[0];
                if (this.$isUserAuthenticated()) {
                  if (this.isOnlyMembershipTickets) {
                    this.$router.push(
                      this.localePath(
                        `/extra/waiver/${this.$route.params.id}?isMembership=true&needWaiver=true`
                      )
                    );
                  } else {
                    switch (nextStep.id) {
                      case "assign_guest":
                        this.$router.push(
                          this.localePath(
                            `/extra/add-guest/${this.$route.params.id}?isMembership=${this.isOnlyMembershipTickets}`
                          )
                        );
                        return;
                      case "waiver":
                        this.$router.push(
                          this.localePath(
                            `/extra/waiver/${this.$route.params.id}?isMembership=${this.isOnlyMembershipTickets}&needWaiver=${this.needWaiver}`
                          )
                        );
                        return;
                      case "gear":
                        this.$router.push(
                          this.localePath(
                            `/extra/gear/${this.$route.params.id}?needWaiver=${this.needWaiver}`
                          )
                        );
                    }
                  }
                } else {
                  this.$router.push(
                    this.localePath(
                      `/extra/gear/${this.$route.params.id}?needWaiver=${this.needWaiver}`
                    )
                  );
                }
              } else {
                this.$router.push(
                  this.localePath("/plan-your-visit/come-prepared")
                );
              }
            },
            customClass: 'submit-btn',
            id: "submit-btn",
          },
        ],
      };
      this.$store.dispatch("bottomBar/setBottomBarData", bottomBarItems);
      CommonEvent.$emit("show-bottom-bar", true);
    },
    formatDate(collection, item) {

      let additionalData = item.additional_data ? JSON.parse(item.additional_data) : {};

      if ((additionalData || {}).isMultipleDays) {
        return this.formatMultipleDates(additionalData.multipleDates);
      } else {
        let performance = !item.is_bonus
          ? item.performance_lists.filter((ticket) => !ticket.is_bonus)
          : item.performance_lists;
        let type = performance.length > 0 ? "dateTime" : "fullDate";

        if (type === "fullDate") {
          return this.$dateFormatter(
            collection.event_date || collection.start_date || item.start_date,
            type,
            true,
            ""
          );
        } else if (item.is_bonus) {
          let bounsTicket = item.performance_lists.find(
            (ticket) => ticket.is_bonus
          );
          if (bounsTicket)
            return this.$dateFormatter(
              bounsTicket.start_date,
              type,
              true,
              "DD MMM YYYY"
            );
        } else if (performance.length > 0) {
          return this.$dateFormatter(
            item.start_date || performance[0].start_date,
            "dateTime",
            true,
            "DD MMM YYYY"
          );
        }
      }
    },
    getSteps() {
      if (this.isGuest) {
        this.nextSteps = this.nextSteps.filter((item) =>
          item.types.includes("guest")
        );
      } else if (this.isOnlyMembershipTickets) {
        if (this.needWaiver) {
          this.nextSteps = this.nextSteps.filter((item) =>
            item.types.includes("membership")
          );
        } else {
          this.nextSteps = [];
        }
      } else if (!this.needWaiver) {
        this.nextSteps = this.nextSteps.filter((item) => item.id !== "waiver");
      }

      let doneSteps = [];
      if (this.bookingDetails.guest_added || this.isOnlyMembershipTickets) {
        doneSteps.push("assign_guest");
      }
      if (this.bookingDetails.waiver_added) {
        doneSteps.push("waiver");
      }
      if (this.bookingDetails.gear_added || this.isOnlyMembershipTickets) {
        doneSteps.push("gear");
      }

      this.inCompleteSteps = this.nextSteps.filter(
        (item) => !doneSteps.includes(item.id)
      );


      return this.nextSteps;
    },
    async downloadTicketButton() {
      this.$bottomBarLoader({
        id: "download-ticket",
        isLoading: true,
      });

      const pdf = await this.$repositories.downloadTicket(this.$route.params.id);

      if (pdf.isError) {
        this.$showToast({
          type: "red",
          text: this.$t("COMMON.ERROR_MESSAGES.ERROR_OCCURRED"),
        });
      } else {
        const mobileOS = this.$getMobileOS(
          navigator.userAgent || navigator.vendor || window.opera
        );
        let isIos = mobileOS === "iOS";

        const bookingRef = this.bookingDetails.reservation_code;
        const location = this.$getSiteConfig().title;
        const fileName = `${location}-${bookingRef}.pdf`;

        if (isIos) {
          const base64URL = pdf;
          const binary = atob(base64URL.replace(/\s/g, ""));
          const len = binary.length;
          const buffer = new ArrayBuffer(len);
          const view = new Uint8Array(buffer);

          for (let i = 0; i < len; i += 1) {
            view[i] = binary.charCodeAt(i);
          }

          // create the blob object with content-type "application/pdf"
          const blob = new Blob([view], {type: "application/pdf"});
          const url = URL.createObjectURL(blob);

          const a = document.createElement("a");
          document.body.appendChild(a);
          a.style = "display: none";
          a.href = url;
          a.download = fileName;
          a.target = "_blank";
          a.click();
        } else {
          const linkSource = `data:application/pdf;base64,${pdf}`;
          const downloadLink = document.createElement("a");
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        }
      }

      this.$bottomBarLoader({
        id: "download-ticket",
        isLoading: false,
      });
    },
    isCompletedStep(step) {
      switch (step.id) {
        case "assign_guest":
          return this.bookingDetails.guest_added;
        case "waiver":
          return this.bookingDetails.waiver_added;
        case "gear":
          return this.bookingDetails.gear_added;
      }
    },
    stepsWordConverter(numOfSteps) {
      return this.$t('BOOKING_CONFIRMATION.NEXT_STEPS_DESCRIPTION', {location: this.currentLocation})
    },
    checkIsClickableStep(id) {
      if (this.isGuest) {
        return true;
      }

      if (id === "waiver") {
        return (
          !this.bookingDetails.waiver_added && this.bookingDetails.guest_added
        );
      } else if (id === "gear") {
        return (
          !this.bookingDetails.gear_added && this.bookingDetails.guest_added
        );
      } else if (id === "assign_guest") {
        return !this.bookingDetails.guest_added;
      }
    },
    groupTicket(tickets, collection) {
      let result = [];

      tickets = tickets.filter((item) => !item.is_addon);

      let groupByGustType = _.groupBy(tickets, (item) => {
        return [item.guest_types[0].title, item['ticket_ak']];
      });
      let bounsTickets = [];
      let isCamps = false;
      let data = Object.values(groupByGustType);
      for (let k in data) {
        let performanceLists = [];

        //check if same ticket different time
        data[k].map((item) => {
          //check if not camps

          if (item.camp_group_id && item.camp_group_id.length > 0) {
            isCamps = true;
          }

          item.performance_lists.filter(
            (item) => !item.is_bonus
          ).map((list) => {
            performanceLists.push(list);
          });
        });


        let startDates = _.uniqBy(performanceLists, "start_date");

        //same ticket multiple guest
        if (startDates.length === 1 || startDates.length === 0 || isCamps) {
          let ticket = data[k][0];

          let bounsTicket = ticket.performance_lists.find(
            (item) => item.is_bonus
          );

          ticket = Object.assign({}, collection, data[k][0], {
            totalTickets:
              isCamps
                ? this.getTotalTickets(collection)
                : data[k].length,
            guestType: data[k][0].guest_types[0].title,
            parent_card_id: collection.card_id
          });
          if (ticket.performance_lists.length > 0 && !bounsTicket) {
            let t = Object.assign({}, collection, ticket, ticket.performance_lists[0]);
            result.push(t);
          } else {
            result.push(ticket);
          }
          let isExistBouns = bounsTickets.find(
            (item) =>
              item.title_en === bounsTicket.name &&
              item.collectionId === collection.id
          );
          if (bounsTicket && !isExistBouns) {
            bounsTicket.title_en = bounsTicket.name;
            if (bounsTicket.event_code === "SCP") {
              bounsTicket.title_ar = this.$t('TICKETS_CODE.SCP');
            }
            bounsTickets.push(Object.assign({}, collection, ticket, bounsTicket));
          }
        } else {
          //same ticket different time
          data[k].map((ticket) => {
            let bounsTicket = ticket.performance_lists.find(
              (item) => item.is_bonus
            );

            ticket = Object.assign({}, collection, ticket, {
              totalTickets:
                isCamps
                  ? this.getTotalTickets(collection)
                  : 1,
              guestType: ticket.guest_types[0].title,
              parent_card_id: collection.card_id
            });
            if (ticket.performance_lists.length > 0 && !bounsTicket) {
              let t = Object.assign({}, collection, ticket, ticket.performance_lists[0]);
              result.push(t);
            } else {
              result.push(ticket);
            }
            let isExistBouns = bounsTickets.find(
              (item) =>
                item.title_en === bounsTicket.name &&
                item.collectionId === collection.id
            );
            if (bounsTicket && !isExistBouns) {
              bounsTicket.title_en = bounsTicket.name;
              if (bounsTicket.event_code === "SCP") {
                bounsTicket.title_ar = this.$t('TICKETS_CODE.SCP');
              }
              // bounsTicket.title_ar = bounsTicket.name;
              bounsTickets.push(Object.assign({}, collection, ticket, bounsTicket, {parent_card_id: collection.card_id}));
            }
          });
        }
      }
      return bounsTickets.concat(result);
    },
    getAddons(tickets) {
      let groupByTitle = _.groupBy(tickets, (item) => {
        return [item['event_date'], item['title_en']];
      });
      let addons = []
      for (let k in groupByTitle) {

        addons.push(Object.assign({}, groupByTitle[k][0], {quantity: groupByTitle[k].length}))
      }
      return addons
    },
    getTotalTickets(collection) {

      let isCamps = collection.tickets.filter((item) => item.camp_group_id && item.camp_group_id.length > 0);

      if (isCamps.length === 0)
        return collection.tickets.filter((item) => !item.is_addon).length;

      return Object.keys(_.groupBy(collection.tickets, "camp_group_id")).length;
    },
    mappingData() {
      let tickets = []
      this.bookingDetails.addonTickets = []
      let items = []
      let purchaseCategory = []
      let eventDate = ''


      this.isOnlyMembershipTickets = this.bookingDetails.collections.filter(item => item.type.toLowerCase() === 'membership').length === this.bookingDetails.collections.length
      this.bookingDetails.collections.forEach(collection => {
        purchaseCategory.push(this.$repositories.getCardType(collection.type))
        collection.groupedTicket = this.groupTicket(collection.tickets, collection)
        let addonTickets = []
        let price = 0
        collection.tickets.map((item, ticketIndex) => {
          items.push({
            item_id: item.ticket_ak,
            item_name: item.title_en.length > 0 ? item.title_en : collection.title_en,
            affiliation: this.$router.app.baseUrl,
            coupon: "",
            currency: this.$getSiteConfig('currency', 'en'),
            discount: 0,
            index: ticketIndex,
            item_brand: "Ski Dubai",
            item_category: item.is_addon ? 'addon' : collection.type,
            item_category2: collection.title_en,
            item_category3: item.is_addon ? 'addon' : collection.type,
            item_category4: "",
            item_category5: "",
            item_list_id: collection.card_id,
            item_list_name: collection.title_en,
            item_variant: '',
            age_category: this.getAgeGroup(item), //Type: String
            exp_category: item.is_addon ? 'addon' : collection.type,
            number_of_lessons: 0,
            lesson_type: "",
            location_id: "",
            price: parseFloat(this.$decimalPlaces(item.price)),
            quantity: 1
          })

          if (item.is_addon) {
            addonTickets.push(Object.assign({}, collection, item))
          } else {
            price += item.original_price
          }
        })
        collection.totalPrice = price

        this.bookingDetails.addonTickets = this.bookingDetails.addonTickets.concat(addonTickets)
        tickets = tickets.concat(collection.groupedTicket)
      })

      if (this.bookingDetails.collections.length > 0) {
        eventDate = this.bookingDetails.collections[0]['event_date']
      }

      if (this.$route.query.fromBooking && this.$route.query.fromBooking.toString() === 'true') {
        let {
          promo_code: promoCode,
          trx_reference: trxReference,
          basket: basket,
          payment_detail: payment_detail,
          pay_in_amount: pay_in_amount
        } = this.bookingDetails

        purchaseCategory = [...new Set(purchaseCategory)];

        const total = pay_in_amount || pay_in_amount === 0 ? pay_in_amount : basket.gross
        this.$repositories.purchaseEvent(promoCode, trxReference, total, basket.tax, payment_detail.payment_method, purchaseCategory, items, eventDate)
        if (payment_detail.points_redeemed)
          this.$repositories.shareRedeemPointEvent(payment_detail.points_redeemed, payment_detail.payment_share_detail.balance_points)

      }


      if (!this.needWaiver) {
        let items =
          tickets && tickets.length
            ? tickets.filter((item) => item.need_waiver)
            : [];
        this.needWaiver = items.length > 0;
      }
      this.checkOrderActiveTickets(tickets);
      this.nextSteps = [
        {
          title: this.$t('BOOKING_CONFIRMATION.SELECT_GUESTS'),
          description: this.$t('BOOKING_CONFIRMATION.SELECT_GUESTS_DESCRIPTION'),
          types: ["loginUser"],
          id: "assign_guest",
          url: this.localePath(`/extra/add-guest/${this.$route.params.id}`),
        },
        {
          title: this.$t('BOOKING_CONFIRMATION.SIGN_WAIVER'),
          description: this.$t('BOOKING_CONFIRMATION.SIGN_WAIVER_DESCRIPTION'),
          types: ["loginUser", "membership"],
          id: "waiver",
          url: this.localePath(
            `/extra/waiver/${this.$route.params.id}?isMembership=${this.isOnlyMembershipTickets}&needWaiver=${this.needWaiver}`
          ),
        },
        {
          title: this.$t('BOOKING_CONFIRMATION.ADD_GEAR'),
          description: this.$t('BOOKING_CONFIRMATION.ADD_GEAR_DESCRIPTION'),
          types: ["loginUser", "guest"],
          id: "gear",
          url: this.localePath(`/extra/gear/${this.$route.params.id}?needWaiver=${
            this.needWaiver
          }${
            this.$route.query.token ? "&token=" + this.$route.query.token : ""
          }`),
        },
      ]

      this.nextSteps = this.isOrderHasActiveTickets ? this.getSteps() : [];
      this.initBottomBar();
    },
    getAgeGroup(item) {
      if (item.additional_data && item.additional_data.length > 0) {
        const additionalData = JSON.parse(item.additional_data)
        const ageGroup = additionalData ? additionalData.ageGroup ? additionalData.ageGroup[0] : {} : {}
        return ageGroup.min + '-' + ageGroup.max
      }
      return ''
    },
    formatMultipleDates(inputDates) {

      let months = [
        this.$t('COMMON.SHORT_MONTHS_NAME.JAN'),
        this.$t('COMMON.SHORT_MONTHS_NAME.FEB'),
        this.$t('COMMON.SHORT_MONTHS_NAME.MAR'),
        this.$t('COMMON.SHORT_MONTHS_NAME.APR'),
        this.$t('COMMON.SHORT_MONTHS_NAME.MAY'),
        this.$t('COMMON.SHORT_MONTHS_NAME.JUN'),
        this.$t('COMMON.SHORT_MONTHS_NAME.JUL'),
        this.$t('COMMON.SHORT_MONTHS_NAME.AUG'),
        this.$t('COMMON.SHORT_MONTHS_NAME.SEP'),
        this.$t('COMMON.SHORT_MONTHS_NAME.OCT'),
        this.$t('COMMON.SHORT_MONTHS_NAME.NOV'),
        this.$t('COMMON.SHORT_MONTHS_NAME.DEC'),
      ];
      let dates = [];

      for (let index = 0; index < inputDates.length; index++) {
        let date = this.$stringToDate(inputDates[index]);
        dates.push({
          day: date.getDate(),
          month: months[date.getMonth()],
          year: date.getFullYear(),
        });
      }

      if (this.$isArabic()) {
        dates = dates.reverse()
      }
      //
      let str = ``;
      for (let index = 0; index < dates.length; index++) {
        if (index != 0) {
          if (dates[index].month !== dates[index - 1].month) {
            str += ` ${dates[index - 1].month}`;
            if (dates[index].year !== dates[index - 1].year)
              str += ` ${dates[index - 1].year}`;
            str += `, `;
          } else {
            if (dates[index - 1].day + 1 == dates[index].day) {
              str += `-`;
            } else {
              if (dates[index].day == 1) {
                str += `-`;
              } else {
                str += `,`;
              }
            }
          }
          if (index + 1 == dates.length) {
            // no more iterations.
            str += `${dates[index].day} ${dates[index].month} ${dates[index].year}`;
          } else {
            // there is more iterations.
            if (dates[index].month === dates[index + 1].month) {
              str += dates[index].day;
            } else {
              str += `${dates[index].day}`;
              if (dates.length == 2) {
                str += ` ${dates[index].month}`;
              }
            }
          }
        } else {
          str += dates[index].day;
        }
      }
      return str;
    },
    getBonusTicketTitle(item){
      let additionalData = item && item.additional_data ? JSON.parse(item.additional_data) : {};
      return (additionalData || {}).bonusTicketTitle ? this.$getItemTitle(additionalData.bonusTicketTitle,"ar","en") : "";
    },
    getTicketTitle(item){
      let title = "";
      if(item.is_bonus) title = this.getBonusTicketTitle(item);
      if(!title) title = this.$getItemTitle(item) || item.name;
      return title;
    }    
  }
};
</script>

<style scoped lang="scss">
@import "BookingConfirmed";
</style>
