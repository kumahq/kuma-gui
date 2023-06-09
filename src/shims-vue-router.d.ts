import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * Whether a route is part of the onboarding pages.
     */
    onboardingProcess?: boolean

    /**
     * Whether a route is part of a wizard (e.g. “Create mesh” or “Create data plane proxy”).
     */
    isWizard?: boolean

    /**
     * The module this route belongs to
     */
    module?: string
  }
}
