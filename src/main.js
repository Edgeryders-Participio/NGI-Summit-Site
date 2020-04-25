import Vue from "vue";
import App from "./App.vue";
import "./assets/main.scss";
import utils from "@/utils";

import VueMq from "vue-mq";
import VueScrollactive from "vue-scrollactive";
import Vue2TouchEvents from "vue2-touch-events";

export const bus = new Vue();

Vue.mixin(utils); 

Vue.use(VueMq, {
	breakpoints: {
		sm: 450,
		md: Infinity
	}
});
Vue.use(VueScrollactive);
Vue.use(Vue2TouchEvents);

Vue.config.productionTip = false;

new Vue({ render: h => h(App) }).$mount("#app");
