<template>
  <FrameSkeleton>
    <DataOverview
      :page-size="pageSize"
      :has-error="hasError"
      :is-loading="isLoading"
      :empty-state="getEmptyState()"
      :table-data="buildTableData()"
      :table-data-is-empty="tableDataIsEmpty"
      :show-warnings="tableData.data.some((item) => item.withWarnings)"
      :next="next"
      @tableAction="tableAction"
      @loadData="loadData($event)"
    >
      <template v-slot:additionalControls>
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
          v-if="$route.query.ns"
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
      <template v-slot:tabHeader>
        <div>
          <h3 v-if="entity.basicData">
            DPP: {{ entity.basicData.name }}
          </h3>
        </div>
        <div>
          <EntityURLControl
            :name="entityName"
            :mesh="entityMesh"
          />
        </div>
      </template>
      <template v-slot:overview>
        <LabelList
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
            <div v-if="entity.versions">
              <h4>Versions</h4>
              <p>
                <span
                  v-for="(val, key) in entity.versions"
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
          </div>
        </LabelList>
      </template>
      <template v-slot:insights>
        <KCard border-variant="noBorder">
          <template v-slot:body>
            <Accordion :initially-open="0">
              <AccordionItem
                v-for="(value, key) in subscriptionsReversed"
                :key="key"
              >
                <template v-slot:accordion-header>
                  <SubscriptionHeader :details="value" />
                </template>

                <template v-slot:accordion-content>
                  <SubscriptionDetails
                    :details="value"
                    is-discovery-subscription
                  />
                </template>
              </AccordionItem>
            </Accordion>
          </template>
        </KCard>
      </template>
      <template v-slot:mtls>
        <LabelList
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
            <template v-slot:alertMessage>
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
      <template v-slot:yaml>
        <YamlView
          :is-loading="entityIsLoading"
          :is-empty="entityIsEmpty"
          :content="rawEntity"
        />
      </template>
      <template v-slot:warnings>
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
  getVersions,
  parseMTLSData,
  COMPATIBLE,
  INCOMPATIBLE_UNSUPPORTED_ENVOY,
  INCOMPATIBLE_UNSUPPORTED_KUMA_DP,
  INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS,
  INCOMPATIBLE_WRONG_FORMAT,
} from '@/dataplane'
import EntityURLControl from '@/components/Utils/EntityURLControl'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import DataOverview from '@/components/Skeletons/DataOverview'
import Tabs from '@/components/Utils/Tabs'
import YamlView from '@/components/Skeletons/YamlView'
import LabelList from '@/components/Utils/LabelList'
import Warnings from '@/views/Entities/components/Warnings'
import { PAGE_SIZE_DEFAULT, PRODUCT_NAME } from '@/consts'
import Accordion from '@/components/Accordion/Accordion'
import AccordionItem from '@/components/Accordion/AccordionItem'
import { getTableData } from '@/utils/tableDataUtils'
import SubscriptionDetails from '../components/SubscriptionDetails'
import SubscriptionHeader from '../components/SubscriptionHeader'

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
    Accordion,
    AccordionItem,
    SubscriptionDetails,
    SubscriptionHeader,
  },
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
            hash: '#insights',
            title: 'DPP Insights',
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
  },
  data() {
    return {
      productName: PRODUCT_NAME,
      isLoading: true,
      isEmpty: false,
      hasError: false,
      entityIsLoading: true,
      entityIsEmpty: false,
      warnings: [],
      tableDataIsEmpty: false,
      tableData: {
        headers: [],
        data: [],
      },
      entity: {},
      rawEntity: {},
      pageSize: PAGE_SIZE_DEFAULT,
      next: null,
      shownTLSTab: false,
      rawData: null,
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
    entityName() {
      return this.entity?.basicData?.name || ''
    },
    entityMesh() {
      return this.entity?.basicData?.mesh || ''
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
    buildEntity(basicData, tags, dataplaneInsight, versions) {
      const mtls = dataplaneInsight.mTLS ? parseMTLSData(dataplaneInsight.mTLS) : null

      return { basicData, tags, mtls, versions }
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
    async parseData(response) {
      const { dataplane = {}, dataplaneInsight = {} } = response
      const { name = '', mesh = '' } = response
      const { subscriptions = [] } = dataplaneInsight

      /**
       * Handle our tag collections based on the dataplane type.
       */
      const tags = dpTags(dataplane)

      const { status } = getStatus(dataplane, dataplaneInsight)

      /**
       * Iterate through the subscriptions
       */

      const { totalUpdates, totalRejectedUpdates, dpVersion, envoyVersion, selectedTime, selectedUpdateTime } =
        subscriptions.reduce(
          (acc, curr) => {
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
          },
          {
            totalUpdates: 0,
            totalRejectedUpdates: 0,
            dpVersion: '-',
            envoyVersion: '-',
            selectedTime: NaN,
            selectedUpdateTime: NaN,
          },
        )

      // assemble the table data
      const item = {
        name,
        mesh,
        tags,
        status,
        totalUpdates,
        totalRejectedUpdates,
        dpVersion,
        envoyVersion,
        withWarnings: false,
        unsupportedEnvoyVersion: false,
        unsupportedKumaDPVersion: false,
        kumaDpAndKumaCpMismatch: false,
        lastUpdated: selectedUpdateTime ? humanReadableDate(new Date(selectedUpdateTime).toUTCString()) : 'never',
        lastConnected: selectedTime ? humanReadableDate(new Date(selectedTime).toUTCString()) : 'never',
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
        const { compatible } = await checkKumaDpAndZoneVersionsMismatch(tags, dpVersion)

        if (!compatible) {
          item.withWarnings = true
          item.kumaDpAndKumaCpMismatch = true
        }
      }

      return item
    },
    async loadData(offset = '0') {
      this.isLoading = true

      const mesh = this.$route.params.mesh || null
      const query = this.$route.query.ns || null

      try {
        const { data, next } = await getTableData({
          getSingleEntity: Kuma.getDataplaneOverviewFromMesh.bind(Kuma),
          getAllEntities: Kuma.getAllDataplaneOverviews.bind(Kuma),
          getAllEntitiesFromMesh: Kuma.getAllDataplaneOverviewsFromMesh.bind(Kuma),
          size: this.pageSize,
          offset,
          mesh,
          query,
          params: { ...this.dataplaneApiParams },
        })

        if (data.length) {
          // check to see if the `next` url is present
          this.next = next

          this.rawData = data

          // load the YAML entity for the first item on page load
          this.getEntity({ name: data[0].name })

          const final = await Promise.all(data.map((item) => this.parseData(item)))

          this.tableData.data = final
          this.tableDataIsEmpty = false
          this.isEmpty = false
        } else {
          this.tableData.data = []
          this.tableDataIsEmpty = true
          this.isEmpty = true
        }
      } catch (e) {
        this.hasError = true
        this.isEmpty = true

        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
    async getEntity(entity) {
      this.entityIsLoading = true
      this.entityIsEmpty = false

      const response = this.rawData.find((data) => data.name === entity.name)

      const dataplane = getDataplane(response)

      if (dataplane) {
        const selected = ['type', 'name', 'mesh']

        const dataplaneInsight = getDataplaneInsight(response) || {}
        const status = getStatus(dataplane, dataplaneInsight)
        const tags = dpTags(dataplane)
        const versions = getVersions(dataplaneInsight)

        const basicData = {
          ...getSome(dataplane, selected),
          status,
        }

        this.entity = this.buildEntity(basicData, tags, dataplaneInsight, versions)

        this.warnings = []

        const { subscriptions = [] } = dataplaneInsight

        this.subscriptionsReversed = Array.from(subscriptions).reverse()

        if (subscriptions.length) {
          this.setEntityWarnings(subscriptions, tags)
        }

        this.rawEntity = stripTimes(dataplane)
      } else {
        this.entity = {}
        this.entityIsEmpty = true
      }

      this.entityIsLoading = false
    },
    async setEntityWarnings(subscriptions, tags) {
      const { version = {} } = subscriptions[subscriptions.length - 1]
      const { kumaDp = {}, envoy = {} } = version

      if (kumaDp && envoy) {
        const compatible = this.checkVersionsCompatibility(kumaDp.version, envoy.version)
        const { kind } = compatible

        if (kind !== COMPATIBLE && kind !== INCOMPATIBLE_WRONG_FORMAT) {
          this.warnings.push(compatible)
        }
      }

      if (this.multicluster) {
        const { compatible, payload } = await checkKumaDpAndZoneVersionsMismatch(tags, kumaDp.version)

        if (!compatible) {
          this.warnings.push({
            kind: INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS,
            payload,
          })
        }
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
