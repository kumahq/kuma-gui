<template>
  <RouteView
    :params="{
      mesh: '',
      dataPlane: '',
      connection: '',
    }"
    name="connection-outbound-summary-overview-view"
    v-slot="{ t, route, uri }"
  >
    <AppView>
      <template
        v-for="service in [route.params.connection.replace(/-([a-f0-9]){16}$/, '')]"
        :key="service"
      >
        <div
          class="stack-with-borders"
        >
          <template
            v-if="props.data.$resourceMeta.type !== ''"
          >
            <DefinitionCard
              layout="horizontal"
            >
              <template #title>
                Resource
              </template>

              <template #body>
                <KBadge
                  appearance="info"
                  max-width="auto"
                >
                  <template
                    v-for="item in [props.data.$resourceMeta]"
                    :key="typeof item"
                  >
                    <XAction
                      :to="({
                        MeshService: {
                          name: 'mesh-service-detail-view',
                          params: {
                            mesh: item.mesh,
                            service: item.name,
                          },
                        },
                        MeshExternalService: {
                          name: 'mesh-external-service-detail-view',
                          params: {
                            mesh: item.mesh,
                            service: item.name,
                          },
                        },
                        MeshMultiZoneService: {
                          name: 'mesh-multizone-service-detail-view',
                          params: {
                            mesh: item.mesh,
                            service: item.name,
                          },
                        },
                      } as const)[item.type as 'MeshService' | 'MeshExternalService' | 'MeshMultiZoneService']"
                    >
                      {{ item.type }}: {{ item.name }}
                    </XAction>
                  </template>
                </KBadge>
              </template>
            </DefinitionCard>
          </template>
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

            <DataSource
              :src="`/policy-types`"
              v-slot="{ data: policyTypes }: PolicyTypeCollectionSource"
            >
              <template
                v-for="types in [Object.groupBy((policyTypes?.policies ?? []), (item) => item.name)]"
                :key="typeof types"
              >
                <DataLoader
                  :src="uri(sources, `/meshes/:mesh/rules/for/:dataplane`, {
                    mesh: route.params.mesh,
                    dataplane: route.params.dataPlane,
                  })"
                  v-slot="{ data: rulesData }"
                >
                  <template
                    v-if="props.data.$resourceMeta.type !== ''"
                  >
                    <DataCollection
                      :predicate="(item) => {
                        return item.resourceMeta.type === 'Mesh' || ruleForCluster(props.data, item)
                      }"
                      :items="rulesData.toResourceRules"
                      v-slot="{ items }"
                    >
                      <div
                        class="stack-with-borders mt-4"
                      >
                        <template
                          v-for="(rules, key) in Object.groupBy(items, item => item.type)"
                          :key="key"
                        >
                          <div>
                            <PolicyTypeTag
                              :policy-type="key"
                            >
                              {{ key }}
                            </PolicyTypeTag>
                            <div
                              class="stack-with-borders mt-4"
                            >
                              <template
                                v-for="item in rules!.length > 1 ? rules!.filter(item => ruleForCluster(props.data, item)) : rules"
                                :key="item"
                              >
                                <div>
                                  <DefinitionCard
                                    v-if="item.origins.length > 0"
                                    layout="horizontal"
                                  >
                                    <template #title>
                                      Origin Policies
                                    </template>

                                    <template #body>
                                      <DataCollection
                                        :predicate="(item) => {
                                          return typeof item.resourceMeta !== 'undefined'
                                        }"
                                        :items="item.origins"
                                        :empty="false"
                                        v-slot="{ items: origins }"
                                      >
                                        <ul>
                                          <li
                                            v-for="origin in origins"
                                            :key="JSON.stringify(origin)"
                                          >
                                            <XAction
                                              v-if="Object.keys(types).length > 0"
                                              :to="{
                                                name: 'policy-detail-view',
                                                params: {
                                                  policyPath: types[key]![0].path,
                                                  mesh: origin.resourceMeta!.mesh,
                                                  policy: origin.resourceMeta!.name,
                                                },
                                              }"
                                            >
                                              {{ origin.resourceMeta!.name }}
                                            </XAction>
                                          </li>
                                        </ul>
                                      </DataCollection>
                                    </template>
                                  </DefinitionCard>
                                  <CodeBlock
                                    class="mt-2"
                                    :code="YAML.stringify(item.raw)"
                                    language="yaml"
                                    :show-copy-button="false"
                                  />
                                </div>
                              </template>
                            </div>
                          </div>
                        </template>
                      </div>
                    </DataCollection>
                  </template>
                  <template
                    v-else
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
                                          From
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
                                      </DefinitionCard>
                                      <div>
                                        <dt>
                                          Config
                                        </dt>
                                        <dd class="mt-2">
                                          <div>
                                            <CodeBlock
                                              :code="YAML.stringify(item.raw)"
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
                  </template>
                </DataLoader>
              </template>
            </DataSource>
          </div>
        </div>
      </template>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { YAML } from '@/app/application'
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import CodeBlock from '@/app/common/code-block/CodeBlock.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import PolicyTypeTag from '@/app/common/PolicyTypeTag.vue'
import type { DataplaneOverview } from '@/app/data-planes/data/'
import type { PolicyTypeCollectionSource } from '@/app/policies/sources'
import RuleMatchers from '@/app/rules/components/RuleMatchers.vue'
import { ResourceRule } from '@/app/rules/data/ResourceRule'
import { sources } from '@/app/rules/sources'

const props = defineProps<{
  data: Record<string, any>
  dataplaneOverview: DataplaneOverview
}>()

const ruleForCluster = (cluster: any, rule: ResourceRule) => {
  return cluster.$resourceMeta.name === rule.resourceMeta.labels['kuma.io/display-name'] &&
  cluster.$resourceMeta.namespace === rule.resourceMeta.labels['k8s.kuma.io/namespace'] &&
  cluster.$resourceMeta.zone === rule.resourceMeta.labels['kuma.io/zone'] &&
  (rule.resourceSectionName === '' || cluster.$resourceMeta.port === rule.resourceSectionName)
}
</script>
<style lang="scss" scoped>
.rules {
  padding-top: $kui-space-60;
}
</style>
