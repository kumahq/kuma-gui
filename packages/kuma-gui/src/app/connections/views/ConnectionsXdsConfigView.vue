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
      includeEds: Boolean,
    }"
    v-slot="{ route, t, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('data-planes.routes.item.navigation.data-plane-xds-config-view')"
    />
    <AppView>
      <XCard>
        <DataLoader
          :src="uri(sources, `/connections/xds/for/:proxyType/:name/:mesh/:endpoints`, {
            proxyType: ({ ingresses: 'zone-ingress', egresses: 'zone-egress' })[route.params.proxyType] ?? 'dataplane',
            name: route.params.proxy,
            mesh: route.params.mesh || '*',
            endpoints: String(route.params.includeEds),
          })"
          v-slot="{ data, refresh }"
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
                :code="JSON.stringify(data, null, 2)"
                is-searchable
                :query="route.params.codeSearch"
                :is-filter-mode="route.params.codeFilter"
                :is-reg-exp-mode="route.params.codeRegExp"
                @filter-mode-change="route.update({ codeFilter: $event })"
                @reg-exp-mode-change="route.update({ codeRegExp: $event })"
              >
                <template #primary-actions>
                  <XCheckbox
                    :checked="route.params.includeEds"
                    label="Include Endpoints"
                    @change="(value) => route.update({ includeEds: value })"
                  />
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
const props = defineProps<{
  routeName: string
}>()
</script>
