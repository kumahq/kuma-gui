<template>
  <div class="dataplanes">
    <DataOverview
      :empty-state="empty_state"
      :display-data-table="true"
      :table-data="tableData"
      :table-data-is-empty="tableDataIsEmpty"
      table-actions-route-name="dataplane-details"
      @reloadData="bootstrap"
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
                  const placeholder = 'n/a'

                  let lastConnected = placeholder
                  let lastUpdated = placeholder
                  let tags
                  let totalUpdates = []
                  let status = 'Offline'
                  const connectTimes = []
                  const updateTimes = []

                  /**
                   * Iterate through the networking inbound data
                   */
                  if (response.dataplane.networking.inbound && response.dataplane.networking.inbound.length) {
                    for (let i = 0; i < response.dataplane.networking.inbound.length; i++) {
                      const items = response.dataplane.networking.inbound[i].tags

                      tags = JSON.stringify(items)
                        .replace(/[{}]/g, '')
                        .replace(/"/g, '')
                        .replace(/,/g, ', ')
                        .replace(/:/g, ': ')
                    }
                  }

                  /**
                   * Iterate through the subscriptions
                   */
                  if (response.dataplaneInsight.subscriptions && response.dataplaneInsight.subscriptions.length) {
                    response.dataplaneInsight.subscriptions.forEach(item => {
                      const responsesSent = item.status.total.responsesSent || placeholder
                      const connectTime = item.connectTime || placeholder
                      const lastUpdateTime = item.status.lastUpdateTime || placeholder
                      const disconnectTime = item.disconnectTime || null

                      totalUpdates.push(responsesSent)
                      connectTimes.push(connectTime)
                      updateTimes.push(lastUpdateTime)

                      if (connectTime && connectTime.length && !disconnectTime) {
                        status = 'Online'
                      } else {
                        status = 'Offline'
                      }
                    })

                    // get the sum of total updates (if there is a numerical value set)
                    if (totalUpdates !== placeholder) {
                      totalUpdates = totalUpdates.reduce((a, b) => a + b)
                    }

                    // select the most recent LAST CONNECTED timestamp
                    const selectedTime = connectTimes.reduce((a, b) => {
                      if (a && b) {
                        return a.MeasureDate > b.MeasureDate ? a : b
                      }

                      return null
                    })

                    // select the most recent LAST UPDATED timestamnp
                    const selectedUpdateTime = updateTimes.reduce((a, b) => {
                      if (a && b) {
                        return a.MeasureDate > b.MeasureDate ? a : b
                      }

                      return null
                    })

                    // format each reduced value as a date to compare against
                    const selectedTimeAsDate = new Date(selectedTime)
                    const selectedUpdateTimeAsDate = new Date(selectedUpdateTime)

                    /**
                     * @todo refactor this to use a function instead
                     */

                    // formatted time for LAST CONNECTED (if there is a value present)
                    if (selectedTime && !isNaN(selectedTimeAsDate)) {
                      lastConnected = `${Math.abs(now.getHours() - selectedTimeAsDate.getHours())}h ${Math.abs(now.getMinutes() - selectedTimeAsDate.getMinutes())}m ${Math.abs(now.getSeconds() - selectedTimeAsDate.getSeconds())}s`
                    }

                    // formatted time for LAST UPDATED (if there is a value present)
                    if (selectedUpdateTime && !isNaN(selectedUpdateTimeAsDate)) {
                      lastUpdated = `${Math.abs(now.getHours() - selectedUpdateTimeAsDate.getHours())}h ${Math.abs(now.getMinutes() - selectedUpdateTimeAsDate.getMinutes())}m ${Math.abs(now.getSeconds() - selectedUpdateTimeAsDate.getSeconds())}s`
                    }
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
