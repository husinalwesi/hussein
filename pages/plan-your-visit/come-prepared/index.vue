<template>
  <main v-if="!isLoading" class="come-prepared-main">
    <template v-if="isError">
      <ErrorModal :show-error-modal="isError" />
    </template>

    <template v-else-if="data">
      <template v-if="data.hero">
        <SectionContentWrapper
          section-wrapper-classes="hero-section"
          section-content-classes="content-container"
          :is-with-bg-image="true"
        >
          <template #section-content>
            <div v-if="data.hero.title" class="title-wrapper">
              <h1 class="title">
                {{ data.hero.title }}
              </h1>
            </div>

            <div
              v-if="data.hero.subtitle || data.hero.description"
              class="extra-text-container"
            >
              <div class="vertical-line" />
              <div class="flex flex-col justify-start">
                <h2 v-if="data.hero.subtitle" class="extra-text-header">
                  {{ data.hero.subtitle }}
                </h2>
                <p
                  v-if="data.hero.description"
                  class="extra-text-description"
                >
                  {{ data.hero.description }}
                </p>
              </div>
            </div>
          </template>
        </SectionContentWrapper>
      </template>

      <section
        v-if="data.categories"
        class="w-full relative h-fit flex justify-center"
      >
        <div class="categories-cards-container">
          <div v-if="!isMobileDetected" class="sticky-list-wrapper">
            <ul class="flex flex-col gap-y-4">
              <li
                v-for="category in data.categories"
                :id="'category_' + category.id"
                :key="category.id"
              >
                <button
                  type="button"
                  class="category-title"
                  @click="
                    onCategoryClick(
                      'category_' + category.id,
                      'subCategory_' + category.sub_categories[0].id
                    )
                  "
                >
                  {{ category.title }}
                </button>
                <ul
                  v-if="
                    category.sub_categories &&
                      category.sub_categories.length > 0 &&
                      currentActiveCategoryId === 'category_' + category.id
                  "
                  class="sub-category-links-container"
                >
                  <li
                    v-for="subCategory in category.sub_categories"
                    :id="`link_${'subCategory_' + subCategory.id}`"
                    :key="subCategory.id"
                    class="sub-category-link"
                    :class="{'is-active': currentActiveSubCategoryId === 'subCategory_' + subCategory.id}"
                    @click="goToSelectedSubCategoryCard('subCategory_' + subCategory.id)"
                  >
                    {{ subCategory.title }}
                  </li>
                  <div class="sliderLinks" />
                </ul>
              </li>
            </ul>
          </div>

          <div class="flex-1">
            <div
              v-for="(category, i) in data.categories"
              :key="category.id"
              class="w-full"
            >
              <div
                v-if="isMobileDetected"
                class="mb-6"
                :class="{ 'mt-12': i !== 0 }"
              >
                <label class="category-title">
                  {{ category.title }}
                </label>
              </div>
              <div
                v-if="category.sub_categories && category.sub_categories.length"
                class="flex w-full flex-col gap-y-10 justify-start"
                :class="{ 'mt-28': !isMobileDetected && i !== 0 }"
              >
                <div
                  v-for="subCategory in category.sub_categories"
                  :id="'subCategory_' + subCategory.id"
                  :key="subCategory.id"
                  class="product-card"
                >
                  <ProductCard :card-data="subCategory" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
    <template v-else>
      <NoData />
    </template>
  </main>
</template>

<script>
import ErrorModal from "@/components/Shared/ErrorModal";
import SectionContentWrapper from "@/components/Shared/SectionContentWrapper";
import ProductCard from "@/components/Shared/Cards/ProductCard";
import NoData from "@/components/Shared/NoData";

import gsap from "gsap";
import {ScrollToPlugin} from "gsap/all";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import BezierEasing from "bezier-easing";

import {endPoints} from "@/const/api";

export default {
  components: {
    ErrorModal,
    SectionContentWrapper,
    ProductCard,
    NoData
  },
  data() {
    return {
      isLoading: true,
      isError: false,
      currentActiveCategoryId: null,
      currentActiveSubCategoryId: null,
      data: null,
      isMobileDetected: false,
    };
  },
  async fetch() {
    try {
      const res = await this.$axios.$get(
        endPoints.GET_PLAN_YOUR_VISIT_COME_PREPARED_DATA
      );

      // TODO: show no data msg when there's no data found.
      if (res.Success && res.Result) this.data = res.Result;

      this.isLoading = false;
    } catch (err) {
      this.isError = true;
      this.isLoading = false;
      console.log({err});
    }
  },
  head() {
    return this.$seoGenerator(this.data, `Come Prepared`)
  },
  watch: {
    "$globalData.isMobileDevice"() {
      this.isMobileDetected = this.$globalData.isMobileDevice;
    }
  },
  mounted() {
    this.isMobileDetected = this.$globalData.isMobileDevice;

    if (this.data && this.data.categories && this.data.categories.length) this.setScrollPositionTimer();
    else this.getPageDate();
  },
  beforeDestroy() {
    if (this.data && this.data.categories && this.data.categories.length)
      clearTimeout(this.initializeScrollPositionHandler());
    if (ScrollTrigger) ScrollTrigger.getById("cardsCategoriesTrigger")?.kill(true);
  },
  methods: {
    async getPageDate() {
      try {
        const res = await this.$axios.$get(
          endPoints.GET_PLAN_YOUR_VISIT_COME_PREPARED_DATA
        );

        // TODO: show no data msg when there's no data found.
        if (res.Success && res.Result) {
          this.data = res.Result;

          if (res.Result.categories && res.Result.categories.length)
            this.setScrollPositionTimer();
        }

        this.isLoading = false;
      } catch (err) {
        this.isError = true;
        this.isLoading = false;
        console.log({err});
      }
    },
    goToSelectedSubCategoryCard(id) {
      gsap.to(window, {
        ease: BezierEasing(0.33, 0.0, 0.0, 1.0),
        duration: 0.667,
        scrollTo: {y: `#${id}`, offsetY: 40}
      });
    },
    sideLineHandler(card) {
      const linkIndicator = document.querySelector(".sliderLinks");
      const linkActive = document.getElementById(`link_${card.id}`);

      if (linkActive)
        gsap.to(linkIndicator, {
          top: linkActive.offsetTop - 10,
          height: linkActive.offsetHeight + 20,
          ease: BezierEasing(0.33, 0.0, 0.0, 1.0),
          duration: 0.33,
        });
    },
    onCategoryClick(catId, subCatId) {
      this.currentActiveCategoryId = catId;
      this.currentActiveSubCategoryId = subCatId;
      this.goToSelectedSubCategoryCard(subCatId);
    },
    initializeScrollPositionHandler() {
      gsap.registerPlugin(ScrollToPlugin);
      gsap.registerPlugin(ScrollTrigger);

      this.currentActiveCategoryId = "category_" + this.data.categories[0].id;
      this.currentActiveSubCategoryId = "subCategory_" + this.data.categories[0]?.sub_categories[0].id;

      gsap.utils.toArray(".product-card").forEach((card) => {
        const catId = this.data.categories.filter((cat) =>
          cat.sub_categories?.find((subCat) => "subCategory_" + subCat.id === card.id)
        );

        ScrollTrigger.create({
          id: "cardsCategoriesTrigger",
          trigger: card,
          start: "-40px 20%",
          end: "bottom 20%",
          onEnter: () => {
            this.currentActiveCategoryId = "category_" + catId[0].id;
            this.currentActiveSubCategoryId = card.id;
            this.$nextTick(() => this.sideLineHandler(card));
          },
          onEnterBack: () => {
            this.currentActiveCategoryId = "category_" + catId[0].id;
            this.currentActiveSubCategoryId = card.id;
            this.$nextTick(() => this.sideLineHandler(card));
          },
        });
      });
    },
    setScrollPositionTimer() {
      setTimeout(() => {
        if (this.data && this.data.categories && this.data.categories.length) this.initializeScrollPositionHandler();
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./come-prepared.scss";
</style>
