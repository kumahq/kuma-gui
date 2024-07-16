<template>
  <RouteView
    name="builtin-gateway-config-view"
    :params="{
      mesh: '',
      gateway: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('builtin-gateways.routes.item.navigation.builtin-gateway-config-view')"
    />
    <AppView>
      <KCard>
        <DataLoader
          :src="uri(sources, `/meshes/:mesh/mesh-gateways/:name`, {
            mesh: route.params.mesh,
            name: route.params.gateway,
          })"
          v-slot="{ data }"
        >
          <ResourceCodeBlock
            data-testid="config"
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
              :src="uri(sources, `/meshes/:mesh/mesh-gateways/:name/as/kubernetes`, {
                mesh: route.params.mesh,
                name: route.params.gateway,
              }, {
                cacheControl: 'no-store',
              })"
              @change="(data) => {
                copy((resolve) => resolve(data))
              }"
              @error="(error) => {
                copy((_resolve, reject) => reject(error))
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
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
</script>
