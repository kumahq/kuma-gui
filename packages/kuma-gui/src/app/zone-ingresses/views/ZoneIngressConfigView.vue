<template>
  <RouteView
    name="zone-ingress-config-view"
    :params="{
      proxy: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      environment: String,
    }"
    v-slot="{ route, t, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('zone-ingresses.routes.item.navigation.zone-ingress-config-view')"
    />
    <AppView>
      <XCard>
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
                :label="t('zone-ingresses.routes.items.format')"
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
                  {{ t(`zone-ingresses.routes.items.formats.${value}`) }}
                </template>
              </XSelect>
            </div>
          </XLayout>

          <template v-if="route.params.environment === 'universal'">
            <DataLoader
              :src="uri(sources, `/zone-ingresses/:name`, {
                name: route.params.proxy,
              })"
              v-slot="{ data }"
            >
              <XCodeBlock
                data-testid="codeblock-yaml-universal"
                language="yaml"
                :code="YAML.stringify(data.config)"
                :show-k8s-copy-button="false"
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
              :src="uri(sources, `/zone-ingresses/:name/as/kubernetes`, {
                name: route.params.proxy,
              })"
              v-slot="{ data: k8sConfig }"
            >
              <XCodeBlock
                data-testid="codeblock-yaml-k8s"
                language="yaml"
                :code="YAML.stringify(k8sConfig)"
                :show-k8s-copy-button="false"
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
import { sources } from '../sources'
import { YAML } from '@/app/application'
</script>
