import { DISABLED, PAGE_REQUEST_SIZE_DEFAULT } from '@/consts'
import isPlainObject from 'lodash/isPlainObject'
import { ZoneOverview, ResourceResponse } from '@/types'
import get from 'lodash/get'

type TODO = any

export const uuidRegEx = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'

/**
 * Test if a string is a valid uuid
 * @param {String} str - the string to test
 * @returns {boolean}
 */
export function isValidUuid(str: string) {
  return str.length === 36 && new RegExp(`^${uuidRegEx}$`).test(str)
}

export function forEach(array: any[], callback: (...args: any) => void, scope: any) {
  for (let i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i])
  }
}

export function getPluginIcon(pluginName: string) {
  let icon

  try {
    icon = require(`./assets/images/plugin-icons/${pluginName}.png`)
  } catch (_) {
    icon = require('./assets/images/plugin-icons/missing.png')
  }

  return icon
}

/**
 * Formats a unix timestamp into a formatted date string
 * @param {Number} timestamp a unix timestamp in seconds
 * @returns a date string with format YYYY-MM-DD HH:mm:ss ZZ
 */
export function formatDate(timestamp: number) {
  const date = new Date(timestamp * 1000)
  const day = date
    .getDate()
    .toString()
    .padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const time = date.toTimeString().split(' ')

  return `${year}-${month}-${day} ${time[0]} ${time[1].substring(3, time[1].length)}`
}

/**
 * Compares two objects
 * @param {Object} Object A
 * @param {Object} Object B
 * @return {Boolean}
 */
export function compareObjects(a: Object, b: Object) {
  return JSON.stringify(a) === JSON.stringify(b)
}

/**
 * A method to easily check if an object is empty or not
 * @param {Object} Object to check
 * @return {Boolean}
 */
export function isObjectEmpty(obj: Object) {
  return Object.keys(obj).length === 0
}

/**
 * checks "target" children is included in the array "src"
 * if the "target" is an array
 * then recursively search into it
 * @param {Array} src
 * @param {Array} target
 * @returns {Boolean}
 */
export function deepIncludes(src: any[], target: any[]): boolean {
  if (!(src instanceof Array)) throw new Error('Params[0] needs to be an Array')

  if (target instanceof Array) return target.some(arr => deepIncludes(src, arr))

  return src.includes(target)
}

/**
 * =============================================================================
 * Kuma Helpers
 * =============================================================================
 */

/**
 * Outputs a friendly human-readable timeframe between now and the date string entered
 * @param {String} tdate
 */
export function humanReadableDate(tdate: string) {
  const systemDate = new Date(Date.parse(tdate))
  const userDate = new Date()

  const diff = Math.floor((+userDate - +systemDate) / 1000)

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

  // return 'on ' + systemDate
  return `on ${systemDate.toLocaleDateString()}`
}

/**
 * rawReadableDate
 */
export function rawReadableDate(date: string) {
  const rawDate = new Date(Date.parse(date))
  const options = {
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
 * @param {Object, Array} original
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
 * stripUrl
 *
 * Returns all of a URL after the last slash so that it does not
 * include the root of the URL that we don't need (e.g. when fetching from
 * an API).
 *
 * @param {String} url
 */
export function stripUrl(url: string) {
  const regex = new RegExp(/([^\/]+$)/g)
  const match = url.match(regex)?.[0]

  return match
}

/**
 * getOffset
 *
 * Returns the offset from an API query so that it can be used
 * for things like next and prev controls in pagination.
 *
 * @param {String} url The URL you want to find `offset` in and
 * simply return the value for.
 */
export function getOffset(url: string) {
  if (!url) {
    return ''
  }

  const regex = new RegExp(/offset=(\w+)/)
  const match = url.match(regex)?.[0].replace('offset=', '')

  return match
}

/**
 * stripTimes
 *
 * Strips the time values from the objects returned from
 * various endpoints, in a non-destructive manner.
 *
 * @param {Object} content The Object you want to remove the
 * date/time strings from.
 */
export function stripTimes(content: TODO) {
  const { creationTime, modificationTime, ...noTimes } = content

  return noTimes
}

/**
 * cleanTag
 *
 * This function will take native Kuma tags and format
 * them for things like CSS class usage.
 */
export function cleanTag(tag: string) {
  /**
   * this takes something like `kuma.io/service` and turns it into
   * `kuma-io-service`.
   */

  return tag
    .toLowerCase()
    .replace('.', '-')
    .replace('/', '-')
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

export function filterResourceByMesh(resources: { mesh: string }[]) {
  return (wantMesh: undefined | 'all') => {
    if (!wantMesh || wantMesh === 'all') {
      return resources
    }

    return resources.filter(({ mesh }) => mesh === wantMesh)
  }
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
  callEndpoint: (params: Object) => Promise<ResourceResponse<T>>
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

export default {
  forEach,
  getPluginIcon,
  formatDate,
  deepIncludes,
  humanReadableDate,
  rawReadableDate,
  getSome,
  stripUrl,
  getOffset,
  stripTimes,
  cleanTag,
  camelCaseToWords,
  kebabCase,
  getZoneDpServerAuthType,
}
