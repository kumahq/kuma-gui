import { createApp } from 'vue'
import { addLicense, useTheme } from '@amcharts/amcharts4/core'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'

import App from './App.vue'
import { registerKongponents } from './register-kongponents'
import { setupRouter } from './router/router'
import { storeKey, store } from './store/store'
import { setupDatadog } from './datadog'
import Kuma from './services/kuma'

// TODO: Use `import '@kong/kongponents/dist/style.css'` instead.
// This is currently not possible because Kongponents doesn’t declare the specifier in the package.json’s exports field.
import '../node_modules/@kong/kongponents/dist/style.css'

import '@/assets/styles/third-party/tailwind.css'
import '@/assets/styles/variables.scss'
import '@/assets/styles/utilities.scss'
import '@/assets/styles/fonts.scss'
import '@/assets/styles/main.scss'
import '@/assets/styles/typography.scss'
import '@/assets/styles/inputs.scss'
import '@/assets/styles/components.scss'
import '@/assets/styles/transitions.scss'

if (process.env.NODE_ENV === 'production') {
  setupDatadog()
}

useTheme(am4themesAnimated)

async function initializeVue() {
  if (process.env.VUE_APP_MOCK_API_ENABLED === 'true') {
    // The combination of reading the environment variable and using dynamic import
    // ensures that msw isn’t actually bundled with the production application.
    const { setupMocks } = await import('./services/setup-mocks')

    setupMocks(Kuma.url)
  }

  const app = createApp(App)

  app.use(store, storeKey)

  const router = await setupRouter()

  app.use(router)

  registerKongponents(app)

  app.mount('#app')
}

initializeVue()

if (process.env.VUE_APP_AMCHARTS_LICENSE) {
  addLicense(process.env.VUE_APP_AMCHARTS_LICENSE)
}
