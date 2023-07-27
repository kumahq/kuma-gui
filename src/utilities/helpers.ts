import { DISABLED, PAGE_REQUEST_SIZE_DEFAULT } from '@/constants'
import { PaginatedApiListResponse } from '@/types/api.d'
import { ZoneOverview } from '@/types/index.d'
import { get } from '@/utilities/get'

type TODO = any

/**
 * Takes an object or array and only returns the keys and
 * values you want based on the `items` value.
 * @param {Object | Array} original
 * @param {Object} desired
 */
export function getSome(original: TODO, desired: TODO) {
  // we have to determine if we're dealing with an array or an object
  const cleaned =
    original && typeof original === 'object' && original.constructor === Array
      ? Object.assign({}, ...original)
      : original

  return desired.reduce((obj: TODO, key: TODO) => ({ ...obj, [key]: cleaned[key] }), {})
}

/**
 * kebabCase
 *
 * @param {*} value
 */
export function kebabCase(value: string) {
  const newValue = value
    .replace(/[^a-zA-Z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  if (!value) {
    return ''
  }

  return newValue
}

export async function fetchAllResources<T = Object>(endpoint: (params: Object) => Promise<PaginatedApiListResponse<T>>): Promise<{ items: T[]; total: number }> {
  try {
    let allTotal = null
    let offset = 0
    let allItems: T[] = []
    let previousNext: string | null = null

    while (true) {
      const params = { size: PAGE_REQUEST_SIZE_DEFAULT, offset }
      const { total, items, next } = await endpoint(params)

      if (Array.isArray(items)) {
        allItems = allItems.concat(items)
      }

      if (allTotal === null) {
        allTotal = total
      }

      if (!next || previousNext === next) {
        break
      }

      previousNext = next
      offset += PAGE_REQUEST_SIZE_DEFAULT
    }

    return { total: allTotal, items: allItems }
  } catch (e) {
    throw new Error(`Resource fetching failed: ${e}`)
  }
}

export function getZoneDpServerAuthType(zone: ZoneOverview): string {
  const subscriptions = zone.zoneInsight?.subscriptions ?? []

  if (subscriptions.length > 0) {
    const lastSubscription = subscriptions[subscriptions.length - 1]

    if (lastSubscription.config) {
      const parsedConfig = JSON.parse(lastSubscription.config)

      return get(parsedConfig, 'dpServer.auth.type', DISABLED)
    }
  }

  return DISABLED
}
