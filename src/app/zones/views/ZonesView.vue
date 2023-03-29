<template>
  <div class="zones">
    <MultizoneInfo v-if="store.getters['config/getMulticlusterStatus'] === false" />

    <div
      v-else
      class="kcard-stack"
    >
      <div class="kcard-border">
        <DataOverview
          :selected-entity-name="entity?.name"
          :page-size="PAGE_SIZE_DEFAULT"
          :is-loading="isLoading"
          :error="error"
          :empty-state="EMPTY_STATE"
          :table-data="tableData"
          :table-data-is-empty="tableDataIsEmpty"
          :show-warnings="tableData.data.some((item) => item.withWarnings)"
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
              :to="{ name: 'zones' }"
            >
              View all
            </KButton>
          </template>
        </DataOverview>
      </div>

      <div class="kcard-border">
        <TabsWidget
          v-if="isEmpty === false && entity !== null"
          :has-error="error !== null"
          :is-loading="isLoading"
          :tabs="filterTabs()"
        >
          <template #tabHeader>
            <h1 class="entity-heading">
              Zone: {{ entity.name }}
            </h1>
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

          <template #config>
            <CodeBlock
              v-if="codeOutput"
              id="code-block-zone-config"
              language="json"
              :code="codeOutput"
              is-searchable
              query-key="zone-config"
            />
          </template>

          <template #warnings>
            <WarningsWidget :warnings="warnings" />
          </template>
        </TabsWidget>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KBadge, KButton } from '@kong/kongponents'
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import MultizoneInfo from '../components/MultizoneInfo.vue'
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import CodeBlock from '@/app/common/CodeBlock.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import LabelList from '@/app/common/LabelList.vue'
import SubscriptionDetails from '@/app/common/subscriptions/SubscriptionDetails.vue'
import SubscriptionHeader from '@/app/common/subscriptions/SubscriptionHeader.vue'
import TabsWidget from '@/app/common/TabsWidget.vue'
import WarningsWidget from '@/app/common/warnings/WarningsWidget.vue'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { useStore } from '@/store/store'
import { KDSSubscription, TableHeader, ZoneCompatibility, ZoneOverview } from '@/types/index.d'
import { useKumaApi } from '@/utilities'
import { getItemStatusFromInsight, INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS } from '@/utilities/dataplane'
import { fetchAllResources, getSome, getZoneDpServerAuthType } from '@/utilities/helpers'
import { QueryParameter } from '@/utilities/QueryParameter'

const kumaApi = useKumaApi()

const EMPTY_STATE = {
  title: 'No Data',
  message: 'There are no Zones present.',
}

const TABS = [
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
]

const route = useRoute()
const store = useStore()

const props = defineProps({
  selectedZoneName: {
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
const entityIsLoading = ref(true)
const entityIsEmpty = ref(false)
const entityHasError = ref(false)
const tableDataIsEmpty = ref(false)
const tableData = ref<{ headers: TableHeader[], data: any[] }>({
  headers: [
    { label: 'Status', key: 'status' },
    { label: 'Name', key: 'name' },
    { label: 'Zone CP Version', key: 'zoneCpVersion' },
    { label: 'Storage type', key: 'storeType' },
    { label: 'Ingress', key: 'hasIngress' },
    { label: 'Egress', key: 'hasEgress' },
    { label: 'Warnings', key: 'warnings', hideLabel: true },
  ],
  data: [],
})
const entity = ref<{ type: string, name: string, status: string, 'Authentication Type': string } | null>(null)
const nextUrl = ref<string | null>(null)
const warnings = ref<ZoneCompatibility[]>([])
const subscriptionsReversed = ref<KDSSubscription[]>([])
const codeOutput = ref<string | null>(null)
const pageOffset = ref(props.offset)
const zonesWithIngress = ref(new Set())
const zonesWithEgress = ref(new Set())

watch(() => route.params.mesh, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name !== 'zones') {
    return
  }

  // Ensures basic state is reset when switching meshes using the mesh selector.
  isLoading.value = true
  isEmpty.value = false
  entityIsLoading.value = true
  entityIsEmpty.value = false
  entityHasError.value = false
  tableDataIsEmpty.value = false
  error.value = null

  init(0)
})

onBeforeMount(function () {
  init(props.offset)
})

function init(offset: number): void {
  if (store.getters['config/getMulticlusterStatus']) {
    loadData(offset)
  }
}

function filterTabs() {
  if (warnings.value.length === 0) {
    return TABS.filter((tab) => tab.hash !== '#warnings')
  }

  return TABS
}

function parseData(zoneOverview: ZoneOverview): any {
  let zoneCpVersion = '-'
  let storeType = ''
  let cpCompat = true

  const subscriptions = zoneOverview.zoneInsight?.subscriptions ?? []

  subscriptions.forEach((item: any) => {
    if (item.version && item.version.kumaCp) {
      zoneCpVersion = item.version.kumaCp.version
      const { kumaCpGlobalCompatible = true } = item.version.kumaCp

      cpCompat = kumaCpGlobalCompatible
      if (item.config) {
        storeType = JSON.parse(item.config).store.type
      }
    }
  })

  const status = getItemStatusFromInsight(zoneOverview.zoneInsight)

  return {
    ...zoneOverview,
    status,
    zoneCpVersion,
    storeType,
    hasIngress: zonesWithIngress.value.has(zoneOverview.name) ? 'Yes' : 'No',
    hasEgress: zonesWithEgress.value.has(zoneOverview.name) ? 'Yes' : 'No',
    withWarnings: !cpCompat,
  }
}

function calculateZonesWithIngress(zoneIngresses: any[]): void {
  const zones = new Set()

  zoneIngresses.forEach(({ zoneIngress: { zone } }) => {
    zones.add(zone)
  })

  zonesWithIngress.value = zones
}

function calculateZonesWithEgress(zoneEgresses: any[]): void {
  const zones = new Set()

  zoneEgresses.forEach(({ zoneEgress: { zone } }) => {
    zones.add(zone)
  })

  zonesWithEgress.value = zones
}

async function loadData(offset: number): Promise<void> {
  pageOffset.value = offset
  // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
  QueryParameter.set('offset', offset > 0 ? offset : null)

  isLoading.value = true
  isEmpty.value = false

  const name = route.query.ns as string || null
  const size = PAGE_SIZE_DEFAULT

  try {
    const [{ data, next }, { items: zoneIngresses }, { items: zoneEgresses }] = await Promise.all([
      getZoneOverviews(name, size, offset),
      fetchAllResources(kumaApi.getAllZoneIngressOverviews.bind(kumaApi)),
      fetchAllResources(kumaApi.getAllZoneEgressOverviews.bind(kumaApi)),
    ])

    // set pagination
    nextUrl.value = next

    // set table data
    if (data.length) {
      calculateZonesWithIngress(zoneIngresses)
      calculateZonesWithEgress(zoneEgresses)
      tableData.value.data = data.map(parseData)
      tableDataIsEmpty.value = false
      isEmpty.value = false

      await getEntity({ name: props.selectedZoneName ?? data[0].name })
    } else {
      tableData.value.data = []
      tableDataIsEmpty.value = true
      isEmpty.value = true
      entityIsEmpty.value = true
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

async function getEntity({ name }: { name: string }): Promise<void> {
  entityHasError.value = false
  entityIsLoading.value = true
  entityIsEmpty.value = false
  warnings.value = []

  try {
    // get the Zone details from the Zone Insights endpoint
    const zoneOverview = await kumaApi.getZoneOverview({ name })
    const subscriptions = zoneOverview.zoneInsight?.subscriptions ?? []
    const status = getItemStatusFromInsight(zoneOverview.zoneInsight)

    entity.value = {
      ...getSome(zoneOverview, ['type', 'name']),
      status,
      'Authentication Type': getZoneDpServerAuthType(zoneOverview),
    }
    QueryParameter.set('zone', name)
    subscriptionsReversed.value = Array.from(subscriptions).reverse()

    if (subscriptions.length > 0) {
      const lastSubscription = subscriptions[subscriptions.length - 1]
      const kumaCpVersion = lastSubscription.version.kumaCp.version || '-'
      const { kumaCpGlobalCompatible = true } = lastSubscription.version.kumaCp

      if (!kumaCpGlobalCompatible) {
        warnings.value.push({
          kind: INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS,
          payload: {
            zoneCpVersion: kumaCpVersion,
            globalCpVersion: store.getters['config/getVersion'],
          },
        })
      }

      if (lastSubscription.config) {
        codeOutput.value = JSON.stringify(JSON.parse(lastSubscription.config), null, 2)
      }
    }
  } catch (err) {
    console.error(err)

    entity.value = null
    entityHasError.value = true
    entityIsEmpty.value = true
  } finally {
    entityIsLoading.value = false
  }
}

async function getZoneOverviews(name: string | null, size: number, offset: number): Promise<{ data: ZoneOverview[], next: string | null }> {
  if (name) {
    const zoneOverview = await kumaApi.getZoneOverview({ name }, { size, offset })

    return {
      data: [zoneOverview],
      next: null,
    }
  } else {
    const { items, next } = await kumaApi.getAllZoneOverviews({ size, offset })

    return {
      data: items ?? [],
      next,
    }
  }
}
</script>
