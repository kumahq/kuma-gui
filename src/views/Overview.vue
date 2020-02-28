<template>
  <div class="overview">
    <page-header noflex>
      <h2 class="xxl">
        {{ this.$route.meta.title }}
      </h2>
    </page-header>

    <!-- metrics boxes -->
    <MetricGrid
      :metrics="overviewMetrics"
    />

    <DataOverview
      :has-error="hasError"
      :is-loading="isLoading"
      :is-empty="isEmpty"
      :empty-state="empty_state"
      :display-data-table="true"
      :table-data="tableData"
      :table-data-is-empty="tableDataIsEmpty"
      table-actions-route-name="mesh"
      @reloadData="bootstrap"
    >
      <template slot="tableDataActionsLinkText">
        View
      </template>
    </DataOverview>
  </div>
</template>

<script>
import PageHeader from '@/components/Utils/PageHeader.vue'
import MetricGrid from '@/components/Metrics/MetricGrid.vue'
import DataOverview from '@/components/Skeletons/DataOverview.vue'

export default {
  name: 'Overview',
  metaInfo () {
    return {
      title: this.$route.meta.title
    }
  },
  components: {
    MetricGrid,
    PageHeader,
    DataOverview
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
          { label: 'Name', key: 'name' },
          { label: 'Type', key: 'type' },
          { key: 'actions', hideLabel: true }
        ],
        data: []
      }
    }
  },
  computed: {
    overviewMetrics () {
      return [
        {
          metric: 'Total Number of Meshes',
          value: this.$store.state.totalMeshCount
        },
        {
          metric: 'Total Number of Dataplanes',
          value: this.$store.state.totalDataplaneCount
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

      // get the total mesh count
      this.$store.dispatch('getMeshTotalCount')

      // get the total dataplane count within this mesh
      this.$store.dispatch('getDataplaneFromMeshTotalCount', this.$route.params.mesh)

      // get the total dataplane count
      this.$store.dispatch('getDataplaneTotalCount')

      // prepare and populate the table data
      const getMeshData = () => {
        return this.$api.getAllMeshes()
          .then(response => {
            const items = response.items

            if (items && items.length) {
              this.tableData.data = [...items]
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
