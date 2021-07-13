<template>
  <div
    class="main-content-container"
  >
    <Sidebar />

    <main
      class="main-content"
    >
      <div
        class="page"
      >
        <OnboardingCheck />
        <div class="overview">
          <PageHeader noflex>
            <Breadcrumbs />
          </PageHeader>
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar/Sidebar'
import OnboardingCheck from '@/components/Utils/OnboardingCheck'
import PageHeader from '@/components/Utils/PageHeader.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'

export default {
  name: 'Shell',
  components: {
    PageHeader,
    Breadcrumbs,
    Sidebar,
    OnboardingCheck
  }
}
</script>
