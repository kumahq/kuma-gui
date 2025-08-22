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
        :src="uri(sources, `/connections/clusters/for/:proxyType/:name/:mesh`, {
          proxyType: ({ ingresses: 'zone-ingress', egresses: 'zone-egress'})[route.params.proxyType] ?? 'dataplane',
          name: route.params.proxy,
          mesh: route.params.mesh || '*',
        })"
        v-slot="{ data: connections, refresh }"
      >
        <template
          v-for="prefix in ['proxyResourceName' in props.data ? ContextualKri.toString({ ...ContextualKri.fromString(props.data.proxyResourceName), sectionName: props.data.port.toString() }) : ('clusterName' in props.data ? props.data.clusterName : route.params.connection).replace('_', ':')]"
          :key="typeof prefix"
        >
          <DataCollection
            :items="connections.split('\n')"
            :predicate="item => item.startsWith(`${prefix}`)"
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
import { sources } from '../sources'
import { DataplaneNetworkingLayout } from '@/app/data-planes/data'
import type { DataplaneInbound } from '@/app/data-planes/data'
import { ContextualKri } from '@/app/kuma/kri'
const props = defineProps<{
  routeName: string
  data: DataplaneInbound | DataplaneNetworkingLayout['inbounds'][number]
}>()
</script>
