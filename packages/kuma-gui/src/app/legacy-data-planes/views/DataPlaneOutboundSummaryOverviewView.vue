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
      <template
        v-for="service in [route.params.connection.replace(/-([a-f0-9]){16}$/, '')]"
        :key="service"
      >
        <XLayout
          type="stack"
        >
          <XTable
            variant="kv"
          >
            <tr>
              <th scope="row">
                Protocol
              </th>
              <td>
                <XBadge
                  appearance="info"
                >
                  {{ t(`http.api.value.${['grpc', 'http', 'tcp'].find(protocol => typeof props.data[protocol] !== 'undefined')}`) }}
                </XBadge>
              </td>
            </tr>
          </XTable>
          <div
            v-if="props.data"
          >
            <h3>Rules</h3>

            <DataSource
              :src="uri(policySources, '/policy-types', {})"
              v-slot="{ data: policyTypesData }"
            >
              <template
                v-for="types in [Object.groupBy((policyTypesData?.policyTypes ?? []), (item) => item.name)]"
                :key="typeof types"
              >
                <DataLoader
                  :src="uri(sources, `/meshes/:mesh/rules/for/:dataplane`, {
                    mesh: route.params.mesh,
                    dataplane: route.params.proxy,
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
                            <span
                              v-icon-start="{name: key, size: '60', default: 'policy'}"
                            >
                              {{ key }}
                            </span>
                            <XTable
                              variant="kv"
                            >
                              <template
                                v-for="item in rules!.length > 1 ? rules!.filter(item => ruleForCluster(props.data, item)) : rules"
                                :key="item"
                              >
                                <tr
                                  v-if="item.origins.length > 0"
                                >
                                  <th scope="row">
                                    Origin policies
                                  </th>
                                  <td>
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
                            <XCard>
                              <AccordionItem>
                                <template #accordion-header>
                                  <span
                                    v-icon-start="{name: key, size: '60', default: 'policy'}"
                                  >
                                    {{ key }} ({{ rules!.length }})
                                  </span>
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
              </template>
            </DataSource>
          </div>
        </XLayout>
      </template>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { YAML } from '@/app/application'
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import { sources as policySources } from '@/app/policies/sources'
import RuleMatchers from '@/app/rules/components/RuleMatchers.vue'
import { ResourceRule } from '@/app/rules/data/ResourceRule'
import { sources } from '@/app/rules/sources'

const props = defineProps<{
  data: Record<string, any>
  routeName: string
}>()

const ruleForCluster = (cluster: any, rule: ResourceRule) => {
  return cluster.$resourceMeta.name === rule.name &&
  cluster.$resourceMeta.namespace === rule.namespace &&
  cluster.$resourceMeta.zone === rule.zone &&
  (rule.resourceSectionName === '' || cluster.$resourceMeta.port === rule.port)
}
</script>
