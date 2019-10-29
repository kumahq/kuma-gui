const capitalizeRegEx = /(?:^|[\s-:'"])\w/g

export const uuidRegEx = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'

export function capitalize (str) {
  return str.replace(capitalizeRegEx, (a) => a.toUpperCase())
}

/**
 * Test if a string is a valid uuid
 * @param {String} str - the string to test
 * @returns {boolean}
 */
export function isValidUuid (str) {
  return str.length === 36 && new RegExp(`^${uuidRegEx}$`).test(str)
}

export function getConfig (name, defaultValue) {
  if (!window.K_CONFIG) {
    return defaultValue
  }

  const value = window.K_CONFIG[name]
  if (value === '' || value == null || value.indexOf('{{') === 0) {
    return defaultValue
  }

  try {
    // Properly handle booleans, numbers, arrays, and objects
    return JSON.parse(value)
  } catch (e) {
    // Value must have be a string or empty
    return value
  }
}

export function redirectOnResponseStatus ($router, status, location, options) {
  const opts = options || {}
  const changeRoute = opts.replace ? $router.replace : $router.push

  return function (response) {
    // Handle both success and error responses
    const resp = response.response ? response.response : response

    if (resp && resp.status === status) {
      changeRoute.call($router, location)
    }
  }
}

export function redirectBackOnResponseStatus ($router, status) {
  return function (response) {
    const resp = response.response ? response.response : response
    if (resp && resp.status === status) {
      $router.go(-1)
    }
  }
}

export function getPortalURL (config, workspaceName) {
  if (!config || !config.portal_gui_protocol || !config.portal_gui_host) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const listenerPort = protocol === 'https:'
      ? config.portal_gui_listeners.filter(item => item.ssl === true)[0].port
      : config.portal_gui_listeners.filter(item => item.ssl === false)[0].port

    return `${protocol}//${domain}:${listenerPort}`
  }

  if (config.portal_gui_use_subdomains) {
    return `${config.portal_gui_protocol}://${workspaceName}.${config.portal_gui_host}`
  }

  return `${config.portal_gui_protocol}://${config.portal_gui_host}/${workspaceName}`
}

/**
 * Base64 encoded string that is an object
 * @param {string} item
 * @returns {Object}
 */
export function decodeItem (item) {
  const decoded = atob(item)
  if (decoded && item) {
    return JSON.parse(decoded)
  }

  return {}
}

export function encodeItem (item) {
  return btoa(JSON.stringify(item))
}

export function forEach (array, callback, scope) {
  for (let i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i])
  }
}

export function removeObjectKeys (object, key) {
  const obj = object

  Object.keys(obj).forEach(field => {
    if (field.indexOf(key) === 0) {
      delete obj[field]
    }
  })

  return obj
}

/**
 * Check if string has a protocol (e.g. http or https)
 * @param {String} str the string in question
 */
export function hasProtocol (str) {
  const protocolPattern = /^https?:\/\//i

  return protocolPattern.test(str)
}

export function decodeJWT (token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace('-', '+').replace('_', '/')

  return JSON.parse(window.atob(base64))
}

export function convertToDotNotation (key) {
  return key.replace(/-/g, '.')
}

export function getPluginIcon (pluginName) {
  let icon

  try {
    icon = require(`@/assets/images/plugin-icons/${pluginName}.png`)
  } catch (_) {
    icon = require('@/assets/images/plugin-icons/missing.png')
  }

  return icon
}

/**
 * Formats a unix timestamp into a formatted date string
 * @param {Number} timestamp a unix timestamp in seconds
 * @returns a date string with format YYYY-MM-DD HH:mm:ss ZZ
 */
export function formatDate (timestamp) {
  const date = new Date(timestamp * 1000)
  const day = date.getDate().toString().padStart(2, 0)
  const month = (date.getMonth() + 1).toString().padStart(2, 0)
  const year = date.getFullYear()
  const time = date.toTimeString().split(' ')

  return year + '-' + month + '-' + day + ' ' + time[0] + ' ' + time[1].substring(3, time[1].length)
}

/**
 * Compares two objects
 * @param {Object} Object A
 * @param {Object} Object B
 * @return {Boolean}
 */
export function compareObjects (a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

/**
 * A method to easily check if an object is empty or not
 * @param {Object} Object to check
 * @return {Boolean}
 */
export function isObjectEmpty (obj) {
  return Object.keys(obj).length === 0
}

/**
 * Takes an object with dot notated keys (key.nested.values)
 * and returns an object with nested objects (key: { nested: values })
 * @param {Object} obj
 * @returns {Object}
 */
export function unFlattenObject (obj) {
  const result = {}

  // Loop object and reduce each key to build
  // nested structure
  for (const key in obj) {
    const keys = key.split('.')

    keys.reduce((acc, cur, curIdx) => {
      return acc[cur] ||
        // If current key in acc is the next
        // item in the split array (dot notation)
        // set its value
        (acc[cur] = isNaN(keys[curIdx + 1])
          ? (keys.length - 1 === curIdx ? obj[key] : {})
          : [])
    }, result)
  }

  return result
}

/**
 * checks "target" children is included in the array "src"
 * if the "target" is an array
 * then recursively search into it
 * @param {Array} src
 * @param {Array} target
 * @returns {Boolean}
 */
export function deepIncludes (src, target) {
  if (!(src instanceof Array)) throw new Error('Params[0] needs to be an Array')

  if (target instanceof Array) return target.some(arr => deepIncludes(src, arr))

  return src.includes(target)
}

export default {
  forEach,
  decodeJWT,
  getConfig,
  capitalize,
  encodeItem,
  decodeItem,
  hasProtocol,
  getPortalURL,
  removeObjectKeys,
  convertToDotNotation,
  redirectOnResponseStatus,
  getPluginIcon,
  formatDate,
  deepIncludes
}
