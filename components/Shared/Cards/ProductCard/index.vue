<template>
  <div class="product-card-container">
    <div
      v-if="cardData.image||(cardData.web_mobile_view_image&&cardData.web_mobile_view_image.image_url)"
      class="card-header-with-image"
    >
      <img
        :src="$globalData.isMobileDevice&&cardData.web_mobile_view_image&&cardData.web_mobile_view_image.image_url?cardData.web_mobile_view_image.image_url:cardData.image.image_url"
        :alt="$globalData.isMobileDevice&&cardData.web_mobile_view_image&&cardData.web_mobile_view_image.alt_text?cardData.web_mobile_view_image.alt_text:cardData.image.alt_text"
        :title="$globalData.isMobileDevice&&cardData.web_mobile_view_image&&cardData.web_mobile_view_image.title?cardData.web_mobile_view_image.title:cardData.image.title"
        width="648"
        height="176"
      >
      <div v-if="cardData.title" class="title-container">
        <h3 class="card-title">
          {{ cardData.title }}
        </h3>
      </div>
    </div>
    <div v-else-if="cardData.title" class="card-header-without-image">
      <h3 class="card-title">
        {{ cardData.title }}
      </h3>
    </div>

    <div class="card-body-container">
      <div class="flex flex-wrap">
        <div class="flex-1">
          <div class="card-paragraph" v-html="cardData.notes_highlighted" />
        </div>

        <div
          v-if="cardData.qr_image && !$globalData.isMobileDevice"
          class="qr-code-img-wrapper"
        >
          <img
            :src="cardData.qr_image.image_url"
            :alt="cardData.qr_image.alt_text"
            :title="cardData.qr_image.title"
            width="120"
            height="120"
          >
        </div>
      </div>

      <div v-if="cardData.cta" class="mt-6">
        <BaseButton
          :cta="cardData.cta"
          :btn-type="$isExternalLink(cardData.cta.url) ? 'externalLink' : 'link'"
          :text=" cardData.cta.title"
          :path="cardData.cta.url"
          class-name="cta-link"
        />
      </div>

      <div
        v-if="
          cardData.qr_image &&
            $globalData.isMobileDevice &&
            (cardData.web_mobile_app_store_cta ||
              cardData.web_mobile_google_play_cta)
        "
        class="mt-6"
      >
        <p class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold text-sm leading-4">
          {{ cardData.web_mobile_cta_section_title || $t("COMMON.DOWNLOAD_APP") }}
        </p>

        <div class="flex flex-wrap gap-2 mt-4">
          <a
            v-if="cardData.web_mobile_app_store_cta"
            :href="cardData.web_mobile_app_store_cta.url"
            target="_blank"
            @click="addEvent('app store')"
          >
            <img
              v-if="cardData.web_mobile_app_store_cta.icon"
              :src="cardData.web_mobile_app_store_cta.icon.image_url"
              :title="cardData.web_mobile_app_store_cta.icon.title"
              :alt="cardData.web_mobile_app_store_cta.icon.alt_text"
              width="120"
              height="40"
              class="w-[120px] h-10"
            >
          </a>
          <a
            v-if="cardData.web_mobile_google_play_cta"
            :href="cardData.web_mobile_google_play_cta.url"
            target="_blank"
            @click="addEvent('play store')"
          >
            <img
              v-if="cardData.web_mobile_google_play_cta.icon"
              :src="cardData.web_mobile_google_play_cta.icon.image_url"
              :title="cardData.web_mobile_google_play_cta.icon.title"
              :alt="cardData.web_mobile_google_play_cta.icon.alt_text"
              width="135"
              height="40"
              class="w-[135px] h-10"
            >
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/Shared/BaseUI/BaseButton";

export default {
  components:{BaseButton},
  props: {
    cardData: {
      type: Object,
      required: true
    }
  },
  methods: {
    addEvent(type) {
      this.$repositories.installAppEvent(type)
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./ProductCard.scss";
</style>
