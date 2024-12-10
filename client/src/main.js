import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "@mdi/font/css/materialdesignicons.css";
import VueApexCharts from "vue-apexcharts";

Vue.config.productionTip = false;

Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);

Vue.filter("capitalize", function (value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
