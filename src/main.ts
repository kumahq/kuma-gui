import App from './app/App.vue'
import { TOKENS, get } from '@/services'

async function mountVueApplication() {
  const env = get(TOKENS.env)
  const kumaApi = get(TOKENS.api)
  kumaApi.baseUrl = env('KUMA_API_URL')

  const app = await get(TOKENS.app)(App)
  app.mount('#app')

  get(TOKENS.bootstrap)()
}

mountVueApplication()
