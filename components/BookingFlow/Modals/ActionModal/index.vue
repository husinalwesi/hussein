<template>
  <div class="action-modal-wrapper">
    <BaseModal :show-modal="isModalActive" :show-close-icon="false">
      <template #header>
        <h1 class="action-modal-header">
          {{ $t('BOOKINGFLOW_PAGE.ENTER_YOUR_CVV_NUMBER') }}
        </h1>
      </template>

      <template #content>
        <div class="action-modal-content">
          <ValidationObserver
            ref="action-validator"
            v-slot="{ invalid }"
            class="flex flex-wrap gap-2 items-start"
          >
            <div class="flex-1 min-550:max-w-[248px]">
              <BaseInput
                v-model="cvv"
                i-n-ptype="cvv"
                i-n-pname="cvv"
                :i-n-pplaceholder="$t('BOOKINGFLOW_PAGE.CVV_NUMBER')"
                :rules="{ min: 3, max: 4, required: true, numeric: true }"
              />
            </div>
            <BaseButton
              text="save"
              :b-t-ndisabled="invalid"
              btn-type="button"
              class-name="py-[16px] px-[23px] ltr:font-inter-bold rtl:font-noto-sans-arabic-bold bg-[#0D4F94] rounded-2xl leading-4 text-center text-white"
              @onBtnClick="saveCVV"
            />
          </ValidationObserver>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script>
export default {
  props: {
    isModalActive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      cvv: "",
    };
  },
  methods: {
    saveCVV() {
      // you can move this to be handled from outside.
      this.$refs["action-validator"].validate().then((res) => {
        if (res) {
          this.$emit("userCVV", this.cvv);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./ActionModal.scss";
</style>
