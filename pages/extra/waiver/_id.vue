<template>
  <main class="pb-20">
    <SolidBlurBG custom-class="-z-1" :is-bg-image="true" />
    <section class="max-w-1xl mx-auto add-wavier w-full lg:w-fit">
      <div class="md:px-10 1xl:px-43 px-4 mobiles:overflow-hidden">
        <div class="flex justify-start mb-2">
          <Breadcrumbs :active-index="1" :crumbs="breadcrumbs" />
        </div>
        <div class="page-title mb-8">
          {{ $t('WAIVER.TITLE') }}
        </div>
        <Waiver ref="addWaiver" />
      </div>
    </section>
  </main>
</template>

<script>
import Waiver from "@/components/Shared/waiver";
import Breadcrumbs from "@/components/Shared/breadcrumbs/breadcrumbs";
import {CommonEvent} from "@/services/app-events";

export default {
  name: "WavierPage",
  components: {Waiver, Breadcrumbs},
  data() {
    return {
      breadcrumbs: [
        {
          title: this.$t('BOOKING_CONFIRMATION.SELECT_GUESTS'),
          path: `/extra/add-guest`,
        },
        {
          title: this.$t('BOOKING_CONFIRMATION.SIGN_WAIVER'),
          path: `/extra/waiver`,
        },
        {
          title: this.$t('GEAR.ADD_GEAR'),
          path: `/extra/gear`,
        }
      ],
      orderData: {},
      users: []
    }
  },
  mounted() {
    let bottomBarItems = {
      leftItems: [
        {
          title: this.$t('BOOKINGFLOW_PAGE.SKIP_FOR_NOW'),
          action: () => {
            if (this.$route.query.isMembership && this.$route.query.isMembership.toString() === "true" && !this.$route.query.isOnlyMembership) {
              this.$router.push(this.localePath(`/`))
            } else {
              let query = ''
              if (this.$route.query.needWaiver && this.$route.query.needWaiver === "true") {
                query = `&needWaiver=${this.$route.query.needWaiver}`
              }
              this.$router.push(this.localePath(`/extra/gear/${this.$route.params.id}?isMembership=${this.$route.query.isMembership}${query}`))
            }
          },
          customClass: 'text-btn'
        }
      ],
      rightItems: [
        {
          id: "submit-btn",
          title: this.$t('COMMON.SAVE_AND_CONTINUE'),
          action: async () => {
            this.$refs['addWaiver'].saveAndContinue()
          },
          disabled: true,
          customClass: 'submit-btn'
        }
      ],
    }

    if (this.$route.query.isMembership && !this.$route.query.isOnlyMembership && this.$route.query.isMembership.toString() === "true") {
      this.breadcrumbs = [
        {
          title: this.$t('BOOKING_CONFIRMATION.SIGN_WAIVER'),
          path: `/extra/waiver`,
        },
      ]
    }
    this.$store.dispatch('bottomBar/setBottomBarData', bottomBarItems)
    CommonEvent.$emit('show-bottom-bar', true)
  },
}
</script>
<style lang="scss">
.add-wavier {
  margin-top: -154px;
  color: #1A1A1A;

  .page-title {
    @apply ltr:font-druk-wide-heavy-italic rtl:font-adapter text-white uppercase;

    font-size: 32px;

    @screen mobiles {
      font-size: 22px;
    }
  }
}

footer {
  z-index: 1 !important;
}

.guest-drop-down {
  z-index: 15 !important;;
}
</style>
