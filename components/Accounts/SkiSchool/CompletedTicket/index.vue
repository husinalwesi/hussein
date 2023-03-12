<template>
  <CardContainer
    container-classes="mt-8 relative"
    wrapper-classes="py-[23px] px-[15px] min-700:pb-[20px]"
  >
    <template v-if="isLoading" #card-content>
      <snowflake-loader loader-classes="h-12" />
    </template>
    <template v-else #card-content>
      <img
        :src="require('@/assets/images/Accounts/ticket.png')"
        alt="ticket"
        title="ticket"
        width="80"
        height="81"
        class="ticket-img"
      >
      <div class="title-wrapper">
        <h2 class="title">
          {{ data.title }}
        </h2>
      </div>
      <div class="description-container">
        <p class="description">
          {{ data.description }}
        </p>

        <BaseButton
          :btn-type="$isExternalLink(data.cta.url) ? 'externalLink' : 'link'"
          :text="data.cta.text"
          :path="data.cta.url"
        />
      </div>
    </template>
  </CardContainer>
</template>

<script>
import {endPoints} from "@/const/api";

export default {
  data() {
    const defaultData = {
      title: this.$t("ACCOUNT_PAGE.SKI_SCHOOL.SLOPE_TICKET.TITLE"),
      description: this.$t("ACCOUNT_PAGE.SKI_SCHOOL.SLOPE_TICKET.DESCRIPTION"),
      cta: {
        text: this.$t("ACCOUNT_PAGE.SKI_SCHOOL.SLOPE_TICKET.CTA_TEXT"),
        link: "/passes-packages/slope",
      }
    };

    return {
      isLoading: true,
      data: {...defaultData},
    };
  },
  mounted() {
    this.getPassportSlopeTicket();
  },
  methods: {
    async getPassportSlopeTicket() {
      try {
        this.isLoading = true;

        const res = await this.$axios.get(endPoints.GET_PASSPORT_SLOPE_TICKET);

        if (res.status === 200 && res.data.Success) {
          const passportSlopeTicket = res.data.Result;
          const cta = passportSlopeTicket.cta || {};

          this.data = {
            title: passportSlopeTicket.title || this.data.title,
            description: passportSlopeTicket.description || this.data.description,
            cta: {
              text: cta.title || this.data.cta.text,
              link: cta.url || this.data.cta.link
            }
          };
        }

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./CompletedTicket.scss";
</style>
