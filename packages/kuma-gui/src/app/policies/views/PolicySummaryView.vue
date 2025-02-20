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
    v-slot="{ route, t }"
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
                    <div v-if="item.spec">
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
                :resource="item.config"
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
          </AppView>
        </template>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import PolicySummary from '../components/PolicySummary.vue'
import type { Policy, PolicyResourceType } from '../data'
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
