<template>
  <main class="pb-20">
    <SolidBlurBG custom-class="-z-1" :is-bg-image="true" />
    <section class="max-w-1xl mx-auto w-full lg:w-fit add-gear">
      <div class="md:px-10 1xl:px-43 px-4 mobiles:overflow-hidden">
        <div class="flex justify-start mb-2">
          <Breadcrumbs :active-index="breadcrumbs.length-1" :crumbs="breadcrumbs" />
        </div>
        <div class="page-title mb-8">
          {{ $t('GEAR.ADD_GEAR') }}
        </div>
        <Gear ref="addGear" :show-checkbox-container="true" />
      </div>
    </section>
  </main>
</template>

<script>

import Gear from "@/components/Shared/Gear";
import Breadcrumbs from "@/components/Shared/breadcrumbs/breadcrumbs";
import {CommonEvent} from "@/services/app-events";

export default {
  name: "GearPage",
  components: {Gear, Breadcrumbs},
  data() {
    return {
      breadcrumbs: [],
      orderData: []
    }
  },
  mounted() {

    let bottomBarItems = {}
    if (this.$isUserAuthenticated()) {
      let needWaiver = this.$route.query.needWaiver && this.$route.query.needWaiver === "true"
      if (!needWaiver) {
        this.breadcrumbs = [
          {
            title: this.$t('BOOKING_CONFIRMATION.SELECT_GUESTS'),
            path: `/extra/add-guest`,
          },
          {
            title: this.$t('GEAR.ADD_GEAR'),
            path: `/extra/gear`,
          }
        ]
      } else {
        this.breadcrumbs = [
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
        ]
      }

      bottomBarItems = {
        leftItems: [
          {
            title: this.$t('BOOKINGFLOW_PAGE.SKIP_FOR_NOW'),
            action: () => {
              let query = ''
              if (this.$route.query.needWaiver && this.$route.query.needWaiver === "true") {
                query = `?needWaiver=${this.$route.query.needWaiver}`
              }
              this.$router.push(this.localePath(`/extra/confirm/${this.$route.params.id}${query}`))
            },
            customClass: 'text-btn'
          }
        ],
        rightItems: [
          {
            id: "submit-btn",
            title: this.$t('COMMON.SAVE_AND_CONTINUE'),
            action: async () => {
              this.$refs['addGear'].saveAndContinue()
            },
            customClass: 'submit-btn'
          }
        ],
      }
    } else {
      this.breadcrumbs = [
        {
          title: this.$t('GEAR.ADD_GEAR'),
          path: "/extra/gear",
        }
      ]

      bottomBarItems = {
        rightItems: [
          {
            title: this.$t('BOOKINGFLOW_PAGE.CONTINUE'),
            action: () => {
              this.$refs['addGear'].saveAndContinue()
            },
            customClass: 'submit-btn'
          }
        ],
      }
    }
    this.$store.dispatch('bottomBar/setBottomBarData', bottomBarItems)
    CommonEvent.$emit('show-bottom-bar', true)
  }
}
</script>

<style lang="scss" scoped>
.add-gear {
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
</style>
