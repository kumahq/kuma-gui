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
      :src="`/meshes/${route.params.mesh}/policy-path/${route.params.policyPath}/policy/${route.params.policy}`"
      v-slot="{ data, error }: PolicySource"
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
                :title="t('policies.routes.item.title', { name: route.params.policy })"
              />
            </XAction>
          </h2>
        </template>
        <DataLoader
          :data="[data]"
          :errors="[error]"
        >
          <PolicySummary
            v-if="data"
            :policy="data"
            :format="route.params.format"
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
                  <div>
                    <XSelect
                      :label="t('policies.routes.item.format')"
                      :selected="data.spec || ['k8s', 'universal'].includes(route.params.format) ? route.params.format : 'universal'"
                      @change="(value) => {
                        route.update({ format: value })
                      }"
                      @vue:before-mount="!data.spec && $event?.props?.selected && ['k8s', 'universal'].includes($event.props.selected) && $event.props.selected !== route.params.format && route.update({ format: $event.props.selected })"
                    >
                      <template
                        v-for="value in [...(data.spec ? ['structured'] : []), 'k8s', 'universal']"
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
                :resource="data.config"
                is-searchable
                :query="route.params.codeSearch"
                :is-filter-mode="route.params.codeFilter"
                :is-reg-exp-mode="route.params.codeRegExp"
                @query-change="route.update({ codeSearch: $event })"
                @filter-mode-change="route.update({ codeFilter: $event })"
                @reg-exp-mode-change="route.update({ codeRegExp: $event })"
                v-slot="{ copy, copying }"
              >
                <DataSource
                  v-if="copying"
                  :src="uri(sources, '/meshes/:mesh/policy-path/:path/policy/:name/as/kubernetes', {
                    mesh: route.params.mesh,
                    path: route.params.policyPath,
                    name: route.params.policy,
                  }, {
                    cacheControl: 'no-store',
                  })"
                  @change="(data) => {
                    copy((resolve) => resolve(data))
                  }"
                  @error="(e) => {
                    copy((_resolve, reject) => reject(e))
                  }"
                />
              </ResourceCodeBlock>
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
                  :resource="k8sConfig"
                  is-searchable
                  :query="route.params.codeSearch"
                  :is-filter-mode="route.params.codeFilter"
                  :is-reg-exp-mode="route.params.codeRegExp"
                  :show-k8s-copy-button="false"
                  @query-change="route.update({ codeSearch: $event })"
                  @filter-mode-change="route.update({ codeFilter: $event })"
                  @reg-exp-mode-change="route.update({ codeRegExp: $event })"
                />
              </DataLoader>
            </template>
            
            <template v-else>
              <ResourceCodeBlock
                :resource="data.config"
                is-searchable
                :query="route.params.codeSearch"
                :is-filter-mode="route.params.codeFilter"
                :is-reg-exp-mode="route.params.codeRegExp"
                @query-change="route.update({ codeSearch: $event })"
                @filter-mode-change="route.update({ codeFilter: $event })"
                @reg-exp-mode-change="route.update({ codeRegExp: $event })"
                v-slot="{ copy, copying }"
              >
                <DataSource
                  v-if="copying"
                  :src="`/meshes/${route.params.mesh}/policy-path/${route.params.policyPath}/policy/${route.params.policy}/as/kubernetes?no-store`"
                  @change="(data) => {
                    copy((resolve) => resolve(data))
                  }"
                  @error="(e) => {
                    copy((_resolve, reject) => reject(e))
                  }"
                />
              </ResourceCodeBlock>
            </template>
          </PolicySummary>
        </DataLoader>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import PolicySummary from '@/app/policies/components/PolicySummary.vue'
import { type PolicySource , sources } from '@/app/policies/sources'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'
</script>

<style scoped>
h2 {
  --icon-before: url('@/assets/images/icon-circles-ext.svg?inline') !important;
}
</style>
