<template>
  <div
    id="promoCode"
    :class="{ active: isEnabled, ispromoDisabled: ispromoDisabled }"
  >
    <!-- <div v-if="isLoading" class="loader-container">
      <snowflake-loader class="h-full" loader-classes="w-20 h-20" />
    </div> -->
    <div class="radio-btn-container">
      <span class="radio-btn" @click="setSelectedTab('PromoCode')" />
    </div>
    <div class="tabContent">
      <div>
        <p class="tabTitel" @click="setSelectedTab('PromoCode')">
          {{ paymentConfig && paymentConfig.promo_code && paymentConfig.promo_code.title ? paymentConfig.promo_code.title : $t('BOOKINGFLOW_PAGE.APPLY_PROMO_CODE') }}
        </p>
        <p class="tabSubTitle">
          {{ paymentConfig && paymentConfig.promo_code && paymentConfig.promo_code.subtitle ? paymentConfig.promo_code.subtitle : $t('BOOKINGFLOW_PAGE.USE_THE_COUPON_CODE') }}
        </p>
      </div>
      <div class="contentDetails">
        <div class="input-group">
          <form @submit.prevent="apply()">
            <input
              v-model="couponCode"
              type="text"
              name="couponCode"
              :readonly="isPromoCodeApplied"
              :placeholder="paymentConfig && paymentConfig.promo_code && paymentConfig.promo_code.alt_text ? paymentConfig.promo_code.alt_text : $t('BOOKINGFLOW_PAGE.ADD_COUPON_CODE')"
            >
            <button
              v-if="messages.class != 'text-success'"
              :class="[couponCode ? 'active' : 'disabled']"
              type="button"
              @click="apply()"
            >
              {{ $t('BOOKINGFLOW_PAGE.APPLY') }}
            </button>
            <button
              v-if="messages.class == 'text-success'"
              class="remove"
              type="button"
              @click="remove()"
            >
              {{ $t('BOOKINGFLOW_PAGE.REMOVE') }}
            </button>
          </form>
        </div>
        <div class="text-container">
          <p v-if="messages.text && couponCode" :class="messages.class">
            {{ messages.text }}
          </p>
          <button
            v-if="messages.class != 'text-success'"
            :class="[couponCode ? 'active' : 'disabled']"
            type="button"
            @click="apply()"
          >
            {{ $t('BOOKINGFLOW_PAGE.APPLY') }}
          </button>
          <button
            v-if="messages.class == 'text-success'"
            class="remove"
            type="button"
            @click="remove()"
          >
            {{ $t('BOOKINGFLOW_PAGE.REMOVE') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PromoCode",
  props: {
    prepareSavePayload: {
      type: Object,
      default: () => ({}),
    },
    promoDiscount: {
      type: Number,
      default: () => 0,
    },
    ispromoDisabled: {
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
    staticLabels: {
      type: Object,
      default: () => ({}),
    },
    paymentConfig: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isEnabled: false,
      couponCode: "",
      isLoading: false,
      isPromoCodeApplied: false,
      messages: {
        text: "",
        class: "",
      },
    };
  },
  watch: {
    ispromoDisabled(ispromoDisabled) {
      if (ispromoDisabled) this.isEnabled = false;
    },
    couponCode() {
      this.messages = {
        text: "",
        class: "",
      };
    },
    fireReset() {
      this.couponCode = "";
      this.messages = {
        text: "",
        class: "",
      };
    },
  },
  mounted() {
    setTimeout(() => {
      this.isPromoCodeSaved();
    }, 3000);
  },
  methods: {
    setSelectedTab(tab) {
      if (this.isEnabled) return false;
      this.isEnabled = true;
      this.couponCode = "";
    },
    async remove() {
      this.isLoading = true;
      this.isPromoCodeApplied = false;
      this.couponCode = "";
      this.messages = {
        text: "",
        class: "",
      };

      let data = this.prepareSavePayload;
      data["promoCode"] = "";

      let result = await this.$repositories.checkBasket(data);

      this.$emit("promoCodeChangeEmiter", {
        promoCode: {},
        checkBasket: result,
      });
      this.isLoading = false;
    },
    async apply(isInitial = false) {
      if (isInitial) {
        this.isPromoCodeApplied = true;
        this.messages = {
          text: this.staticLabels.promo_code_success_message,
          class: "text-success",
        };
        this.isPromoCodeApplied = true;
      } else {
        if (!this.couponCode) return false;
        //
        this.isLoading = true;
        let promoCodeData = {};

        let data = this.prepareSavePayload;
        if (data.lineItems.length == 0) {
          this.isLoading = false;
          return false;
        }
        data["promoCode"] = this.couponCode;
        //
        let result = await this.$repositories.checkBasket(data);
        if (result.isSuccess) {
          let dis_amount =
            result.lineItemsOriginal.basketTotal.promo_code_amount || 0;

          dis_amount = Number(dis_amount);
          if (dis_amount) {
            this.isPromoCodeApplied = true;
            this.messages = {
              text: this.staticLabels.promo_code_success_message,
              class: "text-success",
            };
            this.isPromoCodeApplied = true;
            promoCodeData = {
              couponCode: this.couponCode,
              percentage: 0,
              cover100Percent: false,
            };
            this.$emit("promoCodeChangeEmiter", {
              promoCode: promoCodeData,
              checkBasket: result,
            });
            // success
          } else {
            //failed
            this.messages = {
              text: this.staticLabels.promo_code_failed_message,
              class: "text-danger",
            };
          }
        } else {
          this.messages = {
            text: this.staticLabels.promo_code_failed_message,
            class: "text-danger",
          };
        }

        this.isLoading = false;
      }
    },
    isPromoCodeSaved() {
      if (this.$isThereAPromoCode(this.discount)) {
        this.isEnabled = true;
        this.couponCode = this.$getPromoCode(this.discount);
        setTimeout(() => {
          this.apply(true);
        });
      }
    },
  },
};
</script>
<style scoped lang="scss">
@import "./PromoCode.scss";
</style>
