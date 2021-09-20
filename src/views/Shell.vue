<template>
  <div>
    <GlobalHeader />
    <div class="main-content-container">
      <Sidebar />

      <main class="main-content">
        <NotificationManager />
        <OnboardingNotification v-if="showOnboarding" />
        <Breadcrumbs />
        <transition
          mode="out-in"
          name="fade"
        >
          <router-view />
        </transition>
      </main>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import GlobalHeader from '@/components/Global/Header'
import Sidebar from '@/components/Sidebar/Sidebar'
import NotificationManager from '@/components/NotificationManager'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import OnboardingNotification from '@/components/NotificationManager/components/OnboardingNotification.vue'

export default {
  name: 'Shell',
  components: {
    Breadcrumbs,
    Sidebar,
    NotificationManager,
    OnboardingNotification,
    GlobalHeader,
  },
  computed: {
    ...mapGetters({
      showOnboarding: 'onboarding/showOnboarding',
    }),
  },
}
</script>
