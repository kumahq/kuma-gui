<template>
  <div class="zoneingresses">
    <MultizoneInfo v-if="multicluster === false" />

    <!-- Zone CPs information for when Multicluster is enabled -->
    <FrameSkeleton v-else>
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
        <template v-slot:additionalControls>
          <KButton
            v-if="$route.query.ns"
            class="back-button"
            appearance="primary"
            size="small"
            :to="{
              name: 'zoneingresses'
            }"
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
        :tabs="tabs"
        initial-tab-override="overview"
      >
        <template v-slot:tabHeader>
          <div>
            <h3> Zone Ingress: {{ entity.name }}</h3>
          </div>
          <div>
            <EntityURLControl :name="entity.name" />
          </div>
        </template>
        <template v-slot:overview>
          <LabelList>
            <div>
              <ul>
                <li
                  v-for="(value, key) in entity"
                  :key="key"
                >
                  <h4>
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
      </Tabs>
    </FrameSkeleton>
  </div>
</template>

<script>
import get from 'lodash/get'
import { mapGetters } from 'vuex'
import { getTableData } from '@/utils/tableDataUtils'
import { getSome } from '@/helpers'
import Kuma from '@/services/kuma'
import FrameSkeleton from '@/components/Skeletons/FrameSkeleton'
import DataOverview from '@/components/Skeletons/DataOverview'
import EntityURLControl from '@/components/Utils/EntityURLControl'
import Tabs from '@/components/Utils/Tabs'
import LabelList from '@/components/Utils/LabelList'

import { getItemStatusFromInsight } from '@/dataplane'
import { PAGE_SIZE_DEFAULT } from '@/consts'

import Accordion from '@/components/Accordion/Accordion'
import AccordionItem from '@/components/Accordion/AccordionItem'

import SubscriptionDetails from './components/SubscriptionDetails'
import SubscriptionHeader from './components/SubscriptionHeader'
import MultizoneInfo from './components/MultizoneInfo'

export default {
  name: 'ZoneIngresses',
  components: {
    FrameSkeleton,
    DataOverview,
    Tabs,
    LabelList,
    Accordion,
    AccordionItem,
    SubscriptionDetails,
    SubscriptionHeader,
    MultizoneInfo,
    EntityURLControl,
  },

  metaInfo: {
    title: 'ZoneIngresses',
  },
  data() {
    return {
      isLoading: true,
      isEmpty: false,
      hasError: false,

      empty_state: {
        title: 'No Data',
        message: 'There are no Zone Ingresses present.',
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
          title: 'Zone Ingress Insights',
        },
      ],
      entity: {},
      rawData: [],
      pageSize: PAGE_SIZE_DEFAULT,
      next: null,
      subscriptionsReversed: [],
    }
  },
  computed: {
    ...mapGetters({
      multicluster: 'config/getMulticlusterStatus',
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
          getAllEntities: Kuma.getAllZoneIngressOverviews.bind(Kuma),
          getSingleEntity: Kuma.getZoneIngressOverview.bind(Kuma),
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
            const { zoneIngressInsight = {} } = item

            return { ...item, ...getItemStatusFromInsight(zoneIngressInsight) }
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

      const subscriptions = get(item, 'zoneIngressInsight.subscriptions', [])

      this.subscriptionsReversed = Array.from(subscriptions).reverse()

      this.entity = getSome(item, selected)
    },
  },
}
</script>
