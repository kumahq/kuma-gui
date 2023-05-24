
interface NavItem {
  name: string
  routeName: string

  /**
   * Name of an anchor route to look for in `route.matched` to determine whether a route belongs to a nav item.
   *
   * An anchor route represents the route record that holds routes of a module; for example, the route “zone-abstract-view” holds all routes related to zones.
   */
  anchorRouteName?: string
  insightsFieldAccessor?: string
}

export function getNavItems(isMultizoneMode: boolean): NavItem[] {
  return [
    {
      name: 'Home',
      routeName: 'home',
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
    {
      name: 'Meshes',
      routeName: 'mesh-list-view',
      anchorRouteName: 'mesh-abstract-view',
    },
  ]
}
