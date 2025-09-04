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
      <XLayout
        type="stack"
      >
        <XTable
          variant="kv"
        >
          <tr>
            <th scope="row">
              Tags
            </th>
            <td>
              <TagList
                :tags="props.data.tags"
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
                {{ t(`http.api.value.${props.data.protocol}`) }}
              </XBadge>
            </td>
          </tr>
          <tr>
            <th scope="row">
              Address
            </th>
            <td>
              <XCopyButton
                :text="`${props.data.addressPort}`"
              />
            </td>
          </tr>
          <tr
            v-if="props.data.serviceAddressPort.length > 0"
          >
            <th scope="row">
              Service address
            </th>
            <td>
              <XCopyButton
                :text="`${props.data.serviceAddressPort}`"
              />
            </td>
          </tr>
          <tr
            v-if="props.data.portName.length > 0"
          >
            <th scope="row">
              Name
            </th>
            <td>
              <XCopyButton
                :text="`${props.data.portName}`"
              />
            </td>
          </tr>
        </XTable>
        <div
          v-if="props.data"
        >
          <h3>Rules</h3>
          <DataSource
            :src="uri(policySources, '/policy-types', {})"
            v-slot="{ data: policyTypesData, error: policyTypesError }"
          >
            <DataSource
              :src="uri(sources, '/meshes/:mesh/rules/for/:dataplane', {
                mesh: route.params.mesh,
                dataplane: route.params.proxy,
              })"
              v-slot="{ data: rulesData, error: rulesError }"
            >
              <DataLoader
                :data="[policyTypesData, rulesData]"
                :errors="[policyTypesError, rulesError]"
              >
                <template
                  v-for="policyTypes in [Object.groupBy((policyTypesData?.policyTypes ?? []), ({ name }) => name)]"
                  :key="`${typeof policyTypes}`"
                >
                  <DataCollection
                    :predicate="(item) => {
                      return (item.ruleType === 'inbound' || (item.ruleType === 'from' && !Boolean(policyTypes[item.type]?.[0]?.policy.isFromAsRules))) && Number(item.inbound!.port) === Number(route.params.connection.split('_')[1])
                    }"
                    :items="[...rulesData!.rules, ...rulesData!.inboundRules]"
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
                                <XTable
                                  variant="kv"
                                >
                                  <template
                                    v-for="item in rules"
                                    :key="item"
                                  >
                                    <tr
                                      v-if="item.matchers.length > 0"
                                    >
                                      <th scope="row">
                                        From
                                      </th>
                                      <td>
                                        <p><RuleMatchers :items="item.matchers" /></p>
                                      </td>
                                    </tr>
                                    <tr
                                      v-if="item.origins.length > 0"
                                    >
                                      <th scope="row">
                                        Origin policies
                                      </th>
                                      <td>
                                        <ul>
                                          <li
                                            v-for="origin in item.origins"
                                            :key="`${origin.mesh}-${origin.name}`"
                                          >
                                            <XAction
                                              v-if="policyTypes[origin.type]"
                                              :to="{
                                                name: 'policy-detail-view',
                                                params: {
                                                  mesh: origin.mesh,
                                                  policyPath: policyTypes[origin.type]![0].path,
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
                                            :code="YAML.stringify(item.raw)"
                                            language="yaml"
                                            :show-copy-button="false"
                                          />
                                        </XLayout>
                                      </td>
                                    </tr>
                                  </template>
                                </XTable>
                              </template>
                            </AccordionItem>
                          </XCard>
                        </template>
                      </AccordionList>
                    </div>
                  </DataCollection>
                </template>
              </DataLoader>
            </DataSource>
          </DataSource>
        </div>
      </XLayout>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { YAML } from '@/app/application'
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
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
