import type { RouteRecordRaw } from 'vue-router'

export const routes = () => {
  const items = (): RouteRecordRaw[] => {
    return [
      {
        path: 'zones',
        name: 'mesh-zone-address-list-view',
        component: () => import('./views/MeshZoneAddressListView.vue'),
      },
    ]
  }

  return {
    items,
  }
}
