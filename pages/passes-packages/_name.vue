<template>
  <div
    :class="`${$route.params.name}-section passes-packages-content-wrapper`"
  >
    <section
      v-for="(section, sectionIndex) of data"
      :key="sectionIndex"
      :class="[
        (section || {}).section_cards_type_id === 2
          ? 'packages-section-content-container'
          : 'passes-section-content-container'
      ]"
    >
      <template v-if="section">
        <PassesMain
          :title="section.title"
          :first-subtitle="section.subtitle_one"
          :second-subtitle="section.subtitle_two"
        />
        <template
          v-if="
            section.section_cards_type_id === 3 ||
              section.section_cards_type_id === 1
          "
        >
          <PassesContainer
            :passes-data="$mapPassesContainerData(section)"
            :is-without-side-slides="false"
            :tab="data.tab"
          />
        </template>
        <template v-if="section.section_cards_type_id === 2">
          <div
            v-for="(packageCardItem, packageIndex) in section.cards"
            :key="packageCardItem.id"
            class="flex justify-center"
            :class="{'mt-8 lg:mt-10': packageIndex !== 0}"
          >
            <PackageCard
              :packages-data="packageCardItem"
              corner-color="bg-[#fafafa]"
              :tab="data.tab"
            />
          </div>
        </template>
      </template>
    </section>
  </div>
</template>

<script>
import PassesContainer from "@/components/PassesPackages/PassesContainer";
import PassesMain from "@/components/PassesPackages/PassesMain";
import PackageCard from "@/components/PassesPackages/PackageCard";

export default {
  components: {
    PassesContainer,
    PassesMain,
    PackageCard
  },
  props: {
    data: {
      type: [Object, Array],
      default: () => []
    }
  }
};
</script>

<style lang="scss" scoped>
.passes-packages-content-wrapper {
  .packages-section-content-container {
    @apply bg-[#fafafa] py-10 lg:py-20;
  }

  .passes-section-content-container {
    @apply lg:pb-28 lg:pt-20 pb-16 pt-10;
  }
}
</style>
