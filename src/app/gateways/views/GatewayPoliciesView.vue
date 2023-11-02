<template>
  <RouteView
    v-slot="{ route, t }"
    name="gateway-policies-view"
    :params="{
      mesh: '',
      dataPlane: '',
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('gateways.routes.item.navigation.gateway-policies-view')"
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
                :src="`/meshes/${route.params.mesh}/gateways/${route.params.dataPlane}/policies`"
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

                <GatewayDataplanePolicyList
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
                v-slot="{ data: sidecarDataplane, error }: SidecarDataplaneCollectionSource"
                :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/sidecar-dataplanes-policies`"
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

                  <LoadingBlock v-else-if="policyTypesData === undefined || sidecarDataplane === undefined || rulesData === undefined" />

                  <SidecarDataplanePolicyList
                    v-else
                    :policy-types-by-name="policyTypesData.policies.reduce((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})"
                    :sidecar-dataplanes="sidecarDataplane.items"
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
import GatewayDataplanePolicyList from '../components/GatewayDataplanePolicyList.vue'
import { MeshGatewayDataplaneSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import SidecarDataplanePolicyList from '@/app/data-planes/components/SidecarDataplanePolicyList.vue'
import { DataplaneRulesCollectionSource, SidecarDataplaneCollectionSource } from '@/app/data-planes/sources'
import { PolicyTypeCollectionSource } from '@/app/policies/sources'
import type { DataPlaneOverview } from '@/types/index.d'

const props = defineProps<{
  data: DataPlaneOverview
}>()
</script>
