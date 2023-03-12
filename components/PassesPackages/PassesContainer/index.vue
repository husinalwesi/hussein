<template>
  <div
    v-if="(passesData.data || []).length || (passesData.moments || {}).isActive"
    :class="backgroundColor"
  >
    <div
      class="max-w-1xl mx-auto px-0 md:px-[6%] pt-4 -mt-4 package-container"
      :class="[{'overflow-hidden': $globalData.isMobileDevice}, customClass]"
    >
      <div
        v-if="!$globalData.isMobileDevice"
        class="grid grid-cols-passes-card gap-12 gap-y-10 gap-x-5"
        :class="{ 'justify-center': !isElemsJustifiedStart }"
      >
        <PassesCard
          v-for="passData in passesData.data"
          :key="passData.id"
          :badge-label="!!passData.label_text ? passData.label_text : ''"
          :show-badge="!!passData.label_text"
          :passes-data="passData"
          :card-type="cardType"
          :disabled="passData.is_sold_out"
          :tab="tab"
          :show-price="!hidePassPrice"
          class="inline-block w-passes-img-desktop"
          @openNotificationModal="setNotificationModalData(passData)"
        />
        <MomentsCard
          v-if="(passesData.moments || {}).isActive"
          :show-email="showEmail"
          :data="passesData.moments.data"
          class="inline-block w-passes-img-desktop"
        />
      </div>

      <template v-if="$globalData.isMobileDevice">
        <PassesCarousel
          :passes-data="passesData"
          :show-email="showEmail"
          :card-type="cardType"
          :hide-pass-price="hidePassPrice"
          :is-without-side-slides="isWithoutSideSlides"
          @openNotificationModal="setNotificationModalData($event)"
        />
      </template>
    </div>

    <NotificationModal
      :is-modal-active="notificationModalIsActive"
      :data="notificationModalData"
      @closeModal="notificationModalIsActive = false"
    />
  </div>
</template>

<script>
import PassesCard from "@/components/PassesPackages/PassesCard";
import MomentsCard from "@/components/PassesPackages/MomentsCard";
import PassesCarousel from "@/components/PassesPackages/PassesCarousel";
import NotificationModal from "./NotificationModal";

import gsap from "gsap";

export default {
  name: "PassesContainer",
  components: {
    PassesCard,
    MomentsCard,
    PassesCarousel,
    NotificationModal,
  },
  // TODO: modify the props names.
  /* eslint-disable vue/require-prop-types */
  props: {
    passesData: {
      type: Object,
      default: () => ({
        data: [],
        moments: {
          isActive: false,
          data: {},
        },
      }),
    },
    backgroundColor: {
      type: String,
      default: "",
    },
    isWithoutSideSlides: {
      type: Boolean,
      default: false,
    },
    customClass: {
      type: String,
      default: "",
    },
    showEmail: {
      type: Boolean,
      default: false,
    },
    cardType: {
      type: String,
      default: "",
    },
    isElemsJustifiedStart: {
      type: Boolean,
      default: false,
    },
    hidePassPrice: {
      type: Boolean,
      default: false,
    },
    tab: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      notificationModalIsActive: false,
      notificationModalData: {},
    };
  },
  watch: {
    passesData() {
      if ((this.passesData.data || []).length) this.cardsAnimeHandler();
    },
  },
  mounted() {
    if ((this.passesData.data || []).length) this.cardsAnimeHandler();
  },
  methods: {
    cardsAnimeHandler() {
      const isDataFilled = (this.passesData.data || []).length;
      this.$nextTick(() => this.cardsAnimator(isDataFilled));
    },
    cardsAnimator(direction) {
      if (!this.$el?.childNodes?.length) return false;

      const cards = this.$el.querySelectorAll(".passes-card");

      if ((cards || []).length)
        cards.forEach((card, index) => {
          gsap
            .fromTo(
              card,
              {
                y: direction ? "1rem" : 0,
                autoAlpha: direction ? 0 : 1,
              },
              {
                y: direction ? 0 : "-1rem",
                autoAlpha: direction ? 1 : 0,
                duration: 0.466,
                overwrite: true,
              }
            )
            .delay((index + 1) * 0.25);
        });
    },
    setNotificationModalData(passData) {
      this.notificationModalData = passData.data
        ? passData.data.coming_soon_popup
        : passData.coming_soon_popup;

      this.notificationModalIsActive = true;
    }
  }
};
</script>

<style scoped lang="scss">
@import "./PassesContainer.scss";
</style>
