<template>
  <div class="overview">
    <div class="flex flex-col lg:flex-row">
      <OverviewCharts
        :zones="zonesForChart"
        :dataplanes="meshInsight.dataplanes"
        :services="servicesForChart(selectedMesh)"
        :selected-mesh="selectedMesh"
        class="my-5"
      />
    </div>
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
              We need a data plane proxy for each replica of our services within a Mesh resource.
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
import OverviewCharts from '@/components/OverviewCharts'

export default {
  name: 'Overview',
  metaInfo () {
    return {
      title: this.$route.meta.title
    }
  },
  components: {
    OverviewCharts,
    MetricGrid,
    CardSkeleton,
    Resources
  },
  computed: {
    ...mapGetters({
      title: 'getTagline',
      environment: 'getEnvironment',
      selectedMesh: 'getSelectedMesh',
      multicluster: 'getMulticlusterStatus',
      servicesForChart: 'getServicesForChart',
      meshInsight: 'getMeshInsight',
      meshInsightsFetching: 'getMeshInsightsFetching',
    }),
    pageTitle () {
      const metaTitle = this.$route.meta.title
      const mesh = this.selectedMesh

      return mesh === 'all'
        ? `${metaTitle} for all Meshes`
        : `${metaTitle} for ${mesh}`
    },
    zonesForChart () {
      return this.multicluster
        ? this.$store.state.totalClusters
        : 1
    },
    overviewMetrics () {
      const mesh = this.selectedMesh
      const { policies, meshesTotal } = this.meshInsight

      const tableData = [
        {
          metric: 'Meshes',
          value: meshesTotal,
          url: `/meshes/${mesh}`,
        },
        {
          metric: 'Circuit Breakers',
          value: policies.CircuitBreaker.total,
          url: `/${mesh}/circuit-breakers`,
        },
        {
          metric: 'Fault Injections',
          value: policies.FaultInjection.total,
          url: `/${mesh}/fault-injections`,
        },
        {
          metric: 'Health Checks',
          value: policies.HealthCheck.total,
          url: `/${mesh}/health-checks`,
        },
        {
          metric: 'Proxy Templates',
          value: policies.ProxyTemplate.total,
          url: `/${mesh}/proxy-templates`,
        },
        {
          metric: 'Traffic Logs',
          value: policies.TrafficLog.total,
          url: `/${mesh}/traffic-logs`,
        },
        {
          metric: 'Traffic Permissions',
          value: policies.TrafficPermission.total,
          url: `/${mesh}/traffic-permissions`,
        },
        {
          metric: 'Traffic Routes',
          value: policies.TrafficRoute.total,
          url: `/${mesh}/traffic-routes`,
        },
        {
          metric: 'Traffic Traces',
          value: policies.TrafficTrace.total,
          url: `/${mesh}/traffic-traces`,
        },
        {
          metric: 'Retries',
          value: policies.Retry.total,
          url: `/${mesh}/retries`,
        },
      ]

      if (mesh !== 'all') {
        // if the user is viewing the overview with a mesh selected,
        // we hide these items from the metrics grid.
        return tableData.filter(({ metric }) => metric !== 'Meshes')
      }

      return tableData
    },
    dataplaneWizardRoute () {
      // we change the route to the Dataplane
      // wizard based on environment.
      const name = this.environment === 'universal'
        ? 'universal-dataplane'
        : 'kubernetes-dataplane'

      return { name }
    },
  },
  watch: {
    selectedMesh () {
      this.init()
    },
  },
  beforeMount () {
    this.init()
  },
  methods: {
    init () {
      this.$store.dispatch('fetchAllServices')
      this.$store.dispatch('fetchMeshInsights', this.selectedMesh)

      if (this.multicluster) {
        this.$store.dispatch('fetchTotalClusterCount')
      }
    },
  },
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
