<template>
  <main v-if="!isLoading" class="contact-us-main">
    <template v-if="isError">
      <ErrorModal :show-error-modal="isError" />
    </template>
    <template v-else>
      <template v-if="pageData">
        <SectionContentWrapper
          section-wrapper-classes="hero-section-wrapper"
          section-content-classes="hero-section-content"
          :is-with-bg-image="true"
        >
          <template #section-content>
            <div class="text-container">
              <h1 class="title">
                {{ pageData.hero_title ? pageData.hero_title : defaultData.hero.title }}
              </h1>
              <div class="mt-4">
                <h2 class="sub-title">
                  {{
                    pageData.hero_subtitle
                      ? pageData.hero_subtitle
                      : defaultData.hero.subtitle
                  }}
                </h2>
              </div>
            </div>

            <div v-if="pageData.hero && pageData.hero.image" class="image-wrapper">
              <img
                :src="pageData.hero.image.image_url"
                :alt="pageData.hero.image.alt_text"
                :title="pageData.hero.image.title"
                width="340"
                height="340"
                class="w-fit h-fit max-h-[340px]"
              >
            </div>
          </template>
        </SectionContentWrapper>
      </template>

      <SectionContentWrapper
        section-wrapper-classes="pb-20 pt-10 md:pt-20 relative"
        section-content-classes="px-4"
      >
        <template #section-content>
          <ContactForm
            :form-type="formType"
            :contact-form-data="pageData"
          />
          <img
            :src="
              require(`@/assets/images/ContactForm/${
                $globalData.isMobileDevice
                  ? 'mobile-white-snowflake-bg.png'
                  : 'white-snowflake-bg.png'
              }`)
            "
            alt="snow white"
            title="snow white background"
            width="1440"
            height="728"
            class="w-full h-full top-0 -z-1 ltr:left-0 rtl:right-0 absolute"
          >
        </template>
      </SectionContentWrapper>
    </template>
  </main>
</template>

<script>
import ErrorModal from "@/components/Shared/ErrorModal";
import SectionContentWrapper from "@/components/Shared/SectionContentWrapper";
import ContactForm from "@/components/Shared/ContactForm";

import {endPoints} from "@/const/api";
import {lookups} from "@/const/enum";

const formsTypes = ["birthdays", "company", "schools"];

export default {
  components: {
    ErrorModal,
    ContactForm,
    SectionContentWrapper
  },
  data() {
    return {
      isError: false,
      isLoading: false,
      formType: "",
      pageData: {},
      defaultData: {
        hero: {
          title: this.$t("CONTACT_US.TITLE"),
          subtitle: this.$t("CONTACT_US.DESCRIPTION"),
          image: null
        }
      }
    };
  },
  async fetch() {
    try {
      const type = this.$route.params.type;
      if (!type || formsTypes.includes(type)) {
        this.isLoading = true;

        this.formType = type;

        const contactFormType = this.formType ? lookups.contactFormsTypes[this.formType] : lookups.contactFormsTypes.general;

        const res = await this.$axios.$get(endPoints.GET_CONTACT_FORM + `?type=${contactFormType}`);

        if (res.Success && res.Result) {
          if ((res.Result.packages || []).length) {
            res.Result.packages = this.getFlattendList(res.Result.packages);
          }
          
          if ((res.Result.subjects || []).length) {
            res.Result.subjects = this.getFlattendList(res.Result.subjects);
          }

          this.pageData = res.Result;
        }

        this.isLoading = false;
      } else this.$nuxt.context.error({status: 404});
    } catch (err) {
      this.isError = true;
      this.isLoading = false;
      console.log({err});
    }
  },
  head() {
    const defaultPageTitle = this.pageData.hero_title || this.defaultData.hero.title;
    return this.$seoGenerator(this.pageData, defaultPageTitle)
  },
  methods: {
    getFlattendList(list) {
      const flattendLinst =  list.map((listItem) => {
        return {
          id: listItem.id,
          name: listItem.title,
          value: listItem.title,
        };
      });

      return flattendLinst;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./contact-us.scss";
</style>
