<template>
  <div
    v-bind="$attrs"
  >
    <DataCollection
      :items="props.items ?? [undefined]"
      :type="can('create zones') ? `zone-cps-crud` : `zone-cps`"
    >
      <AppCollection
        :headers="[
          { label: '&nbsp;', key: 'type' },
          { label: t('zone-cps.components.zone-control-planes-list.name'), key: 'name'},
          { label: t('zone-cps.components.zone-control-planes-list.status'), key: 'status'},
        ]"
        :items="props.items"
        :total="props.items?.length"
      >
        <template
          #type="{ row: item }"
        >
          <template
            v-for="env in [(['kubernetes', 'universal'] as const).find(env => env === item.zoneInsight.environment) ?? 'kubernetes']"
            :key="env"
          >
            <XIcon
              :name="env"
            >
              {{ t(`common.product.environment.${env}`) }}
            </XIcon>
          </template>
        </template>
        <template #name="{ row: item }">
          <XAction
            :to="{
              name: 'zone-cp-detail-view',
              params: {
                zone: item.name,
              },
            }"
          >
            {{ item.name }}
          </XAction>
        </template>

        <template #status="{ row: item }">
          <StatusBadge
            :status="item.state"
          />
        </template>
      </AppCollection>
    </DataCollection>
  </div>
  <!-- put the create button either in the empty state or above the list -->
  <!-- depending on whether we are empty or not -->
  <XTeleportTemplate
    v-if="can('create zones') && props.items"
    :to="{
      name: (props.items.length > 0) ? 'control-plane-detail-view-zone-actions' : 'zone-cps-crud-x-empty-state-actions',
    }"
  >
    <KButton
      appearance="primary"
      :to="{ name: 'zone-create-view' }"
    >
      <AddIcon />
      {{ t('zones.index.create') }}
    </KButton>
  </XTeleportTemplate>
</template>

<script lang="ts" setup>

import { AddIcon } from '@kong/icons'

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
<style lang="scss" scoped>
.app-collection:deep(:is(th, td):nth-child(1)) {
  padding-left: 8px !important;
  padding-right: 0 !important;
  width: 16px !important;
}
</style>
