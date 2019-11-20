<template>
  <div class="overview">
    <MetricGrid
      v-if="dataLoaded"
      :metrics="metricsData"
    />
    <KEmptyState
      v-else
      cta-is-hidden
    >
      <template slot="title">
        <div class="card-icon mb-3">
          <img src="~@/assets/images/icon-empty-table.svg?external">
        </div>
        No Data Found
      </template>
    </KEmptyState>
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
  data () {
    return {
      dataLoaded: false
    }
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
      this.dataLoaded = true

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

<style lang="scss">
.empty-state-title {

  .card-icon {
    text-align: center;

    img {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
