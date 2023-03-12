<template>
  <div class="addOnsItem" :class="{ active: data.counter > 0 }">
    <div class="addOnsItemContainer">
      <div class="image-container">
        <SlotImage :image="data.img" />
      </div>
      <div class="price-content-container">
        <div class="content-container">
          <div>
            <p class="title">
              {{ data.title }}
            </p>
          </div>
          <div class="sub-title-container">
            <p v-if="data.subTitle1" class="sub-title">
              {{ data.subTitle1 }}
            </p>
            <p v-if="data.subTitle2" class="sub-title">
              {{ data.subTitle2 }}
            </p>
          </div>
        </div>
        <div class="price-counter-container">
          <div>
            <p v-if="data.amount" class="price flex gap-1">
              <span class="ltr:order-1 rtl:order-2">{{ currency }}</span>
              <span class="ltr:order-2 rtl:order-1">{{ data.amount }}</span>
            </p>
          </div>
          <div class="counter-container">
            <TicketCounter
              :id="id"
              :value="data.counter"
              :max="data.max_number_of_order"
              :total-counter="1000"
              transition="signatureAcross"
              @valueEmit="handleEmitValue"
            />
            <!-- max was 12 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TicketCounter from "@/components/PassesPackages/TicketCounter";
import SlotImage from "@/components/BookingFlow/AddActivity/SlotImage";
export default {
  name: "AddOnsItem",
  components: {
    SlotImage,
    TicketCounter,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    id: {
      type: String,
      default: "",
    },
    addOnsType: {
      type: String,
      default: "",
    },
    packageDetails: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['addOnsCounterChange'],
  data() {
    return {
      currency: ""
    }
  },
  created() {
    this.currency = this.$getSiteConfig('currency');
  },
  mounted() {
    this.setCounter();
  },
  methods: {
    handleEmitValue(counterData) {
      this.$emit("addOnsCounterChange", {
        id: this.data.id,
        ak: this.data.ak,
        counter: counterData.number,
        title: this.data.title,
        amount: this.data.amount,
        localized_title: this.data.localized_title,
      });
    },
    setCounter() {
      for (
        let index = 0;
        index < this.packageDetails.addOnsSelection.length;
        index++
      ) {
        if (this.packageDetails.addOnsSelection[index].id == this.data.id) {
          this.data.counter =
            this.packageDetails.addOnsSelection[index].counter;
        }
      }
    },
  },
};
</script>
<style scoped lang="scss">
@import "./addOnsItem.scss";
</style>
