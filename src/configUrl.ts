/**
 * determines the config URL based on environment
 */

export function getKumaCpServerUrl(): string {
  if (process.env.NODE_ENV === 'development') {
    return process.env.VUE_APP_KUMA_CONFIG.replace('/config', '/') || ''
  } else {
    const href = window.location.href

    return `${href.substring(0, href.indexOf('/gui'))}/`
  }
}

export function kumaDpServerUrl(): string {
  const url = window.location
  const envConfig = String(process.env.VUE_APP_KUMA_DP_SERVER_URL)

  if (process.env.NODE_ENV === 'development') {
    return envConfig
  }

  return envConfig.replace('localhost', url.hostname)
}
