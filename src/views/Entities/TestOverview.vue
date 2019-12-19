<template>
  <div class="test-overview">
    <DataOverview
      :display-metrics="true"
      :metrics-data="tableData"
      :cta-action="ctaAction"
      :empty-state="empty_state"
      :display-data-table="true"
      :table-data="tableRowData"
      :table-data-is-empty="tableDataIsEmpty"
      table-actions-route-name="mesh-overview"
    >
      <template slot="tableDataActionsLinkText">
        View
      </template>
      <template slot="content">
        <h2 class="title-2x">
          Optional Extra Content Here
        </h2>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
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
      tableDataIsEmpty: false,
      empty_state: {
        title: 'No Data',
        message: 'There are no items present.',
        ctaText: 'Hello World'
      },
      tableRowData: {
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

      // get the total number of dataplanes from selected mesh
      this.$store.dispatch('getDataplaneFromMeshTotalCount', this.$route.params.mesh)

      // get the total number of traffic routes from selected mesh
      this.$store.dispatch('getTrafficRoutesFromMeshTotalCount', this.$route.params.mesh)

      // get the total number of traffic permissions from selected mesh
      this.$store.dispatch('getTrafficPermissionsFromMeshTotalCount', this.$route.params.mesh)

      // get the total number of traffic logs from selected mesh
      this.$store.dispatch('getTrafficLogsFromMeshTotalCount', this.$route.params.mesh)

      // get the mesh from our route params
      const mesh = 'default'

      // prepare and populate the table data
      const getMeshData = () => {
        return this.$api.getAllDataplanesFromMesh(mesh)
          .then(response => {
            const items = response.items

            if (items && items.length) {
              this.tableRowData.data = [...items]
              this.tableDataIsEmpty = false
            } else {
              this.tableRowData.data = []
              this.tableDataIsEmpty = true
            }
          })
          .catch(error => {
            this.tableDataIsEmpty = true
            this.isEmpty = true

            console.error(error)
          })
      }

      getMeshData()
    }
  }
}
</script>
