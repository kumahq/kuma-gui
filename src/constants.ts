export const PRODUCT_NAME = import.meta.env.VITE_NAMESPACE
export const PAGE_SIZE_DEFAULT = 12
export const PAGE_REQUEST_SIZE_DEFAULT = 500

export const ONLINE = 'Online'
export const OFFLINE = 'Offline'
export const PARTIALLY_DEGRADED = 'Partially degraded'

export const DISABLED = 'Disabled'

export const KUMA_ZONE_TAG_NAME = 'kuma.io/zone'

export const FEATURE_FLAG = {}

export const STATUS: Record<string, { title: string, appearance: string }> = {
  not_available: {
    title: 'Not available',
    appearance: 'warning',
  },
  partially_degraded: {
    title: 'Partially degraded',
    appearance: 'warning',
  },
  offline: {
    title: 'Offline',
    appearance: 'danger',
  },
  online: {
    title: 'Online',
    appearance: 'success',
  },
}
