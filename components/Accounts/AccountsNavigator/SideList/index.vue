<template>
  <aside class="side-list-wrapper">
    <ul class="side-list">
      <li
        v-for="(cat, catIndex) in cats"
        :key="catIndex"
        class="side-list-category"
      >
        {{ cat.title }}

        <ul v-if="cat.links && cat.links.length" class="list">
          <li
            v-for="(link, linkIndex) in cat.links"
            :key="linkIndex"
            class="link-container"
          >
            <NuxtLink
              :to="localePath(link.path)"
              class="link"
              :class="{active: linkIsActive(link)}"
            >
              {{ link.title }}
            </NuxtLink>

            <ul
              v-if="link.subLinks && link.subLinks.length && linkIsActive(link)"
              class="sub-list"
            >
              <li
                v-for="(subLink, subLinkIndex) in link.subLinks"
                :key="subLinkIndex"
              >
                <NuxtLink
                  :to="localePath(subLink.path)"
                  class="sub-link"
                  :class="{ active: $route.fullPath===localePath(subLink.path) }"
                >
                  {{ subLink.title }}
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>

        <div v-if="catIndex !== cats.length - 1" class="divider-dashed" />
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  props: {
    cats: {
      type: Array,
      default: () => []
    },
  },
  methods: {
    linkIsActive(link) {
      if (link.subLinks)
        return !!link.subLinks.find((i) => this.$route.fullPath===this.localePath(i.path));

      return this.$route.fullPath===this.localePath(link.path);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./SideList.scss";
</style>
