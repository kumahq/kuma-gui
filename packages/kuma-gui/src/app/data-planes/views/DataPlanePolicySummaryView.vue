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
    v-slot="{ route, t }"
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
                  <div v-if="data.spec">
                    <XSelect
                      :label="t('policies.routes.item.format')"
                      :selected="route.params.format"
                      @change="(value) => {
                        route.update({ format: value })
                      }"
                    >
                      <template
                        v-for="value in ['structured', 'yaml']"
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
import PolicySummary from '@/app/policies/components/PolicySummary.vue'
import { PolicySource } from '@/app/policies/sources'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'
</script>

<style scoped>
h2 {
  --icon-before: url('@/assets/images/icon-circles-ext.svg?inline') !important;
}
</style>
