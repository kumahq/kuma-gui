<template>
  <RouteView
    name="builtin-gateway-config-view"
    :params="{
      mesh: '',
      gateway: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      format: String,
    }"
    v-slot="{ route, t, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('builtin-gateways.routes.item.navigation.builtin-gateway-config-view')"
    />
    <AppView>
      <XCard>
        <DataLoader
          :src="uri(sources, `/meshes/:mesh/mesh-gateways/:name`, {
            mesh: route.params.mesh,
            name: route.params.gateway,
          })"
          v-slot="{ data }"
        >
          <XLayout>
            <XLayout
              type="separated"
              justify="end"
            >
              <div
                v-for="options in [['universal', 'k8s']]"
                :key="typeof options"
              >
                <XSelect
                  :label="t('gateways.routes.item.format')"
                  :selected="route.params.format"
                  @change="(value) => {
                    route.update({ format: value })
                  }"
                  @vue:before-mount="$event?.props?.selected && options.includes($event.props.selected) && $event.props.selected !== route.params.format && route.update({ format: $event.props.selected })"
                >
                  <template
                    v-for="value in options"
                    :key="value"
                    #[`${value}-option`]
                  >
                    {{ t(`gateways.routes.item.formats.${value}`) }}
                  </template>
                </XSelect>
              </div>
            </XLayout>

            <template v-if="route.params.format === 'universal'">
              <XCodeBlock
                data-testid="codeblock-yaml-universal"
                language="yaml"
                :code="YAML.stringify(data.config)"
                is-searchable
                :query="route.params.codeSearch"
                :is-filter-mode="route.params.codeFilter"
                :is-reg-exp-mode="route.params.codeRegExp"
                @query-change="route.update({ codeSearch: $event })"
                @filter-mode-change="route.update({ codeFilter: $event })"
                @reg-exp-mode-change="route.update({ codeRegExp: $event })"
              />
            </template>

            <template v-else>
              <DataLoader
                :src="uri(sources, `/meshes/:mesh/mesh-gateways/:name/as/kubernetes`, {
                  mesh: route.params.mesh,
                  name: route.params.gateway,
                })"
                v-slot="{ data: k8sConfig }"
              >
                <XCodeBlock
                  data-testid="builtin-gateway-config-k8s"
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
        </DataLoader>
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import { YAML } from '@/app/application'
</script>
