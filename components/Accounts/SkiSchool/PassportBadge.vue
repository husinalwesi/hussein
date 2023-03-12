<template>
  <div
    class="flex flex-col w-fit h-fit items-center"
    :class="badgeContainerClasses"
    @click="$emit('onBadgeClick')"
  >
    <img
      v-if="name"
      :src="require(`@/assets/images/Accounts/SkiSchoolLevels/${$i18n.localeProperties.detectedLang}/${name}.png`)"
      alt="level"
      title="level"
      width="95.31"
      height="97.71"
      :class="badgeImgClasses"
    >
    <div
      class="
        border-1 border-solid border-[#0A143233]
        h-3
        mt-3
        p-[1px]
        rounded-lg
        w-[4.5rem]
      "
      :class="progressWrapperClasses"
    >
      <div
        class="bg-[#58B150] h-full rounded-lg"
        :style="{width: progressClasses}"
        :class="{ 'bg-[#0090DD]': progressClasses != '100%' }"
      />
    </div>
    <div v-if="date" class="badge-date-wrapper">
      <p class="badge-date">
        {{ $dateFormatter(date, "fullDate", false) }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: () => "beginner"
    },
    badgeContainerClasses: { type: [String, Array], default: () => "" },
    badgeImgClasses: {
      type: [String, Array],
      default: () => ""
    },
    progressWrapperClasses: { type: [String, Array], default: () => "" },
    progressClasses: { type: String, default: () => "100%" },
    date: {
      type: String,
      default: () => ""
    }
  },
  emits: ['onBadgeClick']
};
</script>

<style lang="scss" scoped>
.badge-date-wrapper {
  @apply bg-[#0A14321A] mt-2 px-2 py-1 rounded-lg w-fit;

  .badge-date {
    @apply ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold text-[10px] leading-4 text-dark-black whitespace-nowrap;
  }
}
</style>
