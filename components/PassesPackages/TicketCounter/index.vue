<template>
  <div class="flex flex-row ticket-counter-container" :id="id">
    <button
      type="button"
      v-bubbleButton
      @click="minus($event)"
      class="counter-buttons minus-button"
      :class="counter == 0 ? 'disabled-button' : 'active-button'"
      aria-label="minus"
    >
      <Minus />
    </button>
    <ChangeValueAnimation
      class="
        relative
        counter-number
        ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold
        text-base
        leading-6
        text-center text-dark-gray
        w-[2.688rem]
      "
      :id="'counter-number-' + id"
      :text="counter"
      :transition="transition ? transition : 'signature'"
      :signature="signature"
      y="1rem"
    />
    <button
      type="button"
      v-bubbleButton
      @click="plus($event)"
      class="counter-buttons plus-button"
      :class="
        counter == max || isTotalAcceed36 ? 'disabled-button' : 'active-button'
      "
      aria-label="plus"
    >
      <Plus />
    </button>
  </div>
</template>
<script>
import ChangeValueAnimation from "@/components/Shared/ChangeValueAnimation";
import Plus from "@/components/SVGElements/Plus.vue";
import Minus from "@/components/SVGElements/Minus.vue";
export default {
  name: "TicketCounter",
  props: ["value", "max", "id", "totalCounter", "transition", "acceptMax"],
  watch: {
    value() {
      this.counter = this.value || 0;
    },
  },
  data() {
    return {
      counter: this.value || 0,
      signature: "+",
    };
  },
  computed: {
    getAcceptMax() {
      return this.acceptMax || 36;
    },
    isTotalAcceed36() {
      return this.totalCounter == this.getAcceptMax;
    },
  },
  methods: {
    minus(e) {
      if (this.totalCounter - 1 == 0) return false;
      if (this.counter != 0) {
        this.signature = "-";
        this.counter--;
        this.$emit("valueEmit", { number: this.counter, ele: e });
      }
    },
    plus(e) {
      if (this.counter != this.max && !this.isTotalAcceed36) {
        this.signature = "+";
        this.counter++;
        this.$emit("valueEmit", { number: this.counter, ele: e });
      }
    },
  },
  components: {
    Plus,
    Minus,
    ChangeValueAnimation,
  },
};
</script>
<style scoped lang="scss">
@import "./TicketCounter.scss";
</style>