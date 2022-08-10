<template>
  <div>
    <GlobalHeader />
    <div class="main-content-container">
      <AppSidebar />

      <main class="main-content">
        <NotificationManager />
        <OnboardingNotification v-if="showOnboarding" />
        <BreadcrumbsMenu />
        <transition
          mode="out-in"
          name="fade"
        >
          <router-view :key="routeKey" />
        </transition>
      </main>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import GlobalHeader from '@/components/Global/GlobalHeader.vue'
import AppSidebar from '@/components/Sidebar/AppSidebar.vue'
import NotificationManager from '@/components/NotificationManager/NotificationManager.vue'
import BreadcrumbsMenu from '@/components/BreadcrumbsMenu.vue'
import OnboardingNotification from '@/components/NotificationManager/components/OnboardingNotification.vue'

export default {
  name: 'AppShell',
  components: {
    BreadcrumbsMenu,
    AppSidebar,
    NotificationManager,
    OnboardingNotification,
    GlobalHeader,
  },
  computed: {
    ...mapGetters({
      showOnboarding: 'onboarding/showOnboarding',
    }),

    /**
     * The `router-view`’s `key` attribute value.
     *
     * Is always set to `'default'` (i.e. will never trigger an explicit re-render via Vue’s `key` mechanism).
     * However, in some scenarios, we want Vue to re-render a route’s components
     * (e.g. `src/views/Policies/PolicyView.vue` which is used by some dozen policy routes).
     */
    routeKey() {
      if (this.$route.meta.shouldReRender) {
        return this.$route.path
      }

      return 'default'
    },
  },
}
</script>
