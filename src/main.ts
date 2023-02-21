import { TOKENS, get } from '@/services'
import App from './app/App.vue'
(async () => {
  const app = await get(TOKENS.app)(App)
  app.mount('#app')
})()
