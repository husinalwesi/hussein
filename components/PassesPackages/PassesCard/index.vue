<template>
  <div
    class="passes-card group"
    :class="{disabled: disabled}"
    @mouseenter="animateCard($event)"
    @mouseleave="animateCard($event, false)"
  >
    <div class="passes-card-content-container">
      <div
        v-if="passesData.img || (passesData.image || {}).image_url"
        class="w-full h-full passes-img"
        :style="{
          backgroundImage: `url('${passesData.img || passesData.image.image_url}')`
        }"
      />
      <template v-if="passesData.sticker_text && !disabled">
        <Ribbon :text="passesData.sticker_text"/>
      </template>

      <div class="backdrop-shadow">
        <div class="backdrop-shadow-default"/>
        <div class="backdrop-shadow-hover"/>
      </div>

      <div class="passes-card-content">
        <div
          class="card-header-container"
          :class="{
            'with-includes-list':
              passesData.includes && passesData.includes.length,
          }"
          :style="!$globalData.isDesktopDevice ? {transform: `translateY(-${numOfIncludesPoints * 2.52}rem)`} : {}"
        >
          <!--TODO: unified the process of showing the label based on the passes data without checking the badge label thing. -->
          <div
            v-if="
              (showBadge && badgeLabel && badgeLabel.length) ||
                passesData.label_text
            "
            :id="passesData.id + '-badge'"
            class="badge"
          >
            {{ badgeLabel || passesData.label_text }}
          </div>

          <div
            class="passes-title"
            v-html="$splitTextToLines(passesData[titleKey])"
          />
        </div>

        <ul
          v-if="passesData.includes && passesData.includes.length"
          class="passes-includes-list"
          :class="{
            'with-details-cta':
              passesData.card_details_identifier &&
              passesData.details_cta &&
              passesData.details_cta.title,
          }"
        >
          <li
            v-for="(item, itemIndex) in passesData.includes.slice(0, 3)"
            :key="itemIndex"
            class="passes-include-item"
          >
            <span
              class="checkmark-wrapper"
              :class="item.closeIcon ? 'bg-white' : 'bg-light-yellow'"
            >
              <XCircleIcon v-if="item.closeIcon" class="inline-block -mt-1.5"/>
              <Correct v-else class="inline-block -mt-1.5"/>
            </span>

            {{ item.include_text ? item.include_text : item }}
          </li>
        </ul>

        <div
          v-else-if="passesData.description"
          class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold text-white text-base normal-case mt-4"
          v-html="$splitTextToLines(passesData.description)"
        />

        <template
          v-if="
            passesData.card_details_identifier &&
              passesData.details_cta &&
              passesData.details_cta.title
          "
        >
          <!--TODO: add the pass title in the url and route to the dedicated URL and get the data in the _productName page.-->
          <a
            class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold lg:hover:cursor-pointer mt-4 text-base text-white w-fit"
            @click="goToViewDetails()"
          >
            {{ passesData.details_cta.title }}
          </a>
        </template>

        <div class="flex flex-row rtl:flex-row-reverse flex-wrap gap-2 mt-6">
          <span v-if="showPrice" class="passes-price">
            {{ $getPackagePrice(passesData) }} {{ currency }}
          </span>
          <!--TODO: change this to be as one var(always from the pass data). -->
          <a
            v-if="passesData.external_link"
            :href="passesData.external_link"
            target="_blank"
            :class="buttonClass"
          >
            {{
              $capitalizeFirstLetter(
                (passesData.cta && passesData.cta.title) ||
                ctaLabel ||
                "Buy tickets"
              )
            }}
          </a>
          <button
            v-else
            :disabled="disabled"
            :class="buttonClass"
            @click.prevent="onPassActionBtnClick"
          >
            {{
              $capitalizeFirstLetter(
                !isNotificationAction
                  ? (passesData.cta || {}).title ||
                  ctaLabel ||
                  $t("COMMON.BUY_TICKETS")
                  : (passesData.cta || {}).title || $t("COMMON.NOTIFY_ME")
              )
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Correct from "@/components/SVGElements/Correct.vue";
import Ribbon from "@/components/PassesPackages/Ribbon";
import gsap from "gsap";
import XCircleIcon from "@/components/SVGElements/x-circle-icon";

export default {
  name: "PassesCard",
  components: {
    XCircleIcon,
    Correct,
    Ribbon,
  },
  props: {
    passesData: {
      type: Object,
      default: () => ({})
    },
    minSize: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showBadge: {
      type: Boolean,
      default: false
    },
    showPrice: {
      type: Boolean,
      default: true
    },
    badgeLabel: {
      type: String,
      default: () => ""
    },
    ctaLabel: {
      type: String,
      default: () => null
    },
    buttonClass: {
      type: String,
      default: "passes-btn"
    },
    titleKey: {
      type: String,
      default: "title"
    },
    cardType: {
      type: String,
      default: "passes"
    },
    tab: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["openNotificationModal"],
  data() {
    return {
      isNotificationAction: false,
      currency: "",
      numOfIncludesPoints: 0
    };
  },
  mounted() {
    this.currency = this.$getSiteConfig("currency");
    this.isNotificationAction = this.passesData.data
      ? this.passesData.data.is_coming_soon
      : this.passesData.is_coming_soon;

    const includesLength = (this.passesData.includes || []).length;
    this.numOfIncludesPoints = includesLength > 3 ? 3 : includesLength;
  },
  methods: {
    animateCard(event, direction = true) {
      if (
        (this.minSize && window.innerWidth < this.minSize) ||
        !this.$detectDesktop()
      )
        return false;

      const passCard = event.target;

      const cardHeader = passCard.querySelector(".card-header-container");
      const passesIncludesList = passCard.querySelector(
        ".passes-includes-list"
      );
      const backdropShadowArray = passCard.querySelectorAll(
        ".backdrop-shadow > div"
      );
      const bgImage = passCard.querySelector(".passes-img");

      if (this.passesData.includes && this.passesData.includes.length) {
        const numOfCards =
          this.passesData.includes.length > 3
            ? 3
            : this.passesData.includes.length;
        gsap.to(cardHeader, {
          y: direction ? `-${passesIncludesList && passesIncludesList.offsetHeight ? passesIncludesList.offsetHeight + 'px' : numOfCards * 2.52 + 'rem'}` : 0,
          duration: 0.4,
        });
      }

      if (
        passesIncludesList &&
        this.passesData.includes &&
        this.passesData.includes.length
      ) {
        gsap.to(passesIncludesList, {
          opacity: direction ? 1 : 0,
          duration: 0.4,
        });
        let listItem = passesIncludesList.querySelectorAll("li");
        listItem = [...listItem];
        listItem = direction ? listItem.reverse() : listItem;

        listItem.forEach((item, index) => {
          gsap
            .fromTo(
              item,
              {
                y: direction ? "-0.5rem" : 0,
                opacity: direction ? 0 : 1,
              },
              {
                y: direction ? 0 : "-0.5rem",
                opacity: direction ? 1 : 0,
                overwrite: true,
                duration: direction ? 0.1 : 0.3,
              }
            )
            .delay(index * 0.066);
        });
      }

      gsap
        .to(bgImage, {
          scale: direction ? 1.3 : 1,
          duration: 0.4,
        })
        .delay(0.01);

      gsap.to(backdropShadowArray[0], {
        opacity: direction ? 0 : 1,
        overwrite: true,
        duration: 0.4,
      });

      gsap.to(backdropShadowArray[1], {
        opacity: direction ? 1 : 0,
        overwrite: true,
        duration: 0.4,
      });
    },
    getBookingId() {
      if (this.cardType === "passes") {
        return this.passesData.bookingBarDetails
          ? this.passesData.bookingBarDetails.id
          : this.passesData.id;
      }
      return this.passesData.id;
    },
    onPassActionBtnClick() {
      if (!this.isNotificationAction) {
        if (this.passesData.cta && this.passesData.cta.url) {
          if (this.$isExternalLink(this.passesData.cta.url)) {
            window.location.href = this.passesData.cta.url;
          } else {
            this.$router.push(this.localePath(this.passesData.cta.url))
          }
        } else {
          this.$updateAkAndRoute(
            this.passesData.ak || this.passesData.id,
            this.getBookingId(),
            this.cardType,
            this.passesData.data ? this.passesData.data : this.passesData
          );
        }
      } else this.$emit("openNotificationModal");
    },
    goToViewDetails() {
      let card = this.passesData.data ? this.passesData.data : this.passesData;
      if (card) {
        this.$repositories.selectItemEvent(card, Object.assign({}, this.passesData, {parent_id: this.tab.id}));
      }

      this.$router.push(this.localePath('/' + this.passesData.card_details_identifier));
    }
  }
};
</script>
<style scoped lang="scss">
@import "./PassesCard.scss";
</style>
