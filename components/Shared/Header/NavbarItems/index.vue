<template>
  <ul class="navbar-items-list">
    <li class="navbar-item-wrapper lg:hidden">
      <NuxtLink
        :to="localePath('/')"
        class="empty-items-link"
        @click.native="$emit('closeSideBar')"
      >
        {{ $t('HEADER.HOME') }}
      </NuxtLink>
    </li>
    <li v-for="(item, i) in navItems" :key="i" class="navbar-item-wrapper">
      <NavbarItem
        :key="i"
        :item="item"
        :navbar-is-inverted="navbarIsInverted"
        :active-item-menu-id="activeItemMenuId"
        @closeSideBar="closeSideBar"
        @closeActiveItemMenu="activeItemMenuId = null"
        @toggleActiveItemMenuId="setActiveItemMenuId('item'+item.id)"
      />
    </li>
  </ul>
</template>

<script>
import NavbarItem from "./NavbarItem";

export default {
  components: {NavbarItem},
  props: {
    navbarIsInverted: { type: Boolean, default: false },
    navItems: {
      type: Array,
      required: true
    },
    mobileMenuIsOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['closeSideBar'],
  data() {
    return {
      activeItemMenuId: null
    };
  },
  watch: {
    mobileMenuIsOpen() {
      if (!this.mobileMenuIsOpen) this.activeItemMenuId = null;
    }
  },
  methods: {
    closeSideBar(){
      this.activeItemMenuId = null;
      this.$emit('closeSideBar')
    },
    setActiveItemMenuId(itemMenuId) {
      this.activeItemMenuId = itemMenuId;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./Navbar.scss";
</style>
