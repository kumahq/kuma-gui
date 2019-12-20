import Vue from 'vue'
import App from '@/App.vue'
import Router from '@/router'
import VueMeta from 'vue-meta'
import Store from '@/store'
import axios from 'axios'
import Kuma from '@/services/kuma'

// Globally import all Kongponents
import '@/kongponents'

// Third party styles
import '@/assets/styles/third-party/tailwind.css'

// Kong Manager styles
import '@/assets/styles/kong-manager/inputs.css'

// Kuma styles
import '@/assets/styles/variables.css'
import '@/assets/styles/utilities.css'
import '@/assets/styles/fonts.css'
import '@/assets/styles/main.css'
import '@/assets/styles/typography.css'
import '@/assets/styles/inputs.css'
import '@/assets/styles/components.css'

// Kong Design System styles
import '@kongponents/styles/styles.css'

// const kuma = new Kuma({
//   url: process.env.VUE_APP_KUMA_API || false
// })

Vue.use(VueMeta)
Vue.config.productionTip = false

/**
 * APP SETUP
 */

/** the app itself */
function VUE_APP () {
  const kuma = new Kuma()

  Vue.prototype.$api = kuma

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
      const apiUrl = response.data.apiUrl
      const kumaEnv = response.data.environment
      const storedKumaEnv = localStorage.getItem('kumaEnv') !== null ? localStorage.getItem('kumaEnv').toString() : null

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
      console.error(error)
    })
}

/**
 * Now we can run our app
 */
SETUP_VUE_APP()
