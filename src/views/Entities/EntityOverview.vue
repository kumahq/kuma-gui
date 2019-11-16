<template>
  <div class="overview">
    <MetricGrid
      :metrics="metricsData"
    />
  </div>
</template>

<script>
import MetricGrid from '@/components/Metrics/MetricGrid'

export default {
  name: 'Overview',
  metaInfo () {
    return {
      title: `${this.$route.meta.title} for ${this.$route.params.mesh}`
    }
  },
  components: {
    MetricGrid
  },
  computed: {
    metricsData () {
      return [
        {
          metric: 'Dataplanes',
          value: this.$store.state.totalDataplaneCountFromMesh
        },
        {
          metric: 'Traffic Routes',
          value: this.$store.state.totalTrafficRoutesCountFromMesh
        },
        {
          metric: 'Traffic Permissions',
          value: this.$store.state.totalTrafficPermissionsCountFromMesh
        },
        {
          metric: 'Traffic Logs',
          value: this.$store.state.totalTrafficLogsCountFromMesh
        }
      ]
    }
  },
  watch: {
    $route (to, from) {
      this.bootstrap()
    }
  },
  beforeMount () {
    this.bootstrap()
  },
  methods: {
    bootstrap () {
      // get the total number of dataplanes from selected mesh
      this.$store.dispatch('getDataplaneFromMeshTotalCount', this.$route.params.mesh)

      // get the total number of traffic routes from selected mesh
      this.$store.dispatch('getTrafficRoutesFromMeshTotalCount', this.$route.params.mesh)

      // get the total number of traffic permissions from selected mesh
      this.$store.dispatch('getTrafficPermissionsFromMeshTotalCount', this.$route.params.mesh)

      // get the total number of traffic logs from selected mesh
      this.$store.dispatch('getTrafficLogsFromMeshTotalCount', this.$route.params.mesh)
    }
  }
}
</script>
