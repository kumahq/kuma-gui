/**
 *
 * rejectKeys
 *
 * Excludes keys from an object in a non-destructive manner.
 *
 * @param {Object} obj
 * @param {Array} keys
 */
export function rejectKeys (obj, keys) {
  return Object.keys(obj)
    .filter(k => !keys.includes(k))
    .map(k => Object.assign({}, { [k]: obj[k] }))
    .reduce((res, o) => Object.assign(res, o), {})
}

/**
 *
 * pickKeys
 *
 * This will whitelist attributes from an object.
 * It is the opposite of rejectKeys
 *
 * @param {Object} obj
 * @param {Array} keys
 */
export function pickKeys (obj, keys) {
  return keys.map(k => k in obj ? { [k]: obj[k] } : {})
    .reduce((res, o) => Object.assign(res, o), {})
}

export default {
  rejectKeys,
  pickKeys
}
