<template>
  <AppCollection
    :empty-state-title="t('common.emptyState.title')"
    :empty-state-message="t('common.emptyState.message', { type: props.gateways ? 'Gateways' : 'Data Plane Proxies' })"
    :headers="[
      { label: 'Name', key: 'name' },
      props.gateways ? { label: 'Type', key: 'type' } : undefined,
      { label: 'Service', key: 'service' },
      !props.gateways ? { label: 'Protocol', key: 'protocol' } : undefined,
      isMultiZoneMode ? { label: 'Zone', key: 'zone' } : undefined,
      { label: 'Last Updated', key: 'lastUpdated' },
      { label: 'Status', key: 'status' },
      { label: 'Warnings', key: 'warnings', hideLabel: true },
      { label: 'Actions', key: 'actions', hideLabel: true },
    ].filter(notEmpty)"
    :page-number="props.pageNumber"
    :page-size="props.pageSize"
    :total="props.total"
    :items="props.items ? transformToTableData(props.items) : undefined"
    :error="props.error"
    @change="emit('change', $event)"
  >
    <template #toolbar>
      <slot name="toolbar" />
    </template>
    <template #name="{ row: item }">
      <RouterLink
        :to="{
          name: props.gateways ? 'gateway-detail-view' : 'data-plane-detail-view',
          params: {
            dataPlane: item.name
          }
        }"
        data-testid="detail-view-link"
      >
        {{ item.name }}
      </RouterLink>
    </template>
    <template #service="{ rowValue }">
      <RouterLink
        v-if="rowValue.route"
        :to="rowValue.route"
      >
        {{ rowValue.title }}
      </RouterLink>

      <template v-else>
        {{ rowValue.title }}
      </template>
    </template>
    <template #zone="{ rowValue }">
      <RouterLink
        v-if="rowValue.route"
        :to="rowValue.route"
      >
        {{ rowValue.title }}
      </RouterLink>

      <template v-else>
        {{ rowValue.title }}
      </template>
    </template>
    <template #status="{ rowValue }">
      <StatusBadge
        v-if="rowValue"
        :status="rowValue"
      />

      <template v-else>
        {{ t('common.collection.none') }}
      </template>
    </template>

    <template #warnings="{ rowValue }">
      <KTooltip
        v-if="rowValue.length > 0"
        :label="t('data-planes.list.version_mismatch')"
      >
        <WarningIcon
          class="mr-1"
          size="20"
          hide-title
        />
      </KTooltip>

      <template v-else>
        &nbsp;
      </template>
    </template>

    <template #actions="{ row: item }">
      <KDropdownMenu
        class="actions-dropdown"
        :kpop-attributes="{ placement: 'bottomEnd', popoverClasses: 'mt-5 more-actions-popover' }"
        width="150"
      >
        <template #default>
          <KButton
            class="non-visual-button"
            appearance="secondary"
            size="small"
          >
            <template #icon>
              <KIcon
                color="var(--black-400)"
                icon="more"
                size="16"
              />
            </template>
          </KButton>
        </template>
        <template #items>
          <KDropdownItem
            :item="{
              to: {
                name: props.gateways ? 'gateway-detail-view' : 'data-plane-detail-view',
                params: {
                  dataPlane: item.name,
                },
              },
              label: t('common.collection.actions.view'),
            }"
          />
        </template>
      </KDropdownMenu>
    </template>
  </AppCollection>
</template>

<script lang="ts" setup>
import {
  KDropdownItem,
  KDropdownMenu,
  KButton,
  KIcon,
  KTooltip,
} from '@kong/kongponents'
import { computed } from 'vue'
import { RouteLocationNamedRaw } from 'vue-router'

import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import WarningIcon from '@/app/common/WarningIcon.vue'
import { KUMA_ZONE_TAG_NAME } from '@/constants'
import { useStore } from '@/store/store'
import { DataPlaneOverviewParameters } from '@/types/api.d'
import { DataPlaneOverview, StatusKeyword, Version } from '@/types/index.d'
import { useI18n } from '@/utilities'
import {
  compatibilityKind,
  dpTags,
  getStatusAndReason,
  COMPATIBLE,
  INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS,
} from '@/utilities/dataplane'
import { notEmpty } from '@/utilities/notEmpty'
const store = useStore()
const { t, formatIsoDate } = useI18n()

type DataPlaneOverviewTableRow = {
  detailViewRoute: RouteLocationNamedRaw
  type: string
  name: string
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
  envoyVersion: string
  warnings: string[]
  lastUpdated: string
  lastConnected: string
  overview: DataPlaneOverview
}

type ChangeValue = {
  page: number
  size: number
  s: string
}

const props = withDefaults(defineProps<{
  total?: number,
  pageNumber: number,
  pageSize: number,
  items: DataPlaneOverview[] | undefined,
  error: Error | undefined,
  gateways?: boolean
}>(), {
  total: 0,
  gateways: false,
})

const emit = defineEmits<{
  (event: 'load-data', offset: number, params: DataPlaneOverviewParameters): void
  (e: 'change', value: ChangeValue): void
}>()

const isMultiZoneMode = computed(() => store.getters['config/getMulticlusterStatus'])

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
      name,
      detailViewRoute,
      type,
      zone: { title: zone ?? t('common.collection.none'), route: zoneRoute },
      service: { title: service ?? t('common.collection.none'), route: serviceInsightRoute },
      protocol: protocol ?? t('common.collection.none'),
      status,
      totalUpdates: summary.totalUpdates,
      totalRejectedUpdates: summary.totalRejectedUpdates,
      envoyVersion: summary.envoyVersion ?? t('common.collection.none'),
      warnings: [],
      lastUpdated: summary.selectedUpdateTime ? formatIsoDate(new Date(summary.selectedUpdateTime).toUTCString()) : t('common.collection.none'),
      lastConnected: summary.selectedTime ? formatIsoDate(new Date(summary.selectedTime).toUTCString()) : t('common.collection.none'),
      overview: dataPlaneOverview,
    }

    if (summary.version) {
      const { kind } = compatibilityKind(summary.version)

      if (kind !== COMPATIBLE) {
        item.warnings.push(kind)
      }
    }

    if (isMultiZoneMode.value && summary.dpVersion) {
      const zoneTag = tags.find(tag => tag.label === KUMA_ZONE_TAG_NAME)

      if (zoneTag && typeof summary.version?.kumaDp.kumaCpCompatible === 'boolean' && !summary.version.kumaDp.kumaCpCompatible) {
        item.warnings.push(INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS)
      }
    }

    return item
  })
}

</script>

<style lang="scss" scoped>
.actions-dropdown {
  display: inline-block;
}
</style>
