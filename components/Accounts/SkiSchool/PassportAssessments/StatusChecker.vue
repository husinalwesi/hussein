<template>
  <div class="w-fit flex mobiles:flex-row-reverse items-center gap-x-4">
    <div v-if="statusClasses[status].label">
      <label
        class="ltr:font-inter-semi-bold rtl:font-noto-sans-arabic-semi-bold text-xs"
        :class="statusClasses[status].label.color"
      >{{ statusClasses[status].label.text }}</label>
    </div>
    <span
      class="flex h-8 items-center justify-center rounded-full w-8"
      :class="statusClasses[status].class"
    >
      <component
        :is="statusClasses[status].icon.name"
        v-if="statusClasses[status].icon"
        :color="statusClasses[status].icon.color"
      />
    </span>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      default: () => "notJoined"
    },
  },
  data() {
    return {
      statusClasses: {
        notJoined: {
          class: "border-[#C5C5C5] border-1 border-solid",
          icon: null,
          text: null
        },
        passed: {
          class: "bg-light-yellow",
          icon: {
            name: "Checkmark",
            color: "#0A1432"
          },
          label: {
            text: this.$t("ACCOUNT_PAGE.SKI_SCHOOL.STATUS_CHECKER.PASSED"),
            color: "text-[#0A1432]"
          }
        },
        notAssessed: {
          class: "bg-[#FF96031A]",
          icon: {
            name: "close-svg",
            color: "#FE9B51"
          },
          label: {
            text: this.$t("ACCOUNT_PAGE.SKI_SCHOOL.STATUS_CHECKER.NOT_ASSESSED"),
            color: "text-[#FE9B51]"
          }
        },
        needMorePractice: {
          class: "bg-[#FF96031A]",
          icon: {
            name: "warning-svg",
            color: "#FF173D"
          },
          label: {
            text: this.$t("ACCOUNT_PAGE.SKI_SCHOOL.STATUS_CHECKER.NEED_MORE_PRACTICE"),
            color: "text-[#FF173D]"
          }
        }
      }
    };
  }
};
</script>
