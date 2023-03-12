<template>
  <div class="w-full">
    <template v-if="userHasShareAccount">
      <ShareUserCard
        :is-loading="isGetUserShareBalanceLoading"
        :user-data="userData"
      />
    </template>

    <template v-else>
      <JoinShareCard
        :is-join-share-loading="isJoinShareLoading"
        @join-share="joinUserShare"
      />
    </template>
  </div>
</template>

<script>
import JoinShareCard from "./JoinShareCard/index.vue";
import ShareUserCard from "./ShareUserCard/index.vue";

import {mapGetters} from "vuex";

export default {
  components: { JoinShareCard, ShareUserCard },
  emits: ['fireGetTransactionHistory'],
  data() {
    return {
      isError: false,
      isGetUserShareBalanceLoading: false,
      isJoinShareLoading: false,
      userHasShareAccount: false,
      userData: {
        firstName: "",
        share: {
          points: "",
          totalDiscountVal: ""
        }
      }
    };
  },
  computed: { ...mapGetters("currentUser", ["userInformation"]) },
  mounted() {
    this.userHasShareAccount = this.$isShareMember();
    this.getUserShareData();
  },
  methods: {
    async getShareBalance() {
      try {
        this.isGetUserShareBalanceLoading = true;

        const response = await this.$repositories.shareBalance();

        if (!this.$isEmptyObject(response || {})) {
          this.userData.share.points = response.balance_points || "0.00";
          this.userData.share.totalDiscountVal =
            response.balance_currency_amount || "0.00";
        }

        this.isGetUserShareBalanceLoading = false;
      } catch (err) {
        this.$showToast({
          type: "red",
          text: this.$t("COMMON.ERROR_MESSAGES.ERROR_OCCURRED")
        });
        this.isGetUserShareBalanceLoading = false;
      }
    },
    async getUserShareData() {
      try {
        this.userData.firstName = this.userInformation.firstName;
        if (!this.userHasShareAccount) return false;
        await this.getShareBalance();
      } catch (err) {
        this.$showToast({
          type: "red",
          text: this.$t("COMMON.ERROR_MESSAGES.ERROR_OCCURRED")
        });
      }
    },
    async joinUserShare() {
      try {
        this.isJoinShareLoading = true;

        const res = await this.$repositories.OptIn();
        if (res && res.memberId) {
          this.$store.dispatch("currentUser/updateSpecificEntityInfo", {
            entityName: "share",
            entityValue: {
              isShareMember: true,
              memberID: res.memberId
            },
          });
          this.$emit("fireGetTransactionHistory");
          this.userHasShareAccount = true;
        } else {
          this.$showToast({
            type: "red",
            text: this.$t("COMMON.ERROR_MESSAGES.ERROR_OCCURRED")
          });
        }

        this.isJoinShareLoading = false;
      } catch (err) {
        this.isJoinShareLoading = false;
        this.$showToast({
          type: "red",
          text: this.$t("COMMON.ERROR_MESSAGES.ERROR_OCCURRED")
        });
      }
    }
  }
};
</script>
