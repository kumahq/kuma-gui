<template>
  <div class="zoneegresses">
    <DataOverview
      :page-size="pageSize"
      :has-error="hasError"
      :is-loading="isLoading"
      :empty-state="empty_state"
      :table-data="tableData"
      :table-data-is-empty="isEmpty"
      :next="next"
      @tableAction="tableAction"
      @loadData="loadData($event)"
    >
      <template #additionalControls>
        <KButton
          v-if="$route.query.ns"
          class="back-button"
          appearance="primary"
          size="small"
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
        <XdsConfiguration
          :zone-egress-name="entity.name"
        />
      </template>
      <template #envoy-stats>
        <EnvoyStats
          :zone-egress-name="entity.name"
        />
      </template>
      <template #envoy-clusters>
        <EnvoyClusters
          :zone-egress-name="entity.name"
        />
      </template>
    </TabsWidget>
  </div>
</template>

<script>
import get from 'lodash/get'

import SubscriptionDetails from './components/SubscriptionDetails'
import SubscriptionHeader from './components/SubscriptionHeader'
import { getTableData } from '@/utils/tableDataUtils'
import { getSome } from '@/helpers'
import Kuma from '@/services/kuma'
import DataOverview from '@/components/Skeletons/DataOverview'
import EntityURLControl from '@/components/Utils/EntityURLControl'
import TabsWidget from '@/components/Utils/TabsWidget.vue'
import LabelList from '@/components/Utils/LabelList'
import XdsConfiguration from '@/components/XdsConfiguration/XdsConfiguration'

import { getItemStatusFromInsight } from '@/dataplane'
import { PAGE_SIZE_DEFAULT } from '@/consts'

import AccordionList from '@/components/Accordion/AccordionList.vue'
import AccordionItem from '@/components/Accordion/AccordionItem.vue'

import EnvoyStats from '@/components/EnvoyStats/EnvoyStats.vue'
import EnvoyClusters from '@/components/EnvoyClusters/EnvoyClusters.vue'

export default {
  name: 'ZoneEgresses',
  components: {
    EnvoyClusters,
    EnvoyStats,
    DataOverview,
    TabsWidget,
    LabelList,
    AccordionList,
    AccordionItem,
    SubscriptionDetails,
    SubscriptionHeader,
    EntityURLControl,
    XdsConfiguration
  },

  metaInfo: {
    title: 'ZoneEgresses',
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

      const subscriptions = get(item, 'zoneEgressInsight.subscriptions', [])

      this.subscriptionsReversed = Array.from(subscriptions).reverse()

      this.entity = getSome(item, selected)
    },
  },
}
</script>
