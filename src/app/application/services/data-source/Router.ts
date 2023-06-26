export default class Router<T> {
  routes: Map<URLPattern, T> = new Map()
  constructor(routes: Record<string, T>) {
    Object.entries(routes).forEach(([key, value]) => {
      this.routes.set(new URLPattern({
        pathname: key,
      }), value)
    })
  }

  match(path: string) {
    for (const [pattern, route] of this.routes) {
      const _url = `data:${path}`
      if (pattern.test(_url)) {
        const args = pattern.exec(_url)
        return { route, params: args?.pathname.groups }
      }
    }
    throw new Error(`Matching route for '${path}' not found`)
  }
}
