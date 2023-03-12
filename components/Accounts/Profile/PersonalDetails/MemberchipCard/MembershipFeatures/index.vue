<template>
  <div class="membership-features-modal-wrapper">
    <BaseModal :show-modal="isModalActive" :show-close-icon="false">
      <template #header>
        <div class="header-content-container">
          <div class="order-2 lg:order-1">
            <h3 class="title">
              {{ membership.title }}
            </h3>
            <h4 class="price">
              {{
                `${$t("COMMON.BINARY_PARTS", {
                  key: currency,
                  value: $getPackagePrice(membership)
                })}`
              }}
            </h4>

            <h5 class="text-xs text-[#606060] mt-2 ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler">
              {{ $t("ACCOUNT_PAGE.PROFILE.MEMBERSHIPS.FEATURES.VAT") }}
            </h5>
          </div>
          <div class="membership-image-wrapper">
            <img
              :src="
                (membership.image || {}).image_url
                  ? membership.image.image_url
                  : defaultData.image.image_url
              "
              :alt="
                (membership.image || {}).alt_text
                  ? membership.image.alt_text
                  : defaultData.image.alt_text
              "
              :title="
                (membership.image || {}).title
                  ? membership.image.title
                  : defaultData.image.title
              "
              class="membership-image"
            >
          </div>
        </div>
      </template>

      <template #extra-element>
        <p class="membership-description">
          {{ membership.description }}
        </p>

        <div class="divider-dashed-line my-6" />

        <div
          v-if="membership.includes && membership.includes.length"
          class="mb-6"
        >
          <label class="text-xl leading-6 text-[#191919] ltr:font-inter-bold rtl:font-noto-sans-arabic-bold mb-4">
            {{ $t("ACCOUNT_PAGE.PROFILE.MEMBERSHIPS.FEATURES.INCLUDES") }}
          </label>
          <ul class="includes-list">
            <li
              v-for="(point, idx) in membership.includes"
              :key="idx"
              class="include-point"
            >
              <span class="check-mark-wrapper">
                <Checkmark />
              </span>
              {{ point.include_text }}
            </li>
          </ul>

          <div class="divider-dashed-line" />
        </div>

        <div class="actions-container">
          <button
            type="button"
            class="btn-close"
            @click.prevent="$emit('onCloseBtnClick')"
          >
            {{ $t("COMMON.CLOSE") }}
          </button>
          <button
            type="button"
            class="btn-action"
            :disabled="isBuyButtonDisabled"
            @click.prevent="onBuyMembershipBtnClick"
          >
            {{ $t("ACCOUNT_PAGE.PROFILE.MEMBERSHIPS.FEATURES.CTA_BUY_TEXT") }}
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script>
export default {
  props: {
    isModalActive: {
      type: Boolean,
      default: false,
    },
    membership: { type: Object, default: () => ({}) },
    userData: { type: Object, default: () => ({}) },
    isBuyButtonDisabled: {
      type: Boolean,
      default: false,
    },
    currency: {
      type: String,
      default: ''
    }
  },
  emits: ["onCloseBtnClick"],
  data() {
    return {
      defaultData: {
        image: {
          // eslint-disable-next-line no-undef
          image_url: require(`@/assets/images/Passes/7.webp`),
          title: "membership",
          alt_text: "membership",
        }
      }
    };
  },
  methods: {
    onBuyMembershipBtnClick() {
      const userAge = this.calculateAge(this.userData.dateOfBirth);
      const userType =
        userAge < 7 ? "child" : userAge < 14 ? "junior" : "adult";

      const data = {
        ...this.membership,
        userID: this.userData.id,
        ageType: userType,
      };

      this.$updateAkAndRoute(data.id, -1, "membership",data);
    },
    calculateAge(dateString) {
      var today = new Date();
      var birthDate = new Date(dateString);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
  }
};
</script>

<style lang="scss" scoped>
@import "./MembershipFeatures.scss";
</style>
