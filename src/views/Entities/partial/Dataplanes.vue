<template>
  <FrameSkeleton>
    <DataOverview
      :page-size="pageSize"
      :has-error="hasError"
      :is-loading="isLoading"
      :empty-state="getEmptyState()"
      :display-data-table="true"
      :table-data="buildTableData()"
      :table-data-is-empty="tableDataIsEmpty"
      :show-warnings="tableData.data.some((item) => item.withWarnings)"
      table-data-function-text="View"
      table-data-row="name"
      :next="next"
      @tableAction="tableAction"
      @loadData="loadData($event)"
    >
      <template slot="additionalControls">
        <KButton
          class="add-dp-button"
          appearance="primary"
          size="small"
          :to="dataplaneWizardRoute"
          @click.native="onCreateClick"
        >
          <span class="custom-control-icon">
            +
          </span>
          Create data plane proxy
        </KButton>
        <KButton
          v-if="this.$route.query.ns"
          class="back-button"
          appearance="primary"
          size="small"
          :to="nsBackButtonRoute"
        >
          <span class="custom-control-icon">
            &larr;
          </span>
          View All
        </KButton>
      </template>
    </DataOverview>
    <Tabs
      v-if="isEmpty === false"
      :has-error="hasError"
      :is-loading="isLoading"
      :tabs="filterTabs()"
      initial-tab-override="overview"
    >
      <template slot="tabHeader">
        <div>
          <h3>{{ tabGroupTitle }}</h3>
        </div>
        <div>
          <EntityURLControl :url="shareUrl" />
        </div>
      </template>
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
                <div v-if="key === 'status'">
                  <h4>{{ key }}</h4>
                  <div
                    class="entity-status"
                    :class="{
                      'is-offline': (val.status.toString().toLowerCase() === 'offline' || val.status === false),
                      'is-degraded': (val.status.toString().toLowerCase() === 'partially degraded' || val.status === false)
                    }"
                  >
                    <span class="entity-status__label">{{ val.status }}</span>
                  </div>
                  <div class="reason-list">
                    <ul>
                      <li
                        v-for="reason in val.reason"
                        :key="reason"
                      >
                        <span class="entity-status__dot" />
                        {{ reason }}
                      </li>
                    </ul>
                  </div>
                </div>
                <div v-else>
                  <h4>{{ key }}</h4>
                  {{ val }}
                </div>
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
                  {{ val.label }}:
                </span>
                <span>
                  {{ val.value }}
                </span>
              </span>
            </p>
          </div>
        </LabelList>
      </template>
      <template
        v-if="showMtls"
        slot="mtls"
      >
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
              This data plane proxy does not yet have mTLS configured &mdash;
              <a
                :href="`https://kuma.io/docs/${version}/documentation/security/#certificates`"
                class="external-link"
                target="_blank"
              >
                Learn About Certificates in {{ productName }}
              </a>
            </template>
          </KAlert>
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
      <template slot="warnings">
        <Warnings :warnings="warnings" />
      </template>
    </Tabs>
  </FrameSkeleton>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Kuma from '@/services/kuma'
import { datadogLogs } from '@datadog/browser-logs'
import { getSome, humanReadableDate, stripTimes } from '@/helpers'
import { datadogLogEvents } from '@/datadogEvents'
import {
  checkKumaDpAndZoneVersionsMismatch,
  checkVersionsCompatibility,
  dpTags,
  getDataplane,
  getDataplaneInsight,
  getDataplaneType,
  getStatus,
  parseMTLSData,
  COMPATIBLE,
  INCOMPATIBLE_UNSUPPORTED_ENVOY,
  INCOMPATIBLE_UNSUPPORTED_KUMA_DP,
  INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS,
  INCOMPATIBLE_WRONG_FORMAT,
} from '@/dataplane'
import EntityURLControl from '@/components/Utils/EntityURLControl'
import sortEntities from '@/mixins/EntitySorter'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import DataOverview from '@/components/Skeletons/DataOverview'
import Tabs from '@/components/Utils/Tabs'
import YamlView from '@/components/Skeletons/YamlView'
import LabelList from '@/components/Utils/LabelList'
import Warnings from '@/views/Entities/components/Warnings'
import { PAGE_SIZE_DEFAULT, PRODUCT_NAME } from '@/consts'

const KUMA_ZONE_TAG_NAME = 'kuma.io/zone'

export default {
  name: 'Dataplanes',
  components: {
    Warnings,
    EntityURLControl,
    FrameSkeleton,
    DataOverview,
    Tabs,
    YamlView,
    LabelList,
  },
  mixins: [sortEntities],
  props: {
    nsBackButtonRoute: {
      type: Object,
      default() {
        return {
          name: 'dataplanes',
        }
      },
    },
    emptyStateMsg: {
      type: String,
      default: 'There are no data plane proxies present.',
    },
    dataplaneApiParams: {
      type: Object,
      default() {
        return {}
      },
    },
    tableHeaders: {
      type: Array,
      default() {
        return [
          { key: 'actions', hideLabel: true },
          { label: 'Status', key: 'status' },
          { label: 'Name', key: 'name' },
          { label: 'Mesh', key: 'mesh' },
          { label: 'Type', key: 'type' },
          { label: 'Tags', key: 'tags' },
          { label: 'Last Connected', key: 'lastConnected' },
          { label: 'Last Updated', key: 'lastUpdated' },
          { label: 'Total Updates', key: 'totalUpdates' },
          { label: 'Kuma DP version', key: 'dpVersion' },
          { label: 'Envoy version', key: 'envoyVersion' },
          { key: 'warnings', hideLabel: true },
        ]
      },
    },
    tabs: {
      type: Array,
      default() {
        return [
          {
            hash: '#overview',
            title: 'Overview',
          },
          {
            hash: '#mtls',
            title: 'Certificate Insights',
          },
          {
            hash: '#yaml',
            title: 'YAML',
          },
          {
            hash: '#warnings',
            title: 'Warnings',
          },
        ]
      },
    },
    showMtls: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      productName: PRODUCT_NAME,
      isLoading: true,
      isEmpty: false,
      hasError: false,
      entityIsLoading: true,
      entityIsEmpty: false,
      entityHasError: false,
      warnings: [],
      tableDataIsEmpty: false,
      tableData: {
        headers: [],
        data: [],
      },
      entity: [],
      rawEntity: null,
      firstEntity: null,
      pageSize: PAGE_SIZE_DEFAULT,
      next: null,
      tabGroupTitle: null,
      entityNamespace: null,
      entityOverviewTitle: null,
      shownTLSTab: false,
    }
  },
  computed: {
    ...mapGetters({
      environment: 'config/getEnvironment',
      queryNamespace: 'getItemQueryNamespace',
      supportedVersions: 'getSupportedVersions',
      supportedVersionsLoading: 'getSupportedVersionsFetching',
      multicluster: 'config/getMulticlusterStatus',
    }),
    dataplaneWizardRoute() {
      // we change the route to the Dataplane
      // wizard based on environment.
      if (this.environment === 'universal') {
        return { name: 'universal-dataplane' }
      } else {
        return { name: 'kubernetes-dataplane' }
      }
    },
    version() {
      const storedVersion = this.$store.getters.getVersion

      return storedVersion !== null ? storedVersion : 'latest'
    },
    shareUrl() {
      const urlRoot = `${window.location.origin}/#`
      const entity = this.entity

      const shareUrl = () => {
        if (entity.basicData) {
          if (this.$route.query.ns) {
            return this.$route.fullPath
          }

          return `${urlRoot}${this.$route.fullPath}?ns=${entity.basicData.name}`
        }

        return null
      }

      return shareUrl()
    },
  },
  watch: {
    $route() {
      this.loadData()
    },
  },
  beforeMount() {
    this.fetchSupportedVersions()
    this.loadData()
  },
  methods: {
    ...mapActions(['fetchSupportedVersions']),
    onCreateClick() {
      datadogLogs.logger.info(datadogLogEvents.CREATE_DATA_PLANE_PROXY_CLICKED)
    },
    buildEntity(basicData, tags, dataplaneInsight) {
      const mtls = dataplaneInsight.mTLS ? parseMTLSData(dataplaneInsight.mTLS) : null

      return { basicData, tags, mtls }
    },
    init() {
      this.loadData()
    },
    getEmptyState() {
      return {
        title: 'No Data',
        message: this.emptyStateMsg,
      }
    },
    filterTabs() {
      if (!this.warnings.length) {
        return this.tabs.filter((tab) => tab.hash !== '#warnings')
      }

      return this.tabs
    },
    buildTableData() {
      return {
        ...this.tableData,
        headers: this.tableHeaders,
      }
    },
    checkVersionsCompatibility(kumaDpVersion = '', envoyVersion = '') {
      return checkVersionsCompatibility(this.supportedVersions, kumaDpVersion, envoyVersion)
    },
    tableAction(ev) {
      const data = ev

      // load the data into the tabs
      this.getEntity(data)
    },
    async loadData(offset = '0') {
      this.isLoading = true

      const mesh = this.$route.params.mesh || null
      const query = this.$route.query.ns || null

      const params = {
        size: this.pageSize,
        offset,
        ...this.dataplaneApiParams,
      }

      /**
       * determine which endpoint to use based on the mesh.
       * we are either fetching entities from one mesh, or fetching
       * all of them from all meshes and collecting them into the view.
       */
      const endpoint = () => {
        if (mesh === 'all') {
          return Kuma.getAllDataplaneOverviews(params)
        } else if (query && query.length && mesh !== 'all') {
          return Kuma.getDataplaneOverviewFromMesh(mesh, query)
        }

        return Kuma.getAllDataplaneOverviewsFromMesh(mesh, params)
      }

      /**
       * the function used for fetching dataplanes from a mesh
       * and then collecting them into an array.
       */
      const dpFetcher = async (mesh, name, finalArr) => {
        try {
          const response = await Kuma.getDataplaneOverviewFromMesh(mesh, name)
          const { dataplane = {}, dataplaneInsight = {} } = response
          const { name: responseName = '', mesh: responseMesh = '' } = response
          const { subscriptions = [] } = dataplaneInsight

          /**
           * Handle our tag collections based on the dataplane type.
           */
          const tags = dpTags(dataplane)

          const { status } = getStatus(dataplane, dataplaneInsight)

          /**
           * Iterate through the subscriptions
           */
          const initial = {
            totalUpdates: 0,
            totalRejectedUpdates: 0,
            dpVersion: '-',
            envoyVersion: '-',
            selectedTime: NaN,
            selectedUpdateTime: NaN,
          }

          const reduced = subscriptions.reduce((acc, curr) => {
            const { status = {}, connectTime, version = {} } = curr
            const { total = {}, lastUpdateTime } = status
            const { responsesSent = '0', responsesRejected = '0' } = total
            const { kumaDp = {}, envoy = {} } = version
            const { version: dpVersion } = kumaDp
            const { version: envoyVersion } = envoy

            let { selectedTime, selectedUpdateTime } = acc

            const connectDate = Date.parse(connectTime)
            const lastUpdateDate = Date.parse(lastUpdateTime)

            if (connectDate) {
              if (!selectedTime || connectDate > selectedTime) {
                selectedTime = connectDate
              }
            }

            if (lastUpdateDate) {
              if (!selectedUpdateTime || lastUpdateDate > selectedUpdateTime) {
                selectedUpdateTime = lastUpdateDate
              }
            }

            return {
              totalUpdates: acc.totalUpdates + parseInt(responsesSent, 10),
              totalRejectedUpdates: acc.totalRejectedUpdates + parseInt(responsesRejected, 10),
              dpVersion: dpVersion || acc.dpVersion,
              envoyVersion: envoyVersion || acc.envoyVersion,
              selectedTime,
              selectedUpdateTime,
            }
          }, initial)

          const { totalUpdates, totalRejectedUpdates, dpVersion, envoyVersion, selectedTime, selectedUpdateTime } =
            reduced

          const lastConnected = selectedTime ? humanReadableDate(new Date(selectedTime).toUTCString()) : 'never'

          const lastUpdated = selectedUpdateTime
            ? humanReadableDate(new Date(selectedUpdateTime).toUTCString())
            : 'never'

          // assemble the table data
          const item = {
            name: responseName,
            mesh: responseMesh,
            tags: tags,
            status: status,
            lastConnected: lastConnected,
            lastUpdated: lastUpdated,
            totalUpdates: totalUpdates,
            totalRejectedUpdates: totalRejectedUpdates,
            dpVersion: dpVersion,
            envoyVersion: envoyVersion,
            withWarnings: false,
            unsupportedEnvoyVersion: false,
            unsupportedKumaDPVersion: false,
            kumaDpAndKumaCpMismatch: false,
            type: getDataplaneType(dataplane),
          }

          const { kind } = this.checkVersionsCompatibility(dpVersion, envoyVersion)

          switch (kind) {
            case INCOMPATIBLE_UNSUPPORTED_ENVOY:
              item.unsupportedEnvoyVersion = true
              item.withWarnings = true
              break
            case INCOMPATIBLE_UNSUPPORTED_KUMA_DP:
              item.unsupportedKumaDPVersion = true
              item.withWarnings = true
              break
          }

          if (this.multicluster) {
            const zoneTag = tags.find((tag) => tag.label === KUMA_ZONE_TAG_NAME)

            if (zoneTag) {
              try {
                const { compatible } = await checkKumaDpAndZoneVersionsMismatch(zoneTag.value, dpVersion)

                if (!compatible) {
                  item.withWarnings = true
                  item.kumaDpAndKumaCpMismatch = true
                }
              } catch (e) {
                console.error(e)
              }
            }
          }

          finalArr.push(item)

          this.sortEntities(finalArr)

          return finalArr
        } catch (e) {
          console.error(e)
        }
      }

      try {
        const response = await endpoint()

        const getItems = () => {
          const r = response

          if ('total' in r) {
            if (r.total !== 0 && r.items && r.items.length > 0) {
              return this.sortEntities(r.items)
            }

            return null
          }

          return r
        }

        const items = getItems()

        if (items) {
          // check to see if the `next` url is present
          this.next = Boolean(response.next)

          const final = []
          const itemSelect = query ? items : items[0]

          // set the first item as the default for initial load
          this.firstEntity = itemSelect.name

          // load the YAML entity for the first item on page load
          await this.getEntity(itemSelect)

          if (query && query.length && mesh && mesh.length) {
            await dpFetcher(mesh, query, final)
          } else {
            const promises = items.map((item) => dpFetcher(item.mesh, item.name, final))

            await Promise.all(promises)
          }

          this.tableData.data = final
          this.tableDataIsEmpty = false
          this.isEmpty = false
        } else {
          this.tableData.data = []
          this.tableDataIsEmpty = true
          this.isEmpty = true

          await this.getEntity(null)
        }
      } catch (e) {
        this.hasError = true
        this.isEmpty = true

        console.error(e)
      }

      setTimeout(() => {
        this.isLoading = false
      }, process.env.VUE_APP_DATA_TIMEOUT)
    },
    async getEntity(entity) {
      this.entityIsLoading = true
      this.entityIsEmpty = false
      this.entityHasError = false

      const mesh = this.$route.params.mesh

      if (entity) {
        const entityMesh = mesh === 'all' ? entity.mesh : mesh

        try {
          const response = await Kuma.getDataplaneOverviewFromMesh(entityMesh, entity.name)
          const dataplane = getDataplane(response)

          if (dataplane) {
            const selected = ['type', 'name', 'mesh']

            const dataplaneInsight = getDataplaneInsight(response) || {}
            const status = getStatus(dataplane, dataplaneInsight)
            const tags = dpTags(dataplane)
            const basicData = {
              ...getSome(dataplane, selected),
              status,
            }

            this.entity = this.buildEntity(basicData, tags, dataplaneInsight)
            this.entityNamespace = basicData.name
            this.tabGroupTitle = `Mesh: ${basicData.name}`
            this.entityOverviewTitle = `Entity Overview for ${basicData.name}`

            this.warnings = []

            const { subscriptions = [] } = dataplaneInsight

            if (subscriptions.length) {
              const { version = {} } = subscriptions.pop()
              const { kumaDp = {}, envoy = {} } = version

              if (kumaDp && envoy) {
                const compatible = this.checkVersionsCompatibility(kumaDp.version, envoy.version)
                const { kind } = compatible

                if (kind !== COMPATIBLE && kind !== INCOMPATIBLE_WRONG_FORMAT) {
                  this.warnings.push(compatible)
                }
              }

              if (this.multicluster) {
                const zoneTag = tags.find((tag) => tag.label === KUMA_ZONE_TAG_NAME)

                if (zoneTag) {
                  try {
                    const { compatible, payload } = await checkKumaDpAndZoneVersionsMismatch(
                      zoneTag.value,
                      kumaDp.version,
                    )

                    if (!compatible) {
                      this.warnings.push({
                        kind: INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS,
                        payload,
                      })
                    }
                  } catch (e) {
                    console.error(e)
                  }
                }
              }
            }

            this.rawEntity = stripTimes(dataplane)
          } else {
            this.entity = null
            this.entityIsEmpty = true
          }
        } catch (e) {
          this.entityHasError = true

          console.error(e)
        }

        setTimeout(() => {
          this.entityIsLoading = false
        }, process.env.VUE_APP_DATA_TIMEOUT)
      } else {
        setTimeout(() => {
          this.entityIsEmpty = true
          this.entityIsLoading = false
        }, process.env.VUE_APP_DATA_TIMEOUT)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.add-dp-button {
  background-color: var(--logo-green) !important;
}
.reason-list {
  ul {
    li {
      margin-left: 20px;
      margin-bottom: 5px;
      margin-top: 5px;
    }
  }
}
.reason-list .entity-status__dot {
  background-color: var(--black-85);
}
</style>
