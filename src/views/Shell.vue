<template>
  <div class="overview">
    <page-header noflex>
      <breadcrumbs />
      <h2 class="xxl">
        {{ pageTitle }}
      </h2>
    </page-header>
    <page-content>
      <transition
        mode="out-in"
        name="fade"
      >
        <router-view />
      </transition>
    </page-content>
  </div>
</template>

<script>
import PageHeader from '@/components/Utils/PageHeader.vue'
import PageContent from '@/components/Utils/PageContent.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'

export default {
  name: 'Shell',
  components: {
    PageHeader,
    PageContent,
    Breadcrumbs
  },
  computed: {
    pageTitle () {
      const title = this.$route.meta.title
      const mesh = this.$route.params.mesh
      const dataplane = this.$route.params.dataplane
      const trafficPermission = this.$route.params.trafficpermission
      const trafficLog = this.$route.params.trafficlog
      const trafficRoute = this.$route.params.trafficroute
      const healthCheck = this.$route.params.healthcheck

      let assembled

      if (dataplane) {
        assembled = `${title} for ${dataplane}`
      } else if (trafficLog) {
        assembled = `${title} for ${trafficLog}`
      } else if (trafficRoute) {
        assembled = `${title} for ${trafficRoute}`
      } else if (trafficPermission) {
        assembled = `${title} for ${trafficPermission}`
      } else if (healthCheck) {
        assembled = `${title} for ${healthCheck}`
      } else if (mesh) {
        assembled = `${title} for ${mesh}`
      } else {
        assembled = title
      }

      return assembled
    }
  }
}
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity .12s linear;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
