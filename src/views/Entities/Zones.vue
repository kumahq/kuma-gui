<template>
  <div class="zones">
    <MultizoneInfo v-if="multicluster === false" />

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
          <h3 v-if="entity">
            Zone: {{ entity.name }}
          </h3>
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
          <KCard border-variant="noBorder">
            <template v-slot:body>
              <Accordion :initially-open="0">
                <AccordionItem
                  v-for="(value, key) in zoneInsightSubscriptionsReversed"
                  :key="key"
                >
                  <template slot="accordion-header">
                    <ZoneInsightSubscriptionHeader :details="value" />
                  </template>

                  <template slot="accordion-content">
                    <ZoneInsightSubscriptionDetails :details="value" />
                  </template>
                </AccordionItem>
              </Accordion>
            </template>
          </KCard>
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
import get from 'lodash/get'
import Prism from 'vue-prismjs'
import Kuma from '@/services/kuma'
import { getSome, getZoneDpServerAuthType } from '@/helpers'
import { getTableData } from '@/utils/tableDataUtils'
import { getItemStatusFromInsight, INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS } from '@/dataplane'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import DataOverview from '@/components/Skeletons/DataOverview'
import Tabs from '@/components/Utils/Tabs'
import Accordion from '@/components/Accordion/Accordion'
import AccordionItem from '@/components/Accordion/AccordionItem'

import LabelList from '@/components/Utils/LabelList'
import Warnings from '@/views/Entities/components/Warnings'
import { PAGE_SIZE_DEFAULT } from '@/consts'

import ZoneInsightSubscriptionDetails from './components/ZoneInsightSubscriptionDetails'
import ZoneInsightSubscriptionHeader from './components/ZoneInsightSubscriptionHeader'
import MultizoneInfo from './components/MultizoneInfo'

export default {
  name: 'Zones',
  components: {
    Accordion,
    AccordionItem,
    FrameSkeleton,
    DataOverview,
    Tabs,
    LabelList,
    Warnings,
    Prism,
    ZoneInsightSubscriptionDetails,
    ZoneInsightSubscriptionHeader,
    MultizoneInfo,
  },
  metaInfo: {
    title: 'Zones',
  },
  data() {
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
      entity: {},
      pageSize: PAGE_SIZE_DEFAULT,
      next: null,
      warnings: [],
      zoneInsightSubscriptionsReversed: [],
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

      const selected = ['type', 'name']

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
          const subscriptions = get(response, 'zoneInsight.subscriptions', [])

          this.entity = { ...getSome(response, selected), 'Authentication Type': getZoneDpServerAuthType(response) }
          this.zoneInsightSubscriptionsReversed = Array.from(subscriptions).reverse()

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
          console.error(e)

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
