<template>
  <div>
    <div class="flex flex-wrap gap-x-3">
      <div class="flex-1 min-w-[241px] mobiles:mb-4">
        <div class="mb-2">
          <h4 class="text-[#191919] ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold  text-base">
            {{ $t(`LOCATIONS.${currentEnv}`) }}
          </h4>
        </div>
        <div class="max-w-[241px]">
          <p class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-xs text-[#606060]" v-html="$t(`BOOKING_CONFIRMATION.CONTACT_US.${currentEnv}.LOCATION_DETAILS`)" />
        </div>
      </div>
      <div class="flex-1 min-w-[260px] mobiles:mb-4">
        <div class="mb-2">
          <h4 class="text-[#191919] ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold  text-base">
            {{ $t(`BOOKING_CONFIRMATION.CONTACT_US.${currentEnv}.SUPPORT`) }}
          </h4>
        </div>
        <div class="max-w-[260px]">
          <p class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-xs text-[#606060]">
            {{ $t(`BOOKING_CONFIRMATION.CONTACT_US.${currentEnv}.SUPPORT_DETAILS`) }}
          </p>
        </div>
      </div>
    </div>
    <div class="mt-6 ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-xs text-[#191919] mobiles:mt-8">
      {{ $t('BOOKING_CONFIRMATION.CONTACT_US.READ_INFORMATION_ON') }} &nbsp;<NuxtLink
        :to="localePath('/terms-conditions')"
        class="underline"
      >
        {{ $t('BOOKING_CONFIRMATION.CONTACT_US.ADMISSION_GUIDELINES_AND_CANCELLATION_REFUND_POLICIES') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentEnv: 'SKI_DUBAI'
    };
  },
  created() {
    this.currentEnv = this.$getSiteCurrentEnvironment(true, true);
  },
};
</script>

<style lang="scss" scoped>
</style>
