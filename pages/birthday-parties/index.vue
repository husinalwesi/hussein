<template>
  <main v-if="!isLoading" class="birthday-main">
    <template v-if="isError">
      <ErrorModal :show-error-modal="isError" />
    </template>
    <template v-else-if="data">
      <template v-if="data.hero">
        <SectionContentWrapper
          section-wrapper-classes="h-fit min-700:h-[27rem]"
          section-content-classes="flex min-700:py-0 px-4 pb-[72px] pt-[128px]"
          :is-with-bg-image="true"
        >
          <template #section-content>
            <div
              class="text-container"
              :class="{ 'without-img': !data.hero.image }"
            >
              <h1 class="title">
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
                class="w-fit h-fit max-h-[340px]"
              >
            </div>
          </template>
        </SectionContentWrapper>
      </template>

      <template v-if="data.packages_section">
        <SectionContentWrapper
          section-wrapper-classes="pt-20 mobile:pt-10"
          section-content-classes="px-4"
        >
          <template #section-content>
            <div class="w-full max-w-[648px]">
              <div v-if="data.packages_section.title" class="title">
                {{ data.packages_section.title }}
              </div>
              <div
                v-if="data.packages_section.description"
                class="subtitle mt-4"
                v-html="data.packages_section.description"
              />
            </div>
            <template v-if="data.packages_section.cta && data.packages_section.cta.url">
              <BaseButton
                :cta="data.packages_section.cta"
                :btn-type="$isExternalLink(data.packages_section.cta.url) ? 'externalLink' : 'link'"
                :text="data.packages_section.cta.title"
                :path="data.packages_section.cta.url"
              />
            </template>
            <div
              v-if="
                data.packages_section.cards &&
                  data.packages_section.cards.length
              "
              class="mt-6 md:mt-10"
            >
              <PackageCard
                v-for="(iteration, index) in data.packages_section.cards"
                :key="index"
                :packages-data="iteration"
                corner-color="bg-[#fafafa]"
                class="w-full mb-10 mx-0"
              />
            </div>
          </template>
        </SectionContentWrapper>
      </template>

      <section
        v-if="data.plan_your_visit"
        class="
            3xl:mx-auto
            flex
            items-center
            max-w-screen-3xl
            mb-[97px]
            min-700:mb-20
            w-full
            mt-[8.5rem]
            mobiles:mt-[4rem]
        "
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
import BaseButton from "@/components/Shared/BaseUI/BaseButton";
import PackageCard from "@/components/PassesPackages/PackageCard";
import AppSection from "@/components/Shared/AppSection";
import NoData from "@/components/Shared/NoData";

import {endPoints} from "@/const/api";

export default {
  components: {
    ErrorModal,
    SectionContentWrapper,
    BaseButton,
    PackageCard,
    AppSection,
    NoData
  },
  data() {
    return {
      isError: false,
      isLoading: false,
      data: null,
    };
  },
  async fetch() {
    try {
      this.isLoading = true;

      const res = await this.$axios.$get(endPoints.GET_BIRTHDAY);

      // TODO: show no data msg when there's no data found.
      if (res.Success && res.Result) {
        this.data = res.Result
      }
      this.isLoading = false;
    } catch (err) {
      console.log(err);
      this.isError = true;
      this.isLoading = false;
    }
  },
  head() {
    return this.$seoGenerator(this.data, "Birthday Parties")
  },
  watch: {
    data() {
      if (this.data) {
        let tab = {
          title: 'Birthday parties',
          id: 'Birthday'
        }
        this.$repositories.viewItemListEvent(tab, this.data.packages_section.cards)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./birthday.scss";
</style>
