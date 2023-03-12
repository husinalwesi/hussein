<template>
  <main class="ski-dubai passes-packages-container">
    <template v-if="isError">
      <ErrorModal :show-error-modal="isError" />
    </template>

    <template v-else-if="tabs && tabs.length">
      <section
        class="passes-packages-header-section"
        :style="{
          backgroundImage: `url(${bgImageURL})`,
        }"
      >
        <div class="title-container">
          <h1 v-if="!isGetFilterDataLoading" class="title">
            <span class="text-white rtl:leading-[3.25rem] lg:rtl:leading-[7.938rem]">{{ hero.title }}</span>
            <span class="second-part rtl:leading-[3.25rem] lg:rtl:leading-[7.938rem]">{{ hero.subtitle }}</span>
          </h1>
        </div>
        <div class="tabs-wrapper" vue-dragscroll>
          <ul v-if="tabs.length>2" class="tabs-list">
            <template v-for="(tab, idx) in tabs">
              <li
                v-if="!tab.isExplore"
                :key="tab.id"
                class="tab"
                :class="{
                  active: activeTabId === tab.id,
                  'last-child': idx === tabs.length - 1
                }"
                :style="{opacity: !activeTabId ? 0.5 : ''}"
                @click="onTabChange(tab)"
              >
                {{ tab.title }}
              </li>
            </template>

            <div class="line-indicator" />
          </ul>
        </div>
      </section>
      <div v-if="isGetTabDataLoading" class="relative h-36">
        <CircleLoader :custom-class="'mt-10'" />
      </div>

      <div v-else class="min-h-[100vh]">
        <template v-if="isEmpty">
          <EmptyState :tab-title="tabTitle" :data="emptyStateObject" />
          <explore :data="tabData" :is-animation-completed="true" />
        </template>

        <template v-else-if="activeTabId || $route.fullPath.includes('explore')">
          <NuxtChild :data="tabData" />
        </template>
      </div>
    </template>
  </main>
</template>
<script>
import ErrorModal from "@/components/Shared/ErrorModal";
import EmptyState from "@/components/PassesPackages/EmptyState";
import explore from "@/pages/passes-packages/explore";
import gsap from "gsap";
import BezierEasing from "bezier-easing";
import {ScrollToPlugin} from "gsap/all";
import {endPoints} from "@/const/api";
import {CommonEvent} from "@/services/app-events";

export default {
  name: "PassessPackages",
  components: {
    ErrorModal,
    EmptyState,
    explore,
  },
  data() {
    return {
      tabs: [],
      tabData: [],
      activeTabId: -1,
      isFirstMount: true,
      lastActiveTab: {offsetLeft: 0},
      structureData: {},
      isEmpty: false,
      emptyStateObject: {},
      isGetFilterDataLoading: false,
      isGetTabDataLoading: true,
      isError: false,
      selectedActiveTab: null,
      bgImageURL: "",
      currency: "",
      hero: {},
      selectedTab: null
    };
  },
  async fetch() {
    this.setupPage();
    await this.getHero();
    await this.getTabs();
    await this.getSelectedTabData();
  },
  head() {
    return this.$seoGenerator(this.selectedActiveTab, "Passes And Packages");
  },
  computed: {
    tabTitle() {
      return this.tabs
        .filter((tab) => tab.id === this.activeTabId)
        .flatMap((tab) => {
          return tab.title;
        })
        .shift();
    },
  },
  watch: {
    activeTabId() {
      this.$nextTick(() => {
        if (this.isFirstMount) this.passesPackagesAnimeHandler();
        else this.moveUnderlineIndicator();
      });
    },
    $route() {
      this.getSelectedTabData();
      this.defaultRouteHandler();
    },
    tabData() {
      if (this.selectedTab)
        this.$repositories.viewItemListEvent(this.selectedTab, this.tabData);
    }
  },
  mounted() {
    this.defaultRouteHandler();
    CommonEvent.$emit("global-loader", false);
    CommonEvent.$on("update-data", () => {
      this.getSelectedTabData();
    });
    window.scrollTo({top: 0});
    gsap.registerPlugin(ScrollToPlugin);
    window.addEventListener("resize", this.moveUnderlineIndicator); //TODO: Try to remove this
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.moveUnderlineIndicator);
    // reset pacakge fileteration when user leave the page.
    this.$store.commit("packageSelection/setSelection", {});
  },
  methods: {
    defaultRouteHandler() {
      if (
        this.$route.fullPath === this.localePath("/passes-packages") ||
        this.$route.fullPath === this.localePath("/passes-packages") + '/'
      ) {
        if (this.tabs.length === 2 && this.isFirstMount) {
          this.onTabChange(this.tabs[1])
        } else {
          this.$router.push(this.localePath("/passes-packages/explore"));
        }
      }
    },
    //TODO: enhance this method functionality.
    passesPackagesAnimeHandler() {
      const activeTab = document.querySelector(".tabs-list .active");
      if (!activeTab) return false;
      if (this.$globalData.isDesktopDevice) {
        const tabs = document.querySelectorAll(".tabs-list .tab");
        const headerSpans = document.querySelectorAll(
          ".title-container .title span"
        );

        headerSpans.forEach((span, i) => {
          gsap
            .from(span, {
              duration: 1.66,
              transitionTimingFunction: (0.33, 0.0, 0.0, 1.0),
              y: 200,
            })
            .delay(i * 0.07);
        });
        tabs.forEach((tab, tabIndex) => {
          gsap
            .fromTo(
              tab,
              {autoAlpha: 0, translateY: 200},
              {
                autoAlpha: 0.5,
                translateY: 0,
                ease: BezierEasing(0.33, 0.0, 0.0, 1.0),
                duration: 0.83,
              }
            )
            .delay(tabIndex * 0.07);
        });

        setTimeout(() => {
          const activeTabOffsetRight =
            activeTab.offsetParent?.offsetWidth -
            (activeTab.offsetLeft + activeTab.offsetWidth);

          const lineIndicatorAnime = gsap
            .fromTo(
              ".line-indicator",
              {
                left: activeTab.offsetLeft,
                transition: 0.16,
                transitionTimingFunction: (0.6, 0, 0.4, 1),
              },
              {
                right: activeTabOffsetRight,
              }
            )
            .duration(0.33);
          const changeActiveTabOpacityAnime = gsap.to(activeTab, {
            opacity: 1,
            duration: 0.33,
          });
          const tl = gsap.timeline();
          tl.add(lineIndicatorAnime, "< 1.5");
          tl.add(changeActiveTabOpacityAnime, "<");
        }, 500);

        this.lastActiveTab = activeTab;
      } else {
        this.lastActiveTab = activeTab;

        const lastActiveTabOffsetRight =
          this.lastActiveTab.offsetParent.offsetWidth -
          (this.lastActiveTab.offsetLeft + this.lastActiveTab.offsetWidth);
        gsap.set(activeTab, {
          borderBottomColor: "#FAD903",
          borderBottomWidth: 4,
        });
        gsap.set(".line-indicator", {
          right: lastActiveTabOffsetRight,
          left: this.lastActiveTab.offsetLeft,
          autoAlpha: 0,
        });
        //TODO: remove the timeout when the actual width issue is solved.
        setTimeout(() => {
          gsap.to(".tabs-wrapper .tabs-list", {
            scrollTo: {
              x: activeTab,
              offsetX:
                (activeTab.offsetParent.offsetWidth - activeTab.offsetWidth) /
                2,
            },
          });
        }, 300);
      }

      this.isFirstMount = false;
    },
    moveUnderlineIndicator() {
      const activeTab = document.querySelector(".tabs-list .active");
      if (!activeTab) {
        gsap.set(".line-indicator", {
          autoAlpha: 0,
        });
        return false;
      }

      const activeTabOffsetRight =
        activeTab.offsetParent?.offsetWidth -
        (activeTab.offsetLeft + activeTab.offsetWidth);

      gsap.set(".line-indicator", {
        autoAlpha: 1,
      });

      if (this.lastActiveTab.offsetLeft < activeTab.offsetLeft) {
        gsap
          .fromTo(
            ".line-indicator",
            {
              right: activeTabOffsetRight,
              transition: 0.16,
              transitionTimingFunction: (0.6, 0, 0.4, 1),
            },
            {
              left: activeTab.offsetLeft,
            }
          )
          .duration(0.33);
      } else {
        gsap
          .fromTo(
            ".line-indicator",
            {
              left: activeTab.offsetLeft,
              transition: 0.16,
              transitionTimingFunction: (0.6, 0, 0.4, 1),
            },
            {
              right: activeTabOffsetRight,
            }
          )
          .duration(0.33);
      }

      gsap.to(this.lastActiveTab, {
        opacity: 0.5,
        duration: 0.33,
        borderWidth: 0,
      });

      if (window.innerWidth < 900)
        gsap.to(".tabs-wrapper .tabs-list", 0.6, {
          scrollTo: {
            x: activeTab,
            offsetX:
              (activeTab.offsetParent.offsetWidth - activeTab.offsetWidth) / 2,
          },
        });
      gsap.to(activeTab, {opacity: 1, duration: 0.33});

      this.lastActiveTab = activeTab;
    },
    onTabChange(tab) {
      this.activeTabId = tab.id;
      this.$router.push(this.localePath(`/passes-packages/${tab.url_key}`));
    },
    async getSelectedTabData() {
      try {
        if (!this.isGetTabDataLoading) this.isGetTabDataLoading = true;

        const isDefaultRoute = this.$route.fullPath === this.localePath("/passes-packages") || this.$route.fullPath === this.localePath("/passes-packages") + "/";

        let tab = null;

        if (isDefaultRoute) {

          if (this.tabs.length === 2) {
            tab = this.tabs[1]
          } else {
            tab = this.tabs.find((tab) => tab.isExplore);
          }

        } else {
          tab = this.tabs.find((tab) => this.$route.fullPath.indexOf(tab.url_key) !== -1);
        }

        this.selectedTab = tab
        if (!tab) return this.$nuxt.context.error({status: 404});

        this.activeTabId = tab.isExplore ? null : tab.id;

        let filterData = this.$store.state.bookingBar.data;
        const filterRequest = {
          ExperienceCategoryId: tab.id,
          Date: !this.$isEmptyObject(filterData)
            ? this.$isPastDate(filterData.date.fullDate)
              ? null
              : filterData.date.fullDate
            : null,
          AdultNumber: !this.$isEmptyObject(filterData)
            ? filterData.people.adult
            : 1,
          JuniorNumber: !this.$isEmptyObject(filterData)
            ? filterData.people.junior
            : 0,
          ChildNumber: !this.$isEmptyObject(filterData)
            ? filterData.people.child
            : 0,
          IsExplore: tab.isExplore,
          Lang: this.$i18n.localeProperties.detectedLang,
          TimeZone: this.$getSiteConfig("timezone"),
        };

        let res = await this.$axios.$post(
          endPoints.GET_TAB_SECTIONS,
          filterRequest,
          {progress: true}
        );

        this.isEmpty = false;
        if (res && res.Result) {
          this.selectedActiveTab = res.Result;

          if (tab.isExplore) this.isFirstMount = false;

          this.tabData = tab.isExplore ? res.Result.explore : res.Result.sections;
          if (this.tabData && this.tabData.length === 0) {
            this.isFirstMount = false;
            this.isEmpty = true;
            this.emptyStateObject = res.Result.empty_state || {};
            this.tabData = res.Result.explore;
          }
        } else {
          this.isEmpty = true;
        }
        this.isGetTabDataLoading = false;
      } catch (err) {
        this.isError = true;
        this.isGetTabDataLoading = false;
        // TODO: show proper error message.
        console.log({err});
      }
    },
    setupPage() {
      /* eslint-disable no-undef */
      const currentEnv = this.$getSiteCurrentEnvironment();
      this.currency = this.$getSiteConfig("currency");
      this.bgImageURL = currentEnv.includes("dhabi")
        ? require("@/assets/images/AbuDhabi/dark-blue-filtered.png")
        : currentEnv.includes("oman")
          ? require("@/assets/images/Oman/gradient-dark-purple-desktop.png")
          : require("/assets/images/Dubai/gradient-noisy-sky-bg.webp");
    },
    async getHero() {
      let res = await this.$axios.$get(
        endPoints.GET_PASSES_PACKAGES_HERO,
      );
      if (res && res.Result)
        this.hero = res.Result
    },
    async getTabs() {
      try {
        this.isGetFilterDataLoading = true;
        let res = await this.$axios.$get(endPoints.GET_FILTER_DATA, {
          progress: true,
        });

        if (res && res.Result) {
          this.tabs = [];
          this.tabs.push({
            id: 1,
            title: this.$t("PASSES_PACKAGES.EXPLORE"),
            url_key: "explore",
            isExplore: true,
          });
          this.tabs = this.tabs.concat(res.Result.experience_categories);
        }

        this.isGetFilterDataLoading = false;
      } catch (err) {
        this.isError = true;
        this.isGetFilterDataLoading = false;
        // TODO: show proper error message.
        console.log({err});
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "./passes-packages/PassesPackages.scss";
</style>
