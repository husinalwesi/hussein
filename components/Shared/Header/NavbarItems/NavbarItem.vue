<template>
  <div
    v-if="(item.menu_items || []).length || (item.tabs || []).length"
    class="navbar-item-container"
    @mouseenter="$globalData.isDesktopDevice ? toggleItemMenu($event,'item'+item.id) : ''"
    @mouseleave="$globalData.isDesktopDevice ? toggleItemMenu($event,'item'+item.id,true) : ''"
  >
    <a
      href="javascript:void(0)"
      class="navbar-item navbar-item-common-styles"
      :class="{ inverted: navbarIsInverted }"
      @click="openItemSidebarMenu"
    >
      {{ item.title }}
      <span class="icon-wrapper">
        <arrow-svg
          :direction="$i18n.localeProperties.detectedLang === 'en' ? 'right' : 'left'"
          arrow-color="#000000"
        />
      </span>
    </a>

    <div
      v-if="activeItemMenuId === 'item'+item.id"
      :id="'item'+item.id"
      class="absolute pt-20 lg:pt-2 w-fit inner-menu-wrapper"
    >
      <NavbarItemMenu
        :item="item"
        @closeSideBar="$emit('closeSideBar')"
        @backToMainMenu="$emit('closeActiveItemMenu')"
      />
    </div>
  </div>

  <NuxtLink
    v-else
    :to="item.cta_url ? localePath(item.cta_url) : $route.path"
    class="empty-items-link relative"
    :class="{'inverted':navbarIsInverted,active:localePath(item.cta_url)===$route.path}"
    @click.native="$emit('closeSideBar')"
  >
    {{ item.title }}
    <img
      v-if="item && item.left_title_icon"
      :src="item.left_title_icon.image_url"
      :alt="item.left_title_icon.alt_text"
      :title="item.left_title_icon.title"
      class="left-title-icon"
    >
    <img
      v-if="item && item.right_title_icon"
      :src="item.right_title_icon.image_url"
      :alt="item.right_title_icon.alt_text"
      :title="item.right_title_icon.title"
      class="right-title-icon"
    >
  </NuxtLink>
</template>

<script>
import ArrowSvg from "@/components/SVGElements/arrow-svg.vue";

import NavbarItemMenu from "./NavbarItemMenu.vue";

import gsap from "gsap";

//TODO: Find a better way to handle the sub menu thing!
export default {
  components: {
    ArrowSvg,
    NavbarItemMenu
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    activeItemMenuId: {
      type: String,
      default: null
    },
    navbarIsInverted: {type: Boolean, default: false}
  },
  emits: ['closeSideBar', 'closeActiveItemMenu', 'toggleActiveItemMenuId'],
  methods: {
    openItemSidebarMenu() {
      if (!this.$globalData.isDesktopDevice) this.$emit("toggleActiveItemMenuId");
    },
    toggleItemMenu({target}, menuId, closeMenu = false) {

      if (closeMenu) this.$emit("closeActiveItemMenu");
      else {
        const hoveredItem = target;

        this.$emit("toggleActiveItemMenuId");
        this.$nextTick(() => {
          const itemMenuContainer = document.querySelector(`#${menuId}`);

          if (itemMenuContainer) {
            gsap.set(itemMenuContainer, {
              left:
                hoveredItem.offsetLeft +
                hoveredItem.offsetWidth / 2 -
                itemMenuContainer.offsetWidth / 2,
            });
          }
        });
      }
    }
  }
};
</script>
