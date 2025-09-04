import { base, en } from '@faker-js/faker'

import FakeKuma from './FakeKuma'
import type { Env } from '@/app/application'
import type { RestRequest, MockResponder, FS as FakeFS } from '@kumahq/fake-api'

export type { MockResponder }
export type FS = FakeFS<EndpointDependencies>

type Pager = (total: string | number, req: RestRequest, self: string) => {
  next: string | undefined
  pageTotal: number
  total: number
  offset: number
  size: number
}
const pager: Pager = (_total: string | number, req: RestRequest, self) => {
  const baseUrl = 'http://localhost:5681'
  const total = parseInt(`${_total}`)
  const query = req.url.searchParams
  const size = parseInt(query.get('size') || '10')
  const offset = parseInt(query.get('offset') || '0')

  const remaining = total - offset
  const pageTotal = Math.min(size, remaining)
  const next = remaining <= size ? undefined : `${baseUrl}${self}?size=${size}offset=${offset + size}`
  return {
    next,
    pageTotal,
    total,
    offset,
    size,
  }
}
export type MockEnv = {
  FAKE_SEED: string
  KUMA_RULE_MATCHER_COUNT: string
  KUMA_DATAPLANE_COUNT: string
  KUMA_DATAPLANE_TYPE: string
  KUMA_DATAPLANEINBOUND_COUNT: string
  KUMA_DATAPLANEOUTBOUND_COUNT: string
  KUMA_DATAPLANE_PROXY_RULE_ENABLED: string
  KUMA_DATAPLANE_RULE_COUNT: string
  KUMA_DATAPLANE_TO_RULE_COUNT: string
  KUMA_DATAPLANE_FROM_RULE_COUNT: string
  KUMA_DATAPLANE_INBOUND_RULE_COUNT: string
  KUMA_CIRCUITBREAKER_COUNT: string
  KUMA_FAULTINJECTION_COUNT: string
  KUMA_MESHFAULTINJECTION_COUNT: string
  KUMA_MESHHTTPROUTES_COUNT: string
  KUMA_MESHGATEWAY_COUNT: string
  KUMA_MESHSERVICE_MODE: string
  KUMA_LISTENER_COUNT: string
  KUMA_RULE_MATCH_COUNT: string
  KUMA_SERVICE_COUNT: string
  KUMA_MULTIZONESERVICE_COUNT: string
  KUMA_EXTERNALSERVICE_COUNT: string
  KUMA_ZONEEGRESS_COUNT: string
  KUMA_ZONEINGRESS_COUNT: string
  KUMA_ZONE_COUNT: string
  KUMA_ZONE_NAME: string
  KUMA_CLUSTER_NAME: string
  KUMA_MESH_COUNT: string
  KUMA_SUBSCRIPTION_COUNT: string
  KUMA_GLOBALSECRET_COUNT: string
  KUMA_MODE: string
  KUMA_MTLS_ENABLED: string
  KUMA_STORE_TYPE: string
  KUMA_LATENCY: string
  KUMA_STATUS_CODE: string
  KUMA_RESOURCE_COUNT: string
  KUMA_ACTIVE_RESOURCE_COUNT: string
  KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: string
  KUMA_DATAPLANE_TLS_ISSUED_MESHIDENTITY: string
  KUMA_MESHIDENTITY_COUNT: string
  KUMA_MESHTRUST_COUNT: string
}

type AppEnv = Parameters<Env>[0]
type EnvKeys = keyof MockEnv | AppEnv

export type EndpointDependencies = {
  fake: FakeKuma
  pager: Pager
  env: (key: EnvKeys, d?: string) => string
}
export const dependencies = {
  fake: new FakeKuma({ locale: [base, en] }),
  pager,
  env: <T extends string = EnvKeys>(_key: T, d = '') => d,
}
