<template>
  <div class="navbar-item-sub-menu-container">
    <ul :id="`subItem${item.id}`" class="navbar-item-sub-menu-list">
      <li v-for="sub in item.sub_menu_item" :key="sub.id" class="w-full">
        <NuxtLink
          :to="sub.url ? localePath(sub.url) : $route.path"
          class="cta-link"
          @click.native="onSubLinkClick(mainItem, item, sub)"
        >
          <span class="image-wrapper">
            <img
              v-if="sub.icon"
              :src="sub.icon.image_url"
              :alt="sub.icon.alt_text"
              :title="sub.icon.title"
              width="34.3"
              height="34.3"
              class="w-fit h-fit max-w-[34.3px] max-h-[34.3px]"
            >
          </span>
          <p class="name">
            {{ sub.title }}
          </p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    mainItem: {
      type: Object,
      default: () => ({})
    },
  },
  emits: ['closeSideBar'],
  methods: {
    onSubLinkClick(mainItem, item, sub) {
      let mainItemTitle = item.localized_title ? item.localized_title.en : item.title
      let subItemTitle = item.menu_item ? item.menu_item.localized_title ? item.menu_item.localized_title.en : item.menu_item.title : ''
      let thirdSubItemTitle = sub.localized_title ? sub.localized_title.en : sub.title

      this.$repositories.menuEvent(mainItemTitle, subItemTitle, thirdSubItemTitle, this.$globalData.isDesktopDevice ? 'header' : 'hamburger');
      this.$emit('closeSideBar');
    }
  }
};
</script>
