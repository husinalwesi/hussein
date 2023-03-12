<template>
  <section class="empty-state-section">
    <div class="title-wrapper">
      <h1
        class="title"
        v-html="data && data.title ? $splitTextToLines(data.title) : `${defaultData.title} ${tabTitle} Tickets`"
      />
    </div>
    <div class="description-wrapper">
      <p class="description">
        {{ data && data.description ? data.description: defaultData.description }}
      </p>
    </div>
    <NuxtLink
      :to="localePath(data && data.cta && data.cta.url ? data.cta.url : defaultData.cta.url)"
      class="explore-link"
    >
      {{ data && data.cta && data.cta.title ? data.cta.title : defaultData.cta.title }}
    </NuxtLink>
  </section>
</template>

<script>
export default {
  name: "EmptyState",
  props: {
    tabTitle: {
      type: String,
      default: () => "",
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      defaultData: {
        title: "We couldn’t find any",
        description: "Explore all the other packages and passes we offer at Ski Dubai",
        cta: {
          url: "/passes-packages/explore",
          title: "Explore all tickets ⟶",
        },
      },
    };
  },
};
</script>

<style scoped lang="scss">
@import "./EmptyState.scss";
</style>
