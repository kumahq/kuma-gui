<template>
  <RouteView
    v-slot="{ route }"
    name="policy-detail-view"
  >
    <RouteTitle :title="t('policies.routes.item.title', { name: route.params.policy })" />

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
          :update-resource-params="updateResourceParams"
        />
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import PolicyDetails from '../components/PolicyDetails.vue'
import type { PolicySource } from '../sources'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import type { SingleResourceParameters } from '@/types/api.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const params = ref<SingleResourceParameters>({ format: 'universal' })

function updateResourceParams(newParams: SingleResourceParameters) {
  params.value = newParams
}
</script>
