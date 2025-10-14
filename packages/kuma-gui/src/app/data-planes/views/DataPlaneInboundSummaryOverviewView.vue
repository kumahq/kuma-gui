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
          v-for="inbound in [props.dataPlaneOverview.dataplane.networking.inbounds.find((item) => item.port === props.data.port)]"
          :key="typeof inbound"
        >
          <XTable
            v-if="inbound"
            variant="kv"
          >
            <tr>
              <th scope="row">
                Tags
              </th>
              <td>
                <TagList
                  :tags="inbound.tags"
                  alignment="right"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">
                Protocol
              </th>
              <td>
                <XBadge
                  appearance="info"
                >
                  {{ t(`http.api.value.${inbound.protocol}`) }}
                </XBadge>
              </td>
            </tr>
            <tr>
              <th scope="row">
                Address
              </th>
              <td>
                <XCopyButton
                  :text="`${inbound.addressPort}`"
                />
              </td>
            </tr>
            <tr
              v-if="inbound.serviceAddressPort.length > 0"
            >
              <th scope="row">
                Service address
              </th>
              <td>
                <XCopyButton
                  :text="`${inbound.serviceAddressPort}`"
                />
              </td>
            </tr>
            <tr
              v-if="inbound.portName.length > 0"
            >
              <th scope="row">
                Name
              </th>
              <td>
                <XCopyButton
                  :text="`${inbound.portName}`"
                />
              </td>
            </tr>
          </XTable>
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
                            <XTable
                              variant="kv"
                            >
                              <template
                                v-for="item in rules"
                                :key="item"
                              >
                                <template
                                  v-if="origins.length > 0"
                                >
                                  <tr>
                                    <th scope="row">
                                      Origin policies
                                    </th>
                                    <td>
                                      <ul>
                                        <li
                                          v-for="origin in origins"
                                          :key="origin.kri"
                                        >
                                          <template
                                            v-for="kri in [Kri.fromString(origin.kri)]"
                                            :key="typeof kri"
                                          >
                                            <XAction
                                              v-if="policyTypes[kind]"
                                              :to="{
                                                name: 'policy-detail-view',
                                                params: {
                                                  mesh: kri.mesh,
                                                  policyPath: policyTypes[kind]![0].path,
                                                  policy: origin.kri,
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
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colspan="2">
                                      <XLayout
                                        type="stack"
                                        size="small"
                                      >
                                        <span>Config</span>
                                        <XCodeBlock
                                          :code="YAML.stringify(item.conf)"
                                          language="yaml"
                                          :show-copy-button="false"
                                        />
                                      </XLayout>
                                    </td>
                                  </tr>
                                </template>
                              </template>
                            </XTable>
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
import PolicyTypeTag from '@/app/common/PolicyTypeTag.vue'
import TagList from '@/app/common/TagList.vue'
import { Kri } from '@/app/kuma'
import { sources as policySources } from '@/app/policies/sources'

const props = defineProps<{
  data: DataplaneNetworkingLayout['inbounds'][number]
  dataPlaneOverview: DataplaneOverview
  routeName: string
}>()
</script>
