<template>
  <notifications group="booking-toast" position="bottom right">
    <template slot="body" slot-scope="props">
      <div :class="`booking-toast toast-${props.item.type}`">
        <div class="content-container">
          <p v-html="props.item.text" />
        </div>
        <div class="close-container">
          <a class="close" @click="props.close">
            <CloseDark />
          </a>
        </div>
      </div>
    </template>
  </notifications>
</template>
<script>
import CloseDark from "@/components/SVGElements/CloseDark.vue";
export default {
  name: "Toast",
  components: { CloseDark },
};
</script>
<style scoped lang="scss">
@import "./Toast.scss";
</style>