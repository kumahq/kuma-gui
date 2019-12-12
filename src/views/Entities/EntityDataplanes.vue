<template>
  <div class="dataplanes">
    <DataOverview
      :empty-state="empty_state"
      :display-data-table="true"
      :table-data="tableData"
      :table-data-is-empty="tableDataIsEmpty"
    >
      <!-- <template slot="tableDataActionsLinkText">
        View Entity
      </template> -->
    </DataOverview>
  </div>
</template>

<script>
import moment from 'moment'
import DataOverview from '@/components/Skeletons/DataOverview'

export default {
  name: 'Dataplanes',
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
        message: 'There are no items present.'
      },
      tableData: {
        headers: [
          { label: 'Name', key: 'name' },
          { label: 'Mesh', key: 'mesh' },
          { label: 'Tags', key: 'tags' },
          { label: 'Last Connected', key: 'lastConnected' },
          { label: 'Last Updated', key: 'lastUpdated' },
          { label: 'Total Updates', key: 'totalUpdates' }
          // { key: 'actions', hideLabel: true }
        ],
        data: []
      }
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

      // get the mesh from our route params
      const mesh = this.$route.params.mesh

      // prepare and populate the table data
      const getMeshData = () => {
        return this.$api.getAllDataplanesFromMesh(mesh)
          .then(response => {
            const items = response.items
            const final = []

            items.forEach(item => {
              this.$api.getDataplaneOverviews(mesh, item.name)
                .then(response => {
                  const now = moment(new Date())

                  let lastConnected
                  let lastUpdated
                  let totalUpdates

                  if (response.dataplaneInsight.subscriptions) {
                    lastConnected = `${now.diff(moment(response.dataplaneInsight.subscriptions[0].connectTime), 'minutes')}m`
                    lastUpdated = `${now.diff(moment(response.dataplaneInsight.subscriptions[0].status.lastUpdateTime), 'minutes')}m`
                    totalUpdates = response.dataplaneInsight.subscriptions[0].status.total.responsesSent
                  } else {
                    lastConnected = lastUpdated = totalUpdates = 'n/a'
                  }

                  final.push({
                    name: response.name,
                    mesh: response.mesh,
                    tags: response.dataplane.networking.inbound[0].tags,
                    lastConnected: lastConnected,
                    lastUpdated: lastUpdated,
                    totalUpdates: totalUpdates
                  })
                })
                .catch(error => {
                  console.error(error)
                })
            })

            if (items && items.length) {
              this.tableData.data = final
              this.tableDataIsEmpty = false
            } else {
              this.tableData.data = []
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
