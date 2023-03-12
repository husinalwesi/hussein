<template>
  <NuxtLink
    v-if="btnType === 'link'"
    :to="path?localePath(path.toLowerCase()):$route.path"
    class="w-max"
    :rel="cta?(cta.no_index ? 'noindex ' : '') + (cta.no_follow ? 'nofollow' : ''):''"
    :class="className"
  >
    <slot v-if="isWithIconElement" name="icon-element" />
    {{ $capitalizeFirstLetter(text) }}
  </NuxtLink>
  <a
    v-else-if="btnType === 'externalLink'"
    :href="path"
    target="_blank"
    :class="className"
    :rel="cta?(cta.no_index ? 'noindex ' : '') + (cta.no_follow ? 'nofollow' : ''):''"
  >
    <slot v-if="isWithIconElement" name="icon-element" />
    {{ $capitalizeFirstLetter(text) }}
  </a>
  <button
    v-else
    :id="btnId"
    :type="btnType"
    :disabled="BTNdisabled || isLoading"
    :class="className+ `${isLoading?' whitespace-nowrap':''}`"
    @click="onBtnClick"
  >
    <snowflake-loader
      v-if="isLoading" :loader-wrapper-classes="loaderWrapperClasses" :loader-classes="loaderClasses"
      :loader-color="loaderColor"
    />
    {{ $capitalizeFirstLetter(text) }}
  </button>
</template>

<script>
export default {
  props: {
    btnType: {type: String, default: "link"},
    className: {
      default: "gs-base-button-default-styles w-fit",
      type: String,
    },
    text: {
      type: String,
      default: () => "",
      required: true,
    },
    path: {
      default: "/",
      type: String,
    },
    // eslint-disable-next-line vue/prop-name-casing
    BTNdisabled: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    loaderClasses: {type: String, default: () => "w-4 h-4"},
    externalLinkTarget: {
      type: String,
      default: "_blank",
    },
    cta: {
      type: Object,
      default: () => {
      }
    },
    btnId: {
      type: String,
      default: ''
    },
    loaderWrapperClasses: {type: String, default: () => ""},
    loaderColor: {type: String, default: () => "#142b73"},
    isWithIconElement:{
      type: Boolean,
      default: false,
    }
  },
  emits: ['click', 'onBtnClick'],
  methods: {
    onBtnClick(e) {
      if (this.btnType === "submit") this.$emit("click", e);
      else this.$emit("onBtnClick");
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./BaseButton.scss";
</style>
