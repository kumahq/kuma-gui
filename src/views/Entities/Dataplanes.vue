<template>
  <div class="dataplanes">
    <FrameSkeleton>
      <DataOverview
        :page-size="pageSize"
        :has-error="hasError"
        :is-loading="isLoading"
        :empty-state="empty_state"
        :display-data-table="true"
        :table-data="tableData"
        :table-data-is-empty="tableDataIsEmpty"
        table-data-function-text="View"
        table-data-row="name"
        @tableAction="tableAction"
        @reloadData="loadData"
      >
        <template slot="additionalControls">
          <KButton
            class="add-dp-button"
            appearance="primary"
            size="small"
            :to="dataplaneWizardRoute"
          >
            <span class="custom-control-icon">
              +
            </span>
            Create Dataplane
          </KButton>
        </template>
        <template slot="pagination">
          <Pagination
            :has-previous="previous.length > 0"
            :has-next="hasNext"
            @next="goToNextPage"
            @previous="goToPreviousPage"
          />
        </template>
      </DataOverview>
      <Tabs
        v-if="isEmpty === false"
        :has-error="hasError"
        :is-loading="isLoading"
        :tabs="tabs"
        :tab-group-title="tabGroupTitle"
        initial-tab-override="overview"
      >
        <template slot="overview">
          <LabelList
            :has-error="entityHasError"
            :is-loading="entityIsLoading"
            :is-empty="entityIsEmpty"
          >
            <!-- basic information -->
            <div>
              <ul>
                <li
                  v-for="(val, key) in entity.basicData"
                  :key="key"
                >
                  <h4>{{ key }}</h4>
                  <p>
                    {{ val }}
                  </p>
                </li>
              </ul>
            </div>
            <!-- tag information -->
            <div>
              <h4>Tags</h4>
              <p>
                <span
                  v-for="(val, key) in entity.tags"
                  :key="key"
                  class="tag-cols"
                >
                  <span>
                    {{ key }}:
                  </span>
                  <span>
                    {{ val }}
                  </span>
                </span>
              </p>
            </div>
          </LabelList>
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
        <template slot="mtls">
          <LabelList
            :has-error="entityHasError"
            :is-loading="entityIsLoading"
            :is-empty="entityIsEmpty"
          >
            <ul v-if="entity.mtls">
              <li
                v-for="(val, key) in entity.mtls"
                :key="key"
              >
                <h4>{{ val.label }}</h4>
                <p>
                  {{ val.value }}
                </p>
              </li>
            </ul>
            <KAlert
              v-else
              appearance="danger"
            >
              <template slot="alertMessage">
                This Dataplane does not yet have mTLS configured &mdash;
                <a
                  href="https://kuma.io/docs/latest/documentation/security/#certificates"
                  class="external-link"
                >
                  Security Documentation
                </a>
              </template>
            </KAlert>
          </LabelList>
        </template>
      </Tabs>
    </FrameSkeleton>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSome, humanReadableDate, getOffset } from '@/helpers'
import sortEntities from '@/mixins/EntitySorter'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import Pagination from '@/components/Pagination'
import DataOverview from '@/components/Skeletons/DataOverview'
import Tabs from '@/components/Utils/Tabs'
import YamlView from '@/components/Skeletons/YamlView'
import LabelList from '@/components/Utils/LabelList'

export default {
  name: 'Dataplanes',
  metaInfo: {
    title: 'Dataplanes'
  },
  components: {
    FrameSkeleton,
    Pagination,
    DataOverview,
    Tabs,
    YamlView,
    LabelList
  },
  mixins: [
    sortEntities
  ],
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
          { key: 'actions', hideLabel: true },
          { label: 'Status', key: 'status' },
          { label: 'Name', key: 'name' },
          { label: 'Mesh', key: 'mesh' },
          { label: 'Tags', key: 'tags' },
          { label: 'Last Connected', key: 'lastConnected' },
          { label: 'Last Updated', key: 'lastUpdated' },
          { label: 'Total Updates', key: 'totalUpdates' }
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
        },
        {
          hash: '#mtls',
          title: 'Certificate Insights'
        }
      ],
      entity: [],
      rawEntity: null,
      firstEntity: null,
      pageSize: this.$pageSize,
      pageOffset: null,
      next: null,
      hasNext: false,
      previous: [],
      tabGroupTitle: null,
      entityOverviewTitle: null,
      showmTLSTab: false
    }
  },
  computed: {
    ...mapGetters({
      environment: 'getEnvironment'
    }),
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
      this.loadData()
    }
  },
  beforeMount () {
    this.loadData()
  },
  methods: {
    init () {
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
    tableAction (ev) {
      const data = ev

      // reset back to the first tab
      this.$store.dispatch('updateSelectedTab', this.tabs[0].hash)

      // set the active table row
      this.$store.dispatch('updateSelectedTableRow', data.name)

      // load the data into the tabs
      this.getEntity(data)
    },
    loadData () {
      this.isLoading = true

      const mesh = this.$route.params.mesh

      const params = {
        size: this.pageSize,
        offset: this.pageOffset
      }

      const endpoint = (mesh === 'all')
        ? this.$api.getAllDataplanes(params)
        : this.$api.getAllDataplanesFromMesh(mesh)

      const getDataplanes = () => {
        return endpoint
          .then(response => {
            if (response.items.length > 0) {
              // check to see if the `next` url is present
              if (response.next) {
                this.next = getOffset(response.next)
                this.hasNext = true
              } else {
                this.hasNext = false
              }

              const items = this.sortEntities(response.items)
              const final = []

              // set the first item as the default for initial load
              this.firstEntity = items[0].name

              // load the YAML entity for the first item on page load
              this.getEntity(items[0])

              // set the selected table row for the first item on page load
              this.$store.dispatch('updateSelectedTableRow', this.firstEntity)

              items.forEach(item => {
                this.$api.getDataplaneOverviewsFromMesh(item.mesh, item.name)
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

                    this.sortEntities(final)
                  })
                  .catch(error => {
                    console.error(error)
                  })
              })

              this.tableData.data = final
              this.tableDataIsEmpty = false
              this.isEmpty = false
            } else {
              this.tableData.data = []
              this.tableDataIsEmpty = true
              this.isEmpty = true

              this.getEntity(null)
            }
          })
          .catch(error => {
            this.hasError = true
            this.isEmpty = true

            console.error(error)
          })
          .finally(() => {
            setTimeout(() => {
              this.isLoading = false
            }, process.env.VUE_APP_DATA_TIMEOUT)
          })
      }

      getDataplanes()
    },
    getEntity (entity) {
      this.entityIsLoading = true
      this.entityIsEmpty = false

      const mesh = this.$route.params.mesh

      if (entity && entity !== null) {
        const entityMesh = (mesh === 'all')
          ? entity.mesh
          : mesh

        return this.$api.getDataplaneFromMesh(entityMesh, entity.name)
          .then(response => {
            if (response) {
              const selected = ['type', 'name', 'mesh']

              // get mTLS data if it's present
              const getMTLSData = async () => {
                let data = null

                try {
                  const res = await this.$api.getDataplaneOverviewsFromMesh(entityMesh, entity.name)

                  if (res.dataplaneInsight.mTLS) {
                    const mtls = res.dataplaneInsight.mTLS

                    data = {
                      certificateExpirationTime: {
                        label: 'Expiration Time',
                        value: humanReadableDate(mtls.certificateExpirationTime)
                      },
                      lastCertificateRegeneration: {
                        label: 'Last Generated',
                        value: humanReadableDate(mtls.lastCertificateRegeneration)
                      },
                      certificateRegenerations: {
                        label: 'Regenerations',
                        value: mtls.certificateRegenerations
                      }
                    }
                  }
                } catch (error) {
                  console.log(error)
                }

                return data
              }

              // determine between inbound and gateway modes
              // and then get the tags from which condition applies.
              const tagSrc = (response.networking.inbound && response.networking.inbound.length > 0)
                ? response.networking.inbound[0].tags
                : response.networking.gateway.tags

              const newEntity = async () => {
                return {
                  basicData: { ...getSome(response, selected) },
                  tags: { ...tagSrc },
                  mtls: await getMTLSData()
                }
              }

              newEntity().then(i => {
                this.entity = i
                this.tabGroupTitle = `Mesh: ${i.basicData.name}`
                this.entityOverviewTitle = `Entity Overview for ${i.basicData.name}`
              })

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

<style lang="scss" scoped>
.add-dp-button {
  background-color: var(--logo-green) !important;
}
</style>
