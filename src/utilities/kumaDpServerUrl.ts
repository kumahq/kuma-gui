export function kumaDpServerUrl(): string {
  const dpServerUrl = String(import.meta.env.VITE_KUMA_DP_SERVER_URL)

  if (import.meta.env.PROD) {
    return dpServerUrl.replace('localhost', window.location.hostname)
  } else {
    return dpServerUrl
  }
}
