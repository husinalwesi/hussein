<template>
  <main v-if="!isLoading" class="event-details">
    <template v-if="isError">
      <ErrorModal :show-error-modal="isError" />
    </template>

    <template v-else-if="data">
      <template v-if="data.hero">
        <SectionContentWrapper
          section-wrapper-classes="hero-section-wrapper"
          section-content-classes="hero-section-content"
          :is-with-bg-image="true"
        >
          <template #section-content>
            <div
              class="text-container"
              :class="{'without-img': !data.hero.image}"
            >
              <h1 v-if="data.hero.title" class="title">
                {{ data.hero.title }}
              </h1>
              <div class="mt-4">
                <h2 v-if="data.hero.subtitle" class="sub-title">
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
                class="max-h-[21.25rem]"
              >
            </div>
          </template>
        </SectionContentWrapper>
      </template>

      <SectionContentWrapper section-content-classes="-mt-10">
        <template #section-content>
          <Tabs custom-class="text-white" :tabs="data.event_categories" @tabClicked="onTabChange($event)" />
        </template>
      </SectionContentWrapper>

      <template v-if="selectedTab.sections && selectedTab.sections.length">
        <SectionContentWrapper
          v-for="(section, i) in selectedTab.sections"
          :key="section.id"
          :section-wrapper-classes="i%2!== 0?'bg-[#FAFAFA]':''"
          section-content-classes="event-section-wrapper"
        >
          <template #section-content>
            <div class="title-wrapper">
              <h3 v-if="section.title" class="title">
                {{ section.title }}
              </h3>
            </div>

            <template v-if="section.section_cards_type_id===2">
              <PackageCard
                v-for="(card, sectionIndex) in section.cards"
                :key="sectionIndex"
                class="mx-auto pb-8 lg:pb-10"
                :packages-data="card"
                corner-color="bg-[#fafafa]"
              />
            </template>
            <template v-if="section.section_cards_type_id=== 3||section.section_cards_type_id===1">
              <PassesContainer
                v-if="section.cards && section.cards.length"
                custom-class="full-container"
                :passes-data="{
                  data: section.cards,
                  moments: {
                    isActive: false
                  }
                }"
                :show-email="false"
                :is-without-side-slides="false"
              />
            </template>
          </template>
        </SectionContentWrapper>
      </template>

      <SectionContentWrapper
        v-else section-wrapper-classes="md:pb-[7.5rem] md:pt-20 pb-24 pt-10"
        section-content-classes="px-4"
      >
        <template #section-content>
          <EmptyCard :data="selectedTab.empty_state" />
        </template>
      </SectionContentWrapper>

      <section
        v-if="data.plan_your_visit"
        class="3xl:mx-auto flex items-center max-w-screen-3xl my-20 w-full"
      >
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
import Tabs from "@/components/Shared/Tabs";
import PackageCard from "@/components/PassesPackages/PackageCard";
import PassesContainer from "@/components/PassesPackages/PassesContainer";
import EmptyCard from "@/components/Shared/EmptyCard";
import AppSection from "@/components/Shared/AppSection";
import NoData from "@/components/Shared/NoData";

export default {
  name: "Event",
  components: {
    ErrorModal,
    SectionContentWrapper,
    Tabs,
    PackageCard,
    PassesContainer,
    EmptyCard,
    AppSection,
    NoData
  },
  data() {
    return {
      isError: false,
      isLoading: false,
      data: null,
      selectedTab: {}
    };
  },
  async fetch() {
    try {
      this.isLoading = true;

      this.data = await this.$repositories.getEventsPage();

      if (this.data.event_categories && this.data.event_categories.length > 0) {
        this.selectedTab = this.data.event_categories[0];
      }

      this.isLoading = false;
    } catch (err) {
      this.isError = true;
      this.isLoading = false;
      console.log({err});
    }
  },
  head() {
    return this.$seoGenerator(this.data, `Events`);
  },
  watch: {
    selectedTab() {
      if (this.selectedTab) {
        this.$repositories.viewItemListEvent(this.selectedTab, this.selectedTab.sections, 'events')
      }
    }
  },
  methods: {
    onTabChange(tab) {
      this.selectedTab = tab;
      this.$repositories.viewItemListEvent(this.selectedTab, this.selectedTab.sections, 'events');
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./events.scss";
</style>
