/**
 * Determines the URL path from which the GUI application is served.
 *
 * This is unknown to us at build time. The application can be served from an arbitrarily nested path. Without this, router-created links and API request URLs will be incorrect.
 *
 * @returns the app’s base URL without a trailing slash.
 */
export function getAppBaseUrl(location: { origin: string, pathname: string }): string {
  const pathSegments = location.pathname.split('/').filter((segment) => segment !== '')
  const guiPathSegmentIndex = pathSegments.findIndex((segment) => segment === 'gui')
  const basePathSegments = guiPathSegmentIndex !== -1 ? pathSegments.slice(0, guiPathSegmentIndex) : pathSegments

  if (basePathSegments.length > 0) {
    return location.origin + '/' + basePathSegments.join('/')
  } else {
    return location.origin
  }
}
