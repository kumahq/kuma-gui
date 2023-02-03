type TODO = any
interface DataPlaneStats {
  online?: number
  partiallyDegraded?: number
  total?: number
}

const sumDataplanes = (curr: DataPlaneStats = {}, next: DataPlaneStats = {}) => {
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

const sumPolicies = (curr: Record<string, {total: string}>, next: any = {}) =>
  Object.entries(next).reduce((acc, [name, stat]) => {
    const currTotal = acc[name] ? acc[name].total : 0

    return {
      ...acc,
      [name]: {
        total: currTotal + (stat as TODO).total,
      },
    }
  }, curr)

const sumDependencyVersion = (curr: TODO = {}, next: TODO = {}): TODO =>
  Object.entries(next).reduce(
    (acc, [version, stat]) => ({
      ...acc,
      [version]: sumDataplanes(acc[version], stat as TODO),
    }),
    curr,
  )

const sumVersions = (curr: TODO = {}, next: TODO = {}) => ({
  kumaDp: sumDependencyVersion(curr.kumaDp, next.kumaDp),
  envoy: sumDependencyVersion(curr.envoy, next.envoy),
})

export function getEmptyInsight() {
  return {
    meshesTotal: 0,
    dataplanes: { online: 0, partiallyDegraded: 0, total: 0 },
    policies: {},
    dpVersions: { kumaDp: {}, envoy: {} },
  }
}

export function parseInsightReducer(insight: TODO = {}) {
  return mergeInsightsReducer([insight])
}

export function mergeInsightsReducer(insights: TODO = []) {
  return insights.reduce(
    (acc: TODO, insight: TODO) => ({
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
