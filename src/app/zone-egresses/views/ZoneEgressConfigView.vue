<template>
  <RouteView
    name="zone-egress-config-view"
    :params="{
      zoneEgress: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('zone-egresses.routes.item.navigation.zone-egress-config-view')"
    />
    <AppView>
      <KCard>
        <DataLoader
          :src="uri(sources, `/zone-egresses/:name`, {
            name: route.params.zoneEgress,
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
              :src="uri(sources, `/zone-egresses/:name/as/kubernetes`, {
                name: route.params.zoneEgress,
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
