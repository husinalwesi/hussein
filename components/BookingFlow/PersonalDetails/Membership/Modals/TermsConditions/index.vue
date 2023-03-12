<template>
  <div class="memberships-terms-conditions-modal-wrapper">
    <BaseModal :show-modal="showModal" :show-close-icon="false">
      <template #header>
        <h2 class="modal-header">
          {{ getMainTitle }}
        </h2>
      </template>
      <template slot="content">
        <div v-if="getLevel" class="level-badge">
          {{ getLevel }}
        </div>
        <div class="description-wrapper">
          <p class="description">
            {{ getSubTitle }}
          </p>
        </div>
        <ul class="condition-list">
          <li
            v-for="(condition, conditionIndex) in getList"
            :key="conditionIndex"
            class="condition"
          >
            <span class="checkmark-wrapper">
              <Checkmark color="#1A1A1A" />
            </span>
            {{ condition }}
          </li>
        </ul>
      </template>
      <template #extra-element>
        <div class="flex justify-end min-550:mt-10 mt-[1.875rem]">
          <BaseButton
            :text="$t('BOOKINGFLOW_PAGE.CLOSE')"
            btn-type="button"
            @onBtnClick="$emit('closeModal')"
          />
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script>
export default {
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    packageDetails: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Object,
      default: () => ({
        level: "Level 2 + only",
        description: "Membership can be used by any of the below:",
        conditions: ["3 years and above for Ski", "8 years and above for SB"],
      }),
    },
  },
  computed: {
    getList() {
      let info =
        this.packageDetails.card.membership_the_terms_and_constructions_popup ||
        {};
      if (this.$isEmptyObject(info)) return [];
      if (this.$isEmptyObject(info.notes_section || {})) return [];
      return info.notes_section.items
        .map((res) => {
          const result = {
            title: res.title,
          };
          return result;
        })
        .flatMap(
          //used to convert array of object to an array with a one array level.
          (elem) => elem.title
        );
    },
    getSubTitle() {
      let info =
        this.packageDetails.card.membership_the_terms_and_constructions_popup ||
        {};
      if (this.$isEmptyObject(info)) return "";
      if (this.$isEmptyObject(info.notes_section || {})) return "";
      return info.notes_section.title;
    },
    getLevel() {
      let info =
        this.packageDetails.card.membership_the_terms_and_constructions_popup ||
        {};
      if (this.$isEmptyObject(info)) return "";
      return info.level_note;
    },
    getMainTitle() {
      let info =
        this.packageDetails.card.membership_the_terms_and_constructions_popup ||
        {};
      if (this.$isEmptyObject(info)) return this.$t('BOOKINGFLOW_PAGE.TERMS_AND_CONDITIONS');
      return info.title || this.$t('BOOKINGFLOW_PAGE.TERMS_AND_CONDITIONS');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./TermsConditions.scss";
</style>
