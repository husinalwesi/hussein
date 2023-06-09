<template>
  <main v-if="!isLoading" class="privacy-policy-main">
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
            <h1 class="title">
              {{ data.hero_title ? data.hero_title : privacyPolicyData.title }}
            </h1>
          </div>
        </template>
      </SectionContentWrapper>

      <SectionContentWrapper
        :section-wrapper-classes="'mobiles:pt-10 py-20'"
        :section-content-classes="'px-4'"
      >
        <template #section-content>
          <div class="privacy-policy">
            <div class="privacy-policy-description-text" v-html="data.description_highlighted ? data.description_highlighted : privacyPolicyData.privacyPolisy" />
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
import ErrorModal from "@/components/Shared/ErrorModal";
import SectionContentWrapper from "@/components/Shared/SectionContentWrapper";
import NoData from "@/components/Shared/NoData";

import {endPoints} from "@/const/api";

export default {
  components: {
    ErrorModal,
    SectionContentWrapper,
    NoData
  },
  data() {
    return {
      isLoading: true,
      isError: false,
      data: null,
      privacyPolicyData: {
        title: "Privacy Policy",
        privacyPolisy:
          "Privacy Policy Majid Al Futtaim Holding is a limited liability company incorporated in the Emirate of Dubai, United Arab Emirates. Majid Al Futtaim Holding operates through various subsidiaries including Majid Al Futtaim Retail, Majid Al Futtaim Properties, and " +
          "            Majid Al Futtaim Ventures (“Majid Al Futtaim”, “we”, “us”, “our”). This policy describes how Majid Al Futtaim collects, processes use " +
          "            and disclose your personal information as a data controller when you contact us, use our services or interact with our platforms " +
          '            including websites and mobile apps (together "Platforms"). What this ' +
          "            policy covers We are committed to adopting the highest standards when it comes to how we collect, use and protect your personal " +
          "            information, and have accordingly developed this privacy policy (the “Policy”), which: Sets out the types of personal information we " +
          "            collect; Explains how and why we collect and use your personal " +
          "            information; Explains when and why we may share personal information " +
          "            within Majid Al Futtaim and with other organizations; Explains how " +
          "            we protect the personal information we collect; and Explains the " +
          "            rights and choices you have in relation to your personal " +
          "            information. This Policy applies if you use our services (referred " +
          "            to in this Policy as “our Services”). Using our Services means: " +
          "            Buying / Ordering services or products from any of our subsidiaries " +
          "            over the phone, in-store, or online Using any of our platforms, " +
          "            including websites (“our Websites”), public Wi-Fi networks, or " +
          "            mobile applications (“our Mobile Apps”); or Being a member of any of " +
          "            our loyalty schemes (e.g. Play Points) Taking part in our promotions " +
          "            & competitions and registering to receive our newsletters and offers " +
          "            Personal information we collect When you shop with us online, browse " +
          "            our Websites, use our Mobile Apps, or connect to Wi-Fi networks we " +
          "            provide, we may collect: Your personal details, including your " +
          "            postal and billing addresses, email address(es), phone number(s), " +
          "            date of birth, gender, and passport or ID number Your account login " +
          "            details, such as your username and the password (encrypted) that you " +
          "            have chosen; and Your interests, preferences, income, and other " +
          "            profiling information. When you shop with us online, browse our " +
          "            Websites, use our Mobile Apps, or connect to Wi-Fi networks we " +
          "            provide, we may collect: Information about your online purchases " +
          "            (for example: what, when, where you ordered / bought and how you " +
          "            paid); Information about your online browsing behaviour on our " +
          "            Websites, Mobile Apps and public networks and information about when " +
          "            you click on one of our adverts (including those shown on other " +
          "            organisations’ websites); Information about devices you have used to " +
          "            access our Services (including the make, model and operating system, " +
          "            IP address, browser type and mobile device identifiers); and " +
          "            Information about your precise geolocation. When you use any of our " +
          "            loyalty program(s) to shop with us, we may collect: Transaction " +
          "            information, including the in-store and online purchases you earn " +
          "            points for and how you use your points, coupons, and vouchers within " +
          "            our subsidiaries or with other partners. When you contact us or we " +
          "            contact you or you take part in promotions, competitions, surveys or " +
          "            questionnaires about our Services, we may collect: Personal " +
          "            information you provide about yourself; Details of emails and other " +
          "            digital communications we send to you including information about " +
          "            the emails you open and links in them that you click on; and Your " +
          "            feedback and contributions to customer surveys and questionnaires. " +
          "            Other sources of personal information We may also use personal " +
          "            information from other sources, such as specialist companies that " +
          "            supply information, online media channels, our partners and public " +
          "            registers. We may collect the following types of personal " +
          "            information about you from other sources: contact details, credit " +
          "            history, purchases, interests, preferences, or other types of " +
          "            publicly available information. This other personal information " +
          "            helps us to: review and improve the accuracy of the data we hold; " +
          "            and improve and measure the effectiveness of our marketing " +
          "            communications, including online advertising. We may be required by " +
          "            law to collect personal information about you or as a consequence of " +
          "            any contractual relationship we have with you. If you choose not to " +
          "            provide your personal information to be used in accordance with this " +
          "            Policy, you will still be able to visit our Platforms but you may " +
          "            not be able to access certain options, products or services, and in " +
          "            some cases we may not be able to fulfil a service you request. " +
          "            Personal information we collect Make our Services available to you " +
          "            We use your personal information to provide the services you have " +
          "            requested, including: Processing your orders and refunds; and " +
          "            Managing the accounts you hold with us. This is so we can provide " +
          "            the services to you in line with our contractual obligations to you. " +
          "            Personalise your experience We may use your personal information to " +
          "            personalize the marketing messages we send to you and to make them " +
          "            more relevant and interesting, as this is in our legitimate business " +
          "            interests. Where necessary we will obtain your consent first. We may " +
          "            use your personal information for this purpose in the following " +
          "            ways: Using your online browsing behavior as well as your in-store " +
          "            and online purchases to help us better understand you as a customer " +
          "            and provide you with personalized offers and services; Providing you " +
          "            with relevant marketing communications (including by email, post, " +
          "            telephone, SMS, or online advertising), relating to products and " +
          "            services we offer, and those of our suppliers and partners. As part " +
          "            of this, online advertising may be displayed on Our Websites and on " +
          "            other organizations’ websites and online media channels. We may also " +
          "            measure the effectiveness of our marketing communications and those " +
          "            of our suppliers and partners; To help us to better understand you " +
          "            and provide you with services and marketing communications, that are " +
          "            relevant to your interests, we combine personal information we " +
          "            collect when you make purchases in-store with personal information " +
          "            collected from our Websites, Mobile Apps and other sources including " +
          "            the different subsidiaries under Majid Al Futtaim. Contact and " +
          "            interact with you We may use your personal information when we " +
          "            communicate with you, in order to: Contact you about our Services, " +
          "            for example by phone, email or post or by responding to social media " +
          "            posts that you have directed at us; Manage promotions and " +
          "            competitions you take part in, including those we run with our " +
          "            suppliers and partners; Invite you to take part in and manage " +
          "            customer surveys, questionnaires, and other market research " +
          "            activities carried out by Majid Al Futtaim, and by other " +
          "            organizations on our behalf It is in our legitimate business " +
          "            interests that we are able to provide you with appropriate responses " +
          "            and provide you with notice about our services. Manage and improve " +
          "            our day-to-day operations We analyze information about how you use " +
          "            our services to: Manage and improve our Websites and Mobile Apps; " +
          "            Help to develop and improve our product range, services, stores, " +
          "            information technology systems, know-how and the way we communicate " +
          "            with you; Detect and prevent fraud or other crime. It is in our " +
          "            legitimate business interests to use the information provided to us " +
          "            for this purpose, so we can understand any issues with our services " +
          "            to improve it. Sharing Personal information We may share your " +
          "            personal information with third parties under the following " +
          "            circumstances: Majid Al Futtaim Subsidiaries We may share the " +
          "            personal information collected by any of our subsidiaries with our " +
          "            other subsidiaries for the purposes listed above. Retail Partners We " +
          "            may share your personal information with other companies that sell " +
          '            products through our Services ("Retail Partners"). We only share ' +
          "            personal information that enables our Retail Partners to provide " +
          "            their services. For example, when you shop online or in-store we " +
          "            will give the relevant Retail Partner your name, contact details, " +
          "            and address so that they can deliver your items. Sharing personal " +
          "            information with other organisations We may share personal " +
          "            information with other organizations in the following circumstances: " +
          "            if any applicable law or a public authority says we must share the " +
          "            personal information; if we need to share personal information in " +
          "            order to establish, exercise or defend our legal rights (this " +
          "            includes providing personal information to others for the purposes " +
          "            of preventing fraud and reducing credit risk); to an organization we " +
          "            sell or transfer (or enter into negotiations to sell or transfer) " +
          "            any of our businesses or any of our rights or obligations under any " +
          "            agreement we may have with you too. If the transfer or sale goes " +
          "            ahead, the organization receiving your personal information can use " +
          "            your personal information in the same way as us to any other " +
          "            successors in title to our business; or to anyone to whom we " +
          "            transfer or may transfer our rights and duties under our agreement " +
          "            with you. Transfer your personal information Your personal " +
          "            information may be transferred to, stored, and processed in a " +
          "            country that is not regarded as ensuring an adequate level of " +
          "            protection for personal information under European Union law or " +
          "            under the laws of your country of residence or our country of " +
          "            incorporation. We have put in place appropriate safeguards (such as " +
          "            contractual commitments) in accordance with applicable legal " +
          "            requirements to ensure that your data is adequately protected. In " +
          "            the event your personal information is transferred to a foreign " +
          "            jurisdiction, it may be subject to the laws of that jurisdiction and " +
          "            we may be required to disclose it to the courts, law enforcement or " +
          "            governmental authorities in those jurisdictions but we will only do " +
          "            so where required by applicable laws. How we protect personal " +
          "            information We maintain physical, technical, and organizational " +
          "            safeguards to secure your personal information from unauthorized " +
          "            access, use, alteration, and destruction. However, no internet-based " +
          "            site can be 100% secure and we cannot be held responsible for " +
          "            unauthorized or unintended access that is beyond our control. Social " +
          "            Media We operate channels, pages, and accounts on some social media " +
          "            sites to inform, assist and engage with customers. We monitor and " +
          "            record comments and posts made on these channels about us so that we " +
          "            can improve our services. Majid Al Futtaim is not responsible for " +
          "            any information posted on those sites other than information we have " +
          "            posted ourselves. We do not endorse the social media sites " +
          "            themselves or any information posted on them by third parties. " +
          "            Retention We keep records for as long as required to a) manage " +
          "            purchases, bookings, memberships and provide the other relevant " +
          "            products or services anticipated by this Privacy Policy, including " +
          "            keeping you up-to-date with our marketing b) personalise the " +
          "            products, services and communications with you c) comply with the " +
          "            applicable record retention legal requirements. When deciding how " +
          "            long to keep your personal information after our relationship with " +
          "            you has ended, we take into account our legal obligations and " +
          "            regulators expectations. If you wish to request that we no longer  use your information to provide you services, contact us at " +
          "            Analytics Office, Majid Al Futtaim Management Services, P.O. Box " +
          "            91100, Dubai, United Arab Emirates. You can also email us at " +
          "            privacy@maf.ae. However, we will retain and use your registration " +
          "            information as necessary to comply with our legal obligations, " +
          "            resolve disputes, and enforce our agreements. Communications All " +
          "            marketing communications we send to you will provide you with a way " +
          "            to withdraw your consent to future marketing. If you no longer wish " +
          "            to receive promotional materials you may opt-out from receiving " +
          "            these communications or change your account settings, this will " +
          "            remove you from marketing lists. Please note that if you unsubscribe " +
          "            from marketing communications you will still receive operational and " +
          "            service messages from us regarding the services or products you " +
          "            bought from us and responses to enquiries made to us, and that we " +
          "            may hold your details on a suppression list so we dont send you " +
          "            marketing communications in the future. Cookies and similar " +
          "            technologies We use cookies and similar technologies, such as tags " +
          "            and pixels (“Cookies”), to personalize and improve your customer " +
          "            experience as you use our Websites and Mobile Apps and to provide " +
          "            you with relevant online advertising. Cookies are small data files " +
          "            that allow a website or Mobile App to collect and store a range of " +
          "            data on your desktop computer, laptop or mobile device. Cookies help " +
          "            us to provide important features and functionality on our Websites " +
          "            and Mobile Apps, and we use them to improve your customer " +
          "            experience. For example, we use Cookies to do the following: Improve " +
          "            the way our Websites and Mobile Apps work Cookies allow us to " +
          "            improve the way our Websites and Mobile Apps work so that we can " +
          "            personalize your experience and allow you to use many of their " +
          "            useful features. For example, we use Cookies so we can remember your " +
          "            preferences and the contents of your shopping basket when you return " +
          "            to our Websites and Mobile Apps. Improve the performance of our " +
          "            Websites and Mobile Apps Cookies can help us to understand how our " +
          "            Websites and Mobile Apps are being used, for example, by telling us " +
          "            if you get an error messages as you browse. These Cookies collect " +
          "            data that is mostly aggregated and anonymous. Deliver relevant " +
          "            online advertising We use Cookies to help us deliver online " +
          "            advertising that we believe is most relevant to you on our Websites " +
          "            and other organizations’ websites. Cookies used for this purpose are " +
          "            often placed on our Websites by other organizations, and always with " +
          "            our permission. These Cookies may collect information about your " +
          "            online behavior, such as your IP address, the website you arrived " +
          "            from and information about your purchase history or the content of " +
          "            your shopping basket. This means that you may see our adverts on our " +
          "            Websites and on other organizations’ websites. You may also see " +
          "            adverts for other organizations on our Websites. To help us to " +
          "            deliver online advertising that is relevant to you, we may also " +
          "            combine data we collect through Cookies in the browser of your " +
          "            desktop computer or other devices with other data that we have " +
          "            collected (e.g. Loyalty program). Measuring the effectiveness of our " +
          "            marketing communications, including online advertising Cookies can " +
          "            tell us if you have seen a specific advert, and how long it has been " +
          "            since you have seen it. This information allows us to measure the " +
          "            effectiveness of our online advertising campaigns and control the " +
          "            number of times you are shown an advert. We also use Cookies to " +
          "            measure the effectiveness of our marketing communications, for " +
          "            example by telling us if you have opened a marketing email that we " +
          "            have sent you. Your choices when it comes to Cookies You can use " +
          "            your browser settings to accept or reject new Cookies and to delete " +
          "            existing Cookies. You can also set your browser to notify you each " +
          "            time new Cookies are placed on your computer or other device. If you " +
          "            choose to disable some or all Cookies, you may not be able to make " +
          "            full use of our platforms. For example, you may not be able to add " +
          "            items to your shopping basket, proceed to checkout, or use some of " +
          "            our products and services that require you to sign in. Once you have " +
          "            given us your consent to the use of cookies, we shall store cookies " +
          "            on your computer or device. If you wish to withdraw your consent at " +
          "            any time, you will need to delete our cookies using your internet " +
          "            browser settings. Aggregate data, data analytics and social media " +
          "            funcionality We may aggregate personal information and remove any " +
          "            identifying elements in order to analyse patterns and improve our " +
          "            marketing and promotional efforts, to analyse Platform use, to " +
          "            improve our content and product offerings, and to customize our " +
          "            Platforms’ content, layout, products and services, and we may " +
          "            appoint third parties to do this on our behalf, as set out above. We " +
          "            gather certain usage information like the number and frequency of " +
          "            visitors to our Platforms. This information may include which " +
          "            webpage you just came from, which webpage you next go to, what " +
          "            browser you are using, your device and your IP address. We only use " +
          "            such data in the aggregate. This collective data helps us to " +
          "            determine how much our customers use parts of our Platforms, and do " +
          "            research on our users’ demographics, interests, and behaviour to " +
          "            better understand and serve you. If you use buttons on our Platforms " +
          '            linked to social media or similar sites (for example "Like" and/or ' +
          '            "Share" buttons), content from our Platforms may be sent back to ' +
          "            that other website or service and, depending on your privacy " +
          "            settings, may be privately or publicly visible (for example to " +
          "            friends, followers, or generally to anyone who has access to your " +
          "            profile page). Your rights You have the right to see or access the " +
          "            personal information we hold about you. To receive a copy, please " +
          "            write to the Analytics Office, Majid Al Futtaim Management Services, " +
          "            P.O. Box 91100, Dubai, United Arab Emirates. You can also email us " +
          "            at privacy@maf.ae. In addition, you have certain rights regarding " +
          "            your personal information, subject to local law. These include the " +
          "            following rights to: Rectify the information we hold about you; " +
          "            Erase your personal information; Restrict our use of your personal " +
          "            information; Object to our use of your personal information; " +
          "            Withdraw any consents you have provided for our use of your personal " +
          "            information; Receive your personal information in a usable " +
          "            electronic format and transmit it to a third party (right to data " +
          "            portability); and Lodge a complaint with your local data protection " +
          "            authority. If you would like to discuss or exercise such rights, " +
          "            please contact us at the details below. If you are concerned that " +
          "            any of the information we hold about you is incorrect, or out of " +
          "            date, please write to the address above to report your concerns and " +
          "            we will take appropriate steps to amend our records. Please note " +
          "            that we will likely require additional information from you in order " +
          "            to honor your requests Privacy Concerns If you have any concerns " +
          "            about our compliance with applicable privacy laws or this Privacy " +
          "            Policy please write to the Corporate Compliance Office, Majid Al " +
          "            Futtaim Management Services, P.O. Box 91100, Abu Dhabi, United Arab " +
          "            Emirates or email us at privacy@maf.ae. We will endeavour to respond " +
          "            to your concerns as soon as possibl Notification of changes to this " +
          "            privacy policy We update this Privacy Policy when needed and place " +
          "            updates on our platforms. If we are going to use your personal " +
          "            information in a manner different from that stated at the time of " +
          "            collection, we will notify you. All changes will become effective " +
          "            when posted unless indicated otherwise. Please review this Privacy " +
          "            Policy periodically for changes. Links Our Websites or Mobile Apps " +
          "            may contain links to other websites operated by other organizations " +
          "            that have their own privacy policies. Please make sure you read the " +
          "            terms and conditions and privacy policy carefully before providing " +
          "            any personal information on a website as we do not accept any " +
          "            responsibility or liability for websites of other organizations. " +
          "            Children Our platforms are not directed towards children. If you are " +
          "            providing personal information for an individual less than 13 years " +
          "            of age, you are providing us your affirmative parental consent as " +
          "            the legal parent or guardian to collect, use and process the " +
          "            information of the individual less than 13 years of age, consistent " +
          "            with this Privacy Policy.",
      },
    };
  },
  async fetch() {
    try {
        const res = await this.$axios.$get(endPoints.GET_TERMS_CONDITIONS_AND_PRIVACY_POLICY);

        if (res.Success && res.Result) {
          this.data = res.Result.privacy_policy;
        }
        this.isLoading = false;
      } catch (err) {
        this.isError = true;
        this.isLoading = false;
        console.log({ err });
      }
  },
  head() {
    return this.$seoGenerator(this.data, "Privacy Policy");
  },
};
</script>

<style lang="scss" scoped>
.privacy-policy-main {
  .title-wrapper {
    @apply w-full max-w-[872px];

    .title {
      @apply w-full min-900:text-6xl text-white uppercase ltr:font-druk-wide-heavy-italic rtl:font-adapter leading-8 min-320:text-[32px] min-700:text-5xl text-3xl;
    }
  }

  .privacy-policy {
    @apply w-full h-fit;

    .privacy-policy-description-text {
      @apply ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-dark-gray;

      &::v-deep {
        ul {
          @apply ltr:pl-6 rtl:pr-6 list-disc;
        }
        ol {
          @apply ltr:pl-6 rtl:pr-6 list-decimal;
        }
      }
    }
  }

  &::v-deep {
    h1 {
      @apply text-2xl rtl:leading-[unset];
    }

    strong {
      @apply ltr:font-inter-bold rtl:font-noto-sans-arabic-bold;
    }
  }
}
</style>
