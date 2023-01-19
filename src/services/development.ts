import { TOKENS } from './production'
import { service, injected } from './utils'
import CookiedEnv from '@/services/env/CookiedEnv'

export { service, constant, get, container, injected, createInjections } from './utils'
export { TOKENS } from './production'

TOKENS.Env = service(CookiedEnv, { description: 'Env' })
injected(CookiedEnv, TOKENS.EnvVars)
