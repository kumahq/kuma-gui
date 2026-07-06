<template>
  <RouteView
    :params="{
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      mesh: '',
      proxy: '',
      proxyType: '',
      connection: '',
    }"
    :name="props.routeName"
    v-slot="{ route, uri }"
  >
    <RouteTitle
      :render="false"
      :title="`Stats`"
    />
    <AppView>
      <DataLoader
        :data="[props.overview]"
        v-slot="{ data: [overviewData] }"
      >
        <DataLoader
          :src="uri(sources, '/connections/stats/for/:proxyType/:name/:mesh/:socketAddress', {
            proxyType: ({ ingresses: 'zone-ingress', egresses: 'zone-egress'})[route.params.proxyType] ?? 'dataplane',
            name: overviewData.id,
            mesh: route.params.mesh || '*',
            socketAddress: props.networking.inboundAddress,
          })"

          v-slot="{ data: [data], refresh }"
        >
          <DataCollection
            :items="data.raw.split('\n')"
            :predicate="item => item.includes(`.${route.params.connection}.`)"
            v-slot="{ items: lines }"
          >
            <XCodeBlock
              language="json"
              :code="lines.map((item) => item.replace(`${route.params.connection}.`, '')).join('\n')"
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
        </DataLoader>
      </DataLoader>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { sources } from '../sources'
import type { DataplaneNetworking, DataplaneOverview } from '@/app/data-planes/data/'
import type { ZoneEgressOverview } from '@/app/zone-egresses/data'
import type { ZoneIngressOverview } from '@/app/zone-ingresses/data'
const props = defineProps<{
  networking: DataplaneNetworking
  routeName: string
  overview: DataplaneOverview | ZoneIngressOverview | ZoneEgressOverview | Error | undefined 
}>()
</script>
