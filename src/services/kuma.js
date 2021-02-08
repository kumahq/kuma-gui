import RestClient from '@/services/restClient'

export default class Kuma {
  constructor (options) {
    const opts = options || {}

    this.options = opts
    this.client = new RestClient(opts)
  }

  buildUrl (path) {
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
    return this.client.getConfig('/')
  }

  /**
   * Custom query
   */
  query (model, params) {
    return this.client.get(`/${model}`, { params })
  }

  /**
   * Zones
   */

  // Zone status
  getZoneStatus (params) {
    return this.client.get('/status/zones', { params })
  }

  // Zones
  getZones (params) {
    return this.client.get('/zones', { params })
  }

  /**
   * Zone Insights
   */

  // Get all Zone Insights/Overviews
  getAllZoneOverviews (params) {
    return this.client.get('/zones+insights', { params })
  }

  // Get a single Zone Insight/Overview
  getZoneOverview (name, params) {
    return this.client.get(`/zones+insights/${name}`, { params })
  }

  /**
   * Meshes
   */

  // get a list of all meshes
  getAllMeshes (params) {
    return this.client.get('/meshes', { params })
  }

  // get a single mesh
  getMesh (name, params) {
    return this.client.get(`/meshes/${name}`, { params })
  }

  /**
   * Dataplanes
   */

  getAllDataplanes (params) {
    return this.client.get('/dataplanes', { params })
  }

  // get a list of all dataplanes
  getAllDataplanesFromMesh (name, params) {
    return this.client.get(`/meshes/${name}/dataplanes`, { params })
  }

  // get a single dataplane
  getDataplaneFromMesh (name, dataplane, params) {
    return this.client.get(`/meshes/${name}/dataplanes/${dataplane}`, { params })
  }

  /**
   * Dataplane Overviews
   */

  // get a specific dataplane overview from its associated mesh
  getDataplaneOverviewFromMesh (mesh, dataplane, params) {
    return this.client.get(`/meshes/${mesh}/dataplanes+insights/${dataplane}`, { params })
  }

  // get all dataplane overviews from a specific mesh
  getAllDataplaneOverviewsFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/dataplanes+insights`, { params })
  }

  // get all dataplane overviews
  getAllDataplaneOverviews (params) {
    return this.client.get('/dataplanes+insights', { params })
  }

  /**
   * Traffic Logs
   */

  // get all traffic logs
  getAllTrafficLogs (params) {
    return this.client.get('/traffic-logs', { params })
  }

  // get all traffic logs from mesh
  getAllTrafficLogsFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/traffic-logs`, { params })
  }

  // get traffic log details
  getTrafficLog (mesh, trafficlog, params) {
    return this.client.get(`/meshes/${mesh}/traffic-logs/${trafficlog}`, { params })
  }

  /**
   * Traffic Permissions
   */

  // get traffic permissions
  getAllTrafficPermissions (params) {
    return this.client.get('/traffic-permissions', { params })
  }

  // get traffic permissions from mesh
  getAllTrafficPermissionsFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/traffic-permissions`, { params })
  }

  // get traffic permission details
  getTrafficPermission (mesh, trafficpermission, params) {
    return this.client.get(`/meshes/${mesh}/traffic-permissions/${trafficpermission}`, { params })
  }

  /**
   * Traffic Routes
   */

  // get all traffic routes
  getAllTrafficRoutes (params) {
    return this.client.get('/traffic-routes', { params })
  }

  // get traffic routes from mesh
  getAllTrafficRoutesFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/traffic-routes`, { params })
  }

  // get traffic route details
  getTrafficRoute (mesh, trafficroute, params) {
    return this.client.get(`/meshes/${mesh}/traffic-routes/${trafficroute}`, { params })
  }

  /**
   * Traffic Traces
   */

  // get all traffic traces
  getAllTrafficTraces (params) {
    return this.client.get('/traffic-traces', { params })
  }

  // get traffic traces from mesh
  getAllTrafficTracesFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/traffic-traces`, { params })
  }

  // get traffic trace details
  getTrafficTrace (mesh, traffictrace, params) {
    return this.client.get(`/meshes/${mesh}/traffic-traces/${traffictrace}`, { params })
  }

  /**
   * Proxy Templates
   */

  // get all proxy templates
  getAllProxyTemplates (params) {
    return this.client.get('/proxytemplates', { params })

    // this may change to this:
    // return this.client.get('/proxy-templates', { params })
  }

  // get all proxy templates from mesh
  getAllProxyTemplatesFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/proxytemplates`, { params })
  }

  // get proxy template details
  getProxyTemplate (mesh, proxytemplate, params) {
    return this.client.get(`/meshes/${mesh}/proxytemplates/${proxytemplate}`, { params })
  }

  /**
   * Health Checks
   */

  // get all health checks
  getAllHealthChecks (params) {
    return this.client.get('/health-checks', { params })
  }

  // get all health checks from mesh
  getAllHealthChecksFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/health-checks`, { params })
  }

  // get health check details
  getHealthCheck (mesh, name, params) {
    return this.client.get(`/meshes/${mesh}/health-checks/${name}`, { params })
  }

  /**
   * Fault Injections
   */

  // get all fault injections
  getAllFaultInjections (params) {
    return this.client.get('/fault-injections', { params })
  }

  // get all fault injections from mesh
  getAllFaultInjectionsFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/fault-injections`, { params })
  }

  // get fault injection details
  getFaultInjection (mesh, faultinjection, params) {
    return this.client.get(`/meshes/${mesh}/fault-injections/${faultinjection}`, { params })
  }

  /**
   * Circuit Breakers
   */

  // get all circuit breakers
  getAllCircuitBreakers (params) {
    return this.client.get('/circuit-breakers', { params })
  }

  // get all circuit breakers from mesh
  getAllCircuitBreakersFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/circuit-breakers`, { params })
  }

  // get circuit breaker details
  getCircuitBreaker (mesh, circuitbreaker, params) {
    return this.client.get(`/meshes/${mesh}/circuit-breakers/${circuitbreaker}`, { params })
  }

  /**
   * Retries
   */

  // get all retries
  getAllRetries (params) {
    return this.client.get('/retries', { params })
  }

  // get all retries from mesh
  getAllRetriesFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/retries`, { params })
  }

  // get retry details
  getRetry (mesh, retry, params) {
    return this.client.get(`/meshes/${mesh}/retries/${retry}`, { params })
  }

  /**
   * External Services
   */

  // get all external services
  getAllExternalServices (params) {
    return this.client.get('/external-services', { params })
  }

  // get all external services from mesh
  getAllExternalServicesFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/external-services`, { params })
  }

  // get external service details
  getExternalService (mesh, externalservice, params) {
    return this.client.get(`/meshes/${mesh}/external-services/${externalservice}`, { params })
  }

  /**
   * Service Insights
   */

  // get all services
  getAllServiceInsights (params) {
    return this.client.get('/service-insights', { params })
  }

  // get all services from mesh
  getAllServiceInsightsFromMesh (mesh, params) {
    return this.client.get(`/meshes/${mesh}/service-insights`, { params })
  }

  // get service details
  getServiceInsight (name, service, params) {
    return this.client.get(`/meshes/${name}/service-insights/${service}`, { params })
  }

  /**
   * Mesh Insights
   */

  // Get all Mesh Insights
  getAllMeshInsights (params) {
    return this.client.get('/mesh-insights', { params })
  }

  // Get a single Mesh Insight
  getMeshInsights (name, params) {
    return this.client.get(`/mesh-insights/${name}`, { params })
  }
}
