<template>
  <DataSource
    v-if="props.dataplaneOverview.dataplane.networking.gateway?.type?.toUpperCase() === 'BUILTIN'"
    v-slot="{ data, error }: MeshGatewayDataplaneSource"
    :src="`/meshes/${props.dataplaneOverview.mesh}/dataplanes/${props.dataplaneOverview.name}/gateway`"
  >
    <ErrorBlock
      v-if="error"
      :error="error"
    />

    <LoadingBlock v-else-if="data === undefined" />

    <GatewayDataplanePolicyList
      v-else
      :policy-types-by-name="props.policyTypesByName"
      :gateway-dataplane="data"
    />
  </DataSource>

  <DataSource
    v-else
    v-slot="{ data, error }: SidecarDataplaneCollectionSource"
    :src="`/meshes/${props.dataplaneOverview.mesh}/dataplanes/${props.dataplaneOverview.name}/sidecar-dataplanes-policies`"
  >
    <DataSource
      v-slot="{ data: rulesData, error: rulesError }: DataplaneRulesCollectionSource"
      :src="`/meshes/${props.dataplaneOverview.mesh}/dataplanes/${props.dataplaneOverview.name}/rules`"
    >
      <ErrorBlock
        v-if="error"
        :error="error"
      />

      <ErrorBlock
        v-else-if="rulesError"
        :error="rulesError"
      />

      <LoadingBlock v-else-if="data === undefined || rulesData === undefined" />

      <EmptyBlock v-else-if="data.items.length === 0 || rulesData.items.length === 0" />

      <SidecarDataplanePolicyList
        v-else
        :policy-types-by-name="props.policyTypesByName"
        :sidecar-dataplanes="data.items"
        :rules="rulesData.items"
      />
    </DataSource>
  </DataSource>
</template>

<script lang="ts" setup>
import GatewayDataplanePolicyList from './GatewayDataplanePolicyList.vue'
import SidecarDataplanePolicyList from './SidecarDataplanePolicyList.vue'
import type { DataplaneRulesCollectionSource, MeshGatewayDataplaneSource, SidecarDataplaneCollectionSource } from '../sources'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import type { DataPlaneOverview, PolicyType } from '@/types/index.d'

const props = defineProps<{
  dataplaneOverview: DataPlaneOverview
  policyTypesByName: Record<string, PolicyType | undefined>
}>()
</script>
