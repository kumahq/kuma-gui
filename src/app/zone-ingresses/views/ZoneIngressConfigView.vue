<template>
  <RouteView
    v-slot="{ route, t, uri }"
    name="zone-ingress-config-view"
    :params="{
      zoneIngress: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
  >
    <RouteTitle
      :render="false"
      :title="t('zone-ingresses.routes.item.navigation.zone-ingress-config-view')"
    />
    <AppView>
      <KCard>
        <DataLoader
          v-slot="{ data }"
          :src="uri(sources, `/zone-ingresses/:name`, {
            name: route.params.zoneIngress,
          })"
        >
          <ResourceCodeBlock
            v-slot="{ copy, copying }"
            :resource="data.config"
            is-searchable
            :query="route.params.codeSearch"
            :is-filter-mode="route.params.codeFilter"
            :is-reg-exp-mode="route.params.codeRegExp"
            @query-change="route.update({ codeSearch: $event })"
            @filter-mode-change="route.update({ codeFilter: $event })"
            @reg-exp-mode-change="route.update({ codeRegExp: $event })"
          >
            <DataSource
              v-if="copying"
              :src="uri(sources, `/zone-ingresses/:name/as/kubernetes`, {
                name: route.params.zoneIngress,
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
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
</script>
