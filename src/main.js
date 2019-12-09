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
   * If the API URL and environment are not set in localStorage,
   * set them and mount the app.
   */
  if (!localStorage.getItem('kumaApiUrl') && !localStorage.getItem('kumaEnv')) {
    axios
      .get(process.env.VUE_APP_KUMA_CONFIG)
      .then(response => {
        const apiUrl = response.data.apiUrl
        const kumaEnv = response.data.environment

        localStorage.setItem('kumaApiUrl', apiUrl)
        localStorage.setItem('kumaEnv', kumaEnv)
      })
      .then(() => {
        VUE_APP()
      })
      .catch(error => {
        console.error(error)
      })
  } else {
    /**
     * If they are already present, skip needlessly querying the config
     * endpoint and move forward with mounting the app.
     */
    VUE_APP()
  }
}

/**
 * Now we can run our app
 */
SETUP_VUE_APP()
