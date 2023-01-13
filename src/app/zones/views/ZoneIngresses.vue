<template>
  <div class="zoneingresses">
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
        :table-data-is-empty="isEmpty"
        :next="next"
        :page-offset="pageOffset"
        @table-action="tableAction"
        @load-data="loadData"
      >
        <template #additionalControls>
          <KButton
            v-if="$route.query.ns"
            class="back-button"
            appearance="primary"
            icon="arrowLeft"
            :to="{ name: 'zoneingresses' }"
          >
            View all
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
          <h1 class="entity-heading">
            Zone Ingress: {{ entity.name }}
          </h1>
        </template>
        <template #overview>
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
            :zone-ingress-name="entity.name"
            query-key="envoy-data-zone-ingress"
          />
        </template>

        <template #envoy-stats>
          <EnvoyData
            data-path="stats"
            :zone-ingress-name="entity.name"
            query-key="envoy-data-zone-ingress"
          />
        </template>

        <template #envoy-clusters>
          <EnvoyData
            data-path="clusters"
            :zone-ingress-name="entity.name"
            query-key="envoy-data-zone-ingress"
          />
        </template>
      </TabsWidget>
    </FrameSkeleton>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { KButton, KCard } from '@kong/kongponents'

import { getItemStatusFromInsight } from '@/utilities/dataplane'
import { getSome } from '@/utilities/helpers'
import { kumaApi } from '@/api/kumaApi'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { QueryParameter } from '@/utilities/QueryParameter'
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import EnvoyData from '@/app/common/EnvoyData.vue'
import FrameSkeleton from '@/app/common/FrameSkeleton.vue'
import LabelList from '@/app/common/LabelList.vue'
import MultizoneInfo from '../components/MultizoneInfo.vue'
import SubscriptionDetails from '@/app/common/subscriptions/SubscriptionDetails.vue'
import SubscriptionHeader from '@/app/common/subscriptions/SubscriptionHeader.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'

export default {
  name: 'ZoneIngresses',

  components: {
    AccordionItem,
    AccordionList,
    DataOverview,
    EnvoyData,
    FrameSkeleton,
    LabelList,
    MultizoneInfo,
    SubscriptionDetails,
    SubscriptionHeader,
    TabsWidget,
    KButton,
    KCard,
  },

  props: {
    selectedZoneIngressName: {
      type: String,
      required: false,
      default: null,
    },

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

  computed: {
    ...mapGetters({
      multicluster: 'config/getMulticlusterStatus',
    }),
  },

  watch: {
    $route() {
      // Ensures basic state is reset when switching meshes using the mesh selector.
      this.isLoading = true
      this.isEmpty = false
      this.error = null

      this.init(0)
    },
  },

  beforeMount() {
    this.init(this.offset)
  },

  methods: {
    init(offset) {
      if (this.multicluster) {
        this.loadData(offset)
      }
    },
    tableAction(ev) {
      const data = ev

      // load the data into the tabs
      this.getEntity(data)
    },

    async loadData(offset) {
      this.pageOffset = offset
      // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
      QueryParameter.set('offset', offset > 0 ? offset : null)

      this.isLoading = true
      this.isEmpty = false

      const name = this.$route.query.ns || null
      const size = this.pageSize

      try {
        const { data, next } = await this.getZoneIngressOverviews(name, size, offset)

        // set pagination
        this.next = next

        // set table data
        if (data.length) {
          this.isEmpty = false
          this.rawData = data
          this.getEntity({ name: this.selectedZoneIngressName ?? data[0].name })

          this.tableData.data = data.map((item) => {
            const { zoneIngressInsight = {} } = item
            const status = getItemStatusFromInsight(zoneIngressInsight)

            return { ...item, status }
          })
        } else {
          this.tableData.data = []
          this.isEmpty = true
        }
      } catch (err) {
        if (err instanceof Error) {
          this.error = err
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

      const subscriptions = item?.zoneIngressInsight?.subscriptions ?? []

      this.subscriptionsReversed = Array.from(subscriptions).reverse()

      this.entity = getSome(item, selected)
      QueryParameter.set('zoneIngress', this.entity.name)
    },

    /**
     * @param {string | null} name
     * @param {number} size
     * @param {number} offset
     * @returns {Promise<{ data: ZoneIngressOverview[], next: string | null }>}
     */
    async getZoneIngressOverviews(name, size, offset) {
      if (name) {
        const zoneIngressOverview = await kumaApi.getZoneIngressOverview({ name }, { size, offset })

        return {
          data: [zoneIngressOverview],
          next: null,
        }
      } else {
        const { items, next } = await kumaApi.getAllZoneIngressOverviews({ size, offset })

        return {
          data: items ?? [],
          next,
        }
      }
    },
  },
}
</script>
