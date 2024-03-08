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
        <!-- we load in policyTypes for everything so we can use `path` for links/URLs/API requests -->
        <!-- we ask for the policyTypes here and always share the errors/data with all the DataLoaders below -->
        <DataSource
          v-slot="{ data: policyTypesData, error: policyTypesError }: PolicyTypeCollectionSource"
          :src="`/*/policy-types`"
        >
          <!-- always try and load and show the rules for everything dataplane type -->
          <DataLoader
            v-slot="{ data: rulesData }: DataplaneRulesSource"
            :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/rules`"
            :data="[policyTypesData]"
            :errors="[policyTypesError]"
          >
            <DataCollection
              v-if="rulesData && policyTypesData"
              :items="rulesData.rules"
            >
              <StandardDataplanePolicies
                :policy-types-by-name="policyTypesData.policies.reduce((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})"
                :rules="rulesData.rules"
                data-testid="rules-based-policies"
              />
            </DataCollection>
          </DataLoader>

          <!-- if we are in non-federated zone mode try and load/show legacy policies -->
          <template v-if="!can('use zones')">
            <div>
              <h3>{{ t('data-planes.routes.item.legacy_policies') }}</h3>

              <!-- builtin gateways have different data/visuals than other types of dataplanes -->
              <template v-if="props.data.dataplaneType === 'builtin'">
                <DataLoader
                  v-slot="{ data: gatewayDataplane }: MeshGatewayDataplaneSource"
                  :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/gateway-dataplane-policies`"
                  :data="[policyTypesData]"
                  :errors="[policyTypesError]"
                >
                  <DataCollection
                    v-if="gatewayDataplane"
                    :items="gatewayDataplane.routePolicies"
                  >
                    <!-- we need to check routePolicies and listenerEntries for emptyness -->
                    <EmptyBlock v-if="gatewayDataplane.listenerEntries.length === 0" />
                    <KCard
                      v-else
                      class="mt-4"
                    >
                      <BuiltinGatewayPolicies
                        v-if="policyTypesData"
                        :policy-types-by-name="policyTypesData.policies.reduce((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})"
                        :gateway-dataplane="gatewayDataplane"
                        data-testid="builtin-gateway-dataplane-policies"
                      />
                    </KCard>
                  </DataCollection>
                </DataLoader>
              </template>

              <!-- anything but builtin gateways -->
              <template v-else>
                <DataLoader
                  v-slot="{ data: sidecarDataplaneData}: SidecarDataplaneCollectionSource"
                  :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/sidecar-dataplane-policies`"
                  :data="[policyTypesData]"
                  :errors="[policyTypesError]"
                >
                  <DataCollection
                    v-if="sidecarDataplaneData"
                    v-slot="{items: policyTypeEntries}"
                    :items="sidecarDataplaneData.policyTypeEntries"
                  >
                    <KCard
                      class="mt-4"
                    >
                      <PolicyTypeEntryList
                        v-if="policyTypesData"
                        :policy-type-entries="policyTypeEntries"
                        :policy-types-by-name="policyTypesData.policies.reduce((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})"
                        data-testid="sidecar-dataplane-policies"
                      />
                    </KCard>
                  </DataCollection>
                </DataLoader>
              </template>
            </div>
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
import type { PolicyTypeCollectionSource } from '@/app/policies/sources'

const props = defineProps<{
  data: DataplaneOverview
}>()
</script>
