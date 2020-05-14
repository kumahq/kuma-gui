<template>
  <div class="overview">
    <page-header noflex>
      <breadcrumbs />
      <h2 class="xxl">
        {{ this.$route.meta.title }}
      </h2>
    </page-header>

    <!-- metrics boxes -->
    <MetricGrid
      :metrics="overviewMetrics"
    />

    <div class="card-wrapper">
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
          :card-action-route="{ path: `/${selectedMesh}/fault-injections` }"
          :card-title="`Apply ${title} Policies`"
          card-action-button-text="Explore Policies"
        >
          <template slot="cardContent">
            <p>
              Once we have created your Mesh and started the data planes, we can now
              use {{ title }} Policies to manage the Mesh.
            </p>
          </template>
        </CardSkeleton>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PageHeader from '@/components/Utils/PageHeader.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import MetricGrid from '@/components/Metrics/MetricGrid.vue'
import CardSkeleton from '@/components/Skeletons/CardSkeleton'

export default {
  name: 'Overview',
  metaInfo () {
    return {
      title: this.$route.meta.title
    }
  },
  components: {
    PageHeader,
    Breadcrumbs,
    MetricGrid,
    CardSkeleton
  },
  computed: {
    ...mapGetters({
      title: 'getTagline',
      environment: 'getEnvironment',
      selectedMesh: 'getSelectedMesh'
    }),
    overviewMetrics () {
      return [
        {
          metric: 'Meshes',
          value: this.$store.state.totalMeshCount,
          url: `/meshes/${this.selectedMesh}`
        },
        {
          metric: 'Dataplanes',
          value: this.$store.state.totalDataplaneCount,
          url: `/${this.selectedMesh}/dataplanes`
        },
        {
          metric: 'Fault Injections',
          value: this.$store.state.totalFaultInjectionCount,
          url: `/${this.selectedMesh}/fault-injections`
        },
        {
          metric: 'Health Checks',
          value: this.$store.state.totalHealthCheckCount,
          url: `/${this.selectedMesh}/health-checks`
        },
        {
          metric: 'Proxy Templates',
          value: this.$store.state.totalProxyTemplateCount,
          url: `/${this.selectedMesh}/proxy-templates`
        },
        {
          metric: 'Traffic Logs',
          value: this.$store.state.totalTrafficLogCount,
          url: `/${this.selectedMesh}/traffic-logs`
        },
        {
          metric: 'Traffic Permissions',
          value: this.$store.state.totalTrafficPermissionCount,
          url: `/${this.selectedMesh}/traffic-permissions`
        },
        {
          metric: 'Traffic Routes',
          value: this.$store.state.totalTrafficRouteCount,
          url: `/${this.selectedMesh}/traffic-routes`
        },
        {
          metric: 'Traffic Traces',
          value: this.$store.state.totalTrafficTraceCount,
          url: `/${this.selectedMesh}/traffic-traces`
        }
      ]
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
    '$route' (to, from) {
      this.init()
    }
  },
  beforeMount () {
    this.init()
  },
  methods: {
    init () {
      this.getCounts()
    },
    getCounts () {
      const actions = [
        'getMeshTotalCount',
        'getDataplaneTotalCount',
        'getHealthCheckTotalCount',
        'getProxyTemplateTotalCount',
        'getTrafficLogTotalCount',
        'getTrafficPermissionTotalCount',
        'getTrafficRouteTotalCount',
        'getTrafficTraceTotalCount',
        'getFaultInjectionTotalCount'
      ]

      actions.forEach(i => {
        this.$store.dispatch(i)
      })
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

    > * {
      --i: 33.333333%;

      flex: 0 0 var(--i);
      max-width: var(--i);
    }

    .card-item {
      margin: 0 0.5rem 0.5rem 0.5rem;
    }
  }
}
</style>
