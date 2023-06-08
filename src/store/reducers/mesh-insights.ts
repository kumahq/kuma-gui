import type { DataPlaneProxyStatus, DpVersions, MeshInsight, ResourceStat } from '@/types/index.d'

export type MergedMeshInsights = {
  meshesTotal: number
  dataplanes: {
    online: number
    partiallyDegraded: number
    total: number
  }
  policies: Record<string, ResourceStat>
  dpVersions: {
    kumaDp: Record<string, DataPlaneProxyStatus>
    envoy: Record<string, DataPlaneProxyStatus>
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

export function getEmptyInsight(): MergedMeshInsights {
  return {
    meshesTotal: 0,
    dataplanes: { online: 0, partiallyDegraded: 0, total: 0 },
    policies: {},
    dpVersions: { kumaDp: {}, envoy: {} },
  }
}

export function parseInsightReducer(insight?: MeshInsight) {
  return mergeInsightsReducer(insight ? [insight] : [])
}

export function mergeInsightsReducer(insights: MeshInsight[]): MergedMeshInsights {
  return insights.reduce(
    (acc, insight) => ({
      meshesTotal: insights.length,
      dataplanes: sumDataplanes(acc.dataplanes, insight.dataplanes),
      policies: sumPolicies(acc.policies, insight.policies),
      dpVersions: sumVersions(acc.dpVersions, insight.dpVersions),
    }),
    {
      meshesTotal: 0,
      dataplanes: {
        online: 0,
        partiallyDegraded: 0,
        total: 0,
      },
      policies: {},
      dpVersions: {
        kumaDp: {},
        envoy: {},
      },
    },
  )
}
