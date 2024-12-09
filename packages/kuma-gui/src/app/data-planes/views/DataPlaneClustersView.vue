<template>
  <RouteView
    name="data-plane-clusters-view"
    :params="{
      mesh: '',
      dataPlane: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t, uri }"
  >
    <AppView>
      <RouteTitle
        :render="false"
        :title="t('data-planes.routes.item.navigation.data-plane-clusters-view')"
      />
      <KCard>
        <DataLoader
          :src="uri(sources, '/meshes/:mesh/dataplanes/:name/clusters', {
            mesh: route.params.mesh,
            name: route.params.dataPlane,
          })"
          v-slot="{ data, refresh }"
        >
          <XCodeBlock
            language="json"
            :code="data"
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
import { sources } from '@/app/connections/sources'
</script>
