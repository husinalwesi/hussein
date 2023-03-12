<template>
  <BaseModal :show-modal="showModal" :classes="['min-550:pb-12 ','pb-8']" @closeModal="$emit('closeModal')">
    <h2 slot="header" class="modal-header">
      {{ (data || {}).title || defaultHeader }}
    </h2>
    <div slot="content">
      <div
        v-if="(data || {}).highlitedNotes" slot="content"
        class="highlited-notes"
        v-html="data.highlitedNotes"
      />
      <template v-else>
        <div
          v-for="(condition, i) in termsAndConditionsDefaultData"
          :key="i"
          class="leading-5 min-550:text-sm min-550:leading-6 text-dark-gray text-xs"
          :class="{'mt-4': i !== 0}"
        >
          <h3 v-if="condition.title" class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold ">
            {{ condition.title }}
          </h3>
          <p class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler">
            {{ condition.desc }}
          </p>
        </div>
      </template>
    </div>
    <div slot="extra-element" class="min-550:mt-10 border-t-1 border-dark-gray border-dashed border-opacity-20 mt-[1.875rem] flex justify-end">
      <BaseButton :text="$t('BOOKINGFLOW_PAGE.CLOSE')" btn-type="button" @onBtnClick="$emit('closeModal')" />
    </div>
  </BaseModal>
</template>

<script>
export default {
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['closeModal'],
  data() {
    return {
      defaultHeader: "",
      termsAndConditionsDefaultData: []
    };
  },
  created() {
    this.setTermsAndConditions();
  },
  methods: {
    setTermsAndConditions() {
      this.defaultHeader = this.$t('BOOKINGFLOW_PAGE.TERMS_AND_CONDITIONS_SIGN');
      this.termsAndConditionsDefaultData = [
        {
          desc: this.$t('BOOKINGFLOW_PAGE.I_HEREBY_AGREE_TO_SIGN_THE_FOLLOWING_RELEASE'),
        },
        {
          title: this.$t('BOOKINGFLOW_PAGE.WAIVER_AND_RELEASE'),
          desc: this.$t('BOOKINGFLOW_PAGE.I_DO_HEREBY_FULLY_WAIVE'),
        },
        {
          title: this.$t('BOOKINGFLOW_PAGE.PHYSICAL_CONDITION'),
          desc: this.$t('BOOKINGFLOW_PAGE.I_HEREBY_CERTIFY_THAT_IM_PHYSICALLY'),
        },
        {
          title: this.$t('BOOKINGFLOW_PAGE.INDEMNITY'),
          desc: this.$t('BOOKINGFLOW_PAGE.I_INDEMNITY_HOLD_HARMLESS'),
        },
        {
          title: this.$t('BOOKINGFLOW_PAGE.EQUIPMENT_AND_FACIALITATION_INSPECTION'),
          desc: this.$t('BOOKINGFLOW_PAGE.I_WILL_IMMEDIATELY_ADVISE_THE_MANAGER_ON_DUTY'),
        },
        {
          title: this.$t('BOOKINGFLOW_PAGE.ASSUMPTION_OF_RISKS'),
          desc: this.$t('BOOKINGFLOW_PAGE.I_RECOGNIZE_AND_UNDERSTAND_THAT_THE_ACTIVITY'),
        },
        {
          title: this.$t('BOOKINGFLOW_PAGE.VALIDITY'),
          desc: this.$t('BOOKINGFLOW_PAGE.THIS_RELEASE_AND_WAIVER_SHALL_BE_VALID'),
        },
        {
          title: this.$t('BOOKINGFLOW_PAGE.GOVERNING_LAW'),
          desc: this.$t('BOOKINGFLOW_PAGE.THIS_RELEASE_AND_WAIVER_SHALL_BE_GEVERONED_BY_THE_LAWS')
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-header {
  min-width: 120px;
  max-width: calc(100% - 40px) !important;
}

.highlited-notes::v-deep {
  h1 {
    @apply text-2xl rtl:leading-[unset];
  }

  strong {
    @apply ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold;
  }

  ul {
    @apply ltr:pl-4 rtl:pr-4 list-disc;
  }

  ol {
    @apply ltr:pl-4 rtl:pr-4 list-decimal;
  }
}
</style>
