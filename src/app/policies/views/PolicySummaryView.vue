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
    <AppView>
      <template #title>
        <div class="summary-title-wrapper">
          <img
            aria-hidden="true"
            src="@/assets/images/icon-circles-ext.svg?url"
          >

          <h2 class="summary-title">
            <RouterLink
              :to="{
                name: 'policy-detail-view',
                params: {
                  policy: props.name,
                },
              }"
            >
              <RouteTitle
                :title="t('policies.routes.item.title', { name: props.name })"
              />
            </RouterLink>
          </h2>
        </div>
      </template>

      <EmptyBlock v-if="props.policy === undefined">
        {{ t('common.collection.summary.empty_title', { type: props.policyType.name }) }}

        <template #message>
          <p>{{ t('common.collection.summary.empty_message', { type: props.policyType.name }) }}</p>
        </template>
      </EmptyBlock>

      <div
        v-else
        class="stack"
      >
        <div v-if="props.policy.spec?.targetRef">
          <h3>{{ t('policies.routes.item.overview') }}</h3>

          <div class="mt-4 stack">
            <DefinitionCard>
              <template #title>
                {{ t('http.api.property.targetRef') }}
              </template>

              <template #body>
                <template v-if="props.policy.spec?.targetRef">
                  <KBadge appearance="neutral">
                    {{ props.policy.spec.targetRef.kind }}<span v-if="props.policy.spec.targetRef.name">:<b>{{ props.policy.spec.targetRef.name }}</b></span>
                  </KBadge>
                </template>

                <template v-else>
                  {{ t('common.detail.none') }}
                </template>
              </template>
            </DefinitionCard>
          </div>
        </div>

        <div>
          <h3>{{ t('policies.routes.item.config') }}</h3>

          <div class="mt-4">
            <ResourceCodeBlock
              v-slot="{ copy, copying }"
              :resource="props.policy.config"
              is-searchable
              :query="route.params.codeSearch"
              :is-filter-mode="route.params.codeFilter === 'true'"
              :is-reg-exp-mode="route.params.codeRegExp === 'true'"
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
  </RouteView>
</template>

<script lang="ts" setup>
import type { Policy, PolicyType } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'

const props = withDefaults(defineProps<{
  name: string
  policy?: Policy
  policyType: PolicyType
}>(), {
  policy: undefined,
})
</script>

<style lang="scss" scoped>
.summary-title-wrapper {
  display: flex;
  align-items: baseline;
  gap: $kui-space-30;
  // Accounts for the absolutely-positioned close button
  margin-right: calc($kui-space-30 + 24px);
}

.summary-title {
  margin-top: 0;
}
</style>
