import { createApp } from 'vue'
import { addLicense, useTheme } from '@amcharts/amcharts4/core'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'

import App from './app/App.vue'
import { registerKongponents } from './utilities/registerKongponents'
import { setupRouter } from './router/router'
import { storeKey, store } from './store/store'
import { setupDatadog } from './utilities/setupDatadog'
import { kumaApi } from './api/kumaApi'

import '@kong/kongponents/dist/style.css'
import '@kong/kongponents/dist/_variables.scss'

import '@/assets/styles/third-party/tailwind.css'
import '@/assets/styles/variables.scss'
import '@/assets/styles/utilities.scss'
import '@/assets/styles/fonts.scss'
import '@/assets/styles/main.scss'
import '@/assets/styles/typography.scss'
import '@/assets/styles/inputs.scss'
import '@/assets/styles/components.scss'
import '@/assets/styles/transitions.scss'

if (import.meta.env.PROD) {
  setupDatadog()
}

useTheme(am4themesAnimated)

/**
 * Initializes and mounts the Vue application.
 *
 * This is a good place to run operations that should ideally be initiated or completed before the Vue application instance exists.
 */
async function initializeVue() {
  document.title = import.meta.env.VITE_NAMESPACE + ' Manager'

  if (import.meta.env.VITE_MOCK_API_ENABLED === 'true') {
    // The combination of reading the environment variable and using dynamic import
    // ensures that msw isn’t actually bundled with the production application.
    const { setupMockWorker } = await import('./api/setupMockWorker')

    setupMockWorker(kumaApi.url)
  }

  const app = createApp(App)

  app.use(store, storeKey)

  const router = await setupRouter()

  app.use(router)

  registerKongponents(app)

  app.mount('#app')
}

initializeVue()

if (import.meta.env.VITE_AMCHARTS_LICENSE) {
  addLicense(import.meta.env.VITE_AMCHARTS_LICENSE)
}
