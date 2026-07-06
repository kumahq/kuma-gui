<template>
  <RouteView
    :params="{
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      proxyType: '',
      mesh: '',
      proxy: '',
      connection: '',
    }"
    :name="props.routeName"
    v-slot="{ route, uri }"
  >
    <RouteTitle
      :render="false"
      :title="`Clusters`"
    />
    <AppView>
      <DataLoader
        :data="[props.overview]"
        v-slot="{ data: [overviewData] }"
      >
        <DataLoader
          :src="uri(sources, `/connections/clusters/for/:proxyType/:name/:mesh`, {
            proxyType: ({ ingresses: 'zone-ingress', egresses: 'zone-egress'})[route.params.proxyType] ?? 'dataplane',
            name: overviewData.id,
            mesh: route.params.mesh || '*',
          })"
          v-slot="{ data: [clusters], refresh }"
        >
          <template
            v-for="prefix in [route.params.connection]"
            :key="typeof prefix"
          >
            <DataCollection
              :items="clusters.split('\n')"
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
      </DataLoader>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { sources } from '../sources'
import type { DataplaneOverview } from '@/app/data-planes/data'
import type { ZoneEgressOverview } from '@/app/zone-egresses/data'
import type { ZoneIngressOverview } from '@/app/zone-ingresses/data'
const props = defineProps<{
  routeName: string
  overview: DataplaneOverview | ZoneIngressOverview | ZoneEgressOverview | Error | undefined 
}>()
</script>
