<template>
  <div class="payments-section">
    <CardContainer wrapper-classes="p-0">
      <template #card-content>
        <snowflake-loader
          v-if="isLoading"
          loader-wrapper-classes="h-52 bg-[#ffffff6e] rounded-3xl"
        />
        <template v-else>
          <template v-if="isError">
            <NoDataFound
              :no-data-text="$t('COMMON.ERROR_MESSAGES.DATA_ERROR')"
              :btn-text="$t('COMMON.TRY_AGAIN')"
              container-classes="md:my-8"
              @fetchData="getCards"
            />
          </template>
          <div v-else class="px-[15px] py-[23px] md:p-[31px] relative">
            <h1 class="title">
              {{ $t("ACCOUNT_PAGE.PAYMENTS.TITLE") }}
            </h1>
            <div class="description">
              {{
                selectedPaymentMethodId
                  ? $t("ACCOUNT_PAGE.PAYMENTS.DESCRIPTION")
                  : $t("ACCOUNT_PAGE.PAYMENTS.ADD_CARD.DESCRIPTION")
              }}
            </div>

            <div class="payment-methods-container">
              <div
                v-if="paymentCards && paymentCards.length"
                class="flex flex-col gap-y-2"
              >
                <PaymentCard
                  v-for="(paymentCard, i) in paymentCards"
                  :key="paymentCard.cardToken"
                  :payment-card="paymentCard"
                  :selected-payment-method-id="selectedPaymentMethodId"
                  :class="
                    $globalData.isMobileDevice &&
                      `order-${
                        selectedPaymentMethodId === paymentCard.cardToken
                          ? 0
                          : i + 1
                      }`
                  "
                  @getCards="getCards($event)"
                  @removePaymentCard="removePaymentCard($event)"
                  @changeSelectedPaymentMethodInfo="
                    changeSelectedPaymentMethodInfo(paymentCard.cardToken)
                  "
                />
              </div>

              <div
                v-if="!paymentCards.length || cardFormIsActive"
                class="payment-method-card-container add-new-card"
                :class="{ selected: selectedPaymentMethodId === 'newCard' }"
              >
                <div class="flex justify-between">
                  <BaseRadio
                    v-model="selectedPaymentMethodId"
                    vid="payment"
                    attr-val="newCard"
                    :r-b-i-olabel="$t('ACCOUNT_PAGE.PAYMENTS.ADD_CARD.TITLE')"
                    r-b-i-oname="newCard"
                    r-b-i-oid="newCard"
                    :gap-val="$globalData.isMobileDevice ? 2 : 4"
                  />
                  <button
                    v-if="paymentCards.length"
                    type="button"
                    class="btn-close"
                    aria-label="close"
                    @click="cardFormIsActive = false"
                  >
                    <close-svg />
                  </button>
                </div>
                <div
                  v-if="selectedPaymentMethodId === 'newCard' || cardFormIsActive"
                  class="w-full mt-6 md:ltr:pl-8 md:rtl:pr-8"
                >
                  <div
                    class="
                      border-dark-gray
                      border-dashed
                      border-opacity-20
                      border-t-1
                      mb-6
                      md:ltr:pl-8 md:rtl:pr-8
                    "
                  />
                  <mafpay-form
                    :show-remove-btn="false"
                    @stopLoading="isSavingCardLoading = false"
                    @isSavingCardLoading="isSavingCardLoading = true"
                    @updatePaymentCardsList="updatePaymentCardsList"
                  />
                </div>
                <snowflake-loader
                  v-if="isSavingCardLoading"
                  loader-wrapper-classes="form-loader"
                />
              </div>
            </div>

            <div v-if="!!paymentCards.length" class="add-card-container">
              <button
                type="button"
                class="btn-add-card"
                @click.prevent="showCardForm"
              >
                <span class="icon-wrapper"><Plus fill="#142B73" /></span>
                {{ $t("ACCOUNT_PAGE.PAYMENTS.ADD_CARD.TITLE") }}
              </button>
            </div>

            <snowflake-loader
              v-if="isOverlayLoaderActive"
              loader-wrapper-classes="absolute bg-[#ffffffcb] h-full rounded-3xl z-[1] inset-0"
            />
          </div>
        </template>
      </template>
    </CardContainer>
  </div>
</template>

<script>
import PaymentCard from "./PaymentCard";
import mafpayForm from "@/components/Accounts/Payments/mafpayForm";
import Plus from "@/components/SVGElements/Plus.vue";
import NoDataFound from "@/components/Accounts/Shared/NoDataFound";

export default {
  components: {
    PaymentCard,
    mafpayForm,
    Plus,
    NoDataFound
  },
  data() {
    return {
      isError: false,
      isLoading: false,
      isOverlayLoaderActive: false,
      paymentCards: [],
      cardFormIsActive: false,
      selectedPaymentMethodId: "",
      isSavingCardLoading: false
    };
  },
  created() {
    this.checkQueryTokenizationProcess();
    this.getCards();
  },
  methods: {
    async changeSelectedPaymentMethodInfo(cardToken) {
      try {
        this.isOverlayLoaderActive = true;

        const res = await this.$repositories.mafPayAPI("setDefaultToken", "post", {cardToken: cardToken});

        if (res && res.success) this.selectedPaymentMethodId = cardToken;
        else
          this.$showToast({
            type: "red",
            text: this.$t("ACCOUNT_PAGE.PAYMENTS.ADD_CARD.ERROR_MESSAGE")
          });

        this.isOverlayLoaderActive = false;
      } catch (err) {
        this.isOverlayLoaderActive = false;
        this.$showToast({
          type: "red",
          text: this.$t("ACCOUNT_PAGE.PAYMENTS.ADD_CARD.ERROR_MESSAGE")
        });

        console.log({err});
      }
    },
    async getCards() {
      try {
        this.isLoading = true;
        const {data: res} = await this.$repositories.getPaymentCards();

        if (res && res.permanentCards && res.permanentCards.length)
          this.paymentCards = res.permanentCards.map((item) => {
            if (item.card.defaultCard && item.card.defaultCard.toLowerCase() === "yes")
              this.selectedPaymentMethodId = item.cardToken;

            return {
              cardMaskedNumber: item.card.cardMaskedNumber,
              expiryDate: `${item.card.expiryMonth}/${item.card.expiryYear}`,
              type: item.card.cardBrand,
              cardToken: item.cardToken,
            };
          });
        else this.paymentCards = [];

        this.isLoading = false;
      } catch (err) {
        this.isError = true;
        this.isLoading = false;
        console.log({err});
      }
    },
    removePaymentCard(cardToken) {
      this.paymentCards = this.paymentCards.filter((card) => card.cardToken !== cardToken);
    },
    showCardForm() {
      if (!this.cardFormIsActive) this.cardFormIsActive = true;
    },
    updatePaymentCardsList(newCard) {
      this.paymentCards.push({
        cardMaskedNumber: newCard.cardMaskedNumber,
        expiryDate: `${newCard.expiryMonth}/${newCard.expiryYear}`,
        type: newCard.cardBrand,
        cardToken: newCard.cardToken,
      });

      this.isSavingCardLoading = false;
      this.cardFormIsActive = false;
    },
    checkQueryTokenizationProcess() {
      const routeQuery = this.$route.query || {};
      const isQueryContainsCardToken = routeQuery.cardToken;

      this.$nextTick(() => {
        if (isQueryContainsCardToken) {
          this.$showToast({
            type: routeQuery.responseCode === "000" ? "green" : "red",
            text: routeQuery.responseMessage
          });

          const accountPaymentRoute = this.localePath("/accounts/payments");
          this.$router.push(accountPaymentRoute);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./Payments.scss";
</style>
