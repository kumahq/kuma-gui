<template>
  <RouteView
    name="data-plane-policies-view"
    :params="{
      mesh: '',
      proxy: '',
    }"
    v-slot="{ uri, can, route, t }"
  >
    <RouteTitle
      :render="false"
      :title="t('data-planes.routes.item.navigation.data-plane-policies-view')"
    />
    <AppView>
      <!-- we load in policyTypes for everything so we can use `path` for links/URLs/API requests -->
      <!-- we ask for the policyTypes here and always share the errors/data with all the DataLoaders below -->
      <DataSource
        :src="uri(policySources, '/policy-types', {})"
        v-slot="{ data: policyTypesData, error: policyTypesError }"
      >
        <template
          v-for="policyTypes in [(policyTypesData?.policyTypes ?? []).reduce<Partial<Record<string, PolicyResourceType>>>((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})]"
          :key="typeof policyTypes"
        >
          <!-- always try and load and show the rules for everything dataplane type -->
          <DataLoader
            :src="uri(sources, '/meshes/:mesh/rules/for/:dataplane', {
              mesh: route.params.mesh,
              dataplane: route.params.proxy,
            })"
            :data="[policyTypesData]"
            :errors="[policyTypesError]"
            variant="list"
            v-slot="{ data: rulesData }"
          >
            <!-- show an empty state if we have no rules at all -->
            <DataCollection
              :items="rulesData!.rules"
            >
              <!-- for proxy and to rules, display if we have any -->
              <template
                v-for="ruleType in ['proxy', 'to']"
                :key="ruleType"
              >
                <DataCollection
                  :items="rulesData!.rules"
                  :predicate="(item) => item.ruleType === ruleType"
                  :comparator="(a, b) => a.type.localeCompare(b.type)"
                  :empty="false"
                  v-slot="{ items }"
                >
                  <XCard>
                    <h3>
                      {{ t(`data-planes.routes.item.rules.${ruleType}`) }}
                    </h3>

                    <RuleList
                      class="mt-2"
                      :rules="items"
                      :types="policyTypes"
                      :data-testid="`${ruleType}-rule-list`"
                    />
                  </XCard>
                </DataCollection>
              </template>

              <!-- otherwise, for from rules, group by inbound port and display if we have any -->
              <!-- filter rules that are being represented as inboundRules (isFromAsRules) -->
              <DataCollection
                :items="rulesData!.rules"
                :predicate="(item) => item.ruleType === 'from' && !Boolean(policyTypes[item.type]?.policy.isFromAsRules)"
                :comparator="(a, b) => a.type.localeCompare(b.type)"
                :empty="false"
                v-slot="{ items }"
              >
                <XCard>
                  <h3 class="mb-2">
                    {{ t('data-planes.routes.item.rules.from') }}
                  </h3>
                  <template
                    v-for="inbounds in [Object.groupBy(items, (item) => item.inbound!.port)]"
                    :key="inbounds"
                  >
                    <div
                      v-for="([port, rs], index) in Object.entries(inbounds).sort(([a], [b]) => Number(b) - Number(a))"
                      :key="index"
                    >
                      <h4>{{ t('data-planes.routes.item.port', { port }) }}</h4>

                      <RuleList
                        class="mt-2"
                        :rules="rs!"
                        :types="policyTypes"
                        :data-testid="`from-rule-list-${index}`"
                      />
                    </div>
                  </template>
                </XCard>
              </DataCollection>

              <DataCollection
                :items="rulesData!.inboundRules"
                :comparator="(a, b) => a.type.localeCompare(b.type)"
                :empty="false"
                variant="list"
                v-slot="{ items }"
              >
                <XCard>
                  <h3 class="mb-2">
                    {{ t('data-planes.routes.item.rules.inbound') }}
                  </h3>
                  <template
                    v-for="inbounds in [Object.groupBy(items, (item) => item.inbound!.port)]"
                    :key="inbounds"
                  >
                    <div
                      v-for="([port, rs], index) in Object.entries(inbounds).sort(([a], [b]) => Number(b) - Number(a))"
                      :key="index"
                    >
                      <h4>{{ t('data-planes.routes.item.port', { port }) }}</h4>

                      <RuleList
                        class="mt-2"
                        :rules="rs!"
                        :types="policyTypes"
                        :data-testid="`inbound-rule-list-${index}`"
                      />
                    </div>
                  </template>
                </XCard>
              </DataCollection>
            </DataCollection>
          </DataLoader>

          <!-- if we are in non-federated zone mode try and load/show legacy policies -->
          <template v-if="!can('use zones')">
            <div>
              <!-- builtin gateways have different data/visuals than other types of dataplanes -->
              <template v-if="props.source.data?.dataplaneType === 'builtin'">
                <DataLoader
                  :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.proxy}/gateway-dataplane-policies`"
                  :data="[policyTypesData]"
                  :errors="[policyTypesError]"
                  variant="list"
                  v-slot="{ data: gatewayDataplane }: MeshGatewayDataplaneSource"
                >
                  <DataCollection
                    v-if="gatewayDataplane"
                    :items="gatewayDataplane.routePolicies"
                    :empty="false"
                  >
                    <h3>
                      {{ t('data-planes.routes.item.legacy_policies') }}
                    </h3>
                    <XCard
                      class="mt-4"
                    >
                      <BuiltinGatewayPolicies
                        :types="policyTypes"
                        :gateway-dataplane="gatewayDataplane"
                        data-testid="builtin-gateway-dataplane-policies"
                      />
                    </XCard>
                  </DataCollection>
                </DataLoader>
              </template>

              <!-- anything but builtin gateways -->
              <template v-else>
                <DataLoader
                  :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.proxy}/sidecar-dataplane-policies`"
                  :data="[policyTypesData]"
                  :errors="[policyTypesError]"
                  variant="list"
                  v-slot="{ data: sidecarDataplaneData }: SidecarDataplaneCollectionSource"
                >
                  <DataCollection
                    :empty="false"
                    :items="sidecarDataplaneData!.policyTypeEntries"
                    :predicate="(item) => policyTypes[item.type]?.policy.isTargetRef === false"
                    v-slot="{ items }"
                  >
                    <h3>
                      {{ t('data-planes.routes.item.legacy_policies') }}
                    </h3>
                    <XCard
                      class="mt-4"
                    >
                      <PolicyTypeEntryList
                        :items="items"
                        :types="policyTypes"
                        data-testid="sidecar-dataplane-policies"
                      />
                    </XCard>
                  </DataCollection>
                </DataLoader>
              </template>
            </div>
          </template>
        </template>
        <RouterView
          v-slot="{ Component }"
        >
          <SummaryView
            v-if="route.child() && policyTypesData"
            @close="route.replace({
              name: 'data-plane-policies-view',
              params: {
                mesh: route.params.mesh,
                proxy: route.params.proxy,
              },
            })"
          >
            <component
              :is="Component"
              :policy-types="policyTypesData.policyTypes"
            />
          </SummaryView>
        </RouterView>
      </DataSource>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import BuiltinGatewayPolicies from '../components/BuiltinGatewayPolicies.vue'
import type { DataplaneOverview } from '../data'
import type { MeshGatewayDataplaneSource, SidecarDataplaneCollectionSource } from '../sources'
import { DataSourceResponse } from '@/app/application'
import SummaryView from '@/app/common/SummaryView.vue'
import PolicyTypeEntryList from '@/app/policies/components/PolicyTypeEntryList.vue'
import type { PolicyResourceType } from '@/app/policies/data'
import { sources as policySources } from '@/app/policies/sources'
import RuleList from '@/app/rules/components/RuleList.vue'
import { sources } from '@/app/rules/sources'

const props = defineProps<{
  source: DataSourceResponse<DataplaneOverview>
}>()
</script>
