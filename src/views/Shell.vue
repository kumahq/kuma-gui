<template>
  <div class="main-content-container">
    <Sidebar />

    <main class="main-content">
      <div class="page">
        <OnboardingNotification v-if="showOnboarding" />
        <NotificationManager v-else />
        <Breadcrumbs />
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

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
  },
  computed: {
    ...mapGetters({
      showOnboarding: 'showOnboarding',
    }),
  },
}
</script>
