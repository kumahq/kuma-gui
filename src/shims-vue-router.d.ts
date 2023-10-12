import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * The module this route belongs to
     */
    module?: string
  }
}
