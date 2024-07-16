<template>
  <RouteView
    :params="{
      mesh: '',
      dataPlane: '',
      connection: '',
    }"
    name="connection-outbound-summary-overview-view"
    v-slot="{ t, route }"
  >
    <AppView>
      <template
        v-for="service in [route.params.connection.replace(/-([a-f0-9]){16}$/, '')]"
        :key="service"
      >
        <div class="stack-with-borders">
          <DefinitionCard
            layout="horizontal"
          >
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
            class="rules"
          >
            <h3>Rules</h3>
            <DataLoader
              :src="`/meshes/${route.params.mesh}/rules/for/${route.params.dataPlane}`"
              v-slot="{ data: rulesData }: RuleCollectionSource"
            >
              <DataCollection
                :predicate="(item) => {
                  // for to rules we don't have inbound.port, filter out Routes
                  // then look for the kuma.io/service
                  return item.ruleType === 'to' && !['MeshHTTPRoute', 'MeshTCPRoute'].includes(item.type) && (
                    item.matchers.every(item => item.key === 'kuma.io/service' && (item.not ? item.value !== service : item.value === service))
                  )
                }"
                :items="rulesData!.rules"

                v-slot="{ items }"
              >
                <div class="mt-4">
                  <AccordionList
                    :initially-open="0"
                    multiple-open
                    class="stack"
                  >
                    <template
                      v-for="(rules, key) in Object.groupBy(items, item => item.type)"
                      :key="key"
                    >
                      <KCard>
                        <AccordionItem>
                          <template #accordion-header>
                            <PolicyTypeTag
                              :policy-type="key"
                            >
                              {{ key }} ({{ rules!.length }})
                            </PolicyTypeTag>
                          </template>
                          <template #accordion-content>
                            <div
                              class="stack-with-borders"
                            >
                              <template
                                v-for="item in rules"
                                :key="item"
                              >
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
                                      :src="`/policy-types`"
                                      v-slot="{ data: policyTypes }: PolicyTypeCollectionSource"
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
                                        :code="toYaml(item.raw)"
                                        language="yaml"
                                        :show-copy-button="false"
                                      />
                                    </div>
                                  </dd>
                                </div>
                              </template>
                            </div>
                          </template>
                        </AccordionItem>
                      </KCard>
                    </template>
                  </AccordionList>
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
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import CodeBlock from '@/app/common/code-block/CodeBlock.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import PolicyTypeTag from '@/app/common/PolicyTypeTag.vue'
import type { DataplaneOverview } from '@/app/data-planes/data/'
import type { PolicyTypeCollectionSource } from '@/app/policies/sources'
import RuleMatchers from '@/app/rules/components/RuleMatchers.vue'
import type { RuleCollectionSource } from '@/app/rules/sources'
import { toYaml } from '@/utilities/toYaml'
const props = defineProps<{
  data: Record<string, any>
  dataplaneOverview: DataplaneOverview
}>()
</script>
<style lang="scss" scoped>
.rules {
  padding-top: $kui-space-60;
}
</style>
