<template>
  <RouteView
    name="mesh-service-config-view"
    :params="{
      mesh: '',
      service: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      environment: String,
    }"
    v-slot="{ route, t, uri }"
  >
    <AppView>
      <XCard>
        <XLayout variant="y-stack">
          <XLayout
            variant="separated"
            justify="end"
          >
            <div
              v-for="options in [['universal', 'k8s']]"
              :key="typeof options"
            >
              <XSelect
                :label="t('services.routes.item.format')"
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
                  {{ t(`services.routes.item.formats.${value}`) }}
                </template>
              </XSelect>
            </div>
          </XLayout>

          <template v-if="route.params.environment === 'universal'">
            <DataLoader
              :data="[props.data]"
              v-slot="{ data: [service] }"
            >
              <XCodeBlock
                data-testid="codeblock-yaml-universal"
                language="yaml"
                :code="YAML.stringify(service.config)"
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

          <template v-else>
            <DataLoader
              :src="uri(sources, '/meshes/:mesh/mesh-service/:name/as/kubernetes', {
                mesh: route.params.mesh,
                name: route.params.service,
              })"
              v-slot="{ data: [k8sConfig] }"
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
import type { MeshService } from '../data'
import { sources } from '../sources'
import { YAML } from '@/app/application'
const props = defineProps<{
  data: MeshService | Error | undefined
}>()
</script>
