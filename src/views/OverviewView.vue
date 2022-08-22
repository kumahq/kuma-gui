<template>
  <div class="overview mt-32">
    <div :class="chartContainerClass">
      <DonutChart
        v-if="selectedMesh === 'all'"
        :class="chartClass"
        :title="{ singular: 'ZONE', plural: 'ZONES' }"
        :data="zonesChart.data"
        :url="{ name: 'zones' }"
        :is-loading="areZonesInsightsLoading"
      />
      <DonutChart
        :class="chartClass"
        :title="{ singular: 'SERVICE', plural: 'SERVICES' }"
        :data="servicesChart.data"
        :is-loading="areServicesLoading"
        save-chart
      />
      <DonutChart
        :class="chartClass"
        :title="{ singular: 'DP PROXY', plural: 'DP PROXIES' }"
        :data="dataplanesChart.data"
        :url="{ name: 'dataplanes' }"
        :is-loading="areMeshInsightsLoading"
      />
      <VersionsDonutChart
        v-if="selectedMesh === 'all'"
        :class="chartClass"
        title="ZONE CP"
        :data="zonesCPVersionsChart.data"
        :is-loading="areZonesInsightsLoading"
      />
      <VersionsDonutChart
        :class="chartClass"
        title="KUMA DP"
        :data="kumaDPVersionsChart.data"
        :is-loading="areMeshInsightsLoading"
      />
      <VersionsDonutChart
        :class="chartClass"
        title="ENVOY"
        :data="envoyVersionsChart.data"
        :is-loading="areMeshInsightsLoading"
        display-am-charts-logo
      />
    </div>

    <div class="card-wrapper">
      <div>
        <CardSkeleton
          class="card-item"
          :card-action-route="{ name: 'create-mesh' }"
          card-title="Create a virtual Mesh"
          card-action-button-text="Create Mesh"
        >
          <template #cardContent>
            <p>
              We can create multiple isolated Mesh resources (i.e. per application/<wbr>team/<wbr>business unit).
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
          <template #cardContent>
            <p>
              We need a data plane proxy for each replica of our services within a Mesh resource.
            </p>
          </template>
        </CardSkeleton>
      </div>
      <div>
        <CardSkeleton
          class="card-item"
          :card-action-route="cardActionPoliciesRoute"
          :card-title="`Apply ${title} policies`"
          card-action-button-text="Explore Policies"
        >
          <template #cardContent>
            <p>
              We can apply {{ productName }} policies to secure, observe, route and manage the Mesh and its data plane proxies.
            </p>
          </template>
        </CardSkeleton>
      </div>
      <div>
        <ResourcesList class="card-item" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import CardSkeleton from '@/components/Skeletons/CardSkeleton.vue'
import ResourcesList from '@/components/ResourcesList.vue'
import DonutChart from '@/components/DonutChart.vue'
import VersionsDonutChart from '@/components/VersionsDonutChart.vue'
import { PRODUCT_NAME } from '@/consts'

export default {
  name: 'OverviewView',
  metaInfo() {
    return {
      title: this.$route.meta.title,
    }
  },
  components: {
    DonutChart,
    VersionsDonutChart,
    CardSkeleton,
    ResourcesList,
  },
  data() {
    return {
      productName: PRODUCT_NAME,
    }
  },
  computed: {
    ...mapState({
      selectedMesh: (state) => state.selectedMesh,
    }),
    ...mapGetters({
      title: 'config/getTagline',
      environment: 'config/getEnvironment',
      multicluster: 'config/getMulticlusterStatus',
      areMeshInsightsLoading: 'getMeshInsightsFetching',
      areZonesInsightsLoading: 'getZonesInsightsFetching',
      areServicesLoading: 'getServiceResourcesFetching',
      getChart: 'getChart',
    }),
    cardActionPoliciesRoute() {
      return `https://kuma.io/policies/${process.env.VUE_APP_UTM}`
    },
    dataplanesChart() {
      return this.getChart('dataplanes')
    },
    servicesChart() {
      return this.getChart('services')
    },
    zonesChart() {
      return this.getChart('zones')
    },
    zonesCPVersionsChart() {
      return this.getChart('zonesCPVersions')
    },
    kumaDPVersionsChart() {
      return this.getChart('kumaDPVersions')
    },
    envoyVersionsChart() {
      return this.getChart('envoyVersions')
    },
    pageTitle() {
      const metaTitle = this.$route.meta.title
      const mesh = this.selectedMesh

      return mesh === 'all' ? `${metaTitle} for all Meshes` : `${metaTitle} for ${mesh}`
    },
    zonesForChart() {
      return this.multicluster ? this.$store.state.totalClusters : 1
    },
    dataplaneWizardRoute() {
      // we change the route to the Dataplane
      // wizard based on environment.
      const name = this.environment === 'universal' ? 'universal-dataplane' : 'kubernetes-dataplane'

      return { name }
    },
    chartClass() {
      const isAll = this.selectedMesh === 'all'

      return [
        'flex',
        'flex-1',
        'md:flex-1/2',
        isAll && 'xl:flex-1/3',
        !isAll && 'xl:flex-1',
        'md:w-1/2',
        isAll && 'xl:w-1/3',
        !isAll && 'xl:w-auto',
      ]
        .filter((item) => item)
        .join(' ')
    },
    chartContainerClass() {
      const isAll = this.selectedMesh === 'all'

      return [
        'flex',
        'flex-col',
        'md:flex-row',
        'md:flex-wrap',
        isAll && 'md:h-540p',
        !isAll && 'md:h-400p',
        isAll && 'xl:h-400p',
        !isAll && 'xl:h-200p',
        'my-2',
        'py-2',
      ]
        .filter((item) => item)
        .join(' ')
    },
  },
  watch: {
    selectedMesh() {
      this.init()
    },
  },
  beforeMount() {
    this.init()
  },
  methods: {
    ...mapActions(['fetchMeshInsights', 'fetchTotalClusterCount', 'fetchZonesInsights', 'fetchServices']),
    init() {
      this.fetchMeshInsights(this.selectedMesh)
      this.fetchServices(this.selectedMesh)
      this.fetchZonesInsights(this.multicluster)

      if (this.multicluster) {
        this.fetchTotalClusterCount()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.empty-state-title {
  .card-icon {
    text-align: center;

    img,
    svg {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }
}

.card-wrapper {
  display: grid;

  gap: 8px;
  margin-top: 4rem;

  .card-item {
    height: 100%;
  }

  @media only screen and (min-width: 841px) {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 1fr;
  }

  @media only screen and (min-width: 1270px) {
    margin-top: 8rem;
    grid-template-columns: repeat(4, 1fr);
  }
}

// v-deep is a deep selector which is equivalent of ">>>" as sass loader is not
//  able to properly parse ">>>"
// ref:
//  https://vue-loader.vuejs.org/guide/scoped-css.html#deep-selectors
:deep(.pie-chart-label) {
  @apply tracking-widest uppercase;
}
</style>
