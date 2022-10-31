<template>
  <div class="zones">
    <MultizoneInfo v-if="multicluster === false" />

    <!-- Zone CPs information for when Multicluster is enabled -->
    <FrameSkeleton v-else>
      <DataOverview
        :selected-entity-name="entity?.name"
        :page-size="pageSize"
        :is-loading="isLoading"
        :error="error"
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
        :has-error="error"
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
                id="code-block-zone-config"
                language="json"
                :code="codeOutput"
                is-searchable
                query-key="zone-config"
              />
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

import { fetchAllResources, getSome, getZoneDpServerAuthType } from '@/utilities/helpers'
import { getItemStatusFromInsight, INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS } from '@/utilities/dataplane'
import { getTableData } from '@/utilities/tableDataUtils'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { kumaApi } from '@/api/kumaApi'
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import CodeBlock from '@/app/common/CodeBlock.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import EntityURLControl from '@/app/common/EntityURLControl.vue'
import FrameSkeleton from '@/app/common/FrameSkeleton.vue'
import LabelList from '@/app/common/LabelList.vue'
import MultizoneInfo from '../components/MultizoneInfo.vue'
import SubscriptionDetails from '@/app/common/subscriptions/SubscriptionDetails.vue'
import SubscriptionHeader from '@/app/common/subscriptions/SubscriptionHeader.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import WarningsWidget from '@/app/common/warnings/WarningsWidget.vue'

export default {
  name: 'ZonesView',

  components: {
    AccordionItem,
    AccordionList,
    CodeBlock,
    DataOverview,
    EntityURLControl,
    FrameSkeleton,
    LabelList,
    MultizoneInfo,
    SubscriptionDetails,
    SubscriptionHeader,
    TabsWidget,
    WarningsWidget,
  },

  data() {
    return {
      isLoading: true,
      isEmpty: false,
      error: null,
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
          { label: 'Storage type', key: 'storeType' },
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
      // Ensures basic state is reset when switching meshes using the mesh selector.
      this.isLoading = true
      this.isEmpty = false
      this.error = null
      this.entityIsLoading = true
      this.entityIsEmpty = false
      this.entityHasError = false
      this.tableDataIsEmpty = false

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
      let storeType = ''
      let cpCompat = true

      if (zoneInsight.subscriptions && zoneInsight.subscriptions.length) {
        zoneInsight.subscriptions.forEach((item) => {
          if (item.version && item.version.kumaCp) {
            zoneCpVersion = item.version.kumaCp.version
            const { kumaCpGlobalCompatible = true } = item.version.kumaCp

            cpCompat = kumaCpGlobalCompatible
            if (item.config) {
              storeType = JSON.parse(item.config).store.type
            }
          }
        })
      }

      return {
        ...entity,
        status: getItemStatusFromInsight(zoneInsight).status,
        zoneCpVersion,
        storeType,
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
            getSingleEntity: kumaApi.getZoneOverview.bind(kumaApi),
            getAllEntities: kumaApi.getAllZoneOverviews.bind(kumaApi),
            size: this.pageSize,
            offset,
            query,
          }),
          fetchAllResources({
            callEndpoint: kumaApi.getAllZoneIngressOverviews.bind(kumaApi),
          }),
          fetchAllResources({
            callEndpoint: kumaApi.getAllZoneEgressOverviews.bind(kumaApi),
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
      } catch (err) {
        if (err instanceof Error) {
          error.value = err
        } else {
          console.error(err)
        }

        this.isEmpty = true
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
      }, import.meta.env.VITE_DATA_TIMEOUT)

      if (entity) {
        this.entityIsEmpty = false
        this.warnings = []

        try {
          // get the Zone details from the Zone Insights endpoint
          const response = await kumaApi.getZoneOverview({ name: entity.name })
          const subscriptions = response.zoneInsight?.subscriptions ?? []

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
