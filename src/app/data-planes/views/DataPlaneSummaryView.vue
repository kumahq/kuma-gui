<template>
  <RouteView
    v-slot="{ t }"
    name="data-plane-summary-view"
  >
    <AppView>
      <template #title>
        <h2>
          <RouterLink
            :to="{
              name: 'data-plane-detail-view',
              params: {
                dataPlane: props.name,
              },
            }"
          >
            <RouteTitle
              :title="t('data-planes.routes.item.title', { name: props.name })"
            />
          </RouterLink>
        </h2>
      </template>

      <EmptyBlock v-if="props.dataplaneOverview === undefined">
        {{ t('common.collection.summary.empty_title', { type: 'Data Plane Proxy' }) }}

        <template #message>
          <p>{{ t('common.collection.summary.empty_message', { type: 'Data Plane Proxy' }) }}</p>
        </template>
      </EmptyBlock>

      <div
        v-else
        class="stack"
      >
        <DataPlaneSummary
          class="mt-4"
          :dataplane-overview="props.dataplaneOverview"
        />
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { DataplaneOverview } from '../data'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import DataPlaneSummary from '@/app/data-planes/components/DataPlaneSummary.vue'

const props = withDefaults(defineProps<{
  name: string
  dataplaneOverview?: DataplaneOverview
}>(), {
  dataplaneOverview: undefined,
})
</script>
