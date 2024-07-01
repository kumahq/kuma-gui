<template>
  <div
    v-bind="$attrs"
  >
    <DataCollection
      :items="props.items ?? [undefined]"
      :type="can('create zones') ? `zones-crud` : `zone-cps`"
    >
      <AppCollection
        :headers="[
          { label: t('zone-cps.components.zone-control-planes-list.name'), key: 'name'},
          { label: t('zone-cps.components.zone-control-planes-list.status'), key: 'status'},
        ]"
        :items="props.items"
        :total="props.items?.length"
      >
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
