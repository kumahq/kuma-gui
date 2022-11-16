<template>
  <div class="zoneegresses">
    <FrameSkeleton>
      <DataOverview
        :selected-entity-name="entity?.name"
        :page-size="pageSize"
        :is-loading="isLoading"
        :error="error"
        :empty-state="empty_state"
        :table-data="tableData"
        :table-data-is-empty="isEmpty"
        :next="next"
        :page-offset="pageOffset"
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
        :has-error="error !== null"
        :is-loading="isLoading"
        :tabs="tabs"
        initial-tab-override="overview"
      >
        <template #tabHeader>
          <div>
            <h3> Zone Egress: {{ entity.name }}</h3>
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
import { KButton, KCard } from '@kong/kongponents'

import { getItemStatusFromInsight } from '@/utilities/dataplane'
import { getSome } from '@/utilities/helpers'
import { getTableData } from '@/utilities/tableDataUtils'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { kumaApi } from '@/api/kumaApi'
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import EnvoyData from '@/app/common/EnvoyData.vue'
import FrameSkeleton from '@/app/common/FrameSkeleton.vue'
import LabelList from '@/app/common/LabelList.vue'
import SubscriptionDetails from '@/app/common/subscriptions/SubscriptionDetails.vue'
import SubscriptionHeader from '@/app/common/subscriptions/SubscriptionHeader.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import { patchQueryParam } from '@/utilities/patchQueryParam'

export default {
  name: 'ZoneEgresses',

  components: {
    AccordionItem,
    AccordionList,
    DataOverview,
    EnvoyData,
    FrameSkeleton,
    LabelList,
    SubscriptionDetails,
    SubscriptionHeader,
    TabsWidget,
    KButton,
    KCard,
  },

  props: {
    offset: {
      type: Number,
      required: false,
      default: 0,
    },
  },

  data() {
    return {
      isLoading: true,
      isEmpty: false,
      error: null,

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
      pageOffset: this.offset,
    }
  },

  watch: {
    $route() {
      // Ensures basic state is reset when switching meshes using the mesh selector.
      this.isLoading = true
      this.isEmpty = false
      this.error = null

      this.loadData(0)
    },
  },

  beforeMount() {
    this.loadData(this.offset)
  },

  methods: {
    tableAction(ev) {
      const data = ev

      // load the data into the tabs
      this.getEntity(data)
    },

    async loadData(offset) {
      this.pageOffset = offset
      // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
      patchQueryParam('offset', offset > 0 ? offset : null)

      this.isLoading = true
      this.isEmpty = false

      const query = this.$route.query.ns || null

      try {
        const { data, next } = await getTableData({
          getAllEntities: kumaApi.getAllZoneEgressOverviews.bind(kumaApi),
          getSingleEntity: kumaApi.getZoneEgressOverview.bind(kumaApi),
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
