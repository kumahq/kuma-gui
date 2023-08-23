<template>
  <RouteView
    v-slot="{ route }"
    name="policy-detail-view"
    data-testid="policy-detail-view"
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
                  name: 'policies-list-view',
                  params: {
                    mesh: route.params.mesh,
                    policyPath: route.params.policyPath,
                  },
                },
                text: t('policies.routes.item.breadcrumbs')
              },
            ]"
          >
            <template #title>
              <h2>
                <RouteTitle
                  :title="t('policies.routes.item.title', {
                    name: route.params.policy,
                    type: currentPolicyType.name,
                  })"
                  :render="true"
                />
              </h2>
            </template>

            <DataSource
              v-slot="{ data, isLoading, error }: PolicySource"
              :src="`/meshes/${route.params.mesh}/policy-path/${currentPolicyType.path}/policy/${route.params.policy}`"
            >
              <LoadingBlock v-if="isLoading" />

              <ErrorBlock
                v-else-if="error"
                :error="error"
              />

              <EmptyBlock v-else-if="data === undefined" />

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
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()
</script>
