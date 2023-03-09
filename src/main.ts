import App from './app/App.vue'
import { TOKENS, get } from '@/services'

async function mountVueApplication() {
  const env = get(TOKENS.env)
  const kumaApi = get(TOKENS.api)
  // During development setBaseUrl also optionally installs MSW mocking via MockKumaApi
  kumaApi.setBaseUrl(env('KUMA_API_URL'))

  const app = await get(TOKENS.app)(App)
  app.mount('#app')

  get(TOKENS.bootstrap)()
}

mountVueApplication()
