<template>
  <div class="overview">
    <!-- metrics boxes -->
    <MetricGrid
      :metrics="overviewMetrics"
    />

    <div class="card-wrapper card-wrapper--4-col">
      <div>
        <CardSkeleton
          class="card-item"
          :card-action-route="{ name: 'create-mesh' }"
          card-title="Create a virtual Mesh"
          card-action-button-text="Create Mesh"
        >
          <template slot="cardContent">
            <p>
              We can create multiple isolated Mesh resources (i.e. per application/team/business unit).
            </p>
          </template>
        </CardSkeleton>
      </div>
      <div>
        <CardSkeleton
          class="card-item"
          :card-action-route="dataplaneWizardRoute"
          card-title="Connect data plane proxies"
          card-action-button-text="Get Started"
        >
          <template slot="cardContent">
            <p>
              We need a data plane proxy for each replicata of our services within a Mesh resource.
            </p>
          </template>
        </CardSkeleton>
      </div>
      <div>
        <CardSkeleton
          class="card-item"
          card-action-route="https://kuma.io/policies/"
          :card-title="`Apply ${title} policies`"
          card-action-button-text="Explore Policies"
        >
          <template slot="cardContent">
            <p>
              We can apply {{ $productName }} policies to secure, observe, route and manage the Mesh and its data plane proxies.
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
          internalServiceCount: state.totalInternalServiceCount,
          externalServiceCount: state.totalExternalServiceCount,
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
          internalServiceCount: state.totalInternalServiceCountFromMesh,
          externalServiceCount: state.totalExternalServiceCountFromMesh,
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
          metric: 'Internal Services',
          value: storeVals.internalServiceCount,
          url: `/${this.selectedMesh}/internal-services`
        },
        {
          metric: 'External Services',
          value: storeVals.externalServiceCount,
          url: `/${this.selectedMesh}/external-services`
        },
        {
          metric: 'Data Plane Proxies',
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
        // we hide these items from the metrics grid.
        return tableData.filter((value, index, arr) => {
          const metric = value.metric

          return metric !== 'Meshes' && metric !== 'Zones'
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
          'fetchInternalServiceTotalCount',
          'fetchExternalServiceTotalCount',
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
          'fetchInternalServiceTotalCountFromMesh',
          'fetchExternalServiceTotalCountFromMesh',
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

    &.card-wrapper--4-col {
      --i: 50%;
    }

    &.card-wrapper--2-col {
      --i: 50%;
    }

    > * {
      flex: 0 0 var(--i);
      max-width: var(--i);
    }

    .card-item {
      --i: 16px;
      --x: calc(var(--i) / 2);
      margin: 0 var(--x) var(--i) var(--x);
    }
  }

  @media only screen and (min-width: 1270px) {
    &.card-wrapper--4-col {
      --i: 25%;
    }
  }
}
</style>
