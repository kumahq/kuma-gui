<template>
  <RouteView
    v-slot="{ can, route, t }"
    name="data-plane-policies-view"
    :params="{
      mesh: '',
      dataPlane: '',
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('data-planes.routes.item.navigation.data-plane-policies-view')"
          />
        </h2>
      </template>

      <template v-if="props.data.dataplaneType === 'builtin'">
        <DataSource
          v-slot="{ data: policyTypesData, error: policyTypesError }: PolicyTypeCollectionSource"
          :src="`/*/policy-types`"
        >
          <DataSource
            v-slot="{ data: gatewayDataplane, error }: MeshGatewayDataplaneSource"
            :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/gateway-dataplane-policies`"
          >
            <ErrorBlock
              v-if="policyTypesError"
              :error="policyTypesError"
            />

            <ErrorBlock
              v-else-if="error"
              :error="error"
            />

            <LoadingBlock v-else-if="gatewayDataplane === undefined || policyTypesData === undefined" />

            <KCard v-else>
              <BuiltinGatewayPolicies
                :policy-types-by-name="policyTypesData.policies.reduce((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})"
                :gateway-dataplane="gatewayDataplane"
              />
            </KCard>
          </DataSource>
        </DataSource>
      </template>

      <template v-else>
        <DataSource
          v-slot="{ data: policyTypesData, error: policyTypesError }: PolicyTypeCollectionSource"
          :src="`/*/policy-types`"
        >
          <DataSource
            v-slot="{ data: sidecarDataplaneData, error }: SidecarDataplaneCollectionSource"
            :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/sidecar-dataplane-policies`"
          >
            <DataSource
              v-slot="{ data: rulesData, error: rulesError }: DataplaneRulesSource"
              :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/rules`"
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

              <LoadingBlock v-else-if="policyTypesData === undefined || sidecarDataplaneData === undefined || rulesData === undefined" />

              <StandardDataplanePolicies
                v-else
                :policy-types-by-name="policyTypesData.policies.reduce((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})"
                :sidecar-dataplanes="sidecarDataplaneData.items"
                :inspect-rules-for-dataplane="rulesData"
                :show-policies-section="!can('use zones')"
              />
            </DataSource>
          </DataSource>
        </DataSource>
      </template>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import BuiltinGatewayPolicies from '../components/BuiltinGatewayPolicies.vue'
import StandardDataplanePolicies from '../components/StandardDataplanePolicies.vue'
import type { DataplaneOverview } from '../data'
import type { DataplaneRulesSource, MeshGatewayDataplaneSource, SidecarDataplaneCollectionSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import type { PolicyTypeCollectionSource } from '@/app/policies/sources'

const props = defineProps<{
  data: DataplaneOverview
}>()
</script>
