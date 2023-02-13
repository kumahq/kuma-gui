import { TOKENS, get } from '@/services'
import App from './app/App.vue'
(async () => {
  await get(TOKENS.app)(App)
})()
