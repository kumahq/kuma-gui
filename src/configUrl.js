/**
 * determines the config URL based on environment
 */
export default () => {
  const url = window.location

  if (process.env.NODE_ENV === 'development') {
    return process.env.VUE_APP_KUMA_CONFIG
  } else {
    return `${url.origin}${url.pathname.replace('/gui/', '/')}${process.env.VUE_APP_KUMA_CONFIG}/`
  }
}
