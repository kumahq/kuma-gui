<template>
  <RouteView
    name="data-plane-policy-summary-view"
    :params="{
      mesh: '',
      policyPath: '',
      policy: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      format: String,
    }"
    v-slot="{ route, t, uri }"
  >
    <DataSource
      :src="uri(sources, '/policy-path/:path/policy/:kri', {
        path: route.params.policyPath,
        kri: route.params.policy,
      })"
      v-slot="{ data, error }"
    >
      <AppView>
        <template #title>
          <DataLoader
            :data="[data]"
            variant="header"
            v-slot="{ data: [policy] }"
          >
            <h2>
              <XAction
                :to="{
                  name: 'policy-detail-view',
                  params: {
                    mesh: route.params.mesh,
                    policyPath: route.params.policyPath,
                    policy: policy.kri,
                  },
                }"
              >
                <RouteTitle
                  :title="t('policies.routes.item.title', { name: policy.name })"
                />
              </XAction>
            </h2>
          </DataLoader>
        </template>
        <DataLoader
          :data="[data]"
          :errors="[error]"
          v-slot="{ data: [policy] }"
        >
          <PolicySummary
            :policy="policy"
            :format="route.params.format"
            :legacy="!props.policyTypes.find(({ name }) => name === data?.type )?.policy.isTargetRef"
          >
            <template #header>
              <header>
                <XLayout
                  variant="separated"
                  size="max"
                >
                  <h3>
                    {{ t('policies.routes.item.config') }}
                  </h3>
                  <div
                    v-for="options in [['structured', 'universal', 'k8s']]"
                    :key="typeof options"
                  >
                    <XSelect
                      :label="t('policies.routes.item.format')"
                      :selected="options.includes(route.params.format) ? route.params.format : options[0]"
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
                        {{ t(`policies.routes.item.formats.${value}`) }}
                      </template>
                    </XSelect>
                  </div>
                </XLayout>
              </header>
            </template>

            <template v-if="route.params.format === 'universal'">
              <XCodeBlock
                data-testid="codeblock-yaml-universal"
                language="yaml"
                :code="policy.yaml"
                is-searchable
                :query="route.params.codeSearch"
                :is-filter-mode="route.params.codeFilter"
                :is-reg-exp-mode="route.params.codeRegExp"
                @query-change="route.update({ codeSearch: $event })"
                @filter-mode-change="route.update({ codeFilter: $event })"
                @reg-exp-mode-change="route.update({ codeRegExp: $event })"
              />
            </template>

            <template v-else-if="route.params.format === 'k8s'">
              <DataLoader
                :src="uri(sources, '/policy-path/:path/policy/:kri/as/kubernetes', {
                  path: route.params.policyPath,
                  kri: route.params.policy,
                })"
                v-slot="{ data: [yaml] }"
              >
                <XCodeBlock
                  data-testid="codeblock-yaml-k8s"
                  language="yaml"
                  :code="yaml"
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
          </PolicySummary>
        </DataLoader>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import PolicySummary from '@/app/policies/components/PolicySummary.vue'
import type { PolicyResourceType } from '@/app/policies/data'
import { sources } from '@/app/policies/sources'
const props = defineProps<{
  policyTypes: PolicyResourceType[]
}>()
</script>

<style scoped>
h2 {
  --icon-before: url('@/assets/images/icon-circles-ext.svg?inline') !important;
}
</style>
