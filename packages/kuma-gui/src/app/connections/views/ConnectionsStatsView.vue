<template>
  <RouteView
    :name="props.routeName"
    :params="{
      mesh: '',
      dataPlane: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('data-planes.routes.item.navigation.data-plane-stats-view')"
    />
    <AppView>
      <XCard>
        <DataLoader
          :src="uri(sources, '/meshes/:mesh/dataplanes/:name/stats/:address', {
            mesh: route.params.mesh,
            name: route.params.dataPlane,
            address: props.networking.inboundAddress,
          })"
          v-slot="{ data: statsData, refresh }"
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
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import type { DataplaneNetworking } from '@/app/data-planes/data'

const props = defineProps<{
  networking: DataplaneNetworking
  routeName: string
}>()
</script>
