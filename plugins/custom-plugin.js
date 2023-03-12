import Vue from 'vue';

import Notifications from 'vue-notification'
// import {defineCustomElements} from "@mafpay/weblib";
import lottie from 'lottie-web';

// Vue.use(defineCustomElements);
Vue.use(Notifications);

// makes lottie api available from this.$lottie in a nuxt application
export default ({app}, inject) => {
  inject('lottie', lottie);
};
