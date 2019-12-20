<template>
  <div class="dataplanes">
    <DataOverview
      :empty-state="empty_state"
      :display-data-table="true"
      :table-data="tableData"
      :table-data-is-empty="tableDataIsEmpty"
      table-actions-route-name="dataplane-details"
    >
      <template slot="tableDataActionsLinkText">
        View
      </template>
    </DataOverview>
  </div>
</template>

<script>
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
          { label: 'Status', key: 'status' },
          { label: 'Name', key: 'name' },
          { label: 'Mesh', key: 'mesh' },
          { label: 'Tags', key: 'tags' },
          { label: 'Last Connected', key: 'lastConnected' },
          { label: 'Last Updated', key: 'lastUpdated' },
          { label: 'Total Updates', key: 'totalUpdates' },
          { key: 'actions', hideLabel: true }
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
                  const now = new Date()

                  let lastConnected
                  let lastUpdated
                  let tags
                  let totalUpdates = []
                  let status = 'Offline'
                  const connectTimes = []
                  const updateTimes = []

                  if (response.dataplane.networking.inbound && response.dataplane.networking.inbound.length) {
                    // iterate through the networking inbound data
                    for (let i = 0; i < response.dataplane.networking.inbound.length; i++) {
                      const items = response.dataplane.networking.inbound[i].tags

                      tags = JSON.stringify(items)
                        .replace(/[{}]/g, '')
                        .replace(/"/g, '')
                        .replace(/,/g, ', ')
                        // .replace(/:/g, ': ')
                    }
                  }

                  if (response.dataplaneInsight.subscriptions && response.dataplaneInsight.subscriptions.length) {
                    // iterate through the subscriptions
                    response.dataplaneInsight.subscriptions.forEach(item => {
                      totalUpdates.push(item.status.total.responsesSent)
                      connectTimes.push(item.connectTime)
                      updateTimes.push(item.status.lastUpdateTime)

                      if (item.connectTime && item.connectTime.length && !item.disconnectTime) {
                        status = 'Online'
                      } else {
                        status = 'Offline'
                      }
                    })

                    // get the sum of total updates
                    totalUpdates = totalUpdates.reduce((a, b) => a + b)

                    // select the most recent LAST CONNECTED timestamp
                    const selectedTime = new Date(connectTimes.reduce((a, b) => (a.MeasureDate > b.MeasureDate ? a : b)))

                    // select the most recent LAST UPDATED timestamnp
                    const selectedUpdateTime = new Date(updateTimes.reduce((a, b) => (a.MeasureDate > b.MeasureDate ? a : b)))

                    /**
                     * @todo refactor this to use a function instead
                     */

                    // formatted time for LAST CONNECTED
                    lastConnected = `${Math.abs(now.getHours() - selectedTime.getHours())}h ${Math.abs(now.getMinutes() - selectedTime.getMinutes())}m ${Math.abs(now.getSeconds() - selectedTime.getSeconds())}s`

                    // formatted time for LAST UPDATED
                    lastUpdated = `${Math.abs(now.getHours() - selectedUpdateTime.getHours())}h ${Math.abs(now.getMinutes() - selectedUpdateTime.getMinutes())}m ${Math.abs(now.getSeconds() - selectedUpdateTime.getSeconds())}s`
                  } else {
                    // if there are no subscriptions, set them all to a fallback
                    lastConnected = lastUpdated = totalUpdates = 'n/a'
                  }

                  // assemble the table data
                  final.push({
                    name: response.name,
                    mesh: response.mesh,
                    tags: tags,
                    status: status,
                    lastConnected: lastConnected,
                    lastUpdated: lastUpdated,
                    totalUpdates: totalUpdates,
                    type: 'dataplane'
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
