import {
  createRouter as createVueRouter,
  createWebHistory,
  NavigationGuard,
  Router,
  RouteRecordRaw,
} from 'vue-router'

import type { State } from '@/store/storeConfig'
import { ClientStorage } from '@/utilities/ClientStorage'
import type { Store } from 'vuex'

export function createRouter(routes: RouteRecordRaw[], store: Store<State>, baseGuiPath: string = '/'): Router {
  const router = createVueRouter({
    history: createWebHistory(baseGuiPath),
    routes,
  })

  router.beforeEach(redirectOldHashHistoryUrlPaths())
  router.beforeEach(onboardingRouteGuard(store))

  return router
}

/**
 * Redirects navigations to old hash history-style URL paths.
 */
const redirectOldHashHistoryUrlPaths = (): NavigationGuard => (to, _from, next) => {
  if (to.fullPath.startsWith('/#/')) {
    next(to.fullPath.substring(2))
  } else {
    next()
  }
}

/**
 * Redirects the user to the appropriate onboarding view if they haven’t completed it, yet.
 *
 * Redirects the user to the home view if they’re navigating to an onboarding route while having already completed onboarding. An exception is made when we suggest onboarding for users who don’t have data plane proxies, yet (we show an alert suggesting it and allow going to the onboarding again).
 */
const onboardingRouteGuard = (store: Store<State>): NavigationGuard => (to, _from, next) => {
  const isOnboardingCompleted = store.state.onboarding.isCompleted
  const isOnboardingRoute = to.meta.onboardingProcess
  const shouldSuggestOnboarding = store.getters.shouldShowOnboardingNotification

  if (isOnboardingCompleted && isOnboardingRoute && !shouldSuggestOnboarding) {
    next({ name: 'home' })
  } else if (!isOnboardingCompleted && !isOnboardingRoute && shouldSuggestOnboarding) {
    next({ name: ClientStorage.get('onboardingStep') ?? 'onboarding-welcome' })
  } else {
    next()
  }
}
