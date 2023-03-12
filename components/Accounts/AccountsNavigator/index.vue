<template>
  <div class="accounts-navigator-list">
    <SideList v-if="$globalData.isDesktopDevice" :cats="cats" />
    <breadcrumb v-else :is-membership-enabled="(cmsSiteConfig || {}).enable_membership" />
  </div>
</template>

<script>
import SideList from "./SideList";
import Breadcrumb from "./Breadcrumb";

export default {
  components: {SideList, Breadcrumb},
  props: {
    cmsSiteConfig: {
      type: Object,
      default: () => ({
        enable_membership: false
      })
    }
  },
  data() {
    const ACCOUNTS_SHARED_LINKS = {
      DASHBOARD: {
        title: this.$t("ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.DASHBOARD"),
        path: "/accounts/dashboard"
      },
      PERSONAL_DETAILS: {
        title: this.$t("ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.PROFILE.PERSONAL_DETAILS"),
        path: "/accounts/profile/personal-details"
      },
      MEMBERSHIPS: {
        title: this.$t("ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.PROFILE.MEMBERSHIPS"),
        path: "/accounts/profile/memberships"
      },
      GEAR: {
        title: this.$t("ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.PROFILE.GEAR"),
        path: "/accounts/profile/set-your-gear"
      },
      TRANSACTIONS: {
        title: this.$t("ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.TRANSACTIONS"),
        path: "/accounts/transactions"
      },
      PAYMENTS: {
        title: this.$t("ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.PAYMENTS"),
        path: "/accounts/payments"
      },
      SHARE: {
        title: this.$t("ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.SHRAE"),
        path: "/accounts/share"
      }
    };

    return {
      cats: [],
      SKI_DUBAI: [
        {
          title: this.$t("ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.TITLE"),
          links: [
            ACCOUNTS_SHARED_LINKS.DASHBOARD,
            {
              title: this.$t("ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.PROFILE.TITLE"),
              subLinks: [
                ACCOUNTS_SHARED_LINKS.PERSONAL_DETAILS,
                {
                  title: this.$t("ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.PROFILE.WAIVER"),
                  path: "/accounts/profile/waiver-form"
                },
                ACCOUNTS_SHARED_LINKS.GEAR
              ],
              path: "/accounts/profile/personal-details"
            },
            ACCOUNTS_SHARED_LINKS.TRANSACTIONS,
            ACCOUNTS_SHARED_LINKS.PAYMENTS,
            ACCOUNTS_SHARED_LINKS.SHARE
          ]
        },
        {
          title: this.$t("ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.SKI_SCHOOL.TITLE"),
          links: [
            {
              title: this.$t("ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.SKI_SCHOOL.SKI_PASSPORT"),
              path: "/accounts/ski-school/ski-passport"
            },
            {
              title: this.$t("ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.SKI_SCHOOL.SNOWBOARD_PASSPORT"),
              path: "/accounts/ski-school/snowboard-passport"
            }
          ]
        }
      ],
      SNOW_ABU_DHABI: [
        {
          title: this.$t("ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.TITLE"),
          links: [
            ACCOUNTS_SHARED_LINKS.DASHBOARD,
            {
              title: this.$t("ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.PROFILE.TITLE"),
              subLinks: [ACCOUNTS_SHARED_LINKS.PERSONAL_DETAILS, ACCOUNTS_SHARED_LINKS.GEAR],
              path: "/accounts/profile/personal-details"
            },
            ACCOUNTS_SHARED_LINKS.TRANSACTIONS,
            ACCOUNTS_SHARED_LINKS.PAYMENTS,
            ACCOUNTS_SHARED_LINKS.SHARE
          ]
        }
      ],
      SNOW_OMAN: [
        {
          title: this.$t("ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.TITLE"),
          links: [
            ACCOUNTS_SHARED_LINKS.DASHBOARD,
            {
              title: this.$t("ACCOUNT_PAGE.ACCOUNTS_NAVIGATOR.PROFILE.TITLE"),
              subLinks: [ACCOUNTS_SHARED_LINKS.PERSONAL_DETAILS, ACCOUNTS_SHARED_LINKS.GEAR],
              path: "/accounts/profile/personal-details"
            },
            ACCOUNTS_SHARED_LINKS.TRANSACTIONS,
            ACCOUNTS_SHARED_LINKS.PAYMENTS
          ]
        }
      ],
      conditionalLinks: {
        memberships: ACCOUNTS_SHARED_LINKS.MEMBERSHIPS
      }
    };
  },
  watch: {
    "cmsSiteConfig.enable_membership"() {
      if (this.cmsSiteConfig.enable_membership) {
        this.conditionalSubLinksHandler("memberships");
      }
    }
  },
  created() {
    const currentEnv = this.$getSiteCurrentEnvironment(true, true);
    this.cats = this[currentEnv];
  },
  mounted() {
    if (this.cmsSiteConfig.enable_membership) {
      this.conditionalSubLinksHandler("memberships");
    }
  },
  methods: {
    // TODO: Modify this function to handle all types of links.
    conditionalSubLinksHandler(conditionalLinkName) {
      const activeCats = this.cats || [];

      if (activeCats.length) {
        const detectedConditionalLink = this.conditionalLinks[conditionalLinkName];
        const detectedSubLink = activeCats[0].links[1].subLinks.find(subLink => subLink.path === detectedConditionalLink.path);

        if (!detectedSubLink) {
          this.cats[0].links[1].subLinks.push(detectedConditionalLink);
        }
      }
    }
  }
};
</script>
