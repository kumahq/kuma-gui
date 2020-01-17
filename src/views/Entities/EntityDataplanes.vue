<template>
  <div class="dataplanes">
    <DataOverview
      :has-error="hasError"
      :is-loading="isLoading"
      :is-empty="isEmpty"
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
import { humanReadableDate, dpTagCleaner } from '@/helpers'
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
        message: 'There are no Dataplanes present.'
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
            if (response.items.length > 0) {
              const items = response.items
              const final = []

              items.forEach(item => {
                this.$api.getDataplaneOverviews(mesh, item.name)
                  .then(response => {
                    const placeholder = 'n/a'

                    let lastConnected
                    let lastUpdated
                    let tags = placeholder
                    let totalUpdates = []
                    let status = 'Offline'
                    const connectTimes = []
                    const updateTimes = []

                    /**
                     * Iterate through the networking inbound or gateway data
                     */
                    const inbound = response.dataplane.networking.inbound
                    const gateway = response.dataplane.networking.gateway

                    if (inbound || gateway) {
                      /** inbound */
                      if (inbound) {
                        for (let i = 0; i < inbound.length; i++) {
                          tags = dpTagCleaner(inbound[i].tags)
                        }
                      }
                      /** gateway */
                      else if (gateway) {
                        tags = dpTagCleaner(gateway.tags)
                      }
                    }

                    /**
                     * Iterate through the subscriptions
                     */
                    if (response.dataplaneInsight.subscriptions && response.dataplaneInsight.subscriptions.length) {
                      response.dataplaneInsight.subscriptions.forEach(item => {
                        const responsesSent = item.status.total.responsesSent || 0
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

                      // get the sum of total updates (with some precautions)
                      totalUpdates = totalUpdates.reduce((a, b) => a + b)

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
                        lastConnected = humanReadableDate(selectedTimeAsDate)
                      } else {
                        lastConnected = 'never'
                      }

                      // formatted time for LAST UPDATED (if there is a value present)
                      if (selectedUpdateTime && !isNaN(selectedUpdateTimeAsDate)) {
                        lastUpdated = humanReadableDate(selectedUpdateTimeAsDate)
                      } else {
                        lastUpdated = 'never'
                      }
                    } else {
                    // if there are no subscriptions, set them all to a fallback
                      lastConnected = 'never'
                      lastUpdated = 'never'
                      totalUpdates = 0
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

                    // sort the table data by name and the mesh it's associated with
                    final
                      .sort((a, b) => (a.name > b.name) ? 1 : (a.name === b.name) ? ((a.mesh > b.mesh) ? 1 : -1) : -1)
                  })
                  .catch(error => {
                    console.error(error)
                  })
              })

              this.tableData.data = final
              this.tableDataIsEmpty = false
            } else {
              this.isEmpty = true
            }
          })
          .catch(error => {
            this.hasError = true

            console.error(error)
          })
          .finally(() => {
            this.isLoading = false
          })
      }

      getMeshData()
    }
  }
}
</script>
