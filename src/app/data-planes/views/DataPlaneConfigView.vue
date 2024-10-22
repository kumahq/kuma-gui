<template>
  <RouteView
    name="data-plane-config-view"
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
      :title="t('data-planes.routes.item.navigation.data-plane-config-view')"
    />
    <AppView>
      <KCard>
        <DataLoader
          :src="uri(sources, `/meshes/:mesh/dataplanes/:name`, {
            mesh: route.params.mesh,
            name: route.params.dataPlane,
          })"
          v-slot="{ data }"
        >
          <ResourceCodeBlock
            :resource="data.config"
            is-searchable
            :query="route.params.codeSearch"
            :is-filter-mode="route.params.codeFilter"
            :is-reg-exp-mode="route.params.codeRegExp"
            @query-change="route.update({ codeSearch: $event })"
            @filter-mode-change="route.update({ codeFilter: $event })"
            @reg-exp-mode-change="route.update({ codeRegExp: $event })"
            v-slot="{ copy, copying }"
          >
            <DataSource
              v-if="copying"
              :src="uri(sources, `/meshes/:mesh/dataplanes/:name/as/kubernetes`, {
                mesh: route.params.mesh,
                name: route.params.dataPlane,
              }, {
                cacheControl: 'no-store',
              })"
              @change="(data) => {
                copy((resolve) => resolve(data))
              }"
              @error="(e) => {
                copy((_resolve, reject) => reject(e))
              }"
            />
          </ResourceCodeBlock>
        </DataLoader>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'
</script>
