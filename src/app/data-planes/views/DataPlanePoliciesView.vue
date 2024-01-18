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

      <div class="stack">
        <DataSource
          v-slot="{ data: policyTypesData, error: policyTypesError }: PolicyTypeCollectionSource"
          :src="`/*/policy-types`"
        >
          <DataSource
            v-slot="{ data: rulesData, error }: DataplaneRulesSource"
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

            <LoadingBlock v-else-if="policyTypesData === undefined || rulesData === undefined" />

            <EmptyBlock v-else-if="rulesData.rules.length === 0" />

            <StandardDataplanePolicies
              v-else
              :policy-types-by-name="policyTypesData.policies.reduce((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})"
              :inspect-rules-for-dataplane="rulesData"
              data-testid="rules-based-policies"
            />
          </DataSource>

          <template v-if="!can('use zones')">
            <DataSource
              v-slot="{ data: sidecarDataplaneData, error }: SidecarDataplaneCollectionSource"
              :src="props.data.dataplaneType !== 'builtin' ? `/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/sidecar-dataplane-policies` : ''"
            >
              <DataSource
                v-slot="{ data: gatewayDataplane, error: gatewayDataplaneError }: MeshGatewayDataplaneSource"
                :src="props.data.dataplaneType === 'builtin' ? `/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/gateway-dataplane-policies` : ''"
              >
                <div>
                  <h3>{{ t('data-planes.routes.item.legacy_policies') }}</h3>

                  <ErrorBlock
                    v-if="policyTypesError"
                    :error="policyTypesError"
                  />

                  <ErrorBlock
                    v-else-if="error"
                    :error="error"
                  />

                  <ErrorBlock
                    v-else-if="gatewayDataplaneError"
                    :error="gatewayDataplaneError"
                  />

                  <LoadingBlock v-else-if="policyTypesData === undefined" />

                  <template v-else-if="props.data.dataplaneType === 'builtin'">
                    <LoadingBlock v-if="gatewayDataplane === undefined" />

                    <EmptyBlock v-else-if="gatewayDataplane.routePolicies.length === 0 && gatewayDataplane.listenerEntries.length === 0" />

                    <KCard
                      v-else
                      class="mt-4"
                    >
                      <BuiltinGatewayPolicies
                        :policy-types-by-name="policyTypesData.policies.reduce((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})"
                        :gateway-dataplane="gatewayDataplane"
                        data-testid="builtin-gateway-dataplane-policies"
                      />
                    </KCard>
                  </template>

                  <template v-else>
                    <LoadingBlock v-if="sidecarDataplaneData === undefined" />

                    <EmptyBlock v-else-if="sidecarDataplaneData.policyTypeEntries.length === 0" />

                    <KCard
                      v-else
                      class="mt-4"
                    >
                      <PolicyTypeEntryList
                        id="policies"
                        :policy-type-entries="sidecarDataplaneData.policyTypeEntries"
                        :policy-types-by-name="policyTypesData.policies.reduce((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})"
                        data-testid="sidecar-dataplane-policies"
                      />
                    </KCard>
                  </template>
                </div>
              </DataSource>
            </DataSource>
          </template>
        </DataSource>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import BuiltinGatewayPolicies from '../components/BuiltinGatewayPolicies.vue'
import PolicyTypeEntryList from '../components/PolicyTypeEntryList.vue'
import StandardDataplanePolicies from '../components/StandardDataplanePolicies.vue'
import type { DataplaneOverview } from '../data'
import type { DataplaneRulesSource, MeshGatewayDataplaneSource, SidecarDataplaneCollectionSource } from '../sources'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import type { PolicyTypeCollectionSource } from '@/app/policies/sources'

const props = defineProps<{
  data: DataplaneOverview
}>()
</script>
