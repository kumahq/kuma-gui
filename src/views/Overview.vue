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

    <div class="md:flex -mx-4">
      <CardSkeleton
        class="md:flex-2 mx-4"
        :card-action-route="{ path: '/wizard/mesh' }"
        card-title="Create A Mesh"
        card-action-button-text="Start Now"
      >
        <template slot="cardContent">
          <p class="lg">
            You can create a new isolated Mesh for a team, a product, or a line of business.
          </p>
        </template>
      </CardSkeleton>
      <!-- <CardSkeleton
        class="md:flex-1 mx-4"
        :card-action-route="{ path: '/default/dataplanes/' }"
        card-title="Add A Service / Dataplane"
        card-action-button-text="Start Now"
      >
        <template slot="cardContent">
          <p class="lg">
            You can add a new service into a Mesh by adding Dataplanes to it.
          </p>
        </template>
      </CardSkeleton> -->
      <!-- <CardSkeleton
        class="md:flex-1 mx-4"
        :card-action-route="{ path: '/default/dataplanes/' }"
        card-title="Some Title"
        card-action-button-text="Start Now"
      >
        <template slot="cardContent">
          <p class="lg">
            Find Services among your {{ title }} Meshes
          </p>
        </template>
      </CardSkeleton> -->
    </div>

    <FrameSkeleton>
      <DataOverview
        :has-error="hasError"
        :is-loading="isLoading"
        :is-empty="isEmpty"
        :empty-state="empty_state"
        :display-data-table="true"
        :table-data="tableData"
        :table-data-is-empty="tableDataIsEmpty"
        @reloadData="bootstrap"
      />
    </FrameSkeleton>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import PageHeader from '@/components/Utils/PageHeader.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import MetricGrid from '@/components/Metrics/MetricGrid.vue'
import DataOverview from '@/components/Skeletons/DataOverview.vue'
import CardSkeleton from '@/components/Skeletons/CardSkeleton'

export default {
  name: 'Overview',
  metaInfo () {
    return {
      title: this.$route.meta.title
    }
  },
  components: {
    FrameSkeleton,
    PageHeader,
    Breadcrumbs,
    MetricGrid,
    DataOverview,
    CardSkeleton
  },
  data () {
    return {
      isLoading: true,
      isEmpty: false,
      hasError: false,
      tableDataIsEmpty: false,
      empty_state: {
        title: 'No Data',
        message: 'There are no Meshes present.'
      },
      tableData: {
        headers: [
          { label: 'Mesh', key: 'name' },
          { label: 'Online Dataplanes', key: 'onlineDpCount' }
        ],
        data: []
      }
    }
  },
  computed: {
    ...mapGetters({
      title: 'getTagline',
      dpList: 'getDataplanesList'
    }),
    overviewMetrics () {
      return [
        {
          metric: 'Meshes',
          value: this.$store.state.totalMeshCount
        },
        {
          metric: 'Dataplanes',
          value: this.$store.state.totalDataplaneCount
        },
        {
          metric: 'Health Checks',
          value: this.$store.state.totalHealthCheckCount
        },
        {
          metric: 'Proxy Templates',
          value: this.$store.state.totalProxyTemplateCount
        },
        {
          metric: 'Traffic Logs',
          value: this.$store.state.totalTrafficLogCount
        },
        {
          metric: 'Traffic Permissions',
          value: this.$store.state.totalTrafficPermissionCount
        },
        {
          metric: 'Traffic Routes',
          value: this.$store.state.totalTrafficRouteCount
        },
        {
          metric: 'Traffic Traces',
          value: this.$store.state.totalTrafficTraceCount
        },
        {
          metric: 'Fault Injections',
          value: this.$store.state.totalTrafficTraceCount
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
    bootstrap () {
      this.isLoading = true
      this.isEmpty = false

      //
      // overall totals for all entities and policies
      //

      // total Mesh count
      this.$store.dispatch('getMeshTotalCount')

      // get (or refresh) the full dataplane list
      // this.$store.dispatch('getAllDataplanes')

      // total Dataplane count
      this.$store.dispatch('getDataplaneTotalCount')

      // total Health Check count
      this.$store.dispatch('getHealthCheckTotalCount')

      // total Proxy Template count
      this.$store.dispatch('getProxyTemplateTotalCount')

      // total Traffic Log count
      this.$store.dispatch('getTrafficLogTotalCount')

      // total Traffic Permission count
      this.$store.dispatch('getTrafficPermissionTotalCount')

      // total Traffic Route count
      this.$store.dispatch('getTrafficRouteTotalCount')

      // total Traffic Trace count
      this.$store.dispatch('getTrafficTraceTotalCount')

      // total Fault Injection count
      this.$store.dispatch('getFaultInjectionTotalCount')

      // prepare and populate the table data
      const getMeshData = () => {
        this.$store.dispatch('getAllDataplanes')
        const dpList = this.dpList

        return this.$api.getAllMeshes()
          .then(response => {
            const items = response.items
            const itemStatus = []

            for (let i = 0; i < items.length; i++) {
              const mesh = items[i].name

              const dpStatus = () => {
                const totalDpInMesh = dpList.filter(x => x.mesh === mesh).length
                const onlineDpCount = dpList.filter(x => x.status === 'Online' && x.mesh === mesh).length

                if (totalDpInMesh === 0) {
                  return 'No Dataplanes'
                }

                return `${onlineDpCount} of ${totalDpInMesh}`
              }

              itemStatus.push({
                name: mesh,
                onlineDpCount: dpStatus()
              })
            }

            if (items && items.length) {
              this.tableData.data = [...itemStatus]
              this.tableDataIsEmpty = false
            } else {
              this.tableData.data = []
              this.tableDataIsEmpty = true
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
      }

      getMeshData()
    }
  }
}
</script>

<style lang="scss">
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
</style>
