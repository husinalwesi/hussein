<template>
  <div class="flex-1" :class="wrapperClasses">
    <div
      v-click-outside="closeDDL"
      class="drop-down-list-container"
      :class="{ 'no-bottom-border': isDDLEnabled, error: isErrorExist }"
    >
      <div
        class="ddl-input"
        :class="ddlInputClasses"
        @click="isDDLEnabled = !isDDLEnabled"
      >
        <label v-if="showUnit" :class="labelClass">{{ unit }}</label>
        <div class="card-item selected">
          <span :class="cardTextClass">{{
            selectedItem && selectedItem[titleKey]
              ? selectedItem[titleKey]
              : selectedPlaceHolder
          }}</span>
        </div>
        <div class="arrow-container">
          <arrow-svg :class="{ '-rotate-180': isDDLEnabled }" />
        </div>
      </div>
      <div
        class="drop-down-list"
        :class="[isDDLEnabled ? 'ddlEnabled' : '', listClass]"
      >
        <ul class="flex flex-col">
          <li
            v-for="(item, index) in dpOptions"
            :key="index"
            :class="{
              hidden: DDLIndex === index,
              'order-2': DDLIndex != index,
            }"
            @click="setSelectedOption(index, item)"
          >
            <div class="card-info-content">
              <div class="card-item">
                <div :class="itemClass">
                  {{ item[titleKey] }}
                </div>
                <div v-if="showSubText">
                  <p class="card-text">
                    {{ item.subtext }}
                  </p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div
      v-if="isErrorExist"
      class="ltr:text-left rtl:text-right  mt-1 text-[#DD0028] ltr:font-inter-reguler rtl:font-noto-sans-arabic-reguler text-xs"
    >
      {{ $t('BOOKINGFLOW_PAGE.PLEASE_ENTER_THE') }} {{ selectedPlaceHolder || errorMessage }}
    </div>
  </div>
</template>

<script>
import ArrowSvg from "@/components/SVGElements/arrow-svg.vue";

export default {
  name: "BaseDP",
  components: {ArrowSvg},
  props: {
    btnType: {default: "link", type: String},
    id: {
      default: "gs-base-button-default-styles",
      required: true,
      type: String,
    },
    itemClass: {
      default: "",
      type: String,
    },
    cardTextClass: {
      default: () => "card-text",
      type: [String, Array],
    },
    name: {
      type: String,
      required: true,
    },
    itemValue: {
      type: Object,
      required: true,
    },
    unit: {
      type: String,
      default: "",
      required: false,
    },
    dpOptions: {
      type: Array,
      required: true,
    },
    className: {
      default: "",
      type: String,
    },
    listClass: {
      default: "",
      type: String,
    },
    labelClass: {
      default: "",
      type: String,
    },
    titleKey: {
      default: "name",
      type: String,
    },
    showSubText: {
      default: false,
      type: Boolean,
    },
    showUnit: {
      default: false,
      type: Boolean,
    },
    selectedPlaceHolder: {
      required: true,
      type: String,
    },
    isErrorExist: {
      required: false,
      type: Boolean,
      default: false,
    },
    wrapperClasses: {
      type: String,
      default: () => "",
    },
    ddlInputClasses: {type: String, default: () => "px-6 py-4"},
    selectFirstItem: {
      type: Boolean,
      default: false,
    },
    errorMessage:{
      type: String,
      default: () => "",
    },
    isResetValues:{
      type: Boolean,
      default: false
    }
  },
  emits: ["item-selected"],
  data() {
    return {
      isDDLEnabled: false,
      DDLIndex: -1,
      selectedItem: null,
    };
  },
  watch: {
    itemValue() {
      this.updateSelection();
    },
    isResetValues() {
      this.resetValues();
    }
  },
  mounted() {
    this.updateSelection();
  },
  methods: {
    updateSelection() {
      if (this.itemValue && Object.keys(this.itemValue).length > 0)
        this.selectedItem = this.itemValue;
    },
    setSelectedOption(index, item) {
      this.DDLIndex = index;
      this.selectedItem = item;
      this.$emit("item-selected", item);
      this.closeDDL();
    },
    closeDDL() {
      this.isDDLEnabled = false;
    },
    resetValues() {
      this.isDDLEnabled = false;
      this.DDLIndex = -1;
      this.selectedItem = null;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./BaseDP.scss";
</style>
