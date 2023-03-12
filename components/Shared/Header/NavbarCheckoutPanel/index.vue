<template>
  <div
    class="navbar-checkout-panel"
    @mouseleave="$globalData.isDesktopDevice ? $emit('toggleCheckoutMenu', true) : ''"
  >
    <div
      class="checkout-icon-container"
      :class="{
        active: activeMenuType === 'checkout',
        'sidebar-is-active':
          activeMenuType === 'checkout' ||
          (activeMenuType === 'items' && !$globalData.isDesktopDevice),
        'icon-hidden': activeMenuType === 'user',
        inverted: navbarIsInverted,
      }"
      @click="$emit('toggleCheckoutMenu')"
    >
      <span v-if="cartItems.length" class="items-counter-wrapper">
        <p class="items-counter-text">{{ cartItems.length }}</p>
      </span>
      <checkout-icon
        :color="
          (!!activeMenuType && !$globalData.isDesktopDevice) || navbarIsInverted
            ? '#1A1A1A'
            : '#FFFFFF'
        "
      />

      <!-- <img
        v-if="cartIcon && cartIcon.image_url"
        :src="cartIcon.image_url"
        :alt="cartIcon.alt_text"
        :title="cartIcon.title"
        width="22"
        height="22"
        class="w-fit h-fit max-w-[22px] max-h-[22px]"
      />
      <checkout-icon
        v-else
        :color="
          (!!activeMenuType && !$globalData.isDesktopDevice) || navbarIsInverted
            ? '#1A1A1A'
            : '#FFFFFF'
        "
      /> -->
    </div>

    <div v-if="activeMenuType === 'checkout'" class="checkout-menu-wrapper">
      <div v-if="cartItems.length" class="checkout-menu menu-box">
        <div class="cart-items-container">
          <div
            v-for="(item, itemIndex) in cartItems"
            :key="item.id"
            class="cart-item"
          >
            <div v-if="itemIndex !== 0" class="divider-dashed mb-4" />
            <div class="flex justify-between text-base text-[#191919]">
              <p class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold ">
                {{ item.title }}
              </p>
              <!--TODO: change this once we finish from implementing the new Object flow (!Important).-->
              <p class="ltr:font-inter-bold rtl:font-noto-sans-arabic-bold flex gap-1">
                {{
                  $t("COMMON.BINARY_PARTS", {
                    key: currency,
                    value: item.price
                  })
                }}
              </p>
            </div>
            <div class="mt-1 mb-2">
              <p class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-xs text-[#606060]">
                {{ $pluralTextHandler(item.numOfGuests, "guests") }}
              </p>
            </div>
            <div class="visit-date-container">
              <BookingCalender />
              <p class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-sm leading-4 text-dark-gray">
                {{ item.visitDate }}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div class="divider-dashed" />
          <div class="total-price-details-container">
            <div class="vat-total">
              <p>{{ $t('BOOKINGFLOW_PAGE.VAT') }} (5%)</p>
              <p class="flex gap-1">
                {{
                  $t("COMMON.BINARY_PARTS", {
                    key: currency,
                    value: $decimalPlaces(totalPrice.vatValue)
                  })
                }}
              </p>
            </div>
            <div class="total-price">
              <p class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold  text-base">
                {{ $t('BOOKINGFLOW_PAGE.TOTAL') }} (<span
                  class="ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler"
                >{{
                  $t('BOOKINGFLOW_PAGE.VAT_INCLUDED')
                }}</span>)
              </p>
              <p class="ltr:font-inter-bold rtl:font-noto-sans-arabic-bold text-xl leading-6 flex gap-1">
                {{
                  $t("COMMON.BINARY_PARTS", {
                    key: currency,
                    value: $decimalPlaces(totalPrice.value, true)
                  })
                }}
              </p>
            </div>
          </div>
          <div class="divider-dashed lg:mb-4" />

          <div class="flex justify-between items-center mobile:py-4">
            <NuxtLink
              :to="localePath('/passes-packages/explore')"
              class="
                ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold
                leading-[14px]
                lg:leading-4 lg:ltr:pl-0  lg:rtl:pr-0
                ltr:pl-2 rtl:pr-2
                text-dark-gray text-sm
              "
            >
              {{ $t('BOOKINGFLOW_PAGE.CONTINUE_SHOPPING') }}
            </NuxtLink>
            <BaseButton
              v-if="defaultData.checkoutMenu.cta"
              id="view-cart"
              btn-type="button"
              :text="defaultData.checkoutMenu.cta.title"
              @onBtnClick="goToViewCart()"
            />
          </div>
        </div>
      </div>

      <div v-else class="empty-cart menu-box">
        <span v-if="checkoutPanelData.icon" class="image-wrapper">
          <img
            :src="checkoutPanelData.icon.image_url || defaultData.emptyCart.img.image_url"
            :alt="checkoutPanelData.icon.alt_text || defaultData.emptyCart.img.alt"
            :title="checkoutPanelData.icon.title || defaultData.emptyCart.img.title"
            width="45"
            height="45"
            class="w-fit h-fit max-w-[46px] max-h-[46px]"
          >
        </span>
        <div class="mt-4 mb-6">
          <p class="title">
            {{ checkoutPanelData.title || defaultData.emptyCart.title }}
          </p>
          <p class="message">
            {{ checkoutPanelData.subtitle || defaultData.emptyCart.message }}
          </p>
        </div>

        <template v-if="checkoutPanelData.cta">
          <BaseButton
            btn-type="button"
            :text="checkoutPanelData.cta.title || defaultData.emptyCart.cta.title"
            @onBtnClick="closeCartAndRedirect"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import BookingCalender from "@/components/SVGElements/BookingCalender.vue";
import CheckoutIcon from "@/components/SVGElements/checkout-icon.vue";

import BaseButton from "@/components/Shared/BaseUI/BaseButton";

import {mapGetters} from "vuex";

export default {
  components: {
    BookingCalender,
    CheckoutIcon,
    BaseButton
  },
  props: {
    activeMenuType: {
      type: String,
      default: ""
    },
    cartIcon: {type: Object, default: () => ({})},
    checkoutPanelData: {
      type: Object,
      default: () => ({})
    },
    navbarIsInverted: {type: Boolean, default: false}
  },
  emits: ["toggleCheckoutMenu"],
  data() {
    return {
      cartItems: [],
      defaultData: {
        checkoutMenu: {
          cta: {
            title: this.$t('BOOKINGFLOW_PAGE.VIEW_CART'),
            path: "/booking/personal-details"
          },
        },
        emptyCart: {
          img: {
            // eslint-disable-next-line no-undef
            image_url: require("@/assets/images/Header/empty.png"),
            alt: "empty image",
            title: "empty image"
          },
          title: this.$t('BOOKINGFLOW_PAGE.YOUR_CART_IS_EMPTY'),
          message: this.$t('BOOKINGFLOW_PAGE.GET_YOUR_SKIS_OR_SNOWBOARD_READY'),
          cta: {
            title: this.$t('BOOKINGFLOW_PAGE.FIND_TICKETS'),
            path: "/passes-packages/explore"
          }
        }
      },
      currency: ""
    };
  },
  computed: {
    ...mapGetters("bookingFlow", ["bookingData", "totalAmount"]),
    totalPrice() {
      let totalAmount = this.totalAmount;
      let currentPrice = totalAmount.GROSS - totalAmount.shareDiscount;
      let vatValue = totalAmount.TAX;

      return {
        vatValue,
        value: currentPrice
      };
    },
  },
  watch: {
    bookingData: {
      handler(newVal, oldVal) {
        this.updateCartData();
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.currency = this.$getSiteConfig('currency');
  },
  methods: {
    closeCartAndRedirect() {
      let url = this.checkoutPanelData.cta.url
        ? this.checkoutPanelData.cta.url
        : this.defaultData.emptyCart.cta.url;

      let currentPath = window.location.pathname;
      if (currentPath.indexOf(url) !== -1) {
        //close the panel
        this.$emit("toggleCheckoutMenu", false);
      } else {
        this.$router.push(this.localePath(url));
      }
    },
    updateCartData() {
      let addedItems = [];
      const bookingFlowData = this.bookingData;
      for (let ind = 0; ind < bookingFlowData.length; ind++) {
        const item = bookingFlowData[ind];
        let isUpgradeEnabled = (item.upgradeSelection && item.upgradeSelection.isSelected) || false;
        addedItems.push({
          id: ind,
          title: isUpgradeEnabled ? item.item && item.item.card && item.item.card.upgrade_title ? item.item.card.upgrade_title : this.$getItemTitle(item.localizedTitle,'ar','en') : this.$getItemTitle(item.localizedTitle,'ar','en'),
          price: (isUpgradeEnabled ? item.item && item.item.upgrade_ticket && item.item.upgrade_ticket.price ? item.item.upgrade_ticket.price : item.price : item.price) * this.getGuestCount(item),
          numOfGuests: this.getGuestCount(item),
          visitDate: this.$dateFormatter(item.date)
        });
      }
      this.cartItems = addedItems;
    },
    getGuestCount(packageDetails) {
      let guestObj = {};
      if (!this.$isEmptyObject(packageDetails.guest || {}))
        guestObj = packageDetails.guest;
      else guestObj = packageDetails.people;
      //
      return (
        this.$getNumber(guestObj.adult) +
        this.$getNumber(guestObj.junior) +
        this.$getNumber(guestObj.child)
      );
    },
    goToViewCart() {
      let cartItems = this.$store.getters["bookingFlow/bookingData"];
      if (cartItems) {
        this.$repositories.viewCartEvent(cartItems)
      }

      this.$router.push(this.localePath(this.defaultData.checkoutMenu.cta.path));
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./NavbarCheckoutPanel.scss";
</style>
