import { TOKENS } from './production'
import { injected, set, constant } from './utils'
import CookiedEnv from '@/services/env/CookiedEnv'
import DisabledLogger from '@/services/logger/DisabledLogger'
import MockKumaApi from '@/services/kuma-api/MockKumaApi'
import { mocks } from '@/api/mocks'

export { service, constant, get, set, container, injected, createInjections } from './utils'
export { TOKENS } from './production'

const MOCKS = constant(mocks, { description: 'mocks' })

set(TOKENS.Env, CookiedEnv)
set(TOKENS.api, MockKumaApi)
set(TOKENS.logger, DisabledLogger)
injected(CookiedEnv, TOKENS.EnvVars)
injected(MockKumaApi, TOKENS.Env, MOCKS)
injected(DisabledLogger, TOKENS.Env)
