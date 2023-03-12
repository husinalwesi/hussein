<template>
  <div id="ResidentsDiscount" :class="{ active: isEnabled }">
    <div class="radio-btn-container">
      <span
        class="radio-btn"
        @click="setSelectedTab('ResidentsDiscount')"
      ></span>
    </div>
    <div class="tabContent">
      <div>
        <p class="tabTitel">Residents discount</p>
        <p class="tabSubTitle">Claim a discount with your UAE-issued ID.</p>
      </div>
      <div class="contentDetails">
        <ul class="residentsDiscountOptionsList">
          <li
            v-for="(option, index) of residentsDiscountOptions"
            :key="index"
            :class="{ active: residentsDiscountSelection == index }"
          >
            <a href="javascript:void(0);" @click="changeCardType(index)">{{
              option.fieldTite
            }}</a>
          </li>
        </ul>
        <div class="input-group">
          <form @submit.prevent="apply()">
            <input
              type="text"
              name="Residentsdiscount"
              v-model.number="Residentsdiscount"
              v-accept-only-number
            />
            <!-- residentsDiscountSelection: {{residentsDiscountSelection}} -->
            <button
              v-if="messages.class != 'text-success'"
              :class="[Residentsdiscount ? 'active' : 'disabled']"
              @click="apply()"
              type="button"
            >
              Apply
            </button>
            <button
              v-if="messages.class == 'text-success'"
              class="remove"
              @click="remove()"
              type="button"
            >
              Remove
            </button>
          </form>
        </div>
        <div class="text-container">
          <p v-if="messages.text && Residentsdiscount" :class="messages.class">
            {{ messages.text }}
          </p>
          <button
            v-if="messages.class != 'text-success'"
            :class="[Residentsdiscount ? 'active' : 'disabled']"
            @click="apply()"
            type="button"
          >
            Apply
          </button>
          <button
            v-if="messages.class == 'text-success'"
            class="remove"
            @click="remove()"
            type="button"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResidentsDiscount",
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
    fireReset: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      Residentsdiscount: "",
      residentsDiscountSelection: 0,
      residentsDiscountOptions: [
        {
          fieldTite: "E-ID",
          placeholder: "ID number",
        },
        {
          fieldTite: "ESAAD",
          placeholder: "Esaad card number",
        },
        {
          fieldTite: "DEWA",
          placeholder: "Enter DEWA",
        },
        {
          fieldTite: "CREW",
          placeholder: "Enter CREW",
        },
      ],
      residentsCardsCodes: [
        {
          code: "123456789",
          percentage: 20,
        },
        {
          code: "987654321",
          percentage: 100,
        },
      ],
      messages: {
        text: "",
        class: "",
      },
    };
  },
  watch: {
    fireReset() {
      this.Residentsdiscount = "";
      this.messages = {
        text: "",
        class: "",
      };
    },
    Residentsdiscount() {
      this.messages = {
        text: "",
        class: "",
      };
      this.$emit("handredPercentDiscountEmmiter", false);
      this.$store.commit("bookingFlow/SET_SHARE_RESIDENTS_DISCOUNT", {
        cardType: null,
        cardNumber: null,
        percentage: null,
      });
      this.$emit("changeEmmiter", true);
    },
  },
  methods: {
    setSelectedTab(tab) {
      this.$emit("tabEmmiter", tab);
      this.Residentsdiscount = "";
      this.residentsDiscountSelection = 0;
    },
    remove() {
      this.Residentsdiscount = "";
      this.messages = {
        text: "",
        class: "",
      };
      this.$emit("changeEmmiter", true);
    },
    apply(type = "") {
      if (!this.Residentsdiscount) return false;
      let percentage = this.residentsCardsCodes
        .filter((code) => code.code == this.Residentsdiscount)
        .flatMap((code) => {
          return code.percentage;
        })
        .shift();
      if (percentage) {
        this.messages = {
          text:
            percentage == 100
              ? "Wow! 100% off! That's one sweet discount code."
              : `${percentage}% UAE residents discount.`,
          class: "text-success",
        };
      } else {
        this.messages = {
          text: "Code expired or does not exist.",
          class: "text-danger",
        };
      }
      this.$emit("handredPercentDiscountEmmiter", percentage == 100);
      this.$store.commit("bookingFlow/SET_SHARE_RESIDENTS_DISCOUNT", {
        cardType: this.residentsDiscountSelection,
        cardNumber: this.Residentsdiscount,
        percentage: percentage,
      });
      this.$store.commit("bookingFlow/SET_SHARE_PROMO_CODE", {
        couponCode: null,
        percentage: null,
      });
      this.$store.commit("bookingFlow/SET_SHARE_DISCOUNT", {
        aedAmount: null,
        useAllMySharePoints: null,
      });
      if (percentage == 100) {
        this.$store.commit("bookingFlow/SET_SHARE_PAYMENT_METHOD", {
          cardNumber: null,
        });
      }
      this.$emit("changeEmmiter", true);
    },
    changeCardType(index) {
      this.residentsDiscountSelection = index;
      this.Residentsdiscount = "";
      this.$emit("changeEmmiter", true);
    },
  },
  mounted() {
    if (this.isEnabled) {
      this.residentsDiscountSelection =
        this.data.residentsDiscount.cardType || 0;
      this.Residentsdiscount = this.data.residentsDiscount.cardNumber;
      setTimeout(() => {
        this.apply("initial");
      });
    }
  },
};
</script>
<style scoped lang="scss">
@import "./ResidentsDiscount.scss";
</style>