import { TOKENS } from './production'
import { injected, set } from './utils'
import CookiedEnv from '@/services/env/CookiedEnv'
import DisabledLogger from '@/services/logger/DisabledLogger'

export { service, constant, get, set, container, injected, createInjections } from './utils'
export { TOKENS } from './production'

set(TOKENS.Env, CookiedEnv)
set(TOKENS.logger, DisabledLogger)
injected(CookiedEnv, TOKENS.EnvVars)
injected(DisabledLogger, TOKENS.Env)
