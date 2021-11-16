import RestClient from '@/services/restClient'

class Kuma {
  private client: RestClient

  public constructor() {
    this.client = new RestClient()
  }

  /**
   * Info / Config
   */

  public getInfo() {
    return this.client.get('/')
  }

  public async getStatus() {
    let statusCode

    try {
      const { status } = await this.client.raw('/')

      statusCode = status
    } catch (e) {}

    return statusCode === 200 ? 'OK' : null
  }

  public getConfig() {
    return this.client.get('/config')
  }

  /**
   * Custom query
   */
  public query(model: string, params: any) {
    return this.client.get(`/${model}`, { params })
  }

  /**
   * Zones
   */

  // Zone status
  public getZonesStatus(params: any) {
    return this.client.get('/status/zones', { params })
  }

  // Zones
  public getZones(params: any) {
    return this.client.get('/zones', { params })
  }

  // Zones
  public getZone({ name }: any = {}, params: any) {
    return this.client.get(`/zones/${name}`, { params })
  }

  /**
   * Zone Insights
   */

  // Get all Zone Insights/Overviews
  public getAllZoneOverviews(params: any) {
    return this.client.get('/zones+insights', { params })
  }

  // Get a single Zone Insight/Overview
  public getZoneOverview({ name }: any = {}, params: any) {
    return this.client.get(`/zones+insights/${name}`, { params })
  }

  /**
   * Zone Ingress Insights
   */

  // Get all Zone Ingress Insights/Overviews
  public getAllZoneIngressOverviews(params: any) {
    return this.client.get('/zoneingresses+insights', { params })
  }

  // Get a single Zone Ingress Insight/Overview
  public getZoneIngressOverview({ name }: any = {}, params: any) {
    return this.client.get(`/zoneingresses+insights/${name}`, { params })
  }

  /**
   * Meshes
   */

  // get a list of all meshes
  public getAllMeshes(params: any) {
    return this.client.get('/meshes', { params })
  }

  // get a single mesh
  public getMesh({ name }: any = {}, params: any) {
    return this.client.get(`/meshes/${name}`, { params })
  }

  /**
   * Dataplanes
   */

  public getAllDataplanes(params: any) {
    return this.client.get('/dataplanes', { params })
  }

  // get a list of all dataplanes
  public getAllDataplanesFromMesh({ mesh }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/dataplanes`, { params })
  }

  // get a single dataplane
  public getDataplaneFromMesh({ mesh, name }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/dataplanes/${name}`, { params })
  }

  /**
   * Dataplane Overviews
   */

  // get all dataplane overviews
  public getAllDataplaneOverviews(params: any) {
    return this.client.get('/dataplanes+insights', { params })
  }

  // get all dataplane overviews from a specific mesh
  public getAllDataplaneOverviewsFromMesh({ mesh }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/dataplanes+insights`, { params })
  }

  // get a specific dataplane overview from its associated mesh
  public getDataplaneOverviewFromMesh({ mesh, name }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/dataplanes+insights/${name}`, { params })
  }

  /**
   * Traffic Logs
   */

  // get all traffic logs
  public getAllTrafficLogs(params: any) {
    return this.client.get('/traffic-logs', { params })
  }

  // get all traffic logs from mesh
  public getAllTrafficLogsFromMesh({ mesh }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/traffic-logs`, { params })
  }

  // get traffic log details
  public getTrafficLog({ mesh, name }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/traffic-logs/${name}`, { params })
  }

  /**
   * Traffic Permissions
   */

  // get traffic permissions
  public getAllTrafficPermissions(params: any) {
    return this.client.get('/traffic-permissions', { params })
  }

  // get traffic permissions from mesh
  public getAllTrafficPermissionsFromMesh({ mesh }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/traffic-permissions`, { params })
  }

  // get traffic permission details
  public getTrafficPermission({ mesh, name }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/traffic-permissions/${name}`, { params })
  }

  /**
   * Traffic Routes
   */

  // get all traffic routes
  public getAllTrafficRoutes(params: any) {
    return this.client.get('/traffic-routes', { params })
  }

  // get traffic routes from mesh
  public getAllTrafficRoutesFromMesh({ mesh }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/traffic-routes`, { params })
  }

  // get traffic route details
  public getTrafficRoute({ mesh, name }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/traffic-routes/${name}`, { params })
  }

  /**
   * Traffic Traces
   */

  // get all traffic traces
  public getAllTrafficTraces(params: any) {
    return this.client.get('/traffic-traces', { params })
  }

  // get traffic traces from mesh
  public getAllTrafficTracesFromMesh({ mesh }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/traffic-traces`, { params })
  }

  // get traffic trace details
  public getTrafficTrace({ mesh, name }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/traffic-traces/${name}`, { params })
  }

  /**
   * Proxy Templates
   */

  // get all proxy templates
  public getAllProxyTemplates(params: any) {
    return this.client.get('/proxytemplates', { params })

    // this may change to this:
    // return this.client.get('/proxy-templates', { params })
  }

  // get all proxy templates from mesh
  public getAllProxyTemplatesFromMesh({ mesh }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/proxytemplates`, { params })
  }

  // get proxy template details
  public getProxyTemplate({ mesh, name }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/proxytemplates/${name}`, { params })
  }

  /**
   * Health Checks
   */

  // get all health checks
  public getAllHealthChecks(params: any) {
    return this.client.get('/health-checks', { params })
  }

  // get all health checks from mesh
  public getAllHealthChecksFromMesh({ mesh }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/health-checks`, { params })
  }

  // get health check details
  public getHealthCheck({ mesh, name }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/health-checks/${name}`, { params })
  }

  /**
   * Fault Injections
   */

  // get all fault injections
  public getAllFaultInjections(params: any) {
    return this.client.get('/fault-injections', { params })
  }

  // get all fault injections from mesh
  public getAllFaultInjectionsFromMesh({ mesh }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/fault-injections`, { params })
  }

  // get fault injection details
  public getFaultInjection({ mesh, name }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/fault-injections/${name}`, { params })
  }

  /**
   * Circuit Breakers
   */

  // get all circuit breakers
  public getAllCircuitBreakers(params: any) {
    return this.client.get('/circuit-breakers', { params })
  }

  // get all circuit breakers from mesh
  public getAllCircuitBreakersFromMesh({ mesh }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/circuit-breakers`, { params })
  }

  // get circuit breaker details
  public getCircuitBreaker({ mesh, name }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/circuit-breakers/${name}`, { params })
  }

  /**
   * Rate Limits
   */

  // get all rate limits
  public getAllRateLimits(params: any) {
    return this.client.get('/rate-limits', { params })
  }

  // get all rate limits from mesh
  public getAllRateLimitsFromMesh({ mesh }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/rate-limits`, { params })
  }

  // get rate limit details
  public getRateLimit({ mesh, name }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/rate-limits/${name}`, { params })
  }

  /**
   * Retries
   */

  // get all retries
  public getAllRetries(params: any) {
    return this.client.get('/retries', { params })
  }

  // get all retries from mesh
  public getAllRetriesFromMesh({ mesh }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/retries`, { params })
  }

  // get retry details
  public getRetry({ mesh, name }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/retries/${name}`, { params })
  }

  /**
   * Timeouts
   */

  // get all timeouts
  public getAllTimeouts(params: any) {
    return this.client.get('/timeouts', { params })
  }

  // get all timeouts from mesh
  public getAllTimeoutsFromMesh({ mesh }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/timeouts`, { params })
  }

  // get timeout details
  public getTimeout({ mesh, name }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/timeouts/${name}`, { params })
  }

  /**
   * External Services
   */

  // get all external services
  public getAllExternalServices(params: any) {
    return this.client.get('/external-services', { params })
  }

  // get all external services from mesh
  public getAllExternalServicesFromMesh({ mesh }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/external-services`, { params })
  }

  // get external service details
  public getExternalService({ mesh, name }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/external-services/${name}`, { params })
  }

  /**
   * Service Insights
   */

  // get all services
  public getAllServiceInsights(params: any) {
    return this.client.get('/service-insights', { params })
  }

  // get all services from mesh
  public getAllServiceInsightsFromMesh({ mesh }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/service-insights`, { params })
  }

  // get service details
  public getServiceInsight({ mesh, name }: any = {}, params: any) {
    return this.client.get(`/meshes/${mesh}/service-insights/${name}`, { params })
  }

  /**
   * Mesh Insights
   */

  // Get all Mesh Insights
  public getAllMeshInsights(params: any) {
    return this.client.get('/mesh-insights', { params })
  }

  // Get a single Mesh Insight
  public getMeshInsights({ name }: any = {}, params: any) {
    return this.client.get(`/mesh-insights/${name}`, { params })
  }

  public getSupportedVersions(params: any) {
    return this.client.get('/versions', { params })
  }

  /**
   * Global Insights
   */

  // Get global insights
  public getGlobalInsights(params: any) {
    return this.client.get('/global-insights')
  }
}

export default new Kuma()
