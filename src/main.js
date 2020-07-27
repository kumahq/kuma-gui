import Vue from 'vue'
import App from '@/App.vue'
import Router from '@/router'
import VueMeta from 'vue-meta'
import Store from '@/store'
import axios from 'axios'
import Kuma from '@/services/kuma'

/** Sentry */
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

/** Kongponents */
import './kongponents'

/** Tailwind */
import '@/assets/styles/third-party/tailwind.css'

/** Styles */
import '@/assets/styles/kong-manager/inputs.css'
import '@/assets/styles/variables.css'
import '@/assets/styles/utilities.css'
import '@/assets/styles/fonts.css'
import '@/assets/styles/main.css'
import '@/assets/styles/typography.css'
import '@/assets/styles/inputs.css'
import '@/assets/styles/components.css'
import '@/assets/styles/transitions.css'

/** Initiate Sentry */
let sentryDebugging = false

if (process.env.NODE_ENV === 'development') {
  sentryDebugging = true
}

/**
 * Sentry integration
 *
 * Sentry's out-of-box documentation implements this in a way that
 * does not work for everyone. To get error tracking working, the below
 * integration follows these instructions:
 *
 * https://github.com/getsentry/sentry-javascript/issues/2160#issuecomment-509964166
 */
Sentry.init({
  dsn: process.env.VUE_APP_SENTRY_DSN,
  integrations: integrations => [
    ...integrations,
    new Integrations.Vue({
      Vue,
      attachProps: true,
      logErrors: true,
      debug: sentryDebugging
    })
  ]
})

/** Send a test Sentry error */
// Sentry.captureException(new Error('Sentry test error.'))

/** Initiate plugins */
Vue.use(VueMeta)

Vue.config.productionTip = false

/**
 * APP SETUP
 */

/** the app itself */
function VUE_APP () {
  const kuma = new Kuma()

  // setup the HTTP API namespace
  Vue.prototype.$api = kuma

  // define the page size globally for fetching
  // API item count on table views
  Vue.prototype.$pageSize = 12

  const store = Store(kuma)
  const router = Router(store)

  new Vue({
    store,
    router,
    render: h => h(App)
  }).$mount('#app')
}

/** bootstrapping to run our Vue app */
function SETUP_VUE_APP () {
  /**
   * Always check the Kuma environment and api URL in storage
   * and update it upon GUI launch.
   */
  axios
    .get(process.env.VUE_APP_KUMA_CONFIG)
    .then(response => {
      const apiUrl = response.data.guiServer.apiServerUrl
      const kumaEnv = response.data.environment

      const storedKumaEnv = localStorage.getItem('kumaEnv') !== null
        ? localStorage.getItem('kumaEnv').toString()
        : null

      /**
       * Always check the API URL and set it accordingly for the app to access.
       */
      localStorage.setItem('kumaApiUrl', apiUrl)

      /**
       * If there is a mismatch between the Kuma environment value
       * in the config endpoint and localStorage, send the user
       * back through the onboarding process.
       */
      if (!storedKumaEnv || storedKumaEnv !== kumaEnv) {
        localStorage.setItem('kumaOnboardingComplete', false)
        localStorage.setItem('kumaEnv', kumaEnv)
      }
    })
    .then(() => {
      /**
       * Now that the foundation is set, move forward and launch the app.
       */
      VUE_APP()
    })
    .catch(error => {
      /** in the rare instance that we can't even load the /config endpoint. */
      VUE_APP()

      /** clear out any localStorage values */
      localStorage.removeItem('kumaApiUrl')
      localStorage.removeItem('kumaOnboardingComplete')
      localStorage.removeItem('kumaEnv')
      localStorage.removeItem('selectedMesh')

      console.error('There was a problem loading the config. Please try restarting Kuma.')
      console.error(error)
    })
}

/**
 * Now we can run our app
 */
SETUP_VUE_APP()
