<template>
  <RouteView
    name="workload-config-view"
    :params="{
      mesh: '',
      wl: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      environment: String,
    }"
    v-slot="{ route, t, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('workloads.routes.item.navigation.workload-config-view')"
    />
    <AppView>
      <XCard>
        <XLayout>
          <XLayout
            variant="separated"
            justify="end"
          >
            <div
              v-for="options in [['universal', 'k8s']]"
              :key="typeof options"
            >
              <XSelect
                :label="t('workloads.routes.item.format')"
                :selected="route.params.environment"
                @change="(value) => {
                  route.update({ environment: value })
                }"
                @vue:before-mount="$event?.props?.selected && options.includes($event.props.selected) && $event.props.selected !== route.params.environment && route.update({ environment: $event.props.selected })"
              >
                <template
                  v-for="value in options"
                  :key="value"
                  #[`${value}-option`]
                >
                  {{ t(`workloads.routes.item.formats.${value}`) }}
                </template>
              </XSelect>
            </div>
          </XLayout>
          <template v-if="route.params.environment === 'universal'">
            <DataLoader
              :data="[props.data]"
            >
              <template v-if="typeof props.data !== 'undefined' && !(props.data instanceof Error)">
                <XCodeBlock
                  data-testid="codeblock-yaml-universal"
                  language="yaml"
                  :code="YAML.stringify(props.data.$raw)"
                  is-searchable
                  :query="route.params.codeSearch"
                  :is-filter-mode="route.params.codeFilter"
                  :is-reg-exp-mode="route.params.codeRegExp"
                  @query-change="route.update({ codeSearch: $event })"
                  @filter-mode-change="route.update({ codeFilter: $event })"
                  @reg-exp-mode-change="route.update({ codeRegExp: $event })"
                />
              </template>
            </DataLoader>
          </template>
          <template v-else>
            <DataLoader
              :src="uri(sources, '/workloads/:wl/as/kubernetes', {
                wl: route.params.wl,
              })"
              v-slot="{ data: k8sConfig }"
            >
              <XCodeBlock
                data-testid="codeblock-yaml-k8s"
                language="yaml"
                :code="YAML.stringify(k8sConfig)"
                is-searchable
                :query="route.params.codeSearch"
                :is-filter-mode="route.params.codeFilter"
                :is-reg-exp-mode="route.params.codeRegExp"
                @query-change="route.update({ codeSearch: $event })"
                @filter-mode-change="route.update({ codeFilter: $event })"
                @reg-exp-mode-change="route.update({ codeRegExp: $event })"
              />
            </DataLoader>
          </template>
        </XLayout>
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { YAML } from '@/app/application'
import type { WorkloadItem } from '@/app/workloads/data'
import { sources } from '@/app/workloads/sources'
const props = defineProps<{
  data: WorkloadItem | Error | undefined
}>()
</script>
