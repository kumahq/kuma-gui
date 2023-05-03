import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * The title of a route which is used as the document title and the title shown in the breadcrumb navigation.
     */
    title?: string

    /**
     * Defines a route record as participating in breadcrumb creation. Defaults to `false`.
     */
    isBreadcrumb?: boolean

    /**
     * Reads the breadcrumb title from the route parameter of the given name.
     */
    breadcrumbTitleParam?: string

    /**
     * Allows routes to define their breadcrumb title programmatically based on current route and store data.
     *
     * Takes precedence over the `breadcrumbTitleParam` mechanism.
     */
    getBreadcrumbTitle?: (route: RouteLocationNormalizedLoaded, store: Store<State>) => string

    /**
     * Whether a route is part of the onboarding pages.
     */
    onboardingProcess?: boolean

    /**
     * Whether a route is part of a wizard (e.g. “Create mesh” or “Create data plane proxy”).
     */
    isWizard?: boolean
  }
}
