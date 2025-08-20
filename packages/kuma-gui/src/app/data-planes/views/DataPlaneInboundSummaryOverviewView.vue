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
      <XLayout type="stack">
        <template
          v-for="inbound in [props.dataPlaneOverview.dataplane.networking.inbounds.find((item) => item.portName === ContextualKri.fromString(route.params.connection).sectionName && item.port === props.data.port)]"
          :key="typeof inbound"
        >
          <div
            v-if="inbound"
            class="stack-with-borders"
          >
            <DefinitionCard layout="horizontal">
              <template #title>
                Tags
              </template>

              <template #body>
                <TagList
                  :tags="inbound.tags"
                  alignment="right"
                />
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
                  {{ t(`http.api.value.${inbound.protocol}`) }}
                </XBadge>
              </template>
            </DefinitionCard>
            <DefinitionCard layout="horizontal">
              <template #title>
                Address
              </template>

              <template #body>
                <XCopyButton
                  :text="`${inbound.addressPort}`"
                />
              </template>
            </DefinitionCard>
            <DefinitionCard
              v-if="inbound.serviceAddressPort.length > 0"
              layout="horizontal"
            >
              <template #title>
                Service address
              </template>

              <template #body>
                <XCopyButton
                  :text="`${inbound.serviceAddressPort}`"
                />
              </template>
            </DefinitionCard>
            <DefinitionCard
              v-if="inbound.portName.length > 0"
              layout="horizontal"
            >
              <template #title>
                Name
              </template>

              <template #body>
                <XCopyButton
                  :text="`${inbound.portName}`"
                />
              </template>
            </DefinitionCard>
          </div>
        </template>
        <XLayout
          v-if="props.data"
          type="stack"
          size="small"
        >
          <h3>Policies</h3>
          <DataSource
            :src="uri(policySources, '/policy-types', {})"
            v-slot="{ data: policyTypesData, error: policyTypesError }"
          >
            <DataSource
              :src="uri(policySources, '/meshes/:mesh/dataplanes/:name/policies/for/inbound/:kri', {
                mesh: route.params.mesh,
                name: route.params.proxy,
                kri: props.data.kri,
              })"
              v-slot="{ data: policiesData, error: policiesError }"
            >
              <DataLoader
                :data="[policyTypesData, policiesData]"
                :errors="[policyTypesError, policiesError]"
              >
                <template
                  v-for="policyTypes in [Object.groupBy((policyTypesData?.policyTypes ?? []), ({ name }) => name)]"
                  :key="`${typeof policyTypes}`"
                >
                  <AccordionList
                    :initially-open="0"
                    multiple-open
                    class="stack"
                    data-testid="inbound-policies-rules"
                  >
                    <template
                      v-for="({ rules, kind, origins }) in policiesData?.policies || []"
                      :key="kind"
                    >
                      <XCard>
                        <AccordionItem>
                          <template #accordion-header>
                            <PolicyTypeTag
                              :policy-type="kind"
                            >
                              {{ kind }} ({{ rules!.length }})
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
                                  v-if="origins.length > 0"
                                  layout="horizontal"
                                >
                                  <template #title>
                                    Origin policies
                                  </template>

                                  <template #body>
                                    <ul>
                                      <li
                                        v-for="origin in origins"
                                        :key="origin.kri"
                                      >
                                        <template
                                          v-for="{ mesh, name } in [Kri.fromString(origin.kri)]"
                                          :key="`${mesh}-${name}`"
                                        >
                                          <XAction
                                            v-if="policyTypes[kind]"
                                            :to="{
                                              name: 'policy-detail-view',
                                              params: {
                                                mesh: mesh,
                                                policyPath: policyTypes[kind]![0].path,
                                                policy: name,
                                              },
                                            }"
                                          >
                                            {{ origin.kri }}
                                          </XAction>
                                          <template
                                            v-else
                                          >
                                            {{ origin.kri }}
                                          </template>
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
                                      <XCodeBlock
                                        :code="YAML.stringify(item.conf)"
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
                </template>
              </DataLoader>
            </DataSource>
          </DataSource>
        </XLayout>
      </XLayout>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { DataplaneNetworkingLayout, DataplaneOverview } from '../data'
import { YAML } from '@/app/application'
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import PolicyTypeTag from '@/app/common/PolicyTypeTag.vue'
import TagList from '@/app/common/TagList.vue'
import { ContextualKri, Kri } from '@/app/kuma/kri'
import { sources as policySources } from '@/app/policies/sources'

const props = defineProps<{
  data: DataplaneNetworkingLayout['inbounds'][number]
  dataPlaneOverview: DataplaneOverview
  routeName: string
}>()
</script>
