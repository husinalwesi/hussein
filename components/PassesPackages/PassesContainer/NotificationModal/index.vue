<template>
  <div class="notification-modal-wrapper">
    <BaseModal :show-modal="isModalActive" :show-close-icon="false">
      <template v-if="title" #header>
        <h3 class="notification-modal-header">
          {{ data.title ? data.title : title }}
        </h3>
        <div
          class="notification-modal-subtitle"
          v-html="
            data.subtitle
              ? $splitTextToLines(data.subtitle)
              : $splitTextToLines(subtitle)
          "
        />
      </template>

      <template #content>
        <div class="notification-modal-content">
          <ValidationObserver
            ref="notification-validator"
            v-slot="{ invalid }"
            class="mt-6 min-700:mt-8"
          >
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

            <div class="actions-container">
              <button :disabled="isLoading" class="btn-cancel" @click.prevent="$emit('closeModal')">
                Close
              </button>
              <BaseButton
                btn-type="button"
                text="Keep me posted"
                :b-t-ndisabled="invalid || isLoading"
                :is-loading="isLoading"
                @onBtnClick="validateEmailInput"
              />
            </div>
          </ValidationObserver>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import BaseModal from "@/components/Shared/BaseUI/BaseModal";
import {ValidationObserver} from 'vee-validate';
import BaseInput from "@/components/Shared/BaseUI/FormElements/BaseInput";
import BaseButton from "@/components/Shared/BaseUI/BaseButton";

import {customLayerEndPoints} from "@/const/api";
import {newsletterTypes} from "@/const/enum";

export default {
  components: {
    BaseModal,
    ValidationObserver,
    BaseInput,
    BaseButton
  },
  props: {
    isModalActive: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["closeModal"],
  data() {
    return {
      title: "Ski Competition",
      subtitle:
        "Our Ski Competitions are nearly here. \n Leave your email and be the first to know when everything this amazing event.",
      email: "",
      isLoading: false,
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
          {email: this.email, newsletter_type: newsletterTypes.PASS_ANNOUNCEMENT},
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res && res.status === 200 && res.data && res.data.email) {
          this.$refs["notification-validator"].reset();
          this.$repositories.updatesNewsletterEvent(this.email)
          this.email = "";
          this.$emit("closeModal");
          this.$showToast({
            type: "green",
            text: "Your details have been received, we will contact you shortly. Thank you!",
          });
        } else
          this.$showToast({
            type: "red",
            text: "An error occurred, please try again.",
          });

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$showToast({
          type: "red",
          text: "An error occurred, please try again.",
        });
        console.log({err});
      }
    },
    validateEmailInput() {
      this.$refs["notification-validator"].validate().then((res) => {
        if (res) this.sendEmail();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./NotificationModal.scss";
</style>
