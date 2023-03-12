<template>
  <div v-if="tabsLinks.length > 0" class="breadcrumb-container">
    <ol v-if="currentStep != 'payment-failed'" class="breadcrumb-links-list">
      <li
        v-for="(link, index) in tabsLinks"
        :key="link.key"
        class="flex items-center"
      >
        <button
          type="button"
          class="uppercase"
          :event="link.order > getActiveTab.order ? '' : 'click'"
          :class="[
            link.title === getActiveTab.title ? 'text-light-yellow' : '',
            link.order > getActiveTab.order ? 'opacity-70 pointer-events-none' : '',
            {'pointer-events-none' : $route.fullPath.includes(link.path)}
          ]"
          @click="tabLinkOnClick(link.path)"
        >
          {{ getTabTitle(link.title, link.key) }}
        </button>
        <img
          v-if="index + 1 !== tabsLinks.length"
          :src="require('@/assets/images/BookingFlow/right-arrow.webp')"
          width="4"
          height="4"
          class="w-1 h-1 mx-1 rtl:rotate-180"
          alt="right arrow"
        >
      </li>
    </ol>
    <h1 class="active-breadcrumb-title">
      {{ currentStep == "payment-failed" ? $t('BOOKINGFLOW_PAGE.BUY_TICKETS') : $t(`BOOKINGFLOW_PAGE.${getActiveTab.title}`) }}
    </h1>
    <YesNoModal
      :is-modal-active="isModalActive"
      :show-close-icon="false"
      :is-loading="false"
      :data="data"
      @onBtn1Click="onModalBtn1Click"
      @onBtn2Click="onModalBtn2Click"
    />
  </div>
</template>

<script>
import YesNoModal from "@/components/BookingFlow/Modals/YesNoModal";
export default {
  components: {
    YesNoModal,
  },
  props: {
    isThereAChange: {
      type: Boolean,
      default: false,
    },
    tabsLinks: {
      type: Array,
      required: true,
    },
    currentStep: {
      type: String,
      default: "",
    },
    isMembership: {
      type: Boolean,
      default: false,
    },
    isSkiLesson: {
      type: Boolean,
      default: false,
    },
    staticLabels: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isModalActive: false,
      data: {
        btn1Text: "",
        btn2Text: "",
        title: "",
        description: "",
      },
    };
  },
  computed: {
    getActiveTab() {
      let filteredTabs = this.tabsLinks.filter((link) => {
        return link.key == this.currentStep;
      });
      return filteredTabs.length > 0 ? filteredTabs[0] : this.tabsLinks[0];
    },
  },
  methods: {
    getTabTitle(title, key) {
      if (this.isMembership && key == "buy-tickets") return this.$t('BOOKINGFLOW_PAGE.BUY_MEMBERSHIP');
      else if (this.isSkiLesson && key == "add-activity") return this.$t('BOOKINGFLOW_PAGE.LESSON');
      else if (this.isSkiLesson && key == "buy-tickets") return this.$t('BOOKINGFLOW_PAGE.BOOK_LESSONS');
      return this.$t(`BOOKINGFLOW_PAGE.${title}`);
    },
    tabLinkOnClick(link) {
      if (this.$route.fullPath.replace(`/${this.$i18n.locale}`, '') === link) return '';
      if (this.isThereAChange) {
        this.isModalActive = true;

        let confirm = this.staticLabels.confirm_edit_booking_message;
        let isDataExist = !this.$isEmptyObject(confirm || {});

        let is_left_cta = "";
        let is_right_cta = "";
        if (isDataExist) {
          is_left_cta = (confirm && confirm.left_cta) || false;
          is_right_cta = (confirm && confirm.right_cta) || false;
        }

        this.data = {
          btn1Text: isDataExist
            ? is_left_cta
              ? confirm.left_cta.title
              : this.$t('BOOKINGFLOW_PAGE.CONFIRM')
            : this.$t('BOOKINGFLOW_PAGE.CONFIRM'),
          btn2Text: isDataExist
            ? is_right_cta
              ? confirm.right_cta.title
              : this.$t('BOOKINGFLOW_PAGE.IGNORE')
            : this.$t('BOOKINGFLOW_PAGE.IGNORE'),
          title: isDataExist
            ? confirm.title
            : this.$t('BOOKINGFLOW_PAGE.DO_YOU_WANT_TO_SAVE_YOUR_CHANGES'),
          description: isDataExist ? confirm.description : "",
          extraData: {
            type: "tabLinkOnClick",
            link: link,
          },
        };
      } else {
        this.$emit("tabChangeEmitter", { link: link, save: false });
      }
    },
    onModalBtn1Click(data) {
      this.isModalActive = false;
      if (data.type == "tabLinkOnClick") {
        this.$emit("tabChangeEmitter", { link: data.link, save: true });
      }
    },
    onModalBtn2Click(data) {
      this.isModalActive = false;
      if (data.type == "tabLinkOnClick") {
        this.$emit("tabChangeEmitter", { link: data.link, save: false });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./Breadcrumb.scss";
</style>
