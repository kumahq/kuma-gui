<template>
  <RouteView
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
            v-slot="{ data: policyTypesData, error }: PolicyTypeCollectionSource"
            :src="`/*/policy-types`"
          >
            <ErrorBlock
              v-if="error"
              :error="error"
            />

            <LoadingBlock v-else-if="policyTypesData === undefined" />

            <DataplanePolicies
              v-else
              :dataplane-overview="props.data"
              :policy-types="policyTypesData.policies"
            />
          </DataSource>
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'

import DataplanePolicies from '../components/DataplanePolicies.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { PolicyTypeCollectionSource } from '@/app/policies/sources'
import type { DataPlaneOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps<{
  data: DataPlaneOverview
}>()
</script>
