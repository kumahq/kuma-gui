import type { ZoneIngressOverview as PartialZoneIngressOverview } from '@/types/index.d'
export type { AvailableService } from '@/types/index.d'
type PartialZoneIngress = PartialZoneIngressOverview['zoneIngress']

type RequiredZoneIngress =
  Required<Pick<PartialZoneIngress,
  'availableServices'
  >>
  & PartialZoneIngressOverview['zoneIngress']

export type ZoneIngressOverview = PartialZoneIngressOverview & {
  zoneIngress: RequiredZoneIngress
}
export const ZoneIngressOverview = {
  fromObject: (item: PartialZoneIngressOverview): ZoneIngressOverview => {
    return {
      ...item,
      zoneIngress: {
        ...item.zoneIngress,
        availableServices: !Array.isArray(item.zoneIngress.availableServices) ? [] : item.zoneIngress.availableServices,
      },
    }
  },
}
