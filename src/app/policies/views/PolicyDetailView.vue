<template>
  <RouteView
    v-slot="{ route, t }"
    name="policy-detail-view"
    :params="{
      mesh: '',
      policy: '',
      policyPath: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
  >
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'mesh-detail-view',
            params: {
              mesh: route.params.mesh,
            },
          },
          text: route.params.mesh,
        },
        {
          to: {
            name: 'policy-list-view',
            params: {
              mesh: route.params.mesh,
              policyPath: route.params.policyPath,
            },
          },
          text: t('policies.routes.item.breadcrumbs'),
        },
      ]"
    >
      <template #title>
        <h1>
          <TextWithCopyButton :text="route.params.policy">
            <RouteTitle
              :title="t('policies.routes.item.title', { name: route.params.policy })"
            />
          </TextWithCopyButton>
        </h1>
      </template>

      <DataSource
        v-slot="{ data, error }: PolicySource"
        :src="`/meshes/${route.params.mesh}/policy-path/${route.params.policyPath}/policy/${route.params.policy}`"
      >
        <ErrorBlock
          v-if="error"
          :error="error"
        />

        <LoadingBlock v-else-if="data === undefined" />

        <div
          v-else
          class="stack"
          data-testid="detail-view-details"
        >
          <KCard>
            <h2>{{ t('policies.detail.affected_dpps') }}</h2>

            <PolicyConnections
              class="mt-4"
              :mesh="route.params.mesh"
              :policy-name="route.params.policy"
              :policy-path="route.params.policyPath"
            />
          </KCard>

          <ResourceCodeBlock
            id="code-block-policy"
            :resource="data"
            :resource-fetcher="(params) => kumaApi.getSinglePolicyEntity({
              name: route.params.policy,
              mesh: route.params.mesh,
              path: route.params.policyPath,
            }, params)"
            is-searchable
            :query="route.params.codeSearch"
            :is-filter-mode="route.params.codeFilter === 'true'"
            :is-reg-exp-mode="route.params.codeRegExp === 'true'"
            @query-change="route.update({ codeSearch: $event })"
            @filter-mode-change="route.update({ codeFilter: $event })"
            @reg-exp-mode-change="route.update({ codeRegExp: $event })"
          />
        </div>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import PolicyConnections from '../components/PolicyConnections.vue'
import type { PolicySource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import ResourceCodeBlock from '@/app/common/ResourceCodeBlock.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import { useKumaApi } from '@/utilities'

const kumaApi = useKumaApi()
</script>
