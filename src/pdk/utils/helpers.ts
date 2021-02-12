export function getMessageFromError (error) {
  if (error && error.response && error.response.data) {
    if (error.response.data.message) {
      return error.response.data.message
    }

    return Object.keys(error.response.data)
      .map(key => `${key} ${error.response.data[key]}`)
      .join(', ')
  }

  return error.message || 'There was an error'
}

export function navigateToUrl (url) {
  window.location.href = url
}

export function sortAlpha (property) {
  return (a, b) => a[property].localeCompare(b[property])
}

/**
 * Formats a unix timestamp into a formatted date string
 * @param {Number} timestamp a unix timestamp
 * @returns a date string with format YYYY-MM-DD HH:mm:ss ZZ
 */
export function formatDate (timestamp) {
  const date = new Date(timestamp * 1000)
  const day = date.getDate()
  const monthIndex = date.getMonth()
  const year = date.getFullYear()
  const time = date.toTimeString().split(' ')

  return year + '-' + (monthIndex < 10 ? '0' + (monthIndex + 1) : monthIndex + 1) + '-' + day + ' ' + time[0] + ' ' + time[1].substring(3, time[1].length)
}

/**
 * Test if a string is a valid URL format
 * @param {String} str - the string to test
 * @returns {Boolean}
 */
export function isValidUrl (str) {
  const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator

  return !!urlPattern.test(str)
}

export default {
  getMessageFromError,
  navigateToUrl,
  sortAlpha,
  formatDate,
  isValidUrl
}
