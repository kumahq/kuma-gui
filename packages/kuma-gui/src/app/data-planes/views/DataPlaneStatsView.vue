<template>
  <RouteView
    name="data-plane-stats-view"
    :params="{
      mesh: '',
      dataPlane: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t }"
  >
    <RouteTitle
      :render="false"
      :title="t('data-planes.routes.item.navigation.data-plane-stats-view')"
    />
    <AppView>
      <KCard>
        <DataLoader
          :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/stats/${props.data.dataplane.networking.inboundAddress}`"
          v-slot="{ data: statsData, refresh }: StatsSource"
        >
          <XCodeBlock
            language="json"
            :code="statsData!.raw"
            is-searchable
            :query="route.params.codeSearch"
            :is-filter-mode="route.params.codeFilter"
            :is-reg-exp-mode="route.params.codeRegExp"
            @query-change="route.update({ codeSearch: $event })"
            @filter-mode-change="route.update({ codeFilter: $event })"
            @reg-exp-mode-change="route.update({ codeRegExp: $event })"
          >
            <template #primary-actions>
              <XAction
                action="refresh"
                appearance="primary"
                @click="refresh"
              >
                Refresh
              </XAction>
            </template>
          </XCodeBlock>
        </DataLoader>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { DataplaneOverview } from '../sources'
import type { StatsSource } from '@/app/connections/sources'

const props = defineProps<{
  data: DataplaneOverview
}>()
</script>
