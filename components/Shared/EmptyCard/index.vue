<template>
  <div class="flex flex-row justify-between gap-x-4 empty-card">
    <div class="card hidden lg:block" />
    <div class="card flex flex-col justify-center items-center text-center">
      <div v-if="data.title || data.card_title" class="title mb-4">
        {{ data.title || data.card_title }}
      </div>
      <div v-if="data.subTitle || data.card_description" class="sub-title">
        {{ data.subTitle || data.card_description }}
      </div>
      <div v-if="data.is_notify" class="w-full mt-6">
        <ValidationObserver
          ref="email-notification"
          v-slot="{ invalid }"
          class="w-full"
        >
          <div class="flex-1 mx-auto mb-6 min-550:max-w-[312px]">
            <BaseInput
              v-model="email"
              i-n-ptype="email"
              i-n-pname="email"
              :i-n-pplaceholder="$t('COMMON.EMAIL_ADDRESS')"
              :rules="{
                required: true,
                max: 254,
                emailRegex: true
              }"
            />
          </div>
          <div class="w-fit mx-auto relative">
            <BaseButton
              btn-type="button"
              :text="data.cta && data.cta.title ? data.cta.title : 'Notify me'"
              :is-loading="isLoading"
              :b-t-ndisabled="invalid || !email || isLoading"
              loader-wrapper-classes="absolute top-0 ltr:left-0 rtl:right-0"
              loader-classes="w-14 h-14"
              @onBtnClick="validateEmailInput"
            />
          </div>
        </ValidationObserver>
      </div>
      <div
        v-if="data.cta && data.cta.url && !data.is_notify"
        class="cta mt-6"
      >
        <BaseButton
          :cta="data.cta"
          :btn-type="$isExternalLink(data.cta.url) ? 'externalLink' : 'link'"
          :text="data.cta.title"
          :path="data.cta.url"
          class-name="cta-link"
        />
      </div>
    </div>
    <div class="card hidden lg:block" />
  </div>
</template>

<script>
import {ValidationObserver} from 'vee-validate';
import BaseInput from "@/components/Shared/BaseUI/FormElements/BaseInput";
import BaseButton from "@/components/Shared/BaseUI/BaseButton";

import {customLayerEndPoints} from "@/const/api";
import {newsletterTypes} from "@/const/enum";

export default {
  name: "EmptyCard",
  components:{
    ValidationObserver,
    BaseInput,
    BaseButton
  },
  props: {
    data: {
      type: Object,
      default: () => ({
        title: "There are no lessons for this level",
        subTitle:
          "Results that these are advance lessons and they are not offer for below 6 yrs old",
      }),
    },
  },
  data() {
    return {
      isLoading: false,
      email: "",
    };
  },
  methods: {
    async sendEmail() {
      try {
        this.isLoading = true;

        const res = await this.$axios.post(
          // eslint-disable-next-line no-undef
          process.env.SHARED_ENVS.APIGEE_BASE_URL +
            customLayerEndPoints.JOIN_NEWS_LETTER,
          {
            email: this.email,
            newsletter_type: newsletterTypes.PASS_ANNOUNCEMENT,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res && res.status === 200 && res.data && res.data.email) {
          this.$refs["email-notification"].reset();
          this.$repositories.updatesNewsletterEvent(this.email)
          this.email = "";
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
    },
  },
};
</script>

<style scoped lang="scss">
.empty-card {
  .card {
    width: 352px;
    height: 520px;
    border: 1px dashed rgba(10, 20, 50, 0.2);
    border-radius: 24px;
    color: #1a1a1a;
    padding: 30px;

    @screen mobiles {
      height: 520px;
      width: 100%;
    }
    @screen tablet {
      height: 520px;
      width: 100%;
    }
    .title {
      @apply ltr:font-inter-bold rtl:font-noto-sans-arabic-bold;
      font-size: 22px;
      @screen mobiles {
        font-size: 22px;
      }

      @screen tablet {
        font-size: 22px;
      }
    }

    .sub-title {
      @apply ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler;
      font-size: 14px;
      color: #606060;
    }

    .cta {
      border-right: 16px;

      button {
        height: 48px;
      }
    }
  }
}
</style>
