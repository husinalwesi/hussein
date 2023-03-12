<template>
  <ul id="booking-bar-guest-ddl" ref="bookingBarGuest">
    <template v-for="(slot, index) in data.slots">
      <li
        v-if="
          (index == 'adult' && enabledAgeTypeVar.adult) ||
            (index == 'junior' && enabledAgeTypeVar.junior) ||
            (index == 'child' && enabledAgeTypeVar.child)
        "
        :key="index"
        class="opacity-0"
        :class="{ 'py-[2.563rem] lg:py-4': index == 'junior' }"
      >
        <div class="ticket-count-container">
          <div class="flex flex-col">
            <div class="ticket-counter-text">
              <ChangeValueAnimation
                :id="`${id}-booking-bar-age-text-${index}`"
                class="booking-bar-age-text"
                :text="$t(`BOOKINGFLOW_PAGE.${$options.filters.plural(index, slot.value)}`, { count: slot.value })"
                transition="signature"
                :signature="slot.signature"
                y="0.5rem"
              />
            </div>
            <p class="age-number">
              {{ getAgeText(slot.age, index) }}
            </p>
          </div>
          <TicketCounter
            v-if="slot.isAvailable"
            :id="`${id}-booking-bar-age-counter-${index}`"
            :value="slot.value"
            :max="slot.max"
            :total-counter="data.totalCounter"
            :accept-max="maxTotal"
            class="ltr:mr-[-3px] rtl:ml-[-3px]  lg:ltr:mr-0 lg:rtl:ml-0"
            transition="signatureAcross"
            @valueEmit="handleEmitValue(index, $event)"
          />
          <div v-else class="next-available-data-container">
            <p>{{ $t('BOOKINGFLOW_PAGE.NEXT_AVAILABLE_DATE') }}:</p>
            <p>{{ slot.nextAvailableDate }}</p>
          </div>
        </div>
      </li>
    </template>
  </ul>
</template>
<script>
import gsap from "gsap";
import TicketCounter from "@/components/PassesPackages/TicketCounter";
import ChangeValueAnimation from "@/components/Shared/ChangeValueAnimation";
import BezierEasing from "bezier-easing";

export default {
  name: "People",
  components: {
    TicketCounter,
    ChangeValueAnimation,
  },
  props: [
    "initialData",
    "isDDLEnabled",
    "id",
    "enabledAgeType",
    "ageTypeText",
    "maxTotal",
    "minimum_age",
  ],
  data() {
    return {
      data: {
        totalCounter: 0,
        slots: {
          adult: {
            isAvailable: true,
            age: this.$t('BOOKINGFLOW_PAGE.AGES_14_AND_ABOVE'),
            value: 0,
            max: 12,
            signature: "+",
          },
          junior: {
            isAvailable: true,
            age: this.$t('BOOKINGFLOW_PAGE.AGES_7_13'),
            value: 0,
            max: 12,
            signature: "+",
          },
          child: {
            isAvailable: true,
            age: this.$t('BOOKINGFLOW_PAGE.AGES_6_MIN', {minAge: this.$getSiteCurrentEnvironment().includes('oman') ? (this.minimum_age ? this.minimum_age : 2) : 3}),
            value: 0,
            max: 12,
            signature: "+",
          },
        },
      },
    };
  },
  computed: {
    enabledAgeTypeVar() {
      if (this.enabledAgeType) {
        return this.enabledAgeType;
      }
      return {
        adult: true,
        junior: true,
        child: true,
      };
    },
  },
  watch: {
    isDDLEnabled() {
      this.animateList(this.$refs.bookingBarGuest);
    },
    initialData: {
      handler(newVal, oldVal) {
        this.initializeData();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getAgeText(ageText, ageType) {
      let ageTypeObj = this.ageTypeText || {};
      if (!this.$isEmptyObject(ageTypeObj)) {
        let currentAgeType = ageTypeObj[ageType] || {};
        if (!this.$isEmptyObject(currentAgeType)) {
          return this.$t(`BOOKINGFLOW_PAGE.${currentAgeType}`);
        }
      }
      //
      let minimum_age = Number(this.minimum_age);
      if (ageText == "Ages 3 - 6") {
        if (minimum_age && minimum_age == 2) return this.$t('BOOKINGFLOW_PAGE.AGES_2_6');
        return ageText;
      } else return ageText;
    },
    animateList(list) {
      let listItem = list.querySelectorAll("li");
      listItem = [...listItem]; //convert it to array.
      listItem = this.isDDLEnabled ? listItem : listItem.reverse();
      listItem.forEach((item, index) => {
        gsap
          .fromTo(
            item,
            {
              opacity: this.isDDLEnabled ? 0 : 1,
            },
            {
              opacity: this.isDDLEnabled ? 1 : 0,
              overwrite: true,
              duration: 0.67,
              ease: BezierEasing(0.33, 0, 0, 1),
            }
          )
          .delay((index + 1) * 0.07);
      });
    },
    handleEmitValue(index, e) {
      this.animateText(index, e.number);
      this.data.slots[index].value = e.number;
      this.calculateTotal();
      this.$emit("emitCounterDataEmitter", {
        totalCounter: this.data.totalCounter,
        data: {
          adult: this.data.slots.adult.value,
          junior: this.data.slots.junior.value,
          child: this.data.slots.child.value,
        },
      });
    },
    calculateTotal() {
      let tempTotal = 0;
      for (const key in this.data.slots) {
        tempTotal += this.data.slots[key].value;
      }
      this.data.totalCounter = tempTotal;
    },
    animateText(index, newNum) {
      let oldNum = this.data.slots[index].value;
      this.data.slots[index].signature = oldNum < newNum ? "+" : "-";
    },
    initializeData() {
      this.$nextTick(() => {
        this.data.slots.adult.value = this.initialData.adult;
        this.data.slots.child.value = this.initialData.child;
        this.data.slots.junior.value = this.initialData.junior;
        this.calculateTotal();
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import "./People.scss";
</style>
