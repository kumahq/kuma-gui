import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import(/* webpackChunkName: "home" */ "./views/Home.vue")
    },
    {
      path: "/services",
      name: "services",
      component: () => import(/* webpackChunkName: "services" */ "./views/Services.vue")
    },
    {
      path: "/traffic-permissions",
      name: "traffic-permissions",
      component: () => import(/* webpackChunkName: "traffic-permissions" */ "./views/Traffic/Permissions.vue")
    },
    {
      path: "/traffic-routes",
      name: "traffic-routes",
      component: () => import(/* webpackChunkName: "traffic-routes" */ "./views/Traffic/Routes.vue")
    }
  ]
});
