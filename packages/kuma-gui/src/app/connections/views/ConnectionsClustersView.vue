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
    <AppView>
      <RouteTitle
        :render="false"
        :title="t('data-planes.routes.item.navigation.data-plane-clusters-view')"
      />
      <XCard>
        <DataLoader
          :data="[props.data]"
          v-slot="{ data: [overviewData]}"
        >
          <DataLoader
            :src="uri(sources, `/connections/clusters/for/:proxyType/:name/:mesh`, {
              proxyType: ({ ingresses: 'zone-ingress', egresses: 'zone-egress'})[route.params.proxyType] ?? 'dataplane',
              name: overviewData.id,
              mesh: route.params.mesh || '*',
            })"
            v-slot="{ data: [clusters], refresh }"
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
                  :code="clusters"
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
        </DataLoader>
      </XCard>
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
  data: DataplaneOverview | ZoneIngressOverview | ZoneEgressOverview | Error | undefined
}>()
</script>
