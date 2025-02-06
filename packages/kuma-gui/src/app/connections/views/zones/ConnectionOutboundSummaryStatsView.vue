<template>
  <RouteView
    :params="{
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
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
        :src="uri(sources, '/connections/stats/for/:proxyType/:name/:socketAddress', {
          name: route.params.proxy,
          socketAddress: props.networking.inboundAddress,
          proxyType: route.params.proxyType === 'ingresses' ? 'zone-ingress' : 'zone-egress',
        })"

        v-slot="{ data, refresh }"
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
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { sources } from '@/app/connections/sources'
import type { ZoneEgress } from '@/app/zone-egresses/data/'
import type { ZoneIngress } from '@/app/zone-ingresses/data/'
const props = defineProps<{
  networking: ZoneIngress['networking'] | ZoneEgress['networking']
  routeName: string
}>()
</script>
