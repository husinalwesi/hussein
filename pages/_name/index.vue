<template>
  <main v-if="!isLoading && data" class="details-main">
    <template v-if="data.hero">
      <SectionContentWrapper
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
            >
          </div>
        </template>
      </SectionContentWrapper>
    </template>

    <template v-if="data.card_section && data.card_section.length">
      <SectionContentWrapper section-content-classes="events-cards-section">
        <template #section-content>
          <EventCard
            v-for="(card, i) in data.card_section"
            :key="i"
            :card-type="data.passes_and_packages_card?'passes':'lessons'"
            :data="card"
            :package="data.passes_and_packages_card||data.ski_school_card"
            :class="i === data.card_section.length - 1 ? '' : 'mb-10 md:mb-20'"
            :direction="i % 2 == 0 ? 'right' : 'left'"
          />
        </template>
      </SectionContentWrapper>
    </template>

    <template
      v-if="data.extra_cards_section && data.extra_cards_section.card_section && data.extra_cards_section.card_section.length"
    >
      <SectionContentWrapper
        section-wrapper-classes="extra-events-cards-section"
        section-content-classes="px-4"
      >
        <template #section-content>
          <div
            v-if="data.extra_cards_section.title || data.extra_cards_section.note_title"
            class="section-header-container"
          >
            <h3 v-if="data.extra_cards_section.title" class="title">
              {{ data.extra_cards_section.title }}
            </h3>
            <div v-if="data.extra_cards_section.note_title" class="note-title">
              {{ data.extra_cards_section.note_title }}
            </div>
          </div>
          <EventCard
            v-for="(card, i) in data.extra_cards_section.card_section"
            :key="i"
            :data="card"
            :card-type="data.passes_and_packages_card?'passes':'lessons'"
            :package="data.passes_and_packages_card||data.ski_school_card"
            :direction="i % 2 !== 0 ? 'right' : 'left'"
            :class="i === data.extra_cards_section.card_section.length - 1 ? '' : 'mb-10 md:mb-20'"
            custom-container-classes="flex-col-reverse lg:flex-row"
          />
        </template>
      </SectionContentWrapper>
    </template>

    <template v-if="data.ski_school_section&&data.ski_school_section.cards&&data.ski_school_section.cards.length">
      <SectionContentWrapper section-content-classes="ski-school-cards-section">
        <template #section-content>
          <div v-if="data.ski_school_section.title" class="title-wrapper">
            <h3 class="title">
              {{ data.ski_school_section.title }}
            </h3>
          </div>
          <div
            v-if="data.ski_school_section.description"
            class="description-wrapper"
          >
            <p class="description">
              {{ data.ski_school_section.description }}
            </p>
          </div>

          <template
            v-if="
              data.ski_school_section.cards &&
                data.ski_school_section.cards.length
            "
          >
            <PassesContainer
              custom-class="full-container"
              :card-type="data.passes_and_packages_card?'passes':'lessons'"
              :passes-data="{
                data: data.ski_school_section.cards,
                moments: {
                  isActive: false,
                },
              }"
              :show-email="false"
            />
          </template>
        </template>
      </SectionContentWrapper>
    </template>

    <template v-if="data.notes_sections && data.notes_sections.length">
      <SectionContentWrapper section-content-classes="mb-8 md:mb-10">
        <template #section-content>
          <Tabs
            :show-content="true"
            :tabs="data.notes_sections"
            title-key="category_title"
            content-key="description_highlighted"
          />

          <div
            v-if="data.terms_and_conditions"
            class="terms-conditions-cta"
            @click.prevent="showTermsConditionsModal = true"
          >
            {{ data.terms_and_conditions.cta_title || "Terms and conditions" }} ⟶
          </div>
        </template>
      </SectionContentWrapper>
    </template>

    <template v-if="data.instructor_section">
      <OurInstructor :data="data.instructor_section" wrapper-classes="mb-16 md:mt-10 mt-8" />
    </template>

    <template v-if="data.event_section&&data.event_section.cards&&data.event_section.cards.length">
      <SectionContentWrapper section-content-classes="event-section-wrapper">
        <template #section-content>
          <div class="title-wrapper">
            <h3 v-if="data.event_section.title" class="title">
              {{ data.event_section.title }}
            </h3>
          </div>

          <template v-if="data.event_section.cards && data.event_section.cards.length">
            <PassesContainer
              custom-class="full-container"
              :passes-data="{
                data: data.event_section.cards,
                moments: {
                  isActive: data.event_section.great_moment?true:false,
                  data:data.event_section.great_moment?{...data.event_section.great_moment}:{}
                },
              }"
              :show-email="false"
            />
          </template>
        </template>
      </SectionContentWrapper>
    </template>

    <section v-if="data.plan_your_visit" class="mobile-app-section">
      <AppSection :app-section-data="data.plan_your_visit" wrapper-classes="mb-16 md:mt-10 mt-8" />
    </section>

    <template v-if="data.terms_and_conditions">
      <BaseModal
        :show-modal="showTermsConditionsModal"
        classes="px-6 pb-6 min-550:px-12 min-550:pb-8"
        @closeModal="closeModal"
      >
        <h2 slot="header" class="terms-conditions-modal-header">
          {{ data.terms_and_conditions.cta_title }}
        </h2>
        <div slot="content">
          <div
            class="terms-conditions-description-wrapper"
            v-html="data.terms_and_conditions.popup_description_highlighted"
          />
        </div>
        <div slot="extra-element" class="close-btn-wrapper">
          <BaseButton
            text="close"
            btn-type="button"
            @onBtnClick="showTermsConditionsModal = false"
          />
        </div>
      </BaseModal>
    </template>
  </main>
</template>

<script>
import SectionContentWrapper from "@/components/Shared/SectionContentWrapper";
import EventCard from "@/components/Shared/Event-Card";
import PassesContainer from "@/components/PassesPackages/PassesContainer";
import Tabs from "@/components/Shared/Tabs";
import OurInstructor from "@/components/Shared/OurInstructor";
import AppSection from "@/components/Shared/AppSection";
import BaseModal from "@/components/Shared/BaseUI/BaseModal";
import BaseButton from "@/components/Shared/BaseUI/BaseButton";
import {endPoints} from "@/const/api";

export default {
  name: "DetailsPage",
  components: {
    SectionContentWrapper,
    EventCard,
    PassesContainer,
    Tabs,
    OurInstructor,
    AppSection,
    BaseModal,
    BaseButton
  },
  data() {
    return {
      isLoading: false,
      data: null,
      showTermsConditionsModal: false,
    };
  },
  async fetch() {
    try {
      this.isLoading = true;

      const {data: res} = await this.$axios.post(
        endPoints.GET_CARD_DETAILS,
        {
          CardDetailsIdentifier: this.$route.params.name,
          Lang: this.$i18n.localeProperties.detectedLang,
          TimeZone: this.$getSiteConfig('timezone')
        }
      );

      if (res && res.Success && res.Result) {
        this.data = res.Result;
      }

      this.isLoading = false;
    } catch (err) {
      this.isLoading = false;
      // axios onResponse handler will redirect users to the page-not-found if the API returns a 404 error.
    }
  },
  head() {
    const defaultPageTitle = this.$t("PAGES_TITLE.DETAILS_PAGE", {pageName: this.$route.params.name});
    return this.$seoGenerator(this.data, defaultPageTitle);
  },
  watch: {
    data() {
      if (this.data) {
        this.$repositories.viewItemEvent(this.data)
      }
    }
  },
  methods: {
    closeModal() {
      this.$nextTick(() => {
        this.showTermsConditionsModal = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./details.scss";
</style>
