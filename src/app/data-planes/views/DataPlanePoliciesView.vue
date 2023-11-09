<template>
  <RouteView
    v-slot="{ route, t }"
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
            :render="true"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <template v-if="props.data.dataplane?.networking?.gateway?.type === 'BUILTIN'">
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

                <BuiltinGatewayPolicies
                  v-else
                  :policy-types-by-name="policyTypesData.policies.reduce((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})"
                  :gateway-dataplane="gatewayDataplane"
                />
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
                  v-slot="{ data: rulesData, error: rulesError }: DataplaneRulesCollectionSource"
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
                    :rules="rulesData.items"
                  />
                </DataSource>
              </DataSource>
            </DataSource>
          </template>
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import BuiltinGatewayPolicies from '../components/BuiltinGatewayPolicies.vue'
import StandardDataplanePolicies from '../components/StandardDataplanePolicies.vue'
import { DataplaneRulesCollectionSource, MeshGatewayDataplaneSource, SidecarDataplaneCollectionSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { PolicyTypeCollectionSource } from '@/app/policies/sources'
import type { DataPlaneOverview } from '@/types/index.d'

const props = defineProps<{
  data: DataPlaneOverview
}>()
</script>
