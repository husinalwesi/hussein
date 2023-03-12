<template>
  <div
    class="moments-card-container"
    :class="[{ 'without-form': !showEmail }, data.bgColor]"
  >
    <div class="card-image-wrapper">
      <img
        :src="data.image && data.image.image_url ? data.image.image_url : defaultData.image.image_url"
        :alt="data.image && data.image.alt_text ? data.image.alt_text : defaultData.image.alt_text"
        :title="data.image && data.image.title ? data.image.title : defaultData.image.title"
        width="104"
        height="104"
        class="card-image"
      >
    </div>

    <div class="card-header-container">
      <h3 class="card-title">
        {{ data.title || defaultData.title }}
      </h3>
      <div class="description-wrapper">
        <p class="description">
          {{ data.description || defaultData.description }}
        </p>
      </div>
    </div>

    <div v-if="showEmail" class="mt-12">
      <div v-if="data.notify_text" class="text-center mx-auto mb-2">
        <h4 class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold  text-xs leading-6 text-[#606060]">
          {{ data.notify_text }}
        </h4>
      </div>

      <ValidationObserver ref="email-notification" v-slot="{ invalid }">
        <BaseInput
          v-model="email"
          i-n-ptype="email"
          i-n-pname="email"
          :i-n-pplaceholder="$t('COMMON.EMAIL_ADDRESS')"
          :rules="{
            required: true,
            max: 254,
            emailRegex: true,
          }"
        />

        <div class="base-btn-wrapper">
          <BaseButton
            btn-type="button"
            :text="data.cta && data.cta.title ? data.cta.title : $t('COMMON.NOTIFY_ME')"
            :is-loading="isLoading"
            :b-t-ndisabled="invalid || !email || isLoading"
            loader-wrapper-classes="absolute top-0 ltr:left-0 rtl:right-0"
            loader-classes="w-14 h-14"
            @onBtnClick="validateEmailInput"
          />
        </div>
      </ValidationObserver>
    </div>

    <div v-else-if="data.cta && data.cta.title" class="flex justify-center">
      <BaseButton
        :cta="data.cta"
        :btn-type="$isExternalLink(data.cta.url) ? 'externalLink' : 'link'"
        :text="data.cta.title"
        :path="data.cta.url"
        class-name="cta-link"
      />
    </div>
  </div>
</template>

<script>
import {ValidationObserver} from 'vee-validate';

import BaseInput from "@/components/Shared/BaseUI/FormElements/BaseInput";
import BaseButton from "@/components/Shared/BaseUI/BaseButton";

import {customLayerEndPoints} from "@/const/api";
import {newsletterTypes} from "@/const/enum";

/* eslint-disable no-undef */

export default {
  name: "MomentsCard",
  components:{
    ValidationObserver,
    BaseInput,
    BaseButton
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    showEmail: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      isLoading: false,
      defaultData: {
        image: {
          image_url: require("assets/images/Passes/moments.webp"),
          alt_text: "moments",
          title: "moments",
        },
        title: "More great moments",
        description: "Looking for even more things to do? Click here to discover your next amazing memory at Ski Dubai!",
      },

      email: ""
    };
  },
  methods: {
    async sendEmail() {
      try {
        this.isLoading = true;

        const res = await this.$axios.post(
          process.env.SHARED_ENVS.APIGEE_BASE_URL +
            customLayerEndPoints.JOIN_NEWS_LETTER,
          {email: this.email,newsletter_type: newsletterTypes.PASS_ANNOUNCEMENT},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res && res.status === 200 && res.data && res.data.email) {
          this.$refs["email-notification"].reset();
          this.$repositories.updatesNewsletterEvent(this.email)
          this.email = '';
          this.$showToast({
            type: "green",
            text: "Your details have been received, we will contact you shortly. Thank you!",
          });
        } else
          this.$showToast({
            type: "red",
            text: "An error occurred while sending the email, please try again.",
          });

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$showToast({
          type: "red",
          text: "An error occurred while sending the email, please try again",
        });
        console.log({ err });
      }
    },
    validateEmailInput() {
      this.$refs["email-notification"].validate().then((res) => {
        if (res) this.sendEmail();
      });
    }
  },
};
</script>

<style scoped lang="scss">
@import "./MomentsCard.scss";
</style>
