<template>
  <div class="zoneingresses">
    <page-header noflex>
      <breadcrumbs />
    </page-header>
    <KEmptyState
      v-if="multicluster === false"
      class="global-api-status"
    >
      <template slot="title">
        <KIcon
          class="kong-icon--centered"
          icon="dangerCircle"
          size="64"
        />
        {{ $productName }} is running in Standalone mode.
      </template>
      <template slot="message">
        <p>
          To access this page, you must be running in <strong>Multi-Zone</strong> mode.
        </p>
      </template>
      <template slot="cta">
        <KButton
          to="https://kuma.io/docs/0.6.0/documentation/deployments/"
          target="_blank"
          appearance="primary"
        >
          Learn More
        </KButton>
      </template>
    </KEmptyState>

    <!-- Zone CPs information for when Multicluster is enabled -->
    <FrameSkeleton v-else>
      <DataOverview
        :page-size="pageSize"
        :has-error="hasError"
        :is-loading="isLoading"
        :empty-state="empty_state"
        :display-data-table="true"
        :table-data="tableData"
        :table-data-is-empty="tableDataIsEmpty"
        :show-warnings="tableData.data.some((item) => item.withWarnings)"
        table-data-function-text="View"
        table-data-row="name"
        @tableAction="tableAction"
        @reloadData="loadData"
      >
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
        initial-tab-override="overview"
      >
        <template slot="tabHeader">
          <div>
            <h3>{{ tabGroupTitle }}</h3>
          </div>
        </template>
        <template slot="overview">
          <LabelList
            :has-error="entityHasError"
            :is-loading="entityIsLoading"
            :is-empty="entityIsEmpty"
          >
            <div>
              <ul>
                <li
                  v-for="(value, key) in entity"
                  :key="key"
                >
                  <h4 v-if="value">
                    {{ key }}
                  </h4>
                  <p v-if="key === 'status'">
                    <KBadge :appearance="value === 'Offline' ? 'danger' : 'success'">
                      {{ value }}
                    </KBadge>
                  </p>
                  <p v-else>
                    {{ value }}
                  </p>
                </li>
              </ul>
            </div>
          </LabelList>
        </template>
        <template slot="insights">
          <LoaderCard
            :has-error="entityHasError"
            :is-loading="entityIsLoading"
            :is-empty="entityIsEmpty"
          >
            <div v-if="rawEntity">
              <div
                v-for="(value, key) in rawEntity.zoneIngressInsight.subscriptions"
                :key="key"
                class="overview-stack"
              >
                <h4 class="overview-title">
                  ID: <span class="mono">{{ value.id }}</span>
                </h4>

                <div v-if="value.globalInstanceId || value.connectTime || value.disconnectTime">
                  <h5 class="overview-tertiary-title">
                    General Information:
                  </h5>
                  <ul>
                    <li v-if="value.globalInstanceId">
                      <strong>Global Instance ID:</strong>&nbsp;
                      <span class="mono">{{ value.globalInstanceId }}</span>
                    </li>
                    <li v-if="value.connectTime">
                      <strong>Last Connected:</strong>&nbsp;
                      {{ value.connectTime | readableDate }}
                    </li>
                    <li v-if="value.disconnectTime">
                      <strong>Last Disconnected:</strong>&nbsp;
                      {{ value.disconnectTime | readableDate }}
                    </li>
                  </ul>
                </div>

                <div v-if="value.status">
                  <ul
                    v-if="value.status.stat"
                    class="overview-stat-grid"
                  >
                    <li
                      v-for="(item, label) in value.status.stat"
                      :key="label"
                    >
                      <h6 class="overview-tertiary-title">
                        {{ label | humanReadable }}:
                      </h6>
                      <ul>
                        <li
                          v-for="(k, v) in item"
                          :key="v"
                        >
                          <strong>{{ v | humanReadable }}:</strong>&nbsp;
                          <span class="mono">{{ k | formatValue | formatError }}</span>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <KAlert
                  v-else
                  appearance="info"
                  class="mt-4"
                >
                  <template slot="alertIcon">
                    <KIcon icon="portal" />
                  </template>
                  <template slot="alertMessage">
                    There are no Policy statistics for <strong>{{ value.id }}</strong>
                  </template>
                </KAlert>
              </div>
            </div>
          </LoaderCard>
        </template>
        <template slot="yaml">
          <YamlView
            :title="entityOverviewTitle"
            :has-error="entityHasError"
            :is-loading="entityIsLoading"
            :is-empty="entityIsEmpty"
            :content="yamlEntity"
          />
        </template>
      </Tabs>
    </FrameSkeleton>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { humanReadableDate, getOffset, getSome, stripTimes, camelCaseToWords } from '@/helpers'
import sortEntities from '@/mixins/EntitySorter'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import PageHeader from '@/components/Utils/PageHeader.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import Pagination from '@/components/Pagination'
import DataOverview from '@/components/Skeletons/DataOverview'
import Tabs from '@/components/Utils/Tabs'
import YamlView from '@/components/Skeletons/YamlView'
import LabelList from '@/components/Utils/LabelList'
import LoaderCard from '@/components/Utils/LoaderCard'

import { getZoneIngressStatus } from '@/dataplane'

export default {
  name: 'ZoneIngresses',
  metaInfo: {
    title: 'ZoneIngresses'
  },
  components: {
    FrameSkeleton,
    PageHeader,
    Breadcrumbs,
    Pagination,
    DataOverview,
    Tabs,
    YamlView,
    LabelList,
    LoaderCard,
  },
  filters: {
    formatValue (value) {
      return value ? parseInt(value).toLocaleString('en').toString() : 0
    },
    readableDate (value) {
      return humanReadableDate(value)
    },
    humanReadable (value) {
      return camelCaseToWords(value)
    },
    formatError (value) {
      if (value === '--') {
        return 'error calculating'
      }

      return value
    }
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
        message: 'There are no Zone Ingresses present.'
      },
      tableData: {
        headers: [
          { key: 'actions', hideLabel: true },
          { label: 'Status', key: 'status' },
          { label: 'Name', key: 'name' },
        ],
        data: []
      },
      tabs: [
        {
          hash: '#overview',
          title: 'Overview'
        },
        {
          hash: '#insights',
          title: 'Zone Ingress Insights'
        },
      ],
      entity: [],
      rawEntity: null,
      yamlEntity: null,
      firstEntity: null,
      pageSize: this.$pageSize,
      pageOffset: null,
      next: null,
      hasNext: false,
      previous: [],
      tabGroupTitle: null,
      entityOverviewTitle: null,
      itemsPerCol: 3,
    }
  },
  computed: {
    ...mapGetters({
      multicluster: 'getMulticlusterStatus',
    }),
    // If you need to test multicluster without actually having it enabled
    // in Kuma, uncomment this and comment out the mapGetters above.
    // multicluster () {
    //   return true
    // },
    pageTitle () {
      return this.$route.meta.title
    },
    shareUrl () {
      const urlRoot = `${window.location.origin}#`
      const entity = this.entity

      const shareUrl = () => {
        if (this.$route.query.ns) {
          return this.$route.fullPath
        }

        return `${urlRoot}${this.$route.fullPath}?ns=${entity.name}`
      }

      return shareUrl()
    }
  },
  watch: {
    '$route' () {
      this.init()
    }
  },
  beforeMount () {
    this.init()
  },
  methods: {
    init () {
      if (this.multicluster) {
        this.loadData()
      }
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
      this.isEmpty = false

      const endpoint = this.$api.getAllZoneIngressOverviews()

      const getZoneIngress = () => {
        return endpoint
          .then((response = {}) => {
            const nextCheck = !!response.next

            // check to see if the `next` url is present
            if (nextCheck) {
              this.next = getOffset(response.next)
              this.hasNext = true
            } else {
              this.hasNext = false
            }

            let { items = [] } = response

            if (items.length > 0) {
              // rewrite the status column to be more human-readable
              items = items.map(item => {
                const { zoneIngressInsight = {} } = item

                return { ...item, ...getZoneIngressStatus(zoneIngressInsight) }
              })

              // sort the table data by name and the mesh it's associated with
              this.sortEntities(items)

              // set the first item as the default for initial load
              this.firstEntity = items[0].name

              // load the YAML entity for the first item on page load
              this.getEntity(items[0])

              // set the selected table row for the first item on page load
              this.$store.dispatch('updateSelectedTableRow', this.firstEntity)

              this.tableData.data = [...items]
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

      getZoneIngress()
    },
    async getEntity (entity) {
      this.entityIsLoading = true
      this.entityIsEmpty = true

      const selected = ['type', 'name', 'mesh']

      const timeout = setTimeout(() => {
        this.entityIsEmpty = true
        this.entityIsLoading = false
      }, process.env.VUE_APP_DATA_TIMEOUT)

      if (entity) {
        this.entityIsEmpty = false

        try {
          // get the ZoneIngress details from the ZoneIngress Insights endpoint
          const response = await this.$api.getZoneIngressOverview(entity.name)
          const { name, zoneIngressInsight, ...rest } = response

          this.tabGroupTitle = `Zone Ingress: ${name}`
          this.entityOverviewTitle = `Zone Ingress Overview for ${name}`
          this.entity = getSome(response, selected)
          this.rawEntity = stripTimes(response)
          this.yamlEntity = { name, ...rest }
        } catch (e) {
          this.entity = null
          this.entityHasError = true
          this.entityIsEmpty = true
        } finally {
          clearTimeout(timeout)
        }
      }

      this.entityIsLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.add-mesh-button {
  background-color: var(--logo-green) !important;
}
</style>
