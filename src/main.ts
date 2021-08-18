import Vue from 'vue'
import Vuex from 'vuex'
import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import VueMeta from 'vue-meta'
import App from '@/App.vue'
import Router from '@/router'
import Store from '@/store'

/** amCharts */
import * as am4core from '@amcharts/amcharts4/core'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'

/** Kongponents */
import './kongponents'

/** Tailwind */
import '@/assets/styles/third-party/tailwind.css'

/** Styles */
import '@/assets/styles/variables.scss'
import '@/assets/styles/utilities.scss'
import '@/assets/styles/fonts.scss'
import '@/assets/styles/main.scss'
import '@/assets/styles/typography.scss'
import '@/assets/styles/inputs.scss'
import '@/assets/styles/components.scss'
import '@/assets/styles/transitions.scss'

/* Initiate Datadog Logs */

if (process.env.NODE_ENV === 'production') {
  datadogLogs.init({
    clientToken: process.env.VUE_APP_DATADOG_LOGS_CLIENT_TOKEN,
    site: process.env.VUE_APP_DATADOG_SITE,
    forwardErrorsToLogs: true,
    service: process.env.VUE_APP_NAMESPACE,
    sampleRate: 100,
    env: process.env.NODE_ENV,
  })
}

/* Initiate Datadog RUM */

if (process.env.NODE_ENV === 'production') {
  datadogRum.init({
    applicationId: process.env.VUE_APP_DATADOG_RUM_APPLICATION_ID,
    clientToken: process.env.VUE_APP_DATADOG_RUM_CLIENT_TOKEN,
    site: process.env.VUE_APP_DATADOG_SITE,
    sampleRate: 100,
    trackInteractions: true,
    env: process.env.NODE_ENV,
  })
}

/** Initiate plugins */
Vue.use(VueMeta)

Vue.config.productionTip = false

am4core.useTheme(am4themesAnimated)

/**
 * APP SETUP
 */

/** the app itself */
function VUE_APP() {
  const store = new Vuex.Store(Store())
  const router = Router(store)

  new Vue({
    store,
    router,
    render: h => h(App),
  }).$mount('#app')
}

VUE_APP()

if (process.env.VUE_APP_AMCHARTS_LICENSE) {
  am4core.addLicense(process.env.VUE_APP_AMCHARTS_LICENSE)
}
