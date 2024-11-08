import { services as controlPlanes } from '@/app/control-planes'
import { services as hostnameGenerators } from '@/app/hostname-generators'
import { services as meshes } from '@/app/meshes'
import { services as zones } from '@/app/zones'
import type { ServiceConfigurator, Token } from '@/services/utils'

type SupportedTokens = {
  routes: Token
}
export const services: ServiceConfigurator<SupportedTokens> = ($) => [
  ...controlPlanes($),
  ...zones($),
  ...meshes($),
  ...hostnameGenerators($),
]
