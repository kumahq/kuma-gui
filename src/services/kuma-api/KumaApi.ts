import { Api } from './Api'

import type {
  ApiKindListResponse,
  ApiListResponse,
  DataPlaneOverviewParameters,
  PaginatedApiListResponse,
  PaginationParameters,
} from '@/types/api.d'
import type {
  DataPlane,
  DataPlaneOverview,
  DataplaneRule,
  ExternalService,
  GlobalInsights,
  Info,
  Mesh,
  MeshGatewayDataplane,
  MeshInsight,
  PolicyEntity,
  PolicyType,
  ServiceInsight,
  SidecarDataplane,
  Zone,
  ZoneEgressOverview,
  ZoneIngressOverview,
  ZoneOverview,
} from '@/types/index.d'
import type { ClientConfigInterface } from '@/store/modules/config/config.types'

export default class KumaApi extends Api {
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
    return this.client.get(this.env.var('KUMA_VERSION_URL'))
  }

  getConfig(): Promise<ClientConfigInterface> {
    return this.client.get('config')
  }

  /**
   * Retrieves a list of known policy definitions.
   */
  getPolicyTypes(): Promise<{ policies: PolicyType[] }> {
    return this.client.get('policies')
  }

  getGlobalInsights(): Promise<GlobalInsights> {
    return this.client.get('global-insights')
  }

  getZones(params?: PaginationParameters): Promise<PaginatedApiListResponse<Zone>> {
    return this.client.get('zones', { params })
  }

  getZone({ name }: { name: string }, params?: any): Promise<Zone> {
    return this.client.get(`zones/${name}`, { params })
  }

  getAllZoneOverviews(params?: PaginationParameters): Promise<PaginatedApiListResponse<ZoneOverview>> {
    return this.client.get('zones+insights', { params })
  }

  getZoneOverview({ name }: { name: string }, params?: PaginationParameters): Promise<ZoneOverview> {
    return this.client.get(`zones+insights/${name}`, { params })
  }

  /**
   * Fetches additional data like xDS configuration, envoy stats, or envoy clusters.
   */
  getZoneIngressData({ zoneIngressName, dataPath }: { zoneIngressName: string, dataPath: 'xds' | 'stats' | 'clusters' }, params?: any): Promise<string> {
    return this.client.get(`zoneingresses/${zoneIngressName}/${dataPath}`, { params })
  }

  getAllZoneIngressOverviews(params?: PaginationParameters): Promise<PaginatedApiListResponse<ZoneIngressOverview>> {
    return this.client.get('zoneingresses+insights', { params })
  }

  getZoneIngressOverview({ name }: { name: string }, params?: PaginationParameters): Promise<ZoneIngressOverview> {
    return this.client.get(`zoneingresses+insights/${name}`, { params })
  }

  /**
   * Fetches additional data like xDS configuration, envoy stats, or envoy clusters.
   */
  getZoneEgressData({ zoneEgressName, dataPath }: { zoneEgressName: string, dataPath: 'xds' | 'stats' | 'clusters' }, params?: any): Promise<string> {
    return this.client.get(`zoneegresses/${zoneEgressName}/${dataPath}`, { params })
  }

  getAllZoneEgressOverviews(params?: PaginationParameters): Promise<PaginatedApiListResponse<ZoneEgressOverview>> {
    return this.client.get('zoneegressoverviews', { params })
  }

  getZoneEgressOverview({ name }: { name: string }, params?: PaginationParameters): Promise<ZoneEgressOverview> {
    return this.client.get(`zoneegressoverviews/${name}`, { params })
  }

  getAllMeshes(params?: PaginationParameters): Promise<PaginatedApiListResponse<Mesh>> {
    return this.client.get('meshes', { params })
  }

  getMesh({ name }: { name: string }, params?: any): Promise<Mesh> {
    return this.client.get(`meshes/${name}`, { params })
  }

  getAllMeshInsights(params?: PaginationParameters): Promise<PaginatedApiListResponse<MeshInsight>> {
    return this.client.get('mesh-insights', { params })
  }

  getMeshInsights({ name }: { name: string }, params?: any): Promise<MeshInsight> {
    return this.client.get(`mesh-insights/${name}`, { params })
  }

  getAllDataplanes(params?: PaginationParameters): Promise<PaginatedApiListResponse<DataPlane>> {
    return this.client.get('dataplanes', { params })
  }

  getDataplaneFromMesh({ mesh, name }: { mesh: string, name: string }, params?: any): Promise<DataPlane> {
    return this.client.get(`meshes/${mesh}/dataplanes/${name}`, { params })
  }

  getAllDataplaneOverviews(params?: DataPlaneOverviewParameters): Promise<PaginatedApiListResponse<DataPlaneOverview>> {
    return this.client.get('dataplanes+insights', { params })
  }

  getAllDataplaneOverviewsFromMesh({ mesh }: { mesh: string }, params?: DataPlaneOverviewParameters): Promise<PaginatedApiListResponse<DataPlaneOverview>> {
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

  getDataplaneRules({ mesh, name }: { mesh: string; name: string }, params?: any): Promise<ApiListResponse<DataplaneRule>> {
    return this.client.get(`meshes/${mesh}/dataplanes/${name}/rules`, { params })
  }

  /**
   * Fetches additional data like xDS configuration, envoy stats, or envoy clusters.
   */
  getDataplaneData({ mesh, dppName, dataPath }: { mesh: string, dppName: string, dataPath: 'xds' | 'stats' | 'clusters' }, params?: any): Promise<string> {
    return this.client.get(`meshes/${mesh}/dataplanes/${dppName}/${dataPath}`, { params })
  }

  getAllServiceInsights(params?: PaginationParameters): Promise<PaginatedApiListResponse<ServiceInsight>> {
    return this.client.get('service-insights', { params })
  }

  getAllServiceInsightsFromMesh({ mesh }: { mesh: string }, params?: PaginationParameters): Promise<PaginatedApiListResponse<ServiceInsight>> {
    return this.client.get(`meshes/${mesh}/service-insights`, { params })
  }

  getServiceInsight({ mesh, name }: { mesh: string, name: string }, params?: any): Promise<ServiceInsight> {
    return this.client.get(`meshes/${mesh}/service-insights/${name}`, { params })
  }

  getAllExternalServices(params?: PaginationParameters): Promise<PaginatedApiListResponse<ExternalService>> {
    return this.client.get('external-services', { params })
  }

  getAllExternalServicesFromMesh({ mesh }: { mesh: string }, params?: PaginationParameters): Promise<PaginatedApiListResponse<ExternalService>> {
    return this.client.get(`meshes/${mesh}/external-services`, { params })
  }

  getExternalService({ mesh, name }: { mesh: string, name: string }, params?: any): Promise<ExternalService> {
    return this.client.get(`meshes/${mesh}/external-services/${name}`, { params })
  }

  // The following code is a hotfix for https://github.com/kumahq/kuma-gui/issues/599 until we implement the lookup of `ExternalService` resources by `ServiceInsight` name.
  async getExternalServiceByServiceInsightName(mesh: string, name: string): Promise<ExternalService | null> {
    const { items } = await this.getAllExternalServicesFromMesh({ mesh })

    if (Array.isArray(items)) {
      const foundExternalService = items.find((externalService) => externalService.tags['kuma.io/service'] === name)

      return foundExternalService ?? null
    } else {
      return null
    }
  }

  getPolicyConnections({ mesh, policyType, policyName }: { mesh: string; policyType: string; policyName: string }, params?: PaginationParameters): Promise<PaginatedApiListResponse<any>> {
    return this.client.get(`meshes/${mesh}/${policyType}/${policyName}/dataplanes`, { params })
  }

  getAllPolicyEntities({ path }: { path: string }, params?: PaginationParameters): Promise<PaginatedApiListResponse<PolicyEntity>> {
    return this.client.get(path, { params })
  }

  getAllPolicyEntitiesFromMesh({ mesh, path }: { mesh: string, path: string }, params?: PaginationParameters): Promise<PaginatedApiListResponse<PolicyEntity>> {
    return this.client.get(`meshes/${mesh}/${path}`, { params })
  }

  getSinglePolicyEntity({ mesh, path, name }: { mesh: string, path: string, name: string }, params?: any): Promise<PolicyEntity> {
    return this.client.get(`meshes/${mesh}/${path}/${name}`, { params })
  }
}
