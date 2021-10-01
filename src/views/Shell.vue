<template>
  <div class="main-content-container">
    <Sidebar />

    <main class="main-content">
      <div class="page">
        <NotificationManager />
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

export default {
  name: 'Shell',
  components: {
    Breadcrumbs,
    Sidebar,
    NotificationManager,
  },
  computed: {
    ...mapGetters({
      showOnboarding: 'showOnboarding',
    }),
  },
}
</script>
