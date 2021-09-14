<template>
  <div class="zones">
    <KEmptyState v-if="multicluster === false">
      <template v-slot:title>
        <KIcon
          class="kong-icon--centered"
          icon="dangerCircle"
          size="64"
        />
        {{ productName }} is running in Standalone mode.
      </template>
      <template v-slot:message>
        <p>
          To access this page, you must be running in <strong>Multi-Zone</strong> mode.
        </p>
      </template>
      <template v-slot:cta>
        <KButton
          :to="`https://kuma.io/docs/${globalCpVersion}/documentation/deployments/`"
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

        :table-data="tableData"
        :table-data-is-empty="tableDataIsEmpty"
        :show-warnings="tableData.data.some((item) => item.withWarnings)"
        table-data-function-text="View"
        table-data-row="name"
        :next="next"
        @tableAction="tableAction"
        @loadData="loadData($event)"
      />
      <Tabs
        v-if="isEmpty === false"
        :has-error="hasError"
        :is-loading="isLoading"
        :tabs="filterTabs()"
        initial-tab-override="overview"
      >
        <template v-slot:tabHeader>
          <div>
            <h3>{{ tabGroupTitle }}</h3>
          </div>
        </template>
        <template v-slot:overview>
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
        <template v-slot:insights>
          <LoaderCard
            :has-error="entityHasError"
            :is-loading="entityIsLoading"
            :is-empty="entityIsEmpty"
          >
            <div v-if="rawEntity">
              <div
                v-for="(value, key) in rawEntity.zoneInsight.subscriptions"
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
                  <template v-slot:alertIcon>
                    <KIcon icon="portal" />
                  </template>
                  <template v-slot:alertMessage>
                    There are no Policy statistics for <strong>{{ value.id }}</strong>
                  </template>
                </KAlert>
              </div>
            </div>
          </LoaderCard>
        </template>
        <template v-slot:config>
          <KCard
            v-if="codeOutput"
            border-variant="noBorder"
          >
            <template v-slot:body>
              <Prism
                language="json"
                :code="codeOutput"
              />
            </template>
            <template v-slot:actions>
              <KClipboardProvider
                v-if="codeOutput"
                v-slot="{ copyToClipboard }"
              >
                <KPop placement="bottom">
                  <KButton
                    appearance="primary"
                    @click="() => { copyToClipboard(codeOutput) }"
                  >
                    Copy config to clipboard
                  </KButton>
                  <template v-slot:content>
                    <div>
                      <p>Entity copied to clipboard!</p>
                    </div>
                  </template>
                </KPop>
              </KClipboardProvider>
            </template>
          </KCard>
        </template>
        <template v-slot:warnings>
          <Warnings :warnings="warnings" />
        </template>
      </Tabs>
    </FrameSkeleton>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Prism from 'vue-prismjs'

import Kuma from '@/services/kuma'
import { humanReadableDate, getSome, stripTimes, camelCaseToWords, getZoneDpServerAuthType } from '@/helpers'
import { getTableData } from '@/utils/tableDataUtils'
import { getItemStatusFromInsight, INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS } from '@/dataplane'
import sortEntities from '@/mixins/EntitySorter'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import DataOverview from '@/components/Skeletons/DataOverview'
import Tabs from '@/components/Utils/Tabs'

import LabelList from '@/components/Utils/LabelList'
import LoaderCard from '@/components/Utils/LoaderCard'
import Warnings from '@/views/Entities/components/Warnings'

import { PAGE_SIZE_DEFAULT, PRODUCT_NAME } from '@/consts'

export default {
  name: 'Zones',
  components: {
    FrameSkeleton,
    DataOverview,
    Tabs,
    LabelList,
    LoaderCard,
    Warnings,
    Prism,
  },
  filters: {
    formatValue(value) {
      return value ? parseInt(value, 10).toLocaleString('en').toString() : 0
    },
    readableDate(value) {
      return humanReadableDate(value)
    },
    humanReadable(value) {
      return camelCaseToWords(value)
    },
    formatError(value) {
      if (value === '--') {
        return 'error calculating'
      }

      return value
    },
  },
  mixins: [sortEntities],
  metaInfo: {
    title: 'Zones',
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
      tableDataIsEmpty: false,
      empty_state: {
        title: 'No Data',
        message: 'There are no Zones present.',
      },
      tableData: {
        headers: [
          { key: 'actions', hideLabel: true },
          { label: 'Status', key: 'status' },
          { label: 'Name', key: 'name' },
          { label: 'Zone CP Version', key: 'zoneCpVersion' },
          { label: 'Backend', key: 'backend' },
          { key: 'warnings', hideLabel: true },
        ],
        data: [],
      },
      tabs: [
        {
          hash: '#overview',
          title: 'Overview',
        },
        {
          hash: '#insights',
          title: 'Zone Insights',
        },
        {
          hash: '#config',
          title: 'Config',
        },
        {
          hash: '#warnings',
          title: 'Warnings',
        },
      ],
      entity: [],
      rawEntity: null,
      pageSize: PAGE_SIZE_DEFAULT,
      next: null,
      tabGroupTitle: null,
      itemsPerCol: 3,
      warnings: [],
      codeOutput: null,
    }
  },
  computed: {
    ...mapState({
      mesh: 'selectedMesh',
    }),
    ...mapGetters({
      multicluster: 'config/getMulticlusterStatus',
      globalCpVersion: 'config/getVersion',
    }),
  },
  watch: {
    $route() {
      this.init()
    },
  },
  beforeMount() {
    this.init()
  },
  methods: {
    init() {
      if (this.multicluster) {
        this.loadData()
      }
    },
    filterTabs() {
      if (!this.warnings.length) {
        return this.tabs.filter((tab) => tab.hash !== '#warnings')
      }

      return this.tabs
    },

    tableAction(ev) {
      const data = ev

      // load the data into the tabs
      this.getEntity(data)
    },
    parseData(entity) {
      const { zoneInsight = {} } = entity
      let zoneCpVersion = '-'
      let backend = ''

      if (zoneInsight.subscriptions && zoneInsight.subscriptions.length) {
        zoneInsight.subscriptions.forEach((item, index) => {
          if (item.version && item.version.kumaCp) {
            zoneCpVersion = item.version.kumaCp.version

            if (item.config) {
              backend = JSON.parse(item.config).store.type
            }
          }
        })
      }

      return {
        ...entity,
        status: getItemStatusFromInsight(zoneInsight).status,
        zoneCpVersion,
        backend,
        withWarnings: zoneCpVersion !== this.globalCpVersion,
      }
    },
    async loadData(offset = '0') {
      this.isLoading = true
      this.isEmpty = false

      try {
        const { data, next } = await getTableData({
          getAllEntities: Kuma.getAllZoneOverviews.bind(Kuma),
          size: this.pageSize,
          offset,
        })

        // set pagination
        this.next = next

        // set table data
        if (data.length) {
          this.tableData.data = data.map(this.parseData)
          this.tableDataIsEmpty = false
          this.isEmpty = false

          this.getEntity({ name: data[0].name })
        } else {
          this.tableData.data = []
          this.tableDataIsEmpty = true
          this.isEmpty = true
          this.entityIsEmpty = true
        }
      } catch (error) {
        this.hasError = true
        this.isEmpty = true

        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    async getEntity(entity) {
      this.entityIsLoading = true
      this.entityIsEmpty = true

      const selected = ['type', 'name', 'mesh']

      const timeout = setTimeout(() => {
        this.entityIsEmpty = true
        this.entityIsLoading = false
      }, process.env.VUE_APP_DATA_TIMEOUT)

      if (entity) {
        this.entityIsEmpty = false
        this.warnings = []

        try {
          // get the Zone details from the Zone Insights endpoint
          const response = await Kuma.getZoneOverview(entity.name)
          const { name, zoneInsight } = response
          const { subscriptions = [] } = zoneInsight

          this.tabGroupTitle = `Zone: ${name}`
          this.entity = { ...getSome(response, selected), 'Authentication Type': getZoneDpServerAuthType(response) }
          this.rawEntity = stripTimes(response)

          if (subscriptions.length) {
            const { version = {} } = subscriptions[subscriptions.length - 1]
            const { kumaCp = {} } = version

            const kumaCpVersion = kumaCp.version || '-'

            if (kumaCpVersion !== this.globalCpVersion) {
              this.warnings.push({
                kind: INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS,
                payload: {
                  zoneCpVersion: kumaCpVersion,
                  globalCpVersion: this.globalCpVersion,
                },
              })
            }

            if (subscriptions[subscriptions.length - 1].config) {
              this.codeOutput = JSON.stringify(JSON.parse(subscriptions[subscriptions.length - 1].config), null, 2)
            }
          }
        } catch (e) {
          this.entity = null
          this.entityHasError = true
          this.entityIsEmpty = true
        } finally {
          clearTimeout(timeout)
        }
      }

      this.entityIsLoading = false
    },
  },
}
</script>
