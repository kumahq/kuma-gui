<template>
  <div class="test-overview">
    <DataOverview
      :display-metrics="true"
      :metrics-data="tableData"
      :cta-action="ctaAction"
      :empty-state="empty_state"
    >
      <template slot="content">
        <p>Hello world</p>
      </template>
    </DataOverview>
  </div>
</template>

<script>
import DataOverview from '@/components/Skeletons/DataOverview'

export default {
  name: 'TestOverview',
  metaInfo () {
    return {
      title: `${this.$route.meta.title} for ${this.$route.params.mesh}`
    }
  },
  components: {
    DataOverview
  },
  data () {
    return {
      isLoading: true,
      isEmpty: false,
      hasError: false,
      empty_state: {
        title: 'No Data',
        message: 'There are no items present.',
        ctaText: 'Hello World'
      }
    }
  },
  computed: {
    ctaAction () {
      return { name: 'global-overview' }
    },
    tableData () {
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
      this.isLoading = true
      this.isEmpty = false

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
