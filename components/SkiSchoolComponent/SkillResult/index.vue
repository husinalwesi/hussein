<template>
  <div class="skill-result-container">
    <div class="h-fit md:p-10 md:pb-0 pt-6 px-4 relative">
      <div
        class="bg-solid-blue top-0"
        :class="{'-top-8':selectedSkill.level_result_image && selectedSkill.level_result_image.image_url}"
      />
      <div class="text-center md:mt-2 relative z-[1]">
        <p class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-sm leading-6 text-white mb-4">
          {{ (generalData || {}).title || "" }}
        </p>

        <div class="text-center">
          <h1 class="header-text">
            {{ selectedSkill.level_result_text }}
          </h1>
          <h2 class="header-text subtitle">
            {{ (generalData || {}).subtitle_highlighted_word || "" }}
          </h2>
        </div>
      </div>

      <div
        v-if="
          selectedSkill.level_result_image &&
            selectedSkill.level_result_image.image_url
        "
        class="level-image-wrapper"
      >
        <img
          :src="selectedSkill.level_result_image.image_url"
          :alt="selectedSkill.level_result_image.alt_text"
          :title="selectedSkill.level_result_image.title"
          width="309"
          height="336"
          class="level-image"
        >
      </div>
    </div>

    <div class="description-wrapper">
      <p class="description">
        {{ selectedSkill.level_result_description }}
      </p>
    </div>

    <div class="action-btns-container">
      <template v-if="generalData.cta && generalData.cta.title">
        <BaseButton
          btn-type="button"
          :text="generalData.cta.title"
          class-name="btn btn-search"
          @onBtnClick="onSearchBtnClick"
        />
      </template>

      <BaseButton
        btn-type="button"
        text="Close"
        class-name="btn btn-cancel"
        @onBtnClick="$emit('closeModal')"
      />
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/Shared/BaseUI/BaseButton";

export default {
  components:{
    BaseButton
  },
  props: {
    generalData: {
      type: Object,
      default: () => ({}),
    },
    selectedSkill: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["closeModal"],
  methods: {
    onSearchBtnClick() {
      this.$emit("searchLessons", true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./SkillResult.scss";
</style>
