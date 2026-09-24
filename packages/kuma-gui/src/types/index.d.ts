import type { components } from '@kumahq/kuma-http-api'
type KumaDataplaneNetworking = NonNullable<components['schemas']['DataplaneItem']['networking']>
type ResourceRule = components['schemas']['ResourceRule']

export type StatusKeyword = 'online' | 'offline' | 'partially_degraded' | 'not_available' | 'disconnected_cp'

export type Tags = Record<string, string>

export type ServiceTags = Tags & Record<'kuma.io/service', string>

// https://kuma.io/docs/latest/policies/targetref/
export interface TargetRef<T extends string = string> {
  kind: T
  mesh?: string
  name?: string
  proxyTypes?: Array<'Sidecar' | 'Gateway'>
  tags?: Tags
  weight?: number
}

export interface ToTargetRefRuleMatchHeader {
  name: string
  type?: 'Exact' | 'Present' | 'RegularExpression' | 'Absent' | 'Prefix'
  value?: string
}

export interface ToTargetRefRuleMatchQueryParameter {
  name: string
  type: 'Exact' | 'RegularExpression'
  value: string
}

export interface ToTargetRefRuleMatch {
  headers?: ToTargetRefRuleMatchHeader[]
  method?: 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE'
  path?: {
    type: 'Exact' | 'PathPrefix' | 'RegularExpression'
    value: string
  }
  queryParams?: ToTargetRefRuleMatchQueryParameter[]
}

export interface RequestHeaderModifierFilter {
  type: 'RequestHeaderModifier'
  requestHeaderModifier: {
    add?: Array<{ name: string, value: string }>
    set?: Array<{ name: string, value: string }>
    remove?: string[]
  }
}

export interface ResponseHeaderModifierFilter {
  type: 'ResponseHeaderModifier'
  responseHeaderModifier: {
    add?: Array<{ name: string, value: string }>
    set?: Array<{ name: string, value: string }>
    remove?: string[]
  }
}

export interface RequestRedirectFilter {
  type: 'RequestRedirect'
  requestRedirect: {
    hostname?: string
    path?: { type: 'ReplaceFullPath', replaceFullPath: string } | { type: 'ReplacePrefixMatch', replacePrefixMatch: string }
    port?: number
    schema?: 'http' | 'https'
    statusCode?: number
  }
}

export interface URLRewriteFilter {
  type: 'URLRewrite'
  urlRewrite: {
    hostToBackendHostname?: boolean
    hostname?: string
    path?: { type: 'ReplaceFullPath', replaceFullPath: string } | { type: 'ReplacePrefixMatch', replacePrefixMatch: string }
  }
}

export interface RequestMirrorFilter {
  type: 'RequestMirror'
  requestMirror: {
    backendRef: TargetRef<'Mesh' | 'MeshSubset' | 'MeshGateway' | 'MeshService' | 'MeshServiceSubset' | 'MeshHTTPRoute'>
    percentage?: string | number
  }
}

export type ToTargetRefFilter = RequestHeaderModifierFilter | ResponseHeaderModifierFilter | RequestRedirectFilter | URLRewriteFilter | RequestMirrorFilter

export interface ToTargetRefRule {
  matches: ToTargetRefRuleMatch[]
  default: {
    backendRefs?: TargetRef[]
    filters?: ToTargetRefFilter[]
  }
}

export interface ToTargetRef<T extends string = string> {
  targetRef: TargetRef<T>
  hostnames?: string[]
  rules: ToTargetRefRule[]
}

export interface LabelValue {
  label: string
  value: string
}

export interface Entity {
  type: string
  name: string
  kri?: string
  creationTime?: string
  modificationTime?: string
}

export interface MeshEntity extends Entity {
  mesh: string
  labels?: Record<string, string>
}

export interface Meta<Type extends string = string> {
  type: Type
  mesh: string
  name: string
  kri?: string
}

export interface RuleConf {
  rules?: ToTargetRefRule[]
  matches?: ToTargetRefRuleMatch[]
  origin?: Meta[]
  hostnames?: string[]
  default?: {
    backendRefs?: TargetRef[]
  }
  [key: string]: unknown
}

export interface InspectRuleMatcher {
  key: string
  value: string
  not: boolean
}

export interface InspectBaseRule {
  matchers: InspectRuleMatcher[]
  conf: RuleConf
  origin: Meta[]
}

export interface InspectProxyRule {
  conf: RuleConf
  origin: Meta[]
}

export interface InspectInbound {
  tags: Record<string, string>
  port: number
}

export interface InspectFromRule {
  inbound: InspectInbound
  rules: InspectBaseRule[]
}

export interface InspectRule {
  /**
   * Policy type
   */
  type: string
  proxyRule?: InspectProxyRule
  toResourceRules?: ResourceRule[]
  toRules?: InspectBaseRule[]
  fromRules?: InspectFromRule[]
  warnings?: string[]
}

export interface InspectRulesForDataplane {
  resource: Meta<'Dataplane' | 'MeshGateway'>
  rules: InspectRule[]
}

export type PolicyMatch = {
  match: ServiceTags
}

export interface MatchedPolicyType extends MeshEntity {
  sources?: PolicyMatch[]
  destinations?: PolicyMatch[]
  selectors?: Array<{ match: Record<string, string> }>
  conf?: any
}

export interface SidecarDataplane {
  type: 'inbound' | 'outbound' | 'service' | 'dataplane'
  service: string
  name: string
  matchedPolicies: Record<string, MatchedPolicyType[]>
}

export type PolicyTypeEntryConnection = {
  sourceTags: LabelValue[]
  destinationTags: LabelValue[]
  name: string | null
  origins: Meta[]
  config: string | undefined
}

export type PolicyTypeEntry = {
  type: string
  connections: PolicyTypeEntryConnection[]
}

export interface PolicyEntity extends MeshEntity {
  labels?: {
    'k8s.kuma.io/namespace'?: string
    'kuma.io/display-name'?: string
    'kuma.io/mesh'?: string
    'kuma.io/origin'?: 'zone'
    'kuma.io/zone'?: string
    'kuma.io/policy-role'?: 'producer' | 'consumer' | 'system' | 'workload-owner'
    [key: string]: string | undefined
  }
  spec?: {
    targetRef?: TargetRef
  }
}

// https://github.com/kumahq/kuma/blob/master/docs/generated/raw/crds/kuma.io_meshhttproutes.yaml
export interface MeshHTTPRoute extends PolicyEntity {
  spec: {
    targetRef?: TargetRef
    to: ToTargetRef<'Mesh' | 'MeshSubset' | 'MeshService' | 'MeshServiceSubset' | 'MeshGateway'>[]
  }
}

export interface PolicyDataplane {
  type: 'Dataplane'
  mesh: string
  name: string
  labels?: {
    'kuma.io/display-name'?: string
    'k8s.kuma.io/namespace'?: string
    [key: string]: string | undefined
  }
}

export interface KumaDpVersion {
  version: string
  gitTag: string
  gitCommit: string
  buildDate: string
  kumaCpCompatible?: boolean
}

export interface EnvoyVersion {
  version: string
  build: string
  kumaDpCompatible?: boolean
}

export interface KumaCpVersion {
  version?: string
  gitTag?: string
  gitCommit?: string
  buildDate?: string
  kumaCpGlobalCompatible?: boolean
}

export interface Version {
  envoy?: EnvoyVersion
  kumaDp?: KumaDpVersion
  kumaCp?: KumaCpVersion
  dependencies?: Record<string, string>
}

export interface DiscoveryServiceStats {
  responsesSent?: number
  responsesAcknowledged?: number
  responsesRejected?: number
}

export type SubscriptionStatus = {
  lastUpdateTime?: string
  total?: DiscoveryServiceStats
}

export type DiscoverySubscriptionStatus = {
  cds: DiscoveryServiceStats
  eds: DiscoveryServiceStats
  lds: DiscoveryServiceStats
  rds: DiscoveryServiceStats
} & SubscriptionStatus

export type Subscription = {
  id?: string
  connectTime?: string
  disconnectTime?: string
}

export type DiscoverySubscription = {
  version?: Version

  controlPlaneInstanceId: string
  generation?: number
  status: DiscoverySubscriptionStatus
} & Subscription

export interface DataPlaneInsight {
  mTLS?: Partial<{
    certificateExpirationTime: string
    lastCertificateRegeneration: string
    certificateRegenerations: number
    issuedBackend: string
    supportedBackends: string[]
  }>
  subscriptions: DiscoverySubscription[]
}

/**
 * Overview entity as returned via the `/meshes/:mesh/dataplanes/:dataPlane/_overview` endpoint.
 */
export interface DataPlaneOverview extends MeshEntity {
  type: 'DataplaneOverview'
  labels?: {
    'kuma.io/display-name'?: string
    'k8s.kuma.io/namespace'?: string
    [key: string]: string
  }
  dataplane: {
    networking: KumaDataplaneNetworking
  }
  dataplaneInsight?: DataPlaneInsight
}
