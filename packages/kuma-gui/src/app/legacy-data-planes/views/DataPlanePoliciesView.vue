<template>
  <RouteView
    name="data-plane-policies-view"
    :params="{
      mesh: '',
      proxy: '',
    }"
    v-slot="{ uri, route, t }"
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
        v-slot="{ data: policyTypesData, error: policyTypesError, result: policyTypesDataResult }"
      >
        <template
          v-for="policyTypes in [(policyTypesData?.policyTypes ?? []).reduce<Partial<Record<string, PolicyResourceType>>>((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})]"
          :key="typeof policyTypes"
        >
          <!-- always try and load and show the rules for everything dataplane type -->
          <DataLoader
            :src="uri(sources, '/meshes/:mesh/rules/for/:dataplane', {
              mesh: route.params.mesh,
              dataplane: props.data.id,
            })"
            :data="[policyTypesData]"
            :errors="[policyTypesError]"
            v-slot="{ data: [rulesData] }"
          >
            <!-- show an empty state if we have no rules at all -->
            <DataCollection
              :items="rulesData.rules"
            >
              <!-- for proxy and to rules, display if we have any -->
              <template
                v-for="ruleType in ['proxy', 'to']"
                :key="ruleType"
              >
                <DataCollection
                  :items="rulesData.rules"
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
                :items="rulesData.rules"
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
                :items="rulesData.inboundRules"
                :comparator="(a, b) => a.type.localeCompare(b.type)"
                :empty="false"
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
          
          <DataPlanePolicies
            :data="props.data"
            :policy-types="policyTypes"
            :policy-types-data-result="policyTypesDataResult"
          />
        </template>
        <RouterView
          v-slot="{ Component }"
        >
          <XDrawer
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
          </XDrawer>
        </RouterView>
      </DataSource>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { useDataPlanePolicies } from '../index.ts'
import type { DataplaneOverview } from '@/app/data-planes/data'
import type { PolicyResourceType } from '@/app/policies/data'
import { sources as policySources } from '@/app/policies/sources'
import RuleList from '@/app/rules/components/RuleList.vue'
import { sources } from '@/app/rules/sources'

const props = defineProps<{
  data: DataplaneOverview
}>()

const DataPlanePolicies = useDataPlanePolicies()
</script>
