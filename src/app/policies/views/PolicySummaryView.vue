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
    }"
    v-slot="{ route, t }"
  >
    <DataCollection
      :items="props.items"
      :predicate="item => item.id === route.params.policy"
      :find="true"
    >
      <template #empty>
        <EmptyBlock>
          <template #title>
            {{ t('common.collection.summary.empty_title', { type: props.policyType.name }) }}
          </template>
          <p>{{ t('common.collection.summary.empty_message', { type: props.policyType.name }) }}</p>
        </EmptyBlock>
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
                    :title="t('policies.routes.item.title', { name: item.name })"
                  />
                </RouterLink>
              </h2>
            </template>

            <PolicySummary
              v-if="item"
              :policy="item"
            >
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
import type { Policy, PolicyType } from '../data'
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'

const props = defineProps<{
  items: Policy[]
  policyType: PolicyType
}>()
</script>
<style scoped>
h2 {
  --icon-before: url('@/assets/images/icon-circles-ext.svg?inline') !important;
}
</style>
