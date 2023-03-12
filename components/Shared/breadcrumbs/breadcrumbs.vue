<template>
  <ol
    vocab="http://schema.org/"
    typeof="BreadcrumbList"
    class="breadcrumbs"
    :style="cssVars"
  >
    <li
      v-for="(crumb, index) in crumbs"
      :key="index"
      property="itemListElement"
      typeof="ListItem"
      class="crumb flex flex-row"
      :class="{'active':activeIndex===index, 'opacity-70 pointer-events-none': activeIndex < index}"
    >
      <nuxt-link
        :to="localePath(crumb.path) + getUrlParams()"
        property="item" typeof="WebPage"
      >
        {{ decodeURI(crumb.title) }}
      </nuxt-link>
      <meta property="position" :content="index + 2">
    </li>
  </ol>
</template>

<script>
export default {
  name: "Breadcrumbs",
  props: {
    customStyle: {
      type: Object,
      default: () => {
      }
    },
    activeIndex: {
      type: Number,
      default: () => 0
    },
    crumbs: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      pages: [],
      loadingData: true,
      style: {
        color: "#FFF"
      }
    };
  },
  computed: {
    cssVars() {
      return {
        "--text-color": this.style.color,
      };
    },
  },
  mounted() {
    this.style = Object.assign({}, this.style, this.customStyle);
  },
  methods: {
    getUrlParams() {
      const routeParam = this.$route.params.id ? "/" + this.$route.params.id : "";
      const query = this.$route.query && this.$route.query.needWaiver && this.$route.query.needWaiver === "true" ? `?needWaiver=${this.$route.query.needWaiver}` : "";
      const urlParam = routeParam + query;

      return urlParam;
    },
  },
};
</script>

<style scoped lang="scss">
@import "./breadcrumbs";
</style>
