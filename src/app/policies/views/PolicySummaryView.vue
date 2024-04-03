<template>
  <RouteView
    v-slot="{ route, t }"
    name="policy-summary-view"
    :params="{
      mesh: '',
      policyPath: '',
      policy: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
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
                    :title="t('policies.routes.item.title', { name: route.params.policy })"
                  />
                </RouterLink>
              </h2>
            </template>

            <div
              class="stack"
            >
              <div v-if="item.spec?.targetRef">
                <h3>{{ t('policies.routes.item.overview') }}</h3>

                <div class="mt-4 stack">
                  <DefinitionCard
                    layout="horizontal"
                  >
                    <template #title>
                      {{ t('http.api.property.targetRef') }}
                    </template>

                    <template #body>
                      <template v-if="item.spec?.targetRef">
                        <KBadge appearance="neutral">
                          {{ item.spec.targetRef.kind }}<span v-if="item.spec.targetRef.name">:<b>{{ item.spec.targetRef.name }}</b></span>
                        </KBadge>
                      </template>

                      <template v-else>
                        {{ t('common.detail.none') }}
                      </template>
                    </template>
                  </DefinitionCard>
                  <DefinitionCard
                    v-if="item.namespace.length > 0"
                    layout="horizontal"
                  >
                    <template #title>
                      {{ t('data-planes.routes.item.namespace') }}
                    </template>

                    <template #body>
                      {{ item.namespace }}
                    </template>
                  </DefinitionCard>
                </div>
              </div>

              <div>
                <h3>{{ t('policies.routes.item.config') }}</h3>

                <div class="mt-4">
                  <ResourceCodeBlock
                    v-slot="{ copy, copying }"
                    :resource="item.config"
                    is-searchable
                    :query="route.params.codeSearch"
                    :is-filter-mode="route.params.codeFilter"
                    :is-reg-exp-mode="route.params.codeRegExp"
                    @query-change="route.update({ codeSearch: $event })"
                    @filter-mode-change="route.update({ codeFilter: $event })"
                    @reg-exp-mode-change="route.update({ codeRegExp: $event })"
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
                </div>
              </div>
            </div>
          </AppView>
        </template>
      </template>
    </DataCollection>
  </RouteView>
</template>

<script lang="ts" setup>
import type { Policy, PolicyType } from '../data'
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
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
