<template>
  <div class="overview">
    <page-header noflex>
      <breadcrumbs />
    </page-header>

    <!-- metrics boxes -->
    <MetricGrid
      :metrics="overviewMetrics"
    />

    <div class="card-wrapper card-wrapper--3-col">
      <div>
        <CardSkeleton
          class="card-item"
          :card-action-route="{ name: 'create-mesh' }"
          card-title="Create a new Mesh resource"
          card-action-button-text="Create Mesh"
        >
          <template slot="cardContent">
            <p>
              You can create multiple Mesh resources (i.e. per application, or per team)
              on the same {{ title }} cluster.
            </p>
          </template>
        </CardSkeleton>
      </div>
      <div>
        <CardSkeleton
          class="card-item"
          :card-action-route="dataplaneWizardRoute"
          :card-title="`Connect a Dataplane to ${title}`"
          card-action-button-text="Connect Dataplanes"
        >
          <template slot="cardContent">
            <p>
              Every service must have its own Dataplane resource in order to start
              the data plane proxy and associate it with a Mesh.
            </p>
          </template>
        </CardSkeleton>
      </div>
      <div>
        <CardSkeleton
          class="card-item"
          card-action-route="https://kuma.io/policies/"
          :card-title="`Apply ${title} Policies`"
          card-action-button-text="Explore Policies"
          external-link
        >
          <template slot="cardContent">
            <p>
              Once we have created your Mesh and started the data planes, we can now
              use {{ title }} Policies to manage the Mesh.
            </p>
          </template>
        </CardSkeleton>
      </div>
      <div>
        <Resources class="card-item" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MetricGrid from '@/components/Metrics/MetricGrid.vue'
import CardSkeleton from '@/components/Skeletons/CardSkeleton'
import Resources from '@/components/Resources'

export default {
  name: 'Overview',
  metaInfo () {
    return {
      title: this.$route.meta.title
    }
  },
  components: {
    MetricGrid,
    CardSkeleton,
    Resources
  },
  computed: {
    ...mapGetters({
      title: 'getTagline',
      environment: 'getEnvironment',
      selectedMesh: 'getSelectedMesh',
      multicluster: 'getMulticlusterStatus'
    }),
    pageTitle () {
      const metaTitle = this.$route.meta.title
      const mesh = this.selectedMesh

      if (mesh === 'all') {
        return `${metaTitle} for all Meshes`
      } else {
        return `${metaTitle} for ${mesh}`
      }
    },
    overviewMetrics () {
      let storeVals
      const mesh = this.selectedMesh
      const state = this.$store.state

      if (mesh === 'all') {
        storeVals = {
          meshCount: state.totalMeshCount,
          dataplaneCount: state.totalDataplaneCount,
          faultInjectionCount: state.totalFaultInjectionCount,
          healthCheckCount: state.totalHealthCheckCount,
          proxyTemplateCount: state.totalProxyTemplateCount,
          trafficLogCount: state.totalTrafficLogCount,
          trafficPermissionCount: state.totalTrafficPermissionCount,
          trafficRouteCount: state.totalTrafficRouteCount,
          trafficTraceCount: state.totalTrafficTraceCount,
          circuitBreakerCount: state.totalCircuitBreakerCount
        }
      } else {
        storeVals = {
          dataplaneCount: state.totalDataplaneCountFromMesh,
          faultInjectionCount: state.totalFaultInjectionCountFromMesh,
          healthCheckCount: state.totalHealthCheckCountFromMesh,
          proxyTemplateCount: state.totalProxyTemplateCountFromMesh,
          trafficLogCount: state.totalTrafficLogCountFromMesh,
          trafficPermissionCount: state.totalTrafficPermissionCountFromMesh,
          trafficRouteCount: state.totalTrafficRouteCountFromMesh,
          trafficTraceCount: state.totalTrafficTraceCountFromMesh,
          circuitBreakerCount: state.totalCircuitBreakerCountFromMesh
        }
      }

      const tableData = [
        {
          metric: 'Meshes',
          value: storeVals.meshCount,
          url: `/meshes/${this.selectedMesh}`
        },
        {
          metric: 'Dataplanes',
          value: storeVals.dataplaneCount,
          url: `/${this.selectedMesh}/dataplanes`
        },
        {
          metric: 'Circuit Breakers',
          value: storeVals.circuitBreakerCount,
          url: `/${this.selectedMesh}/circuit-breakers`
        },
        {
          metric: 'Fault Injections',
          value: storeVals.faultInjectionCount,
          url: `/${this.selectedMesh}/fault-injections`
        },
        {
          metric: 'Health Checks',
          value: storeVals.healthCheckCount,
          url: `/${this.selectedMesh}/health-checks`
        },
        {
          metric: 'Proxy Templates',
          value: storeVals.proxyTemplateCount,
          url: `/${this.selectedMesh}/proxy-templates`
        },
        {
          metric: 'Traffic Logs',
          value: storeVals.trafficLogCount,
          url: `/${this.selectedMesh}/traffic-logs`
        },
        {
          metric: 'Traffic Permissions',
          value: storeVals.trafficPermissionCount,
          url: `/${this.selectedMesh}/traffic-permissions`
        },
        {
          metric: 'Traffic Routes',
          value: storeVals.trafficRouteCount,
          url: `/${this.selectedMesh}/traffic-routes`
        },
        {
          metric: 'Traffic Traces',
          value: storeVals.trafficTraceCount,
          url: `/${this.selectedMesh}/traffic-traces`
        }
      ]

      // append Zones to the data
      const clusters = {
        metric: 'Zones',
        value: this.multicluster
          ? this.$store.state.totalClusters
          : '1',
        extraLabel: !this.multicluster ? '(Standalone)' : false,
        url: '/zones'
      }

      // prepend our Zones to the beginning of the array
      tableData.unshift(clusters)

      if (mesh !== 'all') {
        // if the user is viewing the overview with a mesh selected,
        // we hide the mesh count from the metrics grid
        return tableData.filter((value, index, arr) => {
          return value.metric !== 'Meshes'
        })
      }

      return tableData
    },
    dataplaneWizardRoute () {
      // we change the route to the Dataplane
      // wizard based on environment.
      if (this.environment === 'universal') {
        return { name: 'universal-dataplane' }
      } else {
        return { name: 'kubernetes-dataplane' }
      }
    }
  },
  watch: {
    selectedMesh () {
      this.init()
    }
  },
  beforeMount () {
    this.init()
  },
  methods: {
    init () {
      this.getCounts()

      if (this.multicluster) {
        this.$store.dispatch('fetchTotalClusterCount')
      }
    },
    getCounts () {
      let actions
      const mesh = this.selectedMesh

      if (mesh === 'all') {
        // if we are viewing data for all meshes,
        // load the total counts for everything
        actions = [
          'fetchTotalClusterCount',
          'fetchMeshTotalCount',
          'fetchDataplaneTotalCount',
          'fetchHealthCheckTotalCount',
          'fetchProxyTemplateTotalCount',
          'fetchTrafficLogTotalCount',
          'fetchTrafficPermissionTotalCount',
          'fetchTrafficRouteTotalCount',
          'fetchTrafficTraceTotalCount',
          'fetchFaultInjectionTotalCount',
          'fetchCircuitBreakerTotalCount'
        ]

        // run each action
        actions.forEach(i => {
          this.$store.dispatch(i)
        })
      } else {
        // if we are viewing data for a single selected mesh,
        // load the total counts just for that selected mesh
        actions = [
          'fetchTotalClusterCount',
          'fetchDataplaneTotalCountFromMesh',
          'fetchHealthCheckTotalCountFromMesh',
          'fetchProxyTemplateTotalCountFromMesh',
          'fetchTrafficLogTotalCountFromMesh',
          'fetchTrafficPermissionTotalCountFromMesh',
          'fetchTrafficRouteTotalCountFromMesh',
          'fetchTrafficTraceTotalCountFromMesh',
          'fetchFaultInjectionTotalCountFromMesh',
          'fetchCircuitBreakerTotalCountFromMesh'
        ]

        // run each action
        actions.forEach(i => {
          this.$store.dispatch(i, mesh)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-state-title {

  .card-icon {
    text-align: center;

    img, svg {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }
}

.card-wrapper {

  @media only screen and (max-width: 840px) {
    .card-item {
      margin-bottom: 0.5rem;
    }
  }

  @media only screen and (min-width: 841px) {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -0.5rem 0;

    &.card-wrapper--3-col {
      --i: 25%;
    }

    &.card-wrapper--2-col {

      > *:first-of-type {
        --i: 66.66667%;
      }

      > *:last-of-type {
        --i: 33.333333%;
      }
    }

    > * {
      flex: 0 0 var(--i);
      max-width: var(--i);
    }

    .card-item {
      margin: 0 0.5rem 0.5rem 0.5rem;
    }
  }
}
</style>
