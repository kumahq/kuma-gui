<template>
  <RouteView
    :params="{
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      mesh: '',
      dataPlane: '',
      connection: '',
    }"
    name="connection-inbound-summary-clusters-view"
    v-slot="{ route, uri }"
  >
    <RouteTitle
      :render="false"
      :title="`Clusters`"
    />
    <AppView>
      <DataLoader
        :src="uri(sources, '/meshes/:mesh/dataplanes/:name/clusters', {
          mesh: route.params.mesh,
          name: route.params.dataPlane,
        })"
        v-slot="{ data , refresh }"
      >
        <template
          v-for="prefix in [route.params.connection.replace('_', ':')]"
          :key="typeof prefix"
        >
          <DataCollection
            :items="data.split('\n')"
            :predicate="item => item.startsWith(`${prefix}::`)"
            v-slot="{ items: lines }"
          >
            <XCodeBlock
              language="json"
              :code="lines.map(item => item.replace(`${prefix}::`, '')).join('\n')"
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
          </DataCollection>
        </template>
      </DataLoader>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { sources } from '@/app/data-planes/sources'
</script>
