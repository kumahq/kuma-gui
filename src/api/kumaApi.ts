import { RestClient } from './RestClient'
import { ApiListResponse, ApiKindListResponse } from '@/types/api.d'
import {
  DataPlane,
  DataPlaneOverview,
  ExternalService,
  GlobalInsights,
  Info,
  Mesh,
  MeshGatewayDataplane,
  MeshInsight,
  PolicyDefinition,
  PolicyEntity,
  ServiceInsight,
  SidecarDataplane,
  Zone,
  ZoneOverview,
} from '@/types/index.d'
import { ClientConfigInterface } from '@/store/modules/config/config.types'

class KumaApi {
  client: RestClient

  constructor() {
    this.client = new RestClient()
  }

  get url() {
    return this.client.url
  }

  /**
   * Sets the API base path for all network requests.
   *
   * URLs for requests will be constructed in the form `${origin}/${basePath}/${path}`.
   */
  setBasePath(basePath: string): void {
    this.client.basePath = basePath
  }

  getInfo(): Promise<Info> {
    return this.client.get('')
  }

  async getStatus(): Promise<'OK' | null> {
    try {
      const { response } = await this.client.raw('')

      return response.status === 200 ? 'OK' : null
    } catch {
      return null
    }
  }

  async getLatestVersion(): Promise<string> {
    const url = String(import.meta.env.VITE_VERSION_URL)

    return this.client.get(url)
  }

  getConfig(): Promise<ClientConfigInterface> {
    return this.client.get('config')
  }

  /**
   * Retrieves a list of known policy definitions.
   */
  getPolicyDefinitions(): Promise<{ policies: PolicyDefinition[] }> {
    return this.client.get('policies')
  }

  getGlobalInsights(): Promise<GlobalInsights> {
    return this.client.get('global-insights')
  }

  getZones(params?: any): Promise<ApiListResponse<Zone>> {
    return this.client.get('zones', { params })
  }

  getZone({ name }: { name: string }, params?: any): Promise<Zone> {
    return this.client.get(`zones/${name}`, { params })
  }

  getAllZoneOverviews(params?: any): Promise<ApiListResponse<ZoneOverview>> {
    return this.client.get('zones+insights', { params })
  }

  getZoneOverview({ name }: { name: string }, params?: any): Promise<ZoneOverview> {
    return this.client.get(`zones+insights/${name}`, { params })
  }

  /**
   * Fetches additional data like xDS configuration, envoy stats, or envoy clusters.
   */
  getZoneIngressData({ zoneIngressName, dataPath }: { zoneIngressName: string, dataPath: 'xds' | 'stats' | 'clusters' }, params?: any): Promise<string> {
    return this.client.get(`zoneingresses/${zoneIngressName}/${dataPath}`, { params })
  }

  getAllZoneIngressOverviews(params?: any): Promise<any> {
    return this.client.get('zoneingresses+insights', { params })
  }

  getZoneIngressOverview({ name }: { name: string }, params?: any): Promise<any> {
    return this.client.get(`zoneingresses+insights/${name}`, { params })
  }

  /**
   * Fetches additional data like xDS configuration, envoy stats, or envoy clusters.
   */
  getZoneEgressData({ zoneEgressName, dataPath }: { zoneEgressName: string, dataPath: 'xds' | 'stats' | 'clusters' }, params?: any): Promise<string> {
    return this.client.get(`zoneegresses/${zoneEgressName}/${dataPath}`, { params })
  }

  getAllZoneEgressOverviews(params?: any): Promise<any> {
    return this.client.get('zoneegressoverviews', { params })
  }

  getZoneEgressOverview({ name }: { name: string }, params?: any): Promise<any> {
    return this.client.get(`zoneegressoverviews/${name}`, { params })
  }

  getAllMeshes(params?: any): Promise<ApiListResponse<Mesh>> {
    return this.client.get('meshes', { params })
  }

  getMesh({ name }: { name: string }, params?: any): Promise<Mesh> {
    return this.client.get(`meshes/${name}`, { params })
  }

  getAllMeshInsights(params?: any): Promise<ApiListResponse<MeshInsight>> {
    return this.client.get('mesh-insights', { params })
  }

  getMeshInsights({ name }: { name: string }, params?: any): Promise<MeshInsight> {
    return this.client.get(`mesh-insights/${name}`, { params })
  }

  getAllDataplanes(params?: any): Promise<ApiListResponse<DataPlane>> {
    return this.client.get('dataplanes', { params })
  }

  getDataplaneFromMesh({ mesh, name }: { mesh: string, name: string }, params?: any): Promise<DataPlane> {
    return this.client.get(`meshes/${mesh}/dataplanes/${name}`, { params })
  }

  getAllDataplaneOverviews(params?: any): Promise<ApiListResponse<DataPlaneOverview>> {
    return this.client.get('dataplanes+insights', { params })
  }

  getAllDataplaneOverviewsFromMesh({ mesh }: { mesh: string }, params?: any): Promise<ApiListResponse<DataPlaneOverview>> {
    return this.client.get(`meshes/${mesh}/dataplanes+insights`, { params })
  }

  getDataplaneOverviewFromMesh({ mesh, name }: { mesh: string, name: string }, params?: any): Promise<DataPlaneOverview> {
    return this.client.get(`meshes/${mesh}/dataplanes+insights/${name}`, { params })
  }

  getSidecarDataplanePolicies({ mesh, name }: { mesh: string; name: string }, params?: any): Promise<ApiKindListResponse<SidecarDataplane>> {
    return this.client.get(`meshes/${mesh}/dataplanes/${name}/policies`, { params })
  }

  getMeshGatewayDataplane({ mesh, name }: { mesh: string; name: string }, params?: any): Promise<MeshGatewayDataplane> {
    return this.client.get(`meshes/${mesh}/dataplanes/${name}/policies`, { params })
  }

  /**
   * Fetches additional data like xDS configuration, envoy stats, or envoy clusters.
   */
  getDataplaneData({ mesh, dppName, dataPath }: { mesh: string, dppName: string, dataPath: 'xds' | 'stats' | 'clusters' }, params?: any): Promise<string> {
    return this.client.get(`meshes/${mesh}/dataplanes/${dppName}/${dataPath}`, { params })
  }

  getAllServiceInsights(params?: any): Promise<ApiListResponse<ServiceInsight>> {
    return this.client.get('service-insights', { params })
  }

  getAllServiceInsightsFromMesh({ mesh }: { mesh: string }, params?: any): Promise<ApiListResponse<ServiceInsight>> {
    return this.client.get(`meshes/${mesh}/service-insights`, { params })
  }

  getServiceInsight({ mesh, name }: { mesh: string, name: string }, params?: any): Promise<ServiceInsight> {
    return this.client.get(`meshes/${mesh}/service-insights/${name}`, { params })
  }

  getAllExternalServices(params?: any): Promise<ApiListResponse<ExternalService>> {
    return this.client.get('external-services', { params })
  }

  getAllExternalServicesFromMesh({ mesh }: { mesh: string }, params?: any): Promise<ApiListResponse<ExternalService>> {
    return this.client.get(`meshes/${mesh}/external-services`, { params })
  }

  getExternalService({ mesh, name }: { mesh: string, name: string }, params?: any): Promise<ExternalService> {
    return this.client.get(`meshes/${mesh}/external-services/${name}`, { params })
  }

  getPolicyConnections({ mesh, policyType, policyName }: { mesh: string; policyType: string; policyName: string }, params?: any): Promise<ApiListResponse<any>> {
    return this.client.get(`meshes/${mesh}/${policyType}/${policyName}/dataplanes`, { params })
  }

  getAllPolicyEntities({ path }: { path: string }, params?: any): Promise<ApiListResponse<PolicyEntity>> {
    return this.client.get(path, { params })
  }

  getAllPolicyEntitiesFromMesh({ mesh, path }: { mesh: string, path: string }, params?: any): Promise<ApiListResponse<PolicyEntity>> {
    return this.client.get(`meshes/${mesh}/${path}`, { params })
  }

  getSinglePolicyEntity({ mesh, path, name }: { mesh: string, path: string, name: string }, params?: any): Promise<PolicyEntity> {
    return this.client.get(`meshes/${mesh}/${path}/${name}`, { params })
  }
}

export const kumaApi = new KumaApi()
