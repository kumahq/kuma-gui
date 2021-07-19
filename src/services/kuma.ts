import RestClient from '@/services/restClient'

export default class Kuma {
  client: RestClient

  constructor () {
    this.client = new RestClient()
  }

  buildUrl (path: string) {
    return this.client.buildUrl(path)
  }

  /**
   * Info / Config
   */

  getInfo () {
    return this.client.get('/')
  }

  getStatus () {
    return this.client.status('/')
  }

  getConfig () {
    return this.client.getConfig()
  }

  /**
   * Custom query
   */
  query (model: string, params: any) {
    return this.client.get(`/${model}`, { params })
  }

  /**
   * Zones
   */

  // Zone status
  getZoneStatus (params: any) {
    return this.client.get('/status/zones', { params })
  }

  // Zones
  getZones (params?: any) {
    return this.client.get('/zones', { params })
  }

  /**
   * Zone Insights
   */

  // Get all Zone Insights/Overviews
  getAllZoneOverviews (params: any) {
    return this.client.get('/zones+insights', { params })
  }

  // Get a single Zone Insight/Overview
  getZoneOverview (name: string, params?: any) {
    return this.client.get(`/zones+insights/${name}`, { params })
  }

  /**
   * Zone Ingress Insights
   */

  // Get all Zone Ingress Insights/Overviews
  getAllZoneIngressOverviews (params: any) {
    return this.client.get('/zoneingresses+insights', { params })
  }

  // Get a single Zone Ingress Insight/Overview
  getZoneIngressOverview (name: string, params?: any) {
    return this.client.get(`/zoneingresses+insights/${name}`, { params })
  }

  /**
   * Meshes
   */

  // get a list of all meshes
  getAllMeshes (params: any) {
    return this.client.get('/meshes', { params })
  }

  // get a single mesh
  getMesh (name: string, params: any) {
    return this.client.get(`/meshes/${name}`, { params })
  }

  /**
   * Dataplanes
   */

  getAllDataplanes (params: any) {
    return this.client.get('/dataplanes', { params })
  }

  // get a list of all dataplanes
  getAllDataplanesFromMesh (name: string, params?: any) {
    return this.client.get(`/meshes/${name}/dataplanes`, { params })
  }

  // get a single dataplane
  getDataplaneFromMesh (name: string, dataplane: string, params: any) {
    return this.client.get(`/meshes/${name}/dataplanes/${dataplane}`, { params })
  }

  /**
   * Dataplane Overviews
   */

  // get a specific dataplane overview from its associated mesh
  getDataplaneOverviewFromMesh (mesh: string, dataplane: string, params?: any) {
    return this.client.get(`/meshes/${mesh}/dataplanes+insights/${dataplane}`, { params })
  }

  // get all dataplane overviews from a specific mesh
  getAllDataplaneOverviewsFromMesh (mesh: string, params: any) {
    return this.client.get(`/meshes/${mesh}/dataplanes+insights`, { params })
  }

  // get all dataplane overviews
  getAllDataplaneOverviews (params: any) {
    return this.client.get('/dataplanes+insights', { params })
  }

  /**
   * Traffic Logs
   */

  // get all traffic logs
  getAllTrafficLogs (params: any) {
    return this.client.get('/traffic-logs', { params })
  }

  // get all traffic logs from mesh
  getAllTrafficLogsFromMesh (mesh: string, params: any) {
    return this.client.get(`/meshes/${mesh}/traffic-logs`, { params })
  }

  // get traffic log details
  getTrafficLog (mesh: string, trafficlog: string, params: any) {
    return this.client.get(`/meshes/${mesh}/traffic-logs/${trafficlog}`, { params })
  }

  /**
   * Traffic Permissions
   */

  // get traffic permissions
  getAllTrafficPermissions (params: any) {
    return this.client.get('/traffic-permissions', { params })
  }

  // get traffic permissions from mesh
  getAllTrafficPermissionsFromMesh (mesh: string, params: any) {
    return this.client.get(`/meshes/${mesh}/traffic-permissions`, { params })
  }

  // get traffic permission details
  getTrafficPermission (mesh: string, trafficpermission: string, params: any) {
    return this.client.get(`/meshes/${mesh}/traffic-permissions/${trafficpermission}`, { params })
  }

  /**
   * Traffic Routes
   */

  // get all traffic routes
  getAllTrafficRoutes (params: any) {
    return this.client.get('/traffic-routes', { params })
  }

  // get traffic routes from mesh
  getAllTrafficRoutesFromMesh (mesh: string, params: any) {
    return this.client.get(`/meshes/${mesh}/traffic-routes`, { params })
  }

  // get traffic route details
  getTrafficRoute (mesh: string, trafficroute: string, params: any) {
    return this.client.get(`/meshes/${mesh}/traffic-routes/${trafficroute}`, { params })
  }

  /**
   * Traffic Traces
   */

  // get all traffic traces
  getAllTrafficTraces (params: any) {
    return this.client.get('/traffic-traces', { params })
  }

  // get traffic traces from mesh
  getAllTrafficTracesFromMesh (mesh: string, params: any) {
    return this.client.get(`/meshes/${mesh}/traffic-traces`, { params })
  }

  // get traffic trace details
  getTrafficTrace (mesh: string, traffictrace: string, params: any) {
    return this.client.get(`/meshes/${mesh}/traffic-traces/${traffictrace}`, { params })
  }

  /**
   * Proxy Templates
   */

  // get all proxy templates
  getAllProxyTemplates (params: any) {
    return this.client.get('/proxytemplates', { params })

    // this may change to this:
    // return this.client.get('/proxy-templates', { params })
  }

  // get all proxy templates from mesh
  getAllProxyTemplatesFromMesh (mesh: string, params: any) {
    return this.client.get(`/meshes/${mesh}/proxytemplates`, { params })
  }

  // get proxy template details
  getProxyTemplate (mesh: string, proxytemplate: string, params: any) {
    return this.client.get(`/meshes/${mesh}/proxytemplates/${proxytemplate}`, { params })
  }

  /**
   * Health Checks
   */

  // get all health checks
  getAllHealthChecks (params: any) {
    return this.client.get('/health-checks', { params })
  }

  // get all health checks from mesh
  getAllHealthChecksFromMesh (mesh: string, params: any) {
    return this.client.get(`/meshes/${mesh}/health-checks`, { params })
  }

  // get health check details
  getHealthCheck (mesh: string, name: string, params: any) {
    return this.client.get(`/meshes/${mesh}/health-checks/${name}`, { params })
  }

  /**
   * Fault Injections
   */

  // get all fault injections
  getAllFaultInjections (params: any) {
    return this.client.get('/fault-injections', { params })
  }

  // get all fault injections from mesh
  getAllFaultInjectionsFromMesh (mesh: string, params: any) {
    return this.client.get(`/meshes/${mesh}/fault-injections`, { params })
  }

  // get fault injection details
  getFaultInjection (mesh: string, faultinjection: string, params: any) {
    return this.client.get(`/meshes/${mesh}/fault-injections/${faultinjection}`, { params })
  }

  /**
   * Circuit Breakers
   */

  // get all circuit breakers
  getAllCircuitBreakers (params: any) {
    return this.client.get('/circuit-breakers', { params })
  }

  // get all circuit breakers from mesh
  getAllCircuitBreakersFromMesh (mesh: string, params: any) {
    return this.client.get(`/meshes/${mesh}/circuit-breakers`, { params })
  }

  // get circuit breaker details
  getCircuitBreaker (mesh: string, circuitbreaker: string, params: any) {
    return this.client.get(`/meshes/${mesh}/circuit-breakers/${circuitbreaker}`, { params })
  }

  /**
   * Rate Limits
   */

  // get all rate limits
  getAllRateLimits (params: any) {
    return this.client.get('/rate-limits', { params })
  }

  // get all rate limits from mesh
  getAllRateLimitsFromMesh (mesh: string, params: any) {
    return this.client.get(`/meshes/${mesh}/rate-limits`, { params })
  }

  // get rate limit details
  getRateLimit (mesh: string, ratelimit: string, params: any) {
    return this.client.get(`/meshes/${mesh}/rate-limits/${ratelimit}`, { params })
  }

  /**
   * Retries
   */

  // get all retries
  getAllRetries (params: any) {
    return this.client.get('/retries', { params })
  }

  // get all retries from mesh
  getAllRetriesFromMesh (mesh: string, params: any) {
    return this.client.get(`/meshes/${mesh}/retries`, { params })
  }

  // get retry details
  getRetry (mesh: string, retry: string, params: any) {
    return this.client.get(`/meshes/${mesh}/retries/${retry}`, { params })
  }

  /**
   * Timeouts
   */

  // get all timeouts
  getAllTimeouts (params: any) {
    return this.client.get('/timeouts', { params })
  }

  // get all timeouts from mesh
  getAllTimeoutsFromMesh (mesh: string, params: any) {
    return this.client.get(`/meshes/${mesh}/timeouts`, { params })
  }

  // get timeout details
  getTimeout (mesh: string, timeout: string, params: any) {
    return this.client.get(`/meshes/${mesh}/timeouts/${timeout}`, { params })
  }

  /**
   * External Services
   */

  // get all external services
  getAllExternalServices (params: any) {
    return this.client.get('/external-services', { params })
  }

  // get all external services from mesh
  getAllExternalServicesFromMesh (mesh: string, params: any) {
    return this.client.get(`/meshes/${mesh}/external-services`, { params })
  }

  // get external service details
  getExternalService (mesh: string, externalservice: string, params: any) {
    return this.client.get(`/meshes/${mesh}/external-services/${externalservice}`, { params })
  }

  /**
   * Service Insights
   */

  // get all services
  getAllServiceInsights (params: any) {
    return this.client.get('/service-insights', { params })
  }

  // get all services from mesh
  getAllServiceInsightsFromMesh (mesh: string, params: any) {
    return this.client.get(`/meshes/${mesh}/service-insights`, { params })
  }

  // get service details
  getServiceInsight (name: string, service: string, params: any) {
    return this.client.get(`/meshes/${name}/service-insights/${service}`, { params })
  }

  /**
   * Mesh Insights
   */

  // Get all Mesh Insights
  getAllMeshInsights (params: any) {
    return this.client.get('/mesh-insights', { params })
  }

  // Get a single Mesh Insight
  getMeshInsights (name: string, params?: any) {
    return this.client.get(`/mesh-insights/${name}`, { params })
  }

  getSupportedVersions (params?: any) {
    return this.client.get('/versions', { params })
  }
}
