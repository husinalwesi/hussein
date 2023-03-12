<template>
  <div class="navbar-item-menu-tabs-container">
    <div class="tabs-list-container">
      <ul class="tabs-list">
        <li
          v-for="tab in item.tabs"
          :key="tab.id"
          class="tab bottom-border-divider"
          :class="{selected: 'tab' + activeTabDetails.id === 'tab' + tab.id}"
          @click="setActiveTab(tab)"
        >
          {{ tab.title }}

          <span class="icon-wrapper">
            <arrow-svg
              arrow-color="#000000"
              :direction="$i18n.localeProperties.detectedLang === 'en' ? 'right' : 'left'"
            />
          </span>
        </li>
      </ul>

      <template v-if="item.tabs_cta">
        <NuxtLink
          :to="item.tabs_cta.url ? localePath(item.tabs_cta.url) : $route.path"
          class="cta-link"
          @click.native="$emit('closeSideBar')"
        >
          {{ item.tabs_cta.title }}
        </NuxtLink>
      </template>
    </div>

    <div class="h-[1px] w-full bg-[#F2F2F2] mobile:hidden" />

    <div v-if="activeTabDetails.id" class="inner-menu-wrapper">
      <a
        href="javascript:void(0)"
        class="go-back-link"
        @click.prevent="activeTabDetails = {}"
      >
        <span class="icon-wrapper">
          <arrow-svg arrow-color="#000000" direction="left" />
        </span>
        <p class="go-back-text">{{ $t('HEADER.GO_BACK') }}</p>
      </a>

      <div class="inner-menu-header-wrapper">
        <h1 class="inner-menu-header">
          {{ activeTabDetails.title }}
        </h1>
      </div>

      <div
        v-if="activeTabDetails.cards_info && activeTabDetails.cards_info.length"
        class="events-cards-container"
      >
        <div
          v-for="ev in activeTabDetails.cards_info"
          :key="ev.id"
          class="event-card-container bottom-border-divider"
          @click="onEventCardClick(ev)"
        >
          <span class="image-wrapper">
            <img
              v-if="ev.icon"
              :src="ev.icon.image_url"
              :alt="ev.icon.alt_text"
              :title="ev.icon.title"
              width="44"
              height="43"
              class="w-fit h-fit max-w-[44px] max-h-[43px]"
            >
          </span>

          <div class="card-details-container">
            <div class="flex flex-col mb-4">
              <p class="title">
                {{ ev.card.title }}
              </p>
              <p class="description">
                {{ ev.description }}
              </p>
            </div>
            <p class="price">
              <span class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold">
                {{
                  `${$t("COMMON.BINARY_PARTS", {
                    key: currency,
                    value: $getPackagePrice(ev.card)
                  })}`
                }}
              </span>
              {{ $t("BOOKINGFLOW_PAGE.PER_PERSON") }}
            </p>
          </div>
        </div>
      </div>

      <div
        v-else
        class="
          flex
          items-center
          justify-center
          lg:px-6 lg:pt-[1.4375rem]
          px-4
          w-full
        "
      >
        <p class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler">
          No data found for this tab!.
        </p>
      </div>

      <template v-if="item.tabs_cta && !$globalData.isDesktopDevice">
        <NuxtLink
          :to="item.tabs_cta.url ? localePath(item.tabs_cta.url) : $route.path"
          class="cta-link"
          @click.native="$emit('closeSideBar')"
        >
          {{ item.tabs_cta.title }}
        </NuxtLink>
      </template>
    </div>
  </div>
</template>

<script>
import ArrowSvg from "@/components/SVGElements/arrow-svg.vue";

export default {
  components: {
    ArrowSvg
  },
  props: {
    item: {type: Object, required: true}
  },
  emits: ["closeSideBar"],
  data() {
    return {
      activeTabDetails: {}
    };
  },
  mounted() {
    this.currency = this.$getSiteConfig('currency');

    if (this.item.tabs && this.$globalData.isDesktopDevice) {
      const defaultSelectedTab = this.item.tabs[0];
      this.activeTabDetails = defaultSelectedTab;
    }
  },
  methods: {
    setActiveTab(tab) {
      this.activeTabDetails = {id: "tab" + tab.id, ...tab};
    },
    onEventCardClick(ev) {
      let card = ev.card;
      let mainItemTitle = this.activeTabDetails.localized_title ? this.activeTabDetails.localized_title.en : this.activeTabDetails.title
      let cardTitle = card.localized_title ? card.localized_title.en : card.title

      this.$repositories.menuEvent(mainItemTitle, cardTitle, null, this.$globalData.isDesktopDevice ? 'header' : 'hamburger');
      this.$updateAkAndRoute(card.id, card.id, 'passes', card);
    }
  }
};
</script>
