<template>
  <div class="main-content-container">
    <Sidebar />

    <main class="main-content">
      <div class="page">
        <OnboardingCheck v-if="showOnboarding" />
        <Breadcrumbs />
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Sidebar from '@/components/Sidebar/Sidebar'
import OnboardingCheck from '@/components/Utils/OnboardingCheck'
import Breadcrumbs from '@/components/Breadcrumbs.vue'

export default {
  name: 'Shell',
  components: {
    Breadcrumbs,
    Sidebar,
    OnboardingCheck,
  },
  computed: {
    ...mapState({
      dpCount: 'totalDataplaneCount',
      meshes: 'meshes',
    }),
    showOnboarding() {
      const onlyDefaultMesh = this.meshes.total === 1 && this.meshes.items[0].name === 'default'
      const noDataplane = this.dpCount === 0

      return noDataplane && onlyDefaultMesh
    },
  },
}
</script>
