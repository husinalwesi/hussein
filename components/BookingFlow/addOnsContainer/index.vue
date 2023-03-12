<template>
  <div class="add-ons-container">
    <div class="add-ons-container-content">
      <ul v-if="isDesktopDeviceLoc" class="addons-ul">
        <li v-for="(addOnitem, index) in data" :key="`${keyRef}-${index}`">
          <AddOnsItem
            :id="`counter-${keyRef}-${index}`"
            :data="addOnitem"
            :package-details="packageDetails"
            :add-ons-type="addOnsType"
            @addOnsCounterChange="addOnsCounterChangeHandler($event, index)"
          />
        </li>
      </ul>
      <div v-else id="add-ons-carousel">
        <div>
          <VueSlickCarousel :key="carouselKey" v-bind="settings">
            <AddOnsItem
              v-for="(addOnitem, index) in data"
              :id="`counter-${keyRef}-${index}`"
              :key="`${keyRef}-${index}`"
              :data="addOnitem"
              :package-details="packageDetails"
              :add-ons-type="addOnsType"
              @addOnsCounterChange="addOnsCounterChangeHandler($event, index)"
            />
          </VueSlickCarousel>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AddOnsItem from "@/components/BookingFlow/addOnsItem";
import VueSlickCarousel from "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.common";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-rtl.css";
import "@/components/Shared/VueSlickCarouselRTL/vue-slick-carousel-theme.css";

export default {
  name: "AddOnsContainer",
  components: {
    AddOnsItem,
    VueSlickCarousel,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    keyRef: {
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
  data() {
    return {
      isDesktopDeviceLoc: false,
      settings: {
        dots: false,
        arrows: false,
        speed: 833,
        infinite: false,
        rtl: this.$i18n.localeProperties.detectedLang === 'ar',
        centerMode: false,
        centerPadding: "0",
      },
      carouselKey: this.$getTimeStamp(),
    };
  },
  mounted() {
    this.isDesktopDeviceLoc = this.detectDesktopLoc();
    window.addEventListener("resize", this.onResizeEvent);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResizeEvent);
  },
  methods: {
    addOnsCounterChangeHandler(data, index) {
      let temp = data;
      temp["index"] = index;
      this.$emit("addOnsCounterChange", temp);
    },
    editAddOnsEmitHandler(data) {
      this.$emit("editAddOnsEmiter", data);
    },
    detectDesktopLoc() {
      return window.innerWidth >= 1024;
    },
    onResizeEvent() {
      this.isDesktopDeviceLoc = this.detectDesktopLoc();
      this.carouselKey = this.$getTimeStamp();
    },
  },
};
</script>
<style scoped lang="scss">
@import "./addOnsContainer.scss";
</style>
