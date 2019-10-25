import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import VueMeta from "vue-meta";
import "@/registerServiceWorker";

// styles
import "@/assets/styles/variables.css";
import "@/assets/styles/utilities.css";
import "@/assets/styles/fonts.css";
import "@/assets/styles/main.css";

Vue.use(VueMeta);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
