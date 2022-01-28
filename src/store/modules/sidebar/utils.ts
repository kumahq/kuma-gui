import { MeshInsight, GlobalInsights } from '@/types'

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
        if (!acc.policies[key]) {
          acc.policies[key] = 0
        }

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
      policies: {},
    },
  )

  return meshInsight
}

export function calculateGlobalInsights(globalInsights: GlobalInsights) {
  return Object.entries(globalInsights.resources).reduce((acc: Record<string, number>, [key, value]) => {
    if (!acc[key]) {
      acc[key] = 0
    }

    acc[key] += value.total || 0

    return acc
  }, {})
}
