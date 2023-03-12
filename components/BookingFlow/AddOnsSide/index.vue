<template>
  <div class="AddOnsSideContainer">
    <div class="add-ons-head">
      <div class="add-ons-title-container">
        <p class="add-ons-title">
          {{ $t('BOOKINGFLOW_PAGE.TICKET_ADDONS') }}
        </p>
      </div>
      <div class="add-ons-edit-container">
        <button
          v-if="currentStep != 'add-ons'"
          class="add-ons-edit"
          type="button"
          @click="editAddOns()"
        >
          {{ $t('BOOKINGFLOW_PAGE.EDIT') }}
        </button>
      </div>
    </div>
    <ul class="add-ons-list">
      <li v-for="(addOn, index) in data" :key="`add-ons-${index}`">
        <div class="dashed-line-container">
          <div class="dashed-line" />
        </div>
        <div class="add-ons-item-content">
          <p class="add-ons-title">
            {{ addOn.counter }} {{ getLocaleTitle(addOn) }}
          </p>
          <p class="add-ons-price flex gap-1 ltr:justify-start rtl:justify-end">
            <span class="ltr:order-1 rtl:order-2">{{ currency }}</span>
            <span class="ltr:order-2 rtl:order-1">{{ addOn.counter * addOn.amount }}</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "AddOnsSide",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    currentStep: {
      type: String,
      default: "",
    },
  },
  emits: ['editAddOnsEmiter'],
  data() {
    return {
      currency: ""
    }
  },
  created() {
    this.currency = this.$getSiteConfig('currency');
  },
  methods: {
    editAddOns() {
      this.$emit("editAddOnsEmiter");
    },
    getLocaleTitle(addon) {
      if (!addon.localized_title) {
        return addon.title
      }
      return this.$i18n.localeProperties.detectedLang === 'en' ? addon.localized_title['en'] : addon.localized_title['ar']
    }
  },
};
</script>
<style scoped lang="scss">
@import "./AddOnsSide.scss";
</style>
