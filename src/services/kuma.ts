import RestClient from '@/services/restClient'
import { Mesh, Policy, ResourceResponse } from '@/types'

const defaultOptions = {
  name: '',
  mesh: '',
  path: '',
}

interface ApiDefaultOptions {
  name?: string
  mesh?: string
}

type ApiDefaultPolicyOptions = ApiDefaultOptions & { path: string }

class Kuma {
  private client: RestClient

  public constructor() {
    this.client = new RestClient()
  }

  public get url() {
    return this.client.url
  }

  /**
   * Info / Config
   */

  public getInfo() {
    return this.client.get('')
  }

  public async getStatus() {
    let statusCode

    try {
      const { response } = await this.client.raw('')

      statusCode = response.status
    } catch { }

    return statusCode === 200 ? 'OK' : null
  }

  public async getLatestVersion(): Promise<string> {
    const url = String(import.meta.env.VITE_VERSION_URL)

    return this.client.get(url)
  }

  public getConfig() {
    return this.client.get('config')
  }

  /**
   * Custom query
   */
  public query(model: string, params?: any) {
    return this.client.get(model, { params })
  }

  /**
   * Zones
   */

  // Zone status
  public getZonesStatus(params?: any) {
    return this.client.get('status/zones', { params })
  }

  // Zones
  public getZones(params?: any) {
    return this.client.get('zones', { params })
  }

  // Zones
  public getZone({ name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`zones/${name}`, { params })
  }

  /**
   * Zone Insights
   */

  // Get all Zone Insights/Overviews
  public getAllZoneOverviews(params?: any) {
    return this.client.get('zones+insights', { params })
  }

  // Get a single Zone Insight/Overview
  public getZoneOverview({ name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`zones+insights/${name}`, { params })
  }

  /**
   * Zone Ingress Insights
   */

  // Get all Zone Ingress Insights/Overviews
  public getAllZoneIngressOverviews(params?: any) {
    return this.client.get('zoneingresses+insights', { params })
  }

  // Get a single Zone Ingress Insight/Overview
  public getZoneIngressOverview({ name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`zoneingresses+insights/${name}`, { params })
  }

  /**
   * Zone Egress Insights
   */

  // Get all Zone Egress Insights/Overviews
  public getAllZoneEgressOverviews(params?: any) {
    return this.client.get('zoneegressoverviews', { params })
  }

  // Get a single Zone Egress Insight/Overview
  public getZoneEgressOverview({ name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`zoneegressoverviews/${name}`, { params })
  }

  /**
   * Meshes
   */

  // get a list of all meshes
  public getAllMeshes(params?: any): Promise<ResourceResponse<Mesh>> {
    return this.client.get('meshes', { params })
  }

  // get a single mesh
  public getMesh({ name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`meshes/${name}`, { params })
  }

  /**
   * Dataplanes
   */

  public getAllDataplanes(params?: any) {
    return this.client.get('dataplanes', { params })
  }

  // get a list of all dataplanes
  public getAllDataplanesFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`meshes/${mesh}/dataplanes`, { params })
  }

  // get a single dataplane
  public getDataplaneFromMesh({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`meshes/${mesh}/dataplanes/${name}`, { params })
  }

  /**
   * Dataplane Overviews
   */

  // get all dataplane overviews
  public getAllDataplaneOverviews(params?: any) {
    return this.client.get('dataplanes+insights', { params })
  }

  // get all dataplane overviews from a specific mesh
  public getAllDataplaneOverviewsFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`meshes/${mesh}/dataplanes+insights`, { params })
  }

  // get a specific dataplane overview from its associated mesh
  public getDataplaneOverviewFromMesh({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`meshes/${mesh}/dataplanes+insights/${name}`, { params })
  }

  /**
   * External Services
   */

  // get all external services
  public getAllExternalServices(params?: any) {
    return this.client.get('external-services', { params })
  }

  // get all external services from mesh
  public getAllExternalServicesFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`meshes/${mesh}/external-services`, { params })
  }

  // get external service details
  public getExternalService({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`meshes/${mesh}/external-services/${name}`, { params })
  }

  /**
   * Service Insights
   */

  // get all services
  public getAllServiceInsights(params?: any) {
    return this.client.get('service-insights', { params })
  }

  // get all services from mesh
  public getAllServiceInsightsFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`meshes/${mesh}/service-insights`, { params })
  }

  // get service details
  public getServiceInsight({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`meshes/${mesh}/service-insights/${name}`, { params })
  }

  /**
   * Mesh Insights
   */

  // Get all Mesh Insights
  public getAllMeshInsights(params?: any) {
    return this.client.get('mesh-insights', { params })
  }

  // Get a single Mesh Insight
  public getMeshInsights({ name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`mesh-insights/${name}`, { params })
  }

  /**
   * Global Insights
   */

  // Get global insights
  public getGlobalInsights() {
    return this.client.get('global-insights')
  }

  /**
   * Inspection API
   */

  // Get a list of all policies
  public getPolicies(): Promise<{ policies: Policy[] }> {
    return this.client.get('policies')
  }

  // Get policy dpps connections
  public getPolicyConnections(
    { mesh, policyType, policyName }: { mesh: string; policyType: string; policyName: string },
    params?: any,
  ) {
    return this.client.get(`meshes/${mesh}/${policyType}/${policyName}/dataplanes`, { params })
  }

  // Get policy dpps connections
  public getDataplanePolicies({ mesh, dppName }: { mesh: string; dppName: string }, params?: any) {
    return this.client.get(`meshes/${mesh}/dataplanes/${dppName}/policies`, { params })
  }

  /**
   * Fetch additional data like xDS configuration, envoy stats, or envoy clusters.
   */

  public getDataplaneData({ dataPath, mesh, dppName }: { dataPath: 'xds' | 'stats' | 'clusters', mesh: string; dppName: string }, params?: any) {
    return this.client.get(`meshes/${mesh}/dataplanes/${dppName}/${dataPath}`, { params })
  }

  public getZoneIngressData({ dataPath, zoneIngressName }: { dataPath: 'xds' | 'stats' | 'clusters', zoneIngressName: string }, params?: any) {
    return this.client.get(`zoneingresses/${zoneIngressName}/${dataPath}`, { params })
  }

  public getZoneEgressData({ dataPath, zoneEgressName }: { dataPath: 'xds' | 'stats' | 'clusters', zoneEgressName: string }, params?: any) {
    return this.client.get(`zoneegresses/${zoneEgressName}/${dataPath}`, { params })
  }

  /**
   * Policies
   */

  public getAllPolicyEntities({ path }: ApiDefaultPolicyOptions = defaultOptions, params?: any) {
    return this.client.get(path, { params })
  }

  public getAllPolicyEntitiesFromMesh({ mesh, path }: ApiDefaultPolicyOptions = defaultOptions, params?: any) {
    return this.client.get(`meshes/${mesh}/${path}`, { params })
  }

  public getSinglePolicyEntity({ mesh, path, name }: ApiDefaultPolicyOptions = defaultOptions, params?: any) {
    return this.client.get(`meshes/${mesh}/${path}/${name}`, { params })
  }
}

export default new Kuma()
