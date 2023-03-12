<template>
  <div class="mobile-breadcrumb-container lg:hidden py-5 md:px-[10px]">
    <ol class="breadcrumb-list">
      <li v-for="(crumb, index) in crumbs" :key="index" class="breadcrumb-item">
        <NuxtLink
          :to="isRoot(crumb.path) ? '#' : localePath(crumb.path)"
          class="crumb-link"
          :class="{
            active:
              $route.fullPath.indexOf(crumb.fullPath) !== -1 &&
              index === crumbs.length - 1,
          }"
        >
          {{ crumb.title }}
        </NuxtLink>
        <arrow-svg
          v-if="index + 1 !== crumbs.length"
          :direction="$i18n.localeProperties.detectedLang === 'en' ? 'right' : 'left'"
          width="8"
          height="8"
          arrow-color="#1A1A1A"
          class="mx-1"
        />
      </li>
    </ol>

    <div v-if="nestedRoutes.length" class="nested-routes-container">
      <div
        v-click-outside="closeNestedRoutesList"
        class="selected-route-box"
        @click.prevent="isNestedRoutesListOpen = !isNestedRoutesListOpen"
      >
        <div class="selected-route-name">
          {{ activeRouteName }}
        </div>
        <arrow-svg
          :with-wrapper="true"
          :wrapper-class="`w-6 h-6 ${
            isNestedRoutesListOpen ? 'bg-[#0A14321A]' : 'bg-white'
          }`"
          :arrow-color="`${isNestedRoutesListOpen ? '#0A1432' : '#1A1A1A'}`"
          :direction="isNestedRoutesListOpen ? 'up' : 'down'"
          width="16"
          height="16"
        />
      </div>
      <ul v-if="isNestedRoutesListOpen" class="nested-routes-list">
        <li
          v-for="(route, i) in nestedRoutes"
          :key="i"
          class="route-item"
          :class="{active: $route.fullPath.includes(route.path)}"
          @click.prevent="$router.push(route.path)"
        >
          {{ route.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const nestedRoutesList = ["/accounts/profile", "/accounts/ski-school"];

export default {
  name: "Breadcrumb",
  props: {
    isMembershipEnabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeRouteName: "",
      isNestedRoutesListOpen: false,
      routes: {
        PROFILE: [
          {
            path: this.localePath('/accounts/profile/personal-details'),
            name: this.$t(`ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.PROFILE.PERSONAL_DETAILS`)
          },
          {
            path: this.localePath('/accounts/profile/set-your-gear'),
            name: this.$t(`ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.PROFILE.GEAR`)
          },
          {
            path: this.localePath('/accounts/profile/waiver-form'),
            name: this.$t(`ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.PROFILE.WAIVER`),
            locations: ['ski-dubai']
          },
          {
            path: this.localePath('/accounts/profile/memberships'),
            name: this.$t(`ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.PROFILE.MEMBERSHIPS`),
            locations: ['ski-dubai'],
            isMembershipRoute: true
          }
        ],
        SKI_SCHOOL: [
          {
            path: this.localePath('/accounts/ski-school/ski-passport'),
            name: this.$t(`ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.SKI_SCHOOL.SKI_PASSPORT`),
            locations: ['ski-dubai']
          },
          {
            path: this.localePath('/accounts/ski-school/snowboard-passport'),
            name: this.$t(`ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.SKI_SCHOOL.SNOWBOARD_PASSPORT`),
            locations: ['ski-dubai']
          }
        ]
      },
      currentEnvConfigName: "",
      currentEnvCode: ""
    };
  },
  computed: {
    crumbs() {
      let crumbs = [];
      const fullPath = this.$route.path;
      const params = fullPath.startsWith("/")
        ? fullPath.substring(1).split("/")
        : fullPath.split("/");

      let path = "";

      params.forEach((param) => {
        path = `${path}/${param}`;
        const match = this.$router.match(path);
        if (match.name !== null) {
          const pathName = param.replace(/[^a-zA-Z 0-9 /]+/g, "_").toUpperCase();
          if (pathName !== this.currentEnvConfigName) {
            crumbs.push({
              title: this.$t(`ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.BREADCRUMBS.${pathName}`),
              ...match
            });
          }
        }
      });

      return crumbs;
    },
    nestedRoutes() {
      const nestedRoutesParentName = nestedRoutesList.find((r) =>
        this.$route.fullPath.includes(r)
      );

      if (nestedRoutesParentName) {
        const parentRouter = nestedRoutesParentName.includes('profile') ? 'PROFILE' : 'SKI_SCHOOL';
        const routes = this.routes[parentRouter].filter(router => {
          if (router.path === this.$route.path) this.activeRouteName = router.name;

          return (router.locations && router.locations.includes(this.currentEnvCode)) || !router.locations || router.isMembershipRoute && this.isMembershipEnabled;
        });

        return routes;
      }

      return [];
    },
  },
  created() {
    const siteCode = this.$getSiteConfig('code');
    this.currentEnvConfigName = siteCode.replace(/[-]+/g, "_").toUpperCase();
    this.currentEnvCode = siteCode;
  },
  methods: {
    isRoot(path) {
      const currentLocale = this.$i18n.locale;

      const accountRootPage = `/${currentLocale}/accounts`;
      const accountProfileRootPage = `/${currentLocale}/accounts/profile`;
      const accountSchoolRootPage = `/${currentLocale}/accounts/ski-school`;

      return (
        accountRootPage === path ||
        accountProfileRootPage === path ||
        accountSchoolRootPage === path
      );
    },
    closeNestedRoutesList() {
      if (this.isNestedRoutesListOpen) this.isNestedRoutesListOpen = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "Breadcrumb.scss";
</style>
