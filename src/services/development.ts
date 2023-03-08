import { TOKENS } from './production'
import { injected, set } from './utils'
import { mocks } from '@/api/mocks'
import CookiedEnv from '@/services/env/CookiedEnv'
import DisabledLogger from '@/services/logger/DisabledLogger'

export { service, constant, get, set, container, injected, createInjections } from './utils'
export { TOKENS } from './production'

set(TOKENS.Env, CookiedEnv)
set(TOKENS.logger, DisabledLogger)
set(TOKENS.mocks, () => mocks)

injected(CookiedEnv, TOKENS.EnvVars)
injected(DisabledLogger, TOKENS.Env)
