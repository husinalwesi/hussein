<template>
  <div
    class="payment-card-container"
    :class="{ selected: selectedPaymentMethodId === paymentCard.cardToken }"
  >
    <BaseRadio
      v-model="value"
      vid="payment"
      :attr-val="paymentCard.cardToken"
      :r-b-i-oname="paymentCard.cardToken"
      :r-b-i-oid="paymentCard.cardToken"
      :content-type="'component'"
      :gap-val="$globalData.isMobileDevice ? 2 : 4"
    >
      <template #inner-content>
        <div
          class="
            flex
            items-center
            justify-between
            lg:cursor-pointer
            md:py-[15px]
            pb-3
            pt-[10px]
            w-full
          "
        >
          <div class="flex items-center gap-x-2 md:gap-x-4">
            <VisaPayment
              v-if="paymentCard.type === 'VISA'"
              :width="$globalData.isMobileDevice ? '32' : '39'"
              :height="$globalData.isMobileDevice ? '20' : '24'"
            />
            <img
              v-else
              src="./master.png"
              alt="master"
              title="master"
              :width="$globalData.isMobileDevice ? '32' : '39'"
              :height="$globalData.isMobileDevice ? '20' : '24'"
            >
            <div class="card-masked-number">
              {{ $t("ACCOUNT_PAGE.PAYMENTS.PAYMENT_CARD.MASKED_TEXT", {cardMaskedNumber:cardFormatterHandler(paymentCard.cardMaskedNumber)}) }}
              <span class="card-expiry-date">{{ paymentCard.expiryDate }}</span>
            </div>
          </div>
          <div class="flex gap-x-4 items-center">
            <div
              v-if="selectedPaymentMethodId === paymentCard.cardToken"
              class="
                ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold
                hidden
                leading-4
                md:block md:text-xs
                text-[10px] text-dark-gray
              "
            >
              {{ $t("ACCOUNT_PAGE.PAYMENTS.PAYMENT_CARD.DEFAULT_PAYMENT") }}
            </div>
            <button
              type="button"
              class="btn-close"
              aria-label="close"
              @click.prevent="showRemoveModal = true"
            >
              <close-svg />
            </button>
          </div>
        </div>
      </template>
    </BaseRadio>
    <RemoveCardModal
      :show-remove-modal="showRemoveModal"
      :is-loading="isLoading"
      @closeRemoveModal="showRemoveModal = false"
      @removePaymentCard="deleteCard(paymentCard)"
    />
  </div>
</template>

<script>
import VisaPayment from "@/components/SVGElements/VisaPayment.vue";
import RemoveCardModal from "./RemoveModal/index.vue";

export default {
  components: {
    VisaPayment,
    RemoveCardModal,
  },
  props: {
    paymentCard: {
      type: Object,
      required: true,
    },
    selectedPaymentMethodId: {
      type: [String, Number],
      default: null,
    },
  },
  emits: ["changeSelectedPaymentMethodInfo", "removePaymentCard"],
  data() {
    return {
      isLoading: false,
      showRemoveModal: false,
    };
  },
  computed: {
    value: {
      get() {
        return this.selectedPaymentMethodId;
      },
      set() {
        this.$emit("changeSelectedPaymentMethodInfo");
      },
    },
  },
  methods: {
    cardFormatterHandler(cardNumber) {
      if (!cardNumber) return "";
      if (cardNumber.length < 4) return cardNumber;
      return cardNumber.slice(cardNumber.length - 4);
    },
    async deleteCard({cardToken}) {
      try {
        this.isLoading = true;

        const res = await this.$repositories.removePaymentCard(cardToken);
        if (
          res && res.status === 200 &&
          res.data && res.data.responseCode === "000"
        ) {
          this.showRemoveModal = false;
          this.$nextTick(() => this.$emit("removePaymentCard", cardToken));
        } else
          this.$showToast({
            type: "red",
            text: this.$t("ACCOUNT_PAGE.PAYMENTS.PAYMENT_CARD.REMOVE_MODAL.ERROR_MESSAGE")
          });

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$showToast({
          type: "red",
          text: this.$t("ACCOUNT_PAGE.PAYMENTS.PAYMENT_CARD.REMOVE_MODAL.ERROR_MESSAGE")
        });
        console.log({ err });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./PaymentCard.scss";
</style>
