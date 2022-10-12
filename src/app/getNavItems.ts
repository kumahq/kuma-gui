import { Policy } from '@/types'

interface NavItem {
  name: string
  link?: string
  parent?: string
  usesMeshParam?: boolean
  insightsFieldAccessor?: string
}

export function getNavItems(policies: Policy[]): NavItem[] {
  const policyItems: NavItem[] = policies.map((policy) => ({
    name: policy.pluralDisplayName,
    link: policy.path,
    title: false,
    usesMeshParam: true,
    parent: 'policies',
    insightsFieldAccessor: `mesh.policies.${policy.name}`,
  }))

  policyItems.sort((policyItemA, policyItemB) => (policyItemA.name < policyItemB.name ? -1 : 1))

  return [
    {
      name: 'Service mesh',
    },
    {
      name: 'Overview',
      link: 'global-overview',
      usesMeshParam: true,
    },
    {
      name: 'Meshes',
      link: 'mesh-child',
      usesMeshParam: true,
      insightsFieldAccessor: 'global.Mesh',
    },
    {
      name: 'Zones',
    },
    {
      name: 'Zone CPs',
      link: 'zones',
      insightsFieldAccessor: 'global.Zone',
    },
    {
      name: 'Zone Ingresses',
      link: 'zoneingresses',
      insightsFieldAccessor: 'global.ZoneIngress',
    },
    {
      name: 'Zone Egresses',
      link: 'zoneegresses',
      insightsFieldAccessor: 'global.ZoneEgress',
    },
    {
      name: 'Services',
    },
    {
      name: 'Services',
      link: 'service-list-view',
      insightsFieldAccessor: 'mesh.services.total',
      usesMeshParam: true,
    },
    {
      name: 'Data plane proxies',
    },
    {
      name: 'Data planes',
      link: 'data-plane-list-view',
      usesMeshParam: true,
      insightsFieldAccessor: 'mesh.dataplanes.total',
    },
    {
      name: 'Policies',
    },
    ...policyItems,
  ]
}
