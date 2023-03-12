<template>
  <div :class="className">
    <div class="card-item-title overflow-hidden whitespace-nowrap w-full" :class="cardClass">
      <div v-if="accordionTitle.length>0" class="">
        <div class="" :class="titleClassName">
          <span> {{ accordionTitle }}</span> <span v-if="isPrimary && showIsPrimary">- Primary account</span>
        </div>
        <div v-if="accordionSubTitle" class="ac-subtitle">
          {{ accordionSubTitle }}
        </div>
      </div>
      <slot v-else />
      <div class="flex" :class="bodyClass">
        <div
          v-if="withBadge" class="info-badge" :class="padgeClass"
          @click="badgeClicked"
        >
          <InfoIcon :stroke="iconColor" />
          <span class="ltr:pl-[0.313rem] rtl:pr-[0.313rem]">
            {{ padgeLabel }}
          </span>
        </div>
        <arrow-svg
          v-if="showAccordionIcon"
          :check-mark-icon="checkMarkIcon"
          :with-wrapper="true"
          :wrapper-class="`w-8 h-8 mobiles:w-6 mobiles:h-6 ${arrowWrapperColor}`"
          :arrow-color="arrowColor" :direction="`${expanded?'up':'down'}`"
          :width="$globalData.isMobileDevice ? '16' : '21.33'"
          :height="$globalData.isMobileDevice ? '16' : '21.33'"
          @onArrowClick="continerExpand"
        />
      </div>
    </div>
    <div v-if="showSection" :class="expanded?`divider-dashed ${dividerClasses}`:''" />
    <slot v-if="expanded" name="accordion-content" />
  </div>
</template>

<script>
import InfoIcon from "@/components/SVGElements/info-icon.vue";
import ArrowSvg from "@/components/SVGElements/arrow-svg.vue";

export default {
  components: {
    InfoIcon,
    ArrowSvg
  },
  props: {
    checkMarkIcon: {
      default: false,
      type: Boolean
    },
    isFinishedExist: {
      default: false,
      type: Boolean
    },
    arrowWrapperColor: {
      default: 'bg-[#1A1A1A]',
      type: String,
      required: true,
    },
    iconColor: {
      default: '#ECECEC',
      type: String
    },
    withBadge: {
      default: false,
      type: Boolean
    },
    padgeLabel: {
      default: 'Approved',
      type: String
    },
    padgeClass: {
      //the valid value is only success-bg and error-bg
      default: 'success-bg',
      type: String
    },
    accordionTitle: {
      default: "",
      type: String,
    },
    accordionSubTitle: {
      default: "",
      type: String,
    },
    showSection: {
      default: true,
      type: Boolean,
      required: false
    },
    arrowColor: {
      default: '#FFFFFF',
      type: String,
    },
    titleClassName: {
      default: '',
      type: String,
    },
    className: {
      default: 'guest-card',
      type: String,
    },
    arrowClassName: {
      default: 'items-center arrow-continer black-arrow',
      type: String,
    },
    showExpand: {
      default: true,
      type: Boolean,
    },
    bodyClass: {
      default: 'justify-end',
      type: String,
    },
    cardClass: {
      default: 'items-center',
      type: String,
    },
    showAccordionIcon: {
      default: true,
      type: Boolean,
    },
    dividerClasses: {
      type: [String, Array],
      default: "mt-3"
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    showIsPrimary: {
      type: Boolean,
      default: false
    },
    smallWrapper: {
      type: String,
      default: ''
    },
    expandSection: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      expanded: false
    }
  },
  watch: {
    showExpand(newVal) {
      this.expanded = newVal;
    },
    expandSection: function () {
      this.expanded = this.expandSection;
    }
  },
  mounted() {
    this.expanded = this.expandSection
  },
  methods: {
    continerExpand() {
      this.expanded = !this.expanded;
      this.$emit("accordion-expand", this.expanded);
    },
    badgeClicked() {
      this.$emit("badge-clicked", true);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./BaseAccordion.scss";
</style>
