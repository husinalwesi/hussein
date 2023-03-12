<template>
  <div class="share-transactions-container">
    <div class="divider-dashed" />

    <CardContainer container-classes="mt-8">
      <template #card-content>
        <snowflake-loader
          v-if="isLoading"
          loader-wrapper-classes="h-52 bg-[#ffffff6e] rounded-3xl"
        />

        <template v-else>
          <div class="share-transaction-card">
            <h1 class="title">
              {{ $t("ACCOUNT_PAGE.SHARE.TRANSACTIONS.TITLE") }}
            </h1>
            <div class="description-wrapper">
              <p class="description">
                {{ $t("ACCOUNT_PAGE.SHARE.TRANSACTIONS.DESCRIPTION") }}
              </p>
            </div>

            <div
              v-if="(data.shareTransactions || []).length"
              class="month-transaction-records-container"
            >
              <div
                v-for="(transactionsGroup, groupIndex) in transactionsGroups"
                :key="groupIndex"
                class="month-transaction-records"
                :class="{'mt-8': groupIndex !== 0}"
              >
                <div class="header">
                  <div class="month">
                    {{ $dateFormatter(transactionsGroup[0].date, "monthDate") }}
                  </div>
                  <div class="empty-cell" />
                  <div v-if="groupIndex === 0" class="points-details-container">
                    <div class="points-earned-text">
                      {{ $t("ACCOUNT_PAGE.SHARE.TRANSACTIONS.EARNED_TEXT") }}<span class="points-text">({{ $t("COMMON.POINTS") }})</span>
                    </div>
                    <div class="points-redeemed-text">
                      {{ $t("ACCOUNT_PAGE.SHARE.TRANSACTIONS.REDEEMED_TEXT") }}<span class="points-text">({{ $t("COMMON.POINTS") }})</span>
                    </div>
                    <div class="amount-text">
                      {{ $t("ACCOUNT_PAGE.SHARE.TRANSACTIONS.AMOUNT_TEXT") }}
                    </div>
                  </div>
                </div>
                <div
                  v-for="(transaction, transactionIndex) in transactionsGroup"
                  :key="`transaction-${transactionIndex}`"
                  class="transaction-record"
                  @click.prevent="setActiveTransactionRecord(groupIndex, transactionIndex)"
                >
                  <div class="record-details-container">
                    <div class="w-[123px] md:min-w-[82px] md:max-w-max md:ltr:mr-[25px] md:rtl:ml-[25px] md:w-fit">
                      <div class="date">
                        {{ $dateFormatter(transaction.date) }}
                      </div>
                      <div class="location mt-1 md:hidden">
                        {{ transaction.sponser }}
                      </div>
                    </div>

                    <div class="flex flex-1">
                      <div class="location hidden md:flex md:flex-[1.42]">
                        {{ transaction.sponser }}
                      </div>
                      <div class="flex flex-1 md:flex-[2]">
                        <div class="points-earned">
                          {{ $decimalPlaces(transaction.earned) }}
                        </div>
                        <div class="points-redeemed">
                          {{ $decimalPlaces(transaction.redeemed) }}
                        </div>
                        <div class="amount">
                          {{
                            `${$t("COMMON.BINARY_PARTS", {
                              key: currency,
                              value: $decimalPlaces(transaction.amount)
                            })}`
                          }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <ul
                    v-if="activeTransactionRecord.groupIndex === groupIndex && activeTransactionRecord.transactionIndex === transactionIndex"
                    class="tickets-list"
                  >
                    <li
                      v-for="(ticket, ticketIndex) in transaction.sku"
                      :key="`ticket-${ticketIndex}`"
                      class="ticket-item"
                      :class="{'mt-2': ticketIndex !== 0}"
                    >
                      {{ `${ticket.qty} x ${ticket.title}` }}
                    </li>
                  </ul>

                  <div class="mobile-amount-container">
                    <div class="divider-dashed" />
                    <div
                      class="flex w-full flex-wrap items-center justify-between"
                    >
                      <div class="amount-text">
                        {{ $t("ACCOUNT_PAGE.SHARE.TRANSACTIONS.AMOUNT_TEXT") }}
                      </div>
                      <div class="amount-value">
                        {{
                          `${$t("COMMON.BINARY_PARTS", {
                            key: currency,
                            value: transaction.amount || "0.00"
                          })}`
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="isLoadMoreEnabled" class="view-more-container">
              <div class="divider-dashed" />
              <div class="flex justify-end">
                <BaseButton
                  btn-type="button"
                  :text="$t('ACCOUNT_PAGE.SHARE.TRANSACTIONS.VIEW_MORE_CTA_TEXT')"
                  @onBtnClick="loadMoreTransactionsRecords"
                />
              </div>
            </div>

            <div
              v-if="!(data.shareTransactions || []).length"
              class="mt-8 mobiles:mt-5"
            >
              <div class="empty-transactions-title">
                {{ $t("ACCOUNT_PAGE.SHARE.NO_TRANSACTIONS.TITLE") }}
              </div>
              <div class="empty-transactions-description-wrapper">
                <p class="description">
                  {{ $t("ACCOUNT_PAGE.SHARE.NO_TRANSACTIONS.DESCRIPTION") }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </template>
    </CardContainer>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    isLoadMoreEnabled: {
      type: Boolean,
      default: true
    }
  },
  emits: ['loadMore'],
  data() {
    return {
      activeTransactionRecord: {
        groupIndex: null,
        transactionIndex: null
      },
      currency: ''
    };
  },
  computed: {
    transactionsGroups() {
      // refernce object for holding the index
      var ref = {};
      var res = this.data.shareTransactions.reduce(function (arr1, o) {
        //  get month value
        var m = new Date(o.date).getMonth();
        // check already defined in the reference array
        if (!(m in ref)) {
          // define if not defined
          ref[m] = arr1.length;
          // push an empty array
          arr1.push([]);
        }
        // push the object into the array
        arr1[ref[m]].push(o);
        // return array refernece
        return arr1;
        // set initial value as an empty array for result
      }, []);
      return res;
    },
  },
  created() {
    this.currency = this.$getSiteConfig('currency');
  },
  methods: {
    setActiveTransactionRecord(groupIndex, transactionIndex) {
      if (
        groupIndex === this.activeTransactionRecord.groupIndex &&
        transactionIndex === this.activeTransactionRecord.transactionIndex
      )
        this.activeTransactionRecord = {};
      else this.activeTransactionRecord = {groupIndex, transactionIndex};
    },
    loadMoreTransactionsRecords() {
      this.$emit("loadMore");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./ShareTransactions.scss";
</style>
