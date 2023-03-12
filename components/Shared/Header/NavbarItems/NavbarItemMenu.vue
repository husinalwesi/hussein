<template>
  <div class="navbar-item-menu-container">
    <a
      href="javascript:void(0)"
      class="go-back-link"
      @click="$emit('backToMainMenu')"
    >
      <span class="icon-wrapper">
        <arrow-svg
          arrow-color="#000000"
          :direction="$i18n.localeProperties.detectedLang === 'en' ? 'left' : 'right'"
        />
      </span>
      <p class="go-back-text">{{ $t('HEADER.GO_BACK') }}</p>
    </a>

    <div class="inner-menu-header-wrapper">
      <h1 class="inner-menu-header">
        {{ item.title }}
      </h1>
    </div>

    <!--We've 2 types for the navbar item menu: one with tabs and the other with links/sub-links.-->
    <template v-if="item.tabs && item.tabs.length">
      <NavbarItemMenuTabs :item="item" @closeSideBar="$emit('closeSideBar')" />
    </template>

    <ul v-else class="navbar-item-menu-list">
      <li
        v-for="(subItem, i) in item.menu_items"
        :key="subItem.id"
        class="navbar-menu-item"
        :style="{
          order:
            !$globalData.isDesktopDevice &&
            subItem.sub_menu_item &&
            subItem.sub_menu_item.length
              ? item.menu_items.length
              : i
        }"
      >
        <div v-if="subItem.sub_menu_item && subItem.sub_menu_item.length">
          <a
            href="javascript:void(0)"
            class="menu-item-link"
            @click="toggleItemSubMenu('item' + item.id, 'subItem' + subItem.id)"
          >
            <p v-if="subItem.menu_item" class="name">
              {{ subItem.menu_item.title }}
            </p>
            <span class="icon-wrapper">
              <arrow-svg arrow-color="#000000" :direction="$i18n.localeProperties.detectedLang==='en'?'right':'left'" />
            </span>
          </a>

          <div v-if="subItem.menu_item" class="inner-menu-header-wrapper">
            <h2 class="inner-menu-header sub">
              {{ subItem.menu_item.title }}
            </h2>
          </div>

          <NavbarItemSubMenu
            v-if="activeItemSubMenuId === 'subItem' + subItem.id || !$globalData.isDesktopDevice"
            :item="subItem"
            :main-item="item"
            @closeSideBar="$emit('closeSideBar')"
          />
        </div>
        <div
          v-else-if="subItem.menu_item"
          @mouseenter="toggleItemSubMenu('item' + item.id, activeItemSubMenuId, true)"
        >
          <a
            class="cta-link"
            :class="{'lg:opacity-50': activeItemSubMenuId}"
            @click="onLinkClick(item, subItem)"
          >
            <span class="image-wrapper">
              <img
                v-if="subItem.menu_item.icon"
                :src="subItem.menu_item.icon.image_url"
                :alt="subItem.menu_item.icon.alt_text"
                :title="subItem.menu_item.icon.title"
                width="29"
                height="29"
                class="h-[29px] w-[29px] max-w-[29px] max-h-[29px]"
              >
            </span>
            <p class="name">
              {{ subItem.menu_item.title }}
            </p>
          </a>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import ArrowSvg from "@/components/SVGElements/arrow-svg.vue";

import NavbarItemSubMenu from "./NavbarItemSubMenu";
import NavbarItemMenuTabs from "./NavbarItemMenuTabs.vue";

import gsap from "gsap";

export default {
  components: {
    ArrowSvg,
    NavbarItemSubMenu,
    NavbarItemMenuTabs
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ["backToMainMenu", "closeSideBar"],
  data() {
    return {
      activeItemSubMenuId: null
    };
  },
  methods: {
    toggleItemSubMenu(mainMenuId, subMenuId, closeSubMenu = false) {
      const mainMenuContainer = document.querySelector(`#${mainMenuId}`);
      const rightSpaceVal = this.$isUserAuthenticated() ? 75 : 5; // TODO: remove this customization.

      if (this.activeItemSubMenuId !== subMenuId && !closeSubMenu) {
        this.activeItemSubMenuId = subMenuId;

        this.$nextTick(() => {
          const itemSubMenuContainer = document.querySelector(`#${subMenuId}`);
          gsap.set(mainMenuContainer, {
            width: `${
              mainMenuContainer.offsetWidth + itemSubMenuContainer.offsetWidth
            }px`,
            left: `${
              mainMenuContainer.offsetLeft -
              itemSubMenuContainer.offsetWidth / 2 -
              rightSpaceVal
            }`,
          });
        });
      } else if (closeSubMenu) {
        const itemSubMenuContainer = document.querySelector(`#${subMenuId}`);

        if (itemSubMenuContainer) {
          gsap.to(mainMenuContainer, {
            width: `${
              mainMenuContainer.offsetWidth - itemSubMenuContainer.offsetWidth
            }px`,
            left: `${
              mainMenuContainer.offsetLeft +
              itemSubMenuContainer.offsetWidth / 2 +
              rightSpaceVal
            }`,
          });
          this.activeItemSubMenuId = null;
        }
      }


    },
    onLinkClick(item, subItem) {
      let mainItemTitle = item.localized_title ? item.localized_title.en : item.title
      let subItemTitle = subItem.menu_item ? subItem.menu_item.localized_title ? subItem.menu_item.localized_title.en : subItem.menu_item.title : ''
      this.$repositories.menuEvent(mainItemTitle, subItemTitle, null, this.$globalData.isDesktopDevice ? 'header' : 'hamburger');
      this.$emit("closeSideBar");

      this.$router.push(subItem.menu_item.url ? this.localePath(subItem.menu_item.url) : this.$route.path)

    }
  },
};
</script>
