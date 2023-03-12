<template>
  <CardContainer>
    <template #card-content>
      <div class="relative">
        <div v-if="isFullPageLoaderEnabled" class="loader-container">
          <CircleLoader />
        </div>
        <UserAccessBar :is-guest="true" :static-labels="staticLabels" />
        <div class="box-container">
          <div class="title-container">
            <h2 class="title">
              {{ (staticLabels.continue_as_guest || {}).title || $t('BOOKINGFLOW_PAGE.CONTINUE_AS_GUEST') }}
            </h2>
            <h3 class="subtitle">
              {{ (staticLabels.continue_as_guest || {}).subtitle || $t('BOOKINGFLOW_PAGE.ADULT_21_YEARS_AND_OLDER') }}
            </h3>
          </div>

          <GuestForm :guest-data-object="staticLabels.continue_as_guest" />
        </div>
      </div>
    </template>
  </CardContainer>
</template>

<script>
import UserAccessBar from "../UserAccessBar";
import GuestForm from "./GuestForm";

export default {
  components: {
    UserAccessBar,
    GuestForm,
  },
  props: {
    isFullPageLoaderEnabled: {
      type: Boolean,
      default: false
    },
    staticLabels: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>
<style lang="scss">
.loader-container {
  @apply bg-[#ffffffba] w-full h-full absolute z-[11] flex justify-center items-center rounded-3xl;
}
</style>
