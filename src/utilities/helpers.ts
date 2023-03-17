import { DISABLED, PAGE_REQUEST_SIZE_DEFAULT } from '@/constants'
import { PaginatedApiListResponse } from '@/types/api.d'
import { ZoneOverview } from '@/types/index.d'
import { get } from '@/utilities/get'

type TODO = any

const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' })
const dateTimeFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'medium' })

/**
 * Outputs a friendly human-readable timeframe between now and the date string entered.
 */
export function humanReadableDate(tdate: string): string {
  const systemDate = new Date(Date.parse(tdate))

  const diff = Math.floor((Date.now() - systemDate.getTime()) / 1000)

  if (diff <= 1) {
    return 'just now'
  }

  if (diff < 20) {
    return `${diff} seconds ago`
  }

  if (diff < 40) {
    return 'half a minute ago'
  }

  if (diff < 60) {
    return 'less than a minute ago'
  }

  if (diff <= 90) {
    return 'one minute ago'
  }

  if (diff <= 3540) {
    return `${Math.round(diff / 60)} minutes ago`
  }

  if (diff <= 5400) {
    return '1 hour ago'
  }

  if (diff <= 86400) {
    return `${Math.round(diff / 3600)} hours ago`
  }

  if (diff <= 129600) {
    return '1 day ago'
  }

  if (diff < 604800) {
    return `${Math.round(diff / 86400)} days ago`
  }

  if (diff <= 777600) {
    return '1 week ago'
  }

  return dateFormat.format(systemDate)
}

export function rawReadableDate(date: string): string {
  const parsedDate = new Date(Date.parse(date))

  return dateTimeFormat.format(parsedDate)
}

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
 * stripTimes
 *
 * Strips the time values from the objects returned from
 * various endpoints, in a non-destructive manner.
 *
 * @param object The Object you want to remove the
 * date/time strings from.
 */
export function stripTimes<T extends { creationTime?: any, modificationTime?: any, [key: string]: any }>(object: T): Omit<T, 'creationTime' | 'modificationTime'> {
  const { creationTime, modificationTime, ...noTimes } = object

  return noTimes
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

      if (total !== allTotal) {
        throw new Error('Mismatch between "total" values between requests')
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
