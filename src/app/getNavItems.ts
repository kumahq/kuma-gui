interface NavItem {
  name: string
  routeName: string

  /**
   * Name of an anchor route to look for in `route.matched` to determine whether a route belongs to a nav item.
   *
   * An anchor route represents the route record that holds routes of a module; for example, the route “zone-index-view” holds all routes related to zones.
   */
  anchorRouteName?: string
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
          name: 'Zones',
          routeName: 'zone-cp-list-view',
          anchorRouteName: 'zone-index-view',
        },
      ]
      : [
        {
          name: 'Zone Egresses',
          routeName: 'zone-egress-list-view',
          anchorRouteName: 'zone-index-view',
        },
      ]),
    {
      name: 'Meshes',
      routeName: 'mesh-list-view',
      anchorRouteName: 'mesh-index-view',
    },
  ]
}
