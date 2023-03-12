<template>
  <CardContainer
    :container-classes="containerCustomClasses"
    :wrapper-classes="customClass"
  >
    <template #card-content>
      <div class="action-card-container">
        <div class="card-header-container">
          <h2 class="title">
            {{ cardData.title }}
          </h2>
          <img
            v-if="cardData.img.image_url"
            :src="cardData.img.image_url"
            :alt="cardData.img.alt"
            :title="cardData.img.title"
            width="89"
            height="72"
            class="h-fit max-h-[4.4375rem] max-w-[5.5625rem] md:mt-[-3.375rem] mt-[-2.3125rem] w-fit"
            :class="iconCustomClass"
          >
        </div>
        <p class="description">
          {{ cardData.description }}
        </p>
        <template v-if="!isLoading">
          <template v-if="status && !status.cta">
            <StatusIndicator
              :status-type="status.type"
              :tooltip-text="status.tooltipText || ''"
              :custom-label-text="status.customLabelText"
              status-wrapper-container="mt-6"
            />
          </template>
          <div v-if="status && status.cta" class="mt-6 md:mt-4">
            <BaseButton
              btn-type="link"
              :cta="status.cta"
              :text="status.cta.title"
              :path="status.cta.path"
            />
          </div>
          <div v-if="!status" class="mt-6 md:mt-4">
            <BaseButton
              btn-type="link"
              :cta="cardData.cta"
              :text="cardData.cta.title"
              :path="cardData.cta.path"
            />
          </div>
        </template>
      </div>
    </template>
  </CardContainer>
</template>

<script>
import StatusIndicator from "@/components/Shared/StatusIndicator";

export default {
  components: {StatusIndicator},
  props: {
    cardData: {
      type: Object,
      default: () => ({})
    },
    iconCustomClass: {
      type: String,
      default: ""
    },
    customClass: {
      type: String,
      default: () => "px-[0.938rem] py-6 min-550:px-[1.938rem] min-550:py-8"
    },
    status: {
      type: Object,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    containerCustomClasses: {
      type: String,
      default: () => ""
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./ActionCard.scss";
</style>
