<template>
  <ContentWrapper>
    <template #content>
      <DataOverview
        :selected-entity-name="dataPlaneOverview?.name"
        :page-size="PAGE_SIZE"
        :is-loading="props.isLoading"
        :error="error"
        :empty-state="EMPTY_STATE"
        :table-data="filteredTableData"
        :table-data-is-empty="filteredTableData.data.length === 0"
        show-details
        :next="props.nextUrl !== null"
        :page-offset="props.pageOffset"
        @table-action="($event: any) => selectDataPlaneOverview($event.name)"
        @load-data="loadData(props.pageOffset)"
      >
        <template #additionalControls>
          <div v-if="props.isGatewayView">
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
            appearance="creation"
            :to="dataplaneWizardRoute"
            icon="plus"
            data-testid="data-plane-create-data-plane-button"
            @click="onCreateClick"
          >
            Create data plane proxy
          </KButton>

          <KButton
            v-if="route.query.ns"
            appearance="primary"
            icon="arrowLeft"
            :to="{ name: route.name }"
            data-testid="data-plane-ns-back-button"
          >
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
import { computed, PropType, ref, watch } from 'vue'
import { RouteLocationNamedRaw, useRoute } from 'vue-router'
import { datadogLogs } from '@datadog/browser-logs'
import { KButton, KDropdownItem, KDropdownMenu } from '@kong/kongponents'

import ContentWrapper from '@/app/common/ContentWrapper.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import DataPlaneEntitySummary from '@/app/data-planes/components/DataPlaneEntitySummary.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import { columnsDropdownItems, defaultVisibleTableHeaderKeys, getDataPlaneTableHeaders, ColumnDropdownItem } from '../constants'
import { useStore } from '@/store/store'
import { ClientStorage } from '@/utilities/ClientStorage'
import { patchQueryParam } from '@/utilities/patchQueryParam'
import { humanReadableDate } from '@/utilities/helpers'
import { datadogLogEvents } from '@/utilities/datadogLogEvents'
import {
  compatibilityKind,
  dpTags,
  getStatusAndReason,
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
  'Builtin',
  'Delegated',
] as const

const EMPTY_STATE = {
  title: 'No Data',
  message: 'There are no data plane proxies present.',
}

type DataPlaneType = typeof dataPlaneTypes[number]

const route = useRoute()
const store = useStore()
const props = defineProps({
  dataPlaneOverviews: {
    type: Array as PropType<DataPlaneOverview[]>,
    required: true,
  },

  isLoading: {
    type: Boolean,
    required: false,
    default: false,
  },

  error: {
    type: Error as PropType<Error | null>,
    required: false,
    default: null,
  },

  nextUrl: {
    type: String as PropType<String | null>,
    required: false,
    default: null,
  },

  pageOffset: {
    type: Number,
    required: false,
    default: 0,
  },

  selectedDppName: {
    type: String,
    required: false,
    default: null,
  },

  isGatewayView: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['gateway-type-change', 'load-data'])

const visibleTableHeaderKeys = ref(defaultVisibleTableHeaderKeys)
const tableData = ref<{ headers: TableHeader[], data: any }>({
  headers: [],
  data: [],
})
const filteredDataPlaneType = ref<DataPlaneType>('All')
const dataPlaneOverview = ref<DataPlaneOverview | null>(null)
const isMultiZoneMode = computed(() => store.getters['config/getMulticlusterStatus'])
const dataplaneWizardRoute = computed(() => ({ name: store.getters['config/getEnvironment'] === 'universal' ? 'universal-dataplane' : 'kubernetes-dataplane' }))

const filteredTableData = computed(() => {
  let headers = getDataPlaneTableHeaders(isMultiZoneMode.value, visibleTableHeaderKeys.value)
  if (props.isGatewayView) {
    headers = headers.filter(item => item.key !== 'protocol')
  } else {
    headers = headers.filter(item => item.key !== 'type')
  }

  return {
    data: tableData.value.data,
    headers,
  }
})

const filteredColumnsDropdownItems = computed<ColumnDropdownItem[]>(() => {
  return columnsDropdownItems
    .filter((item) => {
      if (props.isGatewayView) {
        return item.tableHeaderKey !== 'protocol'
      } else {
        return item.tableHeaderKey !== 'type'
      }
    })
    .filter((item) => isMultiZoneMode.value ? true : item.tableHeaderKey !== 'zone')
    .map((item) => {
      const isChecked = visibleTableHeaderKeys.value.includes(item.tableHeaderKey)

      return {
        ...item,
        isChecked,
      }
    })
})

watch(filteredDataPlaneType, function () {
  emit('gateway-type-change', filteredDataPlaneType.value)
})

watch(() => props.dataPlaneOverviews, function () {
  initializeData()
})

const storedVisibleTableHeaderKeys = ClientStorage.get('dpVisibleTableHeaderKeys')
if (Array.isArray(storedVisibleTableHeaderKeys)) {
  visibleTableHeaderKeys.value = storedVisibleTableHeaderKeys
}

initializeData()

function loadData(offset: number): void {
  emit('load-data', offset)
}

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

async function initializeData(): Promise<void> {
  try {
    if (Array.isArray(props.dataPlaneOverviews) && props.dataPlaneOverviews.length > 0) {
      selectDataPlaneOverview(props.selectedDppName ?? props.dataPlaneOverviews[0].name)
      tableData.value.data = await Promise.all(props.dataPlaneOverviews.map((item) => parseData(item)))
    } else {
      selectDataPlaneOverview(null)
      tableData.value.data = []
    }
  } catch (err) {
    console.error(err)
  }
}

function selectDataPlaneOverview(name: string | null): void {
  if (name && props.dataPlaneOverviews.length > 0) {
    dataPlaneOverview.value = props.dataPlaneOverviews.find((data) => data.name === name) ?? props.dataPlaneOverviews[0]
    patchQueryParam('dpp', dataPlaneOverview.value.name)
  } else {
    dataPlaneOverview.value = null
    patchQueryParam('dpp', null)
  }
}

async function parseData(dataPlaneOverview: DataPlaneOverview) {
  const mesh = dataPlaneOverview.mesh
  const name = dataPlaneOverview.name
  const type = dataPlaneOverview.dataplane.networking.gateway?.type || 'STANDARD'

  const nameRoute: RouteLocationNamedRaw = {
    name: type === 'STANDARD' ? 'data-plane-detail-view' : 'gateway-detail-view',
    params: {
      mesh,
      dataPlane: name,
    },
  }
  const meshRoute: RouteLocationNamedRaw = {
    name: 'mesh-detail-view',
    params: {
      mesh,
    },
  }

  // Handles our tag collections based on the dataplane type.
  const importantDataPlaneTagLabels = [
    'kuma.io/protocol',
    'kuma.io/service',
    'kuma.io/zone',
  ]
  const tags = dpTags(dataPlaneOverview.dataplane).filter((tag) => importantDataPlaneTagLabels.includes(tag.label))
  const service = tags.find((tag) => tag.label === 'kuma.io/service')?.value
  const protocol = tags.find((tag) => tag.label === 'kuma.io/protocol')?.value
  const zone = tags.find((tag) => tag.label === 'kuma.io/zone')?.value

  let serviceInsightRoute: RouteLocationNamedRaw | undefined
  if (service !== undefined) {
    serviceInsightRoute = {
      name: 'service-detail-view',
      params: {
        mesh,
        service,
      },
    }
  }
  let zoneRoute: RouteLocationNamedRaw | undefined
  if (zone !== undefined) {
    zoneRoute = {
      name: 'zones',
      query: {
        ns: zone,
      },
    }
  }

  const { status } = getStatusAndReason(dataPlaneOverview.dataplane, dataPlaneOverview.dataplaneInsight)
  const subscriptions = dataPlaneOverview.dataplaneInsight?.subscriptions ?? []

  const initialData: any = {
    totalUpdates: 0,
    totalRejectedUpdates: 0,
    dpVersion: null,
    envoyVersion: null,
    selectedTime: NaN,
    selectedUpdateTime: NaN,
    version: null,
  }

  const summary = subscriptions.reduce(
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
    type,
    zone: zone ?? '—',
    zoneRoute,
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
    overview: dataPlaneOverview,
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

  if (isMultiZoneMode.value && summary.dpVersion) {
    const zoneTag = tags.find(tag => tag.label === KUMA_ZONE_TAG_NAME)

    if (zoneTag && typeof summary.version.kumaDp.kumaCpCompatible === 'boolean' && !summary.version.kumaDp.kumaCpCompatible) {
      item.warnings.push(INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS)
      item.kumaDpAndKumaCpMismatch = true
    }
  }

  return item
}
</script>

<style lang="scss" scoped>
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
