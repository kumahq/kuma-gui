<template>
  <AppCollection
    :headers="[
      { label: t('zone-cps.components.zone-control-planes-list.name'), key: 'name'},
      { label: t('zone-cps.components.zone-control-planes-list.status'), key: 'status'},
    ]"
    :items="props.items"
    :total="props.items?.length"
    :empty-state-title="t('zone-cps.empty_state.title')"
    :empty-state-message="can('create zones') ? t('zone-cps.empty_state.message') : t('common.emptyState.message', { type: 'Zones' })"
    :empty-state-cta-to="can('create zones') ? { name: 'zone-create-view' } : undefined"
    :empty-state-cta-text="t('zones.index.create')"
  >
    <template #name="{ row: item }">
      <RouterLink
        :to="{
          name: 'zone-cp-detail-view',
          params: {
            zone: item.name,
          },
        }"
      >
        {{ item.name }}
      </RouterLink>
    </template>

    <template #status="{ row: item }">
      <StatusBadge
        :status="item.state"
      />
    </template>
  </AppCollection>
</template>

<script lang="ts" setup>

import type { ZoneOverview } from '../data'
import { useCan, useI18n } from '@/app/application'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'

const { t } = useI18n()
const can = useCan()

const props = defineProps<{
  items?: ZoneOverview[]
}>()
</script>
