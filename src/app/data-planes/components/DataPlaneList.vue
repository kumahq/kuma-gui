<template>
  <ContentWrapper>
    <template #content>
      <DataOverview
        :selected-entity-name="dataPlaneOverview?.name"
        :page-size="PAGE_SIZE_DEFAULT"
        :is-loading="props.isLoading"
        :error="error"
        :empty-state="EMPTY_STATE"
        :table-data="filteredTableData"
        :table-data-is-empty="filteredTableData.data.length === 0"
        :next="props.nextUrl !== null"
        :page-offset="props.pageOffset"
        @table-action="loadEntity"
        @load-data="loadData"
      >
        <template #additionalControls>
          <KFilterBar
            id="data-plane-proxy-filter"
            class="data-plane-proxy-filter"
            :placeholder="filterBarPlaceholder"
            :query="filterQuery"
            :fields="props.dppFilterFields"
            @fields-change="handleFieldsChange"
          />

          <div v-if="props.isGatewayView">
            <label
              for="data-planes-type-filter"
              class="mr-2"
            >
              Type:
            </label>

            <select
              id="data-planes-type-filter"
              v-model="filteredGatewayType"
              data-testid="data-planes-type-filter"
            >
              <option
                v-for="(value, key) in GATEWAY_TYPES"
                :key="key"
                :value="key"
              >
                {{ value }}
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
import { KButton, KDropdownItem, KDropdownMenu } from '@kong/kongponents'
import { computed, PropType, ref, watch } from 'vue'
import { RouteLocationNamedRaw } from 'vue-router'

import { columnsDropdownItems, defaultVisibleTableHeaderKeys, getDataPlaneTableHeaders, ColumnDropdownItem } from '../constants'
import ContentWrapper from '@/app/common/ContentWrapper.vue'
import DataOverview from '@/app/common/DataOverview.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import KFilterBar, { FilterBarEventData, FilterFields } from '@/app/common/KFilterBar.vue'
import DataPlaneEntitySummary from '@/app/data-planes/components/DataPlaneEntitySummary.vue'
import { KUMA_ZONE_TAG_NAME, PAGE_SIZE_DEFAULT } from '@/constants'
import { logEvents } from '@/services/logger/Logger'
import { useStore } from '@/store/store'
import { DataPlaneOverviewParameters } from '@/types/api.d'
import { DataPlaneOverview, StatusKeyword, TableHeader, Version } from '@/types/index.d'
import { useLogger } from '@/utilities'
import { ClientStorage } from '@/utilities/ClientStorage'
import {
  compatibilityKind,
  dpTags,
  getStatusAndReason,
  COMPATIBLE,
  INCOMPATIBLE_UNSUPPORTED_ENVOY,
  INCOMPATIBLE_UNSUPPORTED_KUMA_DP,
  INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS,
} from '@/utilities/dataplane'
import { humanReadableDate } from '@/utilities/helpers'
import { normalizeFilterFields } from '@/utilities/normalizeFilterFields'
import { QueryParameter } from '@/utilities/QueryParameter'

const logger = useLogger()
const store = useStore()

type DataPlaneOverviewTableRow = {
  entity: DataPlaneOverview
  detailViewRoute: RouteLocationNamedRaw
  type: string
  zone: {
    title: string,
    route?: RouteLocationNamedRaw | undefined
  }
  service: {
    title: string,
    route?: RouteLocationNamedRaw | undefined
  }
  protocol: string
  status: StatusKeyword
  totalUpdates: number
  totalRejectedUpdates: number
  dpVersion: string
  envoyVersion: string
  warnings: string[]
  unsupportedEnvoyVersion: boolean
  unsupportedKumaDPVersion: boolean
  kumaDpAndKumaCpMismatch: boolean
  lastUpdated: string
  lastConnected: string
  overview: DataPlaneOverview
}

const GATEWAY_TYPES = {
  true: 'All',
  builtin: 'Builtin',
  delegated: 'Delegated',
} as const

type GatewayType = keyof typeof GATEWAY_TYPES

const EMPTY_STATE = {
  title: 'No Data',
  message: 'There are no data plane proxies present.',
}

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
    type: [Error, null] as PropType<Error | null>,
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

  gatewayType: {
    type: String as PropType<String | undefined>,
    required: false,
    default: 'true',
  },

  dppFilterFields: {
    type: Object as PropType<FilterFields>,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'load-data', offset: number, params: DataPlaneOverviewParameters): void
}>()

const visibleTableHeaderKeys = ref(defaultVisibleTableHeaderKeys)
const tableData = ref<{ headers: TableHeader[], data: DataPlaneOverviewTableRow[] }>({
  headers: [],
  data: [],
})
const filterQuery = ref(QueryParameter.get('filterQuery') ?? '')
const filteredGatewayType = ref<GatewayType>(props.gatewayType as GatewayType)
const dppParams = ref<DataPlaneOverviewParameters>({})
const dataPlaneOverview = ref<DataPlaneOverview | null>(null)
const isMultiZoneMode = computed(() => store.getters['config/getMulticlusterStatus'])
const dataplaneWizardRoute = computed(() => ({ name: store.getters['config/getEnvironment'] === 'universal' ? 'universal-dataplane' : 'kubernetes-dataplane' }))

const filterBarPlaceholder = computed(() => {
  if ('tag' in props.dppFilterFields) {
    return 'tag: "kuma.io/protocol: http"'
  } else if ('name' in props.dppFilterFields) {
    return 'name: cluster'
  } else {
    return 'field: value'
  }
})

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

watch(filteredGatewayType, function () {
  emitLoadDataEvent(0)
})

watch(dppParams, function () {
  emitLoadDataEvent(0)
})

watch(() => props.dataPlaneOverviews, function () {
  initializeData()
})

function start() {
  // Reads the visible table headers from client storage.
  const storedVisibleTableHeaderKeys = ClientStorage.get('dpVisibleTableHeaderKeys')
  if (Array.isArray(storedVisibleTableHeaderKeys)) {
    visibleTableHeaderKeys.value = storedVisibleTableHeaderKeys
  }

  initializeData()
}

start()

function loadData(offset: number): void {
  emitLoadDataEvent(offset)
}

function emitLoadDataEvent(offset: number): void {
  const params: DataPlaneOverviewParameters = {
    ...dppParams.value,
  }

  if (!('gateway' in params)) {
    params.gateway = filteredGatewayType.value
  }

  emit('load-data', offset, params)
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
  logger.info(logEvents.CREATE_DATA_PLANE_PROXY_CLICKED)
}

function initializeData() {
  try {
    tableData.value.data = transformToTableData(props.dataPlaneOverviews ?? [])
    loadEntity({ name: props.selectedDppName ?? props.dataPlaneOverviews[0]?.name })
  } catch (err) {
    console.error(err)
  }
}

function loadEntity({ name }: { name?: string | undefined }) {
  if (name && props.dataPlaneOverviews.length > 0) {
    dataPlaneOverview.value = props.dataPlaneOverviews.find((data) => data.name === name) ?? props.dataPlaneOverviews[0]
    QueryParameter.set(props.isGatewayView ? 'gateway' : 'dpp', dataPlaneOverview.value.name)
  } else {
    dataPlaneOverview.value = null
    QueryParameter.set(props.isGatewayView ? 'gateway' : 'dpp', null)
  }
}

function transformToTableData(dataPlaneOverviews: DataPlaneOverview[]): DataPlaneOverviewTableRow[] {
  return dataPlaneOverviews.map((dataPlaneOverview) => {
    const mesh = dataPlaneOverview.mesh
    const name = dataPlaneOverview.name
    const type = dataPlaneOverview.dataplane.networking.gateway?.type || 'STANDARD'

    const detailViewRoute: RouteLocationNamedRaw = {
      name: type === 'STANDARD' ? 'data-plane-detail-view' : 'gateway-detail-view',
      params: {
        mesh,
        dataPlane: name,
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
        name: 'zone-cp-detail-view',
        params: {
          zone,
        },
      }
    }

    const { status } = getStatusAndReason(dataPlaneOverview.dataplane, dataPlaneOverview.dataplaneInsight)
    const subscriptions = dataPlaneOverview.dataplaneInsight?.subscriptions ?? []

    const initialData: {
      totalUpdates: number
      totalRejectedUpdates: number
      dpVersion: string | null
      envoyVersion: string | null
      selectedTime: number
      selectedUpdateTime: number
      version: Version | null
    } = {
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
    const item: DataPlaneOverviewTableRow = {
      entity: dataPlaneOverview,
      detailViewRoute,
      type,
      zone: { title: zone ?? '—', route: zoneRoute },
      service: { title: service ?? '—', route: serviceInsightRoute },
      protocol: protocol ?? '—',
      status,
      totalUpdates: summary.totalUpdates,
      totalRejectedUpdates: summary.totalRejectedUpdates,
      dpVersion: summary.dpVersion ?? '—',
      envoyVersion: summary.envoyVersion ?? '—',
      warnings: [],
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

      if (zoneTag && typeof summary.version?.kumaDp.kumaCpCompatible === 'boolean' && !summary.version.kumaDp.kumaCpCompatible) {
        item.warnings.push(INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS)
        item.kumaDpAndKumaCpMismatch = true
      }
    }

    return item
  })
}

function handleFieldsChange({ fields, query }: FilterBarEventData): void {
  const filterFields = QueryParameter.get('filterFields')
  const existingParams = filterFields !== null ? JSON.parse(filterFields) as DataPlaneOverviewParameters : {}
  const existingParamsStringified = JSON.stringify(existingParams)

  const newParams = Object.fromEntries(normalizeFilterFields(fields)) as DataPlaneOverviewParameters
  const newParamsStringified = JSON.stringify(newParams)

  // Persists the filter query and fields in the URL.
  QueryParameter.set('filterQuery', query || null)
  QueryParameter.set('filterFields', newParamsStringified)

  // Avoids setting the parameters when they haven’t changed. This avoids loading the same data repeatedly.
  if (existingParamsStringified !== newParamsStringified) {
    dppParams.value = newParams
  }
}
</script>

<style lang="scss" scoped>
.data-plane-proxy-filter {
  flex-basis: 350px;
  flex-grow: 1;
  margin-right: auto;
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
