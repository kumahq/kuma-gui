/**
 * @returns the app’s GUI path without a trailing slash.
 */
export function getAppGuiPath(location: { origin: string, pathname: string }): string {
  const pathSegments = location.pathname.split('/').filter((segment) => segment !== '')
  const guiPathSegmentIndex = pathSegments.findIndex((segment) => segment === 'gui')

  if (guiPathSegmentIndex !== -1) {
    return '/' + pathSegments.slice(0, guiPathSegmentIndex + 1).join('/')
  } else {
    return ''
  }
}
