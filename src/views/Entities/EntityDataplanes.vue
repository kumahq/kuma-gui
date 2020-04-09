<template>
  <div class="dataplanes">
    <FrameSkeleton>
      <DataOverview
        :page-size="6"
        :has-error="hasError"
        :is-loading="isLoading"
        :is-empty="isEmpty"
        :empty-state="empty_state"
        :display-data-table="true"
        :table-data="tableData"
        :table-data-is-empty="tableDataIsEmpty"
        table-data-function-text="View"
        table-data-row="name"
        @tableAction="tableAction"
        @reloadData="bootstrap"
      />
      <Tabs
        :has-error="hasError"
        :is-loading="isLoading"
        :is-empty="isEmpty"
        :tabs="tabs"
        :tab-group-title="tabGroupTitle"
initial-tab-override="overview"
      >
        <template slot="overview">
          <LabelList
            :has-error="entityHasError"
            :is-loading="entityIsLoading"
            :is-empty="entityIsEmpty"
            :items="entity"
          />
        </template>
        <template slot="yaml">
          <YamlView
            :title="entityOverviewTitle"
            :has-error="entityHasError"
            :is-loading="entityIsLoading"
            :is-empty="entityIsEmpty"
            :content="rawEntity"
          />
        </template>
      </Tabs>
    </FrameSkeleton>
  </div>
</template>

<script>
import { getSome, humanReadableDate } from '@/helpers'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import DataOverview from '@/components/Skeletons/DataOverview'
import Tabs from '@/components/Utils/Tabs'
import YamlView from '@/components/Skeletons/YamlView'
import LabelList from '@/components/Utils/LabelList'

export default {
  name: 'Dataplanes',
  components: {
    FrameSkeleton,
    DataOverview,
    Tabs,
    YamlView,
    LabelList
  },
  data () {
    return {
      isLoading: true,
      isEmpty: false,
      hasError: false,
      entityIsLoading: true,
      entityIsEmpty: false,
      entityHasError: false,
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
      },
      tabs: [
        {
          hash: '#overview',
          title: 'Overview'
        },
        {
          hash: '#yaml',
          title: 'YAML'
        }
      ],
      entity: null,
      rawEntity: null,
      firstEntity: null
    }
  },
  computed: {
    tabGroupTitle () {
      const entity = this.entity

      if (entity) {
        return `Dataplane: ${entity.name}`
      } else {
        return null
      }
    },
    entityOverviewTitle () {
      const entity = this.entity

      if (entity) {
        return `Entity Overview for ${entity.name}`
      } else {
        return null
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
    tableAction (ev) {
      const data = ev

      // reset back to the first tab
      this.$store.dispatch('updateSelectedTab', this.tabs[0].hash)

      // set the active table row
      this.$store.dispatch('updateSelectedTableRow', ev)

      // load the data into the tabs
      this.getEntity(data)
    },
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

              // sort the table data by name and the mesh it's associated with
              items
                .sort((a, b) => (a.name > b.name) ? 1 : (a.name === b.name) ? ((a.mesh > b.mesh) ? 1 : -1) : -1)

              // set the first item as the default for initial load
              this.firstEntity = items[0].name

              // load the YAML entity for the first item on page load
              this.getEntity(this.firstEntity)

              // set the selected table row for the first item on page load
              this.$store.dispatch('updateSelectedTableRow', this.firstEntity)

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
                      if (inbound) {
                        /** inbound */
                        for (let i = 0; i < inbound.length; i++) {
                          const rawTags = inbound[i].tags

                          const final = []
                          const tagKeys = Object.keys(rawTags)
                          const tagVals = Object.values(rawTags)

                          for (let x = 0; x < tagKeys.length; x++) {
                            final.push({
                              label: tagKeys[x],
                              value: tagVals[x]
                            })
                          }

                          tags = final
                        }
                      } else if (gateway) {
                        /** gateway */
                        const items = gateway.tags

                        for (let i = 0; i < Object.keys(items).length; i++) {
                          const final = []
                          const tagKeys = Object.keys(items)
                          const tagVals = Object.values(items)

                          for (let x = 0; x < tagKeys.length; x++) {
                            final.push({
                              label: tagKeys[x],
                              value: tagVals[x]
                            })
                          }

                          tags = final
                        }
                      }
                    } else {
                      tags = 'none'
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
              this.tableData.data = []
              this.tableDataIsEmpty = true

              this.getEntity(null)
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
    },
    getEntity (entity) {
      this.entityIsLoading = true
      this.entityIsEmpty = false

      const mesh = this.$route.params.mesh

      if (entity && entity !== null) {
        return this.$api.getAllDataplanesFromMesh(mesh, entity)
          .then(response => {
            if (response) {
              const selected = ['type', 'name', 'mesh']

              this.entity = getSome(response.items, selected)
              this.rawEntity = response
            } else {
              this.entity = null
              this.entityIsEmpty = true
            }
          })
          .catch(error => {
            this.entityHasError = true
            console.error(error)
          })
          .finally(() => {
            setTimeout(() => {
              this.entityIsLoading = false
            }, process.env.VUE_APP_DATA_TIMEOUT)
          })
      } else {
        setTimeout(() => {
          this.entityIsEmpty = true
          this.entityIsLoading = false
        }, process.env.VUE_APP_DATA_TIMEOUT)
      }
    }
  }
}
</script>
