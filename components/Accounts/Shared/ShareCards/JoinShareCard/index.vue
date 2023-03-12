<template>
  <div class="share-card-wrapper">
    <CardContainer wrapper-classes="p-0 relative">
      <template #card-content>
        <div class="shadow" />
        <div class="share-card-content">
          <div class="title-wrapper">
            <h1 class="title">
              {{ $t('ACCOUNT_PAGE.SHARE.JOIN_SHARE.TITLE') }}
            </h1>
          </div>
 
          <div class="join-share-container">
            <button
              type="button"
              class="btn-join min-w-[10.313rem] h-12"
              :disabled="isJoinShareLoading"
              @click.prevent="joinShare"
            >
              {{ $t('ACCOUNT_PAGE.SHARE.JOIN_SHARE.CTA_TITLE') }}
              <snowflake-loader
                v-if="isJoinShareLoading"
                loader-wrapper-classes="absolute bg-[#ffffffcb] h-full inset-0 mobiles:rounded-[100px] rounded-[80px] z-10"
                loader-classes="w-12 h-12"
              />
            </button>

            <div
              class="terms-and-conditions" v-html="$t('ACCOUNT_PAGE.SHARE.JOIN_SHARE.TERMS_AND_CONDITIONS_SHARE', {
                shareTermsConditionsLink: 'https://www.sharerewards.com/en/terms-and-conditions#:~:text=Share%20is%20available%20to%20any,will%20be%20null%20and%20void'
              })"
            />
          </div>

          <p class="description">
            {{ $t('ACCOUNT_PAGE.SHARE.JOIN_SHARE.DESCRIPTION') }}
          </p>

          <div
            class="maf-share-logo-wrapper"
            :style="{backgroundImage: `url(${require('@/assets/images/Share/curve.png')})`}"
          >
            <img
              src="~assets/images/Share/maf-logo.png"
              title="maf share logo"
              alt="maf share logo"
              width="40"
              height="48"
            >
          </div>
        </div>
      </template>
    </CardContainer>
  </div>
</template>

<script>
export default {
  props: {
    isJoinShareLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['join-share'],
  methods: {
    joinShare() {
      this.$emit("join-share");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./JoinShareCard.scss";
</style>
