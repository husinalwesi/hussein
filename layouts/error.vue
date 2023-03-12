<template>
  <div v-if="error.statusCode === 404">
    <PageNotFound />
  </div>
</template>
<script>
import PageNotFound from "~/pages/page-not-found";

export default {
  name: "Error",
  components: {PageNotFound},
  props: {
    error: {
      type: Object,
      default: () => ({})
    },
  }
}
</script>
