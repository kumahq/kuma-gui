import { createApp } from 'vue'
import { addLicense, useTheme } from '@amcharts/amcharts4/core'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'

import App from './app/App.vue'
import { registerKongponents } from './register-kongponents'
import { setupRouter } from './router/router'
import { storeKey, store } from './store/store'
import { setupDatadog } from './datadog'
import Kuma from './services/kuma'

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

async function initializeVue() {
  document.title = import.meta.env.VITE_NAMESPACE + ' Manager'

  if (import.meta.env.VITE_MOCK_API_ENABLED === 'true') {
    // The combination of reading the environment variable and using dynamic import
    // ensures that msw isn’t actually bundled with the production application.
    const { setupMockWorker } = await import('./services/setupMockWorker')

    setupMockWorker(Kuma.url)
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
