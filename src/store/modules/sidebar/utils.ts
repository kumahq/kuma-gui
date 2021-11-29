import { MeshInsight } from '@/types'

export function calculateMeshInsights(rawMeshInsights: { items: MeshInsight[] }) {
  const meshInsight = rawMeshInsights.items.reduce(
    (acc: any, { dataplanes, dataplanesByType, policies, services }: MeshInsight) => {
      // Sum services
      acc.services.internal += services.internal || 0
      acc.services.external += services.external || 0

      // Sum dataplanes
      acc.dataplanes.total += dataplanes.total || 0
      acc.dataplanes.standard += dataplanesByType.standard?.total || 0
      acc.dataplanes.gateway += dataplanesByType.gateway?.total || 0

      // Sum policies

      for (const [key, policy] of Object.entries(policies)) {
        acc.policies[key] += policy.total || 0
      }

      return acc
    },
    {
      services: {
        internal: 0,
        external: 0,
      },
      dataplanes: {
        total: 0,
        standard: 0,
        gateway: 0,
      },
      policies: {
        CircuitBreaker: 0,
        FaultInjection: 0,
        HealthCheck: 0,
        ProxyTemplate: 0,
        TrafficLog: 0,
        TrafficPermission: 0,
        TrafficRoute: 0,
        TrafficTrace: 0,
        RateLimit: 0,
        Retry: 0,
        Timeout: 0,
      },
    },
  )

  return meshInsight
}
