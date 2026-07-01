<template>
  <RouteView
    :params="{
      mesh: '',
      proxy: '',
      connection: '',
    }"
    :name="props.routeName"
    v-slot="{ t, route, uri, r }"
  >
    <AppView>
      <XLayout variant="y-stack">
        <template
          v-for="inbound in [props.dataPlaneOverview.dataplane.networking.inbounds.find((item) => item.port === props.data.port)]"
          :key="typeof inbound"
        >
          <XTable
            v-if="inbound"
            variant="kv"
          >
            <tr v-if="inbound.type.length > 0">
              <th scope="row">
                Type
              </th>
              <td>
                <XBadge
                  appearance="info"
                >
                  {{ inbound.type }}
                </XBadge>
              </td>
            </tr>
            <tr v-if="Object.keys(inbound.tags).length > 0">
              <th scope="row">
                Tags
              </th>
              <td>
                <XLayout
                  variant="separated"
                >
                  <XAction
                    v-for="(value, key) in inbound.tags"
                    :key="key"
                    :href="t(`common.label.href.${key.replaceAll('.', '~')}`, {
                      mesh: '',
                      zone: '',
                      namespace: '',
                      name: value.replaceAll('_', '~'),
                    }, { defaultMessage: '' })"
                  >
                    <XBadge
                      :variant="r('kuma.label').test(key) ? 'reserved-kv' : 'kv'"
                    >
                      {{ key }}:<strong>{{ value }}</strong>
                    </XBadge>
                  </XAction>
                </XLayout>
              </td>
            </tr>
            <tr v-if="inbound.protocol.length > 0">
              <th scope="row">
                Protocol
              </th>
              <td>
                <XBadge
                  data-testid="protocol"
                  appearance="info"
                >
                  {{ t(`http.api.value.${inbound.protocol}`) }}
                </XBadge>
              </td>
            </tr>
            <tr v-if="inbound.addressPort.length > 0">
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
          variant="y-stack"
          size="small"
        >
          <h3>Policies</h3>
          <DataSource
            :src="uri(policySources, '/policy-types', {})"
            v-slot="{ data: sourcePolicyTypes, error: policyTypesError }"
          >
            <DataSource
              :src="uri(policySources, '/meshes/:mesh/dataplanes/:name/policies/for/inbound/:kri', {
                mesh: route.params.mesh,
                name: route.params.proxy,
                kri: props.data.kri,
              })"
              v-slot="{ data: sourcePolicies, error: policiesError }"
            >
              <DataLoader
                :data="[sourcePolicyTypes, sourcePolicies]"
                :errors="[policyTypesError, policiesError]"
                v-slot="{ data: [policyTypesData, policiesData] }"
              >
                <template
                  v-for="policyTypes in [Object.groupBy((policyTypesData.policyTypes), ({ name }) => name)]"
                  :key="`${typeof policyTypes}`"
                >
                  <DataCollection
                    :items="policiesData.policies"
                    v-slot="{ items }"
                  >
                    <AccordionList
                      :initially-open="0"
                      multiple-open
                      class="stack"
                      data-testid="inbound-policies-rules"
                    >
                      <template
                        v-for="({ rules, kind }) in items"
                        :key="kind"
                      >
                        <AccordionItem
                          :card="true"
                        >
                          <template #accordion-header>
                            <span
                              v-icon-start="{name: kind, size: '60', default: 'policy'}"
                            >
                              {{ kind }} ({{ rules!.length }})
                            </span>
                          </template>
                          <template #accordion-content>
                            <XLayout variant="y-stack">
                              <XTable
                                v-for="item in rules"
                                :key="item.kri"
                                variant="kv"
                              >
                                <tr>
                                  <th scope="row">
                                    Policy origin
                                  </th>
                                  <td>
                                    <template
                                      v-for="kri in [Kri.fromString(item.kri)]"
                                      :key="typeof kri"
                                    >
                                      <XAction
                                        v-if="policyTypes[kind] && Kri.isKriString(item.kri)"
                                        :to="{
                                          name: 'policy-detail-view',
                                          params: {
                                            mesh: kri.mesh,
                                            policyPath: policyTypes[kind]![0].path,
                                            kri: item.kri,
                                          },
                                        }"
                                      >
                                        {{ item.kri }}
                                      </XAction>
                                      <template
                                        v-else
                                      >
                                        {{ item.kri }}
                                      </template>
                                    </template>
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2">
                                    <XLayout
                                      variant="y-stack"
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
                              </XTable>
                            </XLayout>
                          </template>
                        </AccordionItem>
                      </template>
                    </AccordionList>
                  </DataCollection>
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
import { Kri } from '@/app/kuma'
import { sources as policySources } from '@/app/policies/sources'

const props = defineProps<{
  data: DataplaneNetworkingLayout['inbounds'][number]
  dataPlaneOverview: DataplaneOverview
  routeName: string
}>()
</script>
