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
        :next="next"
        @table-action="tableAction"
        @load-data="loadData($event)"
      >
        <template #additionalControls>
          <KButton
            v-if="$route.query.ns"
            class="back-button"
            appearance="primary"
            size="small"
            :to="{
              name: 'zones'
            }"
          >
            <span class="custom-control-icon">
              &larr;
            </span>
            View All
          </KButton>
        </template>
      </DataOverview>
      <TabsWidget
        v-if="isEmpty === false"
        :has-error="hasError"
        :is-loading="isLoading"
        :tabs="filterTabs()"
        initial-tab-override="overview"
      >
        <template #tabHeader>
          <div>
            <h3> Zone: {{ entity.name }}</h3>
          </div>
          <div>
            <EntityURLControl :name="entity.name" />
          </div>
        </template>
        <template #overview>
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
        <template #insights>
          <KCard border-variant="noBorder">
            <template #body>
              <AccordionList :initially-open="0">
                <AccordionItem
                  v-for="(value, key) in subscriptionsReversed"
                  :key="key"
                >
                  <template #accordion-header>
                    <SubscriptionHeader :details="value" />
                  </template>

                  <template #accordion-content>
                    <SubscriptionDetails :details="value" />
                  </template>
                </AccordionItem>
              </AccordionList>
            </template>
          </KCard>
        </template>
        <template #config>
          <KCard
            v-if="codeOutput"
            border-variant="noBorder"
          >
            <template #body>
              <CodeBlock
                language="json"
                :code="codeOutput"
              />
            </template>
            <template #actions>
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
                  <template #content>
                    <div>
                      <p>Config copied to clipboard!</p>
                    </div>
                  </template>
                </KPop>
              </KClipboardProvider>
            </template>
          </KCard>
        </template>
        <template #warnings>
          <WarningsWidget :warnings="warnings" />
        </template>
      </TabsWidget>
    </FrameSkeleton>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import get from 'lodash/get'

import SubscriptionDetails from './components/SubscriptionDetails.vue'
import SubscriptionHeader from './components/SubscriptionHeader.vue'
import MultizoneInfo from './components/MultizoneInfo.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import { fetchAllResources, getSome, getZoneDpServerAuthType } from '@/helpers'
import Kuma from '@/services/kuma'
import { getTableData } from '@/utils/tableDataUtils'
import { getItemStatusFromInsight, INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS } from '@/dataplane'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton.vue'
import DataOverview from '@/components/Skeletons/DataOverview.vue'
import TabsWidget from '@/components/Utils/TabsWidget.vue'
import AccordionList from '@/components/Accordion/AccordionList.vue'
import AccordionItem from '@/components/Accordion/AccordionItem.vue'
import EntityURLControl from '@/components/Utils/EntityURLControl.vue'

import LabelList from '@/components/Utils/LabelList.vue'
import WarningsWidget from '@/views/Entities/components/WarningsWidget.vue'
import { PAGE_SIZE_DEFAULT } from '@/consts'

export default {
  name: 'ZonesView',
  components: {
    AccordionList,
    AccordionItem,
    FrameSkeleton,
    DataOverview,
    TabsWidget,
    LabelList,
    WarningsWidget,
    CodeBlock,
    SubscriptionDetails,
    SubscriptionHeader,
    MultizoneInfo,
    EntityURLControl,
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
          { label: 'Ingress', key: 'hasIngress' },
          { label: 'Egress', key: 'hasEgress' },
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
      subscriptionsReversed: [],
      codeOutput: null,
      zonesWithIngress: new Set(),
    }
  },
  computed: {
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
      const { zoneInsight = {}, name } = entity
      let zoneCpVersion = '-'
      let backend = ''
      let cpCompat = true

      if (zoneInsight.subscriptions && zoneInsight.subscriptions.length) {
        zoneInsight.subscriptions.forEach((item, index) => {
          if (item.version && item.version.kumaCp) {
            zoneCpVersion = item.version.kumaCp.version
            const { kumaCpGlobalCompatible = true } = item.version.kumaCp

            cpCompat = kumaCpGlobalCompatible
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
        hasIngress: this.zonesWithIngress.has(name) ? 'Yes' : 'No',
        hasEgress: this.zonesWithEgress.has(name) ? 'Yes' : 'No',
        withWarnings: !cpCompat,
      }
    },
    calculateZonesWithIngress(zoneIngresses) {
      const zones = new Set()

      zoneIngresses.forEach(({ zoneIngress: { zone } }) => {
        zones.add(zone)
      })

      this.zonesWithIngress = zones
    },
    calculateZonesWithEgress(zoneEgresses) {
      const zones = new Set()

      zoneEgresses.forEach(({ zoneEgress: { zone } }) => {
        zones.add(zone)
      })

      this.zonesWithEgress = zones
    },
    async loadData(offset = '0') {
      this.isLoading = true
      this.isEmpty = false

      const query = this.$route.query.ns || null

      try {
        const [{ data, next }, { items: zoneIngresses }, { items: zoneEgresses }] = await Promise.all([
          getTableData({
            getSingleEntity: Kuma.getZoneOverview.bind(Kuma),
            getAllEntities: Kuma.getAllZoneOverviews.bind(Kuma),
            size: this.pageSize,
            offset,
            query,
          }),
          fetchAllResources({
            callEndpoint: Kuma.getAllZoneIngressOverviews.bind(Kuma),
          }),
          fetchAllResources({
            callEndpoint: Kuma.getAllZoneEgressOverviews.bind(Kuma),
          }),
        ])

        // set pagination
        this.next = next

        // set table data
        if (data.length) {
          this.calculateZonesWithIngress(zoneIngresses)
          this.calculateZonesWithEgress(zoneEgresses)
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
          const response = await Kuma.getZoneOverview({ name: entity.name })
          const subscriptions = get(response, 'zoneInsight.subscriptions', [])

          this.entity = { ...getSome(response, selected), 'Authentication Type': getZoneDpServerAuthType(response) }
          this.subscriptionsReversed = Array.from(subscriptions).reverse()

          if (subscriptions.length) {
            const { version = {} } = subscriptions[subscriptions.length - 1]
            const { kumaCp = {} } = version

            const kumaCpVersion = kumaCp.version || '-'
            const { kumaCpGlobalCompatible = true } = kumaCp

            if (!kumaCpGlobalCompatible) {
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

          this.entity = {}
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
