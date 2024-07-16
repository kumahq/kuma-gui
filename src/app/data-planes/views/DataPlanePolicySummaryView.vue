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
    }"
    v-slot="{ route, t }"
  >
    <DataSource
      :src="`/meshes/${route.params.mesh}/policy-path/${route.params.policyPath}/policy/${route.params.policy}`"
      v-slot="{ data, error }: PolicySource"
    >
      <AppView>
        <template #title>
          <h2>
            <RouterLink
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
            </RouterLink>
          </h2>
        </template>
        <DataLoader
          :data="[data]"
          :errors="[error]"
        >
          <PolicySummary
            v-if="data"
            :policy="data"
          >
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
          </PolicySummary>
        </DataLoader>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
import PolicySummary from '@/app/policies/components/PolicySummary.vue'
import { PolicySource } from '@/app/policies/sources'
</script>

<style scoped>
h2 {
  --icon-before: url('@/assets/images/icon-circles-ext.svg?inline') !important;
}
</style>
