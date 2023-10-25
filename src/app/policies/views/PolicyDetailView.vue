<template>
  <RouteView
    v-slot="{ route, t }"
    name="policy-detail-view"
    :params="{
      mesh: '',
      policy: '',
      policyPath: '',
    }"
  >
    <DataSource
      v-slot="{ data: policyTypesData, error: policyTypesError }: PolicyTypeCollectionSource"
      :src="`/*/policy-types`"
    >
      <ErrorBlock
        v-if="policyTypesError"
        :error="policyTypesError"
      />

      <LoadingBlock v-else-if="policyTypesData === undefined" />

      <EmptyBlock v-else-if="policyTypesData.policies.length === 0" />

      <template v-else>
        <template
          v-for="currentPolicyType in [policyTypesData.policies.find((item) => item.path === route.params.policyPath) ?? policyTypesData.policies[0]]"
          :key="currentPolicyType.name"
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
                    :render="true"
                  />
                </TextWithCopyButton>
              </h1>
            </template>

            <DataSource
              v-slot="{ data, error }: PolicySource"
              :src="`/meshes/${route.params.mesh}/policy-path/${currentPolicyType.path}/policy/${route.params.policy}`"
            >
              <ErrorBlock
                v-if="error"
                :error="error"
              />

              <LoadingBlock v-else-if="data === undefined" />

              <PolicyDetails
                v-else
                :policy="data"
                :path="currentPolicyType.path"
                data-testid="detail-view-details"
              />
            </DataSource>
          </AppView>
        </template>
      </template>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import PolicyDetails from '../components/PolicyDetails.vue'
import type { PolicySource, PolicyTypeCollectionSource } from '../sources'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
