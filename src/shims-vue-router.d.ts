import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * The module this route belongs to
     */
    module?: string

    /**
     * Whether to ignore this route in the forming of navigational tabs
     */
    shouldIgnoreInNavTabs?: boolean
  }
}
