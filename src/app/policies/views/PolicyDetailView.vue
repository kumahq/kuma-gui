<template>
  <RouteView
    v-slot="{ route }"
    name="policy-detail-view"
    data-testid="policy-detail-view"
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
              type: store.state.policyTypesByPath[route.params.policyPath]?.name ?? route.params.policyPath,
            })"
            :render="true"
          />
        </h2>
      </template>

      <DataSource
        v-slot="{ data, isLoading, error }: PolicySource"
        :src="`/meshes/${route.params.mesh}/policy-path/${route.params.policyPath}/policy/${route.params.policy}`"
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
          :path="route.params.policyPath"
          data-testid="detail-view-details"
        />
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import PolicyDetails from '../components/PolicyDetails.vue'
import type { PolicySource } from '../sources'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { useStore } from '@/store/store'
import { useI18n } from '@/utilities'

const { t } = useI18n()
const store = useStore()
</script>
