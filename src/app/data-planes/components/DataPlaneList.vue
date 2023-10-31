<template>
  <AppCollection
    :empty-state-message="t('common.emptyState.message', { type: props.gateways ? 'Gateways' : 'Data Plane Proxies' })"
    :empty-state-cta-to="t(`data-planes.href.docs.${props.gateways ? 'gateway' : 'data_plane_proxy'}`)"
    :empty-state-cta-text="t('common.documentation')"
    :headers="[
      { label: 'Name', key: 'name' },
      ...(props.gateways ? [{ label: 'Type', key: 'type' }] : []),
      { label: 'Service', key: 'service' },
      ...(!props.gateways ? [{ label: 'Protocol', key: 'protocol' }] : []),
      ...(isMultiZoneMode ? [{ label: 'Zone', key: 'zone' }] : []),
      { label: 'Certificate Info', key: 'certificate' },
      { label: 'Status', key: 'status' },
      { label: 'Warnings', key: 'warnings', hideLabel: true },
      { label: 'Details', key: 'details', hideLabel: true },
    ]"
    :page-number="props.pageNumber"
    :page-size="props.pageSize"
    :total="props.total"
    :items="props.items ? transformToTableData(props.items) : undefined"
    :error="props.error"
    :is-selected-row="props.isSelectedRow"
    @change="emit('change', $event)"
  >
    <template #toolbar>
      <slot name="toolbar" />
    </template>

    <template #name="{ row: item }">
      <RouterLink
        :to="{
          name: props.summaryRouteName,
          params: {
            mesh: item.mesh,
            dataPlane: item.name,
          },
          query: {
            page: props.pageNumber,
            size: props.pageSize,
          },
        }"
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

    <template #warnings="{ row: item }">
      <KTooltip
        v-if="Object.values(item.warnings).some((item) => item)"
      >
        <template
          #content
        >
          <ul>
            <template
              v-for="(warning, i) in item.warnings"
              :key="i"
            >
              <li v-if="warning">
                {{ t(`data-planes.components.data-plane-list.${i}`) }}
              </li>
            </template>
          </ul>
        </template>
        <WarningIcon
          class="mr-1"
          :size="KUI_ICON_SIZE_30"
          hide-title
        />
      </KTooltip>

      <template v-else>
        {{ t('common.collection.none') }}
      </template>
    </template>

    <template #details="{ row }">
      <RouterLink
        class="details-link"
        data-testid="details-link"
        :to="{
          name: row.isGateway ? 'gateway-detail-view' : 'data-plane-detail-view',
          params: {
            dataPlane: row.name,
          },
        }"
      >
        {{ t('common.collection.details_link') }}

        <ArrowRightIcon
          display="inline-block"
          decorative
          :size="KUI_ICON_SIZE_30"
        />
      </RouterLink>
    </template>
  </AppCollection>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { ArrowRightIcon } from '@kong/icons'
import { type RouteLocationNamedRaw } from 'vue-router'

import { useCan } from '@/app/application'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import WarningIcon from '@/app/common/WarningIcon.vue'
import { DataPlaneOverviewParameters } from '@/types/api.d'
import type { DataPlaneOverview, StatusKeyword, Version } from '@/types/index.d'
import { useI18n } from '@/utilities'
import {
  compatibilityKind,
  dpTags,
  getStatusAndReason,
  COMPATIBLE,
} from '@/utilities/dataplane'

const { t, formatIsoDate } = useI18n()
const can = useCan()

type DataPlaneOverviewTableRow = {
  type: string
  name: string
  zone: {
    title: string
    route?: RouteLocationNamedRaw | undefined
  }
  service: {
    title: string
    route?: RouteLocationNamedRaw | undefined
  }
  protocol: string
  status: StatusKeyword
  warnings: {
    version_mismatch: boolean
    cert_expired: boolean
  }
  isGateway: boolean
  certificate: string
}

type ChangeValue = {
  page?: number
  size?: number
}

const props = withDefaults(defineProps<{
  total?: number
  pageNumber: number
  pageSize: number
  items: DataPlaneOverview[] | undefined
  error: Error | undefined
  gateways?: boolean
  isSelectedRow: ((row: any) => boolean) | null
  summaryRouteName: string
}>(), {
  total: 0,
  gateways: false,
  isSelectedRow: null,
})

const emit = defineEmits<{
  (event: 'load-data', offset: number, params: DataPlaneOverviewParameters): void
  (e: 'change', value: ChangeValue): void
}>()

const isMultiZoneMode = can('use zones')

function transformToTableData(dataPlaneOverviews: DataPlaneOverview[]): DataPlaneOverviewTableRow[] {
  return dataPlaneOverviews.map((dataPlaneOverview) => {
    const mesh = dataPlaneOverview.mesh
    const name = dataPlaneOverview.name
    const type = dataPlaneOverview.dataplane.networking.gateway?.type || 'STANDARD'

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
      dpVersion: string | null
      version: Version | null
    } = {
      dpVersion: null,
      version: null,
    }

    const summary = subscriptions.reduce(
      (acc, subscription) => {
        return {
          dpVersion: subscription.version?.kumaDp.version || acc.dpVersion,
          version: subscription.version || acc.version,
        }
      },
      initialData,
    )

    let certificate
    if (dataPlaneOverview.dataplaneInsight?.mTLS?.certificateExpirationTime) {
      certificate = formatIsoDate(dataPlaneOverview.dataplaneInsight.mTLS.certificateExpirationTime)
    } else {
      certificate = t('data-planes.components.data-plane-list.certificate.none')
    }

    // assemble the table data
    const item: DataPlaneOverviewTableRow = {
      name,
      type,
      zone: { title: zone ?? t('common.collection.none'), route: zoneRoute },
      service: { title: service ?? t('common.collection.none'), route: serviceInsightRoute },
      protocol: protocol ?? t('common.collection.none'),
      status,
      warnings: {
        version_mismatch: false,
        cert_expired: false,
      },
      isGateway: dataPlaneOverview.dataplane?.networking?.gateway !== undefined,
      certificate,
    }

    if (summary.version) {
      const { kind } = compatibilityKind(summary.version)

      if (kind !== COMPATIBLE) {
        item.warnings.version_mismatch = true
      }
    }

    if (isMultiZoneMode && summary.dpVersion) {
      const zoneTag = tags.find(tag => tag.label === 'kuma.io/zone')

      if (zoneTag && typeof summary.version?.kumaDp.kumaCpCompatible === 'boolean' && !summary.version.kumaDp.kumaCpCompatible) {
        item.warnings.version_mismatch = true
      }
    }
    const time = dataPlaneOverview.dataplaneInsight?.mTLS?.certificateExpirationTime
    if (
      time &&
      (Date.now() > new Date(time).getTime())
    ) {
      item.warnings.cert_expired = true
    }

    return item
  })
}

</script>

<style lang="scss" scoped>
.details-link {
  display: inline-flex;
  align-items: center;
  gap: $kui-space-20;
}
</style>
