import Vue from "vue";
import Router from "vue-router";
import Overview from "./views/Overview.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "overview",
      component: () => import(/* webpackChunkName: "overview" */ "./views/Overview.vue")
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
    },
    // dynamic routes
    {
      path: "/overview/:entity",
      name: "overview-entity",
      component: () => import(/* webpackChunkName: "overview-entity" */ "./views/Overview.vue")
    }
  ]
});
