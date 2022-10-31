<template>
  <ContentWrapper>
    <template #content>
      <DataOverview
        :selected-entity-name="dataPlaneOverview?.name"
        :page-size="PAGE_SIZE"
        :is-loading="isLoading"
        :error="error"
        :empty-state="getEmptyState()"
        :table-data="filteredTableData"
        :table-data-is-empty="tableDataIsEmpty"
        show-details
        :next="nextUrl !== null"
        :page-offset="pageOffset"
        @table-action="($event: any) => selectDataPlaneOverview($event.name)"
        @load-data="loadData($event)"
      >
        <template #additionalControls>
          <div>
            <label
              for="data-planes-type-filter"
              class="mr-2"
            >
              Type:
            </label>

            <select
              id="data-planes-type-filter"
              v-model="filteredDataPlaneType"
              data-testid="data-planes-type-filter"
            >
              <option
                v-for="(dataPlaneType, key) in dataPlaneTypes"
                :key="key"
                :value="dataPlaneType"
              >
                {{ dataPlaneType }}
              </option>
            </select>
          </div>

          <KDropdownMenu
            label="Columns"
            icon="cogwheel"
            button-appearance="outline"
          >
            <template #items>
              <div @click="stopPropagatingClickEvent">
                <KDropdownItem
                  v-for="(item, index) in filteredColumnsDropdownItems"
                  :key="index"
                  class="table-header-selector-item"
                  :item="item"
                >
                  <label
                    :for="`data-plane-table-header-checkbox-${index}`"
                    class="k-checkbox table-header-selector-item-checkbox"
                  >
                    <input
                      :id="`data-plane-table-header-checkbox-${index}`"
                      :checked="item.isChecked"
                      type="checkbox"
                      class="k-input"
                      @change="(event: Event) => updateVisibleTableHeaders(event, item.tableHeaderKey)"
                    >

                    {{ item.label }}
                  </label>
                </KDropdownItem>
              </div>
            </template>
          </KDropdownMenu>

          <KButton
            class="add-dp-button"
            appearance="primary"
            :to="dataplaneWizardRoute"
            data-testid="data-plane-create-data-plane-button"
            @click="onCreateClick"
          >
            <span class="custom-control-icon">
              +
            </span>

            Create data plane proxy
          </KButton>

          <KButton
            v-if="route.query.ns"
            appearance="primary"
            :to="{ name: 'data-plane-list-view' }"
            data-testid="data-plane-ns-back-button"
          >
            <span class="custom-control-icon">
              ←
            </span>

            View All
          </KButton>
        </template>
      </DataOverview>
    </template>

    <template #sidebar>
      <DataPlaneEntitySummary
        v-if="dataPlaneOverview !== null"
        :data-plane-overview="dataPlaneOverview"
      />

      <EmptyBlock v-else />
    </template>
  </ContentWrapper>
</template>

<script lang="ts" setup>
/** @typedef {import('../constants').ColumnDropdownItem} ColumnDropdownItem */
/** @typedef {import('@/types/index.d').DataplaneOverview} DataplaneOverview */
/** @typedef {import('@/types/index.d').ZoneOverview} ZoneOverview */

import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { datadogLogs } from '@datadog/browser-logs'
import { KButton, KDropdownItem, KDropdownMenu } from '@kong/kongponents'

import ContentWrapper from '@/app/common/ContentWrapper.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import DataPlaneEntitySummary from '@/app/data-planes/components/DataPlaneEntitySummary.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import { columnsDropdownItems, defaultVisibleTableHeaderKeys, getDataPlaneTableHeaders } from '../constants'
import { useStore } from '@/store/store'
import { ClientStorage } from '@/utilities/ClientStorage'
import { patchQueryParam } from '@/utilities/patchQueryParam'
import { kumaApi } from '@/api/kumaApi'
import { humanReadableDate } from '@/utilities/helpers'
import { datadogLogEvents } from '@/utilities/datadogLogEvents'
import {
  compatibilityKind,
  dpTags,
  getDataplaneType,
  getStatus,
  COMPATIBLE,
  INCOMPATIBLE_UNSUPPORTED_ENVOY,
  INCOMPATIBLE_UNSUPPORTED_KUMA_DP,
  INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS,
} from '@/utilities/dataplane'
import { DataPlaneOverview, TableHeader } from '@/types/index.d'
import { KUMA_ZONE_TAG_NAME } from '@/constants'

const PAGE_SIZE = 50
const dataPlaneTypes = [
  'All',
  'Standard',
  'Gateway (builtin)',
  'Gateway (provided)',
]

const route = useRoute()
const store = useStore()

const props = defineProps({
  name: {
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

const visibleTableHeaderKeys = ref(defaultVisibleTableHeaderKeys)
const isLoading = ref(true)
const isEmpty = ref(false)
const error = ref<Error | null>(null)
const tableDataIsEmpty = ref(false)
const tableData = ref<{ headers: TableHeader[], data: any }>({
  headers: [],
  data: [],
})
const rawData = ref<DataPlaneOverview[]>([])
const nextUrl = ref<string | null>(null)
const filteredDataPlaneType = ref('All')
const pageOffset = ref(props.offset)
const dataPlaneOverview = ref<DataPlaneOverview | null>(null)

const environment = computed(() => store.getters['config/getEnvironment'])
const multicluster = computed(() => store.getters['config/getMulticlusterStatus'])
const dataplaneWizardRoute = computed(() => {
  // we change the route to the Dataplane
  // wizard based on environment.
  if (environment.value === 'universal') {
    return { name: 'universal-dataplane' }
  } else {
    return { name: 'kubernetes-dataplane' }
  }
})
const filteredTableData = computed(() => {
  const data = tableData.value.data.filter((row: any) => {
    if (filteredDataPlaneType.value === 'All') {
      return true
    } else {
      return row.type.toLowerCase() === filteredDataPlaneType.value.toLowerCase()
    }
  })
  const headers = getDataPlaneTableHeaders(multicluster.value, visibleTableHeaderKeys.value)

  return {
    data,
    headers,
  }
})
/**
 * @type {ColumnDropdownItem[]}
 */
const filteredColumnsDropdownItems = computed(() => {
  return columnsDropdownItems
    .filter((item) => multicluster.value ? true : item.tableHeaderKey !== 'zone')
    .map((item) => {
      const isChecked = visibleTableHeaderKeys.value.includes(item.tableHeaderKey)

      return {
        ...item,
        isChecked,
      }
    })
})

watch(() => route.params.mesh, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name !== 'data-plane-list-view') {
    return
  }

  // Ensures basic state is reset when switching meshes using the mesh selector.
  isLoading.value = true
  isEmpty.value = false
  error.value = null
  tableDataIsEmpty.value = false

  loadData(0)
})

const storedVisibleTableHeaderKeys = ClientStorage.get('dpVisibleTableHeaderKeys')
if (Array.isArray(storedVisibleTableHeaderKeys)) {
  visibleTableHeaderKeys.value = storedVisibleTableHeaderKeys
}

loadData(props.offset)

/**
 * Ensures that the dropdown menu isn’t toggled whenever a checkbox is checked/unchecked.
 */
function stopPropagatingClickEvent(event: MouseEvent): void {
  event.stopPropagation()
}

function updateVisibleTableHeaders(event: Event, tableHeaderKey: string): void {
  const input = event.target as HTMLInputElement
  const index = visibleTableHeaderKeys.value.findIndex((key) => key === tableHeaderKey)

  if (input.checked && index === -1) {
    visibleTableHeaderKeys.value.push(tableHeaderKey)
  } else if (!input.checked && index > -1) {
    visibleTableHeaderKeys.value.splice(index, 1)
  }

  ClientStorage.set('dpVisibleTableHeaderKeys', Array.from(new Set(visibleTableHeaderKeys.value)))
}

function onCreateClick() {
  datadogLogs.logger.info(datadogLogEvents.CREATE_DATA_PLANE_PROXY_CLICKED)
}

function getEmptyState() {
  return {
    title: 'No Data',
    message: 'There are no data plane proxies present.',
  }
}

async function parseData(dataPlaneOverview: DataPlaneOverview) {
  const mesh = dataPlaneOverview.mesh
  const name = dataPlaneOverview.name

  const nameRoute = {
    name: 'data-plane-detail-view',
    params: {
      mesh,
      dataPlane: name,
    },
  }
  const meshRoute = {
    name: 'mesh-detail-view',
    params: {
      mesh,
    },
  }

  /**
       * Handle our tag collections based on the dataplane type.
       */
  const importantDataPlaneTagLabels = [
    'kuma.io/protocol',
    'kuma.io/service',
    'kuma.io/zone',
  ]
  const tags = dpTags(dataPlaneOverview.dataplane).filter((tag) => importantDataPlaneTagLabels.includes(tag.label))
  const service = tags.find((tag) => tag.label === 'kuma.io/service')?.value
  const protocol = tags.find((tag) => tag.label === 'kuma.io/protocol')?.value
  const zone = tags.find((tag) => tag.label === 'kuma.io/zone')?.value

  let serviceInsightRoute
  if (service !== undefined) {
    serviceInsightRoute = {
      name: 'service-insight-detail-view',
      params: {
        mesh,
        service,
      },
    }
  }

  const { status } = getStatus(dataPlaneOverview.dataplane, dataPlaneOverview.dataplaneInsight)

  const initialData: any = {
    totalUpdates: 0,
    totalRejectedUpdates: 0,
    dpVersion: null,
    envoyVersion: null,
    selectedTime: NaN,
    selectedUpdateTime: NaN,
    version: null,
  }

  const summary = dataPlaneOverview.dataplaneInsight.subscriptions.reduce(
    (acc, subscription) => {
      if (subscription.connectTime) {
        const connectDate = Date.parse(subscription.connectTime)
        if (!acc.selectedTime || connectDate > acc.selectedTime) {
          acc.selectedTime = connectDate
        }
      }

      const lastUpdateDate = Date.parse(subscription.status.lastUpdateTime)
      if (lastUpdateDate) {
        if (!acc.selectedUpdateTime || lastUpdateDate > acc.selectedUpdateTime) {
          acc.selectedUpdateTime = lastUpdateDate
        }
      }

      return {
        totalUpdates: acc.totalUpdates + parseInt(subscription.status.total.responsesSent ?? '0', 10),
        totalRejectedUpdates: acc.totalRejectedUpdates + parseInt(subscription.status.total.responsesRejected ?? '0', 10),
        dpVersion: subscription.version?.kumaDp.version || acc.dpVersion,
        envoyVersion: subscription.version?.envoy.version || acc.envoyVersion,
        selectedTime: acc.selectedTime,
        selectedUpdateTime: acc.selectedUpdateTime,
        version: subscription.version || acc.version,
      }
    },
    initialData,
  )

  // assemble the table data
  const item = {
    name,
    nameRoute,
    mesh,
    meshRoute,
    zone: zone ?? '—',
    service: service ?? '—',
    serviceInsightRoute,
    protocol: protocol ?? '—',
    status,
    totalUpdates: summary.totalUpdates,
    totalRejectedUpdates: summary.totalRejectedUpdates,
    dpVersion: summary.dpVersion ?? '—',
    envoyVersion: summary.envoyVersion ?? '—',
    warnings: [] as string[],
    unsupportedEnvoyVersion: false,
    unsupportedKumaDPVersion: false,
    kumaDpAndKumaCpMismatch: false,
    lastUpdated: summary.selectedUpdateTime ? humanReadableDate(new Date(summary.selectedUpdateTime).toUTCString()) : '—',
    lastConnected: summary.selectedTime ? humanReadableDate(new Date(summary.selectedTime).toUTCString()) : '—',
    type: getDataplaneType(dataPlaneOverview.dataplane),
  }

  if (summary.version) {
    const { kind } = compatibilityKind(summary.version)

    if (kind !== COMPATIBLE) {
      item.warnings.push(kind)
    }

    switch (kind) {
      case INCOMPATIBLE_UNSUPPORTED_ENVOY:
        item.unsupportedEnvoyVersion = true
        break
      case INCOMPATIBLE_UNSUPPORTED_KUMA_DP:
        item.unsupportedKumaDPVersion = true
        break
    }
  }

  if (multicluster.value && summary.dpVersion) {
    const zoneTag = tags.find(tag => tag.label === KUMA_ZONE_TAG_NAME)

    if (zoneTag && typeof summary.version.kumaDp.kumaCpCompatible === 'boolean' && !summary.version.kumaDp.kumaCpCompatible) {
      item.warnings.push(INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS)
      item.kumaDpAndKumaCpMismatch = true
    }
  }

  return item
}

async function loadData(offset: number): Promise<void> {
  isLoading.value = true

  pageOffset.value = offset

  // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
  patchQueryParam('offset', offset > 0 ? offset : null)
  const mesh = route.params.mesh as string
  const size = PAGE_SIZE

  try {
    const { items, next } = await kumaApi.getAllDataplaneOverviewsFromMesh({ mesh }, { size, offset })

    if (Array.isArray(items) && items.length > 0) {
      items.sort(function (overviewA, overviewB) {
        if (overviewA.name === overviewB.name) {
          return overviewA.mesh > overviewB.mesh ? 1 : -1
        } else {
          return overviewA.name.localeCompare(overviewB.name)
        }
      })
      nextUrl.value = next
      rawData.value = items
      selectDataPlaneOverview(props.name ?? items[0].name)

      const final = await Promise.all(rawData.value.map((item) => parseData(item)))

      tableData.value.data = final
      tableDataIsEmpty.value = false
      isEmpty.value = false
    } else {
      selectDataPlaneOverview(null)
      tableData.value.data = []
      tableDataIsEmpty.value = true
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

function selectDataPlaneOverview(name: string | null): void {
  if (name && rawData.value.length > 0) {
    dataPlaneOverview.value = rawData.value.find((data) => data.name === name) ?? rawData.value[0]
    patchQueryParam('name', dataPlaneOverview.value.name)
  } else {
    dataPlaneOverview.value = null
    patchQueryParam('name', null)
  }
}
</script>

<style lang="scss" scoped>
.add-dp-button.add-dp-button {
  background-color: var(--logo-green);
}

.table-header-selector-item-checkbox {
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  align-items: center;
}
</style>

<style lang="scss">
.table-header-selector-item .k-dropdown-item-trigger {
  padding: 0 !important;
}
</style>
