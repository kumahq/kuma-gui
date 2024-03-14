<template>
  <RouteView
    v-slot="{ route, t }"
    name="connection-inbound-summary-overview-view"
    :params="{
      mesh: '',
      dataPlane: '',
      service: '',

    }"
  >
    <AppView>
      <div class="stack">
        <div
          v-if="props.gateway"
          class="stack-with-borders"
        >
          <DefinitionCard layout="horizontal">
            <template #title>
              Tags
            </template>

            <template #body>
              <TagList
                :tags="props.gateway.tags"
                alignment="right"
              />
            </template>
          </DefinitionCard>
        </div>

        <div
          v-else-if="props.inbound"
          class="stack-with-borders"
        >
          <DefinitionCard layout="horizontal">
            <template #title>
              Tags
            </template>

            <template #body>
              <TagList
                :tags="props.inbound.tags"
                alignment="right"
              />
            </template>
          </DefinitionCard>
          <DefinitionCard layout="horizontal">
            <template #title>
              Status
            </template>

            <template #body>
              <KBadge
                :appearance="props.inbound.health.ready ? 'success' : 'danger'"
              >
                {{ props.inbound.health.ready ? 'Healthy' : 'Unhealthy' }}
              </KBadge>
            </template>
          </DefinitionCard>
          <DefinitionCard layout="horizontal">
            <template #title>
              Protocol
            </template>

            <template #body>
              <KBadge
                appearance="info"
              >
                {{ t(`http.api.value.${props.inbound.protocol}`) }}
              </KBadge>
            </template>
          </DefinitionCard>
          <DefinitionCard layout="horizontal">
            <template #title>
              Address
            </template>

            <template #body>
              <TextWithCopyButton
                :text="`${props.inbound.addressPort}`"
              />
            </template>
          </DefinitionCard>
          <DefinitionCard layout="horizontal">
            <template #title>
              Service Address
            </template>

            <template #body>
              <TextWithCopyButton
                :text="`${props.inbound.serviceAddressPort}`"
              />
            </template>
          </DefinitionCard>
        </div>
        <div v-if="props.inbound">
          <h3>Rules</h3>
          <DataLoader
            v-slot="{ data: rulesData }: DataplaneRulesSource"
            :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/rules`"
          >
            <DataCollection
              v-slot="{ items }"
              :predicate="(item) => { return item.ruleType === 'from' && Number(item.inbound!.port) === Number(route.params.service.substring(1))}"
              :items="rulesData!.rules"
            >
              <div class="stack mt-4">
                <template
                  v-for="item in items"
                  :key="item"
                >
                  <KCard>
                    <div
                      class="stack-with-borders mt-4"
                    >
                      <DefinitionCard
                        class="mt-2"
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
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import CodeBlock from '@/app/common/code-block/CodeBlock.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { DataplaneGateway, DataplaneInbound } from '@/app/data-planes/data'
import type { DataplaneRulesSource } from '@/app/data-planes/sources'
import type { PolicyTypeCollectionSource } from '@/app/policies/sources'
import RuleMatchers from '@/app/rules/components/RuleMatchers.vue'
import { toYaml } from '@/utilities/toYaml'

const props = defineProps<{
  inbound?: DataplaneInbound
  gateway?: DataplaneGateway
}>()
</script>
