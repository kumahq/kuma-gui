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
    :items="props.items"
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

    <template #name="{ row: item }">
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

    <template #type="{ row }">
      {{ t(`data-planes.type.${row.dataplaneType}`) }}
    </template>

    <template #services="{ row }">
      <KTruncate
        v-if="row.services.length > 0"
        width="auto"
      >
        <div
          v-for="(service, index) in row.services"
          :key="index"
        >
          <TextWithCopyButton :text="service">
            <RouterLink
              :to="{
                name: 'service-detail-view',
                params: {
                  service,
                },
              }"
            >
              {{ service }}
            </RouterLink>
          </TextWithCopyButton>
        </div>
      </KTruncate>

      <template v-else>
        {{ t('common.collection.none') }}
      </template>
    </template>

    <template #certificate="{ row }">
      <template v-if="row.dataplaneInsight.mTLS?.certificateExpirationTime">
        {{ formatIsoDate(row.dataplaneInsight.mTLS.certificateExpirationTime) }}
      </template>

      <template v-else>
        {{ t('data-planes.components.data-plane-list.certificate.none') }}
      </template>
    </template>

    <template #status="{ row }">
      <StatusBadge :status="row.status" />
    </template>

    <template #warnings="{ row }">
      <KTooltip v-if="row.isCertExpired || row.warnings.length > 0">
        <template #content>
          <ul>
            <template v-if="row.warnings.length > 0">
              <li>{{ t('data-planes.components.data-plane-list.version_mismatch') }}</li>
            </template>

            <template v-if="row.isCertExpired">
              <li>{{ t('data-planes.components.data-plane-list.cert_expired') }}</li>
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

import type { DataplaneOverview } from '../data/index'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import WarningIcon from '@/app/common/WarningIcon.vue'
import { useI18n } from '@/utilities'

const { t, formatIsoDate } = useI18n()

type ChangeValue = {
  page?: number
  size?: number
}

const props = withDefaults(defineProps<{
  total?: number
  pageNumber: number
  pageSize: number
  items: DataplaneOverview[] | undefined
  error: Error | undefined
  isSelectedRow: ((row: any) => boolean) | null
  summaryRouteName: string
}>(), {
  total: 0,
  isSelectedRow: null,
})

const emit = defineEmits<{
  (event: 'change', value: ChangeValue): void
}>()
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
