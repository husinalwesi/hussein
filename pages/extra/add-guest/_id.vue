<template>
  <AddGuest ref="addGustComponent" />
</template>

<script>
import AddGuest from "@/components/BookingFlow/AddGuest";
import {CommonEvent} from "@/services/app-events";

export default {
  name: "AddGuestPage",
  components: {AddGuest},
  mounted() {
    let bottomBarItems = {
      leftItems: [],
      rightItems: [
        {
          title: this.$t('COMMON.SAVE_AND_CONTINUE'),
          action: async () => {
            this.$refs['addGustComponent'].save()
          },
          disabled: true,
          customClass: 'submit-btn'
        }
      ],
    }
    this.$store.dispatch('bottomBar/setBottomBarData', bottomBarItems)
    CommonEvent.$emit('show-bottom-bar', true)
  },
}
</script>

<style scoped>

</style>
