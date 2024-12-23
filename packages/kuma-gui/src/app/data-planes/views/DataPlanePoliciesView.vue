<template>
  <RouteView
    name="data-plane-policies-view"
    :params="{
      mesh: '',
      dataPlane: '',
    }"
    v-slot="{ can, route, t, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('data-planes.routes.item.navigation.data-plane-policies-view')"
    />
    <AppView>
      <div class="stack">
        <!-- we load in policyTypes for everything so we can use `path` for links/URLs/API requests -->
        <!-- we ask for the policyTypes here and always share the errors/data with all the DataLoaders below -->
        <DataSource
          :src="`/policy-types`"
          v-slot="{ data: policyTypesData, error: policyTypesError }: PolicyTypeCollectionSource"
        >
          <template
            v-for="policyTypes in [(policyTypesData?.policies ?? []).reduce<Partial<Record<string, PolicyType>>>((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})]"
            :key="typeof policyTypes"
          >
            <!-- always try and load and show the rules for everything dataplane type -->
            <DataLoader
              :src="uri(sources, '/meshes/:mesh/rules/for/:dataplane', {
                mesh: route.params.mesh,
                dataplane: route.params.dataPlane,
              })"
              :data="[policyTypesData]"
              :errors="[policyTypesError]"
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
                <DataCollection
                  :items="rulesData!.rules"
                  :predicate="(item) => item.ruleType === 'from'"
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
              </DataCollection>
            </DataLoader>

            <!-- if we are in non-federated zone mode try and load/show legacy policies -->
            <template v-if="!can('use zones')">
              <div>
                <!-- builtin gateways have different data/visuals than other types of dataplanes -->
                <template v-if="props.data.dataplaneType === 'builtin'">
                  <DataLoader
                    :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/gateway-dataplane-policies`"
                    :data="[policyTypesData]"
                    :errors="[policyTypesError]"
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
                    :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/sidecar-dataplane-policies`"
                    :data="[policyTypesData]"
                    :errors="[policyTypesError]"
                    v-slot="{ data: sidecarDataplaneData }: SidecarDataplaneCollectionSource"
                  >
                    <DataCollection
                      :predicate="(item) => policyTypes[item.type]?.isTargetRefBased === false"
                      :items="sidecarDataplaneData!.policyTypeEntries"
                      :empty="false"
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
        </DataSource>
      </div>
      <RouterView
        v-slot="{ Component }"
      >
        <SummaryView
          v-if="route.child()"
          @close="route.replace({
            name: 'data-plane-policies-view',
            params: {
              mesh: route.params.mesh,
              dataPlane: route.params.dataPlane,
            },
          })"
        >
          <component
            :is="Component"
          />
        </SummaryView>
      </RouterView>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import BuiltinGatewayPolicies from '../components/BuiltinGatewayPolicies.vue'
import type { DataplaneOverview } from '../data'
import type { MeshGatewayDataplaneSource, SidecarDataplaneCollectionSource } from '../sources'
import SummaryView from '@/app/common/SummaryView.vue'
import PolicyTypeEntryList from '@/app/policies/components/PolicyTypeEntryList.vue'
import type { PolicyType } from '@/app/policies/data'
import type { PolicyTypeCollectionSource } from '@/app/policies/sources'
import RuleList from '@/app/rules/components/RuleList.vue'
import { sources } from '@/app/rules/sources'

const props = defineProps<{
  data: DataplaneOverview
}>()
</script>
