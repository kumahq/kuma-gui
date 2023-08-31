<template>
  <RouteView
    v-slot="{ route }"
    name="data-plane-policies-view"
    data-testid="data-plane-policies-view"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('data-planes.routes.item.navigation.data-plane-policies-view')"
            :render="true"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <DataSource
            v-slot="{ data: policyTypesData, error: policyTypesError }: PolicyTypeCollectionSource"
            :src="`/*/policy-types`"
          >
            <DataSource
              v-slot="{ data, error }: SidecarDataplaneCollectionSource"
              :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.name}/sidecar-dataplanes-policies`"
            >
              <DataSource
                v-slot="{ data: rulesData, error: rulesError }: DataplaneRulesCollectionSource"
                :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.name}/rules`"
              >
                <ErrorBlock
                  v-if="policyTypesError"
                  :error="policyTypesError"
                />

                <ErrorBlock
                  v-else-if="error"
                  :error="error"
                />

                <ErrorBlock
                  v-else-if="rulesError"
                  :error="rulesError"
                />

                <LoadingBlock v-else-if="policyTypesData === undefined || data === undefined || rulesData === undefined" />

                <SidecarDataplanePolicyList
                  v-else
                  :policy-types-by-name="policyTypesData.policies.reduce((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})"
                  :sidecar-dataplanes="data.items"
                  :rules="rulesData.items"
                />
              </DataSource>
            </DataSource>
          </DataSource>
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'

import SidecarDataplanePolicyList from '../components/SidecarDataplanePolicyList.vue'
import { DataplaneRulesCollectionSource, SidecarDataplaneCollectionSource } from '../sources'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { PolicyTypeCollectionSource } from '@/app/policies/sources'
import { useI18n } from '@/utilities'

const { t } = useI18n()
</script>
