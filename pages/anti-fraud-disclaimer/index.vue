<template>
  <main v-if="!isLoading" class="anti-fraud-disclaimer-main">
    <template v-if="isError">
      <ErrorModal :show-error-modal="isError" />
    </template>

    <template v-else-if="data">
      <SectionContentWrapper
        section-wrapper-classes="h-fit min-700:h-[27rem]"
        section-content-classes="flex min-700:py-0 items-center px-4 pb-12 pt-32"
        :is-with-bg-image="true"
      >
        <template #section-content>
          <div class="title-wrapper">
            <h1
              class="title"
              v-html="
                data && data.hero_title
                  ? $splitTextToLines(data.hero_title)
                  : antiFraudData.title
              "
            />
          </div>
        </template>
      </SectionContentWrapper>

      <SectionContentWrapper
        section-wrapper-classes="mobiles:pt-10 py-20"
        section-content-classes="px-4"
      >
        <template #section-content>
          <div class="anti-fraud-disclaimer">
            <div
              class="anti-fraud-disclaimer-description-text"
              v-html="
                data && data.description_highlighted
                  ? data.description_highlighted
                  : antiFraudData.description
              "
            />
          </div>
        </template>
      </SectionContentWrapper>
    </template>
    <template v-else>
      <NoData />
    </template>
  </main>
</template>

<script>
import {endPoints} from "@/const/api";

import ErrorModal from "@/components/Shared/ErrorModal";
import SectionContentWrapper from "@/components/Shared/SectionContentWrapper";
import NoData from "@/components/Shared/NoData";

export default {
  components: {ErrorModal,SectionContentWrapper,NoData},
  data() {
    return {
      isError: false,
      isLoading: false,
      data: null,
      antiFraudData: {
        title: "ANTI-FRAUD DISCLAIMER",
        description: "Majid Al Futtaim would like to draw the attention of its customers and the public to the prevalence of fraudulent activities. We understand that our name, logo, and address may be used in attempts to defraud our customers and the public through false representations. If you feel you have been the victim of a fraud, or suspect fraudulent activity carried out in the name of Majid Al Futtaim, please contact us at http://www.majidalfuttaim.com/contact-us. Below are common fraud schemes and ways to report or verify Majid Al Futtaim authentic communications. Phishing Majid Al Futtaim will never contact you to request your personal information. We will also never send you an email or call you claiming we’ve lost your customer records or asking you to verify your information. If you are concerned about the legitimacy of a communication (call, email or SMS) purporting to be from Majid Al Futtaim, contact us directly at http://www.majidalfuttaim.com/contact-us. Recruiting There are individuals who use Majid Al Futtaim’s name and brands in emails and on websites in an attempt to solicit fees from interested job-seekers. These scams can be called placement fees or immigration processing fees. The recruiting and placement agencies we contract to help us identify candidates for specific employment within Majid Al Futtaim will not charge candidates an up-front fee of any kind.Visit our careers page to learn more about the career opportunities available at Majid Al Futtaim. Imvestment Fraud Fraudulent activity can also take the form of investment schemes that promise recipients financial reward in return for personal, business or confidential information, front end fees, facilitation or advance payments. These scams could carry the Majid Al Futtaim logo and may use e-mail addresses designed to look like legitimate accounts. Money / Wire Transfer Fraud Majid Al Futtaim will never issue a cheque and request a portion of that cheque is returned via wire transfer or cash delivery service. Prize / Promotion Fraud Majid Al Futtaim does run promotions in its assets, however we will never consider you a participant in a promotion such as a contest, sweepstakes, or giveaway without your express consent. In the case that you win a prize in a Majid Al Futtaim promotion, we will never request payment of a fee or charge to deliver that prize. Scams may take a myriad of forms, in addition to those described above. We strongly encourage you to remain alert at all times and exercise caution when sharing your personal information. Majid Al Futtaim is not liable for any loss, claim, damage, liability, or cost of any nature that directly or indirectly result from act of fraudulent schemes. Majid Al Futtaim will not compensate any loss, claim, damage, or cost of any nature that directly or indirectly arise from fraudulent acts or false representations in the name of Majid Al Futtaim or about Majid Al Futtaim. The target person or group of persons shall be solely liable for his/her/their participation in fraudulent acts and strategies using Majid Al Futtaim and consequences arising therefrom.",
      },
    };
  },
  async fetch() {
    try {
      this.isLoading = true;

      const res = await this.$axios.$get(endPoints.GET_ANTI_FRAUD_DISCLAIMER);

      // TODO: show no data msg when there's no data found.
      if (res.Success && res.Result) this.data = res.Result;
      this.isLoading = false;
    } catch (err) {
      this.isError = true;
      this.isLoading = false;
      console.log({ err });
    }
  },
  head() {
    return this.$seoGenerator(this.data, "Anti Fraud Disclaimer");
  },
};
</script>

<style lang="scss" scoped>
@import "./anti-fraud-disclaimer.scss";
</style>
