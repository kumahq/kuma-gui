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
        :src="uri(sources, '/connections/stats/for/:proxyType/:name/:mesh/:socketAddress', {
          proxyType: ({ ingresses: 'zone-ingress', egresses: 'zone-egress'})[route.params.proxyType] ?? 'dataplane',
          name: route.params.proxy,
          mesh: route.params.mesh || '*',
          socketAddress: props.networking.inboundAddress,
        })"
        v-slot="{ data: stats, refresh }"
      >
        <DataCollection
          :items="stats.raw.split('\n')"
          :predicate="item => {
            return [
              `listener.${data.listenerAddress?.length > 0 ? data.listenerAddress : route.params.connection}`,
              `cluster.${data.name}.`,
              `cluster.${data.clusterName}.`,
              `http.${data.name}.`,
              `http.${data.clusterName}.`,
              `tcp.${data.name}.`,
              `cluster.${data.proxyResourceName}.`,
              `listener.${data.proxyResourceName}`,
              `cluster.${data.proxyResourceName}.`,
              `http.${data.proxyResourceName}.`,
              `http.${data.proxyResourceName}.`,
              `tcp.${data.proxyResourceName}.`,
            ].some(prefix => item.startsWith(prefix)) && (!item.includes('.rds.') || item.includes(`_${data.port}`) || item.includes(`${data.servicePort}`))}"
          v-slot="{ items: lines }"
        >
          <XCodeBlock
            language="json"
            :code="lines.map(item => item.replace(`${data.listenerAddress?.length > 0 ? data.listenerAddress : data.proxyResourceName.length ? data.proxyResourceName : route.params.connection}.`, '').replace( data.name.length ? `${data.name}.` : '', '').replace(data.clusterName.length ? `${data.clusterName}.` : '', '')).join('\n')"
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
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

import { sources } from '../sources'
import type { DataplaneNetworkingLayout , DataplaneInbound, DataplaneNetworking } from '@/app/data-planes/data'
import { ContextualKri } from '@/app/kuma/kri'
import type { ZoneEgress } from '@/app/zone-egresses/data/'
import type { ZoneIngress } from '@/app/zone-ingresses/data/'


const props = defineProps<{
  data: DataplaneInbound | DataplaneNetworkingLayout['inbounds'][number]
  networking: DataplaneNetworking | ZoneIngress['networking'] | ZoneEgress['networking']
  routeName: string
}>()

const data = computed(() => ({
  ...props.data,
  proxyResourceName: 'proxyResourceName' in props.data ? ContextualKri.toString({...ContextualKri.fromString(props.data.proxyResourceName), sectionName: props.data.port.toString() }) : '',
  listenerAddress: 'listenerAddress' in props.data ? props.data.listenerAddress : '',
  clusterName: 'clusterName' in props.data ? props.data.clusterName : '',
  port: 'port' in props.data ? props.data.port.toString() : '',
  servicePort: 'servicePort' in props.data ? props.data.servicePort : '',
  name: 'name' in props.data ? props.data.name : '',
}))
</script>
