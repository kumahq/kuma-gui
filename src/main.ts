import App from './app/App.vue'
import { TOKENS, get } from '@/services'

async function mountVueApplication() {
  const app = await get(TOKENS.app)(App)
  app.mount('#app')
  get(TOKENS.bootstrap)()
}

mountVueApplication()
