<template>
  <div class="transaction-record-container">
    <div class="flex justify-between items-center">
      <div class="record-general-info-container">
        <div class="day-date">
          {{ $dateFormatter(record.day, "fullDate", false) }}
        </div>
        <div class="location-name">
          {{ record.location }}
        </div>
      </div>

      <div class="transaction-total-price-container">
        <div class="flex gap-x-2 w-fit">
          <div v-if="activeRecordId === record.id" class="vat-text">
            {{ $t("ACCOUNT_PAGE.TRANSACTION_HISTORY.VAT_INCLUDED") }}
          </div>
          <div class="total-price">
            {{
              `${$t("COMMON.BINARY_PARTS", {
                key: record.currency || currency,
                value: transactionTotalPrice
              })}`
            }}
          </div>
        </div>

        <arrow-svg
          :with-wrapper="true"
          :wrapper-class="`w-6 h-6 md:w-8 md:h-8 ${
            activeRecordId === record.id ? 'bg-dark-gray' : 'bg-[#ECECEC]'
          }`"
          :arrow-color="`${activeRecordId === record.id ? 'white' : '#0A1432'}`"
          :direction="activeRecordId === record.id ? 'up' : 'down'"
          :width="$globalData.isMobileDevice ? '12' : '16'"
          :height="$globalData.isMobileDevice ? '12' : '16'"
          @onArrowClick="$emit('toggleActiveRecord', record.id)"
        />
      </div>
    </div>

    <div
      v-if="activeRecordId === record.id"
      class="transaction-details-container"
    >
      <div class="reserved-events">
        <div
          v-for="reservedEvent in record.reservedEvents"
          :key="reservedEvent.id"
          class="reserved-event"
        >
          <div class="title">
            {{ reservedEvent.title }}
          </div>

          <div
            v-if="reservedEvent.activities && reservedEvent.activities.length"
            class="activities-wrapper"
          >
            <div
              v-for="activity in reservedEvent.activities"
              :key="activity.id"
              class="activity-container"
            >
              <div class="activity-name">
                {{ activity.name }}
              </div>

              <div class="mt-2 flex flex-col gap-y-2">
                <div
                  v-for="(item, i) in activity.details"
                  :key="i"
                  class="flex justify-between items-center"
                >
                  <div class="flex items-start">
                    <p class="guests">
                      {{ item.guests }}
                    </p>

                    <div class="times-wrapper">
                      <div
                        v-for="(time, j) in item.times"
                        :key="j"
                        class="time-wrapper"
                      >
                        <span class="time">{{
                          $dateFormatter(time, "time", false)
                        }}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    class="
                      ltr:font-inter-semi-bold
                      rtl:font-noto-sans-arabic-semi-bold
                      text-xs text-dark-gray
                      w-fit
                    "
                  >
                    {{
                      item.price && typeof item.price === "string"
                        ? item.price
                        : $t("COMMON.BINARY_PARTS", {
                          key: record.currency || currency,
                          value: item.original_price || 0
                        })
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="transaction-value-details-container">
        <div class="booking-reference-container">
          {{ $t("ACCOUNT_PAGE.TRANSACTION_HISTORY.BOOKING_REFERENCE") }}
          <div class="booking-reference">
            {{ record.bookingReference }}
          </div>
        </div>

        <div class="transaction-value-details">
          <template v-if="isUserShareMember">
            <div class="transaction-value">
              <div
                v-html="$t('ACCOUNT_PAGE.TRANSACTION_HISTORY.SHARE.TEXT_HANDLER', {
                  typeOfAction: $t('ACCOUNT_PAGE.TRANSACTION_HISTORY.SHARE.REDEEMED')
                })"
              />
              <div class="share-points-value">
                {{
                  $t('ACCOUNT_PAGE.TRANSACTION_HISTORY.SHARE.VALUE_HANDLER', {
                    points: record.redeemedPoints > 0 ? "-" + $decimalPlaces(record.redeemedPoints) : "0.00",
                    currency: record.currency || currency,
                    amount: record.redeemedAmount ? $decimalPlaces(record.redeemedAmount) : "0.00"
                  })
                }}
              </div>
            </div>

            <div class="transaction-value">
              <div
                v-html="$t('ACCOUNT_PAGE.TRANSACTION_HISTORY.SHARE.TEXT_HANDLER', {
                  typeOfAction: $t('ACCOUNT_PAGE.TRANSACTION_HISTORY.SHARE.EARNED')
                })"
              />
              <div class="share-points-value">
                {{
                  $t('ACCOUNT_PAGE.TRANSACTION_HISTORY.SHARE.VALUE_HANDLER', {
                    points: (record.share || {}).points_rewarded ? record.share.points_rewarded : "0.00",
                    currency: record.currency || currency,
                    amount: (record.share || {}).points_rewarded_amount ? $decimalPlaces(record.share.points_rewarded_amount) : "0.00"
                  })
                }}
              </div>
            </div>
          </template>

          <div v-if="!!record.promoCode" class="transaction-value">
            {{ $t("ACCOUNT_PAGE.TRANSACTION_HISTORY.DISCOUNT_CODE", {code: record.promoCode}) }}

            <div
              class="
                md:ltr:font-inter-semi-bold
                md:rtl:font-noto-sans-arabic-semi-bold
              "
            >
              {{
                $t("COMMON.SHOW_NUMBER", {
                  operator: '-',
                  key: record.currency || currency,
                  value: record.promoCodeAmount ? Math.abs($decimalPlaces(record.promoCodeAmount)) : "0.00"
                })
              }}
            </div>
          </div>

          <div v-if="record.paymentMethod" class="transaction-value">
            {{ $t("ACCOUNT_PAGE.TRANSACTION_HISTORY.PAYMENT_METHOD") }}

            <div class="capitalize">
              {{ record.paymentMethod }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {minus} from "number-precision";

export default {
  props: {
    record: {
      type: Object,
      default: () => ({})
    },
    activeRecordId: {
      type: [String, Number],
      default: null
    },
    isUserShareMember: {
      type: Boolean,
      default: false
    }
  },
  emits: ["toggleActiveRecord"],
  data() {
    return {
      currency: ""
    };
  },
  computed: {
    transactionTotalPrice() {
      const {totalPrice = 0, redeemedAmount = 0} = this.record;

      const total = minus(totalPrice, redeemedAmount);
      const formattedTotalNumber = this.$decimalPlaces(total);

      return formattedTotalNumber;
    }
  },
  created() {
    this.currency = this.$getSiteConfig("currency");
  }
};
</script>

<style lang="scss" scoped>
@import "./TransactionRecord.scss";
</style>