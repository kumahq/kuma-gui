import { RestClient } from '@/services/RestClient'
import { ApiListResponse } from '@/api'
import {
  DataPlane,
  DataPlaneOverview,
  ExternalService,
  Info,
  Mesh,
  MeshInsight,
  PolicyDefinition,
  PolicyEntity,
  ServiceInsight,
  Zone,
  ZoneOverview,
} from '@/types'
import { ClientConfigInterface } from '@/store/modules/config/config.types'

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
   * Sets the API base path for all network requests.
   *
   * URLs for requests will be constructed in the form `${origin}/${basePath}/${path}`.
   */
  public setBasePath(basePath: string) {
    this.client.basePath = basePath
  }

  public getInfo(): Promise<Info> {
    return this.client.get('')
  }

  public async getStatus(): Promise<'OK' | null> {
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

  public getConfig(): Promise<ClientConfigInterface> {
    return this.client.get('config')
  }

  /**
   * Retrieves a list of known policy definitions.
   */
  public getPolicyDefinitions(): Promise<{ policies: PolicyDefinition[] }> {
    return this.client.get('policies')
  }

  public getGlobalInsights() {
    return this.client.get('global-insights')
  }

  public getZones(params?: any): Promise<ApiListResponse<Zone>> {
    return this.client.get('zones', { params })
  }

  public getZone({ name }: ApiDefaultOptions = defaultOptions, params?: any): Promise<Zone> {
    return this.client.get(`zones/${name}`, { params })
  }

  public getAllZoneOverviews(params?: any): Promise<ApiListResponse<ZoneOverview>> {
    return this.client.get('zones+insights', { params })
  }

  public getZoneOverview({ name }: ApiDefaultOptions = defaultOptions, params?: any): Promise<ZoneOverview> {
    return this.client.get(`zones+insights/${name}`, { params })
  }

  /**
   * Fetches additional data like xDS configuration, envoy stats, or envoy clusters.
   */
  public getZoneIngressData({ dataPath, zoneIngressName }: { dataPath: 'xds' | 'stats' | 'clusters', zoneIngressName: string }, params?: any) {
    return this.client.get(`zoneingresses/${zoneIngressName}/${dataPath}`, { params })
  }

  public getAllZoneIngressOverviews(params?: any) {
    return this.client.get('zoneingresses+insights', { params })
  }

  public getZoneIngressOverview({ name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`zoneingresses+insights/${name}`, { params })
  }

  /**
   * Fetches additional data like xDS configuration, envoy stats, or envoy clusters.
   */
  public getZoneEgressData({ dataPath, zoneEgressName }: { dataPath: 'xds' | 'stats' | 'clusters', zoneEgressName: string }, params?: any) {
    return this.client.get(`zoneegresses/${zoneEgressName}/${dataPath}`, { params })
  }

  public getAllZoneEgressOverviews(params?: any) {
    return this.client.get('zoneegressoverviews', { params })
  }

  public getZoneEgressOverview({ name }: ApiDefaultOptions = defaultOptions, params?: any) {
    return this.client.get(`zoneegressoverviews/${name}`, { params })
  }

  public getAllMeshes(params?: any): Promise<ApiListResponse<Mesh>> {
    return this.client.get('meshes', { params })
  }

  public getMesh({ name }: ApiDefaultOptions = defaultOptions, params?: any): Promise<Mesh> {
    return this.client.get(`meshes/${name}`, { params })
  }

  public getAllMeshInsights(params?: any): Promise<ApiListResponse<MeshInsight>> {
    return this.client.get('mesh-insights', { params })
  }

  public getMeshInsights({ name }: ApiDefaultOptions = defaultOptions, params?: any): Promise<MeshInsight> {
    return this.client.get(`mesh-insights/${name}`, { params })
  }

  public getAllDataplanes(params?: any) {
    return this.client.get('dataplanes', { params })
  }

  public getDataplaneFromMesh({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any): Promise<DataPlane> {
    return this.client.get(`meshes/${mesh}/dataplanes/${name}`, { params })
  }

  public getAllDataplaneOverviews(params?: any): Promise<ApiListResponse<DataPlaneOverview>> {
    return this.client.get('dataplanes+insights', { params })
  }

  public getAllDataplaneOverviewsFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any): Promise<ApiListResponse<DataPlaneOverview>> {
    return this.client.get(`meshes/${mesh}/dataplanes+insights`, { params })
  }

  public getDataplaneOverviewFromMesh({ mesh, name }: Required<ApiDefaultOptions>, params?: any): Promise<DataPlaneOverview> {
    return this.client.get(`meshes/${mesh}/dataplanes+insights/${name}`, { params })
  }

  public getDataplanePolicies({ mesh, dppName }: { mesh: string; dppName: string }, params?: any) {
    return this.client.get(`meshes/${mesh}/dataplanes/${dppName}/policies`, { params })
  }

  /**
   * Fetches additional data like xDS configuration, envoy stats, or envoy clusters.
   */
  public getDataplaneData({ dataPath, mesh, dppName }: { dataPath: 'xds' | 'stats' | 'clusters', mesh: string; dppName: string }, params?: any) {
    return this.client.get(`meshes/${mesh}/dataplanes/${dppName}/${dataPath}`, { params })
  }

  public getAllServiceInsights(params?: any): Promise<ApiListResponse<ServiceInsight>> {
    return this.client.get('service-insights', { params })
  }

  public getAllServiceInsightsFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any): Promise<ApiListResponse<ServiceInsight>> {
    return this.client.get(`meshes/${mesh}/service-insights`, { params })
  }

  public getServiceInsight({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any): Promise<ServiceInsight> {
    return this.client.get(`meshes/${mesh}/service-insights/${name}`, { params })
  }

  public getAllExternalServices(params?: any): Promise<ApiListResponse<ExternalService>> {
    return this.client.get('external-services', { params })
  }

  public getAllExternalServicesFromMesh({ mesh }: ApiDefaultOptions = defaultOptions, params?: any): Promise<ApiListResponse<ExternalService>> {
    return this.client.get(`meshes/${mesh}/external-services`, { params })
  }

  public getExternalService({ mesh, name }: ApiDefaultOptions = defaultOptions, params?: any): Promise<ExternalService> {
    return this.client.get(`meshes/${mesh}/external-services/${name}`, { params })
  }

  public getPolicyConnections({ mesh, policyType, policyName }: { mesh: string; policyType: string; policyName: string }, params?: any) {
    return this.client.get(`meshes/${mesh}/${policyType}/${policyName}/dataplanes`, { params })
  }

  public getAllPolicyEntities({ path }: ApiDefaultPolicyOptions = defaultOptions, params?: any): Promise<ApiListResponse<PolicyEntity>> {
    return this.client.get(path, { params })
  }

  public getAllPolicyEntitiesFromMesh({ mesh, path }: ApiDefaultPolicyOptions = defaultOptions, params?: any): Promise<ApiListResponse<PolicyEntity>> {
    return this.client.get(`meshes/${mesh}/${path}`, { params })
  }

  public getSinglePolicyEntity({ mesh, path, name }: ApiDefaultPolicyOptions = defaultOptions, params?: any): Promise<PolicyEntity> {
    return this.client.get(`meshes/${mesh}/${path}/${name}`, { params })
  }
}

export default new Kuma()
