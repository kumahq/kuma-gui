<template>
  <RouteView
    :params="{
      mesh: '',
      proxy: '',
      connection: '',
    }"
    :name="props.routeName"
    v-slot="{ t, route, uri }"
  >
    <AppView>
      <div
        class="stack-with-borders"
      >
        <DefinitionCard layout="horizontal">
          <template #title>
            Tags
          </template>

          <template #body>
            <TagList
              :tags="props.data.tags"
              alignment="right"
            />
          </template>
        </DefinitionCard>
        <DefinitionCard
          layout="horizontal"
        >
          <template #title>
            {{ t('http.api.property.state') }}
          </template>

          <template #body>
            <XBadge
              :appearance="props.data.state === 'Ready' ? 'success' : 'danger'"
            >
              {{ t(`http.api.value.${props.data.state}`) }}
            </XBadge>
          </template>
        </DefinitionCard>
        <DefinitionCard layout="horizontal">
          <template #title>
            Protocol
          </template>

          <template #body>
            <XBadge
              appearance="info"
            >
              {{ t(`http.api.value.${props.data.protocol}`) }}
            </XBadge>
          </template>
        </DefinitionCard>
        <DefinitionCard layout="horizontal">
          <template #title>
            Address
          </template>

          <template #body>
            <XCopyButton
              :text="`${props.data.addressPort}`"
            />
          </template>
        </DefinitionCard>
        <DefinitionCard
          v-if="props.data.serviceAddressPort.length > 0"
          layout="horizontal"
        >
          <template #title>
            Service Address
          </template>

          <template #body>
            <XCopyButton
              :text="`${props.data.serviceAddressPort}`"
            />
          </template>
        </DefinitionCard>
        <DefinitionCard
          v-if="props.data.portName.length > 0"
          layout="horizontal"
        >
          <template #title>
            Name
          </template>

          <template #body>
            <XCopyButton
              :text="`${props.data.portName}`"
            />
          </template>
        </DefinitionCard>
      </div>
      <div
        v-if="props.data"
        class="mt-6"
      >
        <h3>Rules</h3>
        <DataLoader
          :src="uri(sources, '/meshes/:mesh/rules/for/:dataplane', {
            mesh: route.params.mesh,
            dataplane: route.params.proxy,
          })"
          v-slot="{ data: rulesData }"
        >
          <DataCollection
            :predicate="(item) => { return item.ruleType === 'from' && Number(item.inbound!.port) === Number(route.params.connection.split('_')[1])}"
            :items="rulesData.rules"

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
                  <XCard>
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
                                <DataSource
                                  :src="uri(policySources, '/policy-types', {})"
                                  v-slot="{ data: policyTypesData }"
                                >
                                  <template
                                    v-for="types in [Object.groupBy((policyTypesData?.policyTypes ?? []), (item) => item.name)]"
                                    :key="types"
                                  >
                                    <ul>
                                      <li
                                        v-for="origin in item.origins"
                                        :key="`${origin.mesh}-${origin.name}`"
                                      >
                                        <XAction
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
                                        </XAction>
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
                                  <XCodeBlock
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
                  </XCard>
                </template>
              </AccordionList>
            </div>
          </DataCollection>
        </DataLoader>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { YAML } from '@/app/application'
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import PolicyTypeTag from '@/app/common/PolicyTypeTag.vue'
import TagList from '@/app/common/TagList.vue'
import type { DataplaneInbound } from '@/app/data-planes/data'
import { sources as policySources } from '@/app/policies/sources'
import RuleMatchers from '@/app/rules/components/RuleMatchers.vue'
import { sources } from '@/app/rules/sources'

const props = defineProps<{
  data: DataplaneInbound
  routeName: string
}>()
</script>
