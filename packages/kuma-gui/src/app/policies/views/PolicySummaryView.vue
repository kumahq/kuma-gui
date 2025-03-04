<template>
  <RouteView
    name="policy-summary-view"
    :params="{
      mesh: '',
      policyPath: '',
      policy: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      format: String,
    }"
    v-slot="{ uri, route, t }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.id === route.params.policy"
      :find="true"
    >
      <template #empty>
        <XEmptyState>
          <template #title>
            <h2>
              {{ t('common.collection.summary.empty_title', { type: props.policyType.name }) }}
            </h2>
          </template>
          <p>
            {{ t('common.collection.summary.empty_message', { type: props.policyType.name }) }}
          </p>
        </XEmptyState>
      </template>
      <template
        #default="{ items: policies }"
      >
        <template
          v-for="item in [policies[0]]"
          :key="item.id"
        >
          <AppView>
            <template #title>
              <h2>
                <XAction
                  :to="{
                    name: 'policy-detail-view',
                    params: {
                      mesh: route.params.mesh,
                      policyPath: route.params.policyPath,
                      policy: route.params.policy,
                    },
                  }"
                >
                  <RouteTitle
                    :title="t('policies.routes.item.title', { name: item.name })"
                  />
                </XAction>
              </h2>
            </template>
            <PolicySummary
              v-if="item"
              :policy="item"
              :format="route.params.format"
              :legacy="!props.policyType.policy?.isTargetRef"
            >
              <template #header>
                <header>
                  <XLayout
                    type="separated"
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
                <ResourceCodeBlock
                  data-testid="codeblock-yaml-universal"
                  language="yaml"
                  :resource="item.config"
                  is-searchable
                  :show-k8s-copy-button="false"
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
                  :src="uri(sources, '/meshes/:mesh/policy-path/:path/policy/:name/as/kubernetes', {
                    mesh: route.params.mesh,
                    path: route.params.policyPath,
                    name: route.params.policy,
                  })"
                  v-slot="{ data: k8sConfig }"
                >
                  <ResourceCodeBlock
                    data-testid="codeblock-yaml-k8s"
                    language="yaml"
                    :resource="k8sConfig"
                    is-searchable
                    :show-k8s-copy-button="false"
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
          </AppView>
        </template>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import PolicySummary from '../components/PolicySummary.vue'
import type { Policy, PolicyResourceType } from '../data'
import { sources } from '../sources'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'

const props = defineProps<{
  items: Policy[]
  policyType: PolicyResourceType
}>()
</script>
<style scoped>
h2 {
  --icon-before: url('@/assets/images/policy.svg?inline') !important;
}
</style>
