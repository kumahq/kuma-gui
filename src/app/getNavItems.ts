import { PolicyDefinition } from '@/types'

interface NavItem {
  name: string
  categoryTier?: 'primary' | 'secondary'
  routeName?: string
  usesMeshParam?: boolean
  insightsFieldAccessor?: string
  isMeshSelector?: boolean
  shouldOffsetFromFollowingItems?: boolean
}

export function getNavItems(policies: PolicyDefinition[], isMultizoneMode: boolean): NavItem[] {
  const policyItems: NavItem[] = policies.map((policy) => ({
    name: policy.pluralDisplayName,
    routeName: policy.path,
    title: false,
    usesMeshParam: true,
    insightsFieldAccessor: `mesh.policies.${policy.name}`,
  }))

  policyItems.sort((policyItemA, policyItemB) => (policyItemA.name < policyItemB.name ? -1 : 1))

  const zoneItems: NavItem[] = !isMultizoneMode
    ? []
    : [
      {
        name: 'Zones',
        categoryTier: 'primary',
      },
      {
        name: 'Zone CPs',
        routeName: 'zones',
        insightsFieldAccessor: 'global.Zone',
      },
      {
        name: 'Zone Ingresses',
        routeName: 'zoneingresses',
        insightsFieldAccessor: 'global.ZoneIngress',
      },
      {
        name: 'Zone Egresses',
        routeName: 'zoneegresses',
        insightsFieldAccessor: 'global.ZoneEgress',
      },
    ]

  return [
    {
      name: 'Home',
      routeName: 'home',
      shouldOffsetFromFollowingItems: true,
    },
    ...zoneItems,
    {
      name: 'Mesh',
      categoryTier: 'primary',
    },
    {
      name: 'Mesh selector',
      isMeshSelector: true,
    },
    {
      name: 'Overview',
      routeName: 'mesh-detail-view',
      usesMeshParam: true,
    },
    {
      name: 'Services',
      routeName: 'service-list-view',
      insightsFieldAccessor: 'mesh.services.total',
      usesMeshParam: true,
    },
    {
      name: 'Data Plane Proxies',
      routeName: 'data-plane-list-view',
      usesMeshParam: true,
      insightsFieldAccessor: 'mesh.dataplanes.total',
    },
    {
      name: 'Policies',
      categoryTier: 'secondary',
    },
    ...policyItems,
  ]
}
