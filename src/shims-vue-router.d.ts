import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * The title of a route which is used as the document title and the title shown in the breadcrumb navigation).
     */
    title?: string

    /**
     * Sets a route’s parent route for displaying it in the breadcrumb and main navigation.
     */
    parent?: string

    /**
     * Reads the breadcrumb title from the route parameter of the given name.
     */
    breadcrumbTitleParam?: string

    /**
     * Whether a route is part of the onboarding pages.
     */
    onboardingProcess?: boolean

    /**
     * Whether a route is part of a wizard (e.g. “Create mesh” or “Create data plane proxy”).
     */
    wizardProcess?: boolean

    /**
     * Indicates that a router-view rendering this route should be re-rendered on a path change via an updated `key` attribute (see `src/app/App.vue` for an implementation example).
     */
    shouldReRender?: boolean
  }
}
