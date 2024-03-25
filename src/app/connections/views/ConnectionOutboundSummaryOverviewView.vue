<template>
  <RouteView
    v-slot="{ t, route }"
    :params="{
      mesh: '',
      dataPlane: '',
      connection: '',
    }"
    name="connection-outbound-summary-overview-view"
  >
    <AppView>
      <template
        v-for="service in [route.params.connection.replace(/-([a-f0-9]){16}$/, '')]"
        :key="service"
      >
        <div class="stack-with-borders">
          <DefinitionCard layout="horizontal">
            <template #title>
              Protocol
            </template>

            <template #body>
              <KBadge
                appearance="info"
              >
                {{ t(`http.api.value.${['grpc', 'http', 'tcp'].find(protocol => typeof props.data[protocol] !== 'undefined')}`) }}
              </KBadge>
            </template>
          </DefinitionCard>
          <div
            v-if="props.data"
            class="mt-6"
          >
            <h3>Rules</h3>
            <DataLoader
              v-slot="{ data: rulesData }: DataplaneRulesSource"
              :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/rules`"
            >
              <DataCollection
                v-slot="{ items }"
                :predicate="(item) => {
                  // for to rules we don't have inbound.port, filter out Routes
                  // then look for the kuma.io/service
                  return item.ruleType === 'to' && !['MeshHTTPRoute', 'MeshTCPRoute'].includes(item.type) && (
                    item.matchers.every(item => item.key === 'kuma.io/service' && (item.not ? item.value !== service : item.value === service))
                  )
                }"

                :items="rulesData!.rules"
              >
                <div class="stack mt-4">
                  <template
                    v-for="item in items"
                    :key="item"
                  >
                    <KCard>
                      <div
                        class="stack-with-borders"
                      >
                        <DefinitionCard
                          layout="horizontal"
                        >
                          <template #title>
                            Type
                          </template>

                          <template #body>
                            {{ item.type }}
                          </template>
                        </DefinitionCard>
                        <DefinitionCard
                          v-if="item.matchers.length > 0"
                          layout="horizontal"
                        >
                          <template #title>
                            To
                          </template>

                          <template #body>
                            <p><RuleMatchers :items="item.matchers" /></p>
                          </template>
                        </DefinitionCard>
                        <DefinitionCard
                          v-if="item.origins.length > 0"
                          layout="horizontal"
                        >
                          <template #title>
                            Origin Policies
                          </template>

                          <template #body>
                            <DataSource
                              v-slot="{ data: policyTypes }: PolicyTypeCollectionSource"
                              :src="`/*/policy-types`"
                            >
                              <template
                                v-for="types in [Object.groupBy((policyTypes?.policies ?? []), (item) => item.name)]"
                                :key="types"
                              >
                                <ul>
                                  <li
                                    v-for="origin in item.origins"
                                    :key="`${origin.mesh}-${origin.name}`"
                                  >
                                    <RouterLink
                                      v-if="types[origin.type]"
                                      :to="{
                                        name: 'policy-detail-view',
                                        params: {
                                          mesh: origin.mesh,
                                          policyPath: types[origin.type]![0].path,
                                          policy: origin.name,
                                        },
                                      }"
                                    >
                                      {{ origin.name }}
                                    </RouterLink>
                                    <template
                                      v-else
                                    >
                                      {{ origin.name }}
                                    </template>
                                  </li>
                                </ul>
                              </template>
                            </DataSource>
                          </template>
                        </DefinitionCard>
                        <div>
                          <dt>
                            Config
                          </dt>
                          <dd class="mt-2">
                            <div>
                              <CodeBlock
                                :code="toYaml(item.config)"
                                language="yaml"
                                :show-copy-button="false"
                              />
                            </div>
                          </dd>
                        </div>
                      </div>
                    </KCard>
                  </template>
                </div>
              </DataCollection>
            </DataLoader>
          </div>
        </div>
      </template>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import CodeBlock from '@/app/common/code-block/CodeBlock.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import type { DataplaneOverview } from '@/app/data-planes/data/'
import type { DataplaneRulesSource } from '@/app/data-planes/sources'
import type { PolicyTypeCollectionSource } from '@/app/policies/sources'
import RuleMatchers from '@/app/rules/components/RuleMatchers.vue'
import { toYaml } from '@/utilities/toYaml'
const props = defineProps<{
  data: Record<string, any>
  dataplaneOverview: DataplaneOverview
}>()
</script>
