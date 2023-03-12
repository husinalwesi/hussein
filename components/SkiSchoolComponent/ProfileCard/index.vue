<template>
  <div class="profile-card-wrapper">
    <div class="profile-card-container">
      <div class="image-wrapper">
        <img
          v-if="profileData.image"
          :src="profileData.image.image_url"
          :alt="profileData.image.alt_text"
          :title="profileData.image.title"
          width="127"
          height="127"
        >
      </div>

      <div class="card-body">
        <h4 class="profile-title">
          {{ profileData.title }}
        </h4>

        <div class="description-wrapper">
          <p class="description">
            {{ profileData.subtitle }}
          </p>
        </div>

        <div class="icons-skills-container">
          <img
            v-for="icon in profileData.icons"
            :key="icon.id"
            :src="icon.image_url"
            :alt="icon.alt_text"
            width="38"
            height="41"
            class="icon-skill"
          >
        </div>
      </div>

      <BaseButton
        :text="$t('COMMON.VIEW_PROFILE')"
        btn-type="button"
        class-name="btn-open-modal"
        @onBtnClick="profileClicked"
      />
    </div>
  </div>
</template>

<script>
import BaseButton from "@/components/Shared/BaseUI/BaseButton";

export default {
  name: "InstructorCard",
  components: {BaseButton},
  props: {
    profileData: {
      required: true,
      type: Object
    }
  },
  emits: ["profile-clicked"],
  methods: {
    profileClicked() {
      this.$emit("profile-clicked", this.profileData);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./ProfileCard.scss";
</style>
