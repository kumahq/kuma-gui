import type { DataPlaneProxyStatus, DpVersions, MeshInsight, ResourceStat, ServiceStatus } from '@/types/index.d'

export type MergedMeshInsights = {
  meshesTotal: number
  dataPlaneProxies: {
    online: number
    partiallyDegraded: number
    total: number
  }
  gateways: {
    online: number
    partiallyDegraded: number
    total: number
  }
  policies: Record<string, ResourceStat>
  dpVersions: {
    kumaDp: Record<string, DataPlaneProxyStatus>
    envoy: Record<string, DataPlaneProxyStatus>
  }
  services: {
    total: number
    internal: number
    external: number
  }
}

const sumDataplanes = (curr: DataPlaneProxyStatus = {}, next: DataPlaneProxyStatus = {}) => {
  const currOnline = curr.online || 0
  const nextOnline = next.online || 0
  const currPartiallyDegraded = curr.partiallyDegraded || 0
  const nextPartiallyDegraded = next.partiallyDegraded || 0
  const currTotal = curr.total || 0
  const nextTotal = next.total || 0

  return {
    online: currOnline + nextOnline,
    partiallyDegraded: currPartiallyDegraded + nextPartiallyDegraded,
    total: currTotal + nextTotal,
  }
}

const sumServices = (curr: ServiceStatus = {}, next: ServiceStatus = {}) => {
  const currTotal = curr.total ?? 0
  const nextTotal = next.total ?? 0
  const total = currTotal + nextTotal

  const currInternal = curr.internal ?? 0
  const nextInternal = next.internal ?? 0
  const internal = currInternal + nextInternal

  const currExternal = curr.external ?? 0
  const nextExternal = next.external ?? 0
  const external = currExternal + nextExternal

  return {
    total,
    internal,
    external,
  }
}

const sumPolicies = (curr: Record<string, ResourceStat> = {}, next: Record<string, ResourceStat> = {}) =>
  Object.entries(next).reduce((acc, [name, stat]) => {
    const currTotal = acc[name] ? acc[name].total : 0

    return {
      ...acc,
      [name]: {
        total: currTotal + stat.total,
      },
    }
  }, curr)

const sumDependencyVersion = (curr: Record<string, DataPlaneProxyStatus> = {}, next: Record<string, DataPlaneProxyStatus> = {}) =>
  Object.entries(next).reduce(
    (acc, [version, status]) => ({
      ...acc,
      [version]: sumDataplanes(acc[version], status),
    }),
    curr,
  )

const sumVersions = (curr: DpVersions = { kumaDp: {}, envoy: {} }, next: DpVersions = { kumaDp: {}, envoy: {} }) => ({
  kumaDp: sumDependencyVersion(curr.kumaDp, next.kumaDp),
  envoy: sumDependencyVersion(curr.envoy, next.envoy),
})

export function mergeInsightsReducer(insights: MeshInsight[]): MergedMeshInsights {
  return insights.reduce(
    (acc, insight) => ({
      meshesTotal: insights.length,
      dataPlaneProxies: sumDataplanes(acc.dataPlaneProxies, insight.dataplanesByType.standard),
      gateways: sumDataplanes(acc.gateways, insight.dataplanesByType.gateway),
      policies: sumPolicies(acc.policies, insight.policies),
      dpVersions: sumVersions(acc.dpVersions, insight.dpVersions),
      services: sumServices(acc.services, insight.services),
    }),
    {
      meshesTotal: 0,
      dataPlaneProxies: {
        online: 0,
        partiallyDegraded: 0,
        total: 0,
      },
      gateways: {
        online: 0,
        partiallyDegraded: 0,
        total: 0,
      },
      policies: {},
      dpVersions: {
        kumaDp: {},
        envoy: {},
      },
      services: {
        total: 0,
        internal: 0,
        external: 0,
      },
    },
  )
}
