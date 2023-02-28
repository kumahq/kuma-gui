<template>
  <div class="zoneegresses">
    <FrameSkeleton>
      <DataOverview
        :selected-entity-name="entity?.name"
        :page-size="PAGE_SIZE_DEFAULT"
        :is-loading="isLoading"
        :error="error"
        :empty-state="EMPTY_STATE"
        :table-data="tableData"
        :table-data-is-empty="isEmpty"
        :next="nextUrl"
        :page-offset="pageOffset"
        @table-action="getEntity"
        @load-data="loadData"
      >
        <template #additionalControls>
          <KButton
            v-if="$route.query.ns"
            class="back-button"
            appearance="primary"
            icon="arrowLeft"
            :to="{ name: 'zoneegresses' }"
          >
            View all
          </KButton>
        </template>
      </DataOverview>

      <TabsWidget
        v-if="isEmpty === false && entity !== null"
        :has-error="error !== null"
        :is-loading="isLoading"
        :tabs="TABS"
      >
        <template #tabHeader>
          <h1 class="entity-heading">
            Zone Egress: {{ entity.name }}
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

<script lang="ts" setup>
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { KButton, KCard } from '@kong/kongponents'

import { getItemStatusFromInsight } from '@/utilities/dataplane'
import { getSome } from '@/utilities/helpers'
import { TableHeader, ZoneEgressOverview } from '@/types/index.d'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { QueryParameter } from '@/utilities/QueryParameter'
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import EnvoyData from '@/app/common/EnvoyData.vue'
import FrameSkeleton from '@/app/common/FrameSkeleton.vue'
import LabelList from '@/app/common/LabelList.vue'
import SubscriptionDetails from '@/app/common/subscriptions/SubscriptionDetails.vue'
import SubscriptionHeader from '@/app/common/subscriptions/SubscriptionHeader.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()

const EMPTY_STATE = {
  title: 'No Data',
  message: 'There are no Zone Egresses present.',
}

const TABS = [
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
]

const route = useRoute()

const props = defineProps({
  selectedZoneEgressName: {
    type: String,
    required: false,
    default: null,
  },

  offset: {
    type: Number,
    required: false,
    default: 0,
  },
})

const isLoading = ref(true)
const isEmpty = ref(false)
const error = ref<Error | null>(null)
const tableData = ref<{ headers: TableHeader[], data: any[] }>({
  headers: [
    { label: 'Actions', key: 'actions', hideLabel: true },
    { label: 'Status', key: 'status' },
    { label: 'Name', key: 'name' },
  ],
  data: [],
})
const entity = ref<{ type: string, name: string } | null>(null)
const rawData = ref<ZoneEgressOverview[]>([])
const nextUrl = ref<string | null>(null)
const subscriptionsReversed = ref<any[]>([])
const pageOffset = ref(props.offset)

watch(() => route.params.mesh, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name !== 'zoneegresses') {
    return
  }

  // Ensures basic state is reset when switching meshes using the mesh selector.
  isLoading.value = true
  isEmpty.value = false
  error.value = null

  loadData(0)
})

onBeforeMount(function () {
  loadData(props.offset)
})

async function loadData(offset: number): Promise<void> {
  pageOffset.value = offset
  // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
  QueryParameter.set('offset', offset > 0 ? offset : null)

  isLoading.value = true
  isEmpty.value = false

  const name = route.query.ns as string || null
  const size = PAGE_SIZE_DEFAULT

  try {
    const { data, next } = await getZoneEgressOverviews(name, size, offset)

    // set pagination
    nextUrl.value = next

    // set table data
    if (data.length) {
      isEmpty.value = false
      rawData.value = data
      getEntity({ name: props.selectedZoneEgressName ?? data[0].name })

      tableData.value.data = data.map((zoneEgressOverview) => {
        const status = getItemStatusFromInsight(zoneEgressOverview.zoneEgressInsight ?? {})

        return { ...zoneEgressOverview, status }
      })
    } else {
      tableData.value.data = []
      isEmpty.value = true
    }
  } catch (err) {
    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }

    isEmpty.value = true
  } finally {
    isLoading.value = false
  }
}

function getEntity({ name }: { name: string }): void {
  const item = rawData.value.find((data) => data.name === name)

  const subscriptions = item?.zoneEgressInsight?.subscriptions ?? []

  subscriptionsReversed.value = Array.from(subscriptions).reverse()

  entity.value = getSome(item, ['type', 'name'])
  QueryParameter.set('zoneEgress', name)
}

async function getZoneEgressOverviews(name: string | null, size: number, offset: number): Promise<{ data: ZoneEgressOverview[], next: string | null }> {
  if (name) {
    const zoneEgressOverview = await kumaApi.getZoneEgressOverview({ name }, { size, offset })

    return {
      data: [zoneEgressOverview],
      next: null,
    }
  } else {
    const { items, next } = await kumaApi.getAllZoneEgressOverviews({ size, offset })

    return {
      data: items ?? [],
      next,
    }
  }
}
</script>
