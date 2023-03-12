<template>
  <CardContainer>
    <template #card-content>
      <snowflake-loader
        v-if="isLoading"
        loader-wrapper-classes="h-52 bg-[#ffffff6e] rounded-3xl"
        loader-classes="w-24 h-24"
      />
      <template v-else>
        <template v-if="isError">
          <NoDataFound
            :no-data-text="$t('COMMON.ERROR_MESSAGES.DATA_ERROR')"
            :btn-text="$t('COMMON.TRY_AGAIN')"
            container-classes="md:my-8"
            @fetchData="getUserTransactionsHistory"
          />
        </template>
        <template v-else>
          <h1 class="title">
            {{ $t("ACCOUNT_PAGE.TRANSACTION_HISTORY.TITLE") }}
          </h1>
          <div
            v-if="(data.transactions || []).length"
            class="description-wrapper"
          >
            <p class="description">
              {{ $t("ACCOUNT_PAGE.TRANSACTION_HISTORY.PAST_PAYMENTS") }}
            </p>
          </div>

          <template v-if="data.transactions && data.transactions.length">
            <div class="flex flex-col gap-y-6 md:gap-y-8 mt-6 md:mt-8">
              <MonthTransactions
                v-for="(transaction, idx) in data.transactions"
                :key="idx"
                :month-transaction="transaction"
                :active-record-id="activeRecordId"
                :is-user-share-member="isUserShareMember && isShareInfoVisible"
                @toggleActiveRecord="toggleActiveRecord($event)"
              />
            </div>

            <div
              v-if="data.totalRecords > pageSize"
              class="view-more-btn-wrapper"
            >
              <BaseButton
                btn-type="button"
                :text="$t('ACCOUNT_PAGE.TRANSACTION_HISTORY.VIEW_MORE')"
                @onBtnClick="getMoreTransactionsRecords"
              />
            </div>
          </template>
          <div v-else :class="{'mt-2': !(data.transactions || []).length}">
            <div class="empty-transactions-title">
              {{ $t("ACCOUNT_PAGE.TRANSACTION_HISTORY.NO_TRANSACTIONS") }}
            </div>
            <div class="empty-transactions-description-wrapper">
              <p class="description">
                {{
                  $t(
                    "ACCOUNT_PAGE.TRANSACTION_HISTORY.NO_TRANSACTIONS_DESCRIPTION"
                  )
                }}
              </p>
              <NuxtLink :to="redirectURL()" class="cta-redirect-link">
                {{ $t("ACCOUNT_PAGE.TRANSACTION_HISTORY.TICKET_LINK") }}
              </NuxtLink>.
            </div>
          </div>
        </template>
      </template>
    </template>
  </CardContainer>
</template>

<script>
import NoDataFound from "@/components/Accounts/Shared/NoDataFound";
import MonthTransactions from "@/components/Accounts/Transactions/MonthTransactions.vue";

import {customLayerEndPoints} from "@/const/api";

export default {
  components: {NoDataFound, MonthTransactions},
  data() {
    return {
      isError: false,
      isLoading: false,
      activeRecordId: null,
      isUserShareMember: false,
      isShareInfoVisible: true,
      // This can be changed.
      total: 9,
      pageSize: 10,
      data: {
        transactions: [],
      },
      currentEnv: ""
    };
  },
  head() {
    return this.$seoGenerator({}, this.$t("PAGES_TITLE.ACCOUNTS.TRANSACTIONS"));
  },
  created() {
    const currentSite = this.$getSiteCurrentEnvironment();
    this.currentEnv = currentSite;
    this.isShareInfoVisible = !currentSite.includes("oman");
    this.getUserTransactionsHistory();
  },
  mounted() {
    this.isUserShareMember = this.$isShareMember();
  },
  methods: {
    redirectURL() {
      return this.localePath("/passes-packages/explore");
    },
    async getUserTransactionsHistory() {
      try {
        if (this.isError) this.isError = false;

        this.isLoading = true;

        const queryParam = `?dateGroup=1&page=1&page_size=${this.pageSize}`;
        // eslint-disable-next-line no-undef
        const {data: res} = await this.$axios.get(process.env.SHARED_ENVS.APIGEE_BASE_URL + customLayerEndPoints.GET_USER_TRANSACTIONS_HISTORY + queryParam);

        if (res && res.transactions && res.transactions.length) this.data = res;

        this.isLoading = false;
      } catch (err) {
        this.isError = true;
        this.isLoading = false;
        console.log({err});
      }
    },
    getMoreTransactionsRecords() {
      this.pageSize += 10;
      this.getUserTransactionsHistory();
    },
    toggleActiveRecord(id) {
      if (this.activeRecordId === id) this.activeRecordId = null;
      else this.activeRecordId = id;
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  @apply leading-8 md:text-[2.5rem] md:leading-10 text-[34px] text-dark-gray uppercase ltr:font-druk-heavy-italic rtl:font-adapter;
}

.description-wrapper {
  @apply mt-2 rtl:mt-4 mobiles:max-w-[253px];

  .description {
    @apply ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-xs md:text-sm md:leading-6 text-[#606060];
  }
}

.view-more-btn-wrapper {
  @apply mt-6 flex justify-end;

  .gs-base-button-default-styles {
    @apply md:pb-4 md:pt-[18px] md:px-8 pb-[15px] pt-[17px] px-[29.5px];
  }
}

.empty-transactions-title {
  @apply ltr:font-roboto-bold rtl:font-noto-sans-arabic-bold text-[18px] text-black leading-5;
}

.empty-transactions-description-wrapper {
  @apply mt-5 pt-4 border-t-1 border-dashed flex border-dark-gray border-opacity-20;

  .description,
  .cta-redirect-link {
    @apply ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-sm leading-6 text-dark-black;
  }
  .cta-redirect-link {
    @apply underline ltr:ml-1 rtl:mr-1;
  }
}
</style>
