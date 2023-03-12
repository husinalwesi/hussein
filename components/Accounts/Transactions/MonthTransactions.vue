<template>
  <div class="month-transactions-history">
    <div class="history-header">
      <div class="month">
        {{ $dateFormatter(monthTransaction.month, 'monthDate') }}
      </div>
      <div class="amount-text">
        {{ $t("ACCOUNT_PAGE.TRANSACTION_HISTORY.AMOUNT") }}
      </div>
    </div>

    <div v-if="(monthTransaction.orders || []).length" class="flex flex-col gap-y-2">
      <TransactionRecord
        v-for="record in monthTransaction.orders"
        :key="record.id"
        :record="record"
        :active-record-id="activeRecordId"
        :is-user-share-member="isUserShareMember"
        @toggleActiveRecord="$emit('toggleActiveRecord', $event)"
      />
    </div>
  </div>
</template>

<script>
import TransactionRecord from "./TransactionRecord";

export default {
  components: {TransactionRecord},
  props: {
    activeRecordId: {
      type: [String, Number],
      default: null
    },
    monthTransaction: {
      type: Object,
      default: () => ({})
    },
    isUserShareMember: {
      type: Boolean,
      default: false
    }
  },
  emits: ["toggleActiveRecord"]
};
</script>

<style lang="scss" scoped>
.month-transactions-history {
  .history-header {
    @apply flex justify-between items-center mb-2 md:mb-6;

    .month {
      @apply leading-6 md:text-base text-[#142B73] text-xs ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold capitalize;
    }

    .amount-text {
      @apply ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold text-xs leading-6 text-[#191919] md:hidden;
    }
  }
}
</style>
