<template>
  <div>
    <div class="tabs-container">
      <Breadcrumb
        v-if="getTabs.length"
        :tabs-links="getTabs"
        :current-step="currentStep"
        :is-there-a-change="isThereAChange"
        :is-membership="isMembership"
        :is-ski-lesson="isSkiLesson"
        :static-labels="staticLabels"
        @tabChangeEmitter="tabChangeEmitHandler"
      />
    </div>
  </div>
</template>

<script>
import Breadcrumb from "./Breadcrumb";

const defaultLinks = [
  {
    title: "ACTIVITIS",
    path: "/booking/add-activity",
    key: "add-activity",
    order: 1,
  },
  {
    title: "ADD_ONS",
    path: "/booking/add-ons",
    key: "add-ons",
    order: 2,
  },
  {
    title: "PERSONAL_DETAILS",
    path: "/booking/personal-details",
    key: "personal-details",
    order: 3,
  },
  {
    title: "BUY_TICKETS",
    path: "/booking/buy-tickets",
    key: "buy-tickets",
    order: 4,
  },
];

export default {
  components: { Breadcrumb },
  props: {
    currentStep: {
      type: String,
      default: "",
    },
    isAddOnsEnabled: {
      type: Boolean,
      default: false,
    },
    isAddActivityEnabled: {
      type: Boolean,
      default: false,
    },
    isThereAChange: {
      type: Boolean,
      default: false,
    },
    isSkiLesson: {
      type: Boolean,
      default: false,
    },
    isMembership: {
      type: Boolean,
      default: false,
    },
    staticLabels: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    getTabs() {
      let menu = this.isAddOnsEnabled
        ? defaultLinks
        : [defaultLinks[0], defaultLinks[2], defaultLinks[3]];
      let list = this.isAddActivityEnabled ? menu : menu.slice(1, menu.length);
      return list;
    },
  },
  methods: {
    tabChangeEmitHandler(data) {
      this.$emit("tabChangeEmitter", data);
    },
  },
};
</script>

<style lang="scss">
@import "./HeaderBar.scss";
</style>
