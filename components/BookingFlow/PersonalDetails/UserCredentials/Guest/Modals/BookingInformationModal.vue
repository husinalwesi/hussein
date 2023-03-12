<template>
  <BaseModal :show-modal="showModal" @closeModal="$emit('closeModal')">
    <h2 slot="header" class="modal-header">
      {{ (data || {}).title || defaultHeader }}
    </h2>

    <div
      v-if="(data || {}).highlitedNotes" slot="content"
      class="highlited-notes"
      v-html="data.highlitedNotes"
    />
    <ul v-else slot="content" class="ltr:pl-4 rtl:pr-4 list-disc">
      <template v-if="(data.notes || []).length">
        <li v-for="note in data.notes" :key="note.id">
          {{ note.title }}
        </li>
      </template>
      <template v-else>
        <li v-for="(info, i) in bookingInformationDefaultData" :key="i">
          {{ info }}
        </li>
      </template>
    </ul>
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
      bookingInformationDefaultData: ""
    };
  },
  created() {
    this.setBookingInformationDefaultData();
  },
  methods: {
    setBookingInformationDefaultData() {
      const currentEnv = this.$getSiteCurrentEnvironment(false, true);

      this.defaultHeader = this.$t('BOOKINGFLOW_PAGE.IMPORTANT_BOOKING_INFORMATION');
      this.bookingInformationDefaultData = [
        this.$t('BOOKINGFLOW_PAGE.ALL_PRICES_INCLUDES_5_VAT'),
        this.$t('BOOKINGFLOW_PAGE.FOR_SAFETY_REASON', {location: this.$t(`LOCATIONS.${currentEnv}`)}),
        this.$t('BOOKINGFLOW_PAGE.GUEST_UNDER_THE_AGE_OF_14'),
        this.$t('BOOKINGFLOW_PAGE.GUEST_MUST_ARRIVE_40_MON_BEFORE'),
        this.$t('BOOKINGFLOW_PAGE.GUEST_MUST_BE_INTERMEDIATE_LEVEL')
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
