<template>
  <div id="share" :class="{ isShareDisabled: isDisabled }">
    <!-- <div v-if="isLoading" class="loader-container">
      <snowflake-loader class="h-full" loader-classes="w-20 h-20" />
    </div> -->
    <div class="title-container">
      <div v-if="!shareDetails.isMember" class="flex flex-col flex-1">
        <div class="flex justify-between">
          <div>
            <p class="title max-w-[188px] min-1176:max-w-[unset]">
              {{ $t('SHARE_COMPONENT.YOU_COULD_EARN') }}
              {{ $isEmptyObject(share) ? "0.00" : share.earn.point }} {{ $t('SHARE_COMPONENT.SHARE_POINTS') }}
            </p>
          </div>
          <div class="share-logo-container">
            <ShareLogo
              :width="isDesktopViewVar ? '45' : '35'"
              :height="isDesktopViewVar ? '54' : '42'"
            />
          </div>
        </div>
        <div>
          <p class="join-share-today">
            {{ $t('SHARE_COMPONENT.JOIN_SHARE_TODAY_AND_ENJOY') }}
          </p>
        </div>
      </div>
      <div v-if="shareDetails.isMember" class="flex flex-col w-full relative">
        <div class="flex gap-6 justify-between">
          <div>
            <template v-if="shareDetails.balanceAmount == 0">
              <p class="title">
                {{ $t('SHARE_COMPONENT.EARN_SHARE_POINTS') }}
              </p>
              <p v-if="!$isEmptyObject(share)" class="earn-pts-on-transaction">
                <span>
                  {{ $t('SHARE_COMPONENT.EARN') }} <span>{{ share.earn.point }} {{ $t('SHARE_COMPONENT.PTS') }}</span> =
                </span>
                <span class="inline-flex gap-1">
                  <span class="ltr:order-1 rtl:order-2">{{ currency }}</span>
                  <span class="ltr:order-2 rtl:order-1">{{ share.earn.amount }}</span>
                </span>
                {{ $t('SHARE_COMPONENT.ON_THIS_TRANSACTION') }}
              </p>
            </template>
            <template v-else>
              <p class="title max-w-[220px] min-1176:max-w-[344px]">
                <span>
                  {{
                    useAllMySharePoints && isValidForm && isApplyBtnEnabled
                      ? `${$t('SHARE_COMPONENT.ALL_YOUR_SHARE_POINTS_HAVE')}`
                      : `${$t('SHARE_COMPONENT.REDEEM_SHARE_POINTS_TO_REDUCE')}`
                  }}
                </span>
                <span class="inline-flex gap-1">
                  <span class="ltr:order-1 rtl:order-2">{{ currency }}</span>
                  <span class="ltr:order-2 rtl:order-1">{{ $decimalPlaces(Number(reduceTotalUpTo)) }}</span>
                </span>
              </p>
            </template>
          </div>
          <div>
            <div class="share-logo-container">
              <ShareLogo
                :width="isDesktopViewVar ? '45' : '35'"
                :height="isDesktopViewVar ? '54' : '42'"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col pt-[0.625rem]">
          <div>
            <p class="available-share-points">
              {{ $t('SHARE_COMPONENT.AVAILABLE_SHARE_POINTS') }}
            </p>
          </div>
          <div
            class="
              flex flex-col
              min-1176:flex-row
              justify-between
              items-start
              min-1176:items-center
            "
          >
            <p class="pts-equal-aed flex gap-1">
              <span>
                {{
                  `${$decimalPlaces(
                    isValidForm && isApplyBtnEnabled
                      ? subtractionFractionNumber(shareDetails.balancePoint, (amount || 0) * 10)
                      : shareDetails.balancePoint,
                    true
                  )}
                 ${$t('SHARE_COMPONENT.PTS')} = `
                }}
              </span>


              <span class="flex gap-1">
                <span class="ltr:order-1 rtl:order-2">{{ currency }}</span>
                <span class="ltr:order-2 rtl:order-1">{{
                  $decimalPlaces(
                    isValidForm && isApplyBtnEnabled
                      ? subtractionFractionNumber(shareDetails.balanceAmount, (amount || 0))
                      : shareDetails.balanceAmount,
                    true
                  )
                }}</span>
              </span>
            </p>
            <p
              v-if="
                isDesktopViewVar || (!isDesktopViewVar && !isRedeemBtnEnabled)
              "
              class="share-id"
            >
              {{ $getMemberID() }}
            </p>
          </div>
        </div>
        <div
          v-if="shareDetails.balanceAmount > 0"
          class="flex justify-between items-center"
        >
          <button
            v-if="!isRedeemBtnEnabled"
            class="redeem-btn"
            @click="isRedeemBtnEnabled = true"
          >
            {{ $t('SHARE_COMPONENT.REDEEM') }}
          </button>
          <div
            v-if="isRedeemBtnEnabled"
            class="flex flex-col items-start mt-4 w-full"
          >
            <div class="input-group w-full">
              <!-- v-backspacePressed="handleBackPress" -->
              <input
                v-model.number="amount"
                v-accept-only-number.allowDots.allowedTwoDigitAfterDot
                type="text"
                :placeholder="`${currency} ${$t('SHARE_COMPONENT.AMOUNT')}`"
                :class="{
                  typed: amount != '' || amount === 0,
                  success: isValidForm && isApplyBtnEnabled,
                }"
                :readonly="isValidForm && isApplyBtnEnabled"
                @keyup="handleBackPress"
              >
              <span
                v-if="amount != '' || amount === 0"
                class="amount-text-input"
              >{{ currency }}</span>
              <Correct
                v-if="isValidForm && isApplyBtnEnabled"
                id="correct-sign"
                fill="#142B73"
              />
            </div>
            <div class="w-full">
              <p
                v-if="!isValidForm && isApplyBtnEnabled"
                class="exceed-share-balance"
              >
                {{ $t('SHARE_COMPONENT.THE_AMOUNT_IS_MORE_THAN') }}
              </p>
            </div>
            <div
              class="
                flex
                justify-between
                w-full
                pt-4
                flex-col
                min-1176:flex-row
              "
              :class="{
                'flex-col': !isValidForm && isApplyBtnEnabled,
                'flex-row items-center': isValidForm && isApplyBtnEnabled,
              }"
            >
              <div v-if="!isDesktopViewVar" class="flex justify-between w-full">
                <p
                  class="share-id"
                  :class="{ isRedeemBtnEnabled: isRedeemBtnEnabled }"
                >
                  {{ $getMemberID() }}
                </p>
              </div>
              <div class="flex justify-between w-full">
                <div v-if="isRedeemBtnEnabled" class="switch-container">
                  <label class="switch">
                    <input
                      v-model="useAllMySharePoints"
                      type="checkbox"
                      name="useAllMySharePoints"
                      @change="changeUseAllMySharePoints()"
                    >
                    <span class="slider" />
                  </label>
                  <p class="text-white ltr:font-marselis-pro rtl:font-noto-sans-arabic-reguler text-sm leading-4">
                    {{ $t('SHARE_COMPONENT.USE_ALL_MY_SHARE_POINTS') }}
                  </p>
                </div>
                <button
                  v-if="isValidForm && isApplyBtnEnabled"
                  class="apply-btn ltr:ml-auto rtl:mr-auto"
                  @click="removeRedeem()"
                >
                  {{ $t('BOOKINGFLOW_PAGE.REMOVE') }}
                </button>
                <button
                  v-else
                  class="apply-btn"
                  type="button"
                  @click="applyRedeem()"
                >
                  {{ $t('BOOKINGFLOW_PAGE.APPLY') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!shareDetails.isMember" class="flex pt-4 items-center gap-4">
      <button class="join-share-btn" @click="joinShare()">
        <snowflake-loader
          v-if="isJoinMemberLoaderEnabled"
          loader-wrapper-classes="h-[100%]"
          loader-classes="w-8 h-8"
        />
        <template v-else>
          {{ $t('SHARE_COMPONENT.JOIN_SHARE') }}
        </template>
      </button>

      <div class="read-share-policies">
        {{ $t('SHARE_COMPONENT.READ_SHARE') }}
        <a
          href="//www.sharerewards.com/en/terms-and-conditions#:~:text=Share%20is%20available%20to%20any,will%20be%20null%20and%20void."
          target="_blank"
        >{{ $t('SHARE_COMPONENT.TERMS_AND_CONDITIONS_SHARE') }}.</a>
      </div>
    </div>
  </div>
</template>
<script>
import ShareLogo from "@/components/SVGElements/ShareLogo.vue";
import Correct from "@/components/SVGElements/CheckShare.vue";
import {mapGetters} from "vuex";
import NP from "number-precision";

export default {
  name: "Share",
  components: {
    ShareLogo,
    Correct,
  },
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Array,
      default: () => [],
    },
    fireReset: {
      type: Boolean,
      default: false,
    },
    share: {
      type: Object,
      default: () => ({}),
    },
    orderPrice: {
      type: String,
      default: "0",
    },
    prepareSavePayload: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["loaderFinished", 'shareChangeEmiter'],
  data() {
    return {
      isApplyBtnEnabled: false,
      isRedeemBtnEnabled: false,
      amount: "",
      useAllMySharePoints: false,
      isLoading: true,
      shareDetails: {
        isMember: false,
        balanceAmount: 0,
        balancePoint: 0,
      },
      isDesktopViewVar: false,
      isJoinMemberLoaderEnabled: false,
      currency: ""
    };
  },
  computed: {
    ...mapGetters("currentUser", ["userInformation"]),
    reduceTotalUpTo() {
      if (this.shareDetails.balanceAmount > Number(this.orderPrice)) return 0;
      else return Number(this.orderPrice) - this.shareDetails.balanceAmount;
    },
    isValidForm() {
      return (
        this.shareDetails.balanceAmount >= this.amount &&
        !!this.amount &&
        this.amount != 0 &&
        this.amount <= Number(this.orderPrice)
      );
    },
  },
  watch: {
    async orderPrice() {
      if (!this.isValidForm) {
        await this.removeRedeem();
        this.isRedeemBtnEnabled = false;
      }
    },
    isDisabled(isDisabled) {
      if (isDisabled) this.isRedeemBtnEnabled = false;
    },
    async fireReset() {
      await this.removeRedeem();
      this.isRedeemBtnEnabled = false;
    },
  },
  created() {
    this.currency = this.$getSiteConfig('currency');
  },
  async mounted() {
    this.shareDetails.isMember = this.$isShareMember();
    await this.getShareBalance();
    await this.getSavedSharedDiscount();
    this.isDesktopView();
    window.addEventListener("resize", this.onResizeEvent);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResizeEvent);
  },
  methods: {
    handleBackPress(e) {
      if (e.keyCode == 8 || e.keyCode == 46) {
        this.isApplyBtnEnabled = false;
        this.$emit("shareChangeEmiter", {});
      }
    },
    async changeUseAllMySharePoints() {
      if (this.useAllMySharePoints) {
        this.isApplyBtnEnabled = false;
        this.$emit("shareChangeEmiter", {});
        if (this.shareDetails.balanceAmount >= Number(this.orderPrice)) {
          this.amount = Number(this.orderPrice);
        } else {
          this.amount = Number(
            this.$decimalPlaces(this.shareDetails.balanceAmount)
          );
        }
      } else {
        await this.removeRedeem();
      }
    },
    async getShareBalance() {
      let response = await this.$repositories.shareBalance();
      if (!this.$isEmptyObject(response || {})) {
        this.shareDetails.balanceAmount = response.balance_currency_amount || 0;
        this.shareDetails.balancePoint = response.balance_points || 0;
      }
      this.isLoading = false;
    },
    async applyRedeem(isInitial = false) {
      if (!this.amount) return false;
      this.isApplyBtnEnabled = true;
      let data = {};
      if (this.isValidForm) {
        data = {
          aedAmount: this.amount,
          useAllMySharePoints: this.useAllMySharePoints,
          cover100Percent: false,
        };
      }
      //
      if (!isInitial) {
        let payload = this.prepareSavePayload;
        payload["redeemAmount"] = this.isValidForm ? this.amount : 0;
        //
        let result = await this.$repositories.checkBasket(payload);
        this.$emit("shareChangeEmiter", {
          share: data,
          checkBasket: result,
        });
      }
    },
    async joinShare() {
      try {
        this.isJoinMemberLoaderEnabled = true;
        const res = await this.$repositories.OptIn();
        if (res && res.memberId) {
          let shareObj = this.$deepCloneArray(this.userInformation);
          shareObj["share"] = {
            isShareMember: !!res.memberId,
            memberID: res.memberId,
          };

          this.$store.commit("currentUser/UPDATE_USER_INFO", shareObj);
          this.shareDetails.isMember = true;
          this.$emit("loaderFinished", false);
        } else {
          this.$emit("loaderFinished", false);
          this.$showToast({
            type: "red",
            text: this.$t('SHARED.AN_ERROR_OCCURRED'),
          });
        }

        this.isJoinMemberLoaderEnabled = false;
      } catch (err) {
        this.isJoinMemberLoaderEnabled = false;
        this.$showToast({
          type: "red",
          text: this.$t('SHARED.AN_ERROR_OCCURRED'),
        });
        console.log({err});
      }
    },
    async removeRedeem() {
      this.isApplyBtnEnabled = false;
      this.amount = "";
      this.useAllMySharePoints = false;

      let data = this.prepareSavePayload;
      data["redeemAmount"] = 0;

      let result = await this.$repositories.checkBasket(data);
      this.$emit("shareChangeEmiter", {
        share: {},
        checkBasket: result,
      });
    },
    isDesktopView() {
      this.isDesktopViewVar = window.innerWidth >= 1176;
    },
    onResizeEvent() {
      this.isDesktopView();
    },
    async getSavedSharedDiscount() {
      for (let index = 0; index < this.discount.length; index++) {
        if (this.discount[index].discountType == "share") {
          this.isRedeemBtnEnabled = true;
          this.useAllMySharePoints = this.discount[index].useAllMySharePoints;
          setTimeout(async () => {
            this.amount = this.discount[index].aedAmount;
            await this.applyRedeem(true);
          });
        }
      }
    },
    subtractionFractionNumber(num1, num2) {
      return NP.minus(num1, num2);
    },
  }
};
</script>
<style scoped lang="scss">
@import "./Share.scss";
</style>
