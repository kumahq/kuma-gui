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
          :card-action-route="{ path: '/wizard/mesh' }"
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
          :card-action-route="{ path: `fault-injections` }"
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
import { getOffset } from '@/helpers'
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
      dpList: 'getDataplanesList',
      environment: 'getEnvironment'
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
          value: this.$store.state.totalFaultInjectionCount
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
      this.loadData()
    },
    goToPreviousPage () {
      this.pageOffset = this.previous.pop()
      this.next = null

      this.loadData()
    },
    goToNextPage () {
      this.previous.push(this.pageOffset)
      this.pageOffset = this.next
      this.next = null

      this.loadData()
    },
    getCounts () {
      // total Mesh count
      this.$store.dispatch('getMeshTotalCount')

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
    },
    loadData () {
      this.isLoading = true
      this.isEmpty = false

      // prepare and populate the table data
      const getMeshData = () => {
        this.$store.dispatch('getAllDataplanes')
        const dpList = this.dpList

        const params = {
          size: this.pageSize,
          offset: this.pageOffset
        }

        return this.$api.getAllMeshes(params)
          .then(response => {
            const items = response.items
            const itemStatus = []

            // check to see if the `next` url is present
            if (response.next) {
              this.next = getOffset(response.next)
              this.hasNext = true
            } else {
              this.hasNext = false
            }

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
