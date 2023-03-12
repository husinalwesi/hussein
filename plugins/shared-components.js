import Vue from "vue";

/* eslint-disable vue/component-definition-name-casing */

// shared svg elements will be shared here.
Vue.component('arrow-svg', () => import("@/components/SVGElements/arrow-svg.vue"));
Vue.component('close-svg', () => import("@/components/SVGElements/close-svg.vue"));
Vue.component('Checkmark', () => import("@/components/SVGElements/Checkmark.vue")); // TODO: rename the Checkmark to check-mark after we merge.
Vue.component('warning-svg', () => import("@/components/SVGElements/warning-svg.vue"));

// shared components will be shared here.
Vue.component('CardContainer', () => import("@/components/BookingFlow/CardContainer"));
Vue.component('BaseInput', () => import("@/components/Shared/BaseUI/FormElements/BaseInput"));
Vue.component('BaseButton', () => import("@/components/Shared/BaseUI/BaseButton"));
Vue.component('BaseModal', () => import("@/components/Shared/BaseUI/BaseModal"));
Vue.component('SolidBlurBG', () => import("@/components/Shared/SolidBlurBG"));
Vue.component('BaseCheckbox', () => import("@/components/Shared/BaseUI/FormElements/BaseCheckbox"));
Vue.component('BaseRadio', () => import("@/components/Shared/BaseUI/FormElements/BaseRadio"));

// loaders
Vue.component('snowflake-loader', () => import("@/components/Shared/Loaders/SnowflakeLoader"));
Vue.component('CircleLoader', () => import("@/components/Shared/Loaders/CircleLoader"));

// wrappers
Vue.component('SectionContentWrapper', () => import('@/components/Shared/SectionContentWrapper'));
