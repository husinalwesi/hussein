<template>
  <div class="package-card">
    <div class="package-card-container">
      <Ribbon :text="packagesData.ribbon || packagesData.sticker_text"/>

      <div class="w-full lg:w-[39%] ltr:pr-0 ltr:pl-0 lg:ltr:pr-[3.75rem] lg:rtl:pl-[3.75rem]">
        <p class="package-title">
          {{ packagesData.title }}
        </p>
        <p class="package-description">
          {{ packagesData.description }}
        </p>
        <template
          v-if="
            packagesData.card_details_identifier &&
              packagesData.details_cta &&
              packagesData.details_cta.title
          "
        >
          <a
            class="what-to-expect cursor-pointer"
            @click="goToViewDetails()"
          >
            {{ packagesData.details_cta.title }}
          </a>
        </template>
      </div>
      <div
        v-if="packagesData.extra_activity"
        class="
          ltr:pl-0
          rtl:pr-0
          lg:ltr:pl-1 lg:rtl:pr-1
          pt-[2.125rem]
          lg:pt-[0.438rem]
          list-ul
          mobiles:w-full
        "
        :class="[
          packagesData.extra_activity.length === 0 || showIncludeOnly
            ? 'w-[61%]'
            : 'lg:w-[34%]',
        ]"
      >
        <p class="min-h-[24px]">
          {{
            packagesData.includes_text
          }}
        </p>
        <ul
          class="pt-1.5 ltr:ml-0 rtl:mr-0 lg:pt-4 lg:ltr:ml-px lg:rtl:mr-px"
          :class="{'grid grid-cols-2 mobiles:block': packagesData.extra_activity.length === 0}"
        >
          <li
            v-for="(iteration, index) in includes"
            :key="index"
            class="py-2 include-item"
            :class="iteration == 'invisible' ? 'invisible' : ''"
          >
            <span class="bg-light-yellow list-icon">
              <Correct class="inline-block -mt-1 lg:-mt-1.5"/>
            </span>
            <span class="list-title rtl:pr-3 lg:rtl:pr-[0.7rem] ltr:pl-3 lg:ltr:pl-[0.7rem]">
              {{ iteration.include_text }}
            </span>
          </li>
        </ul>
      </div>
      <div
        class="
          w-full
          lg:w-[27%]
          pt-[0.438rem]
          ltr:pl-[0.313rem]
          rtl:pr-[0.313rem]
          hidden
          lg:block
          list-ul
        "
      >
        <p class="ltr:font-inter-bold rtl:font-noto-sans-arabic-bold text-white text-xl leading-6 min-h-[24px]">
          {{ packagesData.extra_activity_text }}
        </p>
        <ul class="pt-[0.975rem]">
          <li
            v-for="(iteration, index) in packagesData.extra_activity"
            :key="index"
            class="py-2 flex"
          >
            <span class="bg-white list-icon">
              <Plus class="mx-auto mt-2"/>
            </span>
            <span class="list-title ltr:pl-4 rtl:pr-4">{{
                iteration.include_text ? iteration.include_text : "includes"
              }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="middle-arrow-container">
      <div class="bg-curve"/>
      <div class="dashed-line">
        <div class="middle-arrow"/>
      </div>
      <div class="corneres">
        <CurvePackage class="left-0" :class="cornerColor"/>
        <CurvePackage class="rotate-180 right-0" :class="cornerColor"/>
      </div>
    </div>
    <div class="collapse-content">
      <div class="package-footer">
        <div class="flex w-auto lg:w-[39%] flex-col ltr:-ml-2 rtl:-mr-2">
          <p class="price-container">
            {{ $getPackagePrice(packagesData) }} {{ currency }}
          </p>
          <p class="per-person">
            {{ packagesData.price_per_note ? packagesData.price_per_note : `/ ${$t("COMMON.PERSON")}` }}
          </p>
        </div>
        <div class="buy-ticket-container">
          <a
            v-if="packagesData.external_link"
            :href="packagesData.external_link"
            class="buy-ticket"
          >
            {{
              packagesData.cta
                ? $capitalizeFirstLetter(packagesData.cta.title)
                : $t("COMMON.BUY_TICKETS")
            }}
          </a>
          <button v-else class="buy-ticket" @click="onPackageActionBtnClick()">
            {{
              packagesData.cta
                ? $capitalizeFirstLetter(packagesData.cta.title)
                : $t("COMMON.BUY_TICKETS")
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Correct from "@/components/SVGElements/Correct.vue";
import Plus from "@/components/SVGElements/Plus.vue";
import Ribbon from "@/components/PassesPackages/Ribbon";
import CurvePackage from "@/components/SVGElements/CurvePackage";

export default {
  name: "PackageCard",
  components: {
    Correct,
    Plus,
    Ribbon,
    CurvePackage,
  },
  props: {
    packagesData: {
      type: Object,
      default: () => ({}),
    },
    cornerColor: {
      type: String,
      default: ""
    },
    showIncludeOnly: {
      type: Boolean,
      default: false
    },
    tab: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      currentEnv: "",
      currency: ""
    };
  },
  computed: {
    includes() {
      const totalItemCount = this.currentEnv.indexOf('dubai') !== -1
        ? 5
        : this.packagesData.extra_activity.length > 0
          ? 5
          : 10;
      let tempIncludes = this.packagesData.includes;
      return tempIncludes.slice(0, totalItemCount);
    },
  },
  mounted() {
    this.currentEnv = this.$getSiteCurrentEnvironment();
    this.currency = this.$getSiteConfig("currency");
  },
  methods: {
    onPackageActionBtnClick() {
      if (this.packagesData.cta && this.packagesData.cta.url) {
        this.$router.push(this.localePath(this.packagesData.cta.url));
      } else {
        this.$updateAkAndRoute(this.packagesData.id, 0, "packages", this.packagesData);
      }
    },
    goToViewDetails() {
      let card = this.packagesData;
      if (card) {
        this.$repositories.selectItemEvent(card, Object.assign({}, this.packagesData, {parent_id: this.tab.id}));
      }

      this.$router.push(this.localePath("/" + this.packagesData.card_details_identifier));
    },
  }
};
</script>

<style scoped lang="scss">
@import "./PackageCard.scss";
</style>
