import { service, constant, get, injected } from './utils'
import Env, { EnvArgs, EnvVars } from '@/services/env/Env'
import routes from '@/router/routes'
import { store } from '@/store/store'
import { getNavItems } from '@/app/getNavItems'

export const TOKENS = {
  EnvVars: constant({
    KUMA_PRODUCT_NAME: import.meta.env.VITE_NAMESPACE,
    KUMA_FEEDBACK_URL: import.meta.env.VITE_FEEDBACK_URL,
    KUMA_CHAT_URL: import.meta.env.VITE_CHAT_URL,
    KUMA_INSTALL_URL: import.meta.env.VITE_INSTALL_URL,
    KUMA_VERSION_URL: import.meta.env.VITE_VERSION_URL,
    KUMA_DOCS_URL: import.meta.env.VITE_DOCS_BASE_URL,
  } as EnvArgs, { description: 'EnvVars' }),
  Env: service(Env, { description: 'Env' }),

  env: service(() => (key: keyof EnvVars) => get(TOKENS.Env).var(key), { description: 'env' }),
  routes: service(() => routes(store), { description: 'routes' }),
  nav: service(() => (multizone: boolean, hasMeshes: boolean) => getNavItems(multizone, hasMeshes), { description: 'nav' }),
}
injected(Env, TOKENS.EnvVars)
