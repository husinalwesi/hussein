<template>
  <div class="tabs-wrapper flex-col">
    <div class="relative h-fit">
      <ul class="tabs-list" :class="customClass">
        <li
          v-for="tab in tabs"
          :key="tab.id"
          class="tab"
          :class="{
            active: selectedTab.id === tab.id,
          }"
          @click="onTabChange(tab)"
        >
          {{ tab[titleKey] }}
        </li>
      </ul>

      <div class="bottom-line" />
    </div>
    <div v-if="showContent" class="tab-content">
      <slot v-if="isCustomContent" />
      <div class="selected-tab-content" v-html="selectedTab[contentKey]" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Tabs",
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
    activeTabId: {
      default: () => "",
      type: String,
    },
    isCustomContent: {
      default: () => false,
      type: Boolean,
    },
    titleKey: {
      default: () => "title",
      type: String,
    },
    contentKey: {
      default: () => "content",
      type: String,
    },
    customClass: {
      default: () => "text-dark-gray",
      type: String,
    },
    showContent: {
      default: () => false,
      type: Boolean,
    },
  },
  emits: ["tabClicked"],
  data() {
    return {
      lastActiveTab: {offsetLeft: 0},
      activeId: -1,
      selectedTab: {},
    };
  },
  watch: {
    tabs: function () {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.activeId = this.activeTabId;
      if (this.tabs[this.activeId]) {
        this.selectedTab = this.tabs[this.activeId];
      } else if (this.tabs.length > 0) {
        this.activeId = this.activeTabId;
        this.selectedTab = this.tabs[0];
      }
    },
    onTabChange(tab) {
      this.$nextTick(() => {
        this.activeId = tab.id;
        this.selectedTab = tab;
        this.$emit("tabClicked", tab);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.tabs-wrapper {
  @apply w-full flex relative;

  .tabs-list {
    @apply bg-transparent overflow-x-auto flex ltr:font-inter-bold rtl:font-noto-sans-arabic-bold text-[1rem] leading-6 h-full px-4 lg:px-0 list-none m-0 gap-x-8 md:gap-x-12 relative;

    &.black-tabs-list {
      @apply text-[#1A1A1A] uppercase;
    }

    .tab {
      @apply opacity-50 relative z-[1] pb-4 whitespace-nowrap cursor-pointer;

      &.active {
        @apply opacity-100 pb-3;
        border-bottom: 4px solid #fad903;
      }

      @screen lg {
        &:hover {
          @apply pb-3 border-b-4 border-light-yellow border-solid opacity-100;
        }
      }
    }

    &::-webkit-scrollbar {
      @apply hidden;
    }

    scrollbar-width: none;
  }

  .bottom-line {
    @apply absolute bg-dark-gray bg-opacity-10 bottom-0 h-[1px] w-full;
  }

  .tab-content {
    @apply ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-sm leading-6 text-granite-gray pt-8;

    .selected-tab-content {
      @apply flex w-full mobiles:p-6;

      &::v-deep {
        ul {
          @apply ltr:pl-6 rtl:pr-6 list-disc;
        }

        ol {
          @apply ltr:pl-6 rtl:pr-6 list-decimal;
        }
      }
    }
  }
}
</style>
