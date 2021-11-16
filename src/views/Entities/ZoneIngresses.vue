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
        :table-data-is-empty="tableDataIsEmpty"
        :show-warnings="tableData.data.some((item) => item.withWarnings)"
        :next="next"
        @tableAction="tableAction"
        @loadData="loadData($event)"
      />
      <Tabs
        v-if="isEmpty === false"
        :has-error="hasError"
        :is-loading="isLoading"
        :tabs="tabs"
        initial-tab-override="overview"
      >
        <template v-slot:tabHeader>
          <h3 v-if="entity">
            Zone Ingress: {{ entity.name }}
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
                  v-for="(value, key) in zoneIngressInsightSubscriptionsReversed"
                  :key="key"
                >
                  <template v-slot:accordion-header>
                    <ZoneInsightSubscriptionHeader :details="value" />
                  </template>

                  <template v-slot:accordion-content>
                    <ZoneInsightSubscriptionDetails :details="value" />
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
import Tabs from '@/components/Utils/Tabs'
import LabelList from '@/components/Utils/LabelList'

import { getItemStatusFromInsight } from '@/dataplane'
import { PAGE_SIZE_DEFAULT } from '@/consts'

import Accordion from '@/components/Accordion/Accordion'
import AccordionItem from '@/components/Accordion/AccordionItem'

import ZoneInsightSubscriptionDetails from './components/ZoneInsightSubscriptionDetails'
import ZoneInsightSubscriptionHeader from './components/ZoneInsightSubscriptionHeader'
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
    ZoneInsightSubscriptionDetails,
    ZoneInsightSubscriptionHeader,
    MultizoneInfo,
  },

  metaInfo: {
    title: 'ZoneIngresses',
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
      pageSize: PAGE_SIZE_DEFAULT,
      next: null,
      zoneIngressInsightSubscriptionsReversed: [],
    }
  },
  computed: {
    ...mapGetters({
      multicluster: 'config/getMulticlusterStatus',
    }),
    pageTitle() {
      return this.$route.meta.title
    },
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

      try {
        const { data, next } = await getTableData({
          getAllEntities: Kuma.getAllZoneIngressOverviews.bind(Kuma),
          size: this.pageSize,
          offset,
        })

        // set pagination
        this.next = next

        // set table data
        if (data.length) {
          this.tableData.data = data.map((item) => {
            const { zoneIngressInsight = {} } = item

            return { ...item, ...getItemStatusFromInsight(zoneIngressInsight) }
          })
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

        try {
          // get the ZoneIngress details from the ZoneIngress Insights endpoint
          const response = await Kuma.getZoneIngressOverview({ name: entity.name })

          const subscriptions = get(response, 'zoneIngressInsight.subscriptions', [])

          this.zoneIngressInsightSubscriptionsReversed = Array.from(subscriptions).reverse()

          this.entity = getSome(response, selected)
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
