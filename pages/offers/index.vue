<template>
  <main v-if="!isLoading" class="offers-main overflow-hidden">
    <template v-if="isError">
      <ErrorModal :show-error-modal="isError" />
    </template>

    <template v-else-if="pageData">
      <template v-if="pageData.hero">
        <SectionContentWrapper
          section-wrapper-classes="h-fit min-700:h-[27rem]"
          section-content-classes="flex min-700:py-0 px-4 pb-[72px] pt-[128px]"
          :is-with-bg-image="true"
        >
          <template #section-content>
            <div
              class="text-container"
              :class="{ 'without-img': !pageData.hero.image }"
            >
              <h1 class="title">
                {{ pageData.hero.title }}
              </h1>
              <div v-if="pageData.hero.subtitle" class="mt-4">
                <h2 class="sub-title">
                  {{ pageData.hero.subtitle }}
                </h2>
              </div>
            </div>

            <div v-if="pageData.hero.image" class="image-wrapper">
              <img
                :src="pageData.hero.image.image_url"
                :alt="pageData.hero.image.alt_text"
                :title="pageData.hero.image.title"
                width="340"
                height="340"
              >
            </div>
          </template>
        </SectionContentWrapper>
      </template>

      <SectionContentWrapper
        v-if="pageData.cards_section"
        :section-content-classes="'px-0 md:px-4 pt-9 md:pt-20 pb-12 md:pb-[136px]'"
      >
        <template #section-content>
          <div class="px-4 md:px-0 mb-6 md:mb-10">
            <h3
              v-if="pageData.cards_section.title"
              class="ltr:font-druk-wide-heavy-italic rtl:font-adapter leading-6 md:text-[32px] md:leading-8 text-2xl text-dark-gray uppercase"
            >
              {{ pageData.cards_section.title }}
            </h3>
          </div>
          <PassesContainer
            v-if="
              pageData.cards_section.cards &&
                pageData.cards_section.cards.length
            "
            custom-class="full-container"
            :passes-data="slopeEventsData"
            :show-email="true"
            card-type="time-based"
            :is-without-side-slides="true"
          />
        </template>
      </SectionContentWrapper>

      <section
        v-if="pageData.plan_your_visit"
        class="3xl:mx-auto flex items-center max-w-screen-3xl mb-[97px] min-700:mb-20 w-full"
      >
        <AppSection :app-section-data="pageData.plan_your_visit" />
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

/* eslint-disable no-undef */

export default {
  name: "Offers",
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
      pageData: null,
    };
  },
  async fetch() {
    try {
      this.isLoading = true;

      this.pageData = await this.$repositories.getOffersPage();
      if (this.pageData) this.mapData();

      this.isLoading = false;
    } catch (err) {
      this.isError = true;
      this.isLoading = false;
      console.log({err});
    }
  },
  head() {
    return this.$seoGenerator(this.pageData, `Offers`)
  },
  watch: {
    pageData() {
      if (this.pageData &&
        this.pageData.cards_section &&
        this.pageData.cards_section.cards) {
        let tab = {
          title: 'Offers',
          id: 'offers'
        }
        this.$repositories.viewItemListEvent(tab, this.pageData.cards_section.cards, 'offers')
      }
    }
  },
  methods: {
    mapData() {
      if (
        this.pageData &&
        this.pageData.cards_section &&
        this.pageData.cards_section.cards
      ) {
        this.slopeEventsData.data = this.pageData.cards_section.cards.map(
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

        if (this.pageData.cards_section.great_moment) {
          this.slopeEventsData.moments = {
            isActive: true,
            data: {
              id: this.pageData.cards_section.great_moment.id,
              title: this.pageData.cards_section.great_moment.title,
              description: this.pageData.cards_section.great_moment.description,
              image: this.pageData.cards_section.great_moment.image
                ? {...this.pageData.cards_section.great_moment.image}
                : {},
              cta: this.pageData.cards_section.great_moment.cta
                ? {...this.pageData.cards_section.great_moment.cta}
                : {},
              notify_text: this.pageData.cards_section.great_moment.notify_text,
            },
          };
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.offers-main {
  .text-container {
    @apply flex-1 justify-center h-full flex flex-col;

    .title {
      @apply w-full min-900:text-6xl text-white uppercase ltr:font-druk-wide-heavy-italic rtl:font-adapter min-320:text-[32px] min-700:text-5xl text-3xl;
    }

    .sub-title {
      @apply ltr:font-caveat-bold rtl:font-noto-sans-arabic-semi-bold leading-6 text-2xl;
    }

    &.without-img {
      @apply max-w-[872px];
    }
  }

  .image-wrapper {
    @apply hidden md:flex md:w-[20rem] min-900:w-[21.25rem] h-full items-end;
  }
}
</style>
