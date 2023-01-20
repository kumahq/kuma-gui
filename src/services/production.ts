import { service, constant, get, injected } from './utils'
import Env, { EnvArgs, EnvVars } from '@/services/env/Env'
import routes from '../router/routes'
import { store } from '@/store/store'

export const TOKENS = {
  EnvVars: constant({
    KUMA_PRODUCT_NAME: import.meta.env.VITE_NAMESPACE,
    KUMA_FEEDBACK_URL: import.meta.env.VITE_FEEDBACK_URL,
    KUMA_CHAT_URL: import.meta.env.VITE_CHAT_URL,
    KUMA_INSTALL_URL: import.meta.env.VITE_INSTALL_URL,
    KUMA_DOCS_URL: import.meta.env.VITE_DOCS_BASE_URL,
  } as EnvArgs, { description: 'EnvVars' }),
  Env: service(Env, { description: 'Env' }),

  env: service(() => (key: keyof EnvVars) => get(TOKENS.Env).var(key), { description: 'env' }),
  routes: service(() => routes(store), { description: 'routes' }),
}
injected(Env, TOKENS.EnvVars)
