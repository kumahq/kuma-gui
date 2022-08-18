import Vue from 'vue'
import Vuex from 'vuex'
import VueMeta from 'vue-meta'
import { addLicense, useTheme } from '@amcharts/amcharts4/core'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'

import App from '@/App.vue'
import Router, { getPolicyRoutes } from '@/router'
import Store from '@/store'

/** amCharts */

/** Kongponents */
import './kongponents'

/** Tailwind */
import '@/assets/styles/third-party/tailwind.css'

/** Prismjs */
import 'prismjs/themes/prism.css'

/** Styles */
import '@/assets/styles/variables.scss'
import '@/assets/styles/utilities.scss'
import '@/assets/styles/fonts.scss'
import '@/assets/styles/main.scss'
import '@/assets/styles/typography.scss'
import '@/assets/styles/inputs.scss'
import '@/assets/styles/components.scss'
import '@/assets/styles/transitions.scss'

import setupDatadog from '@/datadog'
/** Initiate Datadog */

if (process.env.NODE_ENV === 'production') {
  setupDatadog()
}

/** Initiate plugins */
Vue.use(VueMeta)

Vue.config.productionTip = false

useTheme(am4themesAnimated)

/**
 * APP SETUP
 */

/** the app itself */
async function VUE_APP() {
  const store = new Vuex.Store(Store())

  // Loads available policies in order to populate the necessary routes.
  await store.dispatch('fetchPolicies')
  const policyRoutes = getPolicyRoutes(store.state.policies)
  const router = Router(store, policyRoutes)

  new Vue({
    store,
    router,
    render: h => h(App),
  }).$mount('#app')
}

VUE_APP()

if (process.env.VUE_APP_AMCHARTS_LICENSE) {
  addLicense(process.env.VUE_APP_AMCHARTS_LICENSE)
}
