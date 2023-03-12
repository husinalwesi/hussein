<template>
  <main v-if="!isLoading" class="sitemap-main">
    <template v-if="isError">
      <ErrorModal :show-error-modal="isError" />
    </template>
    <template v-if="pageData">
      <SectionContentWrapper
        section-wrapper-classes="pt-24 md:pt-40"
        section-content-classes="px-4"
      >
        <template #section-content>
          <div class="mb-6 min-700:mb-[41px]">
            <h1 class="title">
              {{ pageData.section_title }}
            </h1>
          </div>

          <CardContainer>
            <template #card-content>
              <div v-for="(section, i) in pageData.sections" :key="i">
                <div class="mb-4">
                  <h2 class="category-title">
                    {{ section.title }}
                  </h2>
                </div>

                <div class="flex flex-col md:flex-row">
                  <div class="flex-1">
                    <ul>
                      <li
                        v-for="(leftSectionItem, index) in section.left_row_items"
                        :key="index"
                        :class="{'my-2':index !== section.left_row_items.length - 1 && index !== 0}"
                      >
                        <template v-if="leftSectionItem.main_item && leftSectionItem.main_item.title">
                          <BaseButton
                            :btn-type="$isExternalLink(leftSectionItem.main_item.url)?'externalLink':'link'"
                            :text="leftSectionItem.main_item.title"
                            :path="leftSectionItem.main_item.url"
                            class-name="cta-link bold"
                          />
                        </template>

                        <ul v-if="leftSectionItem.sub_items && leftSectionItem.sub_items.length">
                          <li
                            v-for="(subItem, subItemIndex) in leftSectionItem.sub_items"
                            :key="subItemIndex"
                            :class="{'my-2': subItemIndex !== leftSectionItem.sub_items - 1}"
                          >
                            <BaseButton
                              :btn-type="$isExternalLink(subItem.url)?'externalLink':'link'"
                              :text="subItem.title"
                              :path="subItem.url"
                              class-name="cta-link"
                            />
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  <div class="flex-1">
                    <ul>
                      <li
                        v-for="(rightSectionItem, index) in section.right_row_items"
                        :key="index"
                        :class="{'my-2':index !== section.right_row_items.length - 1 && index !== 0}"
                      >
                        <template v-if="rightSectionItem.main_item && rightSectionItem.main_item.title">
                          <BaseButton
                            :btn-type="$isExternalLink(rightSectionItem.main_item.url)?'externalLink':'link'"
                            :text="rightSectionItem.main_item.title"
                            :path="rightSectionItem.main_item.url"
                            class-name="cta-link bold"
                          />
                        </template>

                        <ul v-if="rightSectionItem.sub_items&&rightSectionItem.sub_items.length">
                          <li
                            v-for="(subItem, subItemIndex) in rightSectionItem.sub_items"
                            :key="subItemIndex"
                            :class="{'my-2':subItemIndex !== rightSectionItem.sub_items - 1}"
                          >
                            <BaseButton
                              :btn-type="$isExternalLink(subItem.url)?'externalLink':'link'"
                              :text="subItem.title"
                              :path="subItem.url"
                              class-name="cta-link"
                            />
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>

                <div v-if="i !== pageData.sections.length - 1" class="dashed-line" />
              </div>
            </template>
          </CardContainer>
        </template>
      </SectionContentWrapper>
    </template>
    <template v-else>
      <NoData />
    </template>
  </main>
</template>

<script>
import ErrorModal from "@/components/Shared/ErrorModal";
import SectionContentWrapper from "@/components/Shared/SectionContentWrapper";
import CardContainer from "@/components/BookingFlow/CardContainer";
import BaseButton from "@/components/Shared/BaseUI/BaseButton";
import NoData from "@/components/Shared/NoData";

/* eslint-disable no-undef */

export default {
  name: "Sitemap",
  components: {
    ErrorModal,
    SectionContentWrapper,
    CardContainer,
    BaseButton,
    NoData
  },
  data() {
    return {
      isError: false,
      isLoading: false,
      pageData: null,
    };
  },
  head() {
    return this.$seoGenerator(this.pageData, `Sitemap`)
  },
  // eslint-disable-next-line vue/order-in-components
  async fetch(){
      this.isLoading = true;

      const res = await this.$repositories.getSiteMap();

      if (res && res.success && res.data) this.pageData = res.data;
      else if (res.isError) this.isError = true;

      this.isLoading = false;
  }
};
</script>

<style lang="scss" scoped>
@import "./sitemap.scss";
</style>
