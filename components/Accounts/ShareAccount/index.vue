<template>
  <div class="w-full relative">
    <ShareCards @fireGetTransactionHistory="fireGetTransactionHistory" />

    <template v-if="userHasShareAccount">
      <ShareTransactions
        :data="shareData"
        :is-loading="isGetShareTransactionsLoading"
        :is-load-more-enabled="!!cursor_next"
        @loadMore="loadMoreHandler"
      />
    </template>
  </div>
</template>

<script>
import ShareCards from "@/components/Accounts/Shared/ShareCards";
import ShareTransactions from "./ShareTransactions/index.vue";

export default {
  components: {ShareCards, ShareTransactions},
  data() {
    return {
      isGetShareTransactionsLoading: false,
      userHasShareAccount: false,
      shareData: {
        shareTransactions: []
      },
      cursor_next: ""
    };
  },
  mounted() {
    this.userHasShareAccount = this.$isShareMember();
    this.getTransactionHistoryData();
  },
  methods: {
    fireGetTransactionHistory() {
      setTimeout(() => {
        this.userHasShareAccount = this.$isShareMember();
        this.getTransactionHistoryData();
      });
    },
    async loadMoreHandler() {
      await this.getTransactionHistoryData();
    },
    async getTransactionHistoryData() {
      // TODO: handle the error once the dev is done.
      if (!this.userHasShareAccount) return false;
      this.isGetShareTransactionsLoading = true;

      const response = await this.$repositories.getTransactionHistory(this.cursor_next);
      this.cursor_next = response.cursor_next;
      if (response.transactions) {
        let newTransactionData = response.transactions.map((res) => {
          const result = {
            date: new Date(res.bit_date),
            sponser: res.sponsor_name,
            earned: res.points_earned,
            redeemed: res.points_redeemed,
            amount: res.amount_spent,
            sku: res.skus.map((skuItem) => {
              const result = {
                title: skuItem.product_description || "---",
                qty: skuItem.line_qty || 0
              };
              return result;
            })
          };
          return result;
        });

        this.shareData.shareTransactions = [
          ...this.shareData.shareTransactions,
          ...newTransactionData
        ];
      }

      this.isGetShareTransactionsLoading = false;
    }
  }
};
</script>
