<template>
  <div class="overview">
    <DataOverview
      :has-error="hasError"
      :is-loading="isLoading"
      :is-empty="isEmpty"
      :display-metrics="true"
      :metrics-data="metricsData"
      :empty-state="empty_state"
      :display-refresh-control="false"
    />
    <YamlView
      title="Entity Overview"
      :content="entity"
    />
  </div>
</template>

<script>
import YamlView from '@/components/Skeletons/YamlView'
import DataOverview from '@/components/Skeletons/DataOverview'

export default {
  name: 'Overview',
  metaInfo () {
    return {
      title: `${this.$route.meta.title} for ${this.$route.params.mesh}`
    }
  },
  components: {
    DataOverview,
    YamlView
  },
  data () {
    return {
      isLoading: true,
      isEmpty: false,
      hasError: false,
      tableDataIsEmpty: false,
      empty_state: {
        title: 'No Data',
        message: 'There are no meshes present.'
      },
      entity: null
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
          metric: 'Health Checks',
          value: this.$store.state.totalHealthChecksCountFromMesh
        },
        {
          metric: 'Proxy Templates',
          value: this.$store.state.totalProxyTemplatesCountFromMesh
        },
        {
          metric: 'Traffic Logs',
          value: this.$store.state.totalTrafficLogsCountFromMesh
        },
        {
          metric: 'Traffic Permissions',
          value: this.$store.state.totalTrafficPermissionsCountFromMesh
        },
        {
          metric: 'Traffic Routes',
          value: this.$store.state.totalTrafficRoutesCountFromMesh
        }
      ]
    }
  },
  watch: {
    '$route' (to, from) {
      this.bootstrap()
    }
  },
  beforeMount () {
    this.bootstrap()
  },
  methods: {
    getEntity () {
      const mesh = this.$route.params.mesh || this.$store.getters.getSelectedMesh

      this.$api.getMesh(mesh)
        .then(response => {
          if (response) {
            this.entity = response
          } else {
            this.$router.push('/404')
          }
        })
        .catch(error => {
          this.hasError = true

          console.error(error)
        })
        .finally(() => {
          setTimeout(() => {
            this.isLoading = false
          }, process.env.VUE_APP_DATA_TIMEOUT)
        })
    },
    bootstrap () {
      this.isLoading = true
      this.isEmpty = false

      const mesh = this.$route.params.mesh

      // fetch the entity for YAML formatting
      this.getEntity()

      // get the total number of dataplanes from selected mesh
      this.$store.dispatch('getDataplaneFromMeshTotalCount', mesh)

      // get the total number of traffic routes from selected mesh
      this.$store.dispatch('getTrafficRoutesFromMeshTotalCount', mesh)

      // get the total number of traffic permissions from selected mesh
      this.$store.dispatch('getTrafficPermissionsFromMeshTotalCount', mesh)

      // get the total number of traffic logs from selected mesh
      this.$store.dispatch('getTrafficLogsFromMeshTotalCount', mesh)

      // get the total number of health checks from selected mesh
      this.$store.dispatch('getHealthChecksFromMeshTotalCount', mesh)

      // get the total number of proxy templates from selected mesh
      this.$store.dispatch('getProxyTemplatesTotalCount', mesh)
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
