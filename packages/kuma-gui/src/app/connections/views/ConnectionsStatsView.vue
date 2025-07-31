<template>
  <RouteView
    :name="props.routeName"
    :params="{
      mesh: '',
      proxy: '',
      proxyType: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('data-planes.routes.item.navigation.data-plane-stats-view')"
    />
    <AppView>
      <XCard>
        <DataLoader
          :src="uri(sources, '/connections/stats/for/:proxyType/:name/:mesh/:socketAddress', {
            proxyType: ({ ingresses: 'zone-ingress', egresses: 'zone-egress'})[route.params.proxyType] ?? 'dataplane',
            name: route.params.proxy,
            mesh: route.params.mesh || '*',
            socketAddress: props.networking.inboundAddress,
          })"
          v-slot="{ data: statsData, refresh }"
        >
          <XWindow
            :resize="true"
            v-slot="{ resize }"
          >
            <div
              ref="$el"
            >
              <XCodeBlock
                :max-height="`${(resize?.target?.innerHeight ?? 0) - ($el?.getBoundingClientRect().top + 200)}`"
                language="json"
                :code="statsData.raw"
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
            </div>
          </XWindow>
        </DataLoader>
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import type { DataplaneNetworking } from '@/app/legacy-data-planes/data'

const props = defineProps<{
  networking: DataplaneNetworking
  routeName: string
}>()
</script>
