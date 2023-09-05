export interface AccessScope {
  groups: String[]
  users: String[]
}

export interface Access {
  static: {
    adminResources: AccessScope
    generateDpToken: AccessScope
    generateUserToken: AccessScope
  }
  type: string
}

export interface Auth {
  clientCertsDir: string
}

export interface Authn {
  localhostIsAdmin: boolean
  tokens: {
    bootstrapAdminToken: boolean
  }
  type: string
}

export interface Http {
  enabled: boolean
  interface: string
  port: number
}

export interface Https {
  enabled: boolean
  interface: string
  port: number
  tlsCertFile: string
  tlsKeyFile: string
}

export interface ApiServer {
  auth: Auth
  authn: Authn
  corsAllowedDomains: string[]
  http: Http
  https: Https
  readOnly: boolean
}

export interface Params {
  adminAccessLogPath: string
  adminAddress: string
  adminPort: number
  xdsConnectTimeout: string
  xdsHost: string
  xdsPort: number
}

export interface BootstrapServer {
  params: Params
}

export interface Defaults {
  skipMeshCreation: boolean
}

export interface Diagnostics {
  debugEndpoints: boolean
  serverPort: number
}

export interface DnsServer {
  CIDR: string
  domain: string
  port: number
  serviceVipEnabled: boolean
}

export interface Auth2 {
  type: string
}

export interface CheckDefaults {
  healthyThreshold: number
  interval: string
  noTrafficInterval: string
  timeout: string
  unhealthyThreshold: number
}

export interface Hds {
  checkDefaults: CheckDefaults
  enabled: boolean
  interval: string
  refreshInterval: string
}

export interface DpServer {
  auth: Auth2
  hds: Hds
  port: number
  tlsCertFile: string
  tlsKeyFile: string
}

export interface General {
  dnsCacheTTL: string
  tlsCertFile: string
  tlsKeyFile: string
  workDir: string
}

export interface GuiServer {
  apiServerUrl: string
}

export interface Dataplane {
  idleTimeout: string
  subscriptionLimit: number
}

export interface Mesh {
  maxResyncTimeout: string
  minResyncTimeout: string
}

export interface Zone {
  idleTimeout: string
  subscriptionLimit: number
}

export interface Metrics {
  dataplane: Dataplane
  mesh: Mesh
  zone: Zone
}

export interface MonitoringAssignmentServer {
  apiVersions: string[]
  assignmentRefreshInterval: string
  defaultFetchTimeout: string
  grpcPort: number
  port: number
}

export interface Kds {
  grpcPort: number
  maxMsgSize: number
  refreshInterval: string
  tlsCertFile: string
  tlsKeyFile: string
  zoneInsightFlushInterval: string
}

export interface Global {
  kds: Kds
}

export interface Kds2 {
  maxMsgSize: number
  refreshInterval: string
  rootCaFile: string
}

export interface Zone2 {
  kds: Kds2
}

export interface Multizone {
  global: Global
  zone: Zone2
}

export interface Reports {
  enabled: boolean
}

export interface AdmissionServer {
  address: string
  certDir: string
  port: number
}

export interface BuiltinDNS {
  enabled: boolean
  port: number
}

export interface Labels {
  'openshift.io/build.name': string
  'openshift.io/deployer-pod-for.name': string
}

export interface Exceptions {
  labels: Labels
}

export interface InitContainer {
  image: string
}

export interface LivenessProbe {
  failureThreshold: number
  initialDelaySeconds: number
  periodSeconds: number
  timeoutSeconds: number
}

export interface ReadinessProbe {
  failureThreshold: number
  initialDelaySeconds: number
  periodSeconds: number
  successThreshold: number
  timeoutSeconds: number
}

export interface Limits {
  cpu: string
  memory: string
}

export interface Requests {
  cpu: string
  memory: string
}

export interface Resources {
  limits: Limits
  requests: Requests
}

export interface SidecarContainer {
  adminPort: number
  drainTime: string
  envVars: Record<string, string>
  gid: number
  image: string
  livenessProbe: LivenessProbe
  readinessProbe: ReadinessProbe
  redirectPortInbound: number
  redirectPortInboundV6: number
  redirectPortOutbound: number
  resources: Resources
  uid: number
}

export interface SidecarTraffic {
  excludeInboundPorts: any[]
  excludeOutboundPorts: any[]
}

export interface Injector {
  builtinDNS: BuiltinDNS
  caCertFile: string
  cniEnabled: boolean
  exceptions: Exceptions
  initContainer: InitContainer
  sidecarContainer: SidecarContainer
  sidecarTraffic: SidecarTraffic
  virtualProbesEnabled: boolean
  virtualProbesPort: number
}

export interface Kubernetes {
  admissionServer: AdmissionServer
  controlPlaneServiceName: string
  injector: Injector
  marshalingCacheExpirationTime: string
  serviceAccountName: string
}

export interface Universal {
  dataplaneCleanupAge: string
}

export interface Runtime {
  kubernetes: Kubernetes
  universal: Universal
}

export interface SdsServer {
  dataplaneConfigurationRefreshInterval: string
}

export interface Cache {
  enabled: boolean
  expirationTime: string
}

export interface Kubernetes2 {
  systemNamespace: string
}

export interface Tls {
  caPath: string
  certPath: string
  keyPath: string
  mode: string
}

export interface Postgres {
  connectionTimeout: number
  dbName: string
  host: string
  maxIdleConnections: number
  maxOpenConnections: number
  maxReconnectInterval: string
  minReconnectInterval: string
  password: string
  port: number
  tls: Tls
  user: string
}

export interface Upsert {
  conflictRetryBaseBackoff: string
  conflictRetryMaxTimes: number
}

export interface Store {
  cache: Cache
  kubernetes: Kubernetes2
  postgres: Postgres
  type: 'kubernetes' | 'postgres' | 'memory'
  upsert: Upsert
}

export interface XdsServer {
  dataplaneConfigurationRefreshInterval: string
  dataplaneStatusFlushInterval: string
  nackBackoff: string
}

export interface ClientConfigInterface {
  access: Access
  apiServer: ApiServer
  bootstrapServer: BootstrapServer
  defaults: Defaults
  diagnostics: Diagnostics
  dnsServer: DnsServer
  dpServer: DpServer
  environment: string
  general: General
  experimental: {}
  guiServer: GuiServer
  metrics: Metrics
  mode: string
  monitoringAssignmentServer: MonitoringAssignmentServer
  multizone: Multizone
  reports: Reports
  runtime: Runtime
  store: Store
  xdsServer: XdsServer
}

export interface ConfigInterface {
  clientConfig: ClientConfigInterface | null
  status: string | null
}
