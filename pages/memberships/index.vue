<template>
  <main v-if="!isLoading" class="memberships-main">
    <template v-if="isError">
      <ErrorModal :show-error-modal="isError" />
    </template>
    <template v-else-if="data">
      <SectionContentWrapper
        v-if="data.hero"
        section-wrapper-classes="hero-section-wrapper"
        section-content-classes="hero-section-content"
        :is-with-bg-image="true"
      >
        <template #section-content>
          <div
            class="text-container"
            :class="{ 'without-img': !data.hero.image }"
          >
            <h1 v-if="data.hero.title" class="title">
              {{ data.hero.title }}
            </h1>
            <div v-if="data.hero.subtitle" class="mt-4">
              <h2 class="sub-title">
                {{ data.hero.subtitle }}
              </h2>
            </div>
          </div>

          <div v-if="data.hero.image" class="image-wrapper">
            <img
              :src="data.hero.image.image_url"
              :alt="data.hero.image.alt_text"
              :title="data.hero.image.title"
              width="340"
              height="340"
            >
          </div>
        </template>
      </SectionContentWrapper>

      <SectionContentWrapper
        v-if="data.cards_section"
        section-wrapper-classes="passes-section-wrapper"
        section-content-classes="passes-section-content"
      >
        <template #section-content>
          <div class="passes-eventes">
            <h3 v-if="data.cards_section.title" class="title">
              {{ data.cards_section.title }}
            </h3>
            <div
              v-if="data.cards_section.cards && data.cards_section.cards.length"
              class="mt-6 lg:mt-10"
            >
              <PassesContainer
                custom-class="full-container"
                :passes-data="slopeEventsData"
                :show-email="true"
                card-type="membership"
                :is-without-side-slides="true"
              />
            </div>
          </div>
        </template>
      </SectionContentWrapper>

      <section v-if="data.plan_your_visit" class="mobile-app-section-wrapper">
        <AppSection :app-section-data="data.plan_your_visit" />
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
import PassesContainer from "@/components/PassesPackages/PassesContainer";
import AppSection from "@/components/Shared/AppSection";
import NoData from "@/components/Shared/NoData";

import {endPoints} from "@/const/api";

/* eslint-disable no-undef */

export default {
  components: {
    ErrorModal,
    SectionContentWrapper,
    PassesContainer,
    AppSection,
    NoData
  },
  data() {
    return {
      isError: false,
      isLoading: false,
      slopeEventsData: {
        data: [],
        moments: {
          isActive: false,
          data: {
            id: "",
            title: "",
            description: "",
            image: {},
            cta: {},
            notify_text: {},
          },
        },
      },
      data: null,
    };
  },
  async fetch() {
    try {
      this.isLoading = true;

      const res = await this.$axios.$get(endPoints.GET_MEMBERSHIPS);

      // TODO: show no data msg when there's no data found.
      if (res.Success && res.Result) {
        this.data = res.Result;

        this.mapData();
      }

      this.isLoading = false;
    } catch (err) {
      this.isError = true;
      this.isLoading = false;
      console.log({err});
    }
  },
  head() {
    return this.$seoGenerator(this.data, `Memberships`)
  },
  watch: {
    data() {
      if (this.data) {
        let tab = {
          title: 'memberships',
          id: 'memberships'
        }
        this.$repositories.viewItemListEvent(tab, [this.data.cards_section], 'memberships')
      }
    }
  },
  methods: {
    mapData() {
      if (
        this.data &&
        this.data.cards_section &&
        this.data.cards_section.cards
      ) {
        this.slopeEventsData.data = this.data.cards_section.cards.map(
          (item) => {
            let data = {
              ak: item.id,
              title: item.title,
              price: item.price,
              img: item.image
                ? item.image.image_url
                : require(`@/assets/images/Passes/7.webp`),
              includes: item.includes,
              extra: item.external_link,
              bookingBarDetails: {},
            };
            return Object.assign({}, data, item);
          }
        );

        if (this.data.cards_section.great_moment) {
          this.slopeEventsData.moments = {
            isActive: true,
            data: {
              id: this.data.cards_section.great_moment.id,
              title: this.data.cards_section.great_moment.title,
              description: this.data.cards_section.great_moment.description,
              image: this.data.cards_section.great_moment.image
                ? {...this.data.cards_section.great_moment.image}
                : {},
              cta: this.data.cards_section.great_moment.cta
                ? {...this.data.cards_section.great_moment.cta}
                : {},
              notify_text: this.data.cards_section.great_moment.notify_text,
            },
          };
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./memberships.scss";
</style>
