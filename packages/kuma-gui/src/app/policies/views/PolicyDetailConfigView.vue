<template>
  <RouteView
    name="policy-detail-config-view"
    :params="{
      mesh: '',
      policy: '',
      policyPath: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      environment: String,
    }"
    v-slot="{ route, uri, t }"
  >
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
                :label="t('policies.routes.item.format')"
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
                  {{ t(`policies.routes.item.formats.${value}`) }}
                </template>
              </XSelect>
            </div>
          </XLayout>

          <template v-if="route.params.environment === 'universal'">
            <XCodeBlock
              data-testid="codeblock-yaml-universal"
              language="yaml"
              :code="YAML.stringify(props.data.config)"
              :show-k8s-copy-button="false"
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
              :src="uri(sources, '/meshes/:mesh/policy-path/:path/policy/:name/as/kubernetes', {
                mesh: route.params.mesh,
                path: route.params.policyPath,
                name: route.params.policy,
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
import type { Policy } from '../data'
import { sources } from '../sources'
import { YAML } from '@/app/application'
const props = defineProps<{
  data: Policy
}>()
</script>
