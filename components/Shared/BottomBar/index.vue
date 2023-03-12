<!--//TODO: Modify this component when we have time.-->
<template>
  <div id="bottom-bar" class="bottom-bar">
    <div class="content-container">
      <div>
        <button
          v-for="(cta, index) in buttons.leftItems"
          :key="index"
          type="button"
          :disabled="loader.isLoading"
          :class="cta.customClass"
          @click.prevent="cta.action"
        >
          {{ cta.title }}
        </button>
      </div>

      <div class="btn-container flex flex-wrap gap-y-3">
        <BaseButton
          v-for="(cta,index) in buttons.rightItems"
          :id="cta.id?cta.id:'submit-btn'" :key="index" :class-name="cta.customClass"
          :text="cta.title"
          btn-type="button"
          :b-t-ndisabled="cta.disabled||loader.isLoading"
          :is-loading="cta.id===loader.id?loader.isLoading:false"
          @onBtnClick="cta.action"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BottomBar",
  data() {
    return {
      buttons: {},
      loader: {
        id: null,
        isLoading: false
      }
    };
  },
  computed: {
    ctas() {
      return this.$store.getters["bottomBar/getCtas"];
    }
  },
  mounted() {
    if (!this.ctas) {
      this.buttons = {
        rightItems: [
          {
            title: "Download ticket",
            customClass: "text-btn"
          },
          {
            title: "Continue to add guest",
            customClass: "submit-btn"
          },
        ],
        leftItems: [
          {
            title: "Skip for now",
            customClass: "text-btn"
          }
        ]
      };
    } else {
      this.buttons = this.ctas;
    }
  },
  methods: {
    showLoader(data) {
      this.loader = data;
    }
  }
};
</script>

<style scoped lang="scss">
@import "bottom-bar";
</style>
