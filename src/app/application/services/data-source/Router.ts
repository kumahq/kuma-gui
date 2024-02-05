import { URLPattern } from 'urlpattern-polyfill'
const dataUriProtocol = 'data:'
export default class Router<T> {
  routes: Map<URLPattern, T> = new Map()
  constructor(routes: Record<string, T>) {
    Object.entries(routes).forEach(([key, value]) => {
      const pattern = key.startsWith(dataUriProtocol)
        ? new URLPattern({
          protocol: dataUriProtocol,
          pathname: key.substring(dataUriProtocol.length),

        })
        : new URLPattern({
          protocol: '*',
          pathname: key,
        })
      this.routes.set(pattern, value)
    })
  }

  match(path: string) {
    for (const [pattern, route] of this.routes) {
      const _url = path.startsWith('data:') ? path : `source:${path}`
      if (pattern.test(_url)) {
        const args = pattern.exec(_url)
        return {
          route,
          params: args?.pathname.groups || {},
        }
      }
    }
    throw new Error(`Matching route for '${path}' not found`)
  }
}
