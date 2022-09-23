import isPlainObject from 'lodash/isPlainObject'
import get from 'lodash/get'

import { DISABLED, PAGE_REQUEST_SIZE_DEFAULT } from '@/consts'
import { ApiListResponse } from '@/api'
import { ZoneOverview } from '@/types'

type TODO = any

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

  return systemDate.toLocaleDateString()
}

/**
 * rawReadableDate
 */
export function rawReadableDate(date: string) {
  const rawDate = new Date(Date.parse(date))
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  const formattedDate = rawDate.toLocaleDateString('en-US', options)
  const formattedTime = `${rawDate.getHours()}:${rawDate.getMinutes()}:${rawDate.getSeconds()}`

  return `${formattedDate} @ ${formattedTime}`
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
 * camelCaseToWords
 *
 * Converts camelcase to human-readable words in titlecase format
 *
 * @param {String} str
 */
export function camelCaseToWords(str: string) {
  const search = /^[a-z]+|[A-Z][a-z]*/g

  return str
    .match(search)
    ?.map((x: string) => x[0].toUpperCase() + x.substr(1).toLowerCase())
    .join(' ')
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

export function applyPropsToObject(props: TODO = {}, object: TODO = {}) {
  Object.entries(props).forEach(([key, value]) => {
    if (isPlainObject(value)) {
      return applyPropsToObject(value, object[key])
    }

    object[key] = value
  })
}

export async function fetchAllResources<T = Object>({
  callEndpoint,
}: {
  callEndpoint: (params: Object) => Promise<ApiListResponse<T>>
}): Promise<{ items: T[]; total: number }> {
  try {
    let allTotal = null
    let offset = 0
    let allItems: TODO[] = []

    while (true) {
      const params = { size: PAGE_REQUEST_SIZE_DEFAULT, offset }
      const { total, items, next } = await callEndpoint(params)

      if (items) {
        allItems = allItems.concat(items)
      }

      if (allTotal === null) {
        allTotal = total
      }

      if (total !== allTotal) {
        throw new Error('Mismatch between "total" values between requests')
      }

      if (!next) {
        break
      }

      offset += PAGE_REQUEST_SIZE_DEFAULT
    }

    return { total: allTotal, items: allItems }
  } catch (e) {
    throw new Error(`Resource fetching failed: ${e}`)
  }
}

export function getZoneDpServerAuthType(zone: ZoneOverview): string {
  const subscriptionsLength = get(zone, 'zoneInsight.subscriptions.length', 0)

  if (subscriptionsLength && zone.zoneInsight.subscriptions[subscriptionsLength - 1].config) {
    const parsedConfig = JSON.parse(zone.zoneInsight.subscriptions[subscriptionsLength - 1].config)

    return get(parsedConfig, 'dpServer.auth.type', DISABLED)
  }

  return DISABLED
}
