<template>
  <div class="zoneegresses">
    <FrameSkeleton>
      <DataOverview
        :page-size="pageSize"
        :has-error="hasError"
        :is-loading="isLoading"
        :empty-state="empty_state"
        :table-data="tableData"
        :table-data-is-empty="isEmpty"
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
              name: 'zoneegresses'
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
        :tabs="tabs"
        initial-tab-override="overview"
      >
        <template #tabHeader>
          <div>
            <h3> Zone Egress: {{ entity.name }}</h3>
          </div>
          <div>
            <EntityURLControl :name="entity.name" />
          </div>
        </template>
        <template #overview>
          <LabelList>
            <div>
              <ul>
                <li
                  v-for="(value, key) in entity"
                  :key="key"
                >
                  <h4 v-if="value">
                    {{ key }}
                  </h4>
                  <p>
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
                    <SubscriptionDetails
                      :details="value"
                      is-discovery-subscription
                    />
                  </template>
                </AccordionItem>
              </AccordionList>
            </template>
          </KCard>
        </template>

        <template #xds-configuration>
          <EnvoyData
            data-path="xds"
            :zone-egress-name="entity.name"
            query-key="envoy-data-zone-egress"
          />
        </template>

        <template #envoy-stats>
          <EnvoyData
            data-path="stats"
            :zone-egress-name="entity.name"
            query-key="envoy-data-zone-egress"
          />
        </template>

        <template #envoy-clusters>
          <EnvoyData
            data-path="clusters"
            :zone-egress-name="entity.name"
            query-key="envoy-data-zone-egress"
          />
        </template>
      </TabsWidget>
    </FrameSkeleton>
  </div>
</template>

<script>
import SubscriptionDetails from './components/SubscriptionDetails.vue'
import SubscriptionHeader from './components/SubscriptionHeader.vue'
import { getTableData } from '@/utils/tableDataUtils'
import { getSome } from '@/helpers'
import Kuma from '@/services/kuma'
import DataOverview from '@/components/Skeletons/DataOverview.vue'
import EntityURLControl from '@/components/Utils/EntityURLControl.vue'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton.vue'
import TabsWidget from '@/components/Utils/TabsWidget.vue'
import LabelList from '@/components/Utils/LabelList.vue'

import { getItemStatusFromInsight } from '@/dataplane'
import { PAGE_SIZE_DEFAULT } from '@/consts'

import AccordionList from '@/components/Accordion/AccordionList.vue'
import AccordionItem from '@/components/Accordion/AccordionItem.vue'

import EnvoyData from '@/components/EnvoyData/EnvoyData.vue'

export default {
  name: 'ZoneEgresses',
  components: {
    EnvoyData,
    FrameSkeleton,
    DataOverview,
    TabsWidget,
    LabelList,
    AccordionList,
    AccordionItem,
    SubscriptionDetails,
    SubscriptionHeader,
    EntityURLControl,
  },

  data() {
    return {
      isLoading: true,
      isEmpty: false,
      hasError: false,

      empty_state: {
        title: 'No Data',
        message: 'There are no Zone Egresses present.',
      },
      tableData: {
        headers: [
          { key: 'actions', hideLabel: true },
          { label: 'Status', key: 'status' },
          { label: 'Name', key: 'name' },
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
          title: 'Zone Egress Insights',
        },
        {
          hash: '#xds-configuration',
          title: 'XDS Configuration',
        },
        {
          hash: '#envoy-stats',
          title: 'Stats',
        },
        {
          hash: '#envoy-clusters',
          title: 'Clusters',
        },
      ],
      entity: {},
      rawData: [],
      pageSize: PAGE_SIZE_DEFAULT,
      next: null,
      subscriptionsReversed: [],
    }
  },
  watch: {
    $route() {
      // Ensures basic state is reset when switching meshes using the mesh selector.
      this.isLoading = true
      this.isEmpty = false
      this.hasError = false

      this.init()
    },
  },
  beforeMount() {
    this.init()
  },
  methods: {
    init() {
      this.loadData()
    },
    tableAction(ev) {
      const data = ev

      // load the data into the tabs
      this.getEntity(data)
    },

    async loadData(offset = '0') {
      this.isLoading = true
      this.isEmpty = false

      const query = this.$route.query.ns || null

      try {
        const { data, next } = await getTableData({
          getAllEntities: Kuma.getAllZoneEgressOverviews.bind(Kuma),
          getSingleEntity: Kuma.getZoneEgressOverview.bind(Kuma),
          size: this.pageSize,
          offset,
          query,
        })

        // set pagination
        this.next = next

        // set table data
        if (data.length) {
          this.isEmpty = false
          this.rawData = data
          this.getEntity({ name: data[0].name })

          this.tableData.data = data.map((item) => {
            const { zoneEgressInsight = {} } = item

            return { ...item, ...getItemStatusFromInsight(zoneEgressInsight) }
          })
        } else {
          this.tableData.data = []
          this.isEmpty = true
        }
      } catch (error) {
        this.hasError = true
        this.isEmpty = true

        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    getEntity(entity) {
      const selected = ['type', 'name']
      const item = this.rawData.find((data) => data.name === entity.name)

      const subscriptions = item?.zoneEgressInsight?.subscriptions ?? []

      this.subscriptionsReversed = Array.from(subscriptions).reverse()

      this.entity = getSome(item, selected)
    },
  },
}
</script>
