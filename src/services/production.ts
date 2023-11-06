import Kongponents from '@kong/kongponents'

import createDisabledLogger from './logger/DisabledLogger'
import { TOKENS as _TOKENS } from './tokens'
import { services as application, TOKENS as APPLICATION } from '@/app/application'
import { services as kuma } from '@/app/kuma'
import { services as me } from '@/app/me'
import { services as meshes } from '@/app/meshes'
import { services as vue, TOKENS as VUE } from '@/app/vue'
import { services as zones } from '@/app/zones'
import i18nEnUs from '@/locales/en-us'
import type { EnvArgs } from '@/services/env/Env'
import KumaApi from '@/services/kuma-api/KumaApi'
import { RestClient } from '@/services/kuma-api/RestClient'
import type { ServiceConfigurator } from '@/services/utils'
import { token } from '@/services/utils'

const $ = {
  ...VUE,
  ...APPLICATION,
  ..._TOKENS,
}
type SupportedTokens = typeof $
export const services: ServiceConfigurator<SupportedTokens> = ($) => [

  [$.EnvVars, {
    constant: {
      KUMA_PRODUCT_NAME: import.meta.env.VITE_NAMESPACE,
      KUMA_FEEDBACK_URL: import.meta.env.VITE_FEEDBACK_URL,
      KUMA_CHAT_URL: import.meta.env.VITE_CHAT_URL,
      KUMA_INSTALL_URL: import.meta.env.VITE_INSTALL_URL,
      KUMA_VERSION_URL: import.meta.env.VITE_VERSION_URL,
      KUMA_DOCS_URL: import.meta.env.VITE_DOCS_BASE_URL,
      KUMA_MOCK_API_ENABLED: import.meta.env.VITE_MOCK_API_ENABLED,
      KUMA_ZONE_CREATION_FLOW: import.meta.env.VITE_ZONE_CREATION_FLOW,
    } as EnvArgs,
  }],

  // KumaAPI
  [$.httpClient, {
    service: RestClient,
    arguments: [
      $.env,
    ],
  }],
  [$.api, {
    service: KumaApi,
    arguments: [
      $.httpClient,
      $.env,
    ],
  }],

  // Logger
  [$.logger, {
    service: createDisabledLogger,
  }],

  [token('kong.plugins'), {
    service: () => {
      return [
        [Kongponents],
      ]
    },
    labels: [
      $.plugins,
    ],
  }],
  [token('kuma.i18n.en-us'), {
    constant: i18nEnUs,
    labels: [
      $.enUs,
    ],
  }],

  // application
  ...vue($),
  ...application({
    ...$,
    routes: $.routesLabel,
  }),
  ...me($),
  ...kuma($),
  //

  // service-mesh
  ...zones({
    ...$,
    routes: $.routesLabel,
  }),
  ...meshes({
    ...$,
    routes: $.routesLabel,
  }),
  //
]

export const TOKENS = $
