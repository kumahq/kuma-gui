
interface NavItem {
  name: string
  categoryTier?: 'primary' | 'secondary'
  routeName?: string

  /**
   * Name of an anchor route to look for in `route.matched` to determine whether a route belongs to a nav item.
   *
   * An anchor route represents the route record that holds routes of a module; for example, the route “zone-abstract-view” holds all routes related to zones.
   */
  anchorRouteName?: string
  usesMeshParam?: boolean
  insightsFieldAccessor?: string
  isMeshSelector?: boolean
}

export function getNavItems(isMultizoneMode: boolean, hasMeshes: boolean): NavItem[] {
  const zoneItems: NavItem[] = [
    {
      name: 'Zones',
      categoryTier: 'primary',
    },
    ...(isMultizoneMode
      ? [
        {
          name: 'Zone CPs',
          routeName: 'zone-list-view',
          anchorRouteName: 'zone-abstract-view',
          insightsFieldAccessor: 'global.Zone',
        },
        {
          name: 'Zone Ingresses',
          routeName: 'zone-ingress-list-view',
          anchorRouteName: 'zone-ingress-abstract-view',
          insightsFieldAccessor: 'global.ZoneIngress',
        },
      ]
      : []),
    {
      name: 'Zone Egresses',
      routeName: 'zone-egress-list-view',
      anchorRouteName: 'zone-egress-abstract-view',
      insightsFieldAccessor: 'global.ZoneEgress',
    },
  ]

  const meshItems: NavItem[] = !hasMeshes
    ? []
    : [
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
        routeName: 'mesh-overview-view',
        anchorRouteName: 'mesh-detail-view',
        usesMeshParam: true,
      },
    ]

  return [
    {
      name: 'Home',
      routeName: 'home',
    },
    ...zoneItems,
    ...meshItems,
  ]
}
