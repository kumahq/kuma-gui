import RestClient from '@/services/restClient'

const defaultOptions = {
  name: '',
  mesh: '',
}

interface ApiDefaultOptions {
  name?: string
  mesh?: string
}

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
  public query(model: string, params?: any) {
    return this.client.get(`/${model}`, { params })
  }

  /**
   * Zones
   */

  // Zone status
  public getZonesStatus(params?: any) {
    return this.client.get('/status/zones', { params })
  }

  // Zones
  public getZones(params?: any) {
    return this.client.get('/zones', { params })
  }

  // Zones
  public getZone({ name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/zones/${name}`, { params })
  }

  /**
   * Zone Insights
   */

  // Get all Zone Insights/Overviews
  public getAllZoneOverviews(params?: any) {
    return this.client.get('/zones+insights', { params })
  }

  // Get a single Zone Insight/Overview
  public getZoneOverview({ name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/zones+insights/${name}`, { params })
  }

  /**
   * Zone Ingress Insights
   */

  // Get all Zone Ingress Insights/Overviews
  public getAllZoneIngressOverviews(params?: any) {
    return this.client.get('/zoneingresses+insights', { params })
  }

  // Get a single Zone Ingress Insight/Overview
  public getZoneIngressOverview({ name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/zoneingresses+insights/${name}`, { params })
  }

  /**
   * Zone Egress Insights
   */

  // Get all Zone Egress Insights/Overviews
  public getAllZoneEgressOverviews(params?: any) {
    return this.client.get('/zoneegressoverviews', { params })
  }

  // Get a single Zone Egress Insight/Overview
  public getZoneEgressOverview({ name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/zoneegressoverviews/${name}`, { params })
  }

  /**
   * Meshes
   */

  // get a list of all meshes
  public getAllMeshes(params?: any) {
    return this.client.get('/meshes', { params })
  }

  // get a single mesh
  public getMesh({ name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${name}`, { params })
  }

  /**
   * Dataplanes
   */

  public getAllDataplanes(params?: any) {
    return this.client.get('/dataplanes', { params })
  }

  // get a list of all dataplanes
  public getAllDataplanesFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/dataplanes`, { params })
  }

  // get a single dataplane
  public getDataplaneFromMesh({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/dataplanes/${name}`, { params })
  }

  /**
   * Dataplane Overviews
   */

  // get all dataplane overviews
  public getAllDataplaneOverviews(params?: any) {
    return this.client.get('/dataplanes+insights', { params })
  }

  // get all dataplane overviews from a specific mesh
  public getAllDataplaneOverviewsFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/dataplanes+insights`, { params })
  }

  // get a specific dataplane overview from its associated mesh
  public getDataplaneOverviewFromMesh({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/dataplanes+insights/${name}`, { params })
  }

  /**
   * Traffic Logs
   */

  // get all traffic logs
  public getAllTrafficLogs(params?: any) {
    return this.client.get('/traffic-logs', { params })
  }

  // get all traffic logs from mesh
  public getAllTrafficLogsFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/traffic-logs`, { params })
  }

  // get traffic log details
  public getTrafficLog({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/traffic-logs/${name}`, { params })
  }

  /**
   * Traffic Permissions
   */

  // get traffic permissions
  public getAllTrafficPermissions(params?: any) {
    return this.client.get('/traffic-permissions', { params })
  }

  // get traffic permissions from mesh
  public getAllTrafficPermissionsFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/traffic-permissions`, { params })
  }

  // get traffic permission details
  public getTrafficPermission({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/traffic-permissions/${name}`, { params })
  }

  /**
   * Traffic Routes
   */

  // get all traffic routes
  public getAllTrafficRoutes(params?: any) {
    return this.client.get('/traffic-routes', { params })
  }

  // get traffic routes from mesh
  public getAllTrafficRoutesFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/traffic-routes`, { params })
  }

  // get traffic route details
  public getTrafficRoute({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/traffic-routes/${name}`, { params })
  }

  /**
   * Traffic Traces
   */

  // get all traffic traces
  public getAllTrafficTraces(params?: any) {
    return this.client.get('/traffic-traces', { params })
  }

  // get traffic traces from mesh
  public getAllTrafficTracesFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/traffic-traces`, { params })
  }

  // get traffic trace details
  public getTrafficTrace({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/traffic-traces/${name}`, { params })
  }

  /**
   * Proxy Templates
   */

  // get all proxy templates
  public getAllProxyTemplates(params?: any) {
    return this.client.get('/proxytemplates', { params })

    // this may change to this:
    // return this.client.get('/proxy-templates', { params })
  }

  // get all proxy templates from mesh
  public getAllProxyTemplatesFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/proxytemplates`, { params })
  }

  // get proxy template details
  public getProxyTemplate({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/proxytemplates/${name}`, { params })
  }

  /**
   * Health Checks
   */

  // get all health checks
  public getAllHealthChecks(params?: any) {
    return this.client.get('/health-checks', { params })
  }

  // get all health checks from mesh
  public getAllHealthChecksFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/health-checks`, { params })
  }

  // get health check details
  public getHealthCheck({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/health-checks/${name}`, { params })
  }

  /**
   * Fault Injections
   */

  // get all fault injections
  public getAllFaultInjections(params?: any) {
    return this.client.get('/fault-injections', { params })
  }

  // get all fault injections from mesh
  public getAllFaultInjectionsFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/fault-injections`, { params })
  }

  // get fault injection details
  public getFaultInjection({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/fault-injections/${name}`, { params })
  }

  /**
   * Circuit Breakers
   */

  // get all circuit breakers
  public getAllCircuitBreakers(params?: any) {
    return this.client.get('/circuit-breakers', { params })
  }

  // get all circuit breakers from mesh
  public getAllCircuitBreakersFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/circuit-breakers`, { params })
  }

  // get circuit breaker details
  public getCircuitBreaker({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/circuit-breakers/${name}`, { params })
  }

  /**
   * Rate Limits
   */

  // get all rate limits
  public getAllRateLimits(params?: any) {
    return this.client.get('/rate-limits', { params })
  }

  // get all rate limits from mesh
  public getAllRateLimitsFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/rate-limits`, { params })
  }

  // get rate limit details
  public getRateLimit({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/rate-limits/${name}`, { params })
  }

  /**
   * Retries
   */

  // get all retries
  public getAllRetries(params?: any) {
    return this.client.get('/retries', { params })
  }

  // get all retries from mesh
  public getAllRetriesFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/retries`, { params })
  }

  // get retry details
  public getRetry({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/retries/${name}`, { params })
  }

  /**
   * Timeouts
   */

  // get all timeouts
  public getAllTimeouts(params?: any) {
    return this.client.get('/timeouts', { params })
  }

  // get all timeouts from mesh
  public getAllTimeoutsFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/timeouts`, { params })
  }

  // get timeout details
  public getTimeout({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/timeouts/${name}`, { params })
  }

  /**
   * Gateways
   */

  // get all gateway
  public getAllMeshGateways(params?: any) {
    return this.client.get('/meshgateways', { params })
  }

  // get all gateways from mesh
  public getAllMeshGatewaysFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/meshgateways`, { params })
  }

  // get gateway details
  public getMeshGateway({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/meshgateways/${name}`, { params })
  }

  /**
   * Gateway routes
   */

  // get all gateway routes
  public getAllMeshGatewayRoutes(params?: any) {
    return this.client.get('/meshgatewayroutes', { params })
  }

  // get all gateway routes from mesh
  public getAllMeshGatewayRoutesFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/meshgatewayroutes`, { params })
  }

  // get timeout details
  public getMeshGatewayRoute({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/meshgatewayroutes/${name}`, { params })
  }

  /**
   * External Services
   */

  // get all external services
  public getAllExternalServices(params?: any) {
    return this.client.get('/external-services', { params })
  }

  // get all external services from mesh
  public getAllExternalServicesFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/external-services`, { params })
  }

  // get external service details
  public getExternalService({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/external-services/${name}`, { params })
  }

  /**
   * Service Insights
   */

  // get all services
  public getAllServiceInsights(params?: any) {
    return this.client.get('/service-insights', { params })
  }

  // get all services from mesh
  public getAllServiceInsightsFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/service-insights`, { params })
  }

  // get service details
  public getServiceInsight({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/meshes/${mesh}/service-insights/${name}`, { params })
  }

  /**
   * Mesh Insights
   */

  // Get all Mesh Insights
  public getAllMeshInsights(params?: any) {
    return this.client.get('/mesh-insights', { params })
  }

  // Get a single Mesh Insight
  public getMeshInsights({ name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`/mesh-insights/${name}`, { params })
  }

  public getSupportedVersions(params?: any) {
    return this.client.get('/versions', { params })
  }

  /**
   * Global Insights
   */

  // Get global insights
  public getGlobalInsights(params?: any) {
    return this.client.get('/global-insights')
  }

  /**
   * Inspection API
   */

  // Get policy dpps connections
  public getPolicyConnections(
    { mesh, policyType, policyName }: { mesh: string; policyType: string; policyName: string },
    params?: any,
  ) {
    return this.client.get(`/meshes/${mesh}/${policyType}/${policyName}/dataplanes`, { params })
  }

  // Get policy dpps connections
  public getDataplanePolicies({ mesh, dppName }: { mesh: string; dppName: string }, params?: any) {
    return this.client.get(`/meshes/${mesh}/dataplanes/${dppName}/policies`, { params })
  }

  // Get XDS configuration of a data plane proxy
  public getDataplaneXds({ mesh, dppName }: { mesh: string; dppName: string }, params?: any) {
    return this.client.get(`/meshes/${mesh}/dataplanes/${dppName}/xds`, { params })
  }

  // Get XDS configuration of a zone ingress proxy
  public getZoneIngressXds({ zoneIngressName }: { zoneIngressName: string }, params?: any) {
    return this.client.get(`/zoneingresses/${zoneIngressName}/xds`, { params })
  }

  // Get XDS configuration of a zone ingress proxy
  public getZoneEgressXds({ zoneEgressName }: { zoneEgressName: string }, params?: any) {
    return this.client.get(`/zoneegresses/${zoneEgressName}/xds`, { params })
  }
}

export default new Kuma()
