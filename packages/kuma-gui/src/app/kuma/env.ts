import { semver } from './utils'
import type { Variables } from '@kumahq/settings/env'

type HtmlVars = {
  version: string
  apiUrl: string
  baseGuiPath: string
  mode: string
  environment: string
  storeType: string
  //
  legacyServicesEnabled?: string
  zoneIngressesEnabled?: string
  zoneEgressesEnabled?: string
}
export const vars = (config: HtmlVars) => {
  const version = semver(config.version)
  return {
    KUMA_VERSION: () => version.pre,
    KUMA_API_URL: () => config.apiUrl,
    KUMA_BASE_PATH: () => config.baseGuiPath,
    KUMA_MODE: () => config.mode,
    KUMA_ENVIRONMENT: () => config.environment,
    KUMA_STORE_TYPE: () => config.storeType,
    //
    KUMA_VERSION_URL: () => 'https://kuma.io/latest_version',
    //
    KUMA_RESOURCES_ROUTE_ENABLED: () => 'false',
    KUMA_LEGACY_SERVICES_ENABLED: () => config.legacyServicesEnabled ?? 'false',
    KUMA_ZONE_INGRESSES_ENABLED: () => config.zoneIngressesEnabled ?? 'false',
    KUMA_ZONE_EGRESSES_ENABLED: () => config.zoneEgressesEnabled ?? 'false',
  }
}
declare module '@/app/application' {
  export interface Environment {
    env(...args: Variables<ReturnType<typeof vars>>): string
  }
}
