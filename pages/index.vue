<template>
  <component
    :is="component"
    :home-page-data="homePageData"
    :is-loading="isLoading"
    :is-error="isError"
  />
</template>

<script>
import SkiDubaiHomepage from "@/components/HomePage";
import SnowAbuDhabiHomepage from "@/components/AbuDhabi/HomePage";
import SnowOmanHomepage from "@/components/Oman/HomePage";

import {endPoints} from "@/const/api";

export default {
  name: "HomePage",
  components: {
    SkiDubaiHomepage,
    SnowAbuDhabiHomepage,
    SnowOmanHomepage,
  },
  data() {
    return {
      currentEnv: '',
      component: "",
      homePageData: null,
      isLoading: true,
      isError: false
    };
  },
  async fetch() {
    try {
      this.currentEnv = this.$getSiteConfig("title");
      const loweredCaseEnv = this.currentEnv.toLowerCase();
      this.component = loweredCaseEnv.includes("dhabi") ? "SnowAbuDhabiHomepage" : loweredCaseEnv.includes("oman") ? "SnowOmanHomepage" : "SkiDubaiHomepage";

      const result = await this.$axios.get(endPoints.GET_HOMEPAGE_DATA);

      if (result.status === 200 && result.data.Success) {
        this.homePageData = result.data.Result;
      } else {
        this.isError = true;
      }
      this.isLoading = false;
    } catch (err) {
      this.isError = true;
      this.isLoading = false;
      console.log({err});
    }
  },
  head() {
    return this.$seoGenerator(this.homePageData, "Home Page");
  },
};
</script>
