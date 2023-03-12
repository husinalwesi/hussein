<template>
  <div class="share-card-wrapper">
    <CardContainer wrapper-classes="p-0 relative">
      <template #card-content>
        <div class="shadow" />
        <div class="share-card-container">
          <div>
            <div class="user-name">
              {{ $t('ACCOUNT_PAGE.SHARE.USER_CARD.WELCOME_TEXT', {userFirstName: userData.firstName}) }}
            </div>

            <div class="bar-code-img-wrapper block lg:hidden">
              <p class="share-id">
                {{ $getMemberID() }}
              </p>
            </div>

            <div class="mt-[1.3125rem] text-white">
              <div class="share-points-text">
                {{ $t("ACCOUNT_PAGE.SHARE.USER_CARD.AVAILABLE_SHARE_POINTS") }}
              </div>
              <div class="user-share-points">
                {{
                  $t('ACCOUNT_PAGE.SHARE.USER_CARD.POINTS_TEXT', {
                    points: $decimalPlaces(userData.share.points, true),
                    currency: currency,
                    amount: $decimalPlaces(userData.share.totalDiscountVal, true)
                  })
                }}
              </div>
            </div>
          </div>

          <div class="bar-code-img-wrapper hidden lg:block">
            <p class="share-id">
              {{ $getMemberID() }}
            </p>
          </div>

          <div
            class="maf-share-logo-wrapper"
            :style="{backgroundImage: `url(${require('@/assets/images/Share/curve.png')})`}"
          >
            <img
              src="~assets/images/Share/maf-logo.png"
              alt="maf share logo"
              title="maf share logo"
              width="40"
              height="48"
            >
          </div>
        </div>

        <snowflake-loader
          v-if="isLoading"
          loader-wrapper-classes="rounded-3xl absolute bg-[#ffffffcb] h-[100%] z-10 inset-0"
        />
      </template>
    </CardContainer>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {type: Boolean, default: false},
    userData: {type: Object, default: () => ({})}
  },
  data() {
    return {
      currency: ""
    }
  },
  created() {
    this.currency = this.$getSiteConfig("currency");
  }
};
</script>

<style lang="scss" scoped>
@import "./ShareUserCard.scss";
</style>
