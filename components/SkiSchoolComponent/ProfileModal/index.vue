<template>
  <BaseModal
    content-wrapper-classes="profile-modal-content-container"
    :show-close-icon="false"
    :show-modal="showModal"
    @closeModal="closeModal"
  >
    <template #content>
      <div id="dashedBorder" class="dashed-border-wrapper">
        <div class="dashed-border" />
      </div>

      <div class="profile-modal-header">
        <div class="profile-image-wrapper">
          <img
            v-if="profileData.image"
            :title="profileData.image.title"
            :src="profileData.image.image_url"
            :alt="profileData.image.alt_text"
            width="127"
            height="127"
          >
        </div>
        <div class="title-wrapper">
          <h5 class="title">
            {{ profileData.title }}
          </h5>
        </div>
      </div>

      <div class="description-wrapper">
        <p class="description">
          {{ `“${profileData.subtitle}”` }}
        </p>
      </div>

      <div class="profile-notes-container">
        <div
          v-for="(note,i) in profileData.profile_notes"
          :key="note.id"
          :class="{ 'mt-2': i !== 0 }"
        >
          <div class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold rtl:font-semibold">
            {{ note.title }}
          </div>
          <div class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler mt-2">
            {{ note.subtitle }}
          </div>
        </div>
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

      <BaseButton
        :text="$t('BOOKINGFLOW_PAGE.CLOSE')"
        btn-type="button"
        class-name="btn-close"
        @onBtnClick="closeModal"
      />
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from "@/components/Shared/BaseUI/BaseModal";
import BaseButton from "@/components/Shared/BaseUI/BaseButton";

export default {
  components: {
    BaseModal,
    BaseButton
  },
  props: {
    profileData: {
      required: true,
      type: Object
    },
    showModal: {
      required: true,
      type: Boolean
    }
  },
  emits: ["close-modal"],
  data() {
    return {
      height: ''
    }
  },
  methods: {
    closeModal() {
      this.$emit("close-modal", false);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./ProfileModal.scss";
</style>
