<template>
  <RouteView
    name="data-plane-xds-config-view"
    :params="{
      mesh: '',
      dataPlane: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      includeEds: false,
    }"
    v-slot="{ route, t, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('data-planes.routes.item.navigation.data-plane-xds-config-view')"
    />
    <AppView>
      <KCard>
        <DataLoader
          :src="uri(sources, '/meshes/:mesh/dataplanes/:name/xds/:endpoints', {
            mesh: route.params.mesh,
            name: route.params.dataPlane,
            endpoints: String(route.params.includeEds),
          })"
          v-slot="{ data, refresh }"
        >
          <XCodeBlock
            language="json"
            :code="JSON.stringify(data, null, 2)"
            is-searchable
            :query="route.params.codeSearch"
            :is-filter-mode="route.params.codeFilter"
            :is-reg-exp-mode="route.params.codeRegExp"
            @query-change="route.update({ codeSearch: $event })"
            @filter-mode-change="route.update({ codeFilter: $event })"
            @reg-exp-mode-change="route.update({ codeRegExp: $event })"
          >
            <template #primary-actions>
              <XCheckbox
                v-model="route.params.includeEds"
                label="Include Endpoints"
              />
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
import { sources } from '../sources'
</script>
