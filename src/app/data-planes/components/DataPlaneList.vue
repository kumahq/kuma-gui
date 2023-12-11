<template>
  <AppCollection
    class="data-plane-collection"
    :empty-state-message="t('common.emptyState.message', { type: 'Data Plane Proxies' })"
    :empty-state-cta-to="t('data-planes.href.docs.data_plane_proxy')"
    :empty-state-cta-text="t('common.documentation')"
    :headers="[
      { label: 'Name', key: 'name' },
      { label: 'Type', key: 'type' },
      { label: 'Services', key: 'services' },
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
    <template
      v-if="$slots.toolbar"
      #toolbar
    >
      <slot name="toolbar" />
    </template>

    <template #name="{ row: item }: { row: DataPlaneOverviewTableRow }">
      <RouterLink
        class="name-link"
        :title="item.name"
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

    <template #services="{ row }: { row: DataPlaneOverviewTableRow }">
      <KTruncate
        v-if="row.services.length > 0"
        width="auto"
      >
        <div
          v-for="(tag, index) in row.services"
          :key="index"
        >
          <TextWithCopyButton :text="tag.value">
            <RouterLink
              :to="{
                name: 'service-detail-view',
                params: {
                  service: tag.value,
                },
              }"
            >
              {{ tag.value }}
            </RouterLink>
          </TextWithCopyButton>
        </div>
      </KTruncate>

      <template v-else>
        {{ t('common.collection.none') }}
      </template>
    </template>

    <template #status="{ row }: { row: DataPlaneOverviewTableRow }">
      <StatusBadge :status="row.status" />
    </template>

    <template #warnings="{ row: item }: { row: DataPlaneOverviewTableRow }">
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

    <template #details="{ row }: { row: DataPlaneOverviewTableRow }">
      <RouterLink
        class="details-link"
        data-testid="details-link"
        :to="{
          name: 'data-plane-detail-view',
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

import { getDataplaneType, getIsCertExpired, getStatusAndReason, getTags, getWarnings } from '../data/index'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import WarningIcon from '@/app/common/WarningIcon.vue'
import type { DataPlaneOverview, LabelValue, StatusKeyword } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t, formatIsoDate } = useI18n()

type DataPlaneOverviewTableRow = {
  type: string
  name: string
  mesh: string
  services: LabelValue[]
  status: StatusKeyword
  warnings: {
    version_mismatch: boolean
    cert_expired: boolean
  }
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
  isSelectedRow: ((row: any) => boolean) | null
  summaryRouteName: string
  canUseZones: boolean
}>(), {
  total: 0,
  isSelectedRow: null,
})

const emit = defineEmits<{
  (event: 'change', value: ChangeValue): void
}>()

function transformToTableData(dataPlaneOverviews: DataPlaneOverview[]): DataPlaneOverviewTableRow[] {
  return dataPlaneOverviews.map((dataPlaneOverview) => {
    const { mesh, name } = dataPlaneOverview
    const type = t(`data-planes.type.${getDataplaneType(dataPlaneOverview)}`)

    const tags = getTags(dataPlaneOverview)
    const services = tags.filter((tag) => tag.label === 'kuma.io/service')

    const { status } = getStatusAndReason(dataPlaneOverview)

    let certificate
    if (dataPlaneOverview.dataplaneInsight?.mTLS?.certificateExpirationTime) {
      certificate = formatIsoDate(dataPlaneOverview.dataplaneInsight.mTLS.certificateExpirationTime)
    } else {
      certificate = t('data-planes.components.data-plane-list.certificate.none')
    }

    const warnings = getWarnings(dataPlaneOverview, props.canUseZones)
    const isCertExpired = getIsCertExpired(dataPlaneOverview)

    return {
      name,
      type,
      mesh,
      services,
      status,
      warnings: {
        version_mismatch: warnings.length > 0,
        cert_expired: isCertExpired,
      },
      certificate,
    }
  })
}
</script>

<style lang="scss" scoped>
.name-link {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.details-link {
  display: inline-flex;
  align-items: center;
  gap: $kui-space-20;
}

.data-plane-collection :deep(.name-column) {
  max-width: 400px;
}
</style>
